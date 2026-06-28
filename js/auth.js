/* Auth — login & register with client-side validation. */
(function () {
  UI.mount();
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setErr(id, on) {
    const f = document.getElementById(id).closest(".field");
    f.classList.toggle("invalid", on);
  }

  // ----- Register -----
  const reg = document.getElementById("registerForm");
  if (reg) {
    reg.addEventListener("submit", e => {
      e.preventDefault();
      const name = val("name"), email = val("email"), pass = val("password"), conf = val("confirm");
      let ok = true;
      if (!name.trim()) { setErr("name", true); ok = false; } else setErr("name", false);
      if (!emailRe.test(email)) { setErr("email", true); ok = false; } else setErr("email", false);
      if (pass.length < 6) { setErr("password", true); ok = false; } else setErr("password", false);
      if (pass !== conf || !conf) { setErr("confirm", true); ok = false; } else setErr("confirm", false);
      if (!ok) return;

      const res = Store.register({ name, email, password: pass });
      if (!res.ok && res.error === "exists") {
        setErr("email", true);
        UI.toast(I18N.lang === "ar" ? "البريد مستخدم بالفعل" : "Email already registered", false);
        return;
      }
      UI.toast(I18N.lang === "ar" ? "تم إنشاء الحساب!" : "Account created!");
      setTimeout(() => location.href = "account.html", 700);
    });
  }

  // ----- Login -----
  const log = document.getElementById("loginForm");
  if (log) {
    log.addEventListener("submit", e => {
      e.preventDefault();
      const email = val("email"), pass = val("password");
      let ok = true;
      if (!emailRe.test(email)) { setErr("email", true); ok = false; } else setErr("email", false);
      if (pass.length < 6) { setErr("password", true); ok = false; } else setErr("password", false);
      if (!ok) return;

      const res = Store.login({ email, password: pass });
      if (!res.ok) {
        UI.toast(I18N.lang === "ar" ? "بيانات الدخول غير صحيحة" : "Invalid email or password", false);
        return;
      }
      UI.toast(I18N.lang === "ar" ? "مرحباً بعودتك!" : "Welcome back!");
      setTimeout(() => location.href = "account.html", 700);
    });
  }

  const val = id => (document.getElementById(id) || {}).value || "";
})();
