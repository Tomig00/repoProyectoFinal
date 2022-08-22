const jwt = require('jsonwebtoken');
const Usuario = require('../persistencia/daos/userDaos')
const Carrito = require('../persistencia/daos/carritoDaos')
const script = require('bcrypt')
const {mail} = require('../mails//mail')

const saltRounds = 10

const userDAO = new Usuario()
const PRIVATE_KEY = 'privateKey'

const registerUser = async (user) => {
    console.log("ACA ACA")
    const {username, password, nombre, edad, direccion, telefono, avatar } = user

    // const oldUser = await userDAO.getByUser(username);

    // if (oldUser) {
    //     throw {
    //     status: 409,
    //     message: "El usuario ya existe.",
    //     };
    // }

    // if (!username || !password) {
    //     throw {
    //     status: 400,
    //     message: "Ingresar mail y contraseña.",
    //     };
    // }

    const token = jwt.sign({ data: username }, PRIVATE_KEY, {
        expiresIn: "600s",
    });
    const carrito = Carrito.getInstance();
    script.hash(password, saltRounds, async function (err, hash) {
        const newCarrito = await carrito.newCarrito({productos: " "})
        const carro = newCarrito._id
        await userDAO.save({ mail: username, password: hash, nombre: nombre, edad: edad, direccion: direccion, telefono: telefono, avatar: avatar, idC: carro})
        
        mail(username, password, nombre, edad, direccion, telefono, avatar)
    });  
    
    user.token = token;

    return user;
}


const loginUser = async (user, password) => {
    const userDB = await userDAO.getByUser(user);
    if (!userDB) throw { status: 404, message: "El usuario no existe" };

    const correctPass = await bcrypt.compare(password, user.password);

    if (correctPass) {
        const token = jwt.sign({ id: userDB._id, mail: userDB.mail }, PRIVATE_KEY, {
        expiresIn: "600s",
        });
        user.token = token;
        return user;
    }
}

module.exports = { registerUser, loginUser };