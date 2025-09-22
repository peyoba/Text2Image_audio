/**
 * Voice UI controls (no-bundler)
 * Centralizes small UI state updates for the voice page.
 *
 * window.VoiceUIControls provides:
 *  - updateGenerateButton(isLoading: boolean)
 *  - updateProgress(percent: number, label?: string)
 */
(function () {
  "use strict";

  function updateGenerateButton(isLoading) {
    try {
      var btn = document.getElementById("generate-voice-btn");
      if (!btn) return;
      var btnText = btn.querySelector(".btn-text");
      var btnLoading = btn.querySelector(".btn-loading");
      if (isLoading) {
        btn.disabled = true;
        if (btnText) btnText.style.display = "none";
        if (btnLoading) btnLoading.style.display = "flex";
      } else {
        btn.disabled = false;
        if (btnText) btnText.style.display = "inline";
        if (btnLoading) btnLoading.style.display = "none";
      }
    } catch (_) {}
  }

  function updateProgress(percent, label) {
    try {
      var bar = document.getElementById("voice-progress-bar");
      var box = document.getElementById("voice-progress");
      var text = document.getElementById("voice-progress-label");
      if (!bar || !box) return;
      var p = typeof percent === "number" ? percent : 0;
      if (p > 0 && p < 100) {
        box.style.display = "block";
        bar.style.width = String(Math.max(2, Math.min(100, p))) + "%";
        if (text) text.textContent = (label && String(label)) || "处理中...";
      } else if (p >= 100) {
        bar.style.width = "100%";
        if (text) text.textContent = (label && String(label)) || "完成";
        setTimeout(function () {
          if (box) box.style.display = "none";
        }, 600);
      } else {
        box.style.display = "none";
        bar.style.width = "0%";
      }
    } catch (_) {}
  }

  /**
   * Global voice UI controls.
   * @global
   * @property {(isLoading:boolean)=>void} updateGenerateButton
   * @property {(percent:number, label?:string)=>void} updateProgress
   */
  window.VoiceUIControls = {
    updateGenerateButton: updateGenerateButton,
    updateProgress: updateProgress,
  };
})();
