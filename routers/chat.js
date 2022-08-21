const express = require('express')
const routerChat = express.Router()


const sisChat = require('../controladores/chatControler')





routerChat.get('/', sisChat.getChat);

routerChat.get('/:email', sisChat.getChatEmail);


routerChat.get('/respuestas', sisChat.respuesta);


module.exports = routerChat
