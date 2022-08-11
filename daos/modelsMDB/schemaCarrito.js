const mongoose = require('mongoose')

const esquemaCarrito = new mongoose.Schema({
    email: { type: String, required: true },
    productos: [{type: Object, require: false}],
    time: {type: String, require: false}
})

module.exports = mongoose.model('carrito', esquemaCarrito)