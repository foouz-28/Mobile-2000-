/* Compare page v2 — up to 4 phones, radar chart, pros/cons, best-value,
   best-cell highlighting, hide-identical toggle. */
(function () {
  UI.mount();
  const root = document.getElementById("cmpRoot");
  const lang = I18N.lang;
  const SERIES_COLORS = ["#0b46e6", "#16a34a", "#f59e0b", "#e11d48"];

  const ROWS = [
    { label: t("spec.price"), better: "low", fmt: p => UI.KD(p.price), raw: p => p.price },
    { label: t("spec.display"), better: "high", fmt: p => `${p.specs.screen}" ${p.specs.refresh}Hz`, raw: p => p.specs.screen },
    { label: t("spec.processor"), better: "high", fmt: p => p.specs.processor, raw: p => p.scores.performance },
    { label: t("spec.ram"), better: "high", fmt: p => `${p.specs.ram} GB`, raw: p => p.specs.ram },
    { label: t("spec.storage"), better: "high", fmt: p => `${p.specs.storage} GB`, raw: p => p.specs.storage },
    { label: t("spec.battery"), better: "high", fmt: p => `${p.specs.battery} mAh`, raw: p => p.specs.battery },
    { label: t("spec.charging"), better: "high", fmt: p => `${p.specs.charging}W`, raw: p => p.specs.charging },
    { label: t("spec.rearCam"), better: "high", fmt: p => p.specs.rearCam, raw: p => p.scores.camera },
    { label: t("spec.weight"), better: "low", fmt: p => `${p.specs.weight} g`, raw: p => p.specs.weight },
    { label: t("spec.dimensions"), better: null, fmt: p => p.specs.dimensions },
    { label: t("spec.os"), better: null, fmt: p => p.os },
    { label: t("score.performance"), better: "high", fmt: p => `${p.scores.performance}/100`, raw: p => p.scores.performance },
    { label: t("score.battery"), better: "high", fmt: p => `${p.scores.battery}/100`, raw: p => p.scores.battery },
    { label: t("score.camera"), better: "high", fmt: p => `${p.scores.camera}/100`, raw: p => p.scores.camera },
    { label: t("score.gaming"), better: "high", fmt: p => `${p.scores.gaming}/100`, raw: p => p.scores.gaming },
    { label: t("score.overall"), better: "high", fmt: p => `${p.scores.overall}/100`, raw: p => p.scores.overall },
  ];

  function bestIndex(phones, row) {
    if (!row.better || !row.raw) return -1;
    let best = -1, bestVal = row.better === "high" ? -Infinity : Infinity;
    phones.forEach((p, i) => { const v = row.raw(p); if (row.better === "high" ? v > bestVal : v < bestVal) { bestVal = v; best = i; } });
    return best;
  }
  const winner = phones => phones.reduce((a, p) => (p.scores.overall / p.price > a.scores.overall / a.price ? p : a), phones[0]);
  const allEqual = (phones, row) => row.raw && phones.every(p => row.fmt(p) === row.fmt(phones[0]));

  // ---------- Radar chart ----------
  const AXES = [
    { k: "performance", label: t("score.performance") }, { k: "camera", label: t("score.camera") },
    { k: "battery", label: t("score.battery") }, { k: "gaming", label: t("score.gaming") }, { k: "overall", label: t("score.overall") },
  ];
  function radarSVG(phones) {
    const cx = 160, cy = 150, R = 110, N = AXES.length;
    const ang = i => -Math.PI / 2 + i * 2 * Math.PI / N;
    const pt = (i, r) => [cx + Math.cos(ang(i)) * r, cy + Math.sin(ang(i)) * r];
    let grid = "";
    for (let ring = 1; ring <= 4; ring++) {
      const r = R * ring / 4;
      grid += `<polygon points="${AXES.map((_, i) => pt(i, r).map(n => n.toFixed(1)).join(",")).join(" ")}" fill="none" stroke="var(--border)" stroke-width="1"/>`;
    }
    AXES.forEach((_, i) => { const [x, y] = pt(i, R); grid += `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="var(--border)" stroke-width="1"/>`; });
    const labels = AXES.map((a, i) => { const [x, y] = pt(i, R + 22); return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" font-size="11" fill="var(--text-soft)">${a.label}</text>`; }).join("");
    const polys = phones.map((p, pi) => {
      const pts = AXES.map((a, i) => pt(i, R * (p.scores[a.k] || 0) / 100).map(n => n.toFixed(1)).join(",")).join(" ");
      const c = SERIES_COLORS[pi];
      return `<polygon points="${pts}" fill="${c}" fill-opacity=".14" stroke="${c}" stroke-width="2"/>`;
    }).join("");
    return `<svg viewBox="0 0 320 300" width="100%" style="max-width:360px">${grid}${labels}${polys}</svg>`;
  }

  // ---------- Pros / cons ----------
  function prosCons(phone, phones) {
    const dims = ["performance", "camera", "battery", "gaming"];
    const pros = [], cons = [];
    dims.forEach(d => {
      const vals = phones.map(p => p.scores[d]);
      const max = Math.max(...vals), min = Math.min(...vals);
      if (phone.scores[d] === max && max !== min) pros.push(t("score." + d));
      if (phone.scores[d] === min && max !== min) cons.push(t("score." + d));
    });
    if (phone.price === Math.min(...phones.map(p => p.price)) && phones.length > 1) pros.push(t("prio.value"));
    if (phone.specs.battery === Math.max(...phones.map(p => p.specs.battery))) pros.push(t("score.battery") + " ⬆");
    return { pros: [...new Set(pros)].slice(0, 3), cons: [...new Set(cons)].slice(0, 2) };
  }

  let hideSame = false;

  function render() {
    const phones = Store.getCompare().map(Store.getProduct).filter(Boolean);
    if (!phones.length) {
      root.innerHTML = `<div class="empty-state"><div class="ico">${UI.ic("scale")}</div><h2>${t("compare.empty")}</h2>
        <p>${t("compare.add")}</p><a class="btn btn-primary btn-lg" href="products.html" style="margin-top:16px">${t("nav.shop")}</a></div>`;
      return;
    }
    const win = winner(phones);

    root.innerHTML = `
      <div class="grid" style="grid-template-columns:${phones.length > 1 ? "minmax(280px,360px) 1fr" : "1fr"};gap:24px;align-items:start;margin-bottom:24px">
        ${phones.length > 1 ? `<div class="card card-pad">
          <h3 style="margin-bottom:6px">${t("cmp.radar")}</h3>
          <div class="radar-wrap">${radarSVG(phones)}</div>
          <div class="radar-legend">${phones.map((p, i) => `<span><i style="background:${SERIES_COLORS[i]}"></i>${p.name}</span>`).join("")}</div>
        </div>` : ""}
        <div class="card card-pad">
          <h3 style="margin-bottom:12px">${t("compare.winner")}: <span style="color:var(--primary)">${win.name}</span></h3>
          <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px">
            ${phones.map(p => { const pc = prosCons(p, phones); return `
              <div class="card card-pad" style="${p.id === win.id ? "border:2px solid var(--primary)" : ""}">
                <b style="font-size:.9rem">${p.name}</b>
                <div class="proscons" style="margin-top:8px">
                  ${pc.pros.map(x => `<span class="pc pro">${UI.ic("check")} ${x}</span>`).join("")}
                  ${pc.cons.map(x => `<span class="pc con">− ${x}</span>`).join("")}
                </div></div>`; }).join("")}
          </div>
        </div>
      </div>

      <div class="row between" style="margin-bottom:12px;flex-wrap:wrap;gap:10px">
        <label class="check" style="font-size:.9rem"><input type="checkbox" id="hideSame" ${hideSame ? "checked" : ""}> ${t("cmp.hideSame")}</label>
        <span class="muted" style="font-size:.85rem">★ = ${t("compare.best")}</span>
      </div>

      <div style="overflow-x:auto">
      <table class="compare-table">
        <thead><tr><th class="rowhead"></th>
          ${phones.map((p, i) => `<th>
            <span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:${SERIES_COLORS[i]};margin-bottom:6px"></span>
            <div class="compare-art">${UI.art(p)}</div>
            <a href="product.html?id=${p.id}"><b>${p.name}</b></a>
            ${p.id === win.id ? `<div class="badge badge-soft" style="margin-top:6px"><span class="li">${UI.ic("trophy")}</span> ${t("compare.winner")}</div>` : ""}
            <div><button class="link" data-rm="${p.id}" style="color:var(--red-500);font-size:.8rem;margin-top:6px"><span class="li">${UI.ic("trash")}</span> ${t("admin.delete")}</button></div>
          </th>`).join("")}
        </tr></thead>
        <tbody>
          ${ROWS.filter(row => !(hideSame && allEqual(phones, row))).map(row => {
            const bi = bestIndex(phones, row);
            return `<tr><td class="rowhead">${row.label}</td>
              ${phones.map((p, i) => `<td class="${i === bi ? "best" : ""}">${row.fmt(p)}</td>`).join("")}</tr>`;
          }).join("")}
          <tr><td class="rowhead">${t("cta.addCart")}</td>
            ${phones.map(p => `<td><button class="btn btn-primary btn-sm" data-cart="${p.id}">${t("cta.addCart")}</button></td>`).join("")}</tr>
        </tbody>
      </table></div>`;

    const hs = document.getElementById("hideSame");
    if (hs) hs.onchange = () => { hideSame = hs.checked; render(); };
    root.querySelectorAll("[data-rm]").forEach(b => b.onclick = () => { Store.toggleCompare(b.dataset.rm); render(); });
    root.querySelectorAll("[data-cart]").forEach(b => b.onclick = () => { Store.addToCart(b.dataset.cart); UI.toast(t("toast.addedCart")); });
    UI.revealOnScroll();
  }

  document.getElementById("clearCmp").onclick = () => { Store.clearCompare(); render(); };
  render();
  Store.on("compare", render);
})();
