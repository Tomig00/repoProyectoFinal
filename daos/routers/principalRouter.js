const express = require('express')
const routerPrincipal = express.Router()
const routerProductos = require('./productos')
const routerCarrito = require('./carrito')
const routerLogIn = require('./logIn')
const routerInfo = require('./info')
const routerChat = require('./chat')


/*----------- PRODUCTOS/CARRO -----------*/
routerPrincipal.use('/productos', routerProductos)
routerPrincipal.use('/api/carrito', routerCarrito)

/*----------- LOGIN -----------*/
routerPrincipal.use('/', routerLogIn)

/*----------- INFO -----------*/

routerPrincipal.use('/info', routerInfo)

/*----------- CHAT -----------*/

routerPrincipal.use('/chat', routerChat)





module.exports = routerPrincipal
