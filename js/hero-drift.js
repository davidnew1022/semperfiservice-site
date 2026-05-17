document.addEventListener("DOMContentLoaded", () => {
    initHeroDrift();
});

function initHeroDrift() {
    const hero = document.querySelector(".sfs-hero-drift");

    if (!hero) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) return;

    const maxDegreeSpan = 33;
    const halfSpan = maxDegreeSpan / 2;

    const maxPanX = 20;
    const maxPanY = 3;

    const clamp = (value, min, max) => {
        return Math.max(min, Math.min(max, value));
    };

    const smoothstep = (value) => {
        return value * value * (3 - 2 * value);
    };

    const strengthEnvelope = (progress) => {
        const p = clamp(progress, 0, 1);

        if (p <= 1 / 3) {
            const local = p / (1 / 3);
            return 0.10 + ((0.03 - 0.10) * smoothstep(local));
        }

        if (p <= 2 / 3) {
            const local = (p - 1 / 3) / (1 / 3);
            return 0.03 + ((0.00 - 0.03) * smoothstep(local));
        }

        return 0;
    };

    const resetHero = () => {
        hero.style.setProperty("--hero-pan-x", "0px");
        hero.style.setProperty("--hero-pan-y", "0px");
        hero.style.setProperty("--hero-rotate-y", "0deg");
    };

    const updateHero = () => {
        const scrollY = window.scrollY || window.pageYOffset;

        if (scrollY <= 0) {
            resetHero();
            return;
        }

        const rect = hero.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const progress = clamp(scrollY / Math.max(rect.height, viewportHeight), 0, 1);

        const strength = strengthEnvelope(progress);
        const panCurve = -1 + (2 * progress);

        const baseRotation = -halfSpan + (maxDegreeSpan * progress);
        const rotateY = baseRotation * strength;

        /*
        Horizontal pan is intentionally stronger than vertical pan.
        This makes the tail travel with the rotation instead of only the nose/front appearing to turn.
        */
        const panX = panCurve * maxPanX * strength;
        const panY = panCurve * maxPanY * strength;

        hero.style.setProperty("--hero-pan-x", `${panX}px`);
        hero.style.setProperty("--hero-pan-y", `${panY}px`);
        hero.style.setProperty("--hero-rotate-y", `${rotateY}deg`);
    };

    resetHero();

    window.addEventListener("scroll", updateHero, { passive: true });
    window.addEventListener("resize", updateHero);
}