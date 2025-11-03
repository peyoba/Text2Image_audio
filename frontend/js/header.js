(function () {
  const HEADER_PATH = "partials/header.html";

  function getActiveNavId() {
    const tag = document.body?.dataset?.pageId;
    if (tag) return tag;
    const path = location.pathname || "";
    if (path.endsWith("/") || path.endsWith("index.html")) return "home";
    if (path.includes("image-generator")) return "image";
    if (path.includes("voice")) return "voice";
    if (path.includes("services")) return "services";
    if (path.includes("blog")) return "blog";
    if (path.includes("about")) return "about";
    if (path.includes("contact")) return "contact";
    return "";
  }

  function activateNav(navRoot, activeId) {
    if (!navRoot || !activeId) return;
    const links = navRoot.querySelectorAll("[data-nav-id]");
    links.forEach((link) => {
      if (link.getAttribute("data-nav-id") === activeId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  function bindLanguageSelector(scope) {
    const select = scope.querySelector("#lang-select");
    if (!select) return;
    try {
      const current = typeof getCurrentLang === "function" ? getCurrentLang() : "en";
      select.value = current;
    } catch (error) {
      console.warn("[header] Failed to read current language:", error);
      select.value = "en";
    }
    select.addEventListener("change", (event) => {
      if (typeof setLanguage === "function") {
        const ok = setLanguage(event.target.value);
        if (!ok && typeof getCurrentLang === "function") {
          select.value = getCurrentLang();
        }
      }
    });
  }

  function bindAuthTrigger(scope) {
    const loginBtn = scope.querySelector("[data-open-login]");
    if (loginBtn) {
      loginBtn.addEventListener("click", () => {
        if (typeof showModal === "function") {
          showModal("login-modal");
        }
      });
    }
  }

  function mountHeader(target) {
    if (!target) return;
    fetch(HEADER_PATH)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load header partial");
        return response.text();
      })
      .then((html) => {
        target.innerHTML = html;
        const nav = target.querySelector("nav.navbar");
        const bodyPageId = document.body?.dataset?.pageId;
        const activeId = bodyPageId || getActiveNavId();
        activateNav(nav, activeId);
        bindLanguageSelector(nav);
        bindAuthTrigger(nav);
        if (typeof window.authManager !== "undefined" && window.authManager?.syncHeader) {
          window.authManager.syncHeader(nav);
        }
      })
      .catch((err) => {
        console.error("加载导航失败:", err);
      });
  }

  function initHeader() {
    const mount = document.querySelector("[data-header]");
    if (!mount) return;
    mountHeader(mount);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHeader, { once: true });
  } else {
    initHeader();
  }

  window.initHeader = initHeader;
})();
