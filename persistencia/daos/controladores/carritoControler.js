
const {productos} = require('../apiProd')
const apiOrdenes = require('../api/apiOrdenes')
const apiCarrito = require('../api/apiCarrito')
const {mailCompra} = require('../mails/mail')
const { error } = require('../logs/reqLogger')

const Carro = new apiCarrito()


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
        try {
            const carrito = new apiCarrito()
            let idCarrito = global.userDB.idC
            let idProducto = req.body.id
            await carrito.deleteProductoDeCarrito(idCarrito, idProducto)

            const productos = await carrito.getProductos(idCarrito)
            res.render('carritoFound', {prod: productos})
        } catch (error) {
            console.log(error)
            res.status(500).send({
                status: 500,
                message: error.message
            })
        }    
    },

    addProdCart: async (req, res) => {
        const {id, cant} = req.body
        const carro = global.userDB.idC
        const carrito = new apiCarrito()
      
        await carrito.addProducto(carro, id, cant)

        productos().then(productos => { 
          req.isAuthenticated() ? res.render('datos', {prod: productos}) : res.redirect('/login')
        })
    },

    viewCart: async (req, res) => { 
        try{
            const carrito = new apiCarrito()
            const carro = global.userDB.idC
            const productos = await carrito.getProductos(carro)
            req.isAuthenticated() ? res.render('carrito', {prod: productos}) : res.redirect('/login')
        }catch(error){
            res.status(500).render('carritoNotFound')
        }  
    },

    viewCartId: async (req, res) => {

        const carrito = new apiCarrito()
        const carro = req.params.id
        const productos = await carrito.getProductos(carro)
        if (!productos) {
            return res.status(404).render('carritoNotFound')
        }
        req.isAuthenticated() ? res.render('carritoFound', {prod: productos}) : res.redirect('/login')

    },
    
    buy: async (req, res) => {
        const carrito = new apiCarrito()
        const orden = new apiOrdenes()
        const carro = global.userDB.idC
        const productos = await carrito.getProductos(carro)
        const prod = JSON.stringify(productos)
        const ordenR = await orden.newOrden(prod, global.userDB.mail)
        mailCompra(global.userDB.nombre, global.userDB.mail, prod)
        await carrito.deleteProd(carro)
        res.render("orden", 
        {layout: "main",
        numeroOrden:  ordenR.numeroOrden,
        time: ordenR.time,
        email: ordenR.email,
        dato: ordenR.dato,
        }
        )
    },
}

module.exports = sisCarrito