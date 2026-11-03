/* ============================================================
   MY BEAUTY PRODUCT — Cart Logic (cart.js)
   Persistent shopping cart using localStorage
   ============================================================ */

(function () {
  'use strict';

  // ── Storage key ──────────────────────────────────────────
  const CART_KEY = 'mbp_cart';

  // ── Read/write helpers ───────────────────────────────────
  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch { return []; }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateBadge();
    renderCartDrawer();
  }

  // ── Public API ───────────────────────────────────────────
  window.Cart = {

    add(product) {
      // product = { id, name, price, image, category }
      const cart = getCart();
      const existing = cart.find(i => i.id === product.id);
      if (existing) {
        existing.qty = (existing.qty || 1) + 1;
      } else {
        cart.push({ ...product, qty: 1 });
      }
      saveCart(cart);
      showToast(`${product.name} added to cart ✓`, 'success');
      openCartDrawer();
    },

    remove(id) {
      const cart = getCart().filter(i => i.id !== id);
      saveCart(cart);
    },

    updateQty(id, delta) {
      const cart = getCart();
      const item = cart.find(i => i.id === id);
      if (!item) return;
      item.qty = Math.max(1, (item.qty || 1) + delta);
      saveCart(cart);
    },

    getAll: getCart,

    total() {
      return getCart().reduce((sum, i) => sum + i.price * (i.qty || 1), 0);
    },

    count() {
      return getCart().reduce((sum, i) => sum + (i.qty || 1), 0);
    },

    clear() {
      saveCart([]);
    }
  };

  // ── Badge update ─────────────────────────────────────────
  function updateBadge() {
    const count = window.Cart.count();
    document.querySelectorAll('.cart-badge').forEach(el => {
      el.textContent = count;
      el.classList.toggle('show', count > 0);
    });
    document.querySelectorAll('.cart-count-text').forEach(el => {
      el.textContent = count > 0 ? `(${count})` : '';
    });
  }

  // ── Drawer open/close ────────────────────────────────────
  function openCartDrawer() {
    document.getElementById('cart-drawer')?.classList.add('open');
    document.getElementById('cart-overlay')?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCartDrawer() {
    document.getElementById('cart-drawer')?.classList.remove('open');
    document.getElementById('cart-overlay')?.classList.remove('open');
    document.body.style.overflow = '';
  }

  window.openCartDrawer  = openCartDrawer;
  window.closeCartDrawer = closeCartDrawer;

  // ── Render cart drawer ───────────────────────────────────
  function formatPKR(amount) {
    return 'PKR ' + amount.toLocaleString('en-PK');
  }

  function renderCartDrawer() {
    const itemsEl = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    if (!itemsEl) return;

    const cart = getCart();

    if (cart.length === 0) {
      itemsEl.innerHTML = `
        <div class="cart-empty">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          <p>Your cart is empty</p>
          <button class="btn btn-primary btn-sm" onclick="closeCartDrawer()">Explore Products</button>
        </div>`;
      if (totalEl) totalEl.textContent = 'PKR 0';
      return;
    }

    itemsEl.innerHTML = cart.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img class="cart-item-img" src="${item.image || 'assets/images/placeholder.jpg'}" alt="${escapeHtml(item.name)}" loading="lazy">
        <div class="cart-item-info">
          <div class="cart-item-name">${escapeHtml(item.name)}</div>
          <div class="cart-item-price">${formatPKR(item.price)}</div>
          <div class="cart-item-controls">
            <button class="qty-btn" onclick="Cart.updateQty('${item.id}', -1)" aria-label="Decrease quantity">−</button>
            <span class="qty-display">${item.qty || 1}</span>
            <button class="qty-btn" onclick="Cart.updateQty('${item.id}', 1)" aria-label="Increase quantity">+</button>
            <span class="cart-item-remove" onclick="Cart.remove('${item.id}')" role="button" aria-label="Remove item">✕</span>
          </div>
        </div>
      </div>
    `).join('');

    if (totalEl) totalEl.textContent = formatPKR(window.Cart.total());
  }

  // ── Toast notifications ──────────────────────────────────
  function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const icons = {
      success: `<svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
      error:   `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
      info:    `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `${icons[type] || icons.info}<span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toastOut 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  window.showToast = showToast;

  // ── Security helper ──────────────────────────────────────
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(String(str)));
    return div.innerHTML;
  }

  // ── DOM ready init ───────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    // Render initial badge
    updateBadge();
    renderCartDrawer();

    // Cart open trigger buttons
    document.querySelectorAll('.cart-btn, .open-cart').forEach(btn => {
      btn.addEventListener('click', openCartDrawer);
    });

    // Overlay & close button
    document.getElementById('cart-overlay')?.addEventListener('click', closeCartDrawer);
    document.getElementById('cart-close')?.addEventListener('click', closeCartDrawer);

    // Checkout button - opens checkout modal
    document.getElementById('cart-checkout')?.addEventListener('click', () => {
      if (window.Cart.count() === 0) {
        showToast('Your cart is empty!', 'error');
        return;
      }
      closeCartDrawer();
      openCheckoutModal();
    });

    // Add-to-cart buttons (data-driven)
    document.querySelectorAll('[data-add-to-cart]').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const card = this.closest('[data-product], [data-product-id]');
        if (!card) return;
        const product = {
          id:       card.dataset.productId || card.dataset.product || ('prod-' + Math.random().toString(36).substr(2, 5)),
          name:     card.dataset.name || card.querySelector('.product-name')?.textContent?.trim() || 'Beauty Product',
          price:    parseInt(card.dataset.price || '0', 10),
          image:    card.dataset.image || card.querySelector('img')?.getAttribute('src') || 'assets/images/product_foundation.jpg',
          category: card.dataset.category || card.querySelector('.product-category')?.textContent?.trim() || ''
        };
        window.Cart.add(product);
      });
    });
  });

  // ── Checkout Modal & Order Placement ──────────────────────
  function openCheckoutModal() {
    let modalOverlay = document.getElementById('checkout-modal-overlay');
    if (!modalOverlay) {
      modalOverlay = document.createElement('div');
      modalOverlay.id = 'checkout-modal-overlay';
      modalOverlay.className = 'checkout-modal-overlay';
      document.body.appendChild(modalOverlay);
    }

    const cart = getCart();
    const subtotal = window.Cart.total();
    const delivery = subtotal >= 2500 ? 0 : 200;
    const total = subtotal + delivery;

    modalOverlay.innerHTML = `
      <div class="checkout-modal">
        <div class="checkout-modal-header">
          <h2 style="font-family:var(--font-heading);font-size:1.4rem;">Checkout & Delivery</h2>
          <button style="background:none;border:none;font-size:1.3rem;cursor:pointer;color:var(--color-muted);" id="checkout-modal-close">✕</button>
        </div>
        <div class="checkout-modal-body">
          <div style="background:#FAF8F5;border:1px solid var(--color-border);border-radius:var(--border-radius-lg);padding:14px;margin-bottom:20px;">
            <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:0.9rem;">
              <span>Items Subtotal:</span>
              <span>${formatPKR(subtotal)}</span>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:0.9rem;">
              <span>Delivery Charges:</span>
              <span style="color:${delivery === 0 ? 'var(--color-success)' : 'inherit'};font-weight:600;">
                ${delivery === 0 ? 'FREE (Orders above 2,500 PKR)' : 'PKR 200'}
              </span>
            </div>
            <div style="display:flex;justify-content:space-between;font-weight:700;font-size:1.1rem;border-top:1px dashed var(--color-border);padding-top:8px;color:var(--color-primary-dark);">
              <span>Total Payable:</span>
              <span>${formatPKR(total)}</span>
            </div>
          </div>

          <form id="checkout-form">
            <div class="form-group" style="margin-bottom:12px;">
              <label class="form-label" style="display:block;margin-bottom:4px;font-size:0.85rem;font-weight:600;">Full Name *</label>
              <input type="text" id="cust-name" required class="form-input" style="width:100%;padding:10px 14px;border:1px solid var(--color-border);border-radius:6px;" placeholder="e.g. Ayesha Khan" />
            </div>
            <div class="form-group" style="margin-bottom:12px;">
              <label class="form-label" style="display:block;margin-bottom:4px;font-size:0.85rem;font-weight:600;">WhatsApp / Phone Number *</label>
              <input type="tel" id="cust-phone" required class="form-input" style="width:100%;padding:10px 14px;border:1px solid var(--color-border);border-radius:6px;" placeholder="0300-1234567" />
            </div>
            <div class="form-group" style="margin-bottom:12px;">
              <label class="form-label" style="display:block;margin-bottom:4px;font-size:0.85rem;font-weight:600;">Delivery Address *</label>
              <textarea id="cust-address" required class="form-textarea" rows="2" style="width:100%;padding:10px 14px;border:1px solid var(--color-border);border-radius:6px;" placeholder="House/Flat #, Street, Area"></textarea>
            </div>
            <div class="form-row" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
              <div class="form-group">
                <label class="form-label" style="display:block;margin-bottom:4px;font-size:0.85rem;font-weight:600;">City *</label>
                <select id="cust-city" required class="form-select" style="width:100%;padding:10px 14px;border:1px solid var(--color-border);border-radius:6px;">
                  <option value="Karachi">Karachi</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Rawalpindi">Rawalpindi</option>
                  <option value="Faisalabad">Faisalabad</option>
                  <option value="Multan">Multan</option>
                  <option value="Peshawar">Peshawar</option>
                  <option value="Other">Other City</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label" style="display:block;margin-bottom:4px;font-size:0.85rem;font-weight:600;">Payment Method *</label>
                <select id="cust-payment" required class="form-select" style="width:100%;padding:10px 14px;border:1px solid var(--color-border);border-radius:6px;">
                  <option value="Cash on Delivery (COD)">Cash on Delivery (COD)</option>
                  <option value="JazzCash">JazzCash</option>
                  <option value="EasyPaisa">EasyPaisa</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
            </div>

            <div style="display:flex;gap:10px;flex-direction:column;">
              <button type="submit" class="btn btn-primary" style="width:100%;padding:12px;font-weight:600;">
                Place Order (Confirm Now)
              </button>
              <button type="button" id="whatsapp-order-btn" class="btn" style="width:100%;padding:12px;background:#25D366;color:white;display:flex;align-items:center;justify-content:center;gap:8px;">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Complete Order via WhatsApp
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    const closeModal = () => {
      modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
    };

    document.getElementById('checkout-modal-close')?.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    const processOrder = (sendToWhatsApp) => {
      const name = document.getElementById('cust-name').value.trim();
      const phone = document.getElementById('cust-phone').value.trim();
      const address = document.getElementById('cust-address').value.trim();
      const city = document.getElementById('cust-city').value;
      const payment = document.getElementById('cust-payment').value;

      if (!name || !phone || !address) {
        showToast('Please fill all required fields', 'error');
        return;
      }

      const orderId = 'MBP-2026-' + Math.floor(1000 + Math.random() * 9000);
      const orderDate = new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });

      const newOrder = {
        id: orderId,
        date: orderDate,
        name, phone, address, city, payment,
        items: cart,
        subtotal, delivery, total,
        status: 'Dispatched via Courier'
      };

      // Save order in localStorage
      try {
        const orders = JSON.parse(localStorage.getItem('mbp_orders') || '[]');
        orders.unshift(newOrder);
        localStorage.setItem('mbp_orders', JSON.stringify(orders));
      } catch (err) {}

      // Clear cart
      window.Cart.clear();

      // Show success in modal
      modalOverlay.innerHTML = `
        <div class="checkout-modal" style="text-align:center;padding:var(--space-2xl);">
          <div style="font-size:3.5rem;margin-bottom:12px;">🎉</div>
          <h2 style="font-family:var(--font-heading);font-size:1.8rem;margin-bottom:8px;">Thank You, ${escapeHtml(name)}!</h2>
          <p style="color:var(--color-muted);margin-bottom:16px;">Your order has been received successfully.</p>
          <div style="background:#FAF8F5;border:1px dashed var(--color-primary);border-radius:12px;padding:16px;margin-bottom:20px;">
            <div style="font-size:0.85rem;color:var(--color-muted);">Your Order Tracking Number:</div>
            <div style="font-size:1.4rem;font-weight:700;color:var(--color-primary-dark);letter-spacing:0.05em;margin:6px 0;">${orderId}</div>
            <div style="font-size:0.85rem;color:var(--color-muted);">Total: <strong>${formatPKR(total)}</strong> (${payment})</div>
          </div>
          <p style="font-size:0.85rem;color:var(--color-muted);margin-bottom:20px;">
            You will receive an SMS and WhatsApp notification once your package is on the way.
          </p>
          <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
            <a href="track-order.html?id=${orderId}" class="btn btn-primary">Track Your Order →</a>
            <button class="btn btn-outline-gold" id="finish-btn">Continue Shopping</button>
          </div>
        </div>
      `;

      document.getElementById('finish-btn')?.addEventListener('click', closeModal);

      if (sendToWhatsApp) {
        const itemsList = cart.map(i => `• ${i.name} (x${i.qty || 1}) - PKR ${(i.price * (i.qty || 1)).toLocaleString()}`).join('%0A');
        const waText = `*New Order: ${orderId}*%0A%0A*Customer:* ${encodeURIComponent(name)}%0A*Phone:* ${encodeURIComponent(phone)}%0A*Address:* ${encodeURIComponent(address)}, ${encodeURIComponent(city)}%0A*Payment:* ${encodeURIComponent(payment)}%0A%0A*Items:*%0A${itemsList}%0A%0A*Delivery:* ${delivery === 0 ? 'FREE' : 'PKR 200'}%0A*Total:* PKR ${total.toLocaleString()}%0A%0APlease confirm my order!`;
        window.open(`https://wa.me/923001234567?text=${waText}`, '_blank');
      }
    };

    document.getElementById('checkout-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      processOrder(false);
    });

    document.getElementById('whatsapp-order-btn')?.addEventListener('click', () => {
      processOrder(true);
    });
  }


})();
