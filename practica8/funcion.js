const form = document.getElementById('formCita');
const list = document.getElementById('listaCitas');
const contador = document.getElementById('contador');
let citas = [];
let editandoId = null;

let datosGuardados = localStorage.getItem("citasGuardadas");

if(datosGuardados){
  citas = JSON.parse(datosGuardados); 
}else{
  citas = [];
}

mostrarCitas();

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const datos = leerDatos();

  validarDatos(datos.mascota, datos.tipo, datos.fecha);

  guardarCita(datos);

  mostrarCitas();
});

function leerDatos() {
  return {
    mascota: document.getElementById('nombreMascota').value,
    tipo: document.getElementById('tipoMascota').value,
    fecha: document.getElementById('fecha').value,
    dueno: document.getElementById('nombrePersona').value,
    telefono: document.getElementById('telefonoPersona').value,
    creado: Date.now(),
  };
}

function validarDatos(mascota, tipo, fecha) {
  if (mascota == '' || tipo == '' || fecha == '') {
    alert('Todos los campos son obligatorios');
    return;
  }
}

function guardarCita(datos) {
  if(editandoId === null){
    const nuevaCita = {
    mascota: datos.mascota,
    tipo: datos.tipo,
    fecha: datos.fecha,
    dueno: datos.dueno,
    telefono: datos.telefono,
    creado: Date.now(),
  };

  citas.push(nuevaCita);
  }else{
    const cita = citas.find(cita => cita.creado === editandoId)

    cita.mascota = datos.mascota;
    cita.tipo = datos.tipo;
    cita.fecha = datos.fecha;
    cita.dueno = datos.dueno;
    cita.telefono = datos.telefono;

    editandoId = null;
  }
  
  form.querySelector("button[type='submit']").textContent = 'Crear cita';
  localStorage.setItem("citasGuardadas", JSON.stringify(citas));

}

function mostrarCitas() {
  list.innerHTML = '';

  contador.textContent = `Citas agendadas: ${citas.length}`;

  citas.forEach((cita) => {
    const li = document.createElement('li');

    li.innerHTML = `
        <strong>Nombre de la mascota:</strong>${cita.mascota} (${cita.tipo})
        <br>
        <strong>Dueño de la mascota:</strong>${cita.dueno}
        <br>
        <strong>Fecha:</strong>${cita.fecha}
        <br>
        <strong>Telefono:</strong>${cita.telefono}
        <br>
        <button class="delete" onclick="eliminar(${cita.creado})">Eliminar</button>
        <button class="update" onclick="actualizarCita(${cita.creado})">Actualizar</button>
    `;
    list.appendChild(li);
  });
}

function eliminar(id) {
  const confirmar = confirm("¿Seguro que desea eliminar cita?");
  if(confirmar){
    citas = citas.filter((cita) => cita.creado !== id);
    localStorage.setItem("citasGuardadas", JSON.stringify(citas));
    mostrarCitas();
  }

}


function actualizarCita(id){
  const cita = citas.find(cita => cita.creado === id)

  document.getElementById("nombreMascota").value = cita.mascota;
  document.getElementById("tipoMascota").value = cita.tipo;
  document.getElementById("fecha").value = cita.fecha;
  document.getElementById("nombrePersona").value = cita.dueno;
  document.getElementById("telefonoPersona").value = cita.telefono;

  form.querySelector("button[type='submit']").textContent = 'Editar Cita';

  editandoId = id;
}