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
    const mascota = document.getElementById("nombreMascota").value;
    const tipo = document.getElementById("tipoMascota").value;
    const fecha = document.getElementById("fecha").value;
    const dueno = document.getElementById("nombrePersona").value;
    const telefono = document.getElementById("telefonoPersona").value;

    if(!mascota || !fecha || !telefono){
        alert("Todos los campos son necesarios");
        return;
    }

    const nuevaCita = {
        mascota,
        tipo,
        fecha,
        dueno,
        telefono,
        creado: Date.now()
    }

    citas.push(nuevaCita);
    console.log(citas);
    mostrarCitas();
})

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
        `
        
        list.appendChild(li);
    });
}


