const express = require('express')
const routerPrincipal = express.Router()
const routerProductos = require('./productos')
const routerCarrito = require('./carrito')


const passport = require('passport')




routerPrincipal.use('/productos', routerProductos)
routerPrincipal.use('/api/carrito', routerCarrito)


/*----------- LOGIN -----------*/

routerPrincipal.get('/registrar', (req, res) => {
    res.render('register')
})

routerPrincipal.get('/login', (req, res) => {
  //console.log("aca")
    req.logOut(function(err) {
        if (err) { return next(err); }})
    res.render('login')
})

routerPrincipal.post('/login', passport.authenticate('login', {
    successRedirect: '/main',
    failureRedirect: '/login-error'
})
)

routerPrincipal.post(
    '/register',
    passport.authenticate('register', {
      successRedirect: '/login',
      failureRedirect: '/registrar-error',
    })
)

routerPrincipal.get('/login-error', (req, res) => {
  res.render('login-error')
})

routerPrincipal.get('/registrar-error', (req, res) => {
  res.render('register-error')
})


routerPrincipal.get('/main', (req, res) => {
  //envio de productos a la vista datos.hbs
  productos().then(productos => { 
      //console.log(productos)
      req.isAuthenticated() ? res.render('datos', {prod: productos}) : res.redirect('/login')
  })
  //res.sendFile(path.resolve("public/index.html"))
  //console.log(req.session)
})

routerPrincipal.get('/logout', (req, res) => {
  req.logOut(function(err) {
      if (err) { return next(err); }})
  res.redirect('/login')
})

routerPrincipal.get('/', (req, res) => {
  res.redirect('/login')
})


/*----------- CARRITO -----------*/

routerPrincipal.post ('/addProdToCart', async (req, res) => {
  const {id, cant} = req.body
  //const idC = Handlebars.Utils.isArray(id)
  // console.log(id + "esto")
  // console.log(cant + "esto2")
  // console.log("ACA IDC USER" + userDB.idC)
  carro = userDB.idC
  const carrito = new Carrito()

  await carrito.addProducto(carro, id, cant)
  //await carrito.addProducto(id)
  productos().then(productos => { 
    req.isAuthenticated() ? res.render('datos', {prod: productos}) : res.redirect('/login')
  })
})
      
routerPrincipal.get ('/carrito', async (req, res) => { 
  const carrito = new Carrito()
  carro = userDB.idC
  const productos = await carrito.getProductos(carro)
  req.isAuthenticated() ? res.render('carrito', {prod: productos}) : res.redirect('/login')
})

routerPrincipal.get('/compra', async (req, res) => {
  const carrito = new Carrito()
  const orden = new Ordenes()
  carro = userDB.idC
  const productos = await carrito.getProductos(carro)
  const prod = JSON.stringify(productos)
  await orden.newOrden(prod, userDB.mail)
  mailCompra(userDB.nombre, userDB.mail, prod)
  sendWpp(userDB.nombre, userDB.mail, prod)
  wppComprador(userDB.telefono)
  res.redirect('/main')
})


// routerPrincipal.use((req, res, next) => {
//   logger.warn(`Ruta: ${req.path} - Método: ${req.method}`),
//   next()
// })

/*----------- INFO -----------*/

routerPrincipal.get('/info', (req, res) => {
  const { argv, execPath, platform, version, pid, memoryUsage, cwd } = process;
  const { rss } = memoryUsage();
  res.render("info", {
    layout: "main",
    argv,
    execPath,
    platform,
    version,
    pid,
    rss,
    CPUs,
    currentDir: cwd(),
  });
})


module.exports = routerPrincipal
