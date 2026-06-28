/* Smart Phone Finder — multi-step quiz -> weighted recommendations. */
(function () {
  UI.mount();
  const root = document.getElementById("finderRoot");
  const lang = I18N.lang;

  const answers = { budget: null, brand: null, use: null, gamingLevel: null, charging: null, os: null, size: null, priority: null };

  const STEPS = [
    {
      key: "budget", q: t("q.budget"),
      options: [
        { val: 100, ico: UI.ic("cash"), label: lang === "ar" ? "أقل من 100 د.ك" : "Under 100 KD" },
        { val: 200, ico: UI.ic("cash"), label: lang === "ar" ? "أقل من 200 د.ك" : "Under 200 KD" },
        { val: 350, ico: UI.ic("card"), label: lang === "ar" ? "أقل من 350 د.ك" : "Under 350 KD" },
        { val: 9999, ico: UI.ic("diamond"), label: lang === "ar" ? "بلا حدود" : "No limit" },
      ],
    },
    {
      key: "brand", q: t("q.brand"),
      options: [{ val: "any", ico: UI.ic("globe"), label: t("any") }].concat(
        DB.BRANDS.map(b => ({ val: b, ico: UI.ic("phone"), label: b }))),
    },
    {
      key: "use", q: t("q.use"),
      options: [
        { val: "daily", ico: UI.ic("calendar"), label: t("use.daily") },
        { val: "gaming", ico: UI.ic("gamepad"), label: t("use.gaming") },
        { val: "photo", ico: UI.ic("camera"), label: t("use.photo") },
        { val: "battery", ico: UI.ic("battery"), label: t("use.battery") },
        { val: "video", ico: UI.ic("film"), label: t("use.video") },
        { val: "business", ico: UI.ic("briefcase"), label: t("use.business") },
        { val: "student", ico: UI.ic("cap"), label: t("use.student") },
      ],
    },
    {
      key: "gamingLevel", q: t("q.gaming"),
      options: [
        { val: "none", ico: UI.ic("globe"), label: t("lvl.none") },
        { val: "casual", ico: UI.ic("gamepad"), label: t("lvl.casual") },
        { val: "serious", ico: UI.ic("gamepad"), label: t("lvl.serious") },
        { val: "pro", ico: UI.ic("rocket"), label: t("lvl.pro") },
      ],
    },
    {
      key: "charging", q: t("q.charging"),
      options: [
        { val: 0, ico: UI.ic("globe"), label: t("any") },
        { val: 25, ico: UI.ic("battery"), label: "25W+" },
        { val: 65, ico: UI.ic("bolt"), label: "65W+" },
        { val: 100, ico: UI.ic("rocket"), label: "100W+" },
      ],
    },
    {
      key: "os", q: t("q.os"),
      options: [
        { val: "any", ico: UI.ic("globe"), label: t("any") },
        { val: "ios", ico: UI.ic("phone"), label: "iOS" },
        { val: "android", ico: UI.ic("robot"), label: "Android" },
      ],
    },
    {
      key: "size", q: t("q.size"),
      options: [
        { val: "compact", ico: UI.ic("phone"), label: `${t("size.compact")} (≤6.2")` },
        { val: "medium", ico: UI.ic("hand"), label: `${t("size.medium")} (6.2–6.6")` },
        { val: "large", ico: UI.ic("tablet"), label: `${t("size.large")} (≥6.6")` },
        { val: "any", ico: UI.ic("globe"), label: t("any") },
      ],
    },
    {
      key: "priority", q: t("q.priority"),
      options: [
        { val: "performance", ico: UI.ic("bolt"), label: t("prio.performance") },
        { val: "camera", ico: UI.ic("camera"), label: t("prio.camera") },
        { val: "battery", ico: UI.ic("battery"), label: t("prio.battery") },
        { val: "value", ico: UI.ic("tag"), label: t("prio.value") },
      ],
    },
  ];

  let step = 0;

  function renderIntro() {
    root.innerHTML = `
      <div class="quiz-card center reveal">
        <div style="font-size:4rem;color:var(--primary)" class="li">${UI.ic("sparkle")}</div>
        <h2 style="margin:10px 0">${t("finder.title")}</h2>
        <p class="muted" style="max-width:480px;margin:0 auto 24px">${t("finder.sub")}</p>
        <button class="btn btn-primary btn-lg" id="startBtn">${t("finder.start")} ${UI.icons.arrow}</button>
      </div>`;
    document.getElementById("startBtn").onclick = () => { step = 0; renderStep(); };
    UI.revealOnScroll();
  }

  function renderStep() {
    const s = STEPS[step];
    const pct = Math.round((step) / STEPS.length * 100);
    root.innerHTML = `
      <div class="quiz-card reveal">
        <div class="quiz-progress"><div class="bar" style="width:${pct}%"></div></div>
        <div class="muted" style="font-size:.85rem;margin-bottom:4px">${lang === "ar" ? "سؤال" : "Question"} ${step + 1} / ${STEPS.length}</div>
        <h2 style="margin-bottom:20px">${s.q}</h2>
        <div class="opt-grid">
          ${s.options.map(o => `
            <button class="opt ${answers[s.key] === o.val ? "active" : ""}" data-val="${o.val}">
              <span class="ico">${o.ico}</span><span>${o.label}</span>
            </button>`).join("")}
        </div>
        <div class="row between" style="margin-top:24px">
          <button class="btn btn-ghost" id="backBtn" ${step === 0 ? "style=visibility:hidden" : ""}>${UI.icons.arrow} ${t("finder.back")}</button>
          <button class="btn btn-primary" id="nextBtn" ${answers[s.key] == null ? "disabled" : ""}>
            ${step === STEPS.length - 1 ? t("finder.see") : t("finder.next")} ${UI.icons.arrow}
          </button>
        </div>
      </div>`;
    root.querySelector(".prev"); // no-op
    root.querySelectorAll(".opt").forEach(b => b.onclick = () => {
      let v = b.dataset.val;
      if (s.key === "budget" || s.key === "charging") v = +v;
      answers[s.key] = v;
      root.querySelectorAll(".opt").forEach(x => x.classList.remove("active"));
      b.classList.add("active");
      document.getElementById("nextBtn").disabled = false;
    });
    document.getElementById("backBtn").onclick = () => { if (step > 0) { step--; renderStep(); } };
    document.getElementById("nextBtn").onclick = () => {
      if (step < STEPS.length - 1) { step++; renderStep(); }
      else renderResults();
    };
    UI.revealOnScroll();
  }

  // Strengths / weaknesses from a phone's score profile
  function strengths(p) {
    const dims = [["performance", t("score.performance")], ["camera", t("score.camera")], ["battery", t("score.battery")], ["gaming", t("score.gaming")]];
    const pros = dims.filter(([k]) => p.scores[k] >= 88).map(([, l]) => l);
    const cons = dims.filter(([k]) => p.scores[k] <= 74).map(([, l]) => l);
    if (p.specs.charging >= 80) pros.push(lang === "ar" ? "شحن فائق" : "Ultra charging");
    return { pros: pros.slice(0, 3), cons: cons.slice(0, 2) };
  }

  function renderResults() {
    const profile = {
      budget: answers.budget && answers.budget < 9999 ? answers.budget : null,
      brand: answers.brand, use: answers.use,
      gamingLevel: answers.gamingLevel, charging: answers.charging, os: answers.os,
      size: answers.size, priority: answers.priority,
    };
    const results = Recommend.recommend(profile, 5);

    root.innerHTML = `
      <div class="center" style="margin-bottom:22px">
        <span class="eyebrow">${lang === "ar" ? "اكتمل التحليل" : "Analysis complete"}</span>
        <h2>${t("finder.top5")}</h2>
        <div class="row" style="gap:10px;justify-content:center;margin-top:12px">
          <button class="btn btn-primary btn-sm" id="cmpAll"><span class="li">${UI.ic("scale")}</span> ${t("finder.compareAll")}</button>
          <button class="btn btn-ghost btn-sm" id="retake">↻ ${t("finder.retake")}</button>
        </div>
      </div>
      <div class="grid" style="gap:16px">
        ${results.map((r, i) => {
          const p = r.phone;
          const reasons = r.reasons.slice(0, 4).map(Recommend.reasonText);
          const sw = strengths(p);
          return `
          <div class="card card-pad match-card reveal" style="${i === 0 ? "border:2px solid var(--primary)" : ""}">
            <div class="match-ring" style="--p:${r.score}"><span>${r.score}%</span></div>
            <div>
              <div class="row between">
                <div>
                  ${i === 0 ? `<span class="badge badge-soft"><span class="li">${UI.ic("trophy")}</span> ${lang === "ar" ? "الأفضل لك" : "Best match"}</span>` : `<span class="badge badge-soft">#${i + 1}</span>`}
                  <h3 style="margin:4px 0"><a href="product.html?id=${p.id}">${p.name}</a></h3>
                  <span class="muted">${p.brand} · <b>${UI.KD(p.price)}</b> · ${t("finder.match")} ${r.score}%</span>
                </div>
                <div class="compare-art">${UI.art(p)}</div>
              </div>
              <div style="font-size:.82rem;color:var(--text-soft);margin-top:8px">${t("finder.why")}:</div>
              <ul class="match-reasons">${reasons.map(x => `<li>${UI.ic("check")} ${x}</li>`).join("")}</ul>
              <div class="strength-row">
                ${sw.pros.map(x => `<span class="s-pro">${UI.ic("check")} ${x}</span>`).join("")}
                ${sw.cons.map(x => `<span class="s-con">− ${x}</span>`).join("")}
              </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:8px">
              <button class="btn btn-primary btn-sm" data-act="cart" data-id="${p.id}">${t("cta.addCart")}</button>
              <button class="btn btn-outline btn-sm" data-act="compare" data-id="${p.id}">${t("cta.compare")}</button>
              <a class="btn btn-ghost btn-sm" href="product.html?id=${p.id}">${t("cta.quickView")}</a>
            </div>
          </div>`;
        }).join("")}
      </div>
      <div class="center" style="margin-top:24px"><a class="btn btn-ghost" href="products.html">${t("nav.shop")}</a></div>`;

    document.getElementById("retake").onclick = () => { Object.keys(answers).forEach(k => answers[k] = null); step = 0; renderIntro(); };
    document.getElementById("cmpAll").onclick = () => {
      Store.clearCompare();
      results.slice(0, 4).forEach(r => Store.toggleCompare(r.phone.id));
      location.href = "compare.html";
    };
    UI.revealOnScroll();
  }

  renderIntro();
})();
