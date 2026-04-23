document.addEventListener('DOMContentLoaded', () => {
    // Inicializar la vista unificada
    logicaPrototipoUnificado();
});

function obtenerSolicitudes() {
    const datos = localStorage.getItem('solicitudes');
    return datos ? JSON.parse(datos) : [];
}

function guardarSolicitudes(solicitudes) {
    localStorage.setItem('solicitudes', JSON.stringify(solicitudes));
}

function logicaPrototipoUnificado() {
    // 1. Cargar la lista inicial de solicitudes
    actualizarListaAdmin();

    // 2. Manejar el envío del formulario
    const form = document.getElementById('formPrestamo');
    
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const inputUsuario = form.querySelector('input[placeholder*="usuario"]');
            const inputPersonas = form.querySelector('input[placeholder*="ej. 4"]');
            const selectJuego = form.querySelector('select');
            
            const usuario = inputUsuario.value;
            const personas = inputPersonas.value;
            const juegoNombre = selectJuego.options[selectJuego.selectedIndex].text;

            const solicitudes = obtenerSolicitudes();
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

            // Simular pantalla de confirmación con un alert
            alert(`¡Solicitud Registrada con éxito!\n\nJuego: ${juegoNombre}\nCódigo de Confirmación: ${codigoConfirmacion}\nEstado: Pendiente`);

            // Limpiar formulario y actualizar la lista de abajo
            form.reset();
            actualizarListaAdmin();
        });
    }
}

// Función para pintar la lista de administrador
function actualizarListaAdmin() {
    const contenedor = document.getElementById('contenedorSolicitudes');
    const contador = document.getElementById('contadorSolicitudes');
    if (!contenedor || !contador) return;

    const solicitudes = obtenerSolicitudes();
    const pendientes = solicitudes.filter(s => s.estado === 'Pendiente');
    
    contador.innerText = pendientes.length;

    if (pendientes.length === 0) {
        contenedor.innerHTML = '<div class="p-5 text-center text-muted"><i class="bi bi-inbox fs-1 d-block mb-2"></i>No hay solicitudes pendientes.</div>';
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
                            <h6 class="fw-bold mb-1">${sol.usuario} <small class="text-primary border rounded px-1 ms-1">${sol.codigo}</small></h6>
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

// Función global para los botones de Aprobar/Rechazar
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
        actualizarListaAdmin(); // Refrescar la lista automáticamente
    }
};