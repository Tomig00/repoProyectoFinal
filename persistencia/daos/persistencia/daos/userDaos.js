const mongoose = require('mongoose')
const esquemaUser = require('./modelsMDB/schemaUser')
const logger = require('../../logs/reqLogger')
const { MONGO_URL } = require('../../config')

class Usuario {
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

    async getAll(id) {
        const filter = id ? { id } : {};
        try {
          await this.connectMDB();
          const userDb = await esquemaUser.find(filter);
          mongoose.disconnect();
          return userDb;
        } catch (error) {
            logger.error(error)
        }
      }
      

      async getByUser(user) {
        try {
            await this.connectMDB()
            const usuario = await esquemaUser.findOne({ 'mail': user });
            mongoose.disconnect()
            return usuario
        } catch (error) {
            logger.error(error)
        }
    }

      async save(user) {
        try {
            await this.connectMDB()
            const u = await esquemaUser.create(user)
            mongoose.disconnect()
        } catch (error) {
            logger.error(error)
        }
    }

}

module.exports = Usuario