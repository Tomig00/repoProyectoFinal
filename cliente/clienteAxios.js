const axios = require('axios');

let url = "http://localhost:8081/main"

axios(url)
.then((response) => {
    //ver productos
    console.log(response.data);
})
.catch((error) => {
    console.log(error);
})