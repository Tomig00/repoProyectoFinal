const express = require('express')
const routerChat = express.Router()
const path = require('path')
let email

routerChat.get('/', async function(req, res){
    try {
        res.sendFile(path.resolve("public/index.html"));
    } catch (error) {
        res.status(500).send({
            status: 500,
            message: error.message
        })
    }
}
);

routerChat.get('/:email', async function(req, res){
    try {
        email = req.params.email
        console.log(email)
        res.sendFile(path.resolve("public/index.html"));
    } catch (error) {
        res.status(500).send({
            status: 500,
            message: error.message
        })
    }
}
);


module.exports = routerChat
