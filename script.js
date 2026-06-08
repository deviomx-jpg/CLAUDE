// NAV scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') mobileMenu.classList.remove('open');
});

// Intersection Observer for scroll animations
const animEls = document.querySelectorAll('.anim, .anim-left, .anim-scale');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });
animEls.forEach(el => observer.observe(el));

// Metric bar fill animation
const metricFills = document.querySelectorAll('.metric-fill');
const metricsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      const width = fill.getAttribute('data-width');
      fill.style.width = width + '%';
      metricsObserver.unobserve(fill);
    }
  });
}, { threshold: 0.3 });
metricFills.forEach(el => metricsObserver.observe(el));

// Counter animation
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const duration = 1800;
  const start = performance.now();
  const step = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = current >= 1000 ? (current).toLocaleString('es-MX') : current;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
counters.forEach(el => counterObserver.observe(el));

// Hero parallax on mousemove
const hero = document.getElementById('hero');
const circles = hero.querySelectorAll('.hero-circle');
let heroRect = hero.getBoundingClientRect();
let rafPending = false;
window.addEventListener('resize', () => { heroRect = hero.getBoundingClientRect(); }, { passive: true });
hero.addEventListener('mousemove', (e) => {
  if (rafPending) return;
  rafPending = true;
  requestAnimationFrame(() => {
    const cx = (e.clientX - heroRect.left) / heroRect.width - 0.5;
    const cy = (e.clientY - heroRect.top)  / heroRect.height - 0.5;
    circles[0].style.transform = `translate(${cx * 24}px, ${cy * 24}px)`;
    circles[1].style.transform = `translate(${-cx * 18}px, ${-cy * 18}px)`;
    rafPending = false;
  });
}, { passive: true });

// Form submission
const leadForm = document.getElementById('leadForm');
const formSuccess = document.getElementById('formSuccess');
leadForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const fname = document.getElementById('fname').value.trim();
  const femail = document.getElementById('femail').value.trim();
  const fcompany = document.getElementById('fcompany').value.trim();
  if (!fname || !femail || !fcompany) {
    const inputs = leadForm.querySelectorAll('input[required]');
    inputs.forEach(input => {
      if (!input.value.trim()) {
        input.style.borderColor = '#f87171';
        input.addEventListener('input', () => { input.style.borderColor = ''; }, { once: true });
      }
    });
    return;
  }
  leadForm.style.display = 'none';
  formSuccess.style.display = 'block';
});

// Make elements in viewport visible on load
window.addEventListener('load', () => {
  animEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) {
      el.classList.add('visible');
    }
  });
});

// ─── APP SCROLL STORY ───
(function() {
  const story = document.querySelector('.app-story');
  if (!story) return;

  const panels = story.querySelectorAll('.app-panel');
  const slides = story.querySelectorAll('.phone-story-slide');
  const dots   = story.querySelectorAll('.story-dot');
  let   current = 0;

  function setStep(step) {
    if (step === current) return;
    current = step;
    panels.forEach((p, i) => p.classList.toggle('active', i === step));
    slides.forEach((s, i) => s.classList.toggle('active', i === step));
    dots.forEach((d, i)   => d.classList.toggle('active', i === step));
    story.querySelector('.phone-story-shell').classList.toggle('immersive-slide', step === 3);
  }

  function onScroll() {
    // Only run scroll logic on desktop (sticky mode)
    if (window.innerWidth <= 900) return;
    const rect       = story.getBoundingClientRect();
    const scrollable = story.offsetHeight - window.innerHeight;
    if (scrollable <= 0) { setStep(0); return; }
    const scrolled  = Math.max(0, -rect.top);
    const progress  = Math.min(1, scrolled / scrollable);
    const step      = Math.min(3, Math.floor(progress * 4));
    setStep(step);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// WhatsApp button — aparece 1.2s después de cargar
setTimeout(() => {
  const btn = document.getElementById('waFloat');
  if (btn) btn.classList.add('wa-visible');
}, 1200);
