document.addEventListener("DOMContentLoaded", () => {
    initScrollWarehouseDrift();
});

function initScrollWarehouseDrift() {
    const warehouseSections = document.querySelectorAll(".sfs-warehouse-drift");

    if (!warehouseSections.length) return;

    const updateWarehouse = () => {
        const viewportHeight = window.innerHeight;

        warehouseSections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            const progress = 1 - rect.top / viewportHeight;
            const clamped = Math.max(0, Math.min(1, progress));

            const isReverse = section.classList.contains("sfs-warehouse-drift-reverse");

            const xMove = (clamped - 0.5) * (isReverse ? 14 : -14);
            const yMove = (clamped - 0.5) * (isReverse ? 14 : -14);

            section.style.setProperty("--warehouse-x", `${42 + xMove}%`);
            section.style.setProperty("--warehouse-y", `${38 + yMove}%`);
        });
    };

    updateWarehouse();

    window.addEventListener("scroll", updateWarehouse, { passive: true });
    window.addEventListener("resize", updateWarehouse);
}
document.addEventListener("DOMContentLoaded", () => {
    initWarehouseImageDriftDownLeft();
});

function initWarehouseImageDriftDownLeft() {
    const imageDriftSections = document.querySelectorAll(".sfs-warehouse-image-drift-down-left");

    if (!imageDriftSections.length) return;

    const updateImageDrift = () => {
        const viewportHeight = window.innerHeight;

        imageDriftSections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            const progress = 1 - rect.top / viewportHeight;
            const clamped = Math.max(0, Math.min(1, progress));

            const xMove = 100 - clamped * 100;
            const yMove = clamped * 100;

            section.style.setProperty("--warehouse-img-x", `${xMove}%`);
            section.style.setProperty("--warehouse-img-y", `${yMove}%`);
        });
    };

    updateImageDrift();

    window.addEventListener("scroll", updateImageDrift, { passive: true });
    window.addEventListener("resize", updateImageDrift);
}
document.addEventListener("DOMContentLoaded", () => {
    initGovernmentHelicopterDrift();
});

function initGovernmentHelicopterDrift() {
    const section = document.querySelector(".government-past-performance.sfs-warehouse-image-drift-down-left");
    if (!section) return;

    const image = section.querySelector(".government-past-performance-image");
    if (!image) return;

    const updateHelicopterDrift = () => {
        const rect = section.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        const rawProgress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
        const progress = Math.max(0, Math.min(1, rawProgress));

        const startX = 7;
        const startY = -7;
        const endX = -7;
        const endY = 7;

        const x = startX + (endX - startX) * progress;
        const y = startY + (endY - startY) * progress;

        image.style.transform = `scale(1.14) translate3d(${x}%, ${y}%, 0)`;
    };

    image.style.transformOrigin = "center center";
    image.style.willChange = "transform";
    image.style.transition = "transform 0.08s linear";

    updateHelicopterDrift();

    window.addEventListener("scroll", updateHelicopterDrift, { passive: true });
    window.addEventListener("resize", updateHelicopterDrift);
}