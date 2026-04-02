const loginContainer = document.getElementById('loginContainer');
const adminContainer = document.getElementById('adminContainer');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const btnLogin = document.getElementById('btnLogin');
const loginError = document.getElementById('loginError');
const btnLogout = document.getElementById('btnLogout');

const formLibro = document.getElementById('formLibro');
const progreso = document.getElementById('progreso');
const mensaje = document.getElementById('mensaje');
const listaLibros = document.getElementById('listaLibros');

let usuarioActual = null;

// Verificar si hay sesión activa
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        usuarioActual = user;
        loginContainer.classList.add('oculto');
        adminContainer.classList.remove('oculto');
        cargarLibros();
    } else {
        usuarioActual = null;
        loginContainer.classList.remove('oculto');
        adminContainer.classList.add('oculto');
    }
});

// Login
btnLogin.addEventListener('click', async () => {
    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();

    if (!email || !password) {
        mostrarError('Por favor completa todos los campos');
        return;
    }

    try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
        loginEmail.value = '';
        loginPassword.value = '';
    } catch (error) {
        mostrarError('Error: ' + error.message);
    }
});

// Logout
btnLogout.addEventListener('click', () => {
    firebase.auth().signOut();
});

// Agregar Libro
formLibro.addEventListener('submit', async (e) => {
    e.preventDefault();

    const titulo = document.getElementById('titulo').value;
    const descripcion = document.getElementById('descripcion').value;
    const portadaFile = document.getElementById('portada').files[0];
    const pdfFile = document.getElementById('pdf').files[0];

    if (!titulo || !descripcion || !portadaFile || !pdfFile) {
        mostrarMensaje('Por favor completa todos los campos', 'error');
        return;
    }

    progreso.classList.remove('oculto');
    mensaje.classList.add('oculto');

    try {
        // Subir portada
        const refPortada = firebase.storage().ref(`portadas/${Date.now()}_${portadaFile.name}`);
        await refPortada.put(portadaFile);
        const urlPortada = await refPortada.getDownloadURL();

        // Subir PDF
        const refPdf = firebase.storage().ref(`pdfs/${Date.now()}_${pdfFile.name}`);
        await refPdf.put(pdfFile);
        const urlPdf = await refPdf.getDownloadURL();

        // Obtener ID del nuevo libro
        const nuevoLibroRef = firebase.database().ref('libros').push();
        
        // Guardar en base de datos
        await nuevoLibroRef.set({
            id: nuevoLibroRef.key,
            titulo: titulo,
            descripcion: descripcion,
            imagen: urlPortada,
            pdf: urlPdf,
            fecha: new Date().toISOString()
        });

        progreso.classList.add('oculto');
        mostrarMensaje(`✅ Libro "${titulo}" agregado exitosamente`, 'exito');
        formLibro.reset();
        cargarLibros();

    } catch (error) {
        progreso.classList.add('oculto');
        mostrarMensaje(`❌ Error: ${error.message}`, 'error');
        console.error(error);
    }
});

function mostrarMensaje(text, tipo) {
    mensaje.textContent = text;
    mensaje.className = `mensaje ${tipo}`;
    mensaje.classList.remove('oculto');
}

function mostrarError(text) {
    loginError.textContent = text;
    loginError.classList.remove('oculto');
}

async function cargarLibros() {
    try {
        const snapshot = await firebase.database().ref('libros').once('value');
        const libros = snapshot.val() || {};
        
        listaLibros.innerHTML = '';
        
        Object.values(libros).forEach(libro => {
            const div = document.createElement('div');
            div.className = 'libro-item';
            div.innerHTML = `
                <div class="libro-info">
                    <img src="${libro.imagen}" alt="${libro.titulo}">
                    <div class="libro-detalles">
                        <h3>${libro.titulo}</h3>
                        <p>${libro.descripcion.substring(0, 50)}...</p>
                    </div>
                </div>
                <button class="btn-eliminar" onclick="eliminarLibro('${libro.id}')">🗑️ Eliminar</button>
            `;
            listaLibros.appendChild(div);
        });
    } catch (error) {
        console.error('Error cargando libros:', error);
    }
}

async function eliminarLibro(libroId) {
    if (confirm('¿Estás seguro de que quieres eliminar este libro?')) {
        try {
            await firebase.database().ref(`libros/${libroId}`).remove();
            cargarLibros();
            mostrarMensaje('✅ Libro eliminado', 'exito');
        } catch (error) {
            mostrarMensaje(`❌ Error: ${error.message}`, 'error');
        }
    }
}