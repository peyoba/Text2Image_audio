/**
 * Voice waveform utilities module
 * Provides a small, dependency-free API to render a lightweight
 * animated waveform. Exposes a global: window.VoiceWaveform
 * Methods: init(canvas | id), start(canvas | id), stop(canvas | id), clear(canvas | id)
 */
(function () {
  'use strict';

  var states = {};

  function resolveCanvas(target) {
    if (!target) target = 'voice-waveform';
    if (typeof target === 'string') {
      return document.getElementById(target) || null;
    }
    if (target && typeof target.getContext === 'function') return target;
    return null;
  }

  function bgColor() {
    return (window.VOICE_WAVEFORM_COLORS && window.VOICE_WAVEFORM_COLORS.bg) || 'var(--color-wave-bg, #0e1424)';
  }

  function barColor() {
    return (window.VOICE_WAVEFORM_COLORS && window.VOICE_WAVEFORM_COLORS.bar) || '#00cfff';
  }

  function getKey(canvas) {
    return (canvas && canvas.id) ? canvas.id : 'voice-waveform';
  }

  function init(target) {
    var canvas = resolveCanvas(target);
    if (!canvas) return null;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = bgColor();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    var key = getKey(canvas);
    var state = states[key] || { canvas: canvas, ctx: ctx, animationId: 0 };
    state.canvas = canvas;
    state.ctx = ctx;
    if (state.animationId) { try { cancelAnimationFrame(state.animationId); } catch(_) {} state.animationId = 0; }
    states[key] = state;
    return state;
  }

  function start(target) {
    var state = init(target);
    if (!state) return;
    var canvas = state.canvas;
    var ctx = state.ctx;
    if (state.animationId) { try { cancelAnimationFrame(state.animationId); } catch(_) {} state.animationId = 0; }

    function draw() {
      try {
        ctx.fillStyle = bgColor();
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        var now = performance.now() / 200;
        var bars = 64;
        var barWidth = canvas.width / bars;
        for (var i = 0; i < bars; i++) {
          var h = (Math.sin(now + i * 0.5) * 0.5 + 0.5) * (canvas.height * 0.8);
          ctx.fillStyle = barColor();
          var x = i * barWidth + 1;
          var y = (canvas.height - h) / 2;
          ctx.fillRect(x, y, Math.max(1, barWidth - 2), h);
        }
      } catch (_) {}
      state.animationId = requestAnimationFrame(draw);
    }

    state.animationId = requestAnimationFrame(draw);
    return state;
  }

  function stop(target) {
    var canvas = resolveCanvas(target);
    if (!canvas) return;
    var key = getKey(canvas);
    var state = states[key];
    if (state && state.animationId) {
      try { cancelAnimationFrame(state.animationId); } catch(_) {}
      state.animationId = 0;
    }
  }

  function clear(target) {
    var state = init(target);
    if (!state) return;
    state.ctx.fillStyle = bgColor();
    state.ctx.fillRect(0, 0, state.canvas.width, state.canvas.height);
  }

  window.VoiceWaveform = {
    init: init,
    start: start,
    stop: stop,
    clear: clear
  };
})();


