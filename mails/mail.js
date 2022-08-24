const nodemailer = require('nodemailer')
const logger = require('../logs/reqLogger')

const { MAIL } = require('../config')


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'tcoderhouse1@gmail.com',
        pass: 'vmjawrvdunjsahaw'
    }
})  

function mail(dat1, dat2, dat3, dat4, dat5) {
    const mailOptions = {
        from: 'servidor de correo',
        to: MAIL,
        subject: 'Nuevo registro',
        html: `Mail: ${dat1}, Password: ${dat2}, Nombre: ${dat3}, Telefono: ${dat4}, CarroID: ${dat5}`
    }
    async function sendMail() {
    try{
        const info = await transporter.sendMail(mailOptions)
    } catch (error) {
        logger.error(error)
    }
    }
    sendMail()
}

function mailCompra(dat1, dat2, dat3) {
    const mailOptions = {
        from: 'servidor de correo',
        to: MAIL,
        subject: `Nuevo pedido de: ${dat1}, mail: ${dat2}`,
        html: `Productos que copro: ${dat3}`
    }
    async function sendMail() {
    try{
        const info = await transporter.sendMail(mailOptions)
    } catch (error) {
        logger.error(error)
    }
    }
    sendMail()
}



module.exports = { mail, mailCompra }