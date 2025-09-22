/**
 * AISTONE语音合成应用主脚本
 * 处理语音生成、播放、下载等功能
 */

// 语音模块：状态/UI/API 分区（文件内重组，零行为变化）
class VoiceApp {
  constructor() {
    this.apiClient = null;
    this.uiHandler = null;
    this.currentAudioUrl = null;
    this.currentAudioBlob = null;
    this.isGenerating = false;
    this.abortController = null;
    this.waveformCtx = null;
    this.waveformAnimation = null;
    this.logs = [];

    this.init();
  }

  init() {
    // 等待依赖加载完成
    this.waitForDependencies()
      .then(() => {
        this.apiClient = window.APIClient;
        this.uiHandler = window.UIHandler;
        this.setupEventListeners();
        this.setupTextCounter();
        this.setupSpeedSlider();
        // 优先使用模块化示例工具
        if (window.VoiceExamples && typeof window.VoiceExamples.bind === "function") {
          try {
            window.VoiceExamples.bind(".example-btn[data-text]", "#voice-text-input");
          } catch (_) {}
        } else {
          this.setupExamples();
        }
        if (window.VoiceExamples && typeof window.VoiceExamples.populate === "function") {
          try {
            window.VoiceExamples.populate();
          } catch (_) {}
        } else {
          this.populateVoiceExamples();
        }
        // 语言切换时，动态刷新语音示例
        document.addEventListener("languageChanged", () => {
          if (window.VoiceExamples && typeof window.VoiceExamples.populate === "function") {
            try {
              window.VoiceExamples.populate();
            } catch (_) {}
          } else {
            this.populateVoiceExamples();
          }
        });
        // 处理URL参数（优先模块化）
        if (
          window.VoiceUrlParams &&
          typeof window.VoiceUrlParams.applyAndMaybeAutoGenerate === "function"
        ) {
          try {
            window.VoiceUrlParams.applyAndMaybeAutoGenerate();
          } catch (_) {}
        } else {
          this.handleUrlParameters(); // 回退
        }
        this.initWaveform();
        this.restoreHistory();
        console.log("语音应用初始化完成");
      })
      .catch((error) => {
        console.error("语音应用初始化失败:", error);
        this.showError("应用初始化失败，请刷新页面重试");
      });
  }

  async waitForDependencies() {
    // 仅依赖 APIClient 即可运行，避免因其他脚本加载异常导致语音页失效
    const maxWait = 10000; // 最大等待10秒
    const startTime = Date.now();
    while (Date.now() - startTime < maxWait) {
      if (window.APIClient) {
        return Promise.resolve();
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    throw new Error("依赖加载超时: APIClient 未准备就绪");
  }

  // 事件：初始化交互
  setupEventListeners() {
    // 语音生成表单提交
    const form = document.getElementById("voice-generation-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.generateVoice();
      });
    }
    // 兜底：按钮点击也触发，防止某些浏览器/自定义表单行为导致 submit 未触发
    const generateBtn = document.getElementById("generate-voice-btn");
    if (generateBtn) {
      generateBtn.addEventListener("click", (e) => {
        // 如果不是表单原生提交，依然手动触发
        if (form) e.preventDefault();
        this.generateVoice();
      });
    }

    // 下载按钮
    const downloadBtn = document.getElementById("download-audio-btn");
    if (downloadBtn) {
      downloadBtn.addEventListener("click", () => this.downloadAudio());
    }

    // （已移除）按当前语速导出按钮

    // 复制链接按钮
    const copyBtn = document.getElementById("copy-audio-url-btn");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => this.copyAudioUrl());
    }

    // 分享按钮
    const shareBtn = document.getElementById("share-audio-btn");
    if (shareBtn) {
      shareBtn.addEventListener("click", () => this.shareAudio());
    }

    // 保存按钮
    const saveBtn = document.getElementById("save-audio-btn");
    if (saveBtn) {
      saveBtn.addEventListener("click", () => this.saveAudio());
    }

    // 音频事件：加载后同步播放速度、播放/暂停控制波形
    const audioPlayer = document.getElementById("generated-audio");
    if (audioPlayer) {
      audioPlayer.addEventListener("loadedmetadata", () => {
        this.updateAudioInfo();
        // 应用当前滑块速率到播放器
        const slider = document.getElementById("voice-speed");
        const rate = slider ? Math.max(0.25, Math.min(4.0, parseFloat(slider.value) || 1.0)) : 1.0;
        try {
          audioPlayer.playbackRate = rate;
        } catch (e) {}
      });
      audioPlayer.addEventListener("play", () => this.startWaveform());
      audioPlayer.addEventListener("pause", () => this.stopWaveform());
    }

    // 文本按钮
    const optimizeBtn = document.getElementById("optimize-voice-text-btn");
    const translateBtn = document.getElementById("translate-voice-text-btn");
    const clearBtn = document.getElementById("clear-voice-text-btn");
    if (optimizeBtn) optimizeBtn.addEventListener("click", () => this.optimizeText());
    if (translateBtn) translateBtn.addEventListener("click", () => this.translateText());
    if (clearBtn) clearBtn.addEventListener("click", () => this.clearText());
  }

  // UI：文本计数字段
  setupTextCounter() {
    const textInput = document.getElementById("voice-text-input");
    const textCount = document.getElementById("text-count");

    if (textInput && textCount) {
      textInput.addEventListener("input", () => {
        const count = textInput.value.length;
        textCount.textContent = count;

        // 接近限制时变色提醒
        if (count > 800) {
          textCount.style.color =
            (window.VOICE_MESSAGE_COLORS && window.VOICE_MESSAGE_COLORS.error) ||
            "var(--color-error-text, #e74c3c)";
        } else if (count > 600) {
          textCount.style.color = "var(--color-warning, #f39c12)";
        } else {
          textCount.style.color = "var(--color-text-primary, #666)";
        }
      });
    }
  }

  // UI：语速滑块
  setupSpeedSlider() {
    // 优先使用模块化语速控制
    if (window.VoiceSpeed && typeof window.VoiceSpeed.init === "function") {
      try {
        window.VoiceSpeed.init({
          sliderId: "voice-speed",
          displayId: "speed-display",
          audioId: "generated-audio",
          storageKey: "voice_speed",
        });
        return;
      } catch (_) {}
    }
    const speedSlider = document.getElementById("voice-speed");
    const speedDisplay = document.getElementById("speed-display");
    if (speedSlider && speedDisplay) {
      try {
        const saved = localStorage.getItem("voice_speed");
        if (saved && !isNaN(parseFloat(saved))) {
          speedSlider.value = String(saved);
        }
      } catch (e) {}
      const applyPlaybackRate = () => {
        const rate = Math.max(0.25, Math.min(4.0, parseFloat(speedSlider.value) || 1.0));
        speedDisplay.textContent = rate + "x";
        const audio = document.getElementById("generated-audio");
        if (audio) {
          try {
            audio.playbackRate = rate;
          } catch (e) {}
        }
      };
      applyPlaybackRate();
      speedSlider.addEventListener("input", () => {
        applyPlaybackRate();
      });
      speedSlider.addEventListener("change", () => {
        try {
          localStorage.setItem("voice_speed", String(speedSlider.value));
        } catch (e) {}
      });
    }
  }

  // UI：示例填充
  setupExamples() {
    const exampleBtns = document.querySelectorAll(".example-btn[data-text]");
    const textInput = document.getElementById("voice-text-input");

    exampleBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (textInput) {
          textInput.value = btn.dataset.text;
          textInput.dispatchEvent(new Event("input")); // 触发计数器更新
          textInput.focus();
        }
      });
    });
  }

  // 根据当前语言填充示例按钮（中英分别填充对应文本）
  // 数据：根据语言填充示例
  populateVoiceExamples() {
    const lang =
      (window.getCurrentLang && window.getCurrentLang()) || document.documentElement.lang || "zh";
    const isZh = (lang || "").toLowerCase().startsWith("zh");
    const examplesZh = [
      { label: "📢 欢迎语", text: "欢迎使用AISTONE AI语音合成平台，让文字拥有声音的力量！" },
      {
        label: "☀️ 日常对话",
        text: "今天天气真不错，阳光明媚，适合出门散步。希望每一天都能这样美好。",
      },
      {
        label: "🤖 科技解说",
        text: "人工智能正在改变我们的世界，语音合成技术让机器拥有了更加自然的表达能力。",
      },
      {
        label: "💭 情感表达",
        text: "在这个快节奏的时代，我们需要停下脚步，倾听内心的声音，感受生活的美好。",
      },
      {
        label: "📚 学习讲解",
        text: "本节课程我们将一起学习如何高效地做笔记，并用自己的语言复述重点内容。",
      },
    ];
    const examplesEn = [
      {
        label: "📢 Welcome",
        text: "Hello! Welcome to the AISTONE AI voice synthesis platform. Turn your text into natural speech.",
      },
      {
        label: "☀️ Daily Talk",
        text: "Today is a beautiful day with sunshine. It is perfect for a relaxing walk outside.",
      },
      {
        label: "🤖 Tech Narration",
        text: "Artificial intelligence is transforming our world. Text-to-speech brings more natural expression to machines.",
      },
      {
        label: "💭 Emotion",
        text: "In this fast-paced era, we should slow down and listen to our inner voice, appreciating the beauty of life.",
      },
      {
        label: "📚 Learning Intro",
        text: "In this lesson, we will learn how to take effective notes and summarize key points in our own words.",
      },
    ];

    const list = isZh ? examplesZh : examplesEn;
    const btns = Array.from(document.querySelectorAll(".example-btn[data-text]"));
    if (!btns.length) return;
    const n = Math.min(btns.length, list.length);
    for (let i = 0; i < n; i++) {
      const btn = btns[i];
      const ex = list[i];
      btn.textContent = ex.label;
      btn.dataset.text = ex.text;
    }
  }

  // 数据：解析URL参数并可触发自动生成
  handleUrlParameters() {
    // 解析URL参数
    const urlParams = new URLSearchParams(window.location.search);
    const text = urlParams.get("text");
    const voice = urlParams.get("voice");
    const speed = urlParams.get("speed");
    const auto = urlParams.get("auto");
    const source = urlParams.get("source");

    if (text) {
      const textInput = document.getElementById("voice-text-input");
      if (textInput) {
        // 解码并填充文本
        textInput.value = decodeURIComponent(text);
        textInput.dispatchEvent(new Event("input")); // 触发计数器更新

        // 如果来源是主页，显示欢迎信息
        if (source === "main") {
          this.showInfo("已自动填入您在主页输入的文本，您可以直接生成语音或进行修改。");
        }

        // 滚动到输入框
        textInput.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }

    // 同步音色
    if (voice) {
      const voiceModel = document.getElementById("voice-model");
      if (voiceModel) {
        voiceModel.value = voice;
      }
    }

    // 同步语速
    if (speed) {
      const speedSlider = document.getElementById("voice-speed");
      const speedDisplay = document.getElementById("speed-display");
      if (speedSlider) {
        speedSlider.value = String(speed);
        if (speedDisplay) speedDisplay.textContent = `${parseFloat(speedSlider.value) || 1.0}x`;
        const audio = document.getElementById("generated-audio");
        if (audio) {
          try {
            audio.playbackRate = parseFloat(speedSlider.value) || 1.0;
          } catch (e) {}
        }
      }
    }

    // 清理URL参数（可选，保持URL简洁）
    // 注意：含 auto=1 时保留一次，以便回退后还能从历史中返回；生成后再清理
    const shouldCleanNow = (text || source || voice || speed) && auto !== "1";
    if (shouldCleanNow) {
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }

    // 自动生成
    if (auto === "1" && text) {
      this.generateVoice();
      // 生成触发后立即清理URL，避免刷新重复生成
      setTimeout(() => {
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }, 0);
    }
  }

  // API：发起语音生成
  async generateVoice() {
    if (this.isGenerating) return;

    const textInput = document.getElementById("voice-text-input");
    const voiceModel = document.getElementById("voice-model");
    const voiceSpeed = document.getElementById("voice-speed");
    const generateBtn = document.getElementById("generate-voice-btn");

    if (!textInput || !voiceModel || !voiceSpeed || !generateBtn) {
      this.showError("页面元素加载不完整，请刷新页面重试");
      return;
    }

    const text = textInput.value.trim();
    if (!text) {
      this.showError("请输入要转换的文本内容");
      textInput.focus();
      return;
    }

    if (text.length > 1000) {
      this.showError("文本内容不能超过1000个字符");
      return;
    }

    this.isGenerating = true;
    this.updateGenerateButton(true);
    this.updateProgress(2, "准备中...");

    try {
      const requestData = {
        text: text,
        voice: voiceModel.value,
        speed: parseFloat(voiceSpeed.value),
      };

      console.log("开始语音生成，参数:", requestData);
      this.log(`请求: ${JSON.stringify(requestData)}`);

      // 调用API生成语音
      this.abortController = new AbortController();
      const response = await this.apiClient.generateVoice(requestData);

      if (response.success && response.audioUrl) {
        this.currentAudioUrl = response.audioUrl;
        this.currentAudioBlob = response.blob || null;
        this.displayVoiceResult(response);
        this.showSuccess("语音生成成功！");
        this.updateProgress(100, "完成");
        this.saveHistory();
      } else {
        throw new Error(response.error || "语音生成失败");
      }
    } catch (error) {
      console.error("语音生成错误:", error);
      this.showError("语音生成失败: " + error.message);
      this.log(`错误: ${error.message}`);
    } finally {
      this.isGenerating = false;
      this.updateGenerateButton(false);
      this.updateProgress(0);
      this.abortController = null;
    }
  }

  // UI：显示生成结果
  displayVoiceResult(response) {
    // 存储生成参数用于信息显示
    this.lastGenerationParams = {
      voice: document.getElementById("voice-model").value,
      speed: document.getElementById("voice-speed").value,
      text: document.getElementById("voice-text-input").value,
    };
    // 优先使用结果渲染器
    if (window.VoiceResultRenderer && typeof window.VoiceResultRenderer.display === "function") {
      try {
        window.VoiceResultRenderer.display(response, {
          blob: this.currentAudioBlob,
          lastParams: this.lastGenerationParams,
        });
        return;
      } catch (_) {}
    }
    const resultSection = document.getElementById("voice-result-section");
    const audioPlayer = document.getElementById("generated-audio");
    if (!resultSection || !audioPlayer) return;
    audioPlayer.src = response.audioUrl;
    audioPlayer.load();
    resultSection.style.display = "block";
    resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
    const fileSizeEl = document.getElementById("voice-filesize");
    if (fileSizeEl && this.currentAudioBlob && this.currentAudioBlob.size) {
      const fmt = window.formatBytesSafe || this.formatBytes.bind(this);
      fileSizeEl.textContent = fmt(this.currentAudioBlob.size);
    }
    if (window.AuthManager && window.AuthManager.isLoggedIn()) {
      const saveBtn = document.getElementById("save-audio-btn");
      if (saveBtn) {
        saveBtn.style.display = "inline-flex";
      }
    }
  }

  // UI：更新播放器信息
  updateAudioInfo() {
    const audioPlayer = document.getElementById("generated-audio");
    const durationElement = document.getElementById("voice-duration");
    const modelElement = document.getElementById("used-voice-model");
    const speedElement = document.getElementById("used-voice-speed");

    if (audioPlayer && this.lastGenerationParams) {
      // 更新时长
      if (durationElement) {
        const duration = audioPlayer.duration;
        if (!isNaN(duration)) {
          const minutes = Math.floor(duration / 60);
          const seconds = Math.floor(duration % 60);
          durationElement.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
        }
      }

      // 更新音色信息
      if (modelElement) {
        const voiceNames = window.VOICE_NAMES || {
          nova: "Nova (女声)",
          alloy: "Alloy (男声)",
          echo: "Echo (男声)",
          fable: "Fable (男声)",
          onyx: "Onyx (男声)",
          shimmer: "Shimmer (女声)",
        };
        modelElement.textContent =
          voiceNames[this.lastGenerationParams.voice] || this.lastGenerationParams.voice;
      }

      // 更新语速信息
      if (speedElement) {
        speedElement.textContent = this.lastGenerationParams.speed + "x";
      }
    }
  }

  // 动作：下载音频
  async downloadAudio() {
    if (!this.currentAudioUrl) {
      this.showError("没有可下载的音频文件");
      return;
    }

    try {
      // 优先使用模块化下载器
      if (window.VoiceDownload && typeof window.VoiceDownload.download === "function") {
        await window.VoiceDownload.download({
          url: this.currentAudioUrl,
          blob: this.currentAudioBlob,
          filenameBase: "aistone_voice_" + Date.now(),
        });
      } else {
        const blob = this.currentAudioBlob || (await (await fetch(this.currentAudioUrl)).blob());
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const mime = ((blob && blob.type) || "").toLowerCase();
        let ext = "wav";
        if (mime.includes("mpeg") || mime.includes("mp3")) ext = "mp3";
        else if (mime.includes("ogg")) ext = "ogg";
        else if (mime.includes("wav") || mime.includes("wave") || mime.includes("x-wav"))
          ext = "wav";
        a.download = `aistone_voice_${Date.now()}.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.showSuccess("音频下载已开始");
      }
    } catch (error) {
      console.error("下载失败:", error);
      this.showError("音频下载失败，请重试");
    }
  }

  // 动作：复制音频URL
  async copyAudioUrl() {
    if (!this.currentAudioUrl) {
      this.showError("当前没有可复制的音频链接");
      return;
    }
    try {
      // 优先使用 UIUtils.copyText（自带提示），失败回退原实现
      if (window.UIUtils && typeof window.UIUtils.copyText === "function") {
        await window.UIUtils.copyText(this.currentAudioUrl);
        return;
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(this.currentAudioUrl);
      } else {
        const ta = document.createElement("textarea");
        ta.value = this.currentAudioUrl;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      this.showSuccess("音频链接已复制");
    } catch (e) {
      this.showError("复制失败，请手动复制");
    }
  }

  // 动作：分享
  async shareAudio() {
    if (!this.currentAudioUrl) {
      this.showError("没有可分享的音频文件");
      return;
    }

    // 优先使用模块化分享
    if (window.VoiceShare && typeof window.VoiceShare.share === "function") {
      await window.VoiceShare.share({
        title: "AISTONE语音合成",
        text: "我使用AISTONE生成了一段AI语音，快来听听吧！",
        url: window.location.href,
      });
      return;
    }

    // 回退：原实现
    if (navigator.share) {
      try {
        await navigator.share({
          title: "AISTONE语音合成",
          text: "我使用AISTONE生成了一段AI语音，快来听听吧！",
          url: window.location.href,
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("分享失败:", error);
          this.fallbackShare();
        }
      }
    } else {
      this.fallbackShare();
    }
  }

  // 动作：分享降级
  fallbackShare() {
    // 降级分享方案：复制链接
    const url = window.location.href;
    // 优先使用 UIUtils
    if (window.UIUtils && typeof window.UIUtils.copyText === "function") {
      window.UIUtils.copyText(url);
      return;
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        this.showSuccess("页面链接已复制到剪贴板");
      });
    } else {
      // 更老的浏览器降级方案
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      this.showSuccess("页面链接已复制到剪贴板");
    }
  }

  // 动作：保存到个人中心（占位）
  async saveAudio() {
    if (!this.currentAudioUrl) {
      this.showError("没有可保存的音频文件");
      return;
    }
    try {
      // 优先使用模块化保存
      if (window.VoiceSave && typeof window.VoiceSave.save === "function") {
        await window.VoiceSave.save({
          audioUrl: this.currentAudioUrl,
          text: (this.lastGenerationParams && this.lastGenerationParams.text) || "",
          voice: (this.lastGenerationParams && this.lastGenerationParams.voice) || "",
          speed: (this.lastGenerationParams && this.lastGenerationParams.speed) || "1.0",
        });
        return;
      }
      // 回退提示
      if (!window.AuthManager || !window.AuthManager.isLoggedIn()) {
        this.showError("请先登录再保存音频");
        return;
      }
      this.showInfo("音频保存功能正在开发中，敬请期待！");
    } catch (error) {
      console.error("保存音频失败:", error);
      this.showError("音频保存失败: " + error.message);
    }
  }

  // UI：生成按钮状态
  updateGenerateButton(isLoading) {
    // 优先使用模块化控件
    if (
      window.VoiceUIControls &&
      typeof window.VoiceUIControls.updateGenerateButton === "function"
    ) {
      try {
        window.VoiceUIControls.updateGenerateButton(!!isLoading);
        return;
      } catch (_) {}
    }
    const generateBtn = document.getElementById("generate-voice-btn");
    if (!generateBtn) return;
    const btnText = generateBtn.querySelector(".btn-text");
    const btnLoading = generateBtn.querySelector(".btn-loading");
    if (isLoading) {
      generateBtn.disabled = true;
      if (btnText) btnText.style.display = "none";
      if (btnLoading) btnLoading.style.display = "flex";
    } else {
      generateBtn.disabled = false;
      if (btnText) btnText.style.display = "inline";
      if (btnLoading) btnLoading.style.display = "none";
    }
  }

  // UI：进度条
  updateProgress(percent = 0, label = "") {
    // 优先使用模块化控件
    if (window.VoiceUIControls && typeof window.VoiceUIControls.updateProgress === "function") {
      try {
        window.VoiceUIControls.updateProgress(percent, label);
        return;
      } catch (_) {}
    }
    const bar = document.getElementById("voice-progress-bar");
    const box = document.getElementById("voice-progress");
    const text = document.getElementById("voice-progress-label");
    if (!bar || !box) return;
    if (percent > 0 && percent < 100) {
      box.style.display = "block";
      bar.style.width = `${Math.max(2, Math.min(100, percent))}%`;
      if (text) text.textContent = label || "处理中...";
    } else if (percent >= 100) {
      bar.style.width = "100%";
      if (text) text.textContent = label || "完成";
      setTimeout(() => {
        if (box) box.style.display = "none";
      }, 600);
    } else {
      box.style.display = "none";
      bar.style.width = "0%";
    }
  }

  // 工具：日志
  log(message) {
    if (window.VoiceLogger && typeof window.VoiceLogger.log === "function") {
      try {
        window.VoiceLogger.log(message);
      } catch (_) {}
      return;
    }
    const ts = new Date().toLocaleTimeString();
    const line = `[${ts}] ${message}`;
    this.logs.push(line);
    const el = document.getElementById("voice-log");
    if (el) {
      el.textContent += (el.textContent ? "\n" : "") + line;
      el.scrollTop = el.scrollHeight;
    }
  }

  // 可视化：初始化波形
  initWaveform() {
    // 优先使用模块化渲染器
    if (window.VoiceWaveform && typeof window.VoiceWaveform.init === "function") {
      window.VoiceWaveform.init("voice-waveform");
      return;
    }
    const canvas = document.getElementById("voice-waveform");
    if (!canvas) return;
    this.waveformCtx = canvas.getContext("2d");
    // 初始清屏（回退实现）
    this.waveformCtx.fillStyle =
      (window.VOICE_WAVEFORM_COLORS && window.VOICE_WAVEFORM_COLORS.bg) ||
      "var(--color-wave-bg, #0e1424)";
    this.waveformCtx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // 可视化：启动波形动画
  startWaveform() {
    // 优先使用模块化渲染器
    if (window.VoiceWaveform && typeof window.VoiceWaveform.start === "function") {
      window.VoiceWaveform.start("voice-waveform");
      return;
    }
    const audio = document.getElementById("generated-audio");
    const canvas = document.getElementById("voice-waveform");
    if (!audio || !canvas || !this.waveformCtx) return;
    const ctx = this.waveformCtx;
    const width = canvas.width;
    const height = canvas.height;
    cancelAnimationFrame(this.waveformAnimation);
    const draw = () => {
      // 轻量级占位波形：随时间滚动的条形动画（回退实现）
      ctx.fillStyle =
        (window.VOICE_WAVEFORM_COLORS && window.VOICE_WAVEFORM_COLORS.bg) ||
        "var(--color-wave-bg, #0e1424)";
      ctx.fillRect(0, 0, width, height);
      const now = performance.now() / 200;
      const bars = 64;
      const barWidth = width / bars;
      for (let i = 0; i < bars; i++) {
        const h = (Math.sin(now + i * 0.5) * 0.5 + 0.5) * (height * 0.8);
        ctx.fillStyle =
          (window.VOICE_WAVEFORM_COLORS && window.VOICE_WAVEFORM_COLORS.bar) || "#00cfff";
        const x = i * barWidth + 1;
        const y = (height - h) / 2;
        ctx.fillRect(x, y, Math.max(1, barWidth - 2), h);
      }
      this.waveformAnimation = requestAnimationFrame(draw);
    };
    this.waveformAnimation = requestAnimationFrame(draw);
  }

  // 可视化：停止波形动画
  stopWaveform() {
    // 优先使用模块化渲染器
    if (window.VoiceWaveform && typeof window.VoiceWaveform.stop === "function") {
      window.VoiceWaveform.stop("voice-waveform");
      return;
    }
    cancelAnimationFrame(this.waveformAnimation);
  }

  // 工具：格式化字节
  formatBytes(bytes) {
    if (!bytes && bytes !== 0) return "--";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), sizes.length - 1);
    const val = bytes / Math.pow(1024, i);
    return `${val.toFixed(val >= 100 ? 0 : val >= 10 ? 1 : 2)} ${sizes[i]}`;
  }

  // 历史：保存记录
  saveHistory() {
    try {
      const text = (this.lastGenerationParams && this.lastGenerationParams.text) || "";
      const voice = (this.lastGenerationParams && this.lastGenerationParams.voice) || "";
      const speed = (this.lastGenerationParams && this.lastGenerationParams.speed) || "1.0";
      const deepLink = `${location.origin}${location.pathname}?text=${encodeURIComponent(text)}&voice=${encodeURIComponent(voice)}&speed=${encodeURIComponent(speed)}&auto=1`;
      const item = { t: Date.now(), text, voice, speed, link: deepLink };

      // 优先使用模块化存储
      if (window.VoiceHistory && typeof window.VoiceHistory.saveItem === "function") {
        try {
          window.VoiceHistory.saveItem(item);
        } catch (_) {}
        let list = [];
        try {
          list = (window.VoiceHistory.load && window.VoiceHistory.load()) || [];
        } catch (_) {
          list = [];
        }
        if (Array.isArray(list) && list.length) {
          this.renderHistory(list);
          const sec = document.getElementById("voice-history-section");
          if (sec) sec.style.display = "block";
          return;
        }
      }

      // 回退实现：localStorage 直接写入
      const key = "voice_history";
      const list = JSON.parse(localStorage.getItem(key) || "[]");
      list.unshift(item);
      localStorage.setItem(key, JSON.stringify(list.slice(0, 10)));
      this.renderHistory(list.slice(0, 10));
      const sec = document.getElementById("voice-history-section");
      if (sec) sec.style.display = "block";
    } catch (e) {}
  }

  // 历史：恢复记录
  restoreHistory() {
    try {
      // 优先使用模块化存储
      let list;
      if (window.VoiceHistory && typeof window.VoiceHistory.load === "function") {
        try {
          list = window.VoiceHistory.load();
        } catch (_) {
          list = [];
        }
      }
      if (!Array.isArray(list)) {
        const key = "voice_history";
        list = JSON.parse(localStorage.getItem(key) || "[]");
      }
      if (Array.isArray(list) && list.length) {
        this.renderHistory(list);
        const sec = document.getElementById("voice-history-section");
        if (sec) sec.style.display = "block";
      }
    } catch (e) {}
  }

  // 历史：渲染记录
  renderHistory(list) {
    const ul = document.getElementById("voice-history-list");
    if (!ul) return;
    ul.innerHTML = "";
    list.forEach((it, idx) => {
      const li = document.createElement("li");
      const bg =
        (window.VOICE_WAVEFORM_COLORS && window.VOICE_WAVEFORM_COLORS.bg) ||
        "var(--color-wave-bg, #0e1424)";
      li.style.cssText = `padding:10px; background:${bg}; border:1px solid var(--color-accent-border, #2A3A57); border-radius: var(--radius-sm); display:flex; align-items:center; gap:10px;`;
      const meta = document.createElement("div");
      meta.style.cssText = "flex:1; color: var(--color-text-primary);";
      meta.innerHTML = `<div style="font-size:12px;">${new Date(it.t).toLocaleString()} • ${it.voice} • ${it.speed}x</div><div style="font-size:12px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width: 100%;">${(it.text || "").replace(/[\n\r]+/g, " ").slice(0, 120)}</div>`;
      const play = document.createElement("button");
      play.className = "action-btn";
      play.textContent = "▶ 生成并播放";
      play.addEventListener("click", () => {
        const params = new URLSearchParams({
          text: it.text || "",
          voice: it.voice || "nova",
          speed: String(it.speed || "1.0"),
          auto: "1",
        });
        const url = `${location.pathname}?${params.toString()}`;
        location.href = url;
      });
      const copy = document.createElement("button");
      copy.className = "action-btn";
      copy.textContent = "复制深链";
      copy.addEventListener("click", async () => {
        try {
          if (window.UIUtils && typeof window.UIUtils.copyText === "function") {
            await window.UIUtils.copyText(it.link || "");
            return;
          }
          await navigator.clipboard.writeText(it.link || "");
          this.showSuccess("已复制");
        } catch (e) {
          this.showError("复制失败");
        }
      });
      li.appendChild(meta);
      li.appendChild(play);
      li.appendChild(copy);
      ul.appendChild(li);
    });
  }

  // API：优化文本
  async optimizeText() {
    const textInput = document.getElementById("voice-text-input");
    if (!textInput || !textInput.value.trim()) {
      this.showError("请先输入文本");
      return;
    }
    try {
      this.updateProgress(15, "优化文本...");
      // 优先使用模块化文本工具
      let optimized;
      if (window.VoiceTextTools && typeof window.VoiceTextTools.optimize === "function") {
        optimized = await window.VoiceTextTools.optimize(textInput.value.trim());
      } else {
        optimized = await this.apiClient.optimizeText(textInput.value.trim());
      }
      textInput.value = optimized;
      textInput.dispatchEvent(new Event("input"));
      this.showSuccess("优化完成");
    } catch (e) {
      this.showError("优化失败，请稍后重试");
    } finally {
      this.updateProgress(0);
    }
  }

  // API：翻译文本
  async translateText() {
    const textInput = document.getElementById("voice-text-input");
    const lang = (window.getCurrentLang && window.getCurrentLang()) || "zh";
    if (!textInput || !textInput.value.trim()) {
      this.showError("请先输入文本");
      return;
    }
    try {
      this.updateProgress(15, "翻译中...");
      const target = lang === "zh" ? "en" : "zh";
      // 优先使用模块化文本工具
      let translated;
      if (window.VoiceTextTools && typeof window.VoiceTextTools.translate === "function") {
        translated = await window.VoiceTextTools.translate(textInput.value.trim(), target);
      } else {
        translated = await this.apiClient.translateText(textInput.value.trim(), target);
      }
      textInput.value = translated;
      textInput.dispatchEvent(new Event("input"));
      this.showSuccess("翻译完成");
    } catch (e) {
      this.showError("翻译失败，请稍后重试");
    } finally {
      this.updateProgress(0);
    }
  }

  // UI：清空文本
  clearText() {
    const textInput = document.getElementById("voice-text-input");
    if (textInput) {
      textInput.value = "";
      textInput.dispatchEvent(new Event("input"));
    }
  }

  // UI：提示
  showSuccess(message) {
    this.showMessage(message, "success");
  }

  showError(message) {
    this.showMessage(message, "error");
  }

  showInfo(message) {
    this.showMessage(message, "info");
  }

  showMessage(message, type = "info") {
    // 优先使用全局 UIUtils.toast 统一提示（保留本地回退）
    if (window.UIUtils && typeof window.UIUtils.toast === "function") {
      try {
        window.UIUtils.toast(String(message || ""), type || "info");
        return;
      } catch (_) {}
    }
    // 创建消息提示
    const messageEl = document.createElement("div");
    messageEl.className = `voice-message voice-message-${type}`;
    messageEl.textContent = message;

    // 样式
    messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: var(--color-surface-on-light-white, #fff);
            font-weight: 500;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;

    // 不同类型的背景色
    const colors = window.VOICE_MESSAGE_COLORS || {
      success: "var(--color-success, #28a745)",
      error: "var(--color-danger, #dc3545)",
      info: "var(--color-info, #17a2b8)",
    };
    messageEl.style.backgroundColor = colors[type] || colors.info;

    document.body.appendChild(messageEl);

    // 自动移除
    setTimeout(() => {
      messageEl.style.animation = "slideOutRight 0.3s ease";
      setTimeout(() => {
        if (messageEl.parentNode) {
          messageEl.parentNode.removeChild(messageEl);
        }
      }, 300);
    }, 3000);
  }
}

// 添加动画CSS（避免与其它脚本重名）
const voiceAnimationsStyleEl = document.createElement("style");
voiceAnimationsStyleEl.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(voiceAnimationsStyleEl);

// 页面加载完成后初始化应用
document.addEventListener("DOMContentLoaded", () => {
  if (!window.VoiceApp) {
    window.VoiceApp = new VoiceApp();
  }
});
