const { getApp } = require('firebase-admin/app')
const mongoose = require('mongoose')
const esquemaCart = require('./modelsMDB/schemaCarrito')
const Producto = require('./productoDaos')
const logger = require('../../logs/reqLogger')
const { MONGO_URL } = require('../../config')
const { Console } = require('winston/lib/winston/transports')

let instance = null

const Productos = new Producto()

class Carrito {
    
    static getInstance() {

        if (!instance) {
            instance = new Carrito()
        }
        return instance
    }


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

    async newCarrito(dato, mail, direccion) {
        let time = new Date()
        const carro = {dato}
        try {
            await this.connectMDB()
            carro.time = time.toDateString()
            carro.email = mail
            carro.direccion = direccion
            const carrito = await esquemaCart.create(carro)
            mongoose.disconnect()
            return carrito
        } catch (error) {
            console.log(error)
            logger.error(error)
        }
    }

    async addProducto(idC, idP, cant) {
        try {
            if (!cant) {
                cant = 1
            }
            await this.connectMDB()
            let productoBD = await Productos.getByIdToCart(idP)
            const cartObjectId = mongoose.Types.ObjectId(idC);
            let producto = JSON.parse(JSON.stringify(productoBD))
            let existe 
            let actualizar 
            await this.connectMDB()
            const prodInCarro = await esquemaCart.findById(cartObjectId)
            
            prodInCarro.productos.find(producto => {
                if (producto._id == productoBD._id) {
                    actualizar = producto
                    return existe = true
                }else {
                    return existe = false
                }
            })
    


            if (existe) {
                const updateProds = prodInCarro.productos.map(producto => {
                    if (producto === actualizar) {
                        return { ...producto, cantidad: producto.cantidad + parseInt(cant) }
                    }
                    return producto
                })

                await esquemaCart.updateOne({_id: cartObjectId}, {$set: {productos: updateProds}})
            }else {
                producto.cantidad = parseInt(cant)
 
                const carrito = await esquemaCart.updateOne({_id: cartObjectId}, { $push: { productos: producto } })
            }
            
            mongoose.disconnect()
        } catch (error) {
            console.log(error)
            logger.error(error)
        }
    }
    async getProductos(idC) {
        try {
            await this.connectMDB()
            const cartObjectId = mongoose.Types.ObjectId(idC);
            const carrito = await esquemaCart.findById(cartObjectId)
            mongoose.disconnect()
            return carrito.productos
        } catch (error) {
            logger.error(error)
        }
    }

    async deleteProductos(idC) {
        try {
            await this.connectMDB()
            let updateProds = []
            await esquemaCart.updateOne({_id: idC}, {$set: {productos: updateProds}})
            mongoose.disconnect()
        } catch (error) {
            console.log(error)
        }
    }

    async deleteProductoDeCarrito(idCarrito, idProducto) {
        try {
            await this.connectMDB()
            let productoBD = await Productos.getByIdToCart(idProducto)
            const cartObjectId = mongoose.Types.ObjectId(idCarrito);
            let existe 
            let actualizar 
            await this.connectMDB()
            const prodInCarro = await esquemaCart.findById(cartObjectId)
            
            prodInCarro.productos.find(producto => {
                if (producto._id == productoBD._id) {
                    actualizar = producto
                    return existe = true
                }else {
                    return existe = false
                }
            })
    


            if (existe) {
                const updateProds = prodInCarro.productos
                const nuevo = updateProds.filter(producto => producto._id !== actualizar._id)

                await esquemaCart.updateOne({_id: cartObjectId}, {$set: {productos: nuevo}})
            }else {
                console.log("El producto no esta en el carrito")
            }
            
            
            mongoose.disconnect()
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = Carrito

