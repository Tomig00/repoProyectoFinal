const express = require('express')
const routerInfo = express.Router()
const sisInfo = require('../controladores/infoControler')

routerInfo.get('/', sisInfo.getInfo) 


module.exports = routerInfo
