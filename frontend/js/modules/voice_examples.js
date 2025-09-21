/**
 * Voice examples (no-bundler)
 * Provide helpers to bind example buttons and populate labels/texts by language.
 *
 * window.VoiceExamples:
 *  - bind(buttonSelector: string, textInputSelector: string)
 *  - populate(lang?: string)
 */
(function () {
  'use strict';

  var selectors = { button: '.example-btn[data-text]', input: '#voice-text-input' };

  function getLang(explicit) {
    if (explicit && typeof explicit === 'string') return explicit;
    var fromFn = (window.getCurrentLang && window.getCurrentLang());
    if (fromFn) return fromFn;
    return (document.documentElement.lang || 'zh');
  }

  function getExamples(lang) {
    var isZh = (String(lang || '')).toLowerCase().indexOf('zh') === 0;
    var examplesZh = [
      { label: '📢 欢迎语', text: '欢迎使用AISTONE AI语音合成平台，让文字拥有声音的力量！' },
      { label: '☀️ 日常对话', text: '今天天气真不错，阳光明媚，适合出门散步。希望每一天都能这样美好。' },
      { label: '🤖 科技解说', text: '人工智能正在改变我们的世界，语音合成技术让机器拥有了更加自然的表达能力。' },
      { label: '💭 情感表达', text: '在这个快节奏的时代，我们需要停下脚步，倾听内心的声音，感受生活的美好。' },
      { label: '📚 学习讲解', text: '本节课程我们将一起学习如何高效地做笔记，并用自己的语言复述重点内容。' }
    ];
    var examplesEn = [
      { label: '📢 Welcome', text: 'Hello! Welcome to the AISTONE AI voice synthesis platform. Turn your text into natural speech.' },
      { label: '☀️ Daily Talk', text: 'Today is a beautiful day with sunshine. It is perfect for a relaxing walk outside.' },
      { label: '🤖 Tech Narration', text: 'Artificial intelligence is transforming our world. Text-to-speech brings more natural expression to machines.' },
      { label: '💭 Emotion', text: 'In this fast-paced era, we should slow down and listen to our inner voice, appreciating the beauty of life.' },
      { label: '📚 Learning Intro', text: 'In this lesson, we will learn how to take effective notes and summarize key points in our own words.' }
    ];
    return isZh ? examplesZh : examplesEn;
  }

  function bind(buttonSelector, textInputSelector) {
    try {
      selectors.button = buttonSelector || selectors.button;
      selectors.input = textInputSelector || selectors.input;
      var textInput = document.querySelector(selectors.input);
      var buttons = document.querySelectorAll(selectors.button);
      buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (!textInput) textInput = document.querySelector(selectors.input);
          if (textInput) {
            textInput.value = btn.getAttribute('data-text') || '';
            try { textInput.dispatchEvent(new Event('input')); } catch (_) {}
            try { textInput.focus(); } catch (_) {}
          }
        });
      });
    } catch (_) {}
  }

  function populate(lang) {
    try {
      var buttons = Array.prototype.slice.call(document.querySelectorAll(selectors.button));
      if (!buttons.length) return;
      var list = getExamples(getLang(lang));
      var n = Math.min(buttons.length, list.length);
      for (var i = 0; i < n; i++) {
        var btn = buttons[i];
        var ex = list[i];
        btn.textContent = ex.label;
        btn.setAttribute('data-text', ex.text);
      }
    } catch (_) {}
  }

  window.VoiceExamples = {
    bind: bind,
    populate: populate
  };
})();


