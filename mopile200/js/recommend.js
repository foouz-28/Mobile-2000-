/* =================================================================
   Recommendation engine — transparent weighted scoring.
   Used by the Smart Phone Finder and the AI Assistant.

   Input profile:
   {
     budget: number (max KD) | null,
     brand: string | null,
     use:   "daily"|"gaming"|"photo"|"battery"|"video"|"business"|"student" | null,
     size:  "compact"|"medium"|"large" | null,
     priority: "performance"|"camera"|"battery"|"value" | null
   }

   Returns sorted matches: { phone, score(0-100), reasons[] }
   ================================================================= */

const Recommend = (() => {

  // How each "primary use" maps to spec weights (sum ~1).
  const USE_WEIGHTS = {
    daily:    { performance: .25, camera: .2,  battery: .3,  gaming: .1,  overall: .15 },
    gaming:   { performance: .3,  camera: .1,  battery: .2,  gaming: .35, overall: .05 },
    photo:    { performance: .15, camera: .5,  battery: .15, gaming: .05, overall: .15 },
    battery:  { performance: .1,  camera: .15, battery: .55, gaming: .05, overall: .15 },
    video:    { performance: .15, camera: .1,  battery: .4,  gaming: .1,  overall: .25 },
    business: { performance: .35, camera: .2,  battery: .25, gaming: .05, overall: .15 },
    student:  { performance: .2,  camera: .2,  battery: .35, gaming: .1,  overall: .15 },
  };
  const DEFAULT_WEIGHTS = { performance: .25, camera: .25, battery: .25, gaming: .1, overall: .15 };

  // Priority nudges a single dimension up.
  const PRIORITY_BOOST = {
    performance: { performance: .15 },
    camera:      { camera: .15 },
    battery:     { battery: .15 },
    value:       {}, // handled via value bonus
  };

  function sizeMatch(screen, size) {
    if (size === "compact") return screen <= 6.2;
    if (size === "medium")  return screen > 6.2 && screen <= 6.6;
    if (size === "large")   return screen > 6.6;
    return true;
  }

  function buildWeights(profile) {
    const base = { ...(USE_WEIGHTS[profile.use] || DEFAULT_WEIGHTS) };
    const boost = PRIORITY_BOOST[profile.priority] || {};
    Object.keys(boost).forEach(k => base[k] = (base[k] || 0) + boost[k]);
    // normalise
    const sum = Object.values(base).reduce((a, b) => a + b, 0);
    Object.keys(base).forEach(k => base[k] = base[k] / sum);
    return base;
  }

  function scorePhone(phone, profile, weights) {
    const reasons = [];
    const s = phone.scores;

    // 1) Weighted spec score (0–100)
    let specScore =
      s.performance * weights.performance +
      s.camera      * weights.camera +
      s.battery     * weights.battery +
      s.gaming      * weights.gaming +
      s.overall     * weights.overall;

    let score = specScore;

    // 2) Budget handling
    if (profile.budget) {
      if (phone.price > profile.budget) {
        // over budget — heavy penalty proportional to overshoot
        const over = (phone.price - profile.budget) / profile.budget;
        score -= Math.min(60, over * 120);
      } else {
        // within budget — small bonus, and reward using the budget well (value)
        score += 5;
        reasons.push("withinBudget");
        const headroom = (profile.budget - phone.price) / profile.budget;
        if (headroom > 0.4 && profile.priority === "value") { score += 6; reasons.push("greatValue"); }
      }
    }

    // 3) Brand preference
    if (profile.brand && profile.brand !== "any") {
      if (phone.brand === profile.brand) { score += 8; reasons.push("brandMatch"); }
      else { score -= 4; }
    }

    // 4) Size preference
    if (profile.size && profile.size !== "any") {
      if (sizeMatch(phone.specs.screen, profile.size)) { score += 5; reasons.push("sizeMatch"); }
      else { score -= 6; }
    }

    // 5) Value bonus (rating + popularity) regardless
    score += (phone.rating - 4) * 4;          // up to ~+4
    score += (phone.popularity - 70) * 0.06;  // small popularity tilt

    // 6) Out of stock penalty
    if (phone.stock <= 0) score -= 30;

    // 4b) Gaming level requirement
    if (profile.gamingLevel && profile.gamingLevel !== "none") {
      const need = { casual: 75, serious: 88, pro: 94 }[profile.gamingLevel] || 0;
      if (s.gaming >= need) { score += 6; reasons.push("topGaming"); }
      else { score -= (need - s.gaming) * 0.25; }
    }
    // 4c) Charging speed preference (minimum watts)
    if (profile.charging) {
      if (phone.specs.charging >= profile.charging) { score += 4; reasons.push("fastCharge"); }
      else { score -= 3; }
    }
    // 4d) Operating system preference
    if (profile.os && profile.os !== "any") {
      const isiOS = /ios/i.test(phone.os);
      if ((profile.os === "ios" && isiOS) || (profile.os === "android" && !isiOS)) { score += 6; reasons.push("osMatch"); }
      else { score -= 10; }
    }

    // Use-specific highlight reasons
    if (profile.use === "gaming" && s.gaming >= 90) reasons.push("topGaming");
    if (profile.use === "photo" && s.camera >= 90) reasons.push("topCamera");
    if ((profile.use === "battery" || profile.use === "video") && s.battery >= 88) reasons.push("topBattery");
    if (profile.use === "business" && s.performance >= 90) reasons.push("topPerformance");
    if (phone.specs.charging >= 80) reasons.push("fastCharge");
    if (phone.specs.network === "5G") reasons.push("has5G");

    // Clamp + confidence (relative to theoretical max ~ 100 + bonuses)
    const confidence = Math.max(0, Math.min(100, Math.round(score)));
    return { phone, score: confidence, reasons: dedupe(reasons) };
  }

  function dedupe(arr) { return [...new Set(arr)]; }

  // Human-readable reason text (i18n-aware-ish; uses simple strings)
  const REASON_TEXT = {
    en: {
      withinBudget: "Fits your budget", greatValue: "Excellent value for money",
      brandMatch: "Your preferred brand", sizeMatch: "Right size for you",
      topGaming: "Outstanding gaming performance", topCamera: "Exceptional camera",
      topBattery: "Long-lasting battery", topPerformance: "Flagship-level performance",
      fastCharge: "Super-fast charging", has5G: "5G ready", osMatch: "Your preferred OS",
    },
    ar: {
      withinBudget: "ضمن ميزانيتك", greatValue: "قيمة ممتازة مقابل السعر",
      brandMatch: "ماركتك المفضلة", sizeMatch: "الحجم المناسب لك",
      topGaming: "أداء ألعاب متميز", topCamera: "كاميرا استثنائية",
      topBattery: "بطارية تدوم طويلاً", topPerformance: "أداء بمستوى الفئة الرائدة",
      fastCharge: "شحن فائق السرعة", has5G: "يدعم الجيل الخامس", osMatch: "نظامك المفضل",
    }
  };
  function reasonText(key) {
    const lang = (window.I18N && I18N.lang) || "en";
    return (REASON_TEXT[lang] && REASON_TEXT[lang][key]) || REASON_TEXT.en[key] || key;
  }

  function recommend(profile, limit = 4) {
    const weights = buildWeights(profile);
    const results = Store.getProducts()
      .filter(p => (p.type || "phone") === "phone")
      .map(p => scorePhone(p, profile, weights))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
    return results;
  }

  return { recommend, scorePhone, buildWeights, reasonText, USE_WEIGHTS };
})();

window.Recommend = Recommend;
