/* Homepage v2 — hero, widgets, rails, countdown, bundles, newsletter. */
(function () {
  UI.mount();
  const P = Store.getProducts();
  const phones = P.filter(p => (p.type || "phone") === "phone");

  // ---------- Hero slider ----------
  const SLIDES = [
    { bg: "var(--grad-blue)", art: UI.deviceArt({ type: "phone", brand: "Apple" }),
      eyebrow_en: "New Season", eyebrow_ar: "موسم جديد", h_en: "iPhone 15 Pro Max", h_ar: "آيفون 15 برو ماكس",
      p_en: "Titanium design. A17 Pro power. Now with up to 12% off.", p_ar: "تصميم تيتانيوم. قوة A17 Pro. الآن بخصم حتى 12٪.", link: "product.html?id=p1" },
    { bg: "var(--grad-ink)", art: UI.deviceArt({ type: "phone", brand: "Samsung" }),
      eyebrow_en: "Best Seller", eyebrow_ar: "الأكثر مبيعاً", h_en: "Galaxy S24 Ultra", h_ar: "جالاكسي S24 ألترا",
      p_en: "200MP camera & Galaxy AI. Built for everything.", p_ar: "كاميرا 200 ميجابكسل وذكاء Galaxy. مصمم لكل شيء.", link: "product.html?id=p3" },
    { bg: "linear-gradient(135deg,#0936b4,#1f5eff)", art: `<span style="font-size:11rem">${UI.ic("sparkle")}</span>`,
      eyebrow_en: "Smart Finder", eyebrow_ar: "المساعد الذكي", h_en: "Find your perfect phone", h_ar: "اعثر على هاتفك المثالي",
      p_en: "Answer a few questions. Get AI-powered recommendations.", p_ar: "أجب عن أسئلة سريعة واحصل على توصيات ذكية.", link: "finder.html" },
  ];
  let cur = 0;
  const slider = document.getElementById("heroSlider");
  function renderSlider() {
    const ar = I18N.lang === "ar";
    slider.innerHTML = `
      <div class="slides" id="slides">
        ${SLIDES.map(s => `
          <div class="slide" style="background:${s.bg}">
            <div class="s-copy">
              <span class="eyebrow" style="background:rgba(255,255,255,.16);color:#fff">${ar ? s.eyebrow_ar : s.eyebrow_en}</span>
              <h1>${ar ? s.h_ar : s.h_en}</h1>
              <p>${ar ? s.p_ar : s.p_en}</p>
              <a href="${s.link}" class="btn btn-light btn-lg">${t("cta.shop")} ${UI.icons.arrow}</a>
            </div>
            <div class="s-art">${s.art}</div>
          </div>`).join("")}
      </div>
      <button class="arrow prev" id="slidePrev">${UI.icons.arrow}</button>
      <button class="arrow next" id="slideNext">${UI.icons.arrow}</button>
      <div class="dots">${SLIDES.map((_, i) => `<button data-i="${i}" class="${i === 0 ? "active" : ""}"></button>`).join("")}</div>`;
    const prevSvg = slider.querySelector(".prev svg"); if (prevSvg) prevSvg.style.transform = "rotate(180deg)";
    slider.querySelector("#slideNext").onclick = () => go(cur + 1);
    slider.querySelector("#slidePrev").onclick = () => go(cur - 1);
    slider.querySelectorAll(".dots button").forEach(d => d.onclick = () => go(+d.dataset.i));
  }
  function go(i) {
    cur = (i + SLIDES.length) % SLIDES.length;
    const dir = I18N.lang === "ar" ? 1 : -1;
    document.getElementById("slides").style.transform = `translateX(${dir * cur * 100}%)`;
    slider.querySelectorAll(".dots button").forEach((d, idx) => d.classList.toggle("active", idx === cur));
  }
  renderSlider();
  let auto = setInterval(() => go(cur + 1), 5500);
  slider.addEventListener("mouseenter", () => clearInterval(auto));
  slider.addEventListener("mouseleave", () => auto = setInterval(() => go(cur + 1), 5500));

  // ---------- Trust strip ----------
  const ar = I18N.lang === "ar";
  document.getElementById("trustStrip").innerHTML = [
    ["truck", ar ? "توصيل سريع" : "Fast delivery", ar ? "خلال 2–4 أيام" : "Within 2–4 days"],
    ["shield", ar ? "ضمان رسمي" : "Official warranty", ar ? "ضمان سنتين" : "2-year coverage"],
    ["card", ar ? "تقسيط مريح" : "Easy installments", ar ? "حتى 12 شهر" : "Up to 12 months"],
    ["returns", ar ? "إرجاع سهل" : "Easy returns", ar ? "خلال 7 أيام" : "Within 7 days"],
  ].map(([icn, a, b]) => `<div class="trust-item reveal"><div class="tic">${UI.ic(icn)}</div><div><b>${a}</b><span>${b}</span></div></div>`).join("");

  // ---------- Inline icons in section headers ----------
  const setIc = (id, name) => { const el = document.getElementById(id); if (el) el.innerHTML = UI.ic(name); };
  setIc("ic-continue", "cart"); setIc("ic-best", "trophy"); setIc("ic-trend", "fire");
  document.getElementById("finderArt").innerHTML = UI.ic("sparkle");

  // ---------- Categories ----------
  document.getElementById("catGrid").innerHTML = DB.CATEGORIES.map(c => {
    const count = P.filter(p => p.category === c.id).length;
    return `<a href="products.html?cat=${c.id}" class="cat-tile reveal">
      <span class="ico">${UI.catIcon(c.id)}</span>
      <b>${ar ? c.name_ar : c.name_en}</b>
      <span>${count} ${t("shop.products")}</span></a>`;
  }).join("");

  // ---------- Grid / rail fillers (skeleton then content) ----------
  const rail = list => `<div class="rail">${list.map(UI.productCard).join("")}</div>`;
  function fillGrid(elId, list) {
    const el = document.getElementById(elId); if (!el) return;
    el.innerHTML = UI.skeletons(4);
    setTimeout(() => { el.innerHTML = UI.cardGrid(list); UI.revealOnScroll(el); }, 320);
  }
  function fillRail(elId, list) {
    const el = document.getElementById(elId); if (!el) return;
    el.outerHTML = `<div class="rail" id="${elId}">${Array.from({ length: 4 }).map(() => '<div class="skel skel-card"></div>').join("")}</div>`;
    setTimeout(() => { const e2 = document.getElementById(elId); e2.innerHTML = list.map(UI.productCard).join(""); UI.revealOnScroll(e2); }, 320);
  }

  const byPop = [...P].sort((a, b) => b.popularity - a.popularity);
  const byRating = [...P].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
  const byNew = [...P].sort((a, b) => b.year - a.year || b.popularity - a.popularity);

  fillGrid("dealsRail", P.filter(p => p.tags.includes("flashDeal") || p.originalPrice > p.price).slice(0, 8));
  fillGrid("featuredGrid", P.filter(p => p.tags.includes("featured")).slice(0, 8));
  fillRail("recoRail", Recommend.recommend({ priority: "value" }, 8).map(r => r.phone));
  fillGrid("bestGrid", byPop.slice(0, 4));
  fillRail("topRatedRail", byRating.slice(0, 8));
  fillRail("trendingRail", byPop.slice(2, 10));
  fillGrid("newGrid", byNew.slice(0, 4));

  // ---------- Continue shopping (cart) ----------
  const cart = Store.getCart();
  if (cart.length) {
    document.getElementById("continueSection").classList.remove("hidden");
    document.getElementById("continueStrip").innerHTML = cart.map(i => {
      const p = Store.getProduct(i.id); if (!p) return "";
      return `<a class="mini-prod" href="product.html?id=${p.id}">
        <span class="thumb">${UI.art(p)}</span>
        <div><b style="font-size:.9rem;display:block">${p.name}</b>
        <span class="muted" style="font-size:.8rem">${UI.KD(p.price)} · ×${i.qty}</span></div></a>`;
    }).join("");
  }

  // ---------- Recently viewed ----------
  const viewed = Store.getViewed().map(Store.getProduct).filter(Boolean);
  if (viewed.length) {
    document.getElementById("recentSection").classList.remove("hidden");
    document.getElementById("recentRail").innerHTML = viewed.map(UI.productCard).join("");
  }

  // ---------- Accessory bundles ----------
  function bundle(mainId, accIds, save) {
    const main = Store.getProduct(mainId); const items = [main, ...accIds.map(Store.getProduct)].filter(Boolean);
    const total = items.reduce((s, p) => s + p.price, 0);
    const after = Math.round(total * (1 - save / 100));
    return `<div class="bundle-card reveal">
      <div class="bundle-items">${items.map((p, i) => `${i ? '<span class="plus">+</span>' : ''}<a class="bi" href="product.html?id=${p.id}">${UI.art(p)}</a>`).join("")}</div>
      <div style="flex:1;min-width:180px">
        <b style="display:block">${main.name} ${ar ? "+ إكسسوارات" : "+ accessories"}</b>
        <span class="muted" style="font-size:.85rem">${items.length} ${ar ? "قطع" : "items"} · <span style="color:var(--green-500);font-weight:700">${t("widget.bundleSave")} ${save}%</span></span>
      </div>
      <div style="text-align:end">
        <div class="muted" style="text-decoration:line-through;font-size:.85rem">${UI.KD(total)}</div>
        <div style="font-size:1.3rem;font-weight:800;color:var(--primary)">${UI.KD(after)}</div>
        <button class="btn btn-primary btn-sm" data-bundle="${items.map(p => p.id).join(",")}">${t("cta.addCart")}</button>
      </div></div>`;
  }
  document.getElementById("bundleGrid").innerHTML = [
    bundle("p1", ["a1", "ac1"], 12),
    bundle("p3", ["a2", "ac2"], 15),
    bundle("p11", ["a3", "g1"], 10),
  ].join("");
  document.getElementById("bundleGrid").addEventListener("click", e => {
    const b = e.target.closest("[data-bundle]"); if (!b) return;
    b.dataset.bundle.split(",").forEach(id => Store.addToCart(id));
    UI.toast(t("toast.addedCart"));
  });

  // ---------- Brands ----------
  document.getElementById("brandGrid").innerHTML = DB.BRANDS.map(b =>
    `<a href="products.html?brand=${encodeURIComponent(b)}" class="brand-tile reveal">${b}</a>`).join("");

  // ---------- Reviews ----------
  document.getElementById("reviewGrid").innerHTML = DB.SEED_TESTIMONIALS.map(r => `
    <div class="review-card reveal">
      <div class="row" style="margin-bottom:12px">
        <div class="avatar">${r.name[0]}</div>
        <div><b>${r.name}</b><div class="stars">${UI.stars(r.rating)}</div></div>
      </div>
      <p class="muted">"${ar ? r.text_ar : r.text_en}"</p></div>`).join("");

  // ---------- Countdown ----------
  const cd = document.getElementById("countdown");
  function tick() {
    const now = new Date(); const end = new Date(now); end.setHours(23, 59, 59, 999);
    let diff = Math.max(0, end - now);
    const h = Math.floor(diff / 3.6e6), m = Math.floor(diff % 3.6e6 / 6e4), s = Math.floor(diff % 6e4 / 1e3);
    const labels = ar ? ["ساعة", "دقيقة", "ثانية"] : ["Hrs", "Min", "Sec"];
    cd.innerHTML = [[h, labels[0]], [m, labels[1]], [s, labels[2]]].map(([v, l]) =>
      `<div class="cd-box"><b>${String(v).padStart(2, "0")}</b><span>${l}</span></div>`).join("");
  }
  tick(); setInterval(tick, 1000);

  // ---------- Newsletter ----------
  document.getElementById("newsForm").addEventListener("submit", e => { e.preventDefault(); e.target.reset(); UI.toast(t("news.done")); });

  UI.revealOnScroll();
})();
