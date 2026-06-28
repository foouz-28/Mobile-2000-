/* Products listing — filters, sort, URL params, live results. */
(function () {
  UI.mount();

  const ALL = Store.getProducts();
  const params = new URLSearchParams(location.search);

  // Filter state
  const state = {
    brands: new Set(), ram: new Set(), storage: new Set(), os: new Set(),
    screen: null, priceMax: null, battery: null,
    cat: params.get("cat") || null,
    deal: params.get("deal") === "1",
    q: (params.get("q") || "").toLowerCase(),
    sort: params.get("sort") || "popular",
  };
  if (params.get("brand")) state.brands.add(params.get("brand"));

  // Spec filter options come from devices that actually have those specs (skip 0 / "—")
  const ramOpts = [...new Set(ALL.map(p => p.specs.ram).filter(v => v > 0))].sort((a, b) => a - b);
  const storageOpts = [...new Set(ALL.map(p => p.specs.storage).filter(v => v > 0))].sort((a, b) => a - b);
  const osOpts = [...new Set(ALL.map(p => p.os.split(" ")[0]).filter(v => v && v !== "—"))];
  const maxPrice = Math.max(...ALL.map(p => p.price));

  // ---------- Build filter UI ----------
  function checkList(group, opts, set, suffix = "") {
    return opts.map(o => `
      <label class="check">
        <input type="checkbox" data-group="${group}" value="${o}" ${set.has(String(o)) || set.has(o) ? "checked" : ""}>
        <span>${o}${suffix}</span>
      </label>`).join("");
  }
  function buildFilters() {
    document.getElementById("filterBody").innerHTML = `
      <div class="filter-group">
        <h4>${t("filter.brand")}</h4>
        ${checkList("brands", DB.BRANDS, state.brands)}
      </div>
      <div class="filter-group">
        <h4>${t("filter.price")}: <span id="priceLabel">${UI.KD(state.priceMax || maxPrice)}</span></h4>
        <div class="range-row">
          <input type="range" id="priceRange" min="50" max="${maxPrice}" step="10" value="${state.priceMax || maxPrice}">
        </div>
      </div>
      <div class="filter-group">
        <h4>${t("filter.ram")}</h4>
        ${checkList("ram", ramOpts, state.ram, "GB")}
      </div>
      <div class="filter-group">
        <h4>${t("filter.storage")}</h4>
        ${checkList("storage", storageOpts, state.storage, "GB")}
      </div>
      <div class="filter-group">
        <h4>${t("filter.screen")}</h4>
        <div class="filter-pills" id="screenPills">
          <button class="chip ${state.screen === null ? "active" : ""}" data-screen="">${t("any")}</button>
          <button class="chip ${state.screen === "s" ? "active" : ""}" data-screen="s">≤ 6.2"</button>
          <button class="chip ${state.screen === "m" ? "active" : ""}" data-screen="m">6.2–6.6"</button>
          <button class="chip ${state.screen === "l" ? "active" : ""}" data-screen="l">≥ 6.6"</button>
        </div>
      </div>
      <div class="filter-group">
        <h4>${t("filter.battery")}</h4>
        <div class="filter-pills" id="batteryPills">
          <button class="chip ${state.battery === null ? "active" : ""}" data-bat="">${t("any")}</button>
          <button class="chip ${state.battery === 4000 ? "active" : ""}" data-bat="4000">4000+ mAh</button>
          <button class="chip ${state.battery === 5000 ? "active" : ""}" data-bat="5000">5000+ mAh</button>
        </div>
      </div>
      <div class="filter-group">
        <h4>${t("filter.os")}</h4>
        ${checkList("os", osOpts, state.os)}
      </div>`;
    bindFilterEvents();
  }

  function bindFilterEvents() {
    document.querySelectorAll('input[type="checkbox"][data-group]').forEach(cb => {
      cb.addEventListener("change", () => {
        const set = state[cb.dataset.group];
        const val = isNaN(cb.value) ? cb.value : Number(cb.value);
        cb.checked ? set.add(val) : (set.delete(val), set.delete(String(val)), set.delete(Number(val)));
        render();
      });
    });
    const range = document.getElementById("priceRange");
    range.addEventListener("input", () => {
      state.priceMax = +range.value;
      document.getElementById("priceLabel").textContent = UI.KD(state.priceMax);
      render();
    });
    document.querySelectorAll("#screenPills [data-screen]").forEach(b => b.addEventListener("click", () => {
      state.screen = b.dataset.screen || null;
      document.querySelectorAll("#screenPills .chip").forEach(x => x.classList.remove("active"));
      b.classList.add("active"); render();
    }));
    document.querySelectorAll("#batteryPills [data-bat]").forEach(b => b.addEventListener("click", () => {
      state.battery = b.dataset.bat ? +b.dataset.bat : null;
      document.querySelectorAll("#batteryPills .chip").forEach(x => x.classList.remove("active"));
      b.classList.add("active"); render();
    }));
  }

  // ---------- Apply filters ----------
  function apply() {
    let list = ALL.slice();
    if (state.cat) list = list.filter(p => p.category === state.cat);
    if (state.deal) list = list.filter(p => p.tags.includes("flashDeal") || p.originalPrice > p.price);
    if (state.q) list = list.filter(p =>
      [p.name, p.brand, p.specs.processor, p.os, p.category, p.specs.rearCam].join(" ").toLowerCase().includes(state.q));
    if (state.brands.size) list = list.filter(p => state.brands.has(p.brand));
    if (state.ram.size) list = list.filter(p => state.ram.has(p.specs.ram));
    if (state.storage.size) list = list.filter(p => state.storage.has(p.specs.storage));
    if (state.os.size) list = list.filter(p => state.os.has(p.os.split(" ")[0]));
    if (state.priceMax) list = list.filter(p => p.price <= state.priceMax);
    if (state.screen === "s") list = list.filter(p => p.specs.screen <= 6.2);
    if (state.screen === "m") list = list.filter(p => p.specs.screen > 6.2 && p.specs.screen < 6.6);
    if (state.screen === "l") list = list.filter(p => p.specs.screen >= 6.6);
    if (state.battery) list = list.filter(p => p.specs.battery >= state.battery);

    const sorters = {
      popular: (a, b) => b.popularity - a.popularity,
      priceLow: (a, b) => a.price - b.price,
      priceHigh: (a, b) => b.price - a.price,
      newest: (a, b) => b.year - a.year || b.popularity - a.popularity,
      rating: (a, b) => b.rating - a.rating,
    };
    list.sort(sorters[state.sort] || sorters.popular);
    return list;
  }

  function render() {
    const list = apply();
    document.getElementById("count").textContent = list.length;
    document.getElementById("results").innerHTML = UI.cardGrid(list);
    UI.revealOnScroll(document.getElementById("results"));
  }

  // ---------- Sort + clear + mobile drawer ----------
  const sortSel = document.getElementById("sort");
  sortSel.value = state.sort;
  sortSel.addEventListener("change", () => { state.sort = sortSel.value; render(); });

  document.getElementById("clearFilters").addEventListener("click", () => {
    state.brands.clear(); state.ram.clear(); state.storage.clear(); state.os.clear();
    state.screen = null; state.priceMax = null; state.battery = null; state.cat = null; state.deal = false; state.q = "";
    buildFilters(); render();
  });

  const filtersEl = document.getElementById("filters");
  document.getElementById("openFilters").addEventListener("click", () => filtersEl.classList.add("open"));
  document.getElementById("applyMobile").addEventListener("click", () => filtersEl.classList.remove("open"));

  buildFilters();
  render();
})();
