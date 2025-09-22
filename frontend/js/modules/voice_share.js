/**
 * Voice share utilities (no-bundler)
 * Provide a single API to share or fallback to copy.
 *
 * window.VoiceShare.share({ title?: string, text?: string, url?: string })
 */
(function () {
  "use strict";

  async function share(input) {
    const data = input || {};
    const title = typeof data.title === "string" ? data.title : "AISTONE 语音合成";
    const text =
      typeof data.text === "string" ? data.text : "我用 AISTONE 生成了一段 AI 语音，快来听听吧！";
    const url = typeof data.url === "string" ? data.url : window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: title, text: text, url: url });
        return;
      } catch (err) {
        if (err && err.name === "AbortError") return;
        // continue to fallback
      }
    }

    // Fallback: copy url
    if (window.UIUtils && typeof window.UIUtils.copyText === "function") {
      try {
        await window.UIUtils.copyText(url);
        return;
      } catch (_) {}
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(url);
      } catch (_) {}
    } else {
      try {
        const ta = document.createElement("textarea");
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      } catch (_) {}
    }
    if (window.UIUtils && typeof window.UIUtils.toast === "function") {
      try {
        window.UIUtils.toast(
          window.getCurrentLang && window.getCurrentLang() === "zh"
            ? "页面链接已复制到剪贴板"
            : "Link copied to clipboard",
          "success"
        );
      } catch (_) {}
    }
  }

  /**
   * Global share helper for voice page.
   * @global
   * @property {(input?:{title?:string,text?:string,url?:string})=>Promise<void>} share
   */
  window.VoiceShare = { share: share };
})();
