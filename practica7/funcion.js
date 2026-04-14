//Una linea de comentario

/*
Varias líneas
*/

//Identificar el objeto
const form = document.getElementById("formCita");
const list = document.getElementById("listaCitas");

let citas = [];

form.addEventListener("submit", function(e) {
    e.preventDefault();

    const datos = leerDatos();

    validarDatos(datos.mascota, datos.tipo, datos.fecha);

    guardarCita(datos);

    
    mostrarCitas();
})

function leerDatos(){
    return {
        mascota: document.getElementById("nombreMascota").value,
        tipo: document.getElementById("tipoMascota").value,
        fecha: document.getElementById("fecha").value,
        dueno: document.getElementById("nombrePersona").value,
        telefono: document.getElementById("telefonoPersona").value,
        creado: Date.now()

    }

}

function validarDatos(mascota,tipo,fecha){
    if(mascota == "" || tipo == ""  || fecha == "" ){
        alert("Todos los campos son necesarios");
        return;
    }
}

function guardarCita(datos){
    const nuevaCita = {
        mascota: datos.mascota,
        tipo: datos.tipo,
        fecha: datos.fecha,
        dueno: datos.dueno,
        telefono: datos.telefono,
        creado: Date.now()
    }

    citas.push(nuevaCita);
}

function mostrarCitas(){
    list.innerHTML = "";

    citas.forEach(cita => {
        const li = document.createElement("li");

        li.innerHTML = `
        <strong>Nombre de la mascota: </strong> ${cita.mascota} ${cita.tipo} 
        <br>
        <strong>Dueño de la mascota: </strong> ${cita.dueno}
        <br>
        <strong>Fecha: </strong> ${cita.fecha}
        <br>
        <strong>Teléfono: </strong> ${cita.telefono}
        <br>
        <button onclick="eliminar(${cita.creado})">Eliminar </button>
        `
        
        list.appendChild(li);
    });
}

function eliminar(id){
    citas = citas.filter(cita => cita.creado !== id)
    mostrarCitas();
}