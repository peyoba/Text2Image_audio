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
 * 主应用类，负责初始化和协调各个组件
 */
class App {
  constructor() {
    // 初始化时禁用生成按钮
    // document.getElementById('generate-button').disabled = true;

    // 添加页面加载完成事件监听
    document.addEventListener("DOMContentLoaded", () => {
      this.initializeApp();
    });
  }

  /**
   * 初始化应用
   */
  initializeApp() {
    console.log("应用初始化开始");

    // 检查浏览器兼容性
    this.checkBrowserCompatibility();

    // 初始化错误处理
    this.initializeErrorHandling();

    // 初始化语言选择器
    this.initializeLanguageSelector();

    // 初始化UI处理器（幂等）
    if (!window.uiHandler) {
      window.uiHandler = new UIHandler();
    }

    // 初始化UI增强功能（幂等）
    if (!window.uiEnhancements) {
      window.uiEnhancements = new UIEnhancements();
    }

    console.log("应用初始化完成");
  }

  /**
   * 初始化语言选择器
   */
  initializeLanguageSelector() {
    const langSelect = document.getElementById("lang-select");
    if (langSelect) {
      // 设置初始值
      const currentLang = getCurrentLang();
      langSelect.value = currentLang;
      console.log("设置语言选择器初始值:", currentLang);

      // 添加事件监听器
      langSelect.addEventListener("change", (e) => {
        console.log("语言选择器变化:", e.target.value);
        const success = setLanguage(e.target.value);
        if (!success) {
          console.error("语言切换失败");
          // 恢复原来的选择
          langSelect.value = getCurrentLang();
        }
      });
    } else {
      console.error("未找到语言选择器元素");
    }
  }

  /**
   * 检查浏览器兼容性
   */
  checkBrowserCompatibility() {
    // 检查是否支持必要的API
    const requiredFeatures = ["fetch", "Promise", "FileReader", "AudioContext"];

    const missingFeatures = requiredFeatures.filter((feature) => !window[feature]);

    if (missingFeatures.length > 0) {
      console.warn("浏览器可能不支持以下功能:", missingFeatures);
      uiHandler.showError(
        "您的浏览器可能不支持某些必要功能，请使用最新版本的Chrome、Firefox或Edge浏览器。"
      );
    }
  }

  /**
   * 初始化错误处理
   */
  initializeErrorHandling() {
    // 全局错误处理
    window.addEventListener("error", (event) => {
      console.error("全局错误:", event.error);
      uiHandler.showError("发生未知错误，请刷新页面重试");
    });

    // 未处理的Promise错误
    window.addEventListener("unhandledrejection", (event) => {
      console.error("未处理的Promise错误:", event.reason);
      uiHandler.showError("操作失败，请稍后重试");
    });
  }
}

// 创建应用实例
const app = new App();

// 调试：监听localStorage变化
window.addEventListener("storage", (e) => {
  console.log("localStorage变化:", e);
});
