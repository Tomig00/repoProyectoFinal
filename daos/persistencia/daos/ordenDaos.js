const { getApp } = require('firebase-admin/app')
const mongoose = require('mongoose')
const esquemaOrden = require('./modelsMDB/schemaOrden')
const Producto = require('./productoDaos')
const logger = require('../../logs/reqLogger')
const { MONGO_URL } = require('../../config')

let instance = null


class Ordenes {
    
    static getInstance() {

        if (!instance) {
            instance = new Carrito()
        }
        return instance
    }
    
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

    async newOrden(dato, mail) {
        let time = new Date()
        const orden = {dato}
        const cantOrdenes = await this.getCantOrdenes()
        try {
            await this.connectMDB()
            orden.time = time.toDateString()
            orden.email = mail
            orden.estado = "generada"
            orden.numeroOrden = cantOrdenes + 1
            console.log(orden)
            const ordenesNew = await esquemaOrden.create(orden)
            mongoose.disconnect()
            return orden
        } catch (error) {
            console.log(error)
            logger.error(error)
        }
    }

    async getCantOrdenes() {
        try {
            await this.connectMDB()
            const cantOrdenes = await esquemaOrden.countDocuments()
            mongoose.disconnect()
            return cantOrdenes
        } catch (error) {
            console.log(error)
            logger.error(error)
        }
    }
}

module.exports = Ordenes