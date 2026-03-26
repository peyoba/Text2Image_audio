/**
 * 前端全局配置
 * 所有环境相关的常量统一在此定义，其他文件通过 window.APP_CONFIG 读取。
 * 部署到新环境时只需修改此文件。
 *
 * 优先级：window.API_BASE (外部注入) > localStorage > 默认值
 */
(function () {
  "use strict";

  var DEFAULT_API_BASE = "https://text2image-api.peyoba660703.workers.dev";

  // 前端域名列表，防止 localStorage 缓存的旧值把 API 请求发到前端自身
  var FRONTEND_HOSTS = ["aistone.cfd", "aistone.ai", "aistone.org"];

  function isValidApiBase(url) {
    if (!url || typeof url !== "string" || !url.trim()) return false;
    try {
      var host = new URL(url.trim()).hostname;
      for (var i = 0; i < FRONTEND_HOSTS.length; i++) {
        if (host === FRONTEND_HOSTS[i] || host === "www." + FRONTEND_HOSTS[i]) return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  // --- 可被运行时覆盖的 API 基础地址 ---
  var apiBase;
  try {
    var injected =
      (typeof window !== "undefined" && window.API_BASE) ||
      (typeof localStorage !== "undefined" && localStorage.getItem("api_base"));
    apiBase = isValidApiBase(injected)
      ? injected.trim().replace(/\/+$/, "")
      : DEFAULT_API_BASE;
    // 清除无效的 localStorage 缓存
    if (injected && !isValidApiBase(injected)) {
      try { localStorage.removeItem("api_base"); } catch (e) {}
    }
  } catch (e) {
    apiBase = DEFAULT_API_BASE;
  }

  window.APP_CONFIG = Object.freeze({
    /** 后端 Worker API 根地址（不含 /api） */
    API_BASE: apiBase,

    /** 站点主域名 */
    SITE_URL: "https://aistone.ai",

    /** Google OAuth 回调 postMessage 目标源 */
    POST_MESSAGE_ORIGIN: "https://aistone.ai",
  });

  // 兼容：旧代码中大量使用 window.API_BASE
  if (!window.API_BASE) {
    window.API_BASE = window.APP_CONFIG.API_BASE;
  }
})();
