document.addEventListener("DOMContentLoaded", () => {
    initScrollMetalDrift();
});

function initScrollMetalDrift() {
    const metalSections = document.querySelectorAll(".sfs-metal-drift");

    if (!metalSections.length) return;

    const updateMetal = () => {
        const viewportHeight = window.innerHeight;

        metalSections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
            const clamped = Math.max(0, Math.min(1, progress));

            const isReverse = section.classList.contains("sfs-metal-drift-reverse");

            const yMove = (clamped - 0.5) * (isReverse ? 18 : -10);
            const xMove = (clamped - 0.5) * (isReverse ? -30 : 16);

            section.style.setProperty("--metal-x", `${50 + xMove}%`);
            section.style.setProperty("--metal-y", `${50 + yMove}%`);
        });
    };

    updateMetal();

    window.addEventListener("scroll", updateMetal, { passive: true });
    window.addEventListener("resize", updateMetal);
}