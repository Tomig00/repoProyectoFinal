const express = require('express')

const routerProductos = express.Router()

const sisProd = require('../controladores/prodControler')



routerProductos.get('/:categoria', sisProd.categoria)

routerProductos.get('/id/:id', sisProd.id)



routerProductos.post('/', sisProd.addProd);


routerProductos.put('/:id', sisProd.update);


routerProductos.delete('/:id', sisProd.delete);

module.exports = routerProductos


