document.addEventListener("DOMContentLoaded", () => {
    if (typeof markCurrentHomeDropdown === "function") {
        markCurrentHomeDropdown();
    }

    if (typeof initMobileNav === "function") {
        initMobileNav();
    }

    if (typeof initDropdowns === "function") {
        initDropdowns();
    }

    if (typeof initContactPageRouting === "function") {
        initContactPageRouting();
    }

    /* Reveal self-starts from js/reveal.js. */

    initScrollCloudDrift();
    initPortraitDrift();
    initHomeRequestFields();
    initBrowserTabFavicon();
});

function initScrollCloudDrift() {
    const cloudSections = document.querySelectorAll(".sfs-cloud-drift");

    if (!cloudSections.length) return;

    const updateClouds = () => {
        const viewportHeight = window.innerHeight;

        cloudSections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            const progress = 1 - rect.top / viewportHeight;
            const clamped = Math.max(0, Math.min(1, progress));

            const isReverse = section.classList.contains("sfs-cloud-drift-reverse");

            const yMove = (clamped - 0.5) * (isReverse ? 16 : -16);
            const xMove = (clamped - 0.5) * (isReverse ? -26 : 26);

            section.style.setProperty("--cloud-x", `${50 + xMove}%`);
            section.style.setProperty("--cloud-y", `${50 + yMove}%`);
        });
    };

    updateClouds();

    window.addEventListener("scroll", updateClouds, { passive: true });
    window.addEventListener("resize", updateClouds);
}

function initPortraitDrift() {
    const portraitSections = document.querySelectorAll(".company-leader-section");

    if (!portraitSections.length) return;

    const updatePortraits = () => {
        const viewportHeight = window.innerHeight;

        portraitSections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            const progress = 1 - rect.top / viewportHeight;
            const clamped = Math.max(0, Math.min(1, progress));

            const isReverse = section.classList.contains("company-leader-david");

            const revealStart = viewportHeight * 0.98;
            const revealEnd = viewportHeight * 0.38;
            const revealRaw = (revealStart - rect.top) / (revealStart - revealEnd);
            const revealClamped = Math.max(0, Math.min(1, revealRaw));
            const reveal = revealClamped * revealClamped * (3 - 2 * revealClamped);

            const eased = clamped * clamped * (3 - 2 * clamped);

            const xMove = (eased - 0.5) * (isReverse ? -6 : 6);
            const yMove = (eased - 0.5) * (isReverse ? 3 : -3);

            const scale = 1.08 - (reveal * 0.025);

            section.style.setProperty("--portrait-x", `${xMove}px`);
            section.style.setProperty("--portrait-y", `${yMove}px`);
            section.style.setProperty("--portrait-reveal", reveal);
            section.style.setProperty("--portrait-scale", scale);
        });
    };

    updatePortraits();

    window.addEventListener("scroll", updatePortraits, { passive: true });
    window.addEventListener("resize", updatePortraits);
}

function initHomeRequestFields() {
    const requestType = document.getElementById("home-request-type");
    const nsnFields = document.getElementById("home-nsn-sourcing-fields");
    const hardwareFields = document.getElementById("home-aerospace-hardware-fields");

    if (!requestType) return;

    const syncHomeRequestFields = () => {
        if (nsnFields) {
            nsnFields.hidden = requestType.value !== "nsn-sourcing";
        }

        if (hardwareFields) {
            hardwareFields.hidden = requestType.value !== "aerospace-hardware";
        }
    };

    requestType.addEventListener("change", syncHomeRequestFields);
    syncHomeRequestFields();
}

function initBrowserTabFavicon() {
    const favicon = document.querySelector("link[rel='icon']");
    const shortcutIcon = document.querySelector("link[rel='shortcut icon']");

    const isSubpage = window.location.pathname.split("/").filter(Boolean).length > 0;
    const iconPath = isSubpage
        ? "../assets/images/brand/logo2.png?v=15"
        : "assets/images/brand/logo2.png?v=15";

    if (favicon) {
        favicon.href = iconPath;
    }

    if (shortcutIcon) {
        shortcutIcon.href = iconPath;
    }
}