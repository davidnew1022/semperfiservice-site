function initDropdowns() {
    const navDropdowns = document.querySelectorAll(".nav-dropdown");

    if (!navDropdowns.length) return;

    const supplyPages = [
        "aircraft-parts-distributor",
        "nsn-parts-sourcing",
        "mil-std-packaging-support"
    ];

    const normalizePath = (path) => {
        return path
            .replace(/\\/g, "/")
            .replace(/\/index\.html$/, "/")
            .replace(/\/$/, "");
    };

    const currentPath = normalizePath(window.location.pathname);
    const currentSupplyPage = supplyPages.find((page) => currentPath.includes(page)) || "";

    const closeAllDropdowns = () => {
        navDropdowns.forEach((dropdown) => {
            const toggle = dropdown.querySelector(".nav-dropdown-toggle");

            dropdown.classList.remove("is-open");

            if (toggle) {
                toggle.setAttribute("aria-expanded", "false");
            }
        });

        document.querySelectorAll(".nav-supply-item.is-flyout-open").forEach((item) => {
            item.classList.remove("is-flyout-open");
        });
    };

    navDropdowns.forEach((dropdown) => {
        const toggle = dropdown.querySelector(".nav-dropdown-toggle");
        const firstLink = dropdown.querySelector(".nav-dropdown-menu a");
        const isSupply = dropdown.classList.contains("is-supply");

        if (!toggle) return;

        if (isSupply && currentSupplyPage) {
            dropdown.classList.add("is-current");

            dropdown.querySelectorAll(".nav-supply-item").forEach((item) => {
                if (item.dataset.supplyPage === currentSupplyPage) {
                    item.classList.add("is-current-sub");
                }
            });
        }

        if (!isSupply && firstLink) {
            const linkPath = normalizePath(new URL(firstLink.href, window.location.href).pathname);

            if (currentPath === linkPath || currentPath.startsWith(linkPath)) {
                dropdown.classList.add("is-current");
            }
        }

        toggle.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            const isCurrent = dropdown.classList.contains("is-current");

            if (!isCurrent && !isSupply && firstLink) {
                window.location.href = firstLink.href;
                return;
            }

            const wasOpen = dropdown.classList.contains("is-open");

            closeAllDropdowns();

            if (!wasOpen) {
                dropdown.classList.add("is-open");
                toggle.setAttribute("aria-expanded", "true");
            }
        });

        dropdown.querySelectorAll(".nav-dropdown-menu > a").forEach((link) => {
            link.addEventListener("click", () => {
                closeAllDropdowns();

                if (typeof closeMobileNav === "function") {
                    closeMobileNav();
                }
            });
        });
    });

    document.querySelectorAll(".nav-supply-item").forEach((item) => {
        const mainLink = item.querySelector(".nav-supply-main");

        if (!mainLink) return;

        mainLink.addEventListener("click", (event) => {
            if (!item.classList.contains("is-current-sub")) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            const wasOpen = item.classList.contains("is-flyout-open");

            document.querySelectorAll(".nav-supply-item.is-flyout-open").forEach((openItem) => {
                openItem.classList.remove("is-flyout-open");
            });

            if (!wasOpen) {
                item.classList.add("is-flyout-open");
            }
        });
    });

    document.addEventListener("click", (event) => {
        const clickedInsideDropdown = Array.from(navDropdowns).some((dropdown) => {
            return dropdown.contains(event.target);
        });

        if (!clickedInsideDropdown) {
            closeAllDropdowns();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 860) {
            closeAllDropdowns();
        }
    });
}

function markCurrentHomeDropdown() {
    const isHomePage = document.body.classList.contains("home-page");

    if (!isHomePage) return;

    const homeDropdown = document.getElementById("home-dropdown-menu")?.closest(".nav-dropdown");
    const homeOverviewLink =
        document.querySelector("#home-dropdown-menu a[href='#hero']") ||
        document.querySelector("#home-dropdown-menu a[href='index.html#hero']") ||
        document.querySelector("#home-dropdown-menu a[href='../index.html']");

    if (homeDropdown) {
        homeDropdown.classList.add("is-current");
    }

    if (homeOverviewLink) {
        homeOverviewLink.setAttribute("aria-current", "page");
    }
}