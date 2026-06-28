/* =================================================================
   Store — central state persisted in localStorage.
   Acts like a tiny Zustand-style store: getState + actions + events.
   Handles: products (with admin overrides), cart, wishlist, compare,
   auth/users, orders, recently viewed.
   ================================================================= */

const Store = (() => {
  const KEYS = {
    products: "mh_products",
    cart: "mh_cart",
    wishlist: "mh_wishlist",
    compare: "mh_compare",
    users: "mh_users",
    session: "mh_session",
    orders: "mh_orders",
    viewed: "mh_viewed",
    coupon: "mh_coupon",
    points: "mh_points",
  };

  const read = (k, fallback) => {
    try { const v = JSON.parse(localStorage.getItem(k)); return v ?? fallback; }
    catch { return fallback; }
  };
  const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));

  // ----- Products (seed once, then admin can mutate) -----
  function getProducts() {
    let p = read(KEYS.products, null);
    if (!p) { p = window.DB.SEED_PHONES; write(KEYS.products, p); }
    return p;
  }
  function saveProducts(list) { write(KEYS.products, list); emit("products"); }
  function getProduct(id) { return getProducts().find(p => p.id === id); }
  function getProductBySlug(slug) { return getProducts().find(p => p.slug === slug); }

  function addProduct(prod) {
    const list = getProducts();
    prod.id = "p" + (Date.now());
    list.push(prod);
    saveProducts(list);
  }
  function updateProduct(id, patch) {
    const list = getProducts().map(p => p.id === id ? { ...p, ...patch } : p);
    saveProducts(list);
  }
  function deleteProduct(id) {
    saveProducts(getProducts().filter(p => p.id !== id));
  }
  function resetProducts() { localStorage.removeItem(KEYS.products); emit("products"); }

  // ----- Orders -----
  function getOrders() {
    let o = read(KEYS.orders, null);
    if (!o) { o = window.DB.SEED_ORDERS.slice(); write(KEYS.orders, o); }
    return o;
  }
  function addOrder(order) {
    const list = getOrders();
    list.unshift(order);
    write(KEYS.orders, list);
    emit("orders");
  }

  // ----- Cart -----
  function getCart() { return read(KEYS.cart, []); }
  function cartCount() { return getCart().reduce((n, i) => n + i.qty, 0); }
  function addToCart(id, qty = 1) {
    const cart = getCart();
    const found = cart.find(i => i.id === id);
    if (found) found.qty += qty; else cart.push({ id, qty });
    write(KEYS.cart, cart); emit("cart");
  }
  function setQty(id, qty) {
    let cart = getCart();
    if (qty <= 0) cart = cart.filter(i => i.id !== id);
    else { const f = cart.find(i => i.id === id); if (f) f.qty = qty; }
    write(KEYS.cart, cart); emit("cart");
  }
  function removeFromCart(id) { write(KEYS.cart, getCart().filter(i => i.id !== id)); emit("cart"); }
  function clearCart() { write(KEYS.cart, []); emit("cart"); }
  function cartSubtotal() {
    return getCart().reduce((sum, i) => {
      const p = getProduct(i.id); return sum + (p ? p.price * i.qty : 0);
    }, 0);
  }

  // ----- Coupon -----
  const COUPONS = { "MOBILE10": 0.10, "WELCOME15": 0.15, "STUDENT5": 0.05 };
  function applyCoupon(code) {
    code = (code || "").trim().toUpperCase();
    if (COUPONS[code]) { write(KEYS.coupon, { code, rate: COUPONS[code] }); emit("cart"); return true; }
    return false;
  }
  function getCoupon() { return read(KEYS.coupon, null); }
  function clearCoupon() { localStorage.removeItem(KEYS.coupon); emit("cart"); }

  // ----- Wishlist -----
  function getWishlist() { return read(KEYS.wishlist, []); }
  function inWishlist(id) { return getWishlist().includes(id); }
  function toggleWishlist(id) {
    let w = getWishlist();
    const had = w.includes(id);
    w = had ? w.filter(x => x !== id) : [...w, id];
    write(KEYS.wishlist, w); emit("wishlist");
    return !had; // true if now added
  }

  // ----- Compare -----
  function getCompare() { return read(KEYS.compare, []); }
  function inCompare(id) { return getCompare().includes(id); }
  function toggleCompare(id) {
    let c = getCompare();
    if (c.includes(id)) { c = c.filter(x => x !== id); write(KEYS.compare, c); emit("compare"); return "removed"; }
    if (c.length >= 4) return "full";
    c.push(id); write(KEYS.compare, c); emit("compare"); return "added";
  }
  function clearCompare() { write(KEYS.compare, []); emit("compare"); }

  // ----- Recently viewed -----
  function addViewed(id) {
    let v = read(KEYS.viewed, []).filter(x => x !== id);
    v.unshift(id); v = v.slice(0, 8);
    write(KEYS.viewed, v);
  }
  function getViewed() { return read(KEYS.viewed, []); }

  // ----- Auth (demo only — not secure, for educational project) -----
  function getUsers() { return read(KEYS.users, []); }
  function register({ name, email, password }) {
    const users = getUsers();
    if (users.some(u => u.email === email.toLowerCase()))
      return { ok: false, error: "exists" };
    const user = { name, email: email.toLowerCase(), password, points: 120, joined: new Date().toISOString() };
    users.push(user); write(KEYS.users, users);
    write(KEYS.session, { email: user.email, name: user.name });
    emit("auth");
    return { ok: true };
  }
  function login({ email, password }) {
    const user = getUsers().find(u => u.email === email.toLowerCase() && u.password === password);
    if (!user) return { ok: false };
    write(KEYS.session, { email: user.email, name: user.name });
    emit("auth");
    return { ok: true };
  }
  function logout() { localStorage.removeItem(KEYS.session); emit("auth"); }
  function currentUser() {
    const s = read(KEYS.session, null);
    if (!s) return null;
    return getUsers().find(u => u.email === s.email) || s;
  }
  function isLoggedIn() { return !!read(KEYS.session, null); }

  // ----- Events (simple pub/sub) -----
  const listeners = {};
  function on(evt, fn) { (listeners[evt] = listeners[evt] || []).push(fn); }
  function emit(evt) {
    (listeners[evt] || []).forEach(fn => fn());
    (listeners["*"] || []).forEach(fn => fn(evt));
    // keep multiple tabs in sync via storage already; also refresh badges
    if (window.UI && UI.refreshBadges) UI.refreshBadges();
  }

  return {
    KEYS,
    getProducts, getProduct, getProductBySlug, addProduct, updateProduct, deleteProduct, saveProducts, resetProducts,
    getOrders, addOrder,
    getCart, cartCount, addToCart, setQty, removeFromCart, clearCart, cartSubtotal,
    applyCoupon, getCoupon, clearCoupon, COUPONS,
    getWishlist, inWishlist, toggleWishlist,
    getCompare, inCompare, toggleCompare, clearCompare,
    addViewed, getViewed,
    register, login, logout, currentUser, isLoggedIn, getUsers,
    on, emit,
  };
})();

window.Store = Store;
