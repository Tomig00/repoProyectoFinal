const express = require('express')

const routerCarrito = express.Router()
const sisCarrito = require('../controladores/carritoControler')



routerCarrito.post('/', sisCarrito.newCarrito);

routerCarrito.get('/id/:id', sisCarrito.viewCartId);

routerCarrito.post('/productos', sisCarrito.addToCarrito);

routerCarrito.post('/eliminarProducto', sisCarrito.deleteProdCart);

routerCarrito.post ('/addProdToCart', sisCarrito.addProdCart); 

routerCarrito.get ('/viewCart', sisCarrito.viewCart); 

routerCarrito.get('/compra', sisCarrito.buy); 

module.exports = routerCarrito


