const mongoose = require('mongoose')

const esquemaOrdenes = new mongoose.Schema({
    items: [{type: Object, require: true}],
    numeroOrden: { type: String, required: true },
    estado: { type: String, required: true },
    email: { type: String, required: true },
    time: {type: String, require: false}
})

module.exports = mongoose.model('ordenes', esquemaOrdenes)