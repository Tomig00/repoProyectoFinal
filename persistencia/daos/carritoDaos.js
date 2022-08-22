const { getApp } = require('firebase-admin/app')
const mongoose = require('mongoose')
const esquemaCart = require('./modelsMDB/schemaCarrito')
const Producto = require('./productoDaos')
const logger = require('../../logs/reqLogger')
const Joi = require('joi')

let instance = null

const Productos = new Producto()

class Carrito {
    
    static getInstance() {

        if (!instance) {
            instance = new Carrito()
        }
        return instance
    }
    
    static validarCarrito (carrito) {
        const schema = {
            productos: Joi.array().items(Joi.object().keys({
                _id: Joi.string().required(),
                cantidad: Joi.number().required()
            }))
        }
        return Joi.validate(carrito, schema)
    }

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
            //console.log(cant + " " + "aca acac")
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
                console.log(producto._id + "   " + productoBD._id)
                if (producto._id == productoBD._id) {
                    console.log("ACA ADENTRO")
                    actualizar = producto
                    return existe = true
                }else {
                    return existe = false
                }
            })
    


            if (existe) {
                console.log("El producto ya esta en el carrito")
                const updateProds = prodInCarro.productos.map(producto => {
                    if (producto === actualizar) {
                        return { ...producto, cantidad: producto.cantidad + parseInt(cant) }
                    }
                    return producto
                })
                console.log("ACA ABAJO")
                console.log(updateProds)

                await esquemaCart.updateOne({_id: cartObjectId}, {$set: {productos: updateProds}})
            }else {
                producto.cantidad = parseInt(cant)
                console.log(producto + "aca aca 2")
                const carrito = await esquemaCart.updateOne({_id: cartObjectId}, { $push: { productos: producto } })
            }
            
            
            mongoose.disconnect()
            //return carrito
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

    async deleteProductoDeCarrito(idCarrito, idProducto) {
        try {
            await this.connectMDB()
            console.log(idCarrito + " " + idProducto)
            let productoBD = await Productos.getByIdToCart(idProducto)
            const cartObjectId = mongoose.Types.ObjectId(idCarrito);
            let existe 
            let actualizar 
            let nuevo
            await this.connectMDB()
            const prodInCarro = await esquemaCart.findById(cartObjectId)
            
            prodInCarro.productos.find(producto => {
                console.log(producto._id + "   " + productoBD._id)
                if (producto._id == productoBD._id) {
                    console.log("ACA ADENTRO")
                    actualizar = producto
                    return existe = true
                }else {
                    return existe = false
                }
            })
    


            if (existe) {
                console.log("El producto ya esta en el carrito")
                const updateProds = prodInCarro.productos
                const nuevo = updateProds.filter(producto => producto._id !== actualizar._id)
                console.log("ACA ABAJO")
                console.log(updateProds)

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

