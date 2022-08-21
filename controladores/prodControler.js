
const {productosDaos: Producto} = require('../daos/productoDaos')

const sisProd = {
    categoria: async (req, res) => {   
        const cat = req.params.categoria
        const prod = new Producto()
    
        try {
            const producto = await prod.getByCategory(cat)
            //res.status(200).render('prodFound', { prod: producto})
            req.isAuthenticated() ? res.render('prodFound', {prod: producto}) : res.redirect('/login')
        } catch (error) {
            res.status(500).send({
                status: 500,
                message: error.message
            })
        }
    },
    
    id: async (req, res) => {   
        const id = req.params.id
        const prod = new Producto()
    
        try {
            const producto = await prod.getById(id)
            res.status(200).render('prodFound', { prod: producto})
        } catch (error) {
            res.status(500).render('prodNotFound')
        }
    },

    addProd: async (req, res) => { 
        try {
            const prod = new Producto()
            const id = await prod.save(req.body)
            res.status(200).send({
                status: 200,
                data: {
                    id,
                },
                message:'producto agregado'
                })
        } catch (error) {
            res.status(500).send({
                status: 500,
                message: error.message
            })
        } 
    },

    update: async (req, res) => { 
        const num = req.params.id
        try {
            let idProd = parseInt(num)
            const prod = new Producto()
            const cambio = req.body
            const cambiado = await prod.changeById(idProd, cambio)
            res.status(200).send({
                status: 200,
                data: { 
                    cambiado,
                },
                message:'producto actualizado'
                })
        } catch (error) {
            res.status(500).send({
                status: 500,
                message: error.message
            })
        }
    },

    delete: async (req, res) => { 
        const num = req.params.id
        try {
            let idProd = parseInt(num)
            const prod = new Producto()
            const borrar = await prod.deleteById(idProd)
            res.status(200).send({
                status: 200,
                data: { 
                    borrar,
                },
                message:'producto eliminado'
                })
        } catch (error) {
            res.status(500).send({
                status: 500,
                message: error.message
            })
        }   
    },
}

module.exports = sisProd




// const Handlebars = require('handlebars')
// const hbs = require('express-handlebars')
// const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
// const app = express()

// app.set('views', './src/views')

// app.engine(
//   '.hbs',
//   hbs.engine({
//     defaultLayout: 'main',
//     handlebars: allowInsecurePrototypeAccess(Handlebars),
//     layoutsDir: './src/views/layouts',
//     extname: '.hbs',
//   })
// )
// app.set('view engine', '.hbs')