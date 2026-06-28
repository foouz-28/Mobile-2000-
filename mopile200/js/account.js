/* Account dashboard — protected route; tabs for orders/wishlist/profile/viewed. */
(function () {
  UI.mount();
  const root = document.getElementById("accountRoot");
  const lang = I18N.lang;
  const user = Store.currentUser();

  // Protected route
  if (!user) {
    root.innerHTML = `<div class="empty-state"><div class="ico">${UI.ic("lock")}</div><h2>${t("common.loginFirst")}</h2>
      <a class="btn btn-primary btn-lg" href="login.html" style="margin-top:16px">${t("auth.login")}</a></div>`;
    return;
  }

  let tab = new URLSearchParams(location.search).get("tab") || "dashboard";
  const NAV = [
    { id: "dashboard", ico: UI.ic("chart"), label: t("account.dashboard") },
    { id: "orders", ico: UI.ic("box"), label: t("account.orders") },
    { id: "wishlist", ico: UI.ic("heart"), label: t("account.wishlist") },
    { id: "viewed", ico: UI.ic("eye"), label: t("account.viewed") },
    { id: "addresses", ico: UI.ic("pin"), label: t("account.addresses") },
    { id: "profile", ico: UI.ic("user"), label: t("account.profile") },
  ];

  function myOrders() {
    // user's checkout orders are those not in the seed set (we just show all non-seed + seed for demo)
    return Store.getOrders();
  }

  function panel() {
    if (tab === "dashboard") {
      const orders = myOrders();
      return `
        <h2 style="margin-bottom:6px">${t("account.hello")}, ${user.name}</h2>
        <p class="muted" style="margin-bottom:20px">${user.email}</p>
        <div class="stat-grid">
          <div class="stat"><b>${orders.length}</b><span>${t("account.totalOrders")}</span></div>
          <div class="stat"><b>${user.points || 0}</b><span>${t("account.points")}</span></div>
          <div class="stat"><b>${Store.getWishlist().length}</b><span>${t("account.saved")}</span></div>
          <div class="stat"><b>${Store.getViewed().length}</b><span>${t("account.viewed")}</span></div>
        </div>
        <div class="card card-pad" style="margin-top:20px">
          <h3 style="margin-bottom:12px">${t("account.orders")}</h3>
          ${ordersTable(orders.slice(0, 3))}
        </div>`;
    }
    if (tab === "orders") {
      return `<h2 style="margin-bottom:16px">${t("account.orders")}</h2>${ordersTable(myOrders())}`;
    }
    if (tab === "wishlist") {
      const list = Store.getWishlist().map(Store.getProduct).filter(Boolean);
      return `<h2 style="margin-bottom:16px">${t("account.wishlist")}</h2>${list.length ? UI.cardGrid(list) : empty(UI.ic("heart"), t("wish.empty"))}`;
    }
    if (tab === "viewed") {
      const list = Store.getViewed().map(Store.getProduct).filter(Boolean);
      return `<h2 style="margin-bottom:16px">${t("account.viewed")}</h2>${list.length ? UI.cardGrid(list) : empty(UI.ic("eye"), "—")}`;
    }
    if (tab === "addresses") {
      return `<h2 style="margin-bottom:16px">${t("account.addresses")}</h2>
        <div class="card card-pad">
          <b><span class="li">${UI.ic("pin")}</span> ${lang === "ar" ? "العنوان الرئيسي" : "Primary address"}</b>
          <p class="muted">${user.name}<br>${lang === "ar" ? "الكويت — حولي" : "Kuwait — Hawalli"}<br>${lang === "ar" ? "هذا عنوان تجريبي" : "Sample demo address"}</p>
        </div>`;
    }
    if (tab === "profile") {
      return `<h2 style="margin-bottom:16px">${t("account.profile")}</h2>
        <div class="card card-pad" style="max-width:460px">
          <div class="field"><label>${t("auth.name")}</label><input class="input" id="p_name" value="${user.name}"></div>
          <div class="field"><label>${t("auth.email")}</label><input class="input" value="${user.email}" disabled></div>
          <button class="btn btn-primary" id="saveProfile">${t("admin.save")}</button>
        </div>`;
    }
  }

  function ordersTable(orders) {
    if (!orders.length) return empty(UI.ic("box"), "—");
    const statusColor = { Delivered: "var(--green-500)", Shipped: "var(--blue-500)", Processing: "var(--amber-500)", Pending: "var(--text-soft)" };
    return `<div style="overflow-x:auto"><table class="admin-table">
      <thead><tr><th>${lang === "ar" ? "رقم" : "ID"}</th><th>${lang === "ar" ? "التاريخ" : "Date"}</th><th>${lang === "ar" ? "العناصر" : "Items"}</th><th>${t("cart.total")}</th><th>${lang === "ar" ? "الحالة" : "Status"}</th></tr></thead>
      <tbody>${orders.map(o => `<tr>
        <td><b>${o.id}</b></td><td>${o.date}</td><td>${o.items}</td><td>${UI.KD(o.total)}</td>
        <td><span style="color:${statusColor[o.status] || "var(--text-soft)"};font-weight:700">● ${o.status}</span></td>
      </tr>`).join("")}</tbody></table></div>`;
  }

  const empty = (ico, msg) => `<div class="empty-state"><div class="ico">${ico}</div><p>${msg}</p></div>`;

  function render() {
    root.innerHTML = `
      <div class="account-layout">
        <aside>
          <div class="card card-pad" style="text-align:center;margin-bottom:16px">
            <div class="avatar" style="width:64px;height:64px;margin:0 auto;font-size:1.6rem;border-radius:50%;background:var(--primary-soft);color:var(--primary);display:grid;place-items:center;font-weight:800">${user.name[0].toUpperCase()}</div>
            <b style="display:block;margin-top:8px">${user.name}</b>
            <span class="muted" style="font-size:.82rem">${user.email}</span>
          </div>
          <nav class="account-nav card card-pad">
            ${NAV.map(n => `<a href="#" data-tab="${n.id}" class="${tab === n.id ? "active" : ""}"><span class="li">${n.ico}</span> ${n.label}</a>`).join("")}
            <div class="divider-line"></div>
            <a href="#" id="logoutBtn" style="color:var(--red-500)"><span class="li">${UI.ic("logout")}</span> ${t("auth.logout")}</a>
          </nav>
        </aside>
        <section>${panel()}</section>
      </div>`;

    root.querySelectorAll("[data-tab]").forEach(a => a.onclick = e => { e.preventDefault(); tab = a.dataset.tab; render(); });
    document.getElementById("logoutBtn").onclick = e => { e.preventDefault(); Store.logout(); location.href = "index.html"; };
    const sp = document.getElementById("saveProfile");
    if (sp) sp.onclick = () => UI.toast(I18N.lang === "ar" ? "تم الحفظ" : "Saved");
    UI.revealOnScroll();
  }

  render();
})();
