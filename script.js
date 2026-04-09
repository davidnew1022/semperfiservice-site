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

const navToggle = document.getElementById("nav-toggle");
const siteNav = document.getElementById("site-nav");
const homeDropdown = document.querySelector(".nav-dropdown");
const homeDropdownToggle = document.querySelector(".nav-dropdown-toggle");
const homeDropdownLinks = homeDropdown
    ? homeDropdown.querySelectorAll(".nav-dropdown-menu a")
    : [];

/* FINAL: mobile nav toggle behavior */
if (navToggle && siteNav) {
    navToggle.addEventListener("click", (event) => {
        event.stopPropagation();

        const isOpen = siteNav.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));

        // Keep the Home dropdown closed when opening/closing the main mobile nav
        if (!isOpen && homeDropdown && homeDropdownToggle) {
            homeDropdown.classList.remove("is-open");
            homeDropdownToggle.setAttribute("aria-expanded", "false");
        }
    });
}

/* FINAL: Home dropdown toggle behavior */
if (homeDropdown && homeDropdownToggle) {
    homeDropdownToggle.addEventListener("click", (event) => {
        event.stopPropagation();

        const isOpen = homeDropdown.classList.toggle("is-open");
        homeDropdownToggle.setAttribute("aria-expanded", String(isOpen));
    });

    homeDropdownLinks.forEach((link) => {
        link.addEventListener("click", () => {
            homeDropdown.classList.remove("is-open");
            homeDropdownToggle.setAttribute("aria-expanded", "false");

            if (siteNav && navToggle) {
                siteNav.classList.remove("is-open");
                navToggle.setAttribute("aria-expanded", "false");
            }
        });
    });
}

/* FINAL: close mobile nav when any normal nav link is clicked */
if (siteNav && navToggle) {
    siteNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            siteNav.classList.remove("is-open");
            navToggle.setAttribute("aria-expanded", "false");

            if (homeDropdown && homeDropdownToggle) {
                homeDropdown.classList.remove("is-open");
                homeDropdownToggle.setAttribute("aria-expanded", "false");
            }
        });
    });
}

/* FINAL: close nav/dropdown when clicking outside */
document.addEventListener("click", (event) => {
    if (homeDropdown && homeDropdownToggle && !homeDropdown.contains(event.target)) {
        homeDropdown.classList.remove("is-open");
        homeDropdownToggle.setAttribute("aria-expanded", "false");
    }

    if (
        siteNav &&
        navToggle &&
        !siteNav.contains(event.target) &&
        !navToggle.contains(event.target)
    ) {
        siteNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
    }
});

/* FINAL: reset mobile states when resizing back to desktop */
window.addEventListener("resize", () => {
    if (window.innerWidth > 860) {
        if (siteNav && navToggle) {
            siteNav.classList.remove("is-open");
            navToggle.setAttribute("aria-expanded", "false");
        }

        if (homeDropdown && homeDropdownToggle) {
            homeDropdown.classList.remove("is-open");
            homeDropdownToggle.setAttribute("aria-expanded", "false");
        }
    }
});

/* NOT FINAL: Future options for this file:
- sticky header shrink effect
- scroll animations
- active nav highlighting
- real form validation
- AJAX or backend form submission
*/