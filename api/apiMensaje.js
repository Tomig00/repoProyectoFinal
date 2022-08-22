// const { mensajeDaos: Mensaje } = requiere('../daos/mainDaos')
// const Mensaje = new Mensaje()

const Mensaje = require('../persistencia/daos/mensajeDaos.js')
class apiMensaje {
    async getByEmail(email) {
        return await Mensaje.getByEmail(email)
    }
}

module.exports = apiMensaje;