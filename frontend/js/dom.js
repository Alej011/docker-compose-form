// arrglo para leer los datos

let data = {
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    gender: '',
    pais: '',
    terminos: false
}

const nombre = document.querySelector('#nombre');
const apellido = document.querySelector('#apellido');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const radios = document.querySelectorAll('input[name="gender"]');
const pais = document.querySelector('#pais');
const terminos = document.querySelector('#terminos');
const formulario = document.querySelector('.formulario');

// Resetear formulario al cargar la página
window.addEventListener('load', () => {
    formulario.reset(); // Resetea el formulario y desmarca todos los radio buttons
});

// eventos

nombre.addEventListener('input', leerTexto);
apellido.addEventListener('input', leerTexto);
email.addEventListener('input', leerTexto);
password.addEventListener('input', leerTexto);
radios.forEach(radio => {radio.addEventListener('change', leerRadio);});
pais.addEventListener('change', leerTexto);
terminos.addEventListener('change', function(e){data.terminos = e.target.checked;});

formulario.addEventListener('submit',function(evento){
    evento.preventDefault();

    //validar formulario:
    const {nombre, apellido, email, password, gender, pais, terminos} = data;
    if(nombre === '' || apellido === '' || email === '' || password === '' || gender === '' || pais ==='' || !terminos){
        alerta('Obligatorio, llenar todos los campos.', true);

        return;
    }
    // Enviar los datos con fetch
    fetch('http://localhost:8000/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data) // Serializa los datos del objeto `data`
    })
    .then(response => response.json())
    .then(result => {

        if(result.errores){
            imprimirErrores(result.errores);
        } else {
            alerta('Formulario enviado correctamente', false);
            console.log(result);
            formulario.reset(); // Opcional: Resetea el formulario tras enviar
            // Resetea el objeto `data` después de enviar los datos
            data = {
                nombre: '',
                apellido: '',
                email: '',
                password: '',
                gender: '',
                pais: '',
                terminos: false
            };
        }
    })
    .catch(error => {
        alerta('Error al enviar el formulario', true);
        console.error('Error:', error);
    });
});
// funciones

function leerTexto(e){
    data[e.target.id] = e.target.value;
    console.log(data);
}

function leerRadio(e){
    data[e.target.name] = e.target.value;
}

function alerta (mensaje, error = null){
    const alerta = document.createElement('P');
    alerta.textContent = mensaje;

    if(error){
        alerta.classList.add('error');
    } else {
        alerta.classList.add('correcto');
    }

    formulario.appendChild(alerta);
    // remover mensaje de validacion despues de 5 segundos
    setTimeout(() => {alerta.remove();}, 5000);
}

function imprimirErrores(errores){
    const campoErrores = document.querySelector('#campo-errores');
    campoErrores.innerHTML = '';

    errores.forEach(error => {
        const errorElemento = document.createElement('P');
        errorElemento.classList.add('error');
        errorElemento.textContent = error.msg
        campoErrores.appendChild(errorElemento);
        // remover mensaje de validacion despues de 5 segundos
        setTimeout(() => {errorElemento.remove();}, 5000);
    });
}


