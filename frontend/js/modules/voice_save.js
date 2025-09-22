/**
 * Voice save utilities (no-bundler)
 * Save generated audio to user center via APIClient if available, with graceful fallback.
 *
 * window.VoiceSave.save({ audioUrl, text, voice, speed })
 */
(function () {
  "use strict";

  function toast(msg, type) {
    if (window.UIUtils && typeof window.UIUtils.toast === "function") {
      try {
        window.UIUtils.toast(String(msg || ""), type || "info");
        return;
      } catch (_) {}
    }
    try {
      console.log("[VoiceSave]", type || "info", msg);
    } catch (_) {}
  }

  async function save(options) {
    var opts = options || {};
    var audioUrl = typeof opts.audioUrl === "string" ? opts.audioUrl : "";
    var text = typeof opts.text === "string" ? opts.text : "";
    var voice = typeof opts.voice === "string" ? opts.voice : "";
    var speed = typeof opts.speed === "string" ? opts.speed : String(opts.speed || "1.0");

    if (!audioUrl) {
      toast("没有可保存的音频文件", "error");
      return;
    }

    if (
      !(
        window.AuthManager &&
        typeof window.AuthManager.isLoggedIn === "function" &&
        window.AuthManager.isLoggedIn()
      )
    ) {
      toast("请先登录再保存音频", "error");
      return;
    }

    try {
      if (window.APIClient && typeof window.APIClient.saveAudio === "function") {
        var res = await window.APIClient.saveAudio({
          audioUrl: audioUrl,
          text: text,
          voice: voice,
          speed: speed,
        });
        if (res && res.success) {
          toast("音频已保存到个人中心", "success");
          return;
        }
        throw new Error((res && res.error) || "保存失败");
      }
    } catch (e) {
      toast("音频保存失败: " + (e && e.message ? e.message : "Unknown"), "error");
      return;
    }

    // Graceful fallback when API not implemented
    toast("音频保存功能正在开发中，敬请期待！", "info");
  }

  window.VoiceSave = { save: save };
})();
