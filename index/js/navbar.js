function loadNavbar() {
  const navbarHTML = `
    <header>
      <nav class="navbar">
        <h1 class="logo"><a href="index.html">Web Books Neural</a></h1>
        <ul class="nav-links">
          <li><a href="index.html#inicio">Inicio</a></li>
          <li><a href="catalogo.html">Catálogo</a></li>
          <li><a href="index.html#tendencias">Tendencias</a></li>
          <li><a href="index.html#contacto">Contacto</a></li>
        </ul>
        <div class="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>
    </header>
  `;
  
  document.body.insertAdjacentHTML('afterbegin', navbarHTML);
  
  // Activar menú hamburguesa
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      hamburger.classList.toggle('active');
    });
  }
  
  // Cerrar menú al hacer clic en un link
  const links = document.querySelectorAll('.nav-links a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      hamburger.classList.remove('active');
    });
  });
}

// Cargar navbar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', loadNavbar);