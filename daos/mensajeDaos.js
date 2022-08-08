const mongoose = require('mongoose')
const esquemaMsj = require('./modelsMDB/schemaMensajes')
const logger = require('../logs/reqLogger')

class Mensaje {
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

    async save(mensaje) {
        try {
            let tiempo = new Date()
            let tipo = "usuario"
            await this.connectMDB()
            mensaje.time = tiempo.toString()
            mensaje.tipo = tipo
            mensaje.pregunta = null
            console.log(mensaje)
            await esquemaMsj.create(mensaje)
            const id = mensaje._id
            mongoose.disconnect()
            return id
        } catch (error) {
            logger.error(error)
        }
    }

    async saveRes(mensajeR) {
        try {
            let tiempo = new Date()
            let tipo = "sistema"
            await this.connectMDB()
            mensajeR.time = tiempo.toString()
            mensajeR.tipo = tipo
            //console.log(mensajeR)
            await esquemaMsj.create(mensajeR)
            mongoose.disconnect()
            return mensajeR
        } catch (error) {
            console.log(error)
            logger.error(error)
        }
    }

    async getAll() {
        try {
            await this.connectMDB()
            const msj = await esquemaMsj.find({ texto: { $ne: '' } })
            mongoose.disconnect()
            return msj
        } catch (error) {
            logger.error(error)
        }
    }

    async getByEmail(email) {
        try {
            await this.connectMDB()
            const msjId = await esquemaMsj.find({mail: email})
            mongoose.disconnect()
            return msjId
        } catch (error) {
            logger.error(error)
        }
    }
}

module.exports = Mensaje