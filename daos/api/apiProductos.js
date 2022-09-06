const {productosDaos: Producto} = require('../persistencia/daos/mainDaos')
const prod = new Producto()

class apiProducto {
    async getByCategory(cat) {
        return await prod.getByCategory(cat)
    }

    async getById(id) {
        return await prod.getById(id)
    }

    async save(body) {
        return await prod.save(body)
    }

    async changeById(id, body) {
        return await prod.changeById(id, body)
    }

    async deleteById(id) {
        return await prod.deleteById(id)
    }
}

module.exports = apiProducto