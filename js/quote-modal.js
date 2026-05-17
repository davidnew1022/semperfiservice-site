function handleQuoteClick(event) {
    if (event) {
        event.preventDefault();
    }

    const modal = document.getElementById("quote-modal");

    if (!modal) return;

    modal.classList.add("is-open");
    document.body.classList.add("modal-open");
}

function closeQuoteModal() {
    const modal = document.getElementById("quote-modal");

    if (!modal) return;

    modal.classList.remove("is-open");
    document.body.classList.remove("modal-open");
}

function downloadCapabilitiesStatement() {
    const pdfPath =
        typeof sfsGetRelativePath === "function"
            ? sfsGetRelativePath("assets/docs/capabilities-statement.pdf", "../assets/docs/capabilities-statement.pdf")
            : "assets/docs/capabilities-statement.pdf";

    window.open(pdfPath, "_blank");
    closeQuoteModal();
}

function goToContactPage() {
    const contactPath =
        typeof sfsGetRelativePath === "function"
            ? sfsGetRelativePath("contact/index.html", "../contact/index.html")
            : "contact/index.html";

    window.location.href = contactPath;
}

function initQuoteModal() {
    const modal = document.getElementById("quote-modal");

    if (!modal) return;

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeQuoteModal();
        }
    });
}