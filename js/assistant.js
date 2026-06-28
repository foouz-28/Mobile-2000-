/* =================================================================
   AI Assistant — rule-based chatbot that parses natural language
   and recommends phones using the Recommend engine + keyword intents.
   No external API — fully offline, deterministic, explainable.
   ================================================================= */

const Assistant = (() => {
  let panel, body, form, input, opened = false;

  const QUICK = {
    en: ["Best for gaming", "Under 150 KD", "Best camera", "Best battery", "Best iPhone"],
    ar: ["الأفضل للألعاب", "أقل من 150 د.ك", "أفضل كاميرا", "أفضل بطارية", "أفضل آيفون"],
  };

  function push(role, html) {
    const el = document.createElement("div");
    el.className = "msg " + role;
    el.innerHTML = html;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
    return el;
  }

  function typing() { return push("bot", '<span class="typing">…</span>'); }

  function miniCard(p) {
    return `<a class="mini-card" href="product.html?id=${p.id}">
      <span class="art">${UI.art(p)}</span>
      <div><b style="display:block;font-size:.85rem">${p.name}</b><span style="font-size:.8rem;color:var(--text-soft)">${UI.KD(p.price)} · ★${p.rating}</span></div>
    </a>`;
  }

  // Parse a free-text message into a recommendation profile + intent.
  function parse(text) {
    const q = text.toLowerCase();
    const profile = { budget: null, brand: null, use: null, size: null, priority: null };

    // budget: "under 250", "250 kd", "ميزانية 200"
    const num = q.match(/(\d{2,4})\s*(kd|kwd|د\.?ك|dinar)?/);
    if (num && (q.includes("under") || q.includes("below") || q.includes("less") || q.includes("budget") ||
                q.includes("أقل") || q.includes("ميزاني") || (num[2]))) {
      profile.budget = parseInt(num[1], 10);
    }
    // brand
    DB.BRANDS.forEach(b => { if (q.includes(b.toLowerCase())) profile.brand = b; });
    if (q.includes("iphone") || q.includes("آيفون")) profile.brand = "Apple";
    if (q.includes("galaxy") || q.includes("جالاكسي") || q.includes("سامسونج")) profile.brand = "Samsung";
    if (q.includes("pixel") || q.includes("بكسل")) profile.brand = "Google";
    if (q.includes("redmi") || q.includes("شاومي") || q.includes("ريدمي")) profile.brand = "Xiaomi";

    // use / intent
    if (/(gam(e|ing)|pubg|fortnite|call of duty|ألعاب|قيمن|بوبجي)/.test(q)) { profile.use = "gaming"; profile.priority = "performance"; }
    else if (/(photo|camera|picture|تصوير|كاميرا|صور)/.test(q)) { profile.use = "photo"; profile.priority = "camera"; }
    else if (/(battery|long lasting|بطاري|شحن)/.test(q)) { profile.use = "battery"; profile.priority = "battery"; }
    else if (/(video|movie|watch|netflix|youtube|فيديو|أفلام|مشاهد)/.test(q)) { profile.use = "video"; }
    else if (/(business|work|أعمال|عمل)/.test(q)) { profile.use = "business"; profile.priority = "performance"; }
    else if (/(student|study|طالب|دراس)/.test(q)) { profile.use = "student"; }
    else if (/(performance|fast|powerful|أداء|سريع|قوي)/.test(q)) { profile.priority = "performance"; }
    else if (/(value|cheap|affordable|رخيص|قيمة|اقتصاد)/.test(q)) { profile.priority = "value"; }

    // size
    if (/(small|compact|صغير)/.test(q)) profile.size = "compact";
    if (/(big|large|كبير)/.test(q)) profile.size = "large";

    const hasIntent = profile.budget || profile.brand || profile.use || profile.priority || profile.size;
    return { profile, hasIntent };
  }

  function answer(text) {
    const lang = I18N.lang;
    const { profile, hasIntent } = parse(text);

    // greetings / help
    if (/^(hi|hello|hey|مرحب|اهلا|السلام)/i.test(text.trim()) && !hasIntent) {
      return push("bot", lang === "ar"
        ? "أهلاً! أخبرني عن احتياجك: مثلاً «أريد هاتفاً للألعاب أقل من 250 د.ك» أو «أفضل كاميرا»."
        : "Hi! Tell me what you need — e.g. \"a gaming phone under 250 KD\" or \"best camera\".");
    }

    if (!hasIntent) {
      return push("bot", lang === "ar"
        ? "لم أفهم تماماً. جرّب: ميزانية (مثل «أقل من 200 د.ك»)، أو استخدام (ألعاب، تصوير، بطارية)، أو ماركة."
        : "I didn't quite catch that. Try a budget (\"under 200 KD\"), a use (gaming, photography, battery), or a brand.");
    }

    const results = Recommend.recommend(profile, 3).filter(r => r.score > 25);
    if (!results.length) {
      return push("bot", lang === "ar" ? "لم أجد تطابقاً مناسباً. جرّب رفع الميزانية." : "No good match found. Try increasing the budget.");
    }

    const top = results[0];
    const reasons = top.reasons.slice(0, 2).map(Recommend.reasonText).join(lang === "ar" ? "، " : ", ");
    let intro = lang === "ar"
      ? `إليك أفضل ترشيح بنسبة تطابق ${top.score}%${reasons ? ` (${reasons})` : ""}:`
      : `Here's my top pick at ${top.score}% match${reasons ? ` (${reasons})` : ""}:`;

    return push("bot", intro + results.map(r => miniCard(r.phone)).join("") +
      `<div style="margin-top:8px"><a href="finder.html" style="font-size:.8rem;color:var(--primary);font-weight:600">${lang === "ar" ? "افتح المساعد الكامل ←" : "Open full finder →"}</a></div>`);
  }

  function handle(text) {
    if (!text.trim()) return;
    push("user", text);
    const t1 = typing();
    setTimeout(() => { t1.remove(); answer(text); }, 500);
  }

  function renderQuick() {
    const quick = document.getElementById("assistantQuick");
    const items = QUICK[I18N.lang] || QUICK.en;
    quick.innerHTML = items.map(q => `<button class="chip" data-q="${q}">${q}</button>`).join("");
    quick.querySelectorAll("[data-q]").forEach(b => b.addEventListener("click", () => handle(b.getAttribute("data-q"))));
  }

  function init() {
    const fab = document.getElementById("assistantFab");
    panel = document.getElementById("assistantPanel");
    body = document.getElementById("assistantBody");
    form = document.getElementById("assistantForm");
    input = document.getElementById("assistantInput");
    if (!fab || !panel) return;

    fab.addEventListener("click", () => {
      opened = !opened;
      panel.classList.toggle("open", opened);
      if (opened && !body.dataset.greeted) {
        push("bot", t("assistant.greet"));
        renderQuick();
        body.dataset.greeted = "1";
      }
    });
    document.getElementById("assistantClose").addEventListener("click", () => { opened = false; panel.classList.remove("open"); });
    form.addEventListener("submit", e => { e.preventDefault(); const v = input.value; input.value = ""; handle(v); });
  }

  return { init };
})();

window.Assistant = Assistant;
