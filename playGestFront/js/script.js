function obtenerSolicitudes() {
    const datos = localStorage.getItem('solicitudes');
    return datos ? JSON.parse(datos) : [];
}

function guardarSolicitudes(solicitudes) {
    localStorage.setItem('solicitudes', JSON.stringify(solicitudes));
}

if (document.getElementById('contenedor-tarjetas')) {
    const form = document.getElementById('form');
    const contenedor = document.getElementById('contenedor-tarjetas');
    const contador = document.getElementById('contador');

    let editandoId = null;
    let juegos = [];
    let seleccionados = [];

    let datosGuardados = localStorage.getItem('juegos guardados');

    if (datosGuardados) {
        juegos = JSON.parse(datosGuardados);
    } else {
        juegos = [];
    }

    mostrarJuegos();

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const datos = leerDatos();
        if (!validarDatos(datos)) {
            return;
        }
        guardarJuego(datos);
        mostrarJuegos();
    });

    function leerDatos() {
        return {
            nombre: document.getElementById('nombreJuego').value,
            dificultad: document.getElementById('dificultad').value,
            edad: document.getElementById('edad').value,
            jugadores: document.getElementById('jugadores').value,
            imagen: document.getElementById('imagen').value,
        };
    }

    function validarDatos(datos) {
        if (datos.nombre == '' || datos.dificultad == '' || datos.edad == '' || datos.jugadores == '') {
            alert('Todos los campos son obligatorios');
            return false;
        }
        return true;
    }

    function guardarJuego(datos) {
        if (editandoId === null) {
            const nuevoJuego = {
                nombre: datos.nombre,
                dificultad: datos.dificultad,
                edad: datos.edad,
                jugadores: datos.jugadores,
                imagen: datos.imagen,
                creado: Date.now(),
            };
            juegos.push(nuevoJuego);
        } else {
            const juego = juegos.find(j => j.creado === editandoId);
            juego.nombre = datos.nombre;
            juego.dificultad = datos.dificultad;
            juego.edad = datos.edad;
            juego.jugadores = datos.jugadores;
            juego.imagen = datos.imagen;
            editandoId = null;
        }

        form.reset();
        document.getElementById('titulo-form').textContent = 'Agregar juego nuevo';
        form.querySelector("button[type='submit']").textContent = 'Agregar juego';
        localStorage.setItem('juegos guardados', JSON.stringify(juegos));
    }

    function mostrarJuegos() {
        contenedor.innerHTML = '';
        contador.textContent = `Juegos en catalogo: ${juegos.length}`;

        if (juegos.length == 0) {
            contenedor.innerHTML = "<p style='text-align:center;color:#999;width:100%;padding:40px 0;'>No hay juegos todavia. Agregalos desde el panel de administrador.</p>";
            return;
        }

        juegos.forEach((juego) => {
            const estaSeleccionado = seleccionados.includes(juego.creado);
            const card = document.createElement('div');
            card.className = 'tarjeta' + (estaSeleccionado ? ' seleccionado' : '');
            card.onclick = function (e) {
                if (e.target.tagName !== 'BUTTON') {
                    seleccionar(juego.creado);
                }
            };

            const imagenHTML = juego.imagen != ''
                ? `<img src="img/${juego.imagen}" alt="${juego.nombre}"
                       onerror="this.style.display='none';this.nextSibling.style.display='flex';">
                   <div class="sin-imagen" style="display:none;">Sin imagen</div>`
                : `<div class="sin-imagen">Sin imagen</div>`;

            card.innerHTML = `
                ${imagenHTML}
                <h3>${juego.nombre}</h3>
                <p>Dificultad: ${juego.dificultad}</p>
                <p>Edad: ${juego.edad}</p>
                <p>Jugadores: ${juego.jugadores}</p>
                <div class="botones">
                    <button class="btn-editar" onclick="event.stopPropagation(); editarJuego(${juego.creado})">Editar</button>
                    <button class="btn-eliminar" onclick="event.stopPropagation(); eliminarJuego(${juego.creado})">Eliminar</button>
                </div>
            `;
            contenedor.appendChild(card);
        });
    }

    function eliminarJuego(id) {
        juegos = juegos.filter((j) => j.creado !== id);
        localStorage.setItem('juegos guardados', JSON.stringify(juegos));
        mostrarJuegos();
    }

    function editarJuego(id) {
        const juego = juegos.find(j => j.creado === id);

        document.getElementById('nombreJuego').value = juego.nombre;
        document.getElementById('dificultad').value = juego.dificultad;
        document.getElementById('edad').value = juego.edad;
        document.getElementById('jugadores').value = juego.jugadores;
        document.getElementById('imagen').value = juego.imagen;

        document.getElementById('titulo-form').textContent = 'Editar juego';
        form.querySelector("button[type='submit']").textContent = 'Guardar cambios';
        editandoId = id;
        form.scrollIntoView({ behavior: 'smooth' });
    }

    function resetearBaseDatos() {
        const confirmar = confirm('¿Seguro? Esto borrara TODOS los juegos. No se puede deshacer.');
        if (confirmar) {
            juegos = [];
            localStorage.removeItem('juegos guardados');
            mostrarJuegos();
        }
    }

    function seleccionar(id) {
        if (seleccionados.includes(id)) {
            seleccionados = seleccionados.filter(x => x !== id);
        } else {
            if (seleccionados.length >= 3) {
                alert('Solo puedes seleccionar 3 juegos.');
                return;
            }
            seleccionados.push(id);
        }

        document.getElementById('mensaje-seleccion').textContent = `Seleccionados: ${seleccionados.length} / 3`;
        mostrarJuegos();
    }

    function filtrar() {
        const texto = document.getElementById('buscador').value.toLowerCase();
        const dif = document.getElementById('filtro-dificultad').value;

        const resultado = juegos.filter(j =>
            j.nombre.toLowerCase().includes(texto) && (dif === '' || j.dificultad === dif)
        );

        contenedor.innerHTML = '';

        resultado.forEach((juego) => {
            const estaSeleccionado = seleccionados.includes(juego.creado);
            const card = document.createElement('div');
            card.className = 'tarjeta' + (estaSeleccionado ? ' seleccionado' : '');
            card.onclick = function (e) {
                if (e.target.tagName !== 'BUTTON') {
                    seleccionar(juego.creado);
                }
            };

            const imagenHTML = juego.imagen != ''
                ? `<img src="img/${juego.imagen}" alt="${juego.nombre}"
                       onerror="this.style.display='none';this.nextSibling.style.display='flex';">
                   <div class="sin-imagen" style="display:none;">Sin imagen</div>`
                : `<div class="sin-imagen">Sin imagen</div>`;

            card.innerHTML = `
                ${imagenHTML}
                <h3>${juego.nombre}</h3>
                <p>Dificultad: ${juego.dificultad}</p>
                <p>Edad: ${juego.edad}</p>
                <p>Jugadores: ${juego.jugadores}</p>
                <div class="botones">
                    <button class="btn-editar" onclick="event.stopPropagation(); editarJuego(${juego.creado})">Editar</button>
                    <button class="btn-eliminar" onclick="event.stopPropagation(); eliminarJuego(${juego.creado})">Eliminar</button>
                </div>
            `;
            contenedor.appendChild(card);
        });
    }

    function irAPrestamo() {
        if (seleccionados.length == 0) {
            alert('Selecciona al menos un juego.');
            return;
        }

        const juegosSeleccionados = juegos.filter(j => seleccionados.includes(j.creado));
        const nombresJuegos = juegosSeleccionados.map(j => j.nombre);

        sessionStorage.setItem('selectedGames', JSON.stringify(seleccionados));
        sessionStorage.setItem('selectedGamesNames', JSON.stringify(nombresJuegos));

        window.location.href = 'indexForm.html';
    }
}

if (document.getElementById('prestamoForm')) {
    const nombresGuardados = sessionStorage.getItem('selectedGamesNames');
    const contenedor = document.getElementById('juegosSeleccionados');
    
    if (nombresGuardados && contenedor) {
        const juegos = JSON.parse(nombresGuardados);
        if (juegos.length > 0) {
            contenedor.innerHTML = '<ul style="margin:0; padding-left:20px;">' +
                juegos.map(j => `<li><strong>${j}</strong></li>`).join('') +
                '</ul>';
        } else {
            contenedor.innerHTML = '<p class="text-muted mb-0 text-center">No hay juegos seleccionados</p>';
        }
    } else if (contenedor) {
        contenedor.innerHTML = '<p class="text-muted mb-0 text-center">No hay juegos seleccionados. <a href="catalogo.html">Volver al catálogo</a></p>';
    }

    const form = document.getElementById('prestamoForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const inputUsuario = document.getElementById('nombreCliente');
        const inputPersonas = document.getElementById('numeroPersonas');
        
        const usuario = inputUsuario ? inputUsuario.value : form.querySelector('input[placeholder*="usuario"]').value;
        const personas = inputPersonas ? inputPersonas.value : form.querySelector('input[placeholder*="ej. 4"]').value;
        
        let juegosSeleccionados = 'Ninguno';
        if (nombresGuardados) {
            juegosSeleccionados = JSON.parse(nombresGuardados).join(', ');
        }

        if (!usuario || !personas || juegosSeleccionados === 'Ninguno') {
            alert("Por favor, llena todos los campos y selecciona al menos un juego en el catálogo.");
            return;
        }

        const solicitudes = obtenerSolicitudes();
        const nuevoId = solicitudes.length > 0 ? solicitudes[solicitudes.length - 1].id + 1 : 1001;
        const codigoConfirmacion = `PG-${nuevoId}`;

        const nuevaSolicitud = {
            id: nuevoId,
            codigo: codigoConfirmacion,
            usuario: usuario,
            personas: personas,
            juego: juegosSeleccionados,
            estado: 'Pendiente'
        };

        solicitudes.push(nuevaSolicitud);
        guardarSolicitudes(solicitudes);

        localStorage.setItem('ultimaSolicitudId', nuevoId);
        
        sessionStorage.removeItem('selectedGames');
        sessionStorage.removeItem('selectedGamesNames');

        window.location.href = 'indexConfirm.html';
    });
}

if (document.getElementById('confirmationCode')) {
    const idBuscado = localStorage.getItem('ultimaSolicitudId');
    if (idBuscado) {
        const solicitudes = obtenerSolicitudes();
        const data = solicitudes.find(s => s.id == idBuscado);

        if (data) {
            document.getElementById('confirmationCode').innerText = data.codigo;
            document.getElementById('listaJuegos').innerText = data.juego;
            
            const estatus = document.getElementById('estatusReservacion');
            if(estatus) {
                estatus.innerHTML = `<span class="badge bg-warning text-dark">${data.estado}</span>`;
            }
        }
    }
}

if (document.getElementById('contenedorSolicitudes')) {
    
    function actualizarListaAdmin() {
        const contenedor = document.getElementById('contenedorSolicitudes');
        const contador = document.getElementById('contadorSolicitudes');
        const solicitudes = obtenerSolicitudes();

        const pendientes = solicitudes.filter(s => s.estado === 'Pendiente');
        if(contador) contador.innerText = pendientes.length;

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

    actualizarListaAdmin();

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
            actualizarListaAdmin(); 
        }
    };
}