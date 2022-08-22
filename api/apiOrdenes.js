const {ordenDaos: Ordenes} = require('../daos/mainDaos')


class apiOrdenes{
    async newOrden(prod, mail){
        return await Ordenes.newOrden(prod, mail)
    }
}

module.exports = apiOrdenes;