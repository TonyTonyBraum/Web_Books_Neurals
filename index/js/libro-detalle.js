document.addEventListener("DOMContentLoaded", async () => {
    
    // Esperar a que se carguen los datos
    await new Promise(resolve => setTimeout(resolve, 100));

    // Obtener el ID del libro de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const libroId = parseInt(urlParams.get('id'));

    // Obtener el libro actual
    const libroActual = db.obtenerLibro(libroId);

    if (!libroActual) {
        document.querySelector('.libro-detalle-section').innerHTML = '<h1 style="color: #fff; padding: 100px; text-align: center;">Libro no encontrado</h1>';
    } else {
        // Llenar los datos del libro
        document.getElementById('detallePortada').src = libroActual.imagen;
        document.getElementById('detalleTitulo').textContent = libroActual.titulo;
        document.getElementById('detalleDescripcion').textContent = libroActual.descripcion;
        
        // Botón para abrir el PDF
        document.getElementById('abrirLibroDetalle').addEventListener('click', () => {
            window.open(libroActual.pdf, '_blank');
        });
        
        // Sistema de favoritos
        const btnFavorito = document.getElementById('agregarFavorito');
        const esFavorito = db.esFavorito(libroActual.id);
        
        // Actualizar el estado del botón
        actualizarBtnFavorito(btnFavorito, esFavorito);
        
        // Agregar/Quitar de favoritos
        btnFavorito.addEventListener('click', () => {
            if(db.esFavorito(libroActual.id)) {
                db.quitarFavorito(libroActual.id);
            } else {
                db.agregarFavorito(libroActual.id);
            }
            const nuevoEsFavorito = db.esFavorito(libroActual.id);
            actualizarBtnFavorito(btnFavorito, nuevoEsFavorito);
        });
        
        // Cargar comentarios desde la BD
        const comentarios = db.obtenerComentarios(libroActual.id);
        renderizarComentarios(comentarios);
        
        // Guardar nuevo comentario
        document.getElementById('guardarComentario').addEventListener('click', () => {
            const texto = document.getElementById('nuevoComentario').value.trim();
            if(texto) {
                db.agregarComentario(libroActual.id, texto);
                const comentariosActualizados = db.obtenerComentarios(libroActual.id);
                renderizarComentarios(comentariosActualizados);
                document.getElementById('nuevoComentario').value = '';
            }
        });
    }

    function actualizarBtnFavorito(btn, isFavorite) {
        if(isFavorite) {
            btn.classList.add('favorito-activo');
            btn.textContent = '⭐ Quitar de Favoritos';
        } else {
            btn.classList.remove('favorito-activo');
            btn.textContent = '⭐ Agregar a Favoritos';
        }
    }

    function renderizarComentarios(comentarios) {
        const container = document.getElementById('comentariosContainer');
        container.innerHTML = '';
        
        if(comentarios.length === 0) {
            container.innerHTML = '<p style="color: #aaa; text-align: center; padding: 20px;">No hay comentarios aún. ¡Sé el primero en comentar!</p>';
        } else {
            comentarios.forEach((comentario, indice) => {
                const p = document.createElement('p');
                p.innerHTML = `<strong>${comentario.fecha}:</strong> ${comentario.texto}`;
                container.appendChild(p);
            });
        }
    }
});