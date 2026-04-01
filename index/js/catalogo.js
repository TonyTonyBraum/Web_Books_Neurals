document.addEventListener("DOMContentLoaded", async () => {

    // Esperar a que se carguen los datos
    await new Promise(resolve => setTimeout(resolve, 100));

    const libros = db.obtenerLibros();
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

    // Buscador
    buscador.addEventListener("input",()=>{
        const termino=buscador.value.toLowerCase();
        let librosBuscados = libros.filter(l=>l.titulo.toLowerCase().includes(termino));
        
        if(mostrandoFavoritos) {
            librosFiltrados = librosBuscados.filter(l => db.esFavorito(l.id));
        } else {
            librosFiltrados = librosBuscados;
        }
        
        pagina=1;
        mostrarLibros();
    });

    // Filtro letras
    letras.forEach(btn=>{
        btn.addEventListener("click",()=>{
            const letra=btn.dataset.letra;
            let librosPorLetra;
            
            if(letra==="all") {
                librosPorLetra = [...libros];
            } else {
                librosPorLetra = libros.filter(l=>l.titulo[0].toLowerCase()===letra.toLowerCase());
            }
            
            if(mostrandoFavoritos) {
                librosFiltrados = librosPorLetra.filter(l => db.esFavorito(l.id));
            } else {
                librosFiltrados = librosPorLetra;
            }
            
            pagina=1;
            mostrarLibros();
        });
    });

    // Filtro de Favoritos
    btnFavoritos.addEventListener("click", () => {
        mostrandoFavoritos = !mostrandoFavoritos;
        
        if(mostrandoFavoritos) {
            librosFiltrados = db.obtenerSoloFavoritos();
            btnFavoritos.classList.add('activo');
            btnFavoritos.textContent = '⭐ Ver Todos';
        } else {
            librosFiltrados = [...libros];
            btnFavoritos.classList.remove('activo');
            btnFavoritos.textContent = '⭐ Ver Favoritos';
        }
        
        pagina = 1;
        mostrarLibros();
    });

    // Paginación
    prevBtn.addEventListener("click",()=>{ if(pagina>1){pagina--; mostrarLibros();} });
    nextBtn.addEventListener("click",()=>{ if(pagina<Math.ceil(librosFiltrados.length/librosPorPagina)){pagina++; mostrarLibros();} });

    mostrarLibros();
});