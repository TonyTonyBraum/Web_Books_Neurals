// Crear footer directamente sin fetch
document.addEventListener('DOMContentLoaded', () => {
    const footerHTML = `
        <footer class="footer" id="contacto">
            <div class="footer-container">
                <div class="footer-section">
                    <h3>📚 Web Books Neural</h3>
                    <p>Tu plataforma de lectura científica especializada en neurología y ciencias del cerebro.</p>
                </div>

                <div class="footer-section">
                    <h3>📍 Contacto</h3>
                    <p>Email: <a href="mailto:info@webbooks.com">info@webbooks.com</a></p>
                    <p>Teléfono: <a href="tel:+34123456789">+34 123 456 789</a></p>
                    <p>Ubicación: Madrid, España</p>
                </div>

                <div class="footer-section">
                    <h3>🌐 Redes Sociales</h3>
                    <div class="social-links">
                        <a href="https://facebook.com" target="_blank" class="social-icon facebook" title="Facebook">
                            <i class="fab fa-facebook-f"></i>
                        </a>
                        <a href="https://twitter.com" target="_blank" class="social-icon twitter" title="Twitter">
                            <i class="fab fa-twitter"></i>
                        </a>
                        <a href="https://instagram.com" target="_blank" class="social-icon instagram" title="Instagram">
                            <i class="fab fa-instagram"></i>
                        </a>
                        <a href="https://wa.me/34123456789" target="_blank" class="social-icon whatsapp" title="WhatsApp">
                            <i class="fab fa-whatsapp"></i>
                        </a>
                    </div>
                </div>

                <div class="footer-section">
                    <h3>📋 Enlaces</h3>
                    <ul class="footer-links">
                        <li><a href="index.html">Inicio</a></li>
                        <li><a href="catalogo.html">Catálogo</a></li>
                        <li><a href="#">Términos de Uso</a></li>
                        <li><a href="#">Privacidad</a></li>
                    </ul>
                </div>
            </div>

            <div class="footer-bottom">
                <p>&copy; 2026 Web Books Neural. Todos los derechos reservados.</p>
            </div>
        </footer>
    `;
    
    // Insertar footer al final del body
    document.body.insertAdjacentHTML('beforeend', footerHTML);

    // Agregar funcionalidad de scroll suave a #contacto desde el footer
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