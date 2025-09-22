/**
 * Voice download utilities (no-bundler)
 * Provide a single API to download audio by Blob or URL.
 *
 * window.VoiceDownload.download({ url?: string, blob?: Blob, filenameBase?: string })
 */
(function () {
  "use strict";

  function detectExtension(blob, url) {
    try {
      if (blob && typeof blob.type === "string") {
        const mime = blob.type.toLowerCase();
        if (mime.includes("mpeg") || mime.includes("mp3")) return "mp3";
        if (mime.includes("ogg")) return "ogg";
        if (mime.includes("wav") || mime.includes("wave") || mime.includes("x-wav")) return "wav";
      }
      if (typeof url === "string") {
        const lower = url.toLowerCase();
        if (/[?&]format=mp3\b/.test(lower) || /\.mp3(\b|$)/.test(lower)) return "mp3";
        if (/[?&]format=ogg\b/.test(lower) || /\.ogg(\b|$)/.test(lower)) return "ogg";
        if (/\.wav(\b|$)/.test(lower)) return "wav";
      }
    } catch (_) {}
    return "wav";
  }

  function composeFilename(base, ext) {
    const safeBase =
      typeof base === "string" && base.trim() ? base.trim() : "aistone_voice_" + Date.now();
    return safeBase + "." + (ext || "wav");
  }

  async function ensureBlob(input) {
    if (input && input.blob instanceof Blob) return input.blob;
    const url = input && typeof input.url === "string" ? input.url : "";
    if (!url) throw new Error("No url or blob provided");
    const resp = await fetch(url);
    return await resp.blob();
  }

  async function download(input) {
    const url = input && input.url;
    const blob = await ensureBlob(input || {});
    const ext = detectExtension(blob, url);
    const filename = composeFilename(input && input.filenameBase, ext);
    const objectUrl = URL.createObjectURL(blob);
    try {
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      try {
        URL.revokeObjectURL(objectUrl);
      } catch (_) {}
    }
    if (window.UIUtils && typeof window.UIUtils.toast === "function") {
      try {
        window.UIUtils.toast(
          window.getCurrentLang && window.getCurrentLang() === "zh"
            ? "音频下载已开始"
            : "Download started",
          "success"
        );
      } catch (_) {}
    }
  }

  /**
   * Global voice download helper.
   * @global
   * @property {(input:{url?:string, blob?:Blob, filenameBase?:string})=>Promise<void>} download
   */
  window.VoiceDownload = { download: download };
})();
