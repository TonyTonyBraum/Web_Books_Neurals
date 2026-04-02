// Crear navbar directamente sin fetch
document.addEventListener('DOMContentLoaded', () => {
    const navbarHTML = `
        <nav class="navbar">
            <div class="nav-container">
                <div class="logo">Web Books Neural</div>
                <ul class="nav-links">
                    <li><a href="index.html">Inicio</a></li>
                    <li><a href="catalogo.html">Catálogo</a></li>
                    <li><a href="tendencias.html">Tendencias</a></li>
                    <li><a href="#contacto">Contacto</a></li>
                    <li><a href="admin.html">Admin</a></li>
                </ul>
            </div>
        </nav>
    `;
    
    // Insertar navbar al inicio del body
    document.body.insertAdjacentHTML('afterbegin', navbarHTML);
    
    // Marcar el link activo según la página actual
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    // Agregar funcionalidad de scroll suave a #contacto
    document.querySelectorAll('a[href="#contacto"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const contactoSection = document.getElementById('contacto');
            if (contactoSection) {
                contactoSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                // Si estamos en otra página, redirigir al index y luego scroll
                window.location.href = 'index.html#contacto';
            }
        });
    });
});