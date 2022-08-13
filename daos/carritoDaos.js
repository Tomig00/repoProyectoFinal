const { getApp } = require('firebase-admin/app')
const mongoose = require('mongoose')
const esquemaCart = require('./modelsMDB/schemaCarrito')
const Producto = require('./productoDaos')
const logger = require('../logs/reqLogger')

let instance = null

const Productos = new Producto()

class Carrito {
    
    static getInstance() {

        if (!instance) {
            instance = new Carrito()
        }
        return instance
    }
    
    async connectMDB() {
        try {
            const URL = "mongodb+srv://tomasSesiones:asd123@tomi.fuaxu.mongodb.net/sesiones?retryWrites=true&w=majority"
            let rta = await mongoose.connect(URL, {
                useNewUrlParser: true,
                useUniFiedTopology: true
            })
        } catch (e) {
            logger.error(e)
        }   
    }

    async newCarrito(dato, mail, direccion) {
        let time = new Date()
        const carro = {dato}
        try {
            await this.connectMDB()
            carro.time = time.toDateString()
            carro.email = mail
            carro.direccion = direccion
            const carrito = await esquemaCart.create(carro)
            mongoose.disconnect()
            return carrito
        } catch (error) {
            console.log(error)
            logger.error(error)
        }
    }

    async addProducto(idC, idP) {
        try {
            await this.connectMDB()
            let productoBD = await Productos.getById(idP)
            const cartObjectId = mongoose.Types.ObjectId(idC);
            let producto = JSON.parse(JSON.stringify(productoBD))
            let existe 
            let actualizar 
            await this.connectMDB()
            const prodInCarro = await esquemaCart.findById(cartObjectId)
            //console.log(prodInCarro.productos)
            prodInCarro.productos.find(producto => {
                console.log(producto._id + "   " + productoBD._id)
                if (producto._id == productoBD._id) {
                    console.log("ACA ADENTRO")
                    actualizar = producto
                    return existe = true
                }else {
                    return existe = false
                }
            })


            if (existe) {
                console.log("El producto ya esta en el carrito")
                producto.cantidad = actualizar.cantidad + 1
                console.log(producto)
                await esquemaCart.updateOne({_id: cartObjectId}, {$set: {productos: producto}})
            }else {
                producto.cantidad = 1
                console.log(producto)
                const carrito = await esquemaCart.updateOne({_id: cartObjectId}, { $push: { productos: producto } })
            }
            
            
            mongoose.disconnect()
            //return carrito
        } catch (error) {
            console.log(error)
            logger.error(error)
        }
    }
    async getProductos(idC) {
        try {
            await this.connectMDB()
            const cartObjectId = mongoose.Types.ObjectId(idC);
            const carrito = await esquemaCart.findById(cartObjectId)
            mongoose.disconnect()
            return carrito.productos
        } catch (error) {
            logger.error(error)
        }
    }
}

module.exports = Carrito

