function sfsIsNestedPage() {
    return (
        window.location.pathname.includes("/company/") ||
        window.location.pathname.includes("/capabilities/") ||
        window.location.pathname.includes("/quality/") ||
        window.location.pathname.includes("/government/") ||
        window.location.pathname.includes("/contact/") ||
        window.location.pathname.includes("/aerospace-parts-distributor/") ||
        window.location.pathname.includes("/mil-std-packaging-support/")
    );
}

function sfsGetRelativePath(rootPath, nestedPath) {
    return sfsIsNestedPage() ? nestedPath : rootPath;
}