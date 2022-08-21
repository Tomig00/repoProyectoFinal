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
const Ordenes = require('./daos/ordenDaos')
const {PORT, MONGO_URL, SECRET} = require('./config')
const logger = require('./logs/reqLogger')
const cluster = require('cluster')
const script = require('bcrypt')
const {registerUser} = require('./services/userJWT')

const CPUs = require('os').cpus().length

const saltRounds = 10

const routerPrincipal = require('./routers/principalRouter')

const routerChat = require('./routers/chat')
const { json } = require('express')

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
const advancedOptions = { useNewUrlParser: true, useUniFiedTopology: true }


const userDAO = new Usuario()
global.userDB = {} 

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
    mongoUrl: MONGO_URL,
    mongoOptions: advancedOptions,
    ttl: 30
  }),
  secret: SECRET,
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
        const {nombre, telefono, passwordC} = req.body
        console.log('entro signup')
        
        if (password !== passwordC) {
          return done(null, false, { message: 'Las contraseñas no coinciden' })
        }
        //const usuarioDB = new Usuario()
        const carrito = Carrito.getInstance();
        // const oldUser = await userDAO.getByUser(username);

        // if (oldUser) {
        //     throw {
        //     status: 409,
        //     message: "El usuario ya existe.",
        //     };
        // }
        try {
        // const user = await registerUser({username, password, nombre, edad, direccion, telefono, avatar})
          script.hash(password, saltRounds, async function (err, hash) {
            const newCarrito = await carrito.newCarrito({productos: " "}, username, nombre)
            const carro = newCarrito._id
            await userDAO.save({ mail: username, password: hash, nombre: nombre, telefono: telefono, idC: carro})
            
            mail(username, password, nombre, telefono, carro)
        });          
    
          done(null, { mail: username })
          //done(null, userDB)
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
      
      // const user = await registerUser(username, password)
      // if (!user) {  
      //   return done(null, false)
      // } else {
      //   return done(null, user)
      // }
      userDB = await userDAO.getByUser(username)
      
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

app.use('/', routerPrincipal)


/*----------- CHAT -----------*/

const Mensaje = require('./daos/mensajeDaos.js')
const mensaje = new Mensaje()
let mensajes = []


/* Server Listen */
//const PORT = process.env.PORT || 8081
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
    console.log(data)
    await mensaje.save(data)
    mensajes = await mensaje.getAll()

    io.sockets.emit('mensajes', mensajes)
  })

  socket.on('nuevo-res',async (data) => {
    const hola = await mensaje.saveRes(data)
    console.log(hola)
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

