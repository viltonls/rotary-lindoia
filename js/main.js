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
                // Close all dropdowns when menu is closed
                document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
            }
        });
    }

    // Dropdowns click toggle on mobile
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        if (toggle) {
            toggle.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Close other dropdowns
                    dropdowns.forEach(other => {
                        if (other !== dropdown) {
                            other.classList.remove('open');
                        }
                    });
                    
                    dropdown.classList.toggle('open');
                }
            });
        }
    });

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
            // Ignora rolagem direta no mobile para os seletores de submenu
            if (this.classList.contains('dropdown-toggle') && window.innerWidth <= 768) {
                return;
            }

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
                    
                    // Close all open dropdowns too
                    dropdowns.forEach(d => d.classList.remove('open'));
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

    // Helper function to manage tab groups
    const setupTabs = (btnSelector, contentSelector) => {
        const buttons = document.querySelectorAll(btnSelector);
        const contents = document.querySelectorAll(contentSelector);

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-target');
                const targetContent = document.getElementById(targetId);

                if (targetContent) {
                    // Remove active classes
                    buttons.forEach(b => b.classList.remove('active'));
                    contents.forEach(c => c.classList.remove('active'));

                    // Add active class to clicked button and target content
                    btn.classList.add('active');
                    targetContent.classList.add('active');
                }
            });
        });
    };

    // 3. Tabs for 'Sobre' section
    setupTabs('.about-tabs .tab-btn', '.about-tabs .tab-content');

    // 4. Tabs for 'Faça Parte' (Home Action Tabs)
    setupTabs('.action-tab-btn', '.action-tab-content');

    // 5. Tabs for 'Clube Satélite'
    setupTabs('.sat-tab-btn', '.sat-tab-content');

    // 6. Dynamic Form Fields (Show Company name only for Partner/Sponsor)
    const selectInteresse = document.getElementById('tipo-interesse');
    const empresaGroup = document.querySelector('.val-empresa-group');

    if (selectInteresse && empresaGroup) {
        selectInteresse.addEventListener('change', (e) => {
            const value = e.target.value;
            if (value === 'parceiro' || value === 'patrocinador') {
                empresaGroup.style.display = 'block';
                empresaGroup.querySelector('input').setAttribute('required', 'required');
            } else {
                empresaGroup.style.display = 'none';
                empresaGroup.querySelector('input').removeAttribute('required');
            }
        });
    }

    // 7. HTML5 Dialog Modals logic for Projects
    const openModalButtons = document.querySelectorAll('.open-modal');
    const modals = document.querySelectorAll('dialog.project-modal');

    openModalButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.showModal();
            }
        });
    });

    modals.forEach(modal => {
        // Close on button click
        const closeBtn = modal.querySelector('.close-modal-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.close();
            });
        }

        // Close on click outside (on backdrop)
        modal.addEventListener('click', (e) => {
            const rect = modal.getBoundingClientRect();
            const isInDialog = (
                rect.top <= e.clientY &&
                e.clientY <= rect.top + rect.height &&
                rect.left <= e.clientX &&
                e.clientX <= rect.left + rect.width
            );
            if (!isInDialog) {
                modal.close();
            }
        });
    });

    // 8. General Form Submissions Handling
    const ajaxForms = document.querySelectorAll('.dynamic-ajax-form');

    const handleFormSubmission = async (form, e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        btn.disabled = true;

        const formData = new FormData(form);

        try {
            const response = await fetch('enviar_email.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.status === 'success') {
                btn.innerHTML = '<i class="fas fa-check"></i> Enviado com sucesso!';
                btn.style.backgroundColor = '#28a745'; // Green
                form.reset();
                
                // If it has dynamic fields, reset them
                if (empresaGroup) {
                    empresaGroup.style.display = 'none';
                }
            } else {
                btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Erro ao enviar.';
                btn.style.backgroundColor = '#dc3545'; // Red
                console.error(result.message);
            }
        } catch (error) {
            btn.innerHTML = '<i class="fas fa-wifi"></i> Erro de conexão.';
            btn.style.backgroundColor = '#dc3545'; // Red
            console.error('Erro na requisição:', error);
        } finally {
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.backgroundColor = '';
                btn.disabled = false;
            }, 4000);
        }
    };

    ajaxForms.forEach(form => {
        form.addEventListener('submit', (e) => handleFormSubmission(form, e));
    });
});
