const mongoose = require('mongoose')
const esquemaProd = require('./modelsMDB/schemaProducto')
const logger = require('../../logs/reqLogger')
const { MONGO_URL } = require('../../config')

class Producto {
    async connectMDB() {
        try {
            const URL = MONGO_URL
            let rta = await mongoose.connect(URL, {
                useNewUrlParser: true,
                useUniFiedTopology: true
            })
        } catch (e) {
            logger.error(e)
        }   
    }

    async save(producto) {
        try {
            let tiempo = new Date()
            await this.connectMDB()
            producto.time = tiempo.toString()
            await esquemaProd.create(producto)
            const id = producto.idP
            mongoose.disconnect()
            return id
        } catch (error) {
            logger.error(error)
        }
    }

    async getAll() {
        try {
            await this.connectMDB()
            const prod = await esquemaProd.find({})
            mongoose.disconnect()
            return prod
        } catch (error) {
            logger.error(error)
        }
    }

    async getByCategory(cat) {
        try {
            await this.connectMDB()
            const productosCat = await esquemaProd.find({categoria: cat})
            mongoose.disconnect()
            return productosCat
        } catch (error) {
            console.log(error)
            logger.error(error)
        }
    }

    async getById(id) {
        try {
            await this.connectMDB()
            const prodId = await esquemaProd.find({_id: id})
            mongoose.disconnect()
            return prodId
        } catch (error) {
            throw Error(error.message)
        }
    }

    async getByIdToCart(id) {
        try {
            await this.connectMDB()
            const prodId = await esquemaProd.findById(id)
            mongoose.disconnect()
            return prodId
        } catch (error) {
            logger.error(error)
        }
    }

    async changeById(id, cambio) {
        try {
            await this.connectMDB()
            const nuevo = await esquemaProd.updateOne({idP: id}, {$set: cambio})
            mongoose.disconnect()
            return nuevo
        } catch (error) {
            logger.error(error)
        }
    }

    async deleteById(id) {
        try {
            await this.connectMDB()
            const borrado = await esquemaProd.deleteOne({idP: id})
            mongoose.disconnect()
            return borrado
        } catch (error) {
            logger.error(error)
        }
    }
}

module.exports = Producto