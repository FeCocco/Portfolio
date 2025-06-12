document.addEventListener('DOMContentLoaded', () => {

    /* ========================== TEMA ========================== */
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

    /* ================================== ANIMACAO DE SCROLL ================================== */
    const animatedElements = document.querySelectorAll('.scroll-animate');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            entry.target.classList.toggle('visible', entry.isIntersecting);
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(element => {
        observer.observe(element);
    });

    /* ================================== LINK ATIVO NO MENU ================================== */
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

    /* ================================= TRADUCAO ================================= */
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

    /* ================================= MODAL (HABILIDADES E CURSOS) ================================= */
    const modalOverlay = document.getElementById('modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const closeModalBtn = document.getElementById('modal-close-btn');

    const openModal = (title, description) => {
        modalTitle.innerText = title;
        modalDescription.innerText = description || "Descrição não encontrada.";
        modalOverlay.classList.add('visible');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modalOverlay.classList.remove('visible');
        document.body.style.overflow = '';
    };

    document.querySelectorAll('.skill-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const skill = tag.getAttribute('data-skill');
            const description = translations.skills && translations.skills[skill] ? translations.skills[skill] : '';
            openModal(skill, description);
        });
    });

    document.querySelectorAll('.course-item').forEach(item => {
        item.addEventListener('click', () => {
            const courseKey = item.getAttribute('data-course');
            const title = translations[`${courseKey}Name`];
            const description = translations.courses && translations.courses[courseKey] ? translations.courses[courseKey] : '';
            openModal(title, description);
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

    // Inicializa o idioma no final para garantir que 'translations' seja populado
    const initialLang = localStorage.getItem('language') || (navigator.language.startsWith('pt') ? 'pt' : 'en');
    setLanguage(initialLang);
});