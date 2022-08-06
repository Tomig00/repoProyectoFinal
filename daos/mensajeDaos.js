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
            await this.connectMDB()
            mensaje.time = tiempo.toString()
            await esquemaMsj.create(mensaje)
            const id = mensaje._id
            mongoose.disconnect()
            return id
        } catch (error) {
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