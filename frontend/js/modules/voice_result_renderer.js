/**
 * Voice result renderer (no-bundler)
 * Centralizes DOM updates for displaying voice generation result.
 *
 * window.VoiceResultRenderer.display(response, params?)
 *   - response: { audioUrl: string, blob?: Blob }
 *   - params: { blob?: Blob, lastParams?: { voice:string, speed:string, text:string } }
 */
(function () {
  "use strict";

  function formatBytes(bytes) {
    try {
      if (typeof window.formatBytesSafe === "function") return window.formatBytesSafe(bytes);
    } catch (_) {}
    if (!bytes && bytes !== 0) return "--";
    var units = ["B", "KB", "MB", "GB"];
    var i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    var val = bytes / Math.pow(1024, i);
    return (
      (val >= 100 ? val.toFixed(0) : val >= 10 ? val.toFixed(1) : val.toFixed(2)) + " " + units[i]
    );
  }

  function display(response, params) {
    try {
      var resultSection = document.getElementById("voice-result-section");
      var audioPlayer = document.getElementById("generated-audio");
      if (!resultSection || !audioPlayer || !response || !response.audioUrl) return;

      // 设置音频源
      audioPlayer.src = response.audioUrl;
      try {
        audioPlayer.load();
      } catch (_) {}

      // 显示结果区域
      resultSection.style.display = "block";
      try {
        resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (_) {}

      // 更新信息区：模型/速度
      var last = (params && params.lastParams) || {};
      var voiceModelEl = document.getElementById("used-voice-model");
      var speedEl = document.getElementById("used-voice-speed");
      if (voiceModelEl) {
        var voiceKey = last.voice || (document.getElementById("voice-model") || {}).value || "";
        var names = window.VOICE_NAMES || {};
        voiceModelEl.textContent = names[voiceKey] || voiceKey || "--";
      }
      if (speedEl) {
        var speedStr = last.speed || (document.getElementById("voice-speed") || {}).value || "";
        speedEl.textContent = (speedStr ? String(speedStr) : "--") + (speedStr ? "x" : "");
      }

      // 文件大小
      var blob = (params && params.blob) || response.blob;
      var sizeEl = document.getElementById("voice-filesize");
      if (sizeEl && blob && typeof blob.size === "number") {
        sizeEl.textContent = formatBytes(blob.size);
      }

      // 显示保存按钮（如果用户已登录）
      try {
        if (window.AuthManager && window.AuthManager.isLoggedIn()) {
          var saveBtn = document.getElementById("save-audio-btn");
          if (saveBtn) saveBtn.style.display = "inline-flex";
        }
      } catch (_) {}
    } catch (_) {}
  }

  /**
   * Global voice result renderer.
   * @global
   * @property {(response:{audioUrl:string,blob?:Blob}, params?:{blob?:Blob,lastParams?:{voice:string,speed:string,text:string}})=>void} display
   */
  window.VoiceResultRenderer = { display: display };
})();
