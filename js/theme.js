/* =================================================================
   Theme — dark / light mode, persisted, respects system preference.
   Applied as early as possible to avoid flash of wrong theme.
   ================================================================= */
(function () {
  const KEY = "mh_theme";
  const saved = localStorage.getItem(KEY);
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = saved || (prefersDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);

  // Apply language direction as early as possible (default Arabic / RTL)
  const lang = localStorage.getItem("mh_lang") || "ar";
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

  window.Theme = {
    get() { return document.documentElement.getAttribute("data-theme"); },
    toggle() {
      const next = this.get() === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem(KEY, next);
      document.dispatchEvent(new CustomEvent("themechange", { detail: next }));
    }
  };
})();
