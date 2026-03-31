document.addEventListener("DOMContentLoaded", () => {

    const librosBase = [
        { titulo:"Manual de Neurología", descripcion:"Guía para médicos y estudiantes", imagen:"index/img/B2.png", pdf:"https://drive.google.com/file/d/1UwpL4VElvt6tfB3W49PyVkIVq-ZvBAEW/preview" },
        { titulo:"Neuroanatomía y neurofisiología", descripcion:"Neuroplasticidad y comportamiento", imagen:"index/img/B1.png", pdf:"https://drive.google.com/file/d/10g-guk7jlfz4v1f1B9ES3kIx7q7wXXsm/preview" },
        { titulo:"Neurofisiología Humana", descripcion:"Redes neuronales avanzadas", imagen:"index/img/B3.png", pdf:"https://drive.google.com/file/d/1U6NAmwHF6xrTnBOAHMVPVfHGX7ivhN5e/preview" }
    ];

    const libros = [];
    for(let i=0;i<5;i++){ libros.push(...librosBase); }

    const catalogo = document.querySelector(".catalogo");
    const buscador = document.getElementById("buscador");
    const letras = document.querySelectorAll(".filtro-letras .letra");
    const prevBtn = document.getElementById("prev");
    const nextBtn = document.getElementById("next");
    const paginaActual = document.getElementById("paginaActual");

    // Modal detalle
    const detalle = document.getElementById("detalleLibro");
    const detallePortada = document.getElementById("detallePortada");
    const detalleTitulo = document.getElementById("detalleTitulo");
    const detalleDescripcion = document.getElementById("detalleDescripcion");
    const abrirLibroDetalle = document.getElementById("abrirLibroDetalle");
    const cerrarDetalle = document.getElementById("cerrarDetalle");
    const comentariosContainer = document.getElementById("comentariosContainer");
    const nuevoComentario = document.getElementById("nuevoComentario");
    const guardarComentario = document.getElementById("guardarComentario");

    let librosFiltrados = [...libros];
    let pagina = 1;
    const librosPorPagina = 6;

    function mostrarLibros(){
        catalogo.innerHTML="";
        const inicio=(pagina-1)*librosPorPagina;
        const fin=inicio+librosPorPagina;
        const librosPagina=librosFiltrados.slice(inicio,fin);

        librosPagina.forEach(libro=>{
            const card=document.createElement("div");
            card.classList.add("card");
            card.innerHTML=`
                <img src="${libro.imagen}" alt="${libro.titulo}">
                <h3>${libro.titulo}</h3>
                <p>${libro.descripcion}</p>
            `;
            card.addEventListener("click",()=>{ abrirDetalleLibro(libro); });
            catalogo.appendChild(card);
        });

        paginaActual.textContent=pagina;
    }

    function abrirDetalleLibro(libro){
        detalle.classList.remove("detalle-oculto");
        detallePortada.src=libro.imagen;
        detalleTitulo.textContent=libro.titulo;
        detalleDescripcion.textContent=libro.descripcion;
        abrirLibroDetalle.onclick=()=>{ window.open(libro.pdf,"_blank"); };

        const comentarios = JSON.parse(localStorage.getItem(libro.titulo)) || [];
        renderizarComentarios(comentarios);

        guardarComentario.onclick=()=>{
            const texto=nuevoComentario.value.trim();
            if(texto){
                comentarios.push(texto);
                localStorage.setItem(libro.titulo,JSON.stringify(comentarios));
                renderizarComentarios(comentarios);
                nuevoComentario.value="";
            }
        };
    }

    function renderizarComentarios(comentarios){
        comentariosContainer.innerHTML="";
        comentarios.forEach(c=>{
            const p=document.createElement("p");
            p.textContent="• "+c;
            comentariosContainer.appendChild(p);
        });
    }

    cerrarDetalle.onclick=()=>{ detalle.classList.add("detalle-oculto"); };

    // Buscador
    buscador.addEventListener("input",()=>{
        const termino=buscador.value.toLowerCase();
        librosFiltrados=libros.filter(l=>l.titulo.toLowerCase().includes(termino));
        pagina=1;
        mostrarLibros();
    });

    // Filtro letras
    letras.forEach(btn=>{
        btn.addEventListener("click",()=>{
            const letra=btn.dataset.letra;
            if(letra==="all") librosFiltrados=[...libros];
            else librosFiltrados=libros.filter(l=>l.titulo[0].toLowerCase()===letra.toLowerCase());
            pagina=1;
            mostrarLibros();
        });
    });

    // Paginación
    prevBtn.addEventListener("click",()=>{ if(pagina>1){pagina--; mostrarLibros();} });
    nextBtn.addEventListener("click",()=>{ if(pagina<Math.ceil(librosFiltrados.length/librosPorPagina)){pagina++; mostrarLibros();} });

    mostrarLibros();
});