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

            const isOpen = homeDropdown.classList.contains("is-open");

            if (isOpen) {
                homeDropdown.classList.remove("is-open");
                homeDropdownToggle.setAttribute("aria-expanded", "false");
                return;
            }

            homeDropdown.classList.add("is-open");
            homeDropdownToggle.setAttribute("aria-expanded", "true");
        });

        homeDropdownLinks.forEach((link) => {
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
    function handleQuoteClick(e) {
        e.preventDefault();

        const modal = document.getElementById("quote-modal");
        if (modal) {
            modal.classList.add("is-open");
            document.body.classList.add("modal-open");
        }
    }

    function closeQuoteModal() {
        const modal = document.getElementById("quote-modal");
        if (modal) {
            modal.classList.remove("is-open");
            document.body.classList.remove("modal-open");
        }
    }

    function downloadCapabilitiesStatement() {
        window.open("../assets/SFS_Capability_Statement.pdf", "_blank");
        closeQuoteModal();
    }
    function goToContactPage() {
        window.location.href = "../contact/index.html";
    }
/* NOT FINAL: Future options for this file:
- sticky header shrink effect
- scroll animations
- active nav highlighting
- real form validation
- AJAX or backend form submission
*/