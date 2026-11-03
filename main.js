/* ============================================================
   MY BEAUTY PRODUCT — Main JS (main.js)
   Navigation, animations, shared behaviours
   ============================================================ */

(function () {
  'use strict';

  // ── Sticky header ────────────────────────────────────────
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Mobile hamburger nav ─────────────────────────────────
  const hamburger  = document.getElementById('hamburger');
  const mobileNav  = document.getElementById('mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Active nav link ──────────────────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.primary-nav a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── Scroll-reveal intersection observer ─────────────────
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // ── Hero bg parallax ─────────────────────────────────────
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    heroBg.classList.add('loaded');
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroBg.style.transform = `scale(1) translateY(${y * 0.3}px)`;
    }, { passive: true });
  }

  // ── Filter sidebar mobile toggle ─────────────────────────
  const filterToggle  = document.getElementById('filter-toggle');
  const filterSidebar = document.querySelector('.filter-sidebar');

  if (filterToggle && filterSidebar) {
    filterToggle.addEventListener('click', () => {
      filterSidebar.classList.toggle('open');
    });

    // Close filter sidebar when clicking outside
    document.addEventListener('click', (e) => {
      if (!filterSidebar.contains(e.target) && e.target !== filterToggle) {
        filterSidebar.classList.remove('open');
      }
    });
  }

  // ── FAQ accordion ────────────────────────────────────────
  // Native <details> element handles open/close.
  // We just animate the content height.
  document.querySelectorAll('.faq-item').forEach(item => {
    const details = item.querySelector('details');
    const answer  = item.querySelector('.faq-answer');
    if (!details || !answer) return;

    details.addEventListener('toggle', () => {
      if (details.open) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        answer.style.opacity   = '1';
      } else {
        answer.style.maxHeight = '0';
        answer.style.opacity   = '0';
      }
    });

    // Initial styles
    answer.style.overflow   = 'hidden';
    answer.style.transition = 'max-height 0.4s ease, opacity 0.3s ease';
    answer.style.maxHeight  = details.open ? answer.scrollHeight + 'px' : '0';
    answer.style.opacity    = details.open ? '1' : '0';
  });

  // ── Price range slider (shop page) ───────────────────────
  const priceRange  = document.getElementById('price-range');
  const priceOutput = document.getElementById('price-max-display');

  if (priceRange && priceOutput) {
    priceRange.addEventListener('input', () => {
      priceOutput.textContent = 'PKR ' + Number(priceRange.value).toLocaleString('en-PK');
    });
  }

  // ── Interactive star rating (review form) ────────────────
  document.querySelectorAll('.interactive-stars').forEach(container => {
    const buttons  = container.querySelectorAll('.star-btn');
    const input    = container.closest('form')?.querySelector('[name="rating"]');
    let selected   = 0;

    function render(hover) {
      const active = hover || selected;
      buttons.forEach((btn, i) => {
        btn.textContent = i < active ? '★' : '☆';
        btn.classList.toggle('selected', i < active);
      });
    }

    buttons.forEach((btn, i) => {
      btn.addEventListener('mouseenter', () => render(i + 1));
      btn.addEventListener('mouseleave', () => render(0));
      btn.addEventListener('click',      () => {
        selected = i + 1;
        if (input) input.value = selected;
        render(0);
      });
    });
  });

  // ── Order tracking form (track-order page) ───────────────
  const trackForm = document.getElementById('track-order-form');
  if (trackForm) {
    trackForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const orderId = document.getElementById('order-id')?.value.trim();
      const email   = document.getElementById('track-email')?.value.trim();

      if (!orderId || !email) {
        if (window.showToast) showToast('Please fill in all fields.', 'error');
        return;
      }

      // Show loading state
      const submitBtn = this.querySelector('button[type="submit"]');
      const origText  = submitBtn.textContent;
      submitBtn.textContent = 'Tracking…';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.textContent = origText;
        submitBtn.disabled    = false;
        showTrackingResult(orderId);
      }, 1800);
    });
  }

  function showTrackingResult(orderId) {
    const resultSection = document.getElementById('tracking-result');
    if (!resultSection) return;

    // Sample demo result
    resultSection.style.display = 'block';
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    document.getElementById('tracked-order-id').textContent = '#' + orderId.toUpperCase();

    // Animate the progress line
    setTimeout(() => {
      const progressLine = document.querySelector('.tracking-stepper .progress-line');
      if (progressLine) progressLine.style.width = '50%'; // simulate "shipped"
    }, 400);

    // Mark steps completed/active
    const steps = document.querySelectorAll('.step-item');
    steps.forEach((step, i) => {
      step.classList.remove('completed', 'active');
      if (i < 2)      step.classList.add('completed');   // placed + processing
      else if (i === 2) step.classList.add('active');    // shipped = current
    });
  }

  // ── Newsletter form ──────────────────────────────────────
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const emailInput = this.querySelector('input[type="email"]');
      if (!emailInput?.value) return;

      const btn      = this.querySelector('button');
      const origText = btn.textContent;
      btn.textContent = '✓ Subscribed!';
      btn.style.background = '#4CAF50';
      emailInput.value = '';

      setTimeout(() => {
        btn.textContent  = origText;
        btn.style.background = '';
      }, 4000);

      if (window.showToast) {
        showToast('Thank you for subscribing! ✨', 'success');
      }
    });
  });

  // ── Contact form ─────────────────────────────────────────
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn      = this.querySelector('button[type="submit"]');
      const origText = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = origText;
        btn.disabled    = false;
        this.reset();
        if (window.showToast) showToast('Message sent! We\'ll reply within 24 hours.', 'success');
      }, 1500);
    });
  }

  // ── Smooth anchor scrolling ───────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Image lazy-loading fallback ───────────────────────────
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading supported – nothing to do.
  } else {
    // Basic fallback for older browsers
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imgObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          imgObserver.unobserve(img);
        }
      });
    });
    lazyImages.forEach(img => imgObserver.observe(img));
  }

  // ── Announcement bar dismiss ─────────────────────────────
  const dismissBar = document.getElementById('dismiss-bar');
  if (dismissBar) {
    dismissBar.addEventListener('click', () => {
      document.querySelector('.announcement-bar')?.remove();
      document.body.classList.remove('has-announcement');
    });
  }

  // ── Product card wishlist toggle ─────────────────────────
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const heart = this.querySelector('svg');
      this.classList.toggle('wishlisted');
      if (this.classList.contains('wishlisted')) {
        this.style.color = '#E53935';
        if (window.showToast) showToast('Added to your wishlist ♥', 'info');
      } else {
        this.style.color = '';
        if (window.showToast) showToast('Removed from wishlist', 'info');
      }
    });
  });

  // ── Shop filter checkboxes — live filter ──────────────────
  document.querySelectorAll('.filter-option input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
      // In a real implementation this would filter product grid via JS/API.
      // Demo: just update the results count text.
      const checked = document.querySelectorAll('.filter-option input:checked').length;
      const countEl = document.querySelector('.results-count');
      if (countEl) {
        countEl.textContent = checked > 0
          ? `Showing filtered results (${12 - Math.min(checked * 2, 8)} products)`
          : 'Showing all 12 products';
      }
    });
  });

  // ── Sort select ───────────────────────────────────────────
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      if (window.showToast) showToast(`Sorted by: ${sortSelect.options[sortSelect.selectedIndex].text}`, 'info');
    });
  }

  // ── Hero counter animation ───────────────────────────────
  function animateCounter(el, target, duration = 1500) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { start = target; clearInterval(timer); }
      el.textContent = Math.round(start).toLocaleString() + (el.dataset.suffix || '');
    }, 16);
  }

  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        animateCounter(el, parseInt(el.dataset.count, 10));
        statsObserver.unobserve(el);
      }
    });
  });

  document.querySelectorAll('[data-count]').forEach(el => statsObserver.observe(el));

})();
