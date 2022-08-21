const express = require('express')

const routerCarrito = express.Router()
const sisCarrito = require('../controladores/carritoControler')



routerCarrito.post('/', sisCarrito.newCarrito);

routerCarrito.delete('/carrito/:id', sisCarrito.deleteCarrito);

routerCarrito.post('/productos', sisCarrito.addToCarrito);

routerCarrito.delete('/eliminarProducto/:idC', sisCarrito.deleteProdCart);

routerCarrito.post ('/addProdToCart', sisCarrito.addProdCart); 

routerCarrito.get ('/viewCart', sisCarrito.viewCart); 

routerCarrito.get('/compra', sisCarrito.buy); 

module.exports = routerCarrito


