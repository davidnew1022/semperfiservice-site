function initCinematicMedia() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const videos = document.querySelectorAll("[data-cinematic-video]");

    if (!videos.length) return;

    videos.forEach((video) => {
        if (prefersReducedMotion) {
            video.pause();
            video.removeAttribute("autoplay");
            return;
        }

        video.muted = true;
        video.loop = true;
        video.playsInline = true;

        const playPromise = video.play();

        if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(() => {
                video.pause();
            });
        }
    });
}