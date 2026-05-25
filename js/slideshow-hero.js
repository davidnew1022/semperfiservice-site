(function () {
    "use strict";

    const SFS_SLIDESHOW_CONFIG = {
        selector: "[data-sfs-slideshow]",
        intervalMs: 3600,
        fadeMs: 1150,
        motionEnabled: true,
        defaultMotion: "slow-zoom",

        revealEffects: [
            "slow-zoom",
            "pan-right",
            "pan-left",
            "rise",
            "drift",
            "soft-pulse",
            "cinematic-push"
        ],

slides: [
    {
        src: "assets/images/hero/contact/future_structure.webp",
        mobileSrc: "assets/images/hero/contact/future_structure-mobile.webp",
        alt: "Semper Fi Services future supply structure",
        type: "image"
    },
    {
        src: "assets/images/hero/home/apache-hover-01.webp",
        mobileSrc: "assets/images/hero/home/apache-hover-01-mobile.webp",
        alt: "Apache helicopter hover image",
        type: "image"
    },
    {
        src: "assets/images/hero/home/c130-flight-01.webp",
        mobileSrc: "assets/images/hero/home/c130-flight-01-mobile.webp",
        alt: "C-130 aircraft in flight",
        type: "image"
    },
    {
        src: "assets/images/hero/home/ch53-runway-01.webp",
        mobileSrc: "assets/images/hero/home/ch53-runway-01-mobile.webp",
        alt: "CH-53 helicopter on runway",
        type: "image"
    },
    {
        src: "assets/images/hero/home/f22-hero-01.webp",
        mobileSrc: "assets/images/hero/home/f22-hero-01-mobile.webp",
        alt: "F-22 aircraft hero image",
        type: "image"
    },
    {
        src: "assets/images/hero/home/inspection-detail-01.webp",
        mobileSrc: "assets/images/hero/home/inspection-detail-01-mobile.webp",
        alt: "Inspection detail image",
        type: "image"
    },
    {
        src: "assets/images/hero/home/marines-boarding-c130-01.webp",
        mobileSrc: "assets/images/hero/home/marines-boarding-c130-01-mobile.webp",
        alt: "Marines boarding C-130 aircraft",
        type: "image"
    },
    {
        src: "assets/images/hero/home/next_steps_banner.webp",
        mobileSrc: "assets/images/hero/home/next_steps_banner-mobile.webp",
        alt: "Semper Fi Services next steps banner",
        type: "image"
    },
    {
        src: "assets/images/hero/home/uh1y-venom-sky-01.webp",
        mobileSrc: "assets/images/hero/home/uh1y-venom-sky-01-mobile.webp",
        alt: "UH-1Y Venom in flight",
        type: "image"
    },
    {
        src: "assets/images/hero/capabilities/differentiators.webp",
        mobileSrc: "assets/images/hero/capabilities/differentiators-mobile.webp",
        alt: "Semper Fi Services operational differentiators",
        type: "image"
    },
    {
        src: "assets/images/slideshow/packaging_shipping.webp",
        mobileSrc: "assets/images/slideshow/packaging_shipping-mobile.webp",
        alt: "Packaging and shipping support",
        type: "image"
    },
    {
        src: "assets/images/hero/contact/request_form1.webp",
        mobileSrc: "assets/images/hero/contact/request_form1-mobile.webp",
        alt: "Request form and RFQ support",
        type: "image"
    },
    {
        src: "assets/images/hero/capabilities/Hero.webp",
        mobileSrc: "assets/images/hero/capabilities/Hero-mobile.webp",
        alt: "Semper Fi Services capabilities background",
        type: "image"
    },
    {
        src: "assets/images/page-art/inspection/inspection-detail-01.webp",
        mobileSrc: "assets/images/page-art/inspection/inspection-detail-01-mobile.webp",
        alt: "Inspection and quality detail",
        type: "image"
    },
    {
        src: "assets/images/slideshow/quality_assurance.webp",
        mobileSrc: "assets/images/slideshow/quality_assurance-mobile.webp",
        alt: "Quality assurance support",
        type: "image"
    },
    {
        src: "assets/images/hero/aerospace-parts/aerospace-supply-support1.webp",
        mobileSrc: "assets/images/hero/aerospace-parts/aerospace-supply-support1-mobile.webp",
        alt: "Aerospace supply support",
        type: "image"
    },
    {
        src: "assets/images/hero/aerospace-parts/quality-approach.webp",
        mobileSrc: "assets/images/hero/aerospace-parts/quality-approach-mobile.webp",
        alt: "Aerospace quality approach",
        type: "image"
    },
    {
        src: "assets/images/slideshow/aircraft_parts.webp",
        mobileSrc: "assets/images/slideshow/aircraft_parts-mobile.webp",
        alt: "Aircraft parts support",
        type: "image"
    },
    {
        src: "assets/images/slideshow/nsn_as9120_packaging.webp",
        mobileSrc: "assets/images/slideshow/nsn_as9120_packaging-mobile.webp",
        alt: "NSN AS9120 packaging support",
        type: "image"
    },
    {
        src: "assets/images/slideshow/semper_fi.webp",
        mobileSrc: "assets/images/slideshow/semper_fi-mobile.webp",
        alt: "Semper Fi Services brand image",
        type: "image"
    },
    {
        src: "assets/images/slideshow/dla_distributor.webp",
        mobileSrc: "assets/images/slideshow/dla_distributor-mobile.webp",
        alt: "DLA distributor support",
        type: "image"
    },
    {
        src: "assets/images/slideshow/distributor.webp",
        mobileSrc: "assets/images/slideshow/distributor-mobile.webp",
        alt: "Distribution support",
        type: "image"
    },
    {
        src: "assets/images/slideshow/nsn_sourcing.webp",
        mobileSrc: "assets/images/slideshow/nsn_sourcing-mobile.webp",
        alt: "NSN sourcing support",
        type: "image"
    },
    {
        src: "assets/images/slideshow/nsn_distributor.webp",
        mobileSrc: "assets/images/slideshow/nsn_distributor-mobile.webp",
        alt: "NSN distributor support",
        type: "image"
    },
    {
        src: "assets/images/slideshow/aicraft_parts_shipping.webp",
        mobileSrc: "assets/images/slideshow/aicraft_parts_shipping-mobile.webp",
        alt: "Aircraft parts shipping support",
        type: "image"
    }
]
    };

    const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
    const videoExtensions = [".mp4"];

    function getRandomEffect(config) {
        const effects = config.revealEffects || [config.defaultMotion || "slow-zoom"];
        const index = Math.floor(Math.random() * effects.length);
        return effects[index] || config.defaultMotion || "slow-zoom";
    }

    function getFileType(src, explicitType) {
        if (explicitType === "video" || explicitType === "image") return explicitType;

        const cleanSrc = src.toLowerCase().split("?")[0];

        if (videoExtensions.some((ext) => cleanSrc.endsWith(ext))) return "video";
        if (imageExtensions.some((ext) => cleanSrc.endsWith(ext))) return "image";

        return "image";
    }
    function getResponsiveSrc(slide) {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    return isMobile && slide.mobileSrc ? slide.mobileSrc : slide.src;
}
    function createMedia(slide) {
    const src = getResponsiveSrc(slide);
    const type = getFileType(src, slide.type);

        if (type === "video") {
            const video = document.createElement("video");
            video.className = "sfs-slideshow-media";
            video.src = src;
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
            video.autoplay = true;
            video.preload = "metadata";
            video.setAttribute("aria-label", slide.alt || "");
            return video;
        }

        const img = document.createElement("img");
        img.className = "sfs-slideshow-media";
        img.src = src;
        img.alt = slide.alt || "";
        img.loading = "eager";
        img.decoding = "async";
        return img;
    }

    function createLayer(fadeMs) {
        const layer = document.createElement("div");
        layer.className = "sfs-slideshow-layer";
        layer.style.setProperty("--sfs-slide-fade", `${fadeMs}ms`);
        return layer;
    }

    function setLayerSlide(layer, slide, config) {
        const motion = slide.motion || getRandomEffect(config);

        layer.className = "sfs-slideshow-layer";

        if (config.motionEnabled && motion !== "none") {
            layer.classList.add(`sfs-motion-${motion}`);
        }

        layer.innerHTML = "";
        layer.appendChild(createMedia(slide));
    }

    function playLayerMedia(layer) {
        const video = layer.querySelector("video");

        if (!video) return;

        video.currentTime = 0;
        video.play().catch(function () {
            return;
        });
    }

    function pauseLayerMedia(layer) {
        const video = layer.querySelector("video");

        if (!video) return;

        video.pause();
    }

    function preloadNextSlide(slide) {
        if (!slide || !slide.src) return;

    const src = getResponsiveSrc(slide);
    const type = getFileType(src, slide.type);

        if (type === "video") return;

        const img = new Image();
        img.src = src;
    }

    function initSlideshow(root, config) {
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const slides = config.slides.filter((slide) => slide && slide.src);

        if (!slides.length) return;

        root.querySelectorAll(".sfs-slideshow-overlay").forEach((element) => {
            element.remove();
        });

        let activeLayer = root.querySelector(".sfs-slideshow-layer.is-active");

    if (!activeLayer) {
        activeLayer = createLayer(config.fadeMs);
        setLayerSlide(activeLayer, slides[0], config);
        activeLayer.classList.add("is-active");
        root.appendChild(activeLayer);
    } else {
        // Layer was hardcoded in HTML for fast first paint — wire it up properly
        activeLayer.style.setProperty("--sfs-slide-fade", config.fadeMs + "ms");
        if (config.motionEnabled) {
            var motion = (slides[0] && slides[0].motion) || getRandomEffect(config);
            if (motion !== "none") {
                activeLayer.classList.add("sfs-motion-" + motion);
            }
        }
        // Remove is-initial after first frame so exit transitions work normally
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                activeLayer.classList.remove("is-initial");
            });
        });
    }

        let standbyLayer = createLayer(config.fadeMs);
        const overlay = document.createElement("div");

        overlay.className = "sfs-slideshow-overlay";

        root.appendChild(standbyLayer);
        root.appendChild(overlay);

        let currentIndex = 0;

        playLayerMedia(activeLayer);
        preloadNextSlide(slides[1]);

        if (slides.length === 1 || reducedMotion) return;

        window.setInterval(function () {
            const nextIndex = (currentIndex + 1) % slides.length;
            const preloadIndex = (nextIndex + 1) % slides.length;

            setLayerSlide(standbyLayer, slides[nextIndex], config);

            standbyLayer.classList.add("is-active");
            activeLayer.classList.add("is-exiting");
            activeLayer.classList.remove("is-active");

            playLayerMedia(standbyLayer);
            preloadNextSlide(slides[preloadIndex]);

            window.setTimeout(function () {
                pauseLayerMedia(activeLayer);
                activeLayer.classList.remove("is-exiting");

                const oldActive = activeLayer;
                activeLayer = standbyLayer;
                standbyLayer = oldActive;
                currentIndex = nextIndex;
            }, config.fadeMs + 120);
        }, config.intervalMs);
    }

    function initAllSlideshows() {
        const roots = document.querySelectorAll(SFS_SLIDESHOW_CONFIG.selector);

        roots.forEach(function (root) {
            initSlideshow(root, SFS_SLIDESHOW_CONFIG);
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initAllSlideshows);
    } else {
        initAllSlideshows();
    }
})();