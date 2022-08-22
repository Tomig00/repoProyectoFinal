const {carritoDaos: Carrito} = require('../daos/mainDaos')
const Carro = new Carrito()


class apiCarrito {
    async newCarrito() {
        return await Carro.newCarrito()
    }

    async deleteCarritoById(id) {
        return await Carro.deleteCarritoById(id)
    }

    async agregarProducto(idC, idP, cant) {
        return await Carro.agregarProducto(idC, idP, cant)
    }

    async addProducto(idC, idP, cant) {
        return await Carro.addProducto(idC, idP, cant)
    }

    async getProductos(carro){
        return await Carro.getProductos(carro)
    }
}

module.exports = apiCarrito;