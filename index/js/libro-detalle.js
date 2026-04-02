const params = new URLSearchParams(window.location.search);
const libroId = params.get('id');

const titulo = document.getElementById('titulo');
const descripcion = document.getElementById('descripcion');
const imagen = document.getElementById('imagen');
const btnDescargar = document.getElementById('btnDescargar');
const nombreComentario = document.getElementById('nombreComentario');
const textoComentario = document.getElementById('textoComentario');
const btnComentario = document.getElementById('btnComentario');
const listaComentarios = document.getElementById('listaComentarios');

let libroActual = null;

async function cargarLibro() {
    try {
        if (!libroId) {
            document.body.innerHTML = '<h1>Libro no encontrado</h1>';
            return;
        }

        const snapshot = await firebase.database().ref(`libros/${libroId}`).once('value');
        libroActual = snapshot.val();

        if (!libroActual) {
            document.body.innerHTML = '<h1>Libro no encontrado</h1>';
            return;
        }

        titulo.textContent = libroActual.titulo;
        descripcion.textContent = libroActual.descripcion;
        imagen.src = libroActual.imagen;
        imagen.onerror = function() {
            this.src = 'https://via.placeholder.com/300x400?text=Sin+Portada';
        };

        btnDescargar.onclick = () => {
            window.open(libroActual.pdf, '_blank');
        };

        cargarComentarios();
    } catch (error) {
        console.error('Error cargando libro:', error);
        document.body.innerHTML = '<h1>Error al cargar el libro</h1>';
    }
}

async function cargarComentarios() {
    try {
        const snapshot = await firebase.database().ref(`comentarios/${libroId}`).once('value');
        const comentarios = snapshot.val() || {};

        listaComentarios.innerHTML = '';

        if (Object.keys(comentarios).length === 0) {
            listaComentarios.innerHTML = '<p class="sin-comentarios">No hay comentarios aún. ¡Sé el primero en comentar!</p>';
            return;
        }

        Object.values(comentarios).reverse().forEach(comentario => {
            const div = document.createElement('div');
            div.className = 'comentario';
            div.innerHTML = `
                <div class="comentario-cabecera">
                    <strong>${comentario.nombre}</strong>
                    <span class="fecha">${new Date(comentario.fecha).toLocaleDateString('es-ES')}</span>
                </div>
                <p>${comentario.texto}</p>
            `;
            listaComentarios.appendChild(div);
        });
    } catch (error) {
        console.error('Error cargando comentarios:', error);
        listaComentarios.innerHTML = '<p class="error">Error al cargar comentarios</p>';
    }
}

btnComentario.addEventListener('click', async () => {
    const nombre = nombreComentario.value.trim();
    const texto = textoComentario.value.trim();

    if (!nombre || !texto) {
        alert('Por favor completa todos los campos');
        return;
    }

    try {
        await firebase.database().ref(`comentarios/${libroId}`).push().set({
            nombre: nombre,
            texto: texto,
            fecha: new Date().toISOString()
        });

        nombreComentario.value = '';
        textoComentario.value = '';
        cargarComentarios();
    } catch (error) {
        alert('Error al enviar comentario: ' + error.message);
    }
});

// Cargar libro al abrir la página
cargarLibro();