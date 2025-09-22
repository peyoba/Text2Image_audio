/**
 * Voice URL params (no-bundler)
 * Handle parsing/applying/cleaning URL parameters for the voice page.
 *
 * window.VoiceUrlParams:
 *  - applyAndMaybeAutoGenerate(): void
 */
(function () {
  "use strict";

  function applyAndMaybeAutoGenerate() {
    try {
      var urlParams = new URLSearchParams(window.location.search);
      var text = urlParams.get("text");
      var voice = urlParams.get("voice");
      var speed = urlParams.get("speed");
      var auto = urlParams.get("auto");
      var source = urlParams.get("source");

      if (text) {
        var textInput = document.getElementById("voice-text-input");
        if (textInput) {
          try {
            textInput.value = decodeURIComponent(text);
          } catch (_) {
            textInput.value = text;
          }
          try {
            textInput.dispatchEvent(new Event("input"));
          } catch (_) {}
          if (
            source === "main" &&
            window.VoiceApp &&
            typeof window.VoiceApp.showInfo === "function"
          ) {
            try {
              window.VoiceApp.showInfo(
                "已自动填入您在主页输入的文本，您可以直接生成语音或进行修改。"
              );
            } catch (_) {}
          }
          try {
            textInput.scrollIntoView({ behavior: "smooth", block: "center" });
          } catch (_) {}
        }
      }

      if (voice) {
        var voiceModel = document.getElementById("voice-model");
        if (voiceModel) voiceModel.value = voice;
      }

      if (speed) {
        var speedSlider = document.getElementById("voice-speed");
        var speedDisplay = document.getElementById("speed-display");
        if (speedSlider) {
          speedSlider.value = String(speed);
          if (speedDisplay)
            speedDisplay.textContent = String(parseFloat(speedSlider.value) || 1.0) + "x";
          var audio = document.getElementById("generated-audio");
          if (audio) {
            try {
              audio.playbackRate = parseFloat(speedSlider.value) || 1.0;
            } catch (_) {}
          }
        }
      }

      var shouldCleanNow = (text || source || voice || speed) && auto !== "1";
      if (shouldCleanNow) {
        try {
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (_) {}
      }

      if (
        auto === "1" &&
        text &&
        window.VoiceApp &&
        typeof window.VoiceApp.generateVoice === "function"
      ) {
        try {
          window.VoiceApp.generateVoice();
        } catch (_) {}
        setTimeout(function () {
          try {
            window.history.replaceState({}, document.title, window.location.pathname);
          } catch (_) {}
        }, 0);
      }
    } catch (_) {}
  }

  /**
   * Global URL params helper for voice page.
   * @global
   * @property {()=>void} applyAndMaybeAutoGenerate
   */
  window.VoiceUrlParams = { applyAndMaybeAutoGenerate: applyAndMaybeAutoGenerate };
})();
