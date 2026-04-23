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
    const navDropdowns = document.querySelectorAll(".nav-dropdown");

    const closeMobileMenu = () => {
        if (siteNav && navToggle) {
            siteNav.classList.remove("is-open");
            navToggle.setAttribute("aria-expanded", "false");
        }
    };

    const closeAllDropdowns = () => {
        navDropdowns.forEach((dropdown) => {
            const toggle = dropdown.querySelector(".nav-dropdown-toggle");
            dropdown.classList.remove("is-open");
            if (toggle) {
                toggle.setAttribute("aria-expanded", "false");
            }
        });
    };

    if (navToggle && siteNav) {
        navToggle.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            const isOpen = siteNav.classList.toggle("is-open");
            navToggle.setAttribute("aria-expanded", String(isOpen));

            if (!isOpen) {
                closeAllDropdowns();
            }
        });
    }

    navDropdowns.forEach((dropdown) => {
        const toggle = dropdown.querySelector(".nav-dropdown-toggle");
        const links = dropdown.querySelectorAll(".nav-dropdown-menu a");

        if (!toggle) return;

        toggle.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            const isOpen = dropdown.classList.contains("is-open");

            closeAllDropdowns();

            if (!isOpen) {
                dropdown.classList.add("is-open");
                toggle.setAttribute("aria-expanded", "true");
            }
        });

        links.forEach((link) => {
            link.addEventListener("click", () => {
                closeAllDropdowns();
                closeMobileMenu();
            });
        });
    });

    document.addEventListener("click", (event) => {
        const clickedInsideAnyDropdown = Array.from(navDropdowns).some((dropdown) =>
            dropdown.contains(event.target)
        );

        if (!clickedInsideAnyDropdown) {
            closeAllDropdowns();
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
            closeAllDropdowns();
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

    function applyQueryPrefill() {
        const params = new URLSearchParams(window.location.search);
        const requestParam = params.get("request");
        const directoryParam = params.get("directory");

        if (requestParam) {
            requestType.value = requestParam;
        }

        if (directoryParam) {
            preferredContact.value = directoryParam;
        }

        syncPackagingFields();

        const shouldScrollToForm = requestParam || directoryParam;
        if (shouldScrollToForm && requestFormSection) {
            window.addEventListener("load", () => {
                const formElement = document.getElementById("sfs-contact-form");
                const scrollTarget = formElement || requestFormSection;
                const header = document.querySelector(".site-header");
                const headerOffset = header ? header.offsetHeight + 16 : 16;
                const targetTop = scrollTarget.getBoundingClientRect().top + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: targetTop,
                    behavior: "auto"
                });
            });
        }
    }

    requestType.addEventListener("change", syncPackagingFields);

    syncPackagingFields();
    requestType.addEventListener("change", syncPackagingFields);

    syncPackagingFields();
    applyQueryPrefill();
})();
// =========================
// SCROLL REVEAL ANIMATIONS
// =========================
(function () {
    const animatedItems = document.querySelectorAll(
        ".reveal, .reveal-left, .reveal-right, .reveal-scale"
    );

    if (!animatedItems.length) return;

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add("is-visible");
                obs.unobserve(entry.target);
            });
        },
        {
            threshold: 0.14,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    animatedItems.forEach((item) => observer.observe(item));
})();