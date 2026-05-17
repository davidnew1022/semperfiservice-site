function initMobileNav() {
    const navToggle = document.getElementById("nav-toggle");
    const siteNav = document.getElementById("site-nav");

    if (!navToggle || !siteNav) return;

    const closeMobileMenu = () => {
        siteNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
    };

    navToggle.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        const isOpen = siteNav.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", (event) => {
        if (!siteNav.contains(event.target) && !navToggle.contains(event.target)) {
            closeMobileMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 860) {
            closeMobileMenu();
        }
    });
}

function closeMobileNav() {
    const navToggle = document.getElementById("nav-toggle");
    const siteNav = document.getElementById("site-nav");

    if (!navToggle || !siteNav) return;

    siteNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
}