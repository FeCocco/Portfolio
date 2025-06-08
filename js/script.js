document.addEventListener('DOMContentLoaded', () => {

    /* ==========================
       1. TROCA DE TEMA
       ========================== */
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const htmlEl = document.documentElement;

    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        htmlEl.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'light') {
            themeToggleBtn.classList.replace('fa-moon', 'fa-sun');
        }
    }

    themeToggleBtn.addEventListener('click', () => {
        if (htmlEl.getAttribute('data-theme') === 'dark') {
            htmlEl.setAttribute('data-theme', 'light');
            themeToggleBtn.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'light');
        } else {
            htmlEl.setAttribute('data-theme', 'dark');
            themeToggleBtn.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'dark');
        }
    });

    /* ==================================
       2. ANIMAÇÃO DE SCROLL (REVERSÍVEL)
       ================================== */
    const animatedElements = document.querySelectorAll('.scroll-animate');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            entry.target.classList.toggle('visible', entry.isIntersecting);
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(element => {
        observer.observe(element);
    });

    /* ==================================
       3. LINK ATIVO NO MENU COM SCROLL
       ================================== */
    const navLinks = document.querySelectorAll('.nav-link');
    const allSections = document.querySelectorAll('main section');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        allSections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 150) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    /* =================================
       5. LÓGICA DE TRADUÇÃO (I18N)
       ================================= */
    const langOptions = document.querySelectorAll('.lang-option');
    let translations = {};

    const setLanguage = async (lang) => {
        const response = await fetch(`lang/${lang}.json`);
        translations = await response.json();
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang;
        document.querySelectorAll('[data-key]').forEach(element => {
            const key = element.getAttribute('data-key');
            if (translations[key]) {
                element.innerHTML = translations[key];
            }
        });
        langOptions.forEach(option => {
            option.classList.remove('active');
            if (option.getAttribute('data-lang') === lang) {
                option.classList.add('active');
            }
        });
    };

    langOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            setLanguage(e.target.getAttribute('data-lang'));
        });
    });

    const initialLang = localStorage.getItem('language') || (navigator.language.startsWith('pt') ? 'pt' : 'en');
    setLanguage(initialLang);

    /* =================================
       6. LÓGICA DO MODAL DE HABILIDADES
       ================================= */
    const skillTags = document.querySelectorAll('.skill-tag');
    const modalOverlay = document.getElementById('skill-modal-overlay');
    const modalTitle = document.getElementById('skill-modal-title');
    const modalDescription = document.getElementById('skill-modal-description');
    const closeModalBtn = document.getElementById('modal-close-btn');

    const openModal = (skill, description) => {
        modalTitle.innerText = skill;
        modalDescription.innerText = description;
        modalOverlay.style.display = 'flex';
        setTimeout(() => {
            modalOverlay.classList.add('visible');
            document.body.style.overflow = 'hidden';
        }, 10);
    };

    const closeModal = () => {
        modalOverlay.classList.remove('visible');
        setTimeout(() => {
            modalOverlay.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    };

    skillTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const skill = tag.getAttribute('data-skill');
            const description = tag.getAttribute('data-description');
            openModal(skill, description);
        });
    });

    closeModalBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) closeModal();
    });
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modalOverlay.classList.contains('visible')) {
            closeModal();
        }
    });
});