const mongoose = require('mongoose')

const esquemaMensajes = new mongoose.Schema({
    //_id: {type: String},
    mail: {type: String, require: true},
    texto: {type: String, require: true},
    tipo: {type: String, require: true},
    pregunta: {type: String, require: true},
    time: {type: String, require: false}
})

module.exports = mongoose.model('mensajes', esquemaMensajes)