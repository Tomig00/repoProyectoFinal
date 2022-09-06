const mongoose = require('mongoose')

const esquemaCarrito = new mongoose.Schema({
    email: { type: String, required: true },
    productos: [{type: Object, require: false}],
    direccion: { type: String, required: true },
    time: {type: String, require: false}
})

module.exports = mongoose.model('carrito', esquemaCarrito)