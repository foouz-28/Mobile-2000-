/* =================================================================
   MobileHub — automated logic tests (Node, no dependencies)
   Run:  node tests/logic.test.js
   Exercises the state store, cart, coupons, auth, admin CRUD and the
   recommendation engine without a browser (uses lightweight stubs).
   ================================================================= */

// ---- Minimal browser stubs so the browser modules load under Node ----
const _ls = {};
global.localStorage = {
  getItem: k => (k in _ls ? _ls[k] : null),
  setItem: (k, v) => { _ls[k] = String(v); },
  removeItem: k => { delete _ls[k]; },
};
global.window = {};
global.matchMedia = () => ({ matches: false });
global.document = { documentElement: {}, querySelectorAll: () => [], addEventListener() {} };

const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
function load(f) { eval(fs.readFileSync(path.join(ROOT, f), "utf8")); }

load("js/data.js");                 global.DB = window.DB;
global.I18N = { lang: "en" };       window.I18N = global.I18N;
load("js/store.js");                global.Store = window.Store;
load("js/recommend.js");            global.Recommend = window.Recommend;

let pass = 0, fail = 0;
function check(name, cond) { (cond ? pass++ : fail++); console.log((cond ? "PASS" : "FAIL") + " :: " + name); }

// ---- Store / cart ----
const phones = Store.getProducts().filter(p => (p.type || "phone") === "phone");
check("catalog seeded (>= 30 products)", Store.getProducts().length >= 30);
check("has 19 smartphones", phones.length === 19);
check("multi-category (>= 6 categories)", new Set(Store.getProducts().map(p => p.category)).size >= 6);
Store.addToCart("p1", 2); Store.addToCart("p1", 1);
check("cart merges qty (p1=3)", Store.getCart().find(i => i.id === "p1").qty === 3);
check("cart count = 3", Store.cartCount() === 3);
check("subtotal = 419*3", Store.cartSubtotal() === 419 * 3);
check("coupon MOBILE10 valid", Store.applyCoupon("mobile10") === true);
check("coupon BAD invalid", Store.applyCoupon("NOPE") === false);
check("wishlist toggle adds", Store.toggleWishlist("p2") === true);
check("wishlist toggle removes", Store.toggleWishlist("p2") === false);
for (let i = 0; i < 4; i++) Store.toggleCompare("p" + (i + 1));
check("compare capped at 4", Store.toggleCompare("p5") === "full");

// ---- Recommendation engine ----
const gaming = Recommend.recommend({ budget: 350, brand: "any", use: "gaming", size: "any", priority: "performance" }, 3);
check("R1 gaming: scores are 0-100", gaming.every(r => r.score >= 0 && r.score <= 100));
check("R1 gaming: top has high gaming score", gaming[0].phone.scores.gaming >= 94);

const photo = Recommend.recommend({ budget: null, use: "photo", priority: "camera" }, 3);
check("R2 photo: top camera score >= 96", photo[0].phone.scores.camera >= 96);

const tight = Recommend.recommend({ budget: 100, use: "daily", priority: "value" }, 3);
check("R4 budget100: top phone <= 130 KD", tight[0].phone.price <= 130);

const apple = Recommend.recommend({ budget: 500, brand: "Apple", use: "daily", priority: "performance" }, 3);
check("R5 brand: an Apple ranks #1", apple[0].phone.brand === "Apple");

// ---- Auth ----
check("register ok", Store.register({ name: "Test", email: "t@t.com", password: "secret" }).ok === true);
check("register dup fails", Store.register({ name: "X", email: "t@t.com", password: "secret" }).ok === false);
check("login ok", Store.login({ email: "t@t.com", password: "secret" }).ok === true);
check("login wrong fails", Store.login({ email: "t@t.com", password: "bad" }).ok === false);
check("currentUser set", Store.currentUser().email === "t@t.com");

// ---- Admin CRUD ----
const before = Store.getProducts().length;
Store.addProduct({
  name: "ZTest", brand: "Apple", price: 99, os: "iOS", category: "budget", tags: [],
  specs: { ram: 8, storage: 128, screen: 6, refresh: 60, battery: 4000, charging: 20, rearCam: "x", frontCam: "x", processor: "x", weight: 1, dimensions: "x", network: "5G" },
  scores: { performance: 50, camera: 50, battery: 50, gaming: 50, overall: 50 },
});
check("admin add product", Store.getProducts().length === before + 1);
const newId = Store.getProducts().find(p => p.name === "ZTest").id;
Store.updateProduct(newId, { price: 55 });
check("admin edit product", Store.getProduct(newId).price === 55);
Store.deleteProduct(newId);
check("admin delete product", Store.getProducts().length === before);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
