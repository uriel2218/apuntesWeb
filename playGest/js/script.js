// ============================================
// CÓDIGO SOLO PARA CATÁLOGO (catalogo.html)
// ============================================

if (document.getElementById('contenedor-tarjetas')) {

    const form = document.getElementById('form');
    const contenedor = document.getElementById('contenedor-tarjetas');
    const contador = document.getElementById('contador');

    let editandoId = null;
    let juegos = [];
    let seleccionados = [];

    // Cargar datos guardados
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
            card.onclick = function () {
                seleccionar(juego.creado);
            };

            //aqui se puede poner la imagen o un placeholder si no hay imagen o si no se encuentra el archivo
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
                <button class="btn-editar" onclick="event.stopPropagation(); editarJuego(${juego.creado})">Editar</button>
                <button class="btn-eliminar" onclick="event.stopPropagation(); eliminarJuego(${juego.creado})">Eliminar</button>
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
            card.onclick = function () { seleccionar(juego.creado); };

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
                <button class="btn-editar" onclick="event.stopPropagation(); editarJuego(${juego.creado})">Editar</button>
                <button class="btn-eliminar" onclick="event.stopPropagation(); eliminarJuego(${juego.creado})">Eliminar</button>
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

// ============================================
// CÓDIGO SOLO PARA INDEXFORM.HTML
// ============================================

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
}