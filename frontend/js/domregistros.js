// seccion para mostrar registros
if(window.location.pathname === '/registros.html'){
    cargarRegistros ();
}

function cargarRegistros() {
    fetch('http://localhost:8000/registros')
    .then(response => response.json())
    .then(registros => {
        console.log('Registros Cargados', registros);
        mostrarRegistros(registros);
    })
    .catch(error => {
        console.log('Error al mostrar los registros', error);
    });
}

function mostrarRegistros(registros) {
    const tabla = document.querySelector('#tabla-registros tbody');
    if(tabla){ //verificar si el campo existe
        tabla.innerHTML ='';
        registros.forEach(registro => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${registro.nombre}</td>
                <td>${registro.apellido}</td>
                <td>${registro.email}</td>
                <td>${registro.password}</td>
                <td>${registro.genero}</td>
                <td>${registro.pais}</td>
                <td>${registro.terminos}</td>
            `;
            tabla.appendChild(fila); // Añade el registro al DOM
        });
    }
}