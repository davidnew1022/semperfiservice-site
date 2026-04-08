/* =========================
FILE: script.js
Final status:
- FINAL for simple mobile nav toggle
- NOT FINAL for advanced interactions, animations, or form submission
Purpose:
- Keep JS minimal
- Only handles mobile navigation right now
========================= */

const navToggle = document.getElementById("nav-toggle");
const siteNav = document.getElementById("site-nav");

/* FINAL: mobile nav toggle behavior */
if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  /* FINAL: close mobile nav when a link is clicked */
  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* NOT FINAL:
Future options for this file:
- sticky header shrink effect
- scroll animations
- active nav highlighting
- real form validation
- AJAX or backend form submission
*/