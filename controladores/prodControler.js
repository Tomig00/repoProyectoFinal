
const apiProducto = require('../api/apiProductos')

const sisProd = {
    categoria: async (req, res) => {   
        const cat = req.params.categoria
        const prod = new apiProducto()
    
        try {
            const producto = await prod.getByCategory(cat)

            if (producto.length == 0 ) {
                return res.status(404).render('prodNotFound')
            }

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
        const prod = new apiProducto()
    
        try {
            const producto = await prod.getById(id)
            res.status(200).render('prodFound', { prod: producto})
        } catch (error) {
            res.status(500).render('prodNotFound')
        }
    },

    addProd: async (req, res) => { 
        try {
            const prod = new apiProducto()
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
            const prod = new apiProducto()
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
            const prod = new apiProducto()
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