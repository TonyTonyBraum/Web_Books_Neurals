document.addEventListener("DOMContentLoaded", async () => {

    // Cargar libros de Firebase
    let libros = [];
    
    try {
        const snapshot = await firebase.database().ref('libros').once('value');
        const librosFirebase = snapshot.val() || {};
        libros = Object.values(librosFirebase);
    } catch (error) {
        console.error('Error cargando de Firebase:', error);
        // Fallback: cargar de data.json si Firebase falla
        const response = await fetch('index/json/data.json');
        const data = await response.json();
        libros = data.libros;
    }

    const catalogo = document.querySelector(".catalogo");
    const buscador = document.getElementById("buscador");
    const letras = document.querySelectorAll(".filtro-letras .letra");
    const prevBtn = document.getElementById("prev");
    const nextBtn = document.getElementById("next");
    const paginaActual = document.getElementById("paginaActual");
    const btnFavoritos = document.getElementById("btnFavoritos");

    let librosFiltrados = [...libros];
    let pagina = 1;
    let mostrandoFavoritos = false;
    const librosPorPagina = 6;

    function mostrarLibros(){
        catalogo.innerHTML="";
        const inicio=(pagina-1)*librosPorPagina;
        const fin=inicio+librosPorPagina;
        const librosPagina=librosFiltrados.slice(inicio,fin);

        if(librosPagina.length === 0) {
            catalogo.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #aaa; padding: 40px;">No hay libros disponibles</p>';
            return;
        }

        librosPagina.forEach(libro=>{
            const card=document.createElement("div");
            card.classList.add("card");
            const isFavorito = db.esFavorito(libro.id);
            card.innerHTML=`
                <img src="${libro.imagen}" alt="${libro.titulo}">
                <h3>${libro.titulo}</h3>
                ${isFavorito ? '<div class="card-favorito">⭐ Favorito</div>' : ''}
            `;
            card.addEventListener("click",()=>{ 
                window.location.href = `libro-detalle.html?id=${libro.id}`;
            });
            catalogo.appendChild(card);
        });

        paginaActual.textContent=pagina;
    }

    // Resto del código igual...
    // (buscador, filtros, etc.)
});