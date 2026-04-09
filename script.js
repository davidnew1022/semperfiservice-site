/* =========================
FILE: script.js
Final status:
- FINAL for mobile nav toggle + Home dropdown behavior
- NOT FINAL for advanced interactions, animations, or form submission

Purpose:
- Keep JS minimal
- Handle mobile navigation
- Handle Home dropdown on desktop and mobile
========================= */

document.addEventListener("DOMContentLoaded", () => {
    const navToggle = document.getElementById("nav-toggle");
    const siteNav = document.getElementById("site-nav");
    const homeDropdown = document.querySelector(".nav-dropdown");
    const homeDropdownToggle = document.querySelector(".nav-dropdown-toggle");
    const homeDropdownLinks = homeDropdown
        ? homeDropdown.querySelectorAll(".nav-dropdown-menu a")
        : [];

    const closeMobileMenu = () => {
        if (siteNav && navToggle) {
            siteNav.classList.remove("is-open");
            navToggle.setAttribute("aria-expanded", "false");
        }
    };

    const closeHomeDropdown = () => {
        if (homeDropdown && homeDropdownToggle) {
            homeDropdown.classList.remove("is-open");
            homeDropdownToggle.setAttribute("aria-expanded", "false");
        }
    };

    if (navToggle && siteNav) {
        navToggle.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            const isOpen = siteNav.classList.toggle("is-open");
            navToggle.setAttribute("aria-expanded", String(isOpen));

            if (!isOpen) {
                closeHomeDropdown();
            }
        });
    }

    if (homeDropdown && homeDropdownToggle) {
        homeDropdownToggle.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            const isOpen = homeDropdown.classList.toggle("is-open");
            homeDropdownToggle.setAttribute("aria-expanded", String(isOpen));
        });

        homeDropdownLinks.forEach((link) => {
            link.addEventListener("click", () => {
                closeHomeDropdown();
                closeMobileMenu();
            });
        });
    }

    if (siteNav) {
        siteNav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                closeHomeDropdown();
                closeMobileMenu();
            });
        });
    }

    document.addEventListener("click", (event) => {
        if (homeDropdown && !homeDropdown.contains(event.target)) {
            closeHomeDropdown();
        }

        if (
            siteNav &&
            navToggle &&
            !siteNav.contains(event.target) &&
            !navToggle.contains(event.target)
        ) {
            closeMobileMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 860) {
            closeHomeDropdown();
            closeMobileMenu();
        }
    });
});

/* NOT FINAL: Future options for this file:
- sticky header shrink effect
- scroll animations
- active nav highlighting
- real form validation
- AJAX or backend form submission
*/
