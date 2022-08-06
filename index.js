const express = require('express')
const path = require('path')
const fetch = require('node-fetch')
const {Server: HttpServer} = require('http')
const {Server: IOServer} = require('socket.io')
const Handlebars = require('handlebars')
const hbs = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const {mail, mailCompra} = require('./mails/mail')
const {sendWpp, wppComprador} = require('./wpp/wpp')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const Usuario = require('./daos/userDaos')
const Carrito = require('./daos/carritoDaos')
const {productos} = require('./apiProd')
const logger = require('./logs/reqLogger')
const cluster = require('cluster')
const script = require('bcrypt')
const saltRounds = 10

const routerProductos = require('./routers/productos')
const routerCarrito = require('./routers/carrito')
const routerChat = require('./routers/chat')
const { json } = require('express')

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
const advancedOptions = { useNewUrlParser: true, useUniFiedTopology: true }


const usuarioDB = new Usuario()
let userDB

const MODO = process.argv[2] || 'fork'


if (MODO === 'cluster' && cluster.isPrimary)
{
  console.log(`Numero de procesadores: ${CPUs}`)
  console.log(`PID master: ${process.pid}`)

  for (let i = 0; i < CPUs; i++){
    cluster.fork()
  }

  cluster.on('exit', (worker) => {
    console.log('worker', worker.process.pid, 'died', new Date().toLocaleString())
    cluster.fork()
  })
}else 
{

//app.use('/', express.static(path.join(__dirname, 'public')))
app.use(express.static('./public'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())



/*----------- Session -----------*/
app.use(cookieParser('secreto'))
app.use(session({
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://tomasSesiones:asd123@tomi.fuaxu.mongodb.net/sesiones?retryWrites=true&w=majority',
    mongoOptions: advancedOptions,
    ttl: 30
  }),
  secret: 'secreto',
  resave: true,
  saveUninitialized: true
}))

/*----------- Motor de plantillas -----------*/
app.set('views', './src/views')

app.engine(
  '.hbs',
  hbs.engine({
    defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    layoutsDir: './src/views/layouts',
    extname: '.hbs',
  })
)
app.set('view engine', '.hbs')


/*----------- Passport -----------*/

app.use(passport.initialize())
app.use(passport.session())

passport.use(
    'register',
  
    new LocalStrategy(
      { passReqToCallback: true },
      async (req, username, password, done ) => {
        const {nombre, edad, direccion, telefono, avatar} = req.body
        console.log('entro signup')
        
        //const usuarioDB = new Usuario()
        const carrito = Carrito.getInstance();
        try {
          script.hash(password, saltRounds, async function (err, hash) {
            const newCarrito = await carrito.newCarrito({productos: " "})
            const carro = newCarrito._id
            await usuarioDB.save({ mail: username, password: hash, nombre: nombre, edad: edad, direccion: direccion, telefono: telefono, avatar: avatar, idC: carro})
            
            mail(username, password, nombre, edad, direccion, telefono, avatar)
        });          
    
          done(null, { mail: username })
        } catch (error) {
          //loger
          return done(null, false, { message: 'Error al registrar el usuario' })
        }
      }
    )
  )

  passport.use(
    'login',
    new LocalStrategy(async (username, password, done) => { 
      let existe
      
      
      
      userDB = await usuarioDB.getByUser(username)
      
      script.compare(password, userDB?.password??'', function(err, result) {
        existe = result
        if (!existe) {  
          return done(null, false)
        } else {
          return done(null, existe)
        }
     });
      //console.log('ACA USER' + userDB)
    })
  )

passport.serializeUser((user, done) => {
    done(null, user)
})
passport.deserializeUser((user, done) => {
    done(null, user)
})


/*----------- Rutas -----------*/

app.use('/api/productos', routerProductos)
app.use('/api/carrito', routerCarrito)

app.get('/registrar', (req, res) => {
    res.render('register')
})

app.get('/login', (req, res) => {
    req.logOut(function(err) {
        if (err) { return next(err); }})
    res.render('login')
})

app.post('/login', passport.authenticate('login', {
    successRedirect: '/main',
    failureRedirect: '/login-error'
})
)

app.post(
    '/register',
    passport.authenticate('register', {
      successRedirect: '/login',
      failureRedirect: '/registrar-error',
    })
)

app.post ('/addProdToCart', async (req, res) => {
  const {id} = req.body
  //const idC = Handlebars.Utils.isArray(id)
  console.log(id)
  console.log("ACA IDC USER" + userDB.idC)
  carro = userDB.idC
  const carrito = new Carrito()

  await carrito.addProducto(carro, id)
  //await carrito.addProducto(id)
  productos().then(productos => { 
    req.isAuthenticated() ? res.render('datos', {prod: productos}) : res.redirect('/login')
  })
})
      
app.get ('/carrito', async (req, res) => { 
  const carrito = new Carrito()
  carro = userDB.idC
  const productos = await carrito.getProductos(carro)
  req.isAuthenticated() ? res.render('carrito', {prod: productos}) : res.redirect('/login')
})

app.get('/compra', async (req, res) => {
  const carrito = new Carrito()
  carro = userDB.idC
  const productos = await carrito.getProductos(carro)
  const prod = JSON.stringify(productos)
  mailCompra(userDB.nombre, userDB.mail, prod)
  sendWpp(userDB.nombre, userDB.mail, prod)
  wppComprador(userDB.telefono)
  res.redirect('/main')
})

app.get('/login-error', (req, res) => {
    res.render('login-error')
})

app.get('/registrar-error', (req, res) => {
    res.render('registrar-error')
})


app.get('/main', (req, res) => {
    //envio de productos a la vista datos.hbs
    productos().then(productos => { 
        //console.log(productos)
        req.isAuthenticated() ? res.render('datos', {prod: productos}) : res.redirect('/login')
    })
    //res.sendFile(path.resolve("public/index.html"))
    //console.log(req.session)
})

app.get('/logout', (req, res) => {
    req.logOut(function(err) {
        if (err) { return next(err); }})
    res.redirect('/login')
})

app.get('/', (req, res) => {
    res.redirect('/login')
})

// app.use((req, res, next) => {
//   logger.warn(`Ruta: ${req.path} - Método: ${req.method}`),
//   next()
// })

//chat io connecition
const Mensaje = require('./daos/mensajeDaos.js')
const mensaje = new Mensaje()
let mensajes = []

app.get('/chat', (req, res) => {
  res.sendFile(path.resolve("public/index.html"));
})

app.get('/chat/:email', async (req, res) => {
  const email = req.params.email
  // const textos = await mensaje.getByEmail(email)
  // console.log(textos)
  mensaje.getByEmail(email).then(msj => { 
    //console.log(msj + "ACA")
    res.render('chat', {text: msj})
  })
})

app.get('/respuestas', async (req, res) => {
  console.log("aca")
  res.render('res')
})


/* Server Listen */
const PORT = process.env.PORT || 8081
const server = httpServer.listen(PORT , () => console.log(`servidor Levantado ${PORT}`))
server.on('error', (error) => console.log(`Error en servidor ${error}`))
io.listen(httpServer)

io.sockets.on('connection', async (socket) => {
  console.log('se conecto un usuario')

  async function getMsgOnConnection()
  {
    mensajes = await mensaje.getAll()
    return mensajes
  }
    
  messages = await getMsgOnConnection()

  socket.emit('mensajes', messages)
  
  // async function getMsjUser()
  // {
  //   const mensajesU = await mensaje.getByEmail(email)
  //   //console.log(mensajesU)
  //   return mensajesU
  // }

  // messagesU = await getMsjUser()

  // socket.emit('mensajesU', messagesU)

  socket.on('nuevo-msj',async (data) => {
    const newMsj = await mensaje.save(data)

    mensajes = await mensaje.getAll()

    io.sockets.emit('mensajes', mensajes)
  })


  // async function usuario(user)
  // {
  //   return user
  // }

  // userName = await usuario(user)
  // console.log(userName)
  // io.sockets.emit('usuarios', userName)
})
}

