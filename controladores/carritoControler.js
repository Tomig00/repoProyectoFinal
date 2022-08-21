
const {carritoDaos: Carrito} = require('../daos/mainDaos')
const Carro = new Carrito()
const {productos} = require('../apiProd')

const Ordenes = require('../daos/ordenDaos')

const sisCarrito = {
    newCarrito: async (req, res) => {
        try {
            const carrito = await Carro.newCarrito()
            res.status(200).send({
                status: 200,
                data: {
                    carrito,
                },
                message:'carrito agregado'
                })
        } catch (error) {
            res.status(500).send({
                status: 500,
                message: error.message
            })
        }
    },
    
    deleteCarrito: async (req, res) => {
        const num = req.params.id
        try {
            const borrado = await Carro.deleteCarritoById(num)
            res.status(200).send({
                status: 200,
                data: {
                    borrado,
                },
                message:'carrito borrado'
                })
        } catch (error) {
            res.status(500).send({
                status: 500,
                message: error.message
            })
        }
    },

    addToCarrito: async (req, res) => {
        
        try {
                let idCarrito = req.body.idCart
                let idProducto = req.body.idP
                const agregado = await Carro.agregarProducto(idCarrito, idProducto)
                res.status(200).send({
                    status: 200,
                    data: {
                        agregado,
                    },
                    message:'producto agregado a carrito'
                    })
            } catch (error) {
                res.status(500).send({
                    status: 500,
                    message: error.message
                })
            }          
    },

    deleteProdCart: async (req, res) =>{
        const idCart = req.params.idC
        try {
            let idCarrito = req.body.idCart
            let idProducto = req.body.idP
            let idEnCarrito = idCart
            const agregado = await Carro.deleteProductoDeCarrito(idCarrito, idProducto, idEnCarrito)
            res.status(200).send({
                status: 200,
                data: {
                    agregado,
                },
                message:'producto eliminado del carrito'
                })
        } catch (error) {
            res.status(500).send({
                status: 500,
                message: error.message
            })
        }    
    },

    addProdCart: async (req, res) => {
        const {id, cant} = req.body
        //const idC = Handlebars.Utils.isArray(id)
        // console.log(id + "esto")
        // console.log(cant + "esto2")
        // console.log("ACA IDC USER" + global.userDB.idC)
        const carro = global.userDB.idC
        const carrito = new Carrito()
      
        await carrito.addProducto(carro, id, cant)
        //await carrito.addProducto(id)
        productos().then(productos => { 
          req.isAuthenticated() ? res.render('datos', {prod: productos}) : res.redirect('/login')
        })
    },

    viewCart: async (req, res) => { 
        const carrito = new Carrito()
        const carro = global.userDB.idC
        const productos = await carrito.getProductos(carro)
        req.isAuthenticated() ? res.render('carrito', {prod: productos}) : res.redirect('/login')
    },
    
    buy: async (req, res) => {
        const carrito = new Carrito()
        const orden = new Ordenes()
        const carro = global.userDB.idC
        const productos = await carrito.getProductos(carro)
        const prod = JSON.stringify(productos)
        await orden.newOrden(prod, global.userDB.mail)
        mailCompra(global.userDB.nombre, global.userDB.mail, prod)
        sendWpp(global.userDB.nombre, global.userDB.mail, prod)
        wppComprador(global.userDB.telefono)
        res.redirect('/main')
    },
}

module.exports = sisCarrito