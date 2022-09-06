const {carritoDaos: Carrito} = require('../persistencia/daos/mainDaos')
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

    async deleteProd(idC){
        return await Carro.deleteProductos(idC)
    }

    async deleteProductoDeCarrito(idCarrito, idProducto){
        return await Carro.deleteProductoDeCarrito(idCarrito, idProducto)
    }
}

module.exports = apiCarrito;