const listaLibros = document.getElementById('listaLibros');
const busqueda = document.getElementById('busqueda');
const botonesLetra = document.querySelectorAll('.btn-letra');
const btnFavoritos = document.getElementById('btnFavoritos');
const btnAnterior = document.getElementById('btnAnterior');
const btnSiguiente = document.getElementById('btnSiguiente');
const numeroPagina = document.getElementById('numeroPagina');

let todosLosLibros = [];
let librosFiltrados = [];
let letraActual = 'Todos';
let viendoFavoritos = false;
let paginaActual = 1;
const librosPerPage = 6;

// Cargar libros desde Firebase
async function cargarLibros() {
    try {
        const snapshot = await firebase.database().ref('libros').once('value');
        todosLosLibros = Object.values(snapshot.val() || {});

        if (todosLosLibros.length === 0) {
            listaLibros.innerHTML = '<p class="sin-libros">No hay libros disponibles aún.</p>';
            return;
        }

        filtrarLibros();
    } catch (error) {
        console.error('Error cargando libros:', error);
        listaLibros.innerHTML = '<p class="error">Error al cargar los libros</p>';
    }
}

function filtrarLibros() {
    let resultado = [...todosLosLibros];

    // Filtrar por letra
    if (letraActual !== 'Todos') {
        resultado = resultado.filter(libro => 
            libro.titulo.toUpperCase().startsWith(letraActual)
        );
    }

    // Filtrar por favoritos
    if (viendoFavoritos) {
        resultado = resultado.filter(libro => {
            const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
            return favoritos.includes(libro.id);
        });
    }

    librosFiltrados = resultado;
    paginaActual = 1;
    mostrarLibros();
}

function mostrarLibros() {
    listaLibros.innerHTML = '';

    if (librosFiltrados.length === 0) {
        listaLibros.innerHTML = '<p class="sin-libros">No hay libros disponibles.</p>';
        ocultarPaginacion();
        return;
    }

    const inicio = (paginaActual - 1) * librosPerPage;
    const fin = inicio + librosPerPage;
    const librosPagina = librosFiltrados.slice(inicio, fin);

    librosPagina.forEach(libro => {
        const div = document.createElement('div');
        div.className = 'libro-card';
        
        const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
        const esFavorito = favoritos.includes(libro.id);

        div.innerHTML = `
            <div class="libro-imagen">
                <img src="${libro.imagen}" alt="${libro.titulo}" onerror="this.src='https://via.placeholder.com/200x300?text=Sin+Portada'">
                <button class="btn-favorito ${esFavorito ? 'activo' : ''}" data-id="${libro.id}" title="Agregar a favoritos">
                    ${esFavorito ? '⭐' : '☆'}
                </button>
            </div>
            <div class="libro-info">
                <h3>${libro.titulo}</h3>
            </div>
        `;

        // Evento para abrir detalles
        div.querySelector('.libro-imagen img').addEventListener('click', () => {
            window.location.href = `libro-detalle.html?id=${libro.id}`;
        });

        // Evento para favoritos
        div.querySelector('.btn-favorito').addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorito(libro.id, div.querySelector('.btn-favorito'));
        });

        listaLibros.appendChild(div);
    });

    actualizarPaginacion();
}

function toggleFavorito(libroId, btn) {
    let favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
    const index = favoritos.indexOf(libroId);

    if (index > -1) {
        favoritos.splice(index, 1);
        btn.textContent = '☆';
        btn.classList.remove('activo');
    } else {
        favoritos.push(libroId);
        btn.textContent = '⭐';
        btn.classList.add('activo');
    }

    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    
    if (viendoFavoritos) {
        filtrarLibros();
    }
}

function actualizarPaginacion() {
    const totalPaginas = Math.ceil(librosFiltrados.length / librosPerPage);
    numeroPagina.textContent = `${paginaActual} de ${totalPaginas}`;

    btnAnterior.disabled = paginaActual === 1;
    btnSiguiente.disabled = paginaActual === totalPaginas;
    
    if (totalPaginas <= 1) {
        ocultarPaginacion();
    } else {
        mostrarPaginacion();
    }
}

function mostrarPaginacion() {
    document.querySelector('.paginacion').style.display = 'flex';
}

function ocultarPaginacion() {
    document.querySelector('.paginacion').style.display = 'none';
}

// Event Listeners
botonesLetra.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-letra').forEach(b => b.classList.remove('btn-activo'));
        btn.classList.add('btn-activo');
        letraActual = btn.dataset.letra;
        viendoFavoritos = false;
        btnFavoritos.classList.remove('activo');
        filtrarLibros();
    });
});

btnFavoritos.addEventListener('click', () => {
    viendoFavoritos = !viendoFavoritos;
    btnFavoritos.classList.toggle('activo');
    document.querySelectorAll('.btn-letra').forEach(b => b.classList.remove('btn-activo'));
    filtrarLibros();
});

busqueda.addEventListener('input', (e) => {
    const termino = e.target.value.toLowerCase();
    librosFiltrados = todosLosLibros.filter(libro => 
        libro.titulo.toLowerCase().includes(termino)
    );
    paginaActual = 1;
    mostrarLibros();
});

btnAnterior.addEventListener('click', () => {
    if (paginaActual > 1) {
        paginaActual--;
        mostrarLibros();
        window.scrollTo(0, 0);
    }
});

btnSiguiente.addEventListener('click', () => {
    const totalPaginas = Math.ceil(librosFiltrados.length / librosPerPage);
    if (paginaActual < totalPaginas) {
        paginaActual++;
        mostrarLibros();
        window.scrollTo(0, 0);
    }
});

// Cargar libros al abrir la página
cargarLibros();