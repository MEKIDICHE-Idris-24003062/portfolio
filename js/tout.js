
// Cursor Spotlight Effect
(function () {
    const spotlight = document.getElementById('cursor-spotlight');
    if (!spotlight) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId = null;

    // Detect touch devices — disable the effect on mobile
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!spotlight.classList.contains('is-active')) {
            spotlight.classList.add('is-active');
        }
    });

    document.addEventListener('mouseleave', () => {
        spotlight.classList.remove('is-active');
    });

    // Check dark mode to adjust spotlight color & size
    function getSpotlightConfig() {
        const isDark = document.documentElement.classList.contains('dark');
        return isDark
            ? { color: 'rgba(56, 189, 248, 0.10)', radius: 650, spread: 40 }
            : { color: 'rgba(59, 130, 246, 0.22)', radius: 800, spread: 50 };
    }

    // Main animation loop with dynamic color
    function updateSpotlightDynamic() {
        currentX += (mouseX - currentX) * 0.15;
        currentY += (mouseY - currentY) * 0.15;

        const { color, radius, spread } = getSpotlightConfig();
        spotlight.style.background = `radial-gradient(${radius}px circle at ${currentX}px ${currentY}px, ${color}, transparent ${spread}%)`;

        rafId = requestAnimationFrame(updateSpotlightDynamic);
    }

    // Start the animation loop
    updateSpotlightDynamic();
})();

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
    menu.classList.toggle('is-open');
});

// Close mobile menu on link click
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        menu.classList.remove('is-open');
    });
});

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
            mousewheel: {
                forceToAxis: true,
                sensitivity: 1,
                thresholdDelta: 20,
            },
            keyboard: {
                enabled: true,
                onlyInViewport: false,
            },
            effect: 'slide',
            speed: 600,
            spaceBetween: 50,
        });
    }

    // Preloader fade out when animation ends
    const loaderText = document.querySelector('.loader-text');
    const preloader = document.getElementById('preloader');

    if (loaderText && preloader) {
        loaderText.addEventListener('animationend', () => {
            setTimeout(() => {
                preloader.classList.add('preloader-hidden');

                setTimeout(() => {
                    preloader.classList.add('hidden');
                }, 700);
            }, 300);
        });
    } else if (preloader) {
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
        card.addEventListener('click', (e) => {
            // Don't open modal if user clicked a direct link inside the card
            if (e.target.closest('a')) return;

            const index = card.getAttribute('data-index');

            // Open Modal
            modal.classList.add('is-open');
            document.body.style.overflow = 'hidden';

            // Update & Go to the specific slide
            if (projectsSwiper) {
                projectsSwiper.update();
                projectsSwiper.slideToLoop(parseInt(index), 0);
            }
        });
    });

    const closeModal = () => {
        if (!modal) return;
        modal.classList.remove('is-open');
        document.body.style.overflow = '';
    };

    closeBtn?.addEventListener('click', closeModal);
    backdrop?.addEventListener('click', closeModal);
});