
const Mensaje = require('../persistencia/daos/mensajeDaos.js')
class apiMensaje {
    async getByEmail(email) {
        return await Mensaje.getByEmail(email)
    }
}

module.exports = apiMensaje;