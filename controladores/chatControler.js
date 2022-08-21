const passport = require('passport')
const logger = require('../logs/reqLogger')

const Mensaje = require('../daos/mensajeDaos.js')
const mensaje = new Mensaje()
const path = require('path')

const sisChat = {
    getChat: (req, res) => {
        try {
            res.sendFile(path.resolve("public/chat.html"));
        } catch (error) {
            res.status(500).send({
                status: 500,
                message: error.message
            })
        }
    },
    
    getChatEmail: (req, res) => {
        try {
            const email = req.params.email
            mensaje.getByEmail(email).then(msj => { 
                res.render('chat', {text: msj})
            })
        } catch (error) {
            res.status(500).send({
                status: 500,
                message: error.message
            })
        }
    },

    respuesta: (req, res) =>{
        try {
            res.render('res')
        } catch (error) {
            res.status(500).send({
                status: 500,
                message: error.message
            })
        }
    },

}

module.exports = sisChat