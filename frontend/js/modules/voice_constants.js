// 语音模块只读常量（全局导出，便于渐进式迁移与复用）
// 注意：本文件仅声明常量，不包含业务逻辑；页面未引入本文件时，调用方需自行回退到默认值，确保零回归。

(function initVoiceConstants() {
  if (typeof window === "undefined") return;

  // 语音模型名称映射（UI 展示用）
  // 注意：这里不再硬编码名称，而是提供一个动态获取函数
  window.getVoiceName =
    window.getVoiceName ||
    function (voiceKey) {
      if (typeof window.t === "function") {
        const keyMap = {
          nova: "voiceNova",
          alloy: "voiceAlloy",
          echo: "voiceEcho",
          fable: "voiceFable",
          onyx: "voiceOnyx",
          shimmer: "voiceShimmer",
        };
        return window.t(keyMap[voiceKey]) || voiceKey;
      }
      // 回退到英文（当i18n不可用时）
      const fallback = {
        nova: "Nova (Female-Clear)",
        alloy: "Alloy (Male-Gentle)",
        echo: "Echo (Male-Deep)",
        fable: "Fable (Male-Young)",
        onyx: "Onyx (Male-Magnetic)",
        shimmer: "Shimmer (Female-Sweet)",
      };
      return fallback[voiceKey] || voiceKey;
    };

  // 提示消息颜色（内联浮层）
  window.VOICE_MESSAGE_COLORS = window.VOICE_MESSAGE_COLORS || {
    success: "#28a745",
    error: "#dc3545",
    info: "#17a2b8",
  };

  // 波形可视化颜色（Canvas）
  window.VOICE_WAVEFORM_COLORS = window.VOICE_WAVEFORM_COLORS || {
    bg: "var(--color-wave-bg, #0e1424)",
    bar: "#00cfff",
  };

  // 工具函数：格式化字节（与 voice_app.js 中保持一致，供复用）
  if (!window.formatBytesSafe) {
    window.formatBytesSafe = function formatBytesSafe(bytes) {
      if (!bytes && bytes !== 0) return "--";
      const units = ["B", "KB", "MB", "GB"];
      const idx = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
      const val = bytes / Math.pow(1024, idx);
      return `${val.toFixed(val >= 100 ? 0 : val >= 10 ? 1 : 2)} ${units[idx]}`;
    };
  }
})();
