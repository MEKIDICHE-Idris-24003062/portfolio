
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

    const swiperEl = document.querySelector('.projects-swiper');
    if (typeof Swiper !== 'undefined' && swiperEl) {
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

            if (modal) {
                // Open Modal
                modal.classList.add('is-open');
                document.body.style.overflow = 'hidden';

                // Update & Go to the specific slide
                if (projectsSwiper) {
                    projectsSwiper.update();
                    projectsSwiper.slideToLoop(parseInt(index), 0);
                }
            }
        });
    });

    const closeModal = () => {
        if (!modal) return;
        modal.classList.remove('is-open');
        document.body.style.overflow = '';

        // Remove the ?p= parameter on close to keep URL clean (optional but good for UX)
        const url = new URL(window.location);
        if (url.searchParams.has('p')) {
            url.searchParams.delete('p');
            window.history.replaceState({}, document.title, url.pathname);
        }
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    // Auto-open modal if URL contains ?p=X (Used when linking from Hero text)
    if (modal && projectsSwiper) {
        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('p');
        if (projectId !== null) {
            // Wait slightly for Swiper to finish its internal initialization
            setTimeout(() => {
                modal.classList.add('is-open');
                document.body.style.overflow = 'hidden';
                projectsSwiper.update();
                projectsSwiper.slideToLoop(parseInt(projectId), 0);
            }, 100);
        }
    }

    // Hover Preview Logic for Hero Typography
    const hoverPreview = document.getElementById('hover-preview');
    if (hoverPreview) {
        const previewImg = document.getElementById('hover-preview-img');
        const previewDesc = document.getElementById('hover-preview-desc');
        const previewYear = document.getElementById('hover-preview-year');
        const previewTags = document.getElementById('hover-preview-tags');
        const typoLinks = document.querySelectorAll('.hero__typo-name');

        let isHovering = false;

        // Mouse move listener to follow cursor
        document.addEventListener('mousemove', (e) => {
            if (isHovering) {
                // Adjust position so it centers roughly on the cursor
                hoverPreview.style.left = `${e.clientX}px`;
                hoverPreview.style.top = `${e.clientY}px`;
            }
        });

        typoLinks.forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                isHovering = true;

                // Get data from data attributes
                const imgSrc = link.getAttribute('data-preview-img');
                const desc = link.getAttribute('data-preview-desc');
                const year = link.getAttribute('data-preview-year');
                const tags = link.getAttribute('data-preview-tags');

                // Populate card
                if (imgSrc) previewImg.src = imgSrc;
                if (desc) previewDesc.textContent = desc;
                if (year) previewYear.textContent = year;
                if (tags) previewTags.textContent = tags;

                // Position initially
                hoverPreview.style.left = `${e.clientX}px`;
                hoverPreview.style.top = `${e.clientY}px`;

                // Show card
                hoverPreview.classList.add('is-active');
            });

            link.addEventListener('mouseleave', () => {
                isHovering = false;
                hoverPreview.classList.remove('is-active');
            });
        });
    }

    // Manual + Auto Scroll Logic for Hero Typography (Infinite wheel/touch scroll)
    const typoTrack = document.querySelector('.hero__typo-track');
    if (typoTrack) {
        let currentTranslateY = 0;
        let targetTranslateY = 0;
        const MANUAL_SCROLL_SPEED = 0.8;
        const AUTO_SCROLL_SPEED = 0.5; // Controls the base automatic scroll speed

        // Let's use the isHovering variable from the hover preview logic to pause auto-scroll
        // It's defined above, but we'll read the state.

        window.addEventListener('wheel', (e) => {
            targetTranslateY += e.deltaY * MANUAL_SCROLL_SPEED;
        });

        let touchStartY = 0;
        window.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        });
        window.addEventListener('touchmove', (e) => {
            const touchY = e.touches[0].clientY;
            targetTranslateY += (touchStartY - touchY) * MANUAL_SCROLL_SPEED;
            touchStartY = touchY;
        });

        function animTypoScroll() {
            // Apply constant auto-scroll if the mouse is not hovering over a link
            // 'isHovering' acts as a flag for pausing
            if (!document.querySelector('.hover-preview.is-active')) {
                // Adjust auto-scroll direction. Usually we want it to go upwards.
                targetTranslateY += AUTO_SCROLL_SPEED;
            }

            // Because there are two identical sets of projects, exactly half the height represents one set
            const halfHeight = typoTrack.scrollHeight / 2;

            // Infinite loop handling
            if (targetTranslateY > halfHeight) {
                targetTranslateY -= halfHeight;
                currentTranslateY -= halfHeight;
            } else if (targetTranslateY < 0) {
                targetTranslateY += halfHeight;
                currentTranslateY += halfHeight;
            }

            // Smooth interpolation (lerp)
            currentTranslateY += (targetTranslateY - currentTranslateY) * 0.1;

            typoTrack.style.transform = `rotate(-12deg) translateY(-${currentTranslateY}px)`;
            requestAnimationFrame(animTypoScroll);
        }

        // Wait just a moment for the DOM and styling to fully layout before starting
        setTimeout(() => {
            animTypoScroll();
        }, 100);
    }
});