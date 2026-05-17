/* =========================
FILE: js/reveal.js
Purpose:
- Site-wide scroll reveal engine
- Works on every page
- Does not depend on main.js
- Safe fallback if IntersectionObserver fails
========================= */

(function () {
    "use strict";

    const REVEAL_SELECTOR = [
        ".reveal",
        ".reveal-left",
        ".reveal-right",
        ".reveal-up",
        ".reveal-down",
        ".reveal-scale",
        ".reveal-soft",
        ".reveal-stagger",
        ".pill-load-left",
        ".pill-load-right",
        ".process-step",
        ".card",
        ".panel"
    ].join(", ");

    function markRevealReady(items) {
        items.forEach((item) => {
            item.classList.add("reveal-ready");
        });
    }

    function showItem(item) {
        item.classList.add("is-visible");
        item.setAttribute("data-reveal-visible", "true");
    }

    function revealNearViewport(items) {
        items.forEach((item) => {
            if (item.classList.contains("is-visible")) {
                return;
            }

            const rect = item.getBoundingClientRect();
            const isNearViewport =
                rect.top < window.innerHeight + 140 &&
                rect.bottom > -140;

            if (isNearViewport) {
                showItem(item);
            }
        });
    }

    function initRevealAnimations(root = document) {
        const items = Array.from(root.querySelectorAll(REVEAL_SELECTOR));

        if (!items.length) {
            return;
        }

        markRevealReady(items);

        if (!("IntersectionObserver" in window)) {
            items.forEach(showItem);
            return;
        }

        const observer = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    showItem(entry.target);
                    obs.unobserve(entry.target);
                });
            },
            {
                threshold: 0.08,
                rootMargin: "0px 0px -24px 0px"
            }
        );

        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                items.forEach((item) => {
                    if (item.classList.contains("is-visible")) {
                        return;
                    }

                    observer.observe(item);
                });

                window.setTimeout(() => revealNearViewport(items), 700);
            });
        });
    }

    window.initRevealAnimations = initRevealAnimations;

    function bootRevealAnimations() {
        initRevealAnimations(document);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", bootRevealAnimations);
    } else {
        bootRevealAnimations();
    }

    window.addEventListener("load", () => {
        initRevealAnimations(document);
    });
})();