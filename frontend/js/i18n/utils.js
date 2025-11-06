/**
 * i18n 工具函数模块
 * 提供语言规范化等通用功能
 */

// DEBUG 日志抑制（默认关闭），与 app.js 逻辑一致，尽早执行
(function () {
  try {
    var qs = new URLSearchParams(location.search || "");
    var debugFlag =
      window.DEBUG === true ||
      qs.get("debug") === "1" ||
      (typeof localStorage !== "undefined" &&
        (localStorage.getItem("DEBUG") === "1" || localStorage.getItem("debug") === "1"));
    if (!debugFlag) {
      var noop = function () {};
      console.debug = noop;
      console.info = noop;
      console.log = noop;
    }
  } catch (_) {}
})();

/**
 * 规范化语言代码
 * @param {string} lang - 语言代码
 * @returns {string} 规范化后的语言代码 ('zh' 或 'en')
 */
function normalizeLang(lang) {
  if (!lang) return "en";
  const lower = String(lang).toLowerCase();
  if (lower.startsWith("zh")) return "zh";
  return "en";
}

// 导出到全局
if (typeof window !== 'undefined') {
  window.normalizeLang = normalizeLang;
}

