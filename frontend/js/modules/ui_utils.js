/**
 * UI utilities module
 * - toast(message, type)
 * - copyText(text)
 * Exposes window.UIUtils for no-bundler environments.
 */
(function () {
  'use strict';

  var DEFAULT_TIMEOUT_MS = 2000;

  function createToastContainer() {
    var id = 'uiutils-toast-container';
    var el = document.getElementById(id);
    if (el) return el;
    el = document.createElement('div');
    el.id = id;
    el.style.cssText = 'position:fixed;top:20px;right:20px;z-index:10000;display:flex;flex-direction:column;gap:8px;';
    document.body.appendChild(el);
    return el;
  }

  function colorFor(type) {
    switch (type) {
      case 'success': return 'var(--color-success, #10b981)';
      case 'warning': return 'var(--color-warning, #f59e0b)';
      case 'danger':
      case 'error': return 'var(--color-danger, #ef4444)';
      case 'info':
      default: return 'var(--color-info, #3b82f6)';
    }
  }

  function toast(message, type, timeoutMs) {
    try {
      var container = createToastContainer();
      var el = document.createElement('div');
      el.setAttribute('role', 'status');
      el.style.cssText = [
        'padding:12px 16px',
        'border-radius:8px',
        'font-weight:500',
        'max-width:340px',
        'word-break:break-word',
        'box-shadow:0 10px 24px rgba(0,0,0,0.18)',
        'color: var(--color-surface-on-light-white, #fff)'
      ].join(';');
      el.style.background = colorFor(type);
      el.textContent = String(message || '');
      container.appendChild(el);
      setTimeout(function () {
        try { container.removeChild(el); } catch (_) {}
      }, Math.max(800, timeoutMs || DEFAULT_TIMEOUT_MS));
    } catch (_) {}
  }

  function copyText(text) {
    try {
      return navigator.clipboard.writeText(String(text || '')).then(function () {
        toast((window.t && t('copied')) || '已复制', 'success');
        return true;
      }).catch(function () {
        toast((window.t && t('copyFailed')) || '复制失败', 'error');
        return false;
      });
    } catch (_) {
      try {
        var ta = document.createElement('textarea');
        ta.value = String(text || '');
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        toast((window.t && t('copied')) || '已复制', 'success');
        return Promise.resolve(true);
      } catch (e) {
        toast((window.t && t('copyFailed')) || '复制失败', 'error');
        return Promise.resolve(false);
      }
    }
  }

  window.UIUtils = {
    toast: toast,
    copyText: copyText
  };
})();


