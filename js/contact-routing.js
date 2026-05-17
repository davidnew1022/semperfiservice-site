document.addEventListener("DOMContentLoaded", () => {
    initContactPageRouting();
});

function initContactPageRouting() {
    const requestFormSection = document.getElementById("request-form");
    const requestType = document.getElementById("request-type");
    const preferredContact = document.getElementById("directory") || document.getElementById("preferred-contact");
    const packagingFields = document.getElementById("packaging-quote-fields");
    const directoryCards = document.querySelectorAll("[data-form-target='request-form']");

    if (!requestFormSection || !requestType || !preferredContact) {
        return;
    }

    const syncPackagingFields = () => {
        const isPackagingQuote = requestType.value === "packaging";

        if (packagingFields) {
            packagingFields.hidden = !isPackagingQuote;
        }

        if (isPackagingQuote) {
            preferredContact.value = "packaging-quote";
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