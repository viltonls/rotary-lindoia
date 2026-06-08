/**
 * ROTARY LINDÓIA - MAIN SCRIPTS
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // 2. Sticky Header & Smooth Scrolling
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
            header.style.height = '70px';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            header.style.height = '80px';
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            // Ignora href="#" vazios
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileMenuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
                }

                // Scroll to element
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
        
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. Tabs for 'Sobre' section
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active to clicked
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // 4. Dynamic Form for 'Junte-se a nós'
    const selectInteresse = document.getElementById('tipo-interesse');
    const dynamicFields = document.getElementById('dynamic-fields');
    const empresaGroup = document.getElementById('empresa-group');

    if (selectInteresse) {
        selectInteresse.addEventListener('change', (e) => {
            const value = e.target.value;
            
            if (value !== "") {
                dynamicFields.classList.remove('hidden');
                
                // Show 'Empresa' field only for parceiro/patrocinador
                if (value === 'parceiro' || value === 'patrocinador') {
                    empresaGroup.style.display = 'block';
                } else {
                    empresaGroup.style.display = 'none';
                }
            } else {
                dynamicFields.classList.add('hidden');
            }
        });
    }

    // 5. Form Submissions Handling
    const joinForm = document.getElementById('join-form');
    const contactForm = document.getElementById('contact-form');

    const handleFormSubmission = async (form, e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        
        btn.textContent = 'Enviando...';
        btn.disabled = true;

        const formData = new FormData(form);

        try {
            const response = await fetch('enviar_email.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.status === 'success') {
                btn.textContent = 'Enviado com sucesso!';
                btn.style.backgroundColor = '#28a745'; // Green
                form.reset();
                
                if (form.id === 'join-form' && dynamicFields) {
                    dynamicFields.classList.add('hidden');
                }
            } else {
                btn.textContent = 'Erro ao enviar.';
                btn.style.backgroundColor = '#dc3545'; // Red
                console.error(result.message);
            }
        } catch (error) {
            btn.textContent = 'Erro de conexão.';
            btn.style.backgroundColor = '#dc3545'; // Red
            console.error('Erro na requisição:', error);
        } finally {
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = '';
                btn.disabled = false;
            }, 4000);
        }
    };

    if (joinForm) joinForm.addEventListener('submit', (e) => handleFormSubmission(joinForm, e));
    if (contactForm) contactForm.addEventListener('submit', (e) => handleFormSubmission(contactForm, e));
});
