// Sistema de Base de Datos Local con JSON

class DataBase {
    constructor() {
        this.data = {
            libros: [],
            favoritos: [],
            comentarios: {}
        };
        this.cargarDatos();
    }

    // Cargar datos desde localStorage o archivo JSON
    async cargarDatos() {
        const datosGuardados = localStorage.getItem('booksDB');
        
        if(datosGuardados) {
            this.data = JSON.parse(datosGuardados);
        } else {
            // Cargar datos del archivo JSON
            try {
                const response = await fetch('data.json');
                this.data = await response.json();
                this.guardarDatos();
            } catch(error) {
                console.error('Error cargando data.json:', error);
                this.data = {
                    libros: [],
                    favoritos: [],
                    comentarios: {}
                };
            }
        }
    }

    // Guardar datos en localStorage
    guardarDatos() {
        localStorage.setItem('booksDB', JSON.stringify(this.data));
    }

    // ===== MÉTODOS DE LIBROS =====
    obtenerLibros() {
        return this.data.libros;
    }

    obtenerLibro(id) {
        return this.data.libros.find(libro => libro.id === id);
    }

    agregarLibro(libro) {
        this.data.libros.push(libro);
        this.guardarDatos();
    }

    // ===== MÉTODOS DE FAVORITOS =====
    obtenerFavoritos() {
        return this.data.favoritos;
    }

    agregarFavorito(libroId) {
        if(!this.data.favoritos.includes(libroId)) {
            this.data.favoritos.push(libroId);
            this.guardarDatos();
        }
    }

    quitarFavorito(libroId) {
        const indice = this.data.favoritos.indexOf(libroId);
        if(indice > -1) {
            this.data.favoritos.splice(indice, 1);
            this.guardarDatos();
        }
    }

    esFavorito(libroId) {
        return this.data.favoritos.includes(libroId);
    }

    // ===== MÉTODOS DE COMENTARIOS =====
    obtenerComentarios(libroId) {
        return this.data.comentarios[libroId] || [];
    }

    agregarComentario(libroId, comentario) {
        if(!this.data.comentarios[libroId]) {
            this.data.comentarios[libroId] = [];
        }
        this.data.comentarios[libroId].push({
            texto: comentario,
            fecha: new Date().toLocaleDateString('es-ES')
        });
        this.guardarDatos();
    }

    eliminarComentario(libroId, indice) {
        if(this.data.comentarios[libroId] && this.data.comentarios[libroId][indice]) {
            this.data.comentarios[libroId].splice(indice, 1);
            this.guardarDatos();
        }
    }

    // ===== MÉTODOS ÚTILES =====
    obtenerLibrosConFavoritos() {
        return this.data.libros.map(libro => ({
            ...libro,
            isFavorito: this.esFavorito(libro.id)
        }));
    }

    obtenerSoloFavoritos() {
        return this.data.libros.filter(libro => this.esFavorito(libro.id));
    }

    limpiarBaseDatos() {
        localStorage.removeItem('booksDB');
        window.location.reload();
    }
}

// Crear instancia global
const db = new DataBase();