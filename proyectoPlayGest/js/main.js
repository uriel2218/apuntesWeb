document.addEventListener('DOMContentLoaded', () => {
    
    const path = window.location.pathname;

    if (path.includes('indexForm.html')) {
        logicaFormulario();
    } else if (path.includes('indexConfirm.html')) {
        logicaConfirmacion();
    } else if (path.includes('indexSolicitudes.html')) {
        logicaAdmin();
    }
});


function obtenerSolicitudes() {
    const datos = localStorage.getItem('solicitudes');
    return datos ? JSON.parse(datos) : [];
}

function guardarSolicitudes(solicitudes) {
    localStorage.setItem('solicitudes', JSON.stringify(solicitudes));
}


function logicaFormulario() {
    const form = document.getElementById('formPrestamo') || document.querySelector('form');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        
        const usuario = form.querySelector('input[placeholder*="usuario"]').value;
        const personas = form.querySelector('input[placeholder*="ej. 4"]').value;
        const juegoSelect = form.querySelector('select');
        const juegoNombre = juegoSelect.options[juegoSelect.selectedIndex].text;

        if (!usuario || !personas || juegoSelect.value === "Selecciona un juego") {
            alert("Por favor, llena todos los campos.");
            return;
        }

        const solicitudes = obtenerSolicitudes();
        
        // Crear ID autoincremental (Código de confirmación)
        const nuevoId = solicitudes.length > 0 ? solicitudes[solicitudes.length - 1].id + 1 : 1001;
        const codigoConfirmacion = `PG-${nuevoId}`;

        const nuevaSolicitud = {
            id: nuevoId,
            codigo: codigoConfirmacion,
            usuario: usuario,
            personas: personas,
            juego: juegoNombre,
            estado: 'Pendiente'
        };

        solicitudes.push(nuevaSolicitud);
        guardarSolicitudes(solicitudes);

        
        localStorage.setItem('ultimaSolicitudId', nuevoId);

       
        window.location.href = 'indexConfirm.html';
    });
}


function logicaConfirmacion() {
    const idBuscado = localStorage.getItem('ultimaSolicitudId');
    if (!idBuscado) return;

    const solicitudes = obtenerSolicitudes();
    const data = solicitudes.find(s => s.id == idBuscado);

    if (data) {
        document.getElementById('confirmationCode').innerText = data.codigo;
        document.getElementById('listaJuegos').innerText = data.juego;
        
        const estatus = document.getElementById('estatusReservacion') || document.getElementById('reservationStatus');
        estatus.innerHTML = `<span class="badge bg-warning text-dark">${data.estado}</span>`;
    }
}


function logicaAdmin() {
    const contenedor = document.getElementById('contenedorSolicitudes');
    const contador = document.getElementById('contadorSolicitudes');
    const solicitudes = obtenerSolicitudes();

   
    const pendientes = solicitudes.filter(s => s.estado === 'Pendiente');
    contador.innerText = pendientes.length;

    if (pendientes.length === 0) {
        contenedor.innerHTML = '<div class="p-4 text-center text-muted">No hay solicitudes pendientes.</div>';
        return;
    }

    contenedor.innerHTML = ''; 

    pendientes.forEach(sol => {
        const item = document.createElement('div');
        item.className = 'list-group-item bg-white p-4 border-bottom';
        item.innerHTML = `
            <div class="row align-items-center">
                <div class="col-md-8">
                    <div class="d-flex align-items-center gap-3">
                        <div class="bg-light rounded-circle d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
                            <i class="bi bi-person-fill fs-3 text-secondary"></i>
                        </div>
                        <div>
                            <h6 class="fw-bold mb-1">${sol.usuario} <small class="text-muted">(${sol.codigo})</small></h6>
                            <p class="mb-1 text-dark small fw-medium">
                                <i class="bi bi-controller text-muted me-1"></i> ${sol.juego}
                            </p>
                            <div class="text-muted small">
                                <span><i class="bi bi-people me-1"></i> ${sol.personas} Personas</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 d-flex justify-content-md-end gap-2 mt-3 mt-md-0">
                    <button class="btn btn-outline-danger rounded-pill px-4" onclick="gestionarSolicitud(${sol.id}, 'Rechazada')">
                        Rechazar
                    </button>
                    <button class="btn btn-success rounded-pill px-4" onclick="gestionarSolicitud(${sol.id}, 'Aprobada')">
                        Aprobar
                    </button>
                </div>
            </div>
        `;
        contenedor.appendChild(item);
    });
}


window.gestionarSolicitud = function(id, accion) {
    const mensaje = accion === 'Aprobada' ? "¿Desea confirmar la solicitud?" : "¿Desea rechazar la solicitud?";
    
    if (confirm(mensaje)) {
        let solicitudes = obtenerSolicitudes();
        solicitudes = solicitudes.map(sol => {
            if (sol.id === id) {
                sol.estado = accion;
            }
            return sol;
        });
        
        guardarSolicitudes(solicitudes);
        logicaAdmin(); 
    }
};