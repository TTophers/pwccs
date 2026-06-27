// script.js

const menuBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
    mobileMenu.classList.toggle("flex");
  });
}

// Sticky shrinking navbar on scroll
const navbar = document.getElementById("main-navbar");
const logo = document.getElementById("navbar-logo");

window.addEventListener("scroll", () => {
  if (window.scrollY > 60) {
    navbar.classList.add("py-2", "shadow-md");
    navbar.classList.remove("py-6");

    logo.classList.remove("h-24");
    logo.classList.add("h-16");
  } else {
    navbar.classList.add("py-6");
    navbar.classList.remove("py-2", "shadow-md");

    logo.classList.add("h-24");
    logo.classList.remove("h-16");
  }
});

const ctaStrip = document.getElementById("cta-strip");
const ctaCompact = document.getElementById("cta-compact");
const nav1bar = document.getElementById("main-navbar");

function updateCtaPosition() {
  if (!ctaCompact || !nav1bar) return;
  // position CTA directly under navbar
  const navHeight = nav1bar.offsetHeight;
  ctaCompact.style.top = navHeight + "px";
}

if (ctaStrip && ctaCompact && nav1bar) {
  window.addEventListener("load", updateCtaPosition);
  window.addEventListener("resize", updateCtaPosition);

  window.addEventListener("scroll", () => {
    const triggerPoint = ctaStrip.offsetTop - 140;

    if (window.scrollY > triggerPoint) {
      updateCtaPosition();

      ctaCompact.classList.remove("hidden");

      // smooth show
      ctaCompact.classList.add("opacity-100", "translate-y-0");
      ctaCompact.classList.remove("opacity-0", "-translate-y-2");

      // shrink CTA
      ctaStrip.classList.add("py-4");
      ctaStrip.classList.remove("py-10");

      // hide text only (keep buttons)
      const textElements = ctaStrip.querySelectorAll("h3, p");
      textElements.forEach(el => el.classList.add("hidden"));

    } else {
      updateCtaPosition();

      // smooth hide
      ctaCompact.classList.add("opacity-0", "-translate-y-2");
      ctaCompact.classList.remove("opacity-100", "translate-y-0");

      // restore CTA
      ctaStrip.classList.add("py-10");
      ctaStrip.classList.remove("py-4");

      const textElements = ctaStrip.querySelectorAll("h3, p");
      textElements.forEach(el => el.classList.remove("hidden"));
    }
  });
}
