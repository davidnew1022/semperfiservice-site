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

    const isHomePage =
        window.location.pathname.endsWith("/index.html") &&
        !window.location.pathname.includes("/company/") &&
        !window.location.pathname.includes("/capabilities/") &&
        !window.location.pathname.includes("/quality/") &&
        !window.location.pathname.includes("/government/") &&
        !window.location.pathname.includes("/contact/");

    if (!isHomePage && window.scrollY === 0) {
        window.addEventListener("load", () => {
            window.scrollTo({
                top: 72,
                behavior: "auto"
            });
        });
    }
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
// =========================
// CONTACT PAGE: directory routing + packaging quote toggle
// =========================
(function () {
    const requestFormSection = document.getElementById("request-form");
    const requestType = document.getElementById("request-type");
    const preferredContact = document.getElementById("preferred-contact");
    const packagingFields = document.getElementById("packaging-quote-fields");
    const directoryCards = document.querySelectorAll("[data-form-target='request-form']");

    if (!requestFormSection || !requestType || !preferredContact || !directoryCards.length) {
        return;
    }

    function syncPackagingFields() {
        const isPackagingQuote = requestType.value === "Packaging Quote";

        if (packagingFields) {
            packagingFields.hidden = !isPackagingQuote;
        }

        if (isPackagingQuote) {
            preferredContact.value = "Sales";
        }
    }

    function routeDirectoryCard(card) {
        const requestValue = card.getAttribute("data-request-type") || "";
        const directoryValue = card.getAttribute("data-directory") || "";

        if (requestValue) {
            requestType.value = requestValue;
        }

        if (directoryValue) {
            preferredContact.value = directoryValue;
        }

        syncPackagingFields();

        const formElement = document.getElementById("sfs-contact-form");
        const scrollTarget = formElement || requestFormSection;
        const header = document.querySelector(".site-header");
        const headerOffset = header ? header.offsetHeight + 16 : 16;
        const targetTop = scrollTarget.getBoundingClientRect().top + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: targetTop,
            behavior: "smooth"
        });
    }

    directoryCards.forEach((card) => {
        card.addEventListener("click", function () {
            routeDirectoryCard(card);
        });

        card.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                routeDirectoryCard(card);
            }
        });
    });

    requestType.addEventListener("change", syncPackagingFields);

    syncPackagingFields();
})();