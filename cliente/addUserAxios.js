const axios = require('axios');

url = "http://localhost:8081/addUser"

const enviarUser = () => {
    axios
        .post(url, { nombre: 'juan', edad: 'axios', direccion: 'axios', telefono: 'axios', avatar: 'axios', username: 'axios', password: 'axios' })
        .then((response) => {
            //ver productos
            console.log(response.data);
        })
        .catch((error) => {
            console.log(error);
        })
}

setInterval(enviarUser, 4000);
enviarUser();

