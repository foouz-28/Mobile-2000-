/* =================================================================
   UI — shared rendering: header, footer, product cards, search,
   toasts, mega menu, mobile drawer, AI assistant, badges.
   Every page calls UI.mount().
   ================================================================= */

/* ---------- DeviceArt: realistic vector device illustrations ----------
   Self-contained SVG mockups (phone/tablet/watch/audio/laptop/accessory/
   gaming), tinted per brand. Copyright-safe — original artwork, no logos. */
const DeviceArt = (() => {
  const C = {
    Apple: "#3a3a3c", Samsung: "#2456e6", Honor: "#1aa3ff", Xiaomi: "#ff6900", Google: "#4285f4",
    Huawei: "#cf0a2c", OnePlus: "#eb0029", Motorola: "#3b6ef5", Nokia: "#1f5fc0", Infinix: "#00c2a8",
    ZTE: "#0047b3", Nothing: "#555a66", Sony: "#2b2b2b",
  };
  let n = 0; const uid = () => "da" + (n++);
  const cl = v => Math.max(0, Math.min(255, Math.round(v)));
  function shade(hex, f) {
    hex = hex.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16), g = parseInt(hex.substr(2, 2), 16), b = parseInt(hex.substr(4, 2), 16);
    const h = x => cl(x).toString(16).padStart(2, "0");
    return `#${h(r * f)}${h(g * f)}${h(b * f)}`;
  }
  const brand = p => C[p.brand] || "#2456e6";

  function screenGrad(id, c) {
    return `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${shade(c, 1.3)}"/><stop offset=".55" stop-color="${c}"/><stop offset="1" stop-color="${shade(c, .45)}"/></linearGradient>`;
  }
  const frameGrad = id => `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#eef1f6"/><stop offset=".5" stop-color="#b7bcc9"/><stop offset="1" stop-color="#868c99"/></linearGradient>`;

  function phone(p) {
    const c = brand(p), s = uid(), f = uid(), cp = uid();
    return `<svg viewBox="0 0 200 396" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${p.name}">
      <defs>
        ${screenGrad(s, c)}${frameGrad(f)}
        <clipPath id="${cp}"><rect x="27" y="16" width="146" height="364" rx="30"/></clipPath>
      </defs>
      <rect x="16" y="6" width="168" height="384" rx="40" fill="url(#${f})"/>
      <rect x="16.6" y="6.6" width="166.8" height="382.8" rx="39" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1.1"/>
      <rect x="22" y="11" width="156" height="374" rx="35" fill="#070809"/>
      <g clip-path="url(#${cp})">
        <rect x="27" y="16" width="146" height="364" fill="url(#${s})"/>
        <circle cx="58" cy="120" r="66" fill="rgba(255,255,255,.13)"/>
        <circle cx="150" cy="300" r="78" fill="rgba(0,0,0,.14)"/>
        <polygon points="30,16 96,16 54,380 30,380" fill="rgba(255,255,255,.10)"/>
      </g>
      <rect x="79" y="25" width="42" height="12" rx="6" fill="#050608"/>
      <circle cx="114" cy="31" r="3" fill="#1a2330"/>
      <rect x="13.4" y="92" width="2.6" height="26" rx="1.3" fill="${shade(c, .5)}"/>
      <rect x="184" y="78" width="2.6" height="42" rx="1.3" fill="${shade(c, .5)}"/>
    </svg>`;
  }
  function tablet(p) {
    const c = brand(p), s = uid(), f = uid();
    return `<svg viewBox="0 0 280 372" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${p.name}">
      <defs>${screenGrad(s, c)}${frameGrad(f)}</defs>
      <rect x="14" y="10" width="252" height="352" rx="26" fill="url(#${f})"/>
      <rect x="19" y="15" width="242" height="342" rx="21" fill="#0a0c11"/>
      <rect x="27" y="23" width="226" height="326" rx="14" fill="url(#${s})"/>
      <polygon points="32,23 110,23 70,349 32,349" fill="rgba(255,255,255,.08)"/>
      <circle cx="140" cy="19" r="2.6" fill="#11151c"/>
    </svg>`;
  }
  function watch(p) {
    const c = brand(p), s = uid(), f = uid();
    return `<svg viewBox="0 0 200 384" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${p.name}">
      <defs>${screenGrad(s, c)}${frameGrad(f)}</defs>
      <path d="M70 30 h60 l-8 70 h-44 z" fill="${shade(c, .5)}"/>
      <path d="M70 354 h60 l-8 -70 h-44 z" fill="${shade(c, .5)}"/>
      <rect x="44" y="92" width="112" height="200" rx="40" fill="url(#${f})"/>
      <rect x="52" y="100" width="96" height="184" rx="33" fill="#0a0c11"/>
      <rect x="60" y="108" width="80" height="168" rx="27" fill="url(#${s})"/>
      <rect x="156" y="150" width="8" height="34" rx="4" fill="${shade(c, .6)}"/>
      <polygon points="64,108 96,108 80,276 64,276" fill="rgba(255,255,255,.10)"/>
    </svg>`;
  }
  function audio(p) {
    const c = brand(p), id = uid();
    if ((p.specs && p.specs.weight >= 100)) { // over-ear headphones
      return `<svg viewBox="0 0 300 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${p.name}">
        <defs>${screenGrad(id, c)}</defs>
        <path d="M55 175 a95 95 0 0 1 190 0" fill="none" stroke="url(#${id})" stroke-width="20" stroke-linecap="round"/>
        <rect x="36" y="150" width="50" height="110" rx="22" fill="${shade(c, .8)}"/>
        <rect x="214" y="150" width="50" height="110" rx="22" fill="${shade(c, .8)}"/>
        <ellipse cx="61" cy="205" rx="15" ry="34" fill="${shade(c, 1.2)}"/>
        <ellipse cx="239" cy="205" rx="15" ry="34" fill="${shade(c, 1.2)}"/>
      </svg>`;
    }
    // earbuds + case
    return `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${p.name}">
      <defs>${screenGrad(id, c)}</defs>
      <rect x="95" y="120" width="110" height="120" rx="26" fill="url(#${id})"/>
      <rect x="120" y="148" width="60" height="10" rx="5" fill="rgba(0,0,0,.25)"/>
      <g fill="#f3f5f9" stroke="${shade(c, .6)}" stroke-width="3">
        <path d="M120 60 q-16 0 -16 24 q0 16 16 16 q14 0 14 -20 z"/>
        <rect x="116" y="86" width="9" height="40" rx="4"/>
        <path d="M180 60 q16 0 16 24 q0 16 -16 16 q-14 0 -14 -20 z"/>
        <rect x="175" y="86" width="9" height="40" rx="4"/>
      </g>
    </svg>`;
  }
  function laptop(p) {
    const c = brand(p), s = uid(), f = uid();
    return `<svg viewBox="0 0 340 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${p.name}">
      <defs>${screenGrad(s, c)}${frameGrad(f)}</defs>
      <rect x="52" y="20" width="236" height="158" rx="14" fill="url(#${f})"/>
      <rect x="60" y="28" width="220" height="142" rx="8" fill="#0a0c11"/>
      <rect x="66" y="34" width="208" height="130" rx="5" fill="url(#${s})"/>
      <polygon points="70,34 130,34 96,164 70,164" fill="rgba(255,255,255,.08)"/>
      <path d="M30 178 h280 l24 40 a8 8 0 0 1 -8 12 H14 a8 8 0 0 1 -8 -12 z" fill="url(#${f})"/>
      <rect x="150" y="184" width="40" height="7" rx="3.5" fill="#9aa0ad"/>
    </svg>`;
  }
  function accessory(p) {
    const c = brand(p), id = uid();
    if (p.specs && p.specs.battery >= 1000) { // power bank
      return `<svg viewBox="0 0 220 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${p.name}">
        <defs>${screenGrad(id, c)}</defs>
        <rect x="55" y="30" width="110" height="260" rx="22" fill="url(#${id})"/>
        <polygon points="60,30 96,30 74,290 60,290" fill="rgba(255,255,255,.10)"/>
        <rect x="86" y="250" width="48" height="8" rx="4" fill="rgba(255,255,255,.6)"/>
        <rect x="86" y="264" width="34" height="8" rx="4" fill="rgba(255,255,255,.35)"/>
        <rect x="96" y="44" width="28" height="10" rx="3" fill="rgba(0,0,0,.25)"/>
      </svg>`;
    }
    // charger / adapter
    return `<svg viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${p.name}">
      <defs>${screenGrad(id, c)}</defs>
      <rect x="78" y="70" width="84" height="96" rx="20" fill="url(#${id})"/>
      <polygon points="82,70 110,70 92,166 82,166" fill="rgba(255,255,255,.12)"/>
      <rect x="104" y="40" width="8" height="30" rx="2" fill="#9aa0ad"/>
      <rect x="128" y="40" width="8" height="30" rx="2" fill="#9aa0ad"/>
      <rect x="108" y="166" width="24" height="40" rx="5" fill="#0a0c11"/>
    </svg>`;
  }
  function gaming(p) {
    const c = brand(p), id = uid();
    return `<svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${p.name}">
      <defs>${screenGrad(id, c)}</defs>
      <path d="M70 90 q90 -26 180 0 q40 12 44 70 q6 40 -30 46 q-26 4 -42 -22 q-12 -20 -62 -20 q-50 0 -62 20 q-16 26 -42 22 q-36 -6 -30 -46 q4 -58 44 -70 z" fill="url(#${id})"/>
      <circle cx="106" cy="128" r="8" fill="#0a0c11"/><rect x="98" y="120" width="16" height="16" rx="3" fill="#0a0c11" opacity="0"/>
      <rect x="98" y="126" width="18" height="5" rx="2.5" fill="#0a0c11"/><rect x="104" y="120" width="5" height="18" rx="2.5" fill="#0a0c11"/>
      <circle cx="210" cy="120" r="6" fill="#0a0c11"/><circle cx="230" cy="136" r="6" fill="#0a0c11"/><circle cx="214" cy="142" r="6" fill="#0a0c11"/><circle cx="226" cy="114" r="6" fill="#0a0c11"/>
      <circle cx="130" cy="160" r="13" fill="#0a0c11"/><circle cx="190" cy="160" r="13" fill="#0a0c11"/>
    </svg>`;
  }
  function svg(p) {
    switch (p && p.type) {
      case "tablet": return tablet(p);
      case "watch": return watch(p);
      case "audio": return audio(p);
      case "laptop": return laptop(p);
      case "accessory": return accessory(p);
      case "gaming": return gaming(p);
      default: return phone(p);
    }
  }
  return { svg };
})();

const UI = (() => {

  // ---------- helpers ----------
  const KD = n => `${Number(n).toFixed(n % 1 ? 2 : 0)} ${I18N.lang === "ar" ? "د.ك" : "KD"}`;
  const stars = r => "★★★★★".slice(0, Math.round(r)) + "☆☆☆☆☆".slice(0, 5 - Math.round(r));
  const discount = p => p.originalPrice > p.price ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
  const installment = p => (p.price / (p.installmentMonths || 12));

  /* Device visual: real photo if available, else the SVG illustration.
     A photo is used when the product has an explicit `image`, OR a global
     base path is configured (window.MH_IMAGE_BASE, e.g. "images/"); a missing
     photo removes itself on error and the SVG underneath shows through. */
  const photoSrc = p => p.image
    || (window.MH_IMAGE_BASE ? `${window.MH_IMAGE_BASE}${p.category}/${p.slug}.jpg` : "");
  const art = p => {
    const fig = DeviceArt.svg(p);
    const src = photoSrc(p);
    if (!src) return fig;
    const alt = (p.name || "").replace(/"/g, "&quot;");
    return `<img class="photo" src="${src}" alt="${alt}" loading="lazy" onerror="this.remove()">${fig}`;
  };

  // SVG icons
  const I = {
    search: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
    cart: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>',
    heart: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
    user: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    compare: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h7v15H3zM14 3h7v18h-7z"/></svg>',
    sun: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    menu: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>',
    chat: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.4 8.4 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5z"/></svg>',
    arrow: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
    chevron: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>',
    check: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg>',
    close: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    bolt: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 3 14h7l-1 8 10-12h-7z"/></svg>',
  };

  /* Scalable monochrome line icons (1em, inherit color) used in place of emoji.
     Use via UI.ic("name"); size them by setting font-size on the container. */
  const _ic = d => `<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const LI = {
    phone: _ic('<rect x="7" y="2" width="10" height="20" rx="2.5"/><line x1="11" y1="18.5" x2="13" y2="18.5"/>'),
    tablet: _ic('<rect x="4" y="3" width="16" height="18" rx="2.5"/><line x1="11" y1="18" x2="13" y2="18"/>'),
    watch: _ic('<rect x="6.5" y="7" width="11" height="10" rx="3"/><path d="M8.5 7 9 3h6l.5 4M8.5 17 9 21h6l.5-4"/>'),
    headphone: _ic('<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="2"/><rect x="17" y="14" width="4" height="6" rx="2"/>'),
    laptop: _ic('<rect x="4" y="5" width="16" height="11" rx="2"/><path d="M2 20h20"/>'),
    plug: _ic('<path d="M9 2v5M15 2v5M7 7h10v3a5 5 0 0 1-10 0z M12 15v5"/>'),
    gamepad: _ic('<path d="M7 12h4M9 10v4"/><circle cx="15.5" cy="11" r="1"/><circle cx="17.5" cy="13.5" r="1"/><path d="M6.5 8h11a3.5 3.5 0 0 1 3.4 4.3l-1 4.2A2.4 2.4 0 0 1 16 17l-1.3-2a2 2 0 0 0-1.7-1h-2a2 2 0 0 0-1.7 1L8 17a2.4 2.4 0 0 1-3.9-.5l-1-4.2A3.5 3.5 0 0 1 6.5 8z"/>'),
    cart: _ic('<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.4 11.6a1.6 1.6 0 0 0 1.6 1.4h8.4a1.6 1.6 0 0 0 1.6-1.3L22 7H6"/>'),
    heart: _ic('<path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.2l-1.7-1.6a5 5 0 0 0-7.1 7.1l1.7 1.6L12 21l7.1-6.7 1.7-1.6a5 5 0 0 0 0-7.1z"/>'),
    scale: _ic('<path d="M12 3v18M5 21h14M7 6l-4 7a3.5 3.5 0 0 0 8 0L7 6zM17 6l-4 7a3.5 3.5 0 0 0 8 0l-4-7zM7 6l5-1.5L17 6"/>'),
    search: _ic('<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>'),
    eye: _ic('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>'),
    user: _ic('<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>'),
    box: _ic('<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>'),
    chart: _ic('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),
    pin: _ic('<path d="M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>'),
    logout: _ic('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>'),
    truck: _ic('<path d="M2 6h11v9H2zM13 9h4l4 3v3h-8z"/><circle cx="6.5" cy="18" r="1.6"/><circle cx="17.5" cy="18" r="1.6"/>'),
    shield: _ic('<path d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z"/><path d="m9 12 2 2 4-4"/>'),
    returns: _ic('<path d="M3 7h11a5 5 0 0 1 0 10H8M3 7l4-4M3 7l4 4"/>'),
    card: _ic('<rect x="2" y="5" width="20" height="14" rx="2.5"/><path d="M2 10h20M6 15h4"/>'),
    bank: _ic('<path d="M3 10 12 4l9 6M5 10v8M19 10v8M9 10v8M15 10v8M3 21h18"/>'),
    cash: _ic('<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/>'),
    lock: _ic('<rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
    robot: _ic('<rect x="5" y="8" width="14" height="11" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01M9 16h6"/><circle cx="12" cy="4" r="1"/>'),
    trophy: _ic('<path d="M8 4h8v4a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 3M16 6h3a3 3 0 0 1-3 3M10 13h4l1 4H9zM8 21h8"/>'),
    sparkle: _ic('<path d="M12 3l1.8 4.7L19 9.5l-4.2 2.3L13 17l-1-5-5-1 5-1z"/><path d="M19 15l.7 1.8L21 17.5l-1.3.7L19 20l-.7-1.8L17 17.5l1.3-.7z"/>'),
    camera: _ic('<rect x="3" y="7" width="18" height="13" rx="2.5"/><circle cx="12" cy="13.5" r="3.5"/><path d="M8 7l1.5-3h5L16 7"/>'),
    battery: _ic('<rect x="3" y="8" width="16" height="8" rx="2"/><path d="M21 11v2"/><path d="M6 11v2"/>'),
    cpu: _ic('<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5"/><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"/>'),
    screen: _ic('<rect x="5" y="2" width="14" height="20" rx="2.5"/><path d="M10 19h4"/>'),
    signal: _ic('<path d="M4 20v-4M9 20v-8M14 20v-12M19 20V6"/>'),
    clock: _ic('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    calendar: _ic('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/>'),
    film: _ic('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M3 15h18M8 4v16M16 4v16"/>'),
    briefcase: _ic('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>'),
    cap: _ic('<path d="M2 9l10-4 10 4-10 4z"/><path d="M6 11v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5"/>'),
    tag: _ic('<path d="M3 3h7l11 11-7 7L3 10z"/><circle cx="7.5" cy="7.5" r="1.3"/>'),
    globe: _ic('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>'),
    play: _ic('<path d="M8 5v14l11-7z"/>'),
    trash: _ic('<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>'),
    warning: _ic('<path d="M12 3 2 20h20L12 3z"/><path d="M12 10v4M12 17h.01"/>'),
    flame: _ic('<path d="M12 3c1 3 5 4 5 9a5 5 0 0 1-10 0c0-2 1-3 1-4 1 1 2 1 2 0 0-2-1-3 2-5z"/>'),
    diamond: _ic('<path d="M6 3h12l3 6-9 12L3 9z"/><path d="M3 9h18M9 3 6 9l6 12 6-12-3-6"/>'),
    hand: _ic('<path d="M7 11V6a1.5 1.5 0 0 1 3 0M10 11V4a1.5 1.5 0 0 1 3 0v7M13 11V5a1.5 1.5 0 0 1 3 0v8a6 6 0 0 1-6 6h-1a6 6 0 0 1-4.5-2L4 15a1.6 1.6 0 0 1 2.5-2L7 13"/>'),
    wave: _ic('<path d="M4 12a8 8 0 0 1 16 0M7 12a5 5 0 0 1 10 0M10 12a2 2 0 0 1 4 0"/>'),
    bell: _ic('<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>'),
    sliders: _ic('<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>'),
    rocket: _ic('<path d="M5 16c-2 1-3 5-3 5s4-1 5-3M9 12l3 3M15 7a8 8 0 0 1-6 9l-3-3a8 8 0 0 1 9-6 5 5 0 0 0 4-4 5 5 0 0 0-4 4z"/><circle cx="14" cy="10" r="1.2"/>'),
    fire: _ic('<path d="M12 3c1 3 5 4 5 9a5 5 0 0 1-10 0c0-2 1-3 1-4 1 1 2 1 2 0 0-2-1-3 2-5z"/>'),
    mic: _ic('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>'),
  };
  const ic = name => LI[name] || "";

  // Category id → line icon
  const CAT_ICON = {
    smartphones: LI.phone, tablets: LI.tablet, smartwatches: LI.watch, audio: LI.headphone,
    laptops: LI.laptop, accessories: LI.plug, gaming: LI.gamepad,
  };
  const catIcon = id => CAT_ICON[id] || LI.phone;

  // ---------- Brand / logo ----------
  const BRAND = () => window.MH_BRAND || "Mobile 2000";
  // Original premium mark: a phone with signal waves (own artwork, not a trademark copy)
  const LOGO_MARK = '<svg viewBox="0 0 28 28" width="22" height="22" fill="none" aria-hidden="true"><rect x="8.5" y="3" width="10" height="22" rx="3" stroke="#fff" stroke-width="2"/><circle cx="13.5" cy="21.4" r="1.1" fill="#fff"/><path d="M20.5 8a6 6 0 0 1 0 8" stroke="#fff" stroke-width="1.7" stroke-linecap="round" opacity=".95"/><path d="M22.9 5.4a9.5 9.5 0 0 1 0 13.2" stroke="#fff" stroke-width="1.7" stroke-linecap="round" opacity=".6"/></svg>';
  function brandParts() {
    const b = BRAND().trim(); const i = b.lastIndexOf(" ");
    return i > 0 ? [b.slice(0, i + 1), b.slice(i + 1)] : [b, ""];
  }
  function logo(style) {
    const st = style ? ` style="${style}"` : "";
    if (window.MH_LOGO) return `<a href="index.html" class="logo logo-img"${st}><img src="${window.MH_LOGO}" alt="${BRAND()}"></a>`;
    const [a, b] = brandParts();
    return `<a href="index.html" class="logo"${st}><span class="mark">${LOGO_MARK}</span><span class="logo-text">${a}<b>${b}</b></span></a>`;
  }

  // ---------- Header ----------
  function header() {
    const cats = DB.CATEGORIES.filter(c => c.id !== "accessory");
    const user = Store.currentUser();
    return `
    <div class="promo-bar">
      <div class="container promo-track">
        <span><span class="li">${LI.card}</span> <span data-i18n="promo.installment"></span></span>
        <span><span class="li">${LI.truck}</span> <span data-i18n="promo.delivery"></span></span>
        <span><span class="li">${LI.shield}</span> <span data-i18n="promo.warranty"></span></span>
      </div>
    </div>
    <header class="site-header">
      <div class="container header-top">
        <button class="icon-btn hamburger" id="mobileMenuBtn" aria-label="Menu">${I.menu}</button>
        ${logo()}
        <div class="nav-search">
          <span class="s-icon">${I.search}</span>
          <input id="globalSearch" type="search" data-i18n-ph="search.placeholder" autocomplete="off" aria-label="Search">
          <button class="voice-btn" id="voiceBtn" aria-label="Voice search" title="Voice search">${LI.mic}</button>
          <div class="search-panel hidden" id="searchPanel"></div>
        </div>
        <div class="header-actions">
          <button class="icon-btn mobile-search-btn" id="mobileSearchBtn" aria-label="Search">${I.search}</button>
          <a class="icon-btn hide-sm" href="finder.html" aria-label="Phone Finder" title="Phone Finder">${LI.sparkle}</a>
          <button class="icon-btn" id="langBtn" aria-label="Language" title="EN / ع">
            <b style="font-size:.8rem;font-weight:800">${I18N.lang === "en" ? "ع" : "EN"}</b>
          </button>
          <button class="icon-btn" id="themeBtn" aria-label="Theme">${Theme.get() === "dark" ? I.sun : I.moon}</button>
          <div class="hdrop-wrap hide-sm">
            <button class="icon-btn" id="recentBtn" aria-label="Recently viewed">${LI.clock}<span class="count hidden" data-badge="recent">0</span></button>
            <div class="hdrop" id="recentDrop"></div>
          </div>
          <div class="hdrop-wrap">
            <button class="icon-btn" id="notifBtn" aria-label="Notifications">${LI.bell}<span class="count" data-badge="notif">2</span></button>
            <div class="hdrop" id="notifDrop"></div>
          </div>
          <a class="icon-btn hide-sm" href="compare.html" aria-label="Compare">${I.compare}<span class="count hidden" data-badge="compare">0</span></a>
          <a class="icon-btn" href="wishlist.html" aria-label="Wishlist">${I.heart}<span class="count hidden" data-badge="wishlist">0</span></a>
          <a class="icon-btn" href="cart.html" aria-label="Cart">${I.cart}<span class="count hidden" data-badge="cart">0</span></a>
          <a class="icon-btn" href="${user ? "account.html" : "login.html"}" aria-label="Account">${I.user}</a>
        </div>
      </div>
      <div class="nav-bar">
        <div class="container">
          <nav class="nav-links">
            <a href="index.html" data-nav="home" data-i18n="nav.home">Home</a>
            <div class="has-mega">
              <a href="products.html" data-nav="shop" data-i18n="nav.shop">Shop</a>
              ${megaMenu(cats)}
            </div>
            <a href="finder.html" data-nav="finder" data-i18n="nav.finder">Phone Finder</a>
            <a href="compare.html" data-nav="compare" data-i18n="nav.compare">Compare</a>
            <a href="products.html?deal=1" data-nav="deals" data-i18n="nav.deals">Deals</a>
            <a href="products.html?brand=Apple" data-nav="apple">Apple Store</a>
          </nav>
        </div>
      </div>
    </header>
    ${mobileDrawer(cats, user)}`;
  }

  function megaMenu(cats) {
    return `
    <div class="mega">
      <div>
        <h5 data-i18n="home.categories">Categories</h5>
        ${cats.map(c => `<a href="products.html?cat=${c.id}"><span class="li">${catIcon(c.id)}</span> ${I18N.lang === "ar" ? c.name_ar : c.name_en}</a>`).join("")}
      </div>
      <div>
        <h5 data-i18n="nav.brands">Brands</h5>
        ${DB.BRANDS.slice(0, 6).map(b => `<a href="products.html?brand=${encodeURIComponent(b)}">${b}</a>`).join("")}
      </div>
      <a class="promo" href="finder.html">
        <span style="font-size:2rem">${LI.robot}</span>
        <b data-i18n="finder.title">Smart Phone Finder</b>
        <span style="opacity:.85;font-size:.85rem" data-i18n="finder.sub">Get personalized picks</span>
      </a>
    </div>`;
  }

  function mobileDrawer(cats, user) {
    return `
    <div class="mobile-drawer" id="mobileDrawer">
      <div class="panel">
        <div class="row between" style="margin-bottom:18px">
          ${logo()}
          <button class="icon-btn" id="drawerClose">${I.close}</button>
        </div>
        <a href="index.html" data-i18n="nav.home">Home</a>
        <a href="products.html" data-i18n="nav.shop">Shop</a>
        <a href="finder.html" data-i18n="nav.finder">Phone Finder</a>
        <a href="compare.html" data-i18n="nav.compare">Compare</a>
        <a href="products.html?deal=1" data-i18n="nav.deals">Deals</a>
        <a href="wishlist.html" data-i18n="wish.title">Wishlist</a>
        <a href="${user ? "account.html" : "login.html"}" data-i18n="nav.account">Account</a>
        <div class="divider-line"></div>
        <h5 class="muted" style="padding:0 12px" data-i18n="home.categories">Categories</h5>
        ${cats.map(c => `<a href="products.html?cat=${c.id}"><span class="li">${catIcon(c.id)}</span> ${I18N.lang === "ar" ? c.name_ar : c.name_en}</a>`).join("")}
      </div>
    </div>`;
  }

  // ---------- Footer ----------
  function footer() {
    return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            ${logo("margin-bottom:12px")}
            <p class="muted" data-i18n="footer.about"></p>
            <div class="pay-icons" style="margin-top:14px">${LI.card}${LI.bank}${LI.phone}${LI.cash}</div>
          </div>
          <div>
            <h5 data-i18n="footer.shop">Shop</h5>
            <a href="products.html" data-i18n="nav.shop">Shop</a>
            <a href="products.html?deal=1" data-i18n="nav.deals">Deals</a>
            <a href="compare.html" data-i18n="nav.compare">Compare</a>
            <a href="finder.html" data-i18n="nav.finder">Phone Finder</a>
          </div>
          <div>
            <h5 data-i18n="footer.support">Support</h5>
            <a href="#">FAQ</a><a href="#">Shipping</a><a href="#">Returns</a><a href="#">Warranty</a>
          </div>
          <div>
            <h5 data-i18n="footer.company">Company</h5>
            <a href="#">About</a><a href="#">Careers</a><a href="#">Contact</a><a href="#">Branches</a>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} ${BRAND()} — <span data-i18n="footer.rights"></span></span>
          <span>Made in Kuwait</span>
        </div>
      </div>
    </footer>`;
  }

  // ---------- Product extras (derived, deterministic) ----------
  const COLOR_SETS = {
    Apple: ["#1d1d1f", "#f5f5f0", "#3a4d6b", "#b59a7a"], Samsung: ["#1b1b1b", "#6f7d92", "#3b2f6b", "#d8c7b0"],
    Honor: ["#0a2a5e", "#0f9d8f", "#1b1b1b"], Xiaomi: ["#1b1b1b", "#1f5eff", "#0f9d58"],
    Google: ["#1b1b1b", "#e6e6e6", "#3a7bd5"], Huawei: ["#0b0b0b", "#0a5e2a", "#6f7d92"],
    OnePlus: ["#0b0b0b", "#0f9d8f", "#1b3a6b"], Motorola: ["#1b1b1b", "#3b6ef5", "#7a5cff"],
    Nokia: ["#124191", "#1b1b1b", "#9aa0ad"], Infinix: ["#00c2a8", "#1b1b1b", "#1f5eff"],
    ZTE: ["#0047b3", "#1b1b1b"], Nothing: ["#e6e6e6", "#1b1b1b"], Sony: ["#1b1b1b", "#6f7d92"],
  };
  const swatchColors = p => (COLOR_SETS[p.brand] || ["#1b1b1b", "#6f7d92"]).slice(0, 4);
  function storageOptions(p) {
    const base = p.specs.storage; if (!base) return [];
    const ladder = [64, 128, 256, 512, 1024];
    const opts = ladder.filter(s => s >= base).slice(0, 3);
    return opts.length ? opts : [base];
  }
  const deliverText = p => p.stock > 0 ? (p.popularity > 85 ? t("deliver.tomorrow") : t("deliver.fast")) : t("pd.outStock");
  const stockPct = p => Math.max(6, Math.min(100, Math.round((p.stock / 60) * 100)));

  // ---------- Product card v3 ----------
  function productCard(p) {
    const d = discount(p);
    const fav = Store.inWishlist(p.id) ? "active" : "";
    const cmp = Store.inCompare(p.id) ? "active" : "";
    const out = p.stock <= 0;
    const isPhoneLike = ["phone", "tablet"].includes(p.type);
    const storages = isPhoneLike ? storageOptions(p) : [];
    const colors = swatchColors(p);
    const lowStock = p.stock > 0 && p.stock <= 12;
    return `
    <article class="p-card reveal" data-id="${p.id}">
      <div class="p-media">
        <div class="p-badges">
          ${d ? `<span class="badge badge-discount">-${d}% ${t("common.off")}</span>` : ""}
          ${p.tags && p.tags.includes("newArrival") ? `<span class="badge badge-new">${t("home.new")}</span>` : ""}
          ${p.tags && p.tags.includes("flashDeal") ? `<span class="badge badge-hot">${I.bolt} ${t("home.flash")}</span>` : ""}
          ${p.installmentMonths ? `<span class="badge badge-install">${t("common.from")} ${KD(installment(p))}/${t("common.month")}</span>` : ""}
        </div>
        <button class="p-fav ${fav}" data-act="fav" data-id="${p.id}" aria-label="Wishlist">${I.heart}</button>
        <button class="p-compare ${cmp}" data-act="compare" data-id="${p.id}" aria-label="Compare">${I.compare}</button>
        <button class="p-quickbtn" data-act="quick" data-id="${p.id}" aria-label="Quick view">${LI.eye}</button>
        <a href="product.html?id=${p.id}" class="art-link"><div class="art">${art(p)}</div></a>
      </div>
      <div class="p-body">
        <div class="row between" style="align-items:flex-start">
          <span class="p-brand">${p.brand}</span>
          <div class="p-rating" style="font-size:.78rem"><span class="stars">★</span> ${p.rating} <span class="muted">(${p.reviews})</span></div>
        </div>
        <h3 class="p-name"><a href="product.html?id=${p.id}">${p.name}</a></h3>
        <div class="p-specs">
          ${isPhoneLike
            ? `<span>${p.specs.ram}GB</span><span>${p.specs.storage}GB</span><span>${p.specs.screen}"</span><span>${p.specs.battery}mAh</span>`
            : (p.chips || []).map(c => `<span>${c}</span>`).join("")}
        </div>
        ${colors.length > 1 ? `<div class="p-swatches">${colors.map((c, i) => `<span class="swatch ${i === 0 ? "active" : ""}" style="background:${c}" data-color title="${c}"></span>`).join("")}<span class="muted" style="font-size:.72rem">${colors.length} ${t("card.colors")}</span></div>` : ""}
        ${storages.length ? `<div class="p-storage">${storages.map((s, i) => `<button class="${i === 0 ? "active" : ""}" data-storage>${s >= 1024 ? "1TB" : s + "GB"}</button>`).join("")}</div>` : ""}
        <div class="p-stock ${lowStock ? "low" : ""}">
          <span>${out ? t("pd.outStock") : lowStock ? `${t("card.only")} ${p.stock} ${t("card.left")}` : t("pd.inStock")}</span>
          <span class="bar"><i style="width:${stockPct(p)}%"></i></span>
        </div>
        <div class="p-price-row">
          <span class="p-price">${KD(p.price)}</span>
          ${p.originalPrice > p.price ? `<span class="p-old">${KD(p.originalPrice)}</span>` : ""}
        </div>
        <span class="p-deliver"><span class="li">${LI.truck}</span> ${deliverText(p)}</span>
        <div class="p-actions">
          <button class="btn ${out ? "btn-outline" : "btn-primary"} btn-sm btn-block" data-act="cart" data-id="${p.id}" ${out ? "disabled" : ""}>
            ${out ? t("pd.outStock") : t("cta.addCart")}
          </button>
        </div>
      </div>
    </article>`;
  }

  function cardGrid(list) {
    if (!list.length) return `<div class="empty-state"><div class="ico">${LI.search}</div><p>${t("shop.empty")}</p></div>`;
    return `<div class="products-grid">${list.map(productCard).join("")}</div>`;
  }

  function skeletons(n = 8) {
    return `<div class="products-grid">${Array.from({ length: n }).map(() => `<div class="skel skel-card"></div>`).join("")}</div>`;
  }

  // ---------- Toast ----------
  function toast(msg, ok = true) {
    let wrap = document.querySelector(".toast-wrap");
    if (!wrap) { wrap = document.createElement("div"); wrap.className = "toast-wrap"; document.body.appendChild(wrap); }
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = `<span class="ico">${ok ? I.check : LI.warning}</span> ${msg}`;
    wrap.appendChild(el);
    setTimeout(() => { el.style.opacity = "0"; el.style.transform = "translateY(10px)"; setTimeout(() => el.remove(), 300); }, 2200);
  }

  // ---------- Badges ----------
  function refreshBadges() {
    const map = { cart: Store.cartCount(), wishlist: Store.getWishlist().length, compare: Store.getCompare().length, recent: Store.getViewed().length };
    document.querySelectorAll("[data-badge]").forEach(el => {
      const key = el.getAttribute("data-badge");
      if (key === "notif") return; // managed manually
      const v = map[key] || 0;
      el.textContent = v;
      el.classList.toggle("hidden", v === 0);
    });
  }

  // fly-to-cart micro-interaction
  function flyToCart(fromEl, p) {
    const cartBtn = document.querySelector('[data-badge="cart"]')?.parentElement;
    if (!fromEl || !cartBtn) return;
    const a = fromEl.getBoundingClientRect(), b = cartBtn.getBoundingClientRect();
    const fly = document.createElement("div");
    fly.className = "fly-img";
    fly.innerHTML = art(p);
    fly.style.left = a.left + a.width / 2 - 30 + "px";
    fly.style.top = a.top + a.height / 2 - 30 + "px";
    document.body.appendChild(fly);
    requestAnimationFrame(() => {
      fly.style.transform = `translate(${b.left - a.left - a.width / 2 + 50}px, ${b.top - a.top - a.height / 2 + 20}px) scale(.2)`;
      fly.style.opacity = "0";
    });
    setTimeout(() => { fly.remove(); cartBtn.classList.add("bump"); setTimeout(() => cartBtn.classList.remove("bump"), 400); }, 750);
  }

  // ---------- Global product-card actions ----------
  function bindCardActions(root = document) {
    root.addEventListener("click", e => {
      // swatch / storage selectors: visual toggle only, don't navigate
      const sw = e.target.closest("[data-color]");
      if (sw) { sw.parentElement.querySelectorAll(".swatch").forEach(s => s.classList.remove("active")); sw.classList.add("active"); return; }
      const st = e.target.closest("[data-storage]");
      if (st) { st.parentElement.querySelectorAll("button").forEach(s => s.classList.remove("active")); st.classList.add("active"); return; }

      const btn = e.target.closest("[data-act]");
      if (!btn) return;
      const id = btn.getAttribute("data-id");
      const act = btn.getAttribute("data-act");
      if (act === "cart") {
        Store.addToCart(id);
        const card = btn.closest(".p-card, .qv-grid, .pd-info");
        const media = card && card.querySelector(".art, .qv-media .art, #pdMain .art");
        flyToCart(media, Store.getProduct(id));
        btn.classList.add("added"); btn.textContent = t("cta.added");
        setTimeout(() => { btn.classList.remove("added"); btn.textContent = t("cta.addCart"); }, 1200);
        toast(t("toast.addedCart"));
      }
      if (act === "fav") {
        const added = Store.toggleWishlist(id);
        document.querySelectorAll(`[data-act="fav"][data-id="${id}"]`).forEach(b => b.classList.toggle("active", added));
        toast(added ? t("toast.addedWish") : t("toast.removedWish"));
      }
      if (act === "compare") {
        const res = Store.toggleCompare(id);
        if (res === "full") { toast(t("toast.compareFull"), false); return; }
        document.querySelectorAll(`[data-act="compare"][data-id="${id}"]`).forEach(b => b.classList.toggle("active", res === "added"));
        toast(res === "added" ? t("toast.addedCompare") : t("toast.removed"));
      }
      if (act === "quick") { e.preventDefault(); quickView(id); }
    });
  }

  // ---------- Quick View modal ----------
  function quickView(id) {
    const p = Store.getProduct(id);
    if (!p) return;
    const d = discount(p);
    let back = document.getElementById("qvModal");
    if (!back) {
      back = document.createElement("div");
      back.id = "qvModal"; back.className = "modal-back";
      document.body.appendChild(back);
      back.addEventListener("click", e => { if (e.target === back) closeQuick(); });
    }
    const isPhoneLike = ["phone", "tablet"].includes(p.type);
    back.innerHTML = `
      <div class="modal">
        <div class="row between" style="padding:16px 20px 0">
          <span class="badge badge-soft">${t("qv.title")}</span>
          <button class="icon-btn" id="qvClose">${I.close}</button>
        </div>
        <div class="qv-grid">
          <div class="qv-media"><div class="art">${art(p)}</div>
            ${d ? `<span class="badge badge-discount" style="position:absolute;top:14px;inset-inline-start:14px">-${d}%</span>` : ""}
          </div>
          <div>
            <span class="p-brand">${p.brand}</span>
            <h2 style="margin:4px 0 8px">${p.name}</h2>
            <div class="p-rating"><span class="stars">${stars(p.rating)}</span> ${p.rating} <span class="muted">(${p.reviews} ${t("common.reviews")})</span></div>
            <div class="pd-price" style="margin:12px 0"><span class="now" style="font-size:1.6rem;font-weight:800;color:var(--primary)">${KD(p.price)}</span>
              ${p.originalPrice > p.price ? `<span class="was" style="text-decoration:line-through;color:var(--text-mute);margin-inline-start:8px">${KD(p.originalPrice)}</span>` : ""}</div>
            <span class="badge badge-install">${t("common.from")} ${KD(installment(p))}/${t("common.month")}</span>
            <div class="p-specs" style="margin:14px 0">
              ${isPhoneLike
                ? `<span>${p.specs.ram}GB RAM</span><span>${p.specs.storage}GB</span><span>${p.specs.screen}"</span><span>${p.specs.battery}mAh</span><span>${p.specs.processor}</span>`
                : (p.chips || []).map(c => `<span>${c}</span>`).join("")}
            </div>
            <div class="p-swatches" style="margin-bottom:14px">${swatchColors(p).map((c, i) => `<span class="swatch ${i === 0 ? "active" : ""}" style="background:${c}" data-color></span>`).join("")}</div>
            <div class="p-stock ${p.stock <= 12 ? "low" : ""}" style="margin-bottom:14px"><span>${p.stock > 0 ? t("pd.inStock") : t("pd.outStock")}</span><span class="bar"><i style="width:${stockPct(p)}%"></i></span></div>
            <div class="row" style="gap:10px">
              <button class="btn btn-primary btn-lg" style="flex:1" data-act="cart" data-id="${p.id}">${t("cta.addCart")}</button>
              <button class="icon-btn" data-act="fav" data-id="${p.id}" style="width:48px;height:48px">${I.heart}</button>
            </div>
            <a href="product.html?id=${p.id}" class="btn btn-ghost btn-block" style="margin-top:10px">${t("qv.full")}</a>
          </div>
        </div>
      </div>`;
    document.getElementById("qvClose").onclick = closeQuick;
    requestAnimationFrame(() => back.classList.add("open"));
    I18N.apply();
  }
  function closeQuick() { const b = document.getElementById("qvModal"); if (b) b.classList.remove("open"); }

  // ---------- Search ----------
  function bindSearch() {
    const input = document.getElementById("globalSearch");
    const panel = document.getElementById("searchPanel");
    if (!input) return;
    const TRENDING = ["iPhone 15 Pro Max", "Galaxy S24 Ultra", "Gaming phone", "Best camera", "Under 150 KD"];
    const POPULAR = ["5G", "256GB", "120Hz", "Flagship", "Under 100 KD", "Foldable"];
    const recentKey = "mh_recent_search";
    const getRecent = () => { try { return JSON.parse(localStorage.getItem(recentKey)) || []; } catch { return []; } };

    function chipRow(label, items) {
      return `<h5>${label}</h5><div class="search-chip-row">${items.map(r => `<button class="search-chip" data-q="${r}">${r}</button>`).join("")}</div>`;
    }

    function render(q) {
      q = (q || "").trim().toLowerCase();
      let html = "";
      if (!q) {
        const recent = getRecent();
        if (recent.length) html += `<h5>${t("search.recent")}</h5>` + recent.slice(0, 4).map(r => `<div class="search-row" data-q="${r}"><span class="li">${LI.clock}</span> <div class="meta"><b>${r}</b></div></div>`).join("");
        html += chipRow(t("search.trending"), TRENDING);
        html += chipRow(t("search.popular"), POPULAR);
        // trending products mini list
        const trend = [...Store.getProducts()].sort((a, b) => b.popularity - a.popularity).slice(0, 3);
        html += `<h5>${t("widget.trending")}</h5>` + trend.map(p => `
          <a class="search-row" href="product.html?id=${p.id}"><span class="thumb">${art(p)}</span>
            <div class="meta"><b>${p.name}</b><span>${p.brand} · ${KD(p.price)}</span></div></a>`).join("");
      } else {
        const matches = Store.getProducts().filter(p =>
          [p.name, p.brand, p.specs.processor, p.os, p.category, String(p.specs.storage), String(p.specs.ram), p.specs.rearCam, String(p.specs.battery)]
            .join(" ").toLowerCase().includes(q)).slice(0, 5);
        // brand suggestions
        const brands = DB.BRANDS.filter(b => b.toLowerCase().includes(q)).slice(0, 4);
        // spec suggestions
        const specs = ["5G", "256GB", "512GB", "120Hz", "108MP", "5000mAh", "Snapdragon"].filter(s => s.toLowerCase().includes(q)).slice(0, 4);
        if (!matches.length && !brands.length && !specs.length) html = `<div class="empty-state" style="padding:24px"><div class="ico">${LI.search}</div><p>${t("search.none")}</p></div>`;
        else {
          if (matches.length) html += `<h5>${t("search.results")}</h5>` + matches.map(p => `
            <a class="search-row" href="product.html?id=${p.id}"><span class="thumb">${art(p)}</span>
              <div class="meta"><b>${p.name}</b><span>${p.brand} · ${KD(p.price)}</span></div></a>`).join("");
          if (brands.length) html += chipRow(t("filter.brand"), brands);
          if (specs.length) html += chipRow(t("search.results"), specs);
        }
      }
      panel.innerHTML = html;
      panel.classList.remove("hidden");
    }

    input.addEventListener("focus", () => render(input.value));
    input.addEventListener("input", () => render(input.value));
    input.addEventListener("keydown", e => {
      if (e.key === "Enter" && input.value.trim()) {
        const recent = [input.value.trim(), ...getRecent().filter(r => r !== input.value.trim())].slice(0, 5);
        localStorage.setItem(recentKey, JSON.stringify(recent));
        location.href = `products.html?q=${encodeURIComponent(input.value.trim())}`;
      }
    });
    panel.addEventListener("click", e => {
      const row = e.target.closest("[data-q]");
      if (row) { input.value = row.getAttribute("data-q"); location.href = `products.html?q=${encodeURIComponent(input.value)}`; }
    });
    document.addEventListener("click", e => {
      if (!e.target.closest(".nav-search")) panel.classList.add("hidden");
    });
    const mob = document.getElementById("mobileSearchBtn");
    if (mob) mob.addEventListener("click", () => {
      const q = prompt(t("search.placeholder"));
      if (q && q.trim()) location.href = `products.html?q=${encodeURIComponent(q.trim())}`;
    });

    // Voice search (Web Speech API with graceful fallback)
    const voice = document.getElementById("voiceBtn");
    if (voice) voice.addEventListener("click", () => {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) { toast(t("search.listening")); voice.classList.add("listening"); setTimeout(() => voice.classList.remove("listening"), 1600); input.focus(); return; }
      const rec = new SR();
      rec.lang = I18N.lang === "ar" ? "ar-SA" : "en-US";
      rec.onstart = () => { voice.classList.add("listening"); toast(t("search.listening")); };
      rec.onresult = e => { input.value = e.results[0][0].transcript; render(input.value); };
      rec.onend = () => voice.classList.remove("listening");
      rec.onerror = () => voice.classList.remove("listening");
      try { rec.start(); } catch (_) {}
    });
  }

  // ---------- Header dropdowns: notifications + recently viewed ----------
  const NOTIFS = [
    { ic: "fire", t_en: "Flash sale is live", t_ar: "تخفيضات اليوم بدأت", s_en: "Up to 40% off — ends tonight", s_ar: "خصم حتى 40% — ينتهي الليلة", unread: true },
    { ic: "truck", t_en: "Free delivery unlocked", t_ar: "توصيل مجاني", s_en: "On all orders over 100 KD", s_ar: "لكل الطلبات فوق 100 د.ك", unread: true },
    { ic: "rocket", t_en: "New arrivals just landed", t_ar: "وصل حديثاً", s_en: "Check the latest releases", s_ar: "تصفّح أحدث الإصدارات", unread: false },
  ];
  function notifContent() {
    const ar = I18N.lang === "ar";
    return `<h5><span>${t("nav.notifications")}</span><button class="link" id="markRead" style="color:var(--primary);font-size:.72rem">${t("nav.markRead")}</button></h5>` +
      NOTIFS.map(n => `<div class="hdrop-item"><div class="ic-wrap">${ic(n.ic)}</div>
        <div class="meta"><b>${ar ? n.t_ar : n.t_en}</b><span>${ar ? n.s_ar : n.s_en}</span></div>
        ${n.unread ? '<span class="dot"></span>' : ""}</div>`).join("");
  }
  function recentContent() {
    const ids = Store.getViewed();
    const list = ids.map(Store.getProduct).filter(Boolean).slice(0, 5);
    if (!list.length) return `<h5>${t("nav.recentlyViewed")}</h5><div class="empty-state" style="padding:22px 10px"><p>${t("nav.empty")}</p></div>`;
    return `<h5><span>${t("nav.recentlyViewed")}</span><a class="link" href="account.html?tab=viewed" style="color:var(--primary);font-size:.72rem">${t("cta.viewAll")}</a></h5>` +
      list.map(p => `<a class="hdrop-item" href="product.html?id=${p.id}"><span class="hdrop-thumb">${art(p)}</span>
        <div class="meta"><b>${p.name}</b><span>${p.brand} · ${KD(p.price)}</span></div></a>`).join("");
  }
  function bindDropdown(btnId, dropId, contentFn) {
    const btn = document.getElementById(btnId), drop = document.getElementById(dropId);
    if (!btn || !drop) return;
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const open = drop.classList.contains("open");
      document.querySelectorAll(".hdrop.open").forEach(d => d.classList.remove("open"));
      if (!open) { drop.innerHTML = contentFn(); drop.classList.add("open"); I18N.apply();
        const mr = drop.querySelector("#markRead"); if (mr) mr.onclick = ev => { ev.stopPropagation(); drop.querySelectorAll(".dot").forEach(d => d.remove()); document.querySelector('[data-badge="notif"]').classList.add("hidden"); };
      }
    });
    drop.addEventListener("click", e => e.stopPropagation());
  }

  // ---------- Header interactions ----------
  function bindHeader() {
    const themeBtn = document.getElementById("themeBtn");
    if (themeBtn) themeBtn.addEventListener("click", () => { Theme.toggle(); themeBtn.innerHTML = Theme.get() === "dark" ? I.sun : I.moon; });
    const langBtn = document.getElementById("langBtn");
    if (langBtn) langBtn.addEventListener("click", () => I18N.toggle());
    const mBtn = document.getElementById("mobileMenuBtn"), drawer = document.getElementById("mobileDrawer"), close = document.getElementById("drawerClose");
    if (mBtn) mBtn.addEventListener("click", () => drawer.classList.add("open"));
    if (close) close.addEventListener("click", () => drawer.classList.remove("open"));
    if (drawer) drawer.addEventListener("click", e => { if (e.target === drawer) drawer.classList.remove("open"); });
    // active nav
    const page = document.body.getAttribute("data-page");
    document.querySelectorAll(`[data-nav]`).forEach(a => { if (a.getAttribute("data-nav") === page) a.classList.add("active"); });

    // header dropdowns
    bindDropdown("notifBtn", "notifDrop", notifContent);
    bindDropdown("recentBtn", "recentDrop", recentContent);
    document.addEventListener("click", () => document.querySelectorAll(".hdrop.open").forEach(d => d.classList.remove("open")));

    // sticky header shadow on scroll
    const hdr = document.querySelector(".site-header");
    if (hdr) {
      const onScroll = () => hdr.classList.toggle("scrolled", window.scrollY > 8);
      window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
    }
  }

  // ---------- AI Assistant ----------
  function assistant() {
    return `
    <button class="assistant-fab" id="assistantFab" aria-label="Assistant">${I.chat}</button>
    <div class="assistant-panel" id="assistantPanel">
      <div class="assistant-head">
        <div class="bot">${LI.robot}</div>
        <div style="flex:1"><b data-i18n="assistant.title">Phone Assistant</b><div style="font-size:.75rem;opacity:.85">● Online</div></div>
        <button class="icon-btn" id="assistantClose" style="background:rgba(255,255,255,.15);color:#fff;border:none">${I.close}</button>
      </div>
      <div class="assistant-body" id="assistantBody"></div>
      <div class="assistant-quick" id="assistantQuick"></div>
      <form class="assistant-input" id="assistantForm">
        <input id="assistantInput" data-i18n-ph="assistant.placeholder" autocomplete="off">
        <button class="icon-btn" type="submit" style="background:var(--primary);color:#fff;border:none">${I.arrow}</button>
      </form>
    </div>`;
  }

  // ---------- Reveal on scroll ----------
  function revealOnScroll(root = document) {
    const els = root.querySelectorAll(".reveal:not(.in)");
    if (!("IntersectionObserver" in window)) { els.forEach(el => el.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.08 });
    els.forEach(el => io.observe(el));
  }

  // ---------- Mount ----------
  function mount() {
    const h = document.getElementById("site-header");
    const f = document.getElementById("site-footer");
    if (h) h.innerHTML = header();
    if (f) f.innerHTML = footer();
    // assistant on every page
    const a = document.createElement("div"); a.innerHTML = assistant(); document.body.appendChild(a);
    I18N.apply();
    bindHeader();
    bindSearch();
    bindCardActions();
    refreshBadges();
    if (window.Assistant) Assistant.init();
    revealOnScroll();
    Store.on("*", () => refreshBadges());
  }

  return { mount, header, footer, footerEl: footer, productCard, cardGrid, skeletons, toast, refreshBadges, revealOnScroll, bindCardActions, icons: I, KD, stars, discount, installment, art, ic, catIcon, deviceArt: p => DeviceArt.svg(p) };
})();

window.UI = UI;
