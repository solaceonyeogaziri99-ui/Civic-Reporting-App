/* ============================================
   CIVIC REPORTING APP — MAIN JS
   Handles: mobile navigation menu (shared across
   all public pages: index, about, how-it-works,
   login, register)
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  initMobileMenu();
});

/**
 * Toggles the mobile navigation menu open/closed
 * and updates the hamburger icon + aria attributes.
 */
function initMobileMenu() {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".navbar-links");

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener("click", function () {
    const isOpen = navLinks.classList.toggle("is-open");
    hamburger.classList.toggle("is-active", isOpen);
    hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // Close the menu when a nav link is clicked (better mobile UX)
  navLinks.querySelectorAll("a, .btn").forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("is-open");
      hamburger.classList.remove("is-active");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });

  // Close the menu on window resize back to desktop width
  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
      navLinks.classList.remove("is-open");
      hamburger.classList.remove("is-active");
      hamburger.setAttribute("aria-expanded", "false");
    }
  });
}
