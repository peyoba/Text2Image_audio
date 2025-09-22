/**
 * Voice history storage utilities (no-bundler)
 * Minimal, safe APIs for persisting voice generation history.
 * Exposes window.VoiceHistory with methods:
 *  - load(): Array<{t:number,text:string,voice:string,speed:string,link:string}>
 *  - saveItem(item): void (keeps latest 10)
 */
(function () {
  "use strict";

  var STORAGE_KEY = "voice_history";
  var MAX_ITEMS = 10;

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY) || "[]";
      var list = JSON.parse(raw);
      if (!Array.isArray(list)) return [];
      return list;
    } catch (_) {
      return [];
    }
  }

  function saveItem(item) {
    if (!item || typeof item !== "object") return;
    try {
      var list = load();
      list.unshift(item);
      if (list.length > MAX_ITEMS) list = list.slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (_) {}
  }

  /**
   * Global voice history storage.
   * @global
   * @property {()=>Array<{t:number,text:string,voice:string,speed:string,link:string}>} load
   * @property {(item:{t:number,text:string,voice:string,speed:string,link:string})=>void} saveItem
   */
  window.VoiceHistory = {
    load: load,
    saveItem: saveItem,
  };
})();
