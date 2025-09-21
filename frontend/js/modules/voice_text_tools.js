/**
 * Voice text tools (no-bundler)
 * Provide small helpers for optimizing and translating text.
 *
 * Exposes window.VoiceTextTools with async methods:
 *  - optimize(text: string): Promise<string>
 *  - translate(text: string, targetLang: string): Promise<string>
 *
 * Design goals:
 *  - Zero behavior regression: prefer window.APIClient if available
 *  - Graceful fallback: on error or missing API, return original text
 */
(function () {
    'use strict';

    function isNonEmptyString(value) {
        return typeof value === 'string' && value.trim().length > 0;
    }

    async function optimize(text) {
        if (!isNonEmptyString(text)) return text || '';
        try {
            if (window.APIClient && typeof window.APIClient.optimizeText === 'function') {
                const res = await window.APIClient.optimizeText(String(text));
                if (isNonEmptyString(res)) return res;
            }
        } catch (_) { /* swallow and fallback */ }
        return text;
    }

    async function translate(text, targetLang) {
        if (!isNonEmptyString(text)) return text || '';
        const lang = (typeof targetLang === 'string' && targetLang.trim()) ? targetLang.trim() : 'en';
        try {
            if (window.APIClient && typeof window.APIClient.translateText === 'function') {
                const res = await window.APIClient.translateText(String(text), lang);
                if (isNonEmptyString(res)) return res;
            }
        } catch (_) { /* swallow and fallback */ }
        return text;
    }

    window.VoiceTextTools = {
        optimize: optimize,
        translate: translate
    };
})();


