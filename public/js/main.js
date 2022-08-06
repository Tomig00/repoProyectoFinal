
const socket = io.connect();


socket.on('mensajes', mensajes => {
    render(mensajes)
})

socket.on('mensajesU', mensajesU => {
    renderChatUser(mensajesU)
})

socket.on('usuarios', userName => {
    renderUser(userName)
})

socket.on('productos', prod => {
    crearTabla(prod).then(tabla => {document.getElementById('tablaProducto').innerHTML = tabla})
})


socket.on('prod', function (data) {
    crearTabla(data).then(tabla => {document.getElementById('tablaProducto').innerHTML = tabla})
})


function crearTabla (prod){
    
    return fetch("views/datos.hbs").then(respuesta => {return respuesta.text()}).then(plantilla => {
        
        const template = Handlebars.compile(plantilla)
        const html = template({prod})
        return html
    })

}


function render(data) {
    
    const html = data
        .map((elem, index) => {
            return `<div align = "left">
            <p>
            <strong style='color: blue'>${elem.mail}</strong> 
            <span style='color: brown'>${elem.time}</span>: 
            <span>${elem.texto}</span>
            <div class='form-group'><input id='object' name='object' class='form-control' type='hidden' value="${elem.mail}" required /> </div>
            <span><button onclick = "return response(object)">
            Responder
          </button> </span>
            </p>
            </div>`
        })
        .join(' ')
        document.getElementById('msj').innerHTML = html
}

function renderChatUser(data) {
    
    const html = data
        .map((elem, index) => {
            return `<div align = "left">
            <p><strong style='color: blue'>${elem.mail}</strong> <span style='color: brown'>${elem.time}</span>: <span>${elem.texto}</span></p></div>`
        })
        .join(' ')
        document.getElementById('msjUser').innerHTML = html
}

function renderUser(data) {
    
    const html = data
        .map((elem, index) => {
            return `<div align = "left">
            <p><strong style='color: blue'>Bienvenido ${elem.user}</strong></p></div>`
        })
        .join(' ')
        document.getElementById('usuario').innerHTML = html
}





function addMessage(e) {
    const tiempo = new Date()
    const mensaje = {
        mail: document.getElementById('mail').value,
        texto: document.getElementById('texto').value,
        //tiempo: tiempo.toLocaleString(),
    };
    if (!mail.value){
        alert("Tienes que agregar un mail.")
        return false;
    }
    socket.emit('nuevo-msj', mensaje);
    return false;
}

async function response(e) {
    // const mensaje = {
    //     object: document.getElementById('object').value,
    // };

    let object = document.getElementById('object').value;
    console.log(await object)
    //socket.emit('nuevo-msj', mensaje);
    return true;
}

function addProd(e) {
    
    const newProd = {
        name: document.getElementById('title').value,
        price: document.getElementById('precio').value,
        thumbnail: document.getElementById('thumbnail').value,
    };
    socket.emit('new-prod', newProd);
    return false;
}
