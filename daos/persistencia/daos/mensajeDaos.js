const mongoose = require('mongoose')
const esquemaMsj = require('./modelsMDB/schemaMensajes')
const logger = require('../../logs/reqLogger')
const { MONGO_URL } = require('../../config')

class Mensaje {
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

    async save(mensaje) {
        if (mongoose.connection.readyState === 0) {
            await this.connectMDB()
        }
        try {
            let tiempo = new Date()
            let tipo = "usuario"
            mensaje.time = tiempo.toString()
            mensaje.tipo = tipo
            mensaje.pregunta = null
            await esquemaMsj.create(mensaje)
            const id = mensaje._id
            return id
        } catch (error) {
            logger.error(error)
        }
    }

    async saveRes(mensajeR) {
        
        if (mongoose.connection.readyState === 0) {
            await this.connectMDB()
        }
        try {
            let tiempo = new Date()
            let tipo = "sistema"
            mensajeR.time = tiempo.toString()
            mensajeR.tipo = tipo
            await esquemaMsj.create(mensajeR)
            return mensajeR
        } catch (error) {
            console.log(error)
            logger.error(error)
        }
    }

    async getAll() {
        if (mongoose.connection.readyState === 0) {
            await this.connectMDB()
        }
        try {
            const msj = await esquemaMsj.find({ texto: { $ne: '' } })
            return msj
        } catch (error) {
            logger.error(error)
        }
    }

    async getByEmail(email) {
        if (mongoose.connection.readyState === 0) {
            await this.connectMDB()
        }
        try {
            const msjId = await esquemaMsj.find({mail: email})
            return msjId
        } catch (error) {
            logger.error(error)
        }
    }
}

module.exports = Mensaje