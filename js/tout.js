
// Init AOS (Animations)
AOS.init({
    once: true,
    offset: 50,
    duration: 800,
});

// Dark Mode Logic
const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleMobile = document.getElementById('theme-toggle-mobile');
const html = document.documentElement;

function toggleTheme() {
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        html.classList.add('light');
        localStorage.setItem('theme', 'light');
    } else {
        html.classList.add('dark');
        html.classList.remove('light');
        localStorage.setItem('theme', 'dark');
    }
}

// Check saved theme
if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.classList.add('dark');
} else {
    html.classList.remove('dark');
}

themeToggleBtn.addEventListener('click', toggleTheme);
themeToggleMobile.addEventListener('click', toggleTheme);

// Mobile Menu Logic
const btn = document.getElementById('mobile-menu-btn');
const menu = document.getElementById('mobile-menu');

btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
});

// Close mobile menu on link click
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        menu.classList.add('hidden');
    });
});

tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: '#3b82f6',
                dark: {
                    900: '#0f172a',
                    800: '#1e293b',
                    700: '#334155',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                }
            }
        }
    }
}

// Init Swiper (Projects Slider)
let projectsSwiper;
document.addEventListener('DOMContentLoaded', () => {
    if (typeof Swiper !== 'undefined') {
        projectsSwiper = new Swiper('.projects-swiper', {
            loop: true,
            grabCursor: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            effect: 'slide',
            speed: 600,
            spaceBetween: 50,
            autoHeight: true
        });
    }

    // Preloader fade out when animation ends
    const loaderText = document.querySelector('.loader-text');
    const preloader = document.getElementById('preloader');

    if (loaderText && preloader) {
        loaderText.addEventListener('animationend', () => {
            // Un petit délai après le remplissage pour profiter du logo complet
            setTimeout(() => {
                preloader.classList.add('opacity-0');
                preloader.classList.add('preloader-hidden');

                // Wait for the transition defined in CSS/HTML (duration-700) to clear it from DOM mostly
                setTimeout(() => {
                    preloader.classList.add('hidden');
                }, 700);
            }, 300);
        });
    } else if (preloader) {
        // Fallback s'il n'y a pas l'animation
        window.addEventListener('load', () => {
            preloader.classList.add('hidden');
        });
    }

    // Modal / Fullscreen Swiper Logic
    const modal = document.getElementById('project-modal');
    const closeBtn = document.getElementById('modal-close');
    const backdrop = document.getElementById('modal-backdrop');

    // Make project cards clickable
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => {
            const index = card.getAttribute('data-index');

            // Open Modal first, so DOM is interactable for size calculations
            modal.classList.remove('opacity-0', 'pointer-events-none');
            document.body.style.overflow = 'hidden'; // prevent background scrolling

            // Update & Go to the specific slide
            if (projectsSwiper) {
                projectsSwiper.update(); // Fixes sizing issues inside hidden containers
                projectsSwiper.slideToLoop(parseInt(index), 0); // speed 0 to snap instantly
            }
        });
    });

    const closeModal = () => {
        if (!modal) return;
        modal.classList.add('opacity-0', 'pointer-events-none');
        document.body.style.overflow = '';
    };

    closeBtn?.addEventListener('click', closeModal);
    backdrop?.addEventListener('click', closeModal);
});