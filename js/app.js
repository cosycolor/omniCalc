/**
 * Project OmniCalc - Global Application Controller
 * Handles Theme Toggle (Dark/Light), Mobile Navigation, Toast Notifications & FAQ Accordions
 */

const SUN_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;

const MOON_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

const CHECK_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

class OmniApp {
  constructor() {
    this.theme = this.getInitialTheme();
    this.init();
  }

  getInitialTheme() {
    const saved = localStorage.getItem('omni_theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  setTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('omni_theme', theme);

    const icon = document.getElementById('themeToggleIcon');
    if (icon) {
      icon.innerHTML = theme === 'dark' ? SUN_SVG : MOON_SVG;
    }
  }

  toggleTheme() {
    this.setTheme(this.theme === 'dark' ? 'light' : 'dark');
  }

  setupTheme() {
    this.setTheme(this.theme);
    const btn = document.getElementById('themeToggleBtn');
    if (btn) {
      btn.addEventListener('click', () => this.toggleTheme());
    }
  }

  setupFAQAccordions() {
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        if (item) {
          item.classList.toggle('active');
        }
      });
    });
  }

  setupMobileNav() {
    const toggleBtn = document.getElementById('mobileNavToggle');
    const navLinks = document.querySelector('.nav-links');
    if (toggleBtn && navLinks) {
      toggleBtn.addEventListener('click', () => {
        const isShown = navLinks.style.display === 'flex';
        navLinks.style.display = isShown ? 'none' : 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '64px';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.backgroundColor = 'var(--bg-secondary)';
        navLinks.style.padding = '1rem';
        navLinks.style.borderBottom = '1px solid var(--border-color)';
        navLinks.style.boxShadow = 'var(--shadow-lg)';
      });
    }
  }

  setupToastContainer() {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    window.showToast = (msg) => {
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.innerHTML = `<span style="display:flex; align-items:center; color:var(--accent-green);">${CHECK_SVG}</span><span>${msg}</span>`;
      container.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    };
  }

  init() {
    this.setupTheme();
    this.setupFAQAccordions();
    this.setupMobileNav();
    this.setupToastContainer();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.omniApp = new OmniApp();
});
