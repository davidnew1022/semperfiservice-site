document.addEventListener("DOMContentLoaded", () => {
    initContactPageRouting();
});

function initContactPageRouting() {
    const requestFormSection = document.getElementById("request-form");
    const requestType = document.getElementById("request-type");
    const preferredContact = document.getElementById("directory") || document.getElementById("preferred-contact");
    const selectedContactEmail = document.getElementById("selected-contact-email");
    const packagingFields = document.getElementById("packaging-quote-fields");
    const nsnSourcingFields = document.getElementById("nsn-sourcing-fields");
    const aerospaceHardwareFields = document.getElementById("aerospace-hardware-fields");
    const directoryCards = document.querySelectorAll("[data-form-target='request-form']");

    if (!requestFormSection || !requestType || !preferredContact) return;

    const directoryEmailMap = {
        sales: "sales@sfsdistribution.com",
        info: "info@sfsdistribution.com",
        support: "support@sfsdistribution.com",
        contracts: "contracts@sfsdistribution.com",
        sourcing: "sourcing@sfsdistribution.com",
        quality: "quality@sfsdistribution.com",
        accounting: "accounting@sfsdistribution.com",
        purchasing: "purchasing@sfsdistribution.com",
        compliance: "compliance@sfsdistribution.com",
        traceability: "traceability@sfsdistribution.com",
        shipping: "shipping@sfsdistribution.com"
    };

    const directoryRequestTypeMap = {
        sales: "dla-rfq",
        info: "general",
        support: "customer-support",
        contracts: "dla-rfq",
        sourcing: "nsn-sourcing",
        quality: "documentation",
        accounting: "general",
        purchasing: "supplier-support",
        compliance: "documentation",
        traceability: "documentation",
        shipping: "packaging"
    };

    const requestParamMap = {
        "request-a-quote": "dla-rfq",
        "quote": "dla-rfq",
        "rfq": "dla-rfq",
        "dla-rfq": "dla-rfq",
        "nsn-sourcing": "nsn-sourcing",
        "aerospace-hardware": "aerospace-hardware",
        "documentation": "documentation",
        "packaging": "packaging",
        "supplier-support": "supplier-support",
        "customer-support": "customer-support",
        "general": "general"
    };

    const packagingDirectories = new Set(["shipping"]);

    const syncSelectedContactEmail = () => {
        if (!selectedContactEmail) return;
        selectedContactEmail.value = directoryEmailMap[preferredContact.value] || "";
    };

    const syncRequestTypeFromDirectory = () => {
        const mappedRequestType = directoryRequestTypeMap[preferredContact.value];

        if (mappedRequestType) {
            requestType.value = mappedRequestType;
        }
    };

    const syncConditionalFields = () => {
    const isPackagingQuote =
    requestType.value === "packaging" ||
    packagingDirectories.has(preferredContact.value);

    const isNsnSourcingQuote = requestType.value === "nsn-sourcing";
    const isAerospaceHardwareQuote = requestType.value === "aerospace-hardware";

    if (isPackagingQuote && preferredContact.value === "") {
    preferredContact.value = "shipping";
    }

    if (packagingFields) {
    packagingFields.hidden = !isPackagingQuote;
    }

    if (nsnSourcingFields) {
    nsnSourcingFields.hidden = !isNsnSourcingQuote;
    }

    if (aerospaceHardwareFields) {
    aerospaceHardwareFields.hidden = !isAerospaceHardwareQuote;
    }
    };

    const syncDirectoryRouting = () => {
    syncSelectedContactEmail();
    syncConditionalFields();
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
        const contactEmailValue = card.getAttribute("data-contact-email") || "";
        const shouldShowPackaging = card.getAttribute("data-show-packaging") === "true";

        if (requestValue) requestType.value = requestValue;
        if (directoryValue) preferredContact.value = directoryValue;
        if (contactEmailValue && selectedContactEmail) selectedContactEmail.value = contactEmailValue;
        if (shouldShowPackaging) requestType.value = "packaging";

        syncDirectoryRouting();
        scrollToRequestForm("smooth");
    };

    directoryCards.forEach((card) => {
        card.addEventListener("click", () => routeDirectoryCard(card));

        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                routeDirectoryCard(card);
            }
        });
    });

    requestType.addEventListener("change", syncDirectoryRouting);

    preferredContact.addEventListener("change", () => {
        syncRequestTypeFromDirectory();
        syncDirectoryRouting();
    });

    const params = new URLSearchParams(window.location.search);
    const requestParam = params.get("request");
    const directoryParam = params.get("directory");

    const normalizedRequestParam = requestParam
        ? requestParam.trim().toLowerCase().replace(/\s+/g, "-")
        : "";

    const normalizedDirectoryParam = directoryParam
        ? directoryParam.trim().toLowerCase().replace(/\s+/g, "-")
        : "";

    if (normalizedRequestParam && requestParamMap[normalizedRequestParam]) {
        requestType.value = requestParamMap[normalizedRequestParam];
    }

    if (normalizedDirectoryParam && directoryEmailMap[normalizedDirectoryParam]) {
        preferredContact.value = normalizedDirectoryParam;
        syncRequestTypeFromDirectory();
    }

    syncDirectoryRouting();

    if (requestParam || directoryParam) {
        window.addEventListener("load", () => {
            scrollToRequestForm("auto");
        });
    }
}