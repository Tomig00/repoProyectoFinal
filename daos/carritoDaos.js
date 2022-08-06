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

    async newCarrito(dato) {
        try {
            await this.connectMDB()
            const carrito = await esquemaCart.create(dato)
            mongoose.disconnect()
            return carrito
        } catch (error) {
            logger.error(error)
        }
    }

    async addProducto(idC, idP) {
        try {
            await this.connectMDB()
            let productoBD = await Productos.getById(idP)
            const cartObjectId = mongoose.Types.ObjectId(idC);

            await this.connectMDB()
            const carrito = await esquemaCart.updateOne({_id: cartObjectId}, { $push: { productos: productoBD } })
            
            mongoose.disconnect()
            //return carrito
        } catch (error) {
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

