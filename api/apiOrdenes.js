const {ordenDaos: Ordenes} = require('../persistencia/daos/mainDaos')
const Orden = new Ordenes()

class apiOrdenes{
    async newOrden(prod, mail){
        return await Orden.newOrden(prod, mail)
    }
}

module.exports = apiOrdenes;