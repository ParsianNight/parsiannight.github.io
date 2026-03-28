/* ============================================
   MAIN JAVASCRIPT
   ============================================ */

(function () {
  'use strict';

  /* ---- DOM Ready ---- */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initNavigation();
    initThemeToggle();
    initScrollReveal();
    initCounters();
    initContactForm();
    initCurrentYear();
    initActiveNavHighlight();
    initCursorSpotlight();
  }

  /* ============================================
     NAVIGATION
     ============================================ */
  function initNavigation() {
    const header = document.getElementById('nav-header');
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    const links = document.querySelectorAll('.nav__link');

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', function () {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    }, { passive: true });

    // Mobile toggle
    toggle.addEventListener('click', function () {
      const isActive = toggle.classList.toggle('active');
      menu.classList.toggle('active');
      toggle.setAttribute('aria-expanded', isActive);
      document.body.style.overflow = isActive ? 'hidden' : '';
    });

    // Close menu on link click
    links.forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.classList.remove('active');
        menu.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          const offsetTop = target.offsetTop - parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'));
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /* ============================================
     ACTIVE NAV HIGHLIGHT
     ============================================ */
  function initActiveNavHighlight() {
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav__link');

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-40% 0px -60% 0px'
    });

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  /* ============================================
     THEME TOGGLE
     ============================================ */
  function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // Check saved preference — default to dark
    var saved = localStorage.getItem('theme');
    if (saved) {
      html.setAttribute('data-theme', saved);
    } else {
      html.setAttribute('data-theme', 'dark');
    }

    toggle.addEventListener('click', function () {
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  /* ============================================
     SCROLL REVEAL (Intersection Observer)
     ============================================ */
  function initScrollReveal() {
    var reveals = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Don't unobserve — keep watching for re-entry if needed
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      reveals.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      // Fallback: show everything
      reveals.forEach(function (el) {
        el.classList.add('active');
      });
    }
  }

  /* ============================================
     ANIMATED COUNTERS
     ============================================ */
  function initCounters() {
    var counters = document.querySelectorAll('.counter');

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = 'true';
          animateCounter(entry.target);
        }
      });
    }, {
      threshold: 0.5
    });

    counters.forEach(function (counter) {
      observer.observe(counter);
    });
  }

  function animateCounter(el) {
    var target = parseInt(el.dataset.target);
    var suffix = el.dataset.suffix || '';
    var duration = 2000;
    var start = 0;
    var startTime = null;

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var easedProgress = easeOutQuart(progress);
      var current = Math.floor(easedProgress * target);

      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  /* ============================================
     CONTACT FORM
     ============================================ */
  function initContactForm() {
    var status = document.getElementById('form-status');

    // Show success message if redirected back after form submission
    if (window.location.search.indexOf('sent=true') !== -1) {
      if (status) {
        status.textContent = 'Message sent successfully. I will get back to you soon.';
        status.className = 'form-status success';
        // Scroll to contact section
        var contact = document.getElementById('contact');
        if (contact) {
          setTimeout(function () {
            contact.scrollIntoView({ behavior: 'smooth' });
          }, 300);
        }
        // Clean URL
        if (window.history.replaceState) {
          window.history.replaceState(null, '', window.location.pathname);
        }
        setTimeout(function () {
          status.className = 'form-status';
        }, 5000);
      }
    }
  }

  /* ============================================
     CURRENT YEAR
     ============================================ */
  function initCurrentYear() {
    var el = document.getElementById('current-year');
    if (el) {
      el.textContent = new Date().getFullYear();
    }
  }

  /* ============================================
     CURSOR SPOTLIGHT (Hero section)
     ============================================ */
  function initCursorSpotlight() {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    // Create the spotlight overlay element
    var spotlight = document.createElement('div');
    spotlight.className = 'hero__spotlight';
    spotlight.setAttribute('aria-hidden', 'true');
    hero.appendChild(spotlight);

    // Only enable on non-touch devices
    var isTouch = 'ontouchstart' in window;
    if (isTouch) return;

    hero.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      spotlight.style.setProperty('--spotlight-x', x + 'px');
      spotlight.style.setProperty('--spotlight-y', y + 'px');
      spotlight.style.opacity = '1';
    });

    hero.addEventListener('mouseleave', function () {
      spotlight.style.opacity = '0';
    });
  }

})();
