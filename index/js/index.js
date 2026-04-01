const libros = [
    {
        titulo: "Manual de Neurología",
        descripcion: "Guía para médicos y estudiantes",
        imagen: "index/img/B2.png",
        pdf: "https://drive.google.com/file/d/1UwpL4VElvt6tfB3W49PyVkIVq-ZvBAEW/preview"
    },
    {
        titulo: "Neuroanatomia y neruofisiologia en psicologia",
        descripcion: "Neuroplasticidad y comportamiento",
        imagen: "index/img/B1.png",
        pdf: "https://drive.google.com/file/d/10g-guk7jlfz4v1f1B9ES3kIx7q7wXXsm/preview"
    },
    {
        titulo: "Neurofisiologia Humana",
        descripcion: "Redes neuronales avanzadas",
        imagen: "index/img/B3.png",
        pdf: "https://drive.google.com/file/d/1U6NAmwHF6xrTnBOAHMVPVfHGX7ivhN5e/preview"
    }
];

const catalogo = document.querySelector(".catalogo");

libros.filter(libro => libro.imagen && libro.pdf).forEach(libro => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
        <img src="${libro.imagen}" alt="${libro.titulo}">
        <h3>${libro.titulo}</h3>
        <p>${libro.descripcion}</p>
    `;

    card.addEventListener("click", () => {
        abrirLibro(libro.pdf);
    });

    catalogo.appendChild(card);
});

function abrirLibro(url) {
    document.getElementById("visor").classList.remove("oculto");
    document.getElementById("frameLibro").src = url;
}

function cerrarVisor() {
    document.getElementById("visor").classList.add("oculto");
    document.getElementById("frameLibro").src = "";
}