const express = require('express')
const routerLogIn = express.Router()

const sisLogin = require('../controladores/loginControler')

const passport = require('passport')




routerLogIn.get('/registrar', sisLogin.registrar)

routerLogIn.get('/login', sisLogin.login)

routerLogIn.post('/login', passport.authenticate('login', {
    successRedirect: '/main',
    failureRedirect: '/login-error'
}))

routerLogIn.post('/register', passport.authenticate('register', {
      successRedirect: '/login',
      failureRedirect: '/registrar-error',
}))

routerLogIn.get('/login-error', sisLogin.loginError)

routerLogIn.get('/registrar-error', sisLogin.registerError)


routerLogIn.get('/main', sisLogin.main)

routerLogIn.get('/logout', sisLogin.logOut)

routerLogIn.get('/', sisLogin.index)


module.exports = routerLogIn
