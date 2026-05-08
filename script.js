/* =========================
FILE: script.js
Purpose:
- Mobile nav toggle
- Dropdown behavior
- Active Home dropdown highlight
- Scroll reveal animations
- Capability statement modal
- Contact page routing / query prefill
========================= */

document.addEventListener("DOMContentLoaded", () => {
    const navToggle = document.getElementById("nav-toggle");
    const siteNav = document.getElementById("site-nav");
    const navDropdowns = document.querySelectorAll(".nav-dropdown");

    const closeMobileMenu = () => {
        if (!siteNav || !navToggle) return;

        siteNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
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

    const markHomeDropdownCurrent = () => {
        const path = window.location.pathname.replace(/\/+$/, "");
        const isHomePage =
            document.body.classList.contains("home-page") ||
            path === "" ||
            path.endsWith("/index.html") ||
            path.endsWith("/semperfiservice") ||
            path.endsWith("/semperfiservices");

        if (!isHomePage) return;

        const homeDropdown = document.getElementById("home-dropdown-menu")?.closest(".nav-dropdown");
        const homeOverviewLink = document.querySelector("#home-dropdown-menu a[href='index.html#hero']");

        if (homeDropdown) {
            homeDropdown.classList.add("is-current");
        }

        if (homeOverviewLink) {
            homeOverviewLink.setAttribute("aria-current", "page");
        }
    };

    markHomeDropdownCurrent();

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

            const wasOpen = dropdown.classList.contains("is-open");

            closeAllDropdowns();

            if (!wasOpen) {
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
        const clickedInsideDropdown = Array.from(navDropdowns).some((dropdown) =>
            dropdown.contains(event.target)
        );

        if (!clickedInsideDropdown) {
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

    const revealItems = document.querySelectorAll(
        ".reveal, .reveal-left, .reveal-right, .reveal-scale"
    );

    if (revealItems.length) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        revealItems.forEach((item) => {
            revealObserver.observe(item);
        });
    }

    const isInteriorPage =
        document.body.classList.contains("company-page") ||
        document.body.classList.contains("capabilities-page") ||
        document.body.classList.contains("quality-page") ||
        document.body.classList.contains("government-page") ||
        document.body.classList.contains("contact-page");

    if (isInteriorPage && !window.location.hash && window.scrollY === 0) {
        window.addEventListener("load", () => {
            window.scrollTo({
                top: 72,
                behavior: "auto"
            });
        });
    }

    setupContactPageRouting();
});

function handleQuoteClick(e) {
    if (e) {
        e.preventDefault();
    }

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
    const isNestedPage = window.location.pathname.includes("/");
    const pdfPath = isNestedPage
        ? "../assets/SFS_Capability_Statement.pdf"
        : "assets/SFS_Capability_Statement.pdf";

    window.open(pdfPath, "_blank");
    closeQuoteModal();
}

function goToContactPage() {
    const isNestedPage =
        window.location.pathname.includes("/company/") ||
        window.location.pathname.includes("/capabilities/") ||
        window.location.pathname.includes("/quality/") ||
        window.location.pathname.includes("/government/") ||
        window.location.pathname.includes("/contact/");

    window.location.href = isNestedPage
        ? "../contact/index.html"
        : "contact/index.html";
}

function setupContactPageRouting() {
    const requestFormSection = document.getElementById("request-form");
    const requestType = document.getElementById("request-type");
    const preferredContact = document.getElementById("preferred-contact");
    const packagingFields = document.getElementById("packaging-quote-fields");
    const directoryCards = document.querySelectorAll("[data-form-target='request-form']");

    if (!requestFormSection || !requestType || !preferredContact) {
        return;
    }

    const syncPackagingFields = () => {
        const isPackagingQuote = requestType.value === "Packaging Quote";

        if (packagingFields) {
            packagingFields.hidden = !isPackagingQuote;
        }

        if (isPackagingQuote) {
            preferredContact.value = "Sales";
        }
    };

    const scrollToRequestForm = (behavior = "smooth") => {
        const formElement = document.getElementById("sfs-contact-form");
        const scrollTarget = formElement || requestFormSection;
        const header = document.querySelector(".site-header");
        const headerOffset = header ? header.offsetHeight + 16 : 16;
        const targetTop =
            scrollTarget.getBoundingClientRect().top +
            window.pageYOffset -
            headerOffset;

        window.scrollTo({
            top: targetTop,
            behavior
        });
    };

    const routeDirectoryCard = (card) => {
        const requestValue = card.getAttribute("data-request-type") || "";
        const directoryValue = card.getAttribute("data-directory") || "";

        if (requestValue) {
            requestType.value = requestValue;
        }

        if (directoryValue) {
            preferredContact.value = directoryValue;
        }

        syncPackagingFields();
        scrollToRequestForm("smooth");
    };

    directoryCards.forEach((card) => {
        card.addEventListener("click", () => {
            routeDirectoryCard(card);
        });

        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                routeDirectoryCard(card);
            }
        });
    });

    requestType.addEventListener("change", syncPackagingFields);

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

    if (requestParam || directoryParam) {
        window.addEventListener("load", () => {
            scrollToRequestForm("auto");
        });
    }
}
// =========================
// CAPABILITY STATEMENT MODAL
// =========================
function handleQuoteClick(e) {
    if (e) {
        e.preventDefault();
    }

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

function isNestedPage() {
    return (
        window.location.pathname.includes("/company/") ||
        window.location.pathname.includes("/capabilities/") ||
        window.location.pathname.includes("/quality/") ||
        window.location.pathname.includes("/government/") ||
        window.location.pathname.includes("/contact/")
    );
}

function downloadCapabilitiesStatement() {
    const pdfPath = isNestedPage()
        ? "../assets/SFS_Capability_Statement.pdf"
        : "assets/SFS_Capability_Statement.pdf";

    window.open(pdfPath, "_blank");
    closeQuoteModal();
}

function goToContactPage() {
    window.location.href = isNestedPage()
        ? "../contact/index.html"
        : "contact/index.html";
}

// =========================
// CONTACT PAGE: DIRECTORY ROUTING + PACKAGING QUOTE TOGGLE
// =========================
(function () {
    const requestFormSection = document.getElementById("request-form");
    const requestType = document.getElementById("request-type");
    const preferredContact = document.getElementById("preferred-contact");
    const packagingFields = document.getElementById("packaging-quote-fields");
    const directoryCards = document.querySelectorAll("[data-form-target='request-form']");

    // Only run this block on the Contact page.
    if (!requestFormSection || !requestType || !preferredContact) {
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

    function scrollToRequestForm(behavior) {
        const formElement = document.getElementById("sfs-contact-form");
        const scrollTarget = formElement || requestFormSection;
        const header = document.querySelector(".site-header");
        const headerOffset = header ? header.offsetHeight + 16 : 16;

        const targetTop =
            scrollTarget.getBoundingClientRect().top +
            window.pageYOffset -
            headerOffset;

        window.scrollTo({
            top: targetTop,
            behavior: behavior
        });
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
        scrollToRequestForm("smooth");
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

        if (requestParam || directoryParam) {
            window.addEventListener("load", function () {
                scrollToRequestForm("auto");
            });
        }
    }

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

    if (!animatedItems.length) {
        return;
    }

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

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