/**
 * Voice speed controller (no-bundler)
 * Centralizes speed slider behavior: restore, apply, persist.
 *
 * window.VoiceSpeed.init({
 *   sliderId?: string,        // default 'voice-speed'
 *   displayId?: string,       // default 'speed-display'
 *   audioId?: string,         // default 'generated-audio'
 *   storageKey?: string       // default 'voice_speed'
 * })
 */
(function () {
  "use strict";

  function clampRate(value) {
    var v = parseFloat(value);
    if (isNaN(v)) v = 1.0;
    if (v < 0.25) v = 0.25;
    if (v > 4.0) v = 4.0;
    return v;
  }

  function applyToAudio(audio, rate) {
    if (!audio) return;
    try {
      audio.playbackRate = rate;
    } catch (_) {}
  }

  function showOnDisplay(display, rate) {
    if (!display) return;
    try {
      display.textContent = String(rate) + "x";
    } catch (_) {}
  }

  function loadSaved(key) {
    try {
      var saved = localStorage.getItem(key);
      var n = parseFloat(saved);
      return isNaN(n) ? null : n;
    } catch (_) {
      return null;
    }
  }

  function persist(key, value) {
    try {
      localStorage.setItem(key, String(value));
    } catch (_) {}
  }

  function init(options) {
    options = options || {};
    var slider = document.getElementById(options.sliderId || "voice-speed");
    var display = document.getElementById(options.displayId || "speed-display");
    var audio = document.getElementById(options.audioId || "generated-audio");
    var storageKey = options.storageKey || "voice_speed";
    if (!slider || !display) return;

    // restore saved
    var restored = loadSaved(storageKey);
    if (restored != null) {
      try {
        slider.value = String(restored);
      } catch (_) {}
    }

    // apply initial
    var rate = clampRate(slider.value);
    showOnDisplay(display, rate);
    applyToAudio(audio, rate);

    // live update on input
    slider.addEventListener("input", function () {
      var r = clampRate(slider.value);
      showOnDisplay(display, r);
      applyToAudio(audio, r);
    });

    // persist on change
    slider.addEventListener("change", function () {
      var r = clampRate(slider.value);
      persist(storageKey, r);
    });
  }

  /**
   * Global voice speed controller.
   * @global
   * @property {(options?:{sliderId?:string,displayId?:string,audioId?:string,storageKey?:string})=>void} init
   */
  window.VoiceSpeed = { init: init };
})();
