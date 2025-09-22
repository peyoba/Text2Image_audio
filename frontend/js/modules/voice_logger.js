/**
 * Voice logger (no-bundler)
 * Minimal DOM logger for the voice page. Zero-regression fallback friendly.
 *
 * window.VoiceLogger.log(message: string)
 */
(function () {
  "use strict";

  function log(message) {
    try {
      var ts = new Date().toLocaleTimeString();
      var line = "[" + ts + "] " + String(message == null ? "" : message);
      var el = document.getElementById("voice-log");
      if (!el) return;
      el.textContent += (el.textContent ? "\n" : "") + line;
      el.scrollTop = el.scrollHeight;
    } catch (_) {}
  }

  /**
   * Global voice logger.
   * @global
   * @property {(message:string)=>void} log
   */
  window.VoiceLogger = { log: log };
})();
