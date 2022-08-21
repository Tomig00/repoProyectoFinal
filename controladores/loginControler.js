
const {productos} = require('../apiProd')

const sisLogin = {
    registrar: (req, res) => {
        res.render('register')
    },
    
    login: (req, res) => {
        //console.log("aca")
          req.logOut(function(err) {
              if (err) { return next(err); }})
          res.render('login')
      },

    loginError: (req, res) => {
        res.render('login-error')
    },

    registerError: (req, res) => {
        res.render('register-error')
    },

    main: (req, res) => {
        //envio de productos a la vista datos.hbs
        productos().then(productos => { 
            //console.log(productos)
            req.isAuthenticated() ? res.render('datos', {prod: productos}) : res.redirect('/login')
        })
        //res.sendFile(path.resolve("public/index.html"))
        //console.log(req.session)
    },

    logOut: (req, res) => {
        req.logOut(function(err) {
            if (err) { return next(err); }})
        res.redirect('/login')
    },

    index: (req, res) => {
        res.redirect('/login')
    },
}

module.exports = sisLogin