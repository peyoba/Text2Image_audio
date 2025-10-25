(function () {
  const CONSENT_KEY = "cookie_consent_ack_20251025";

  function hasStorageSupport() {
    try {
      if (typeof window === "undefined" || !window.localStorage) return false;
      const testKey = "__consent_test__";
      window.localStorage.setItem(testKey, "1");
      window.localStorage.removeItem(testKey);
      return true;
    } catch (_) {
      return false;
    }
  }

  function markAccepted() {
    if (!hasStorageSupport()) return;
    try {
      window.localStorage.setItem(CONSENT_KEY, String(Date.now()));
    } catch (_) {}
  }

  function alreadyAccepted() {
    if (!hasStorageSupport()) return false;
    try {
      return Boolean(window.localStorage.getItem(CONSENT_KEY));
    } catch (_) {
      return false;
    }
  }

  function createBanner() {
    const banner = document.createElement("section");
    banner.className = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-live", "polite");
    banner.innerHTML = `
      <div class="cookie-banner__content">
        <p>
          我们会使用必要的 Cookie 保障站点运行，并可能加载 Google AdSense 等第三方服务。
          点击“接受”即表示同意。详情请查看 <a href="privacy.html">隐私政策</a>。
        </p>
        <div class="cookie-banner__actions">
          <button type="button" class="cookie-banner__accept">接受</button>
          <button type="button" class="cookie-banner__dismiss">稍后提醒</button>
        </div>
      </div>
    `;
    return banner;
  }

  function initBanner() {
    if (alreadyAccepted()) return;

    const existing = document.querySelector(".cookie-banner");
    if (existing) return;

    const banner = createBanner();
    document.body.appendChild(banner);

    const acceptBtn = banner.querySelector(".cookie-banner__accept");
    const dismissBtn = banner.querySelector(".cookie-banner__dismiss");

    if (acceptBtn) {
      acceptBtn.addEventListener("click", () => {
        markAccepted();
        banner.remove();
      });
    }

    if (dismissBtn) {
      dismissBtn.addEventListener("click", () => {
        banner.remove();
      });
    }
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initBanner, { once: true });
    } else {
      initBanner();
    }
  }
})();
