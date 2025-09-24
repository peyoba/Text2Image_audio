/**
 * UI处理器类，处理所有用户界面交互
 * 运行环境：无打包直接引入（no-bundler），通过 window 全局使用
 */
// 文件内分区说明（仅注释，无行为变化）：
// - 初始化与语言：constructor, initLanguageSwitcher, updatePageText
// - 事件绑定：bindEvents, _bindNewOptionsEvents
// - 输入校验与加载指示：validateInput, showLoading, hideLoading, showError, hideError, hideResults
// - 生成流程：handleGenerate, _handleImageGeneration, showImageResult, showAudioResult
// - 图片选项与布局：_toggleImageOptions, _handleAspectRatioChange
// - 语音重定向：_handleVoiceRedirect, _showVoiceRedirectModal, _closeVoiceRedirectModal
// - 其他工具：_shouldUsePollinations, _ensureLoadingIsHidden, _getImageOptions, _handleBreadcrumbVisibility
class UIHandler {
  constructor() {
    // 初始化apiClient
    this.apiClient = new ApiClient();
    // 初始化语言切换
    this.initLanguageSwitcher();
    this.isGenerating = false; // 新增API请求状态标志

    // 检查当前页面类型
    const currentPath = window.location.pathname;
    const isGenerationPage =
      !currentPath.includes("about.html") &&
      !currentPath.includes("services.html") &&
      !currentPath.includes("contact.html") &&
      !currentPath.includes("voice.html") &&
      !currentPath.includes("blog.html") &&
      !currentPath.includes("user.html") &&
      !currentPath.includes("privacy.html") &&
      !currentPath.includes("terms.html");

    if (isGenerationPage) {
      // 生成页面：获取所有DOM元素
      this.textInput = document.getElementById("text-input");
      this.generateButton = document.getElementById("generate-button");
      this.typeImageRadio = document.getElementById("type-image");
      this.typeAudioRadio = document.getElementById("type-audio");
      this.loadingIndicator = document.getElementById("loading-indicator");
      this.loadingText = this.loadingIndicator.querySelector("p"); // 获取加载指示器内的p标签
      this.errorMessage = document.getElementById("error-message");
      this.imageResultContainer = document.getElementById("image-result-container");
      this.audioResultContainer = document.getElementById("audio-result-container");
      this.generatedAudio = document.getElementById("generated-audio");
      this.downloadAudioLink = document.getElementById("download-audio-link");

      // 新增：获取图片选项UI元素
      this.imageOptionsContainer = document.getElementById("image-generation-options");
      this.optionNologo = document.getElementById("option-nologo");
      this.optionAspectRatio = document.getElementById("option-aspect-ratio");
      this.customDimensionsContainer = document.getElementById("custom-dimensions-container");
      this.optionWidth = document.getElementById("option-width");
      this.optionHeight = document.getElementById("option-height");
      this.optionNumImages = document.getElementById("option-num-images");

      // 新增：获取面包屑导航元素
      this.breadcrumbNav = document.getElementById("breadcrumb-nav");

      // 绑定生成页面特有的事件
      this.bindEvents();
      this._toggleImageOptions(); // 初始化时根据类型显隐图片选项
      this._handleAspectRatioChange(); // 初始化宽高比相关UI
      this._handleBreadcrumbVisibility(); // 初始化面包屑导航显示逻辑
      window.addEventListener("hashchange", () => this._handleBreadcrumbVisibility());
      document.addEventListener("DOMContentLoaded", () => this._handleBreadcrumbVisibility());
    } else {
      // 非生成页面：只初始化基本元素
      this.textInput = null;
      this.generateButton = null;
      this.typeImageRadio = null;
      this.typeAudioRadio = null;
      this.loadingIndicator = null;
      this.loadingText = null;
      this.errorMessage = null;
      this.imageResultContainer = null;
      this.audioResultContainer = null;
      this.generatedAudio = null;
      this.downloadAudioLink = null;
      this.imageOptionsContainer = null;
      this.optionNologo = null;
      this.optionAspectRatio = null;
      this.customDimensionsContainer = null;
      this.optionWidth = null;
      this.optionHeight = null;
      this.optionNumImages = null;
      this.breadcrumbNav = null;
    }

    // 更新页面文本
    this.updatePageText();

    // 监听语言变更事件
    document.addEventListener("languageChanged", () => {
      this.updatePageText();
    });
  }

  /**
   * 初始化语言切换功能
   */
  initLanguageSwitcher() {
    const currentLang = getCurrentLang();
    const langSelect = document.getElementById("lang-select");
    if (langSelect) {
      langSelect.value = currentLang;
      langSelect.addEventListener("change", (e) => {
        if (e.target.value !== getCurrentLang()) {
          setLanguage(e.target.value);
        }
      });
    }
  }

  /**
   * 更新页面文本
   */
  updatePageText() {
    // 只保留自定义UI更新逻辑，不再调用window.updatePageText()

    // 更新页面标题和meta标签（适用于所有页面）
    const currentLang = getCurrentLang();
    const langCode = currentLang === "zh" ? "zh-CN" : "en";
    document.documentElement.lang = langCode;

    // 根据当前页面更新标题
    const currentPath = window.location.pathname;
    if (currentPath.includes("about.html")) {
      document.title = t("aboutModalTitle");
      // 更新meta描述
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.content =
          currentLang === "zh"
            ? "AISTONE - 关于我们，AI图片生成与语音合成平台介绍。"
            : "AISTONE - About us, AI image generation and voice synthesis platform introduction.";
      }
    } else if (currentPath.includes("services.html")) {
      document.title = t("servicesModalTitle");
      // 更新meta描述
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.content =
          currentLang === "zh"
            ? "AISTONE - 服务介绍，AI图片生成与语音合成平台功能一览。"
            : "AISTONE - Service introduction, AI image generation and voice synthesis platform features.";
      }
    } else if (currentPath.includes("contact.html")) {
      document.title = t("contactModalTitle");
      // 更新meta描述
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.content =
          currentLang === "zh"
            ? "AISTONE - 联系我们，AI图片生成与语音合成平台客服支持。"
            : "AISTONE - Contact us, AI image generation and voice synthesis platform customer support.";
      }
    } else {
      // 首页
      document.title = t("title");
      const heroTitle = document.querySelector(".hero-title");
      if (heroTitle) heroTitle.textContent = t("title");
      const heroSubtitle = document.querySelector(".hero-subtitle");
      if (heroSubtitle) heroSubtitle.textContent = t("subtitle");
    }

    // 更新输入区域（仅首页）
    if (this.textInput) {
      this.textInput.placeholder = t("inputPlaceholder");
    }
    if (this.generateButton) {
      this.generateButton.textContent = t("generateButton");
    }

    // 更新生成类型（仅首页）
    const typeImageLabel = document.querySelector('label[for="type-image"]');
    if (typeImageLabel) typeImageLabel.textContent = t("typeImage");
    const typeAudioLabel = document.querySelector('label[for="type-audio"]');
    if (typeAudioLabel) typeAudioLabel.textContent = t("typeAudio");

    // 更新图片选项（仅首页）
    const imageOptionsTitle = document.querySelector(".image-options h3");
    if (imageOptionsTitle) imageOptionsTitle.textContent = t("imageOptions");

    // 更新AI模型选择器
    const aiModelLabel = document.querySelector('label[for="option-ai-model"]');
    if (aiModelLabel) aiModelLabel.textContent = t("aiModel");

    const aiModelFluxOption = document.querySelector('option[value="flux"]');
    if (aiModelFluxOption) aiModelFluxOption.textContent = t("aiModelFlux");

    const aiModelTurboOption = document.querySelector('option[value="turbo"]');
    if (aiModelTurboOption) aiModelTurboOption.textContent = t("aiModelTurbo");

    const aiModelKontextOption = document.querySelector('option[value="kontext"]');
    if (aiModelKontextOption) aiModelKontextOption.textContent = t("aiModelKontext");

    const modelHint = document.querySelector(".model-hint");
    if (modelHint) modelHint.textContent = t("modelHint");

    const aspectRatioLabel = document.querySelector('label[for="option-aspect-ratio"]');
    if (aspectRatioLabel) aspectRatioLabel.textContent = t("aspectRatio");
    const aspectRatioSquare = document.querySelector('option[value="1:1"]');
    if (aspectRatioSquare) aspectRatioSquare.textContent = t("aspectRatioSquare");

    const aspectRatioLandscape = document.querySelector('option[value="16:9"]');
    if (aspectRatioLandscape) aspectRatioLandscape.textContent = t("aspectRatioLandscape");

    const aspectRatioPortrait = document.querySelector('option[value="9:16"]');
    if (aspectRatioPortrait) aspectRatioPortrait.textContent = t("aspectRatioPortrait");

    const aspectRatioStandard = document.querySelector('option[value="4:3"]');
    if (aspectRatioStandard) aspectRatioStandard.textContent = t("aspectRatioStandard");

    const aspectRatioStandardVertical = document.querySelector('option[value="3:4"]');
    if (aspectRatioStandardVertical)
      aspectRatioStandardVertical.textContent = t("aspectRatioStandardVertical");

    const option16_9_2k = document.querySelector('option[value="16:9-2k"]');
    if (option16_9_2k) option16_9_2k.textContent = t("aspectRatioLandscape2K");
    const option9_16_2k = document.querySelector('option[value="9:16-2k"]');
    if (option9_16_2k) option9_16_2k.textContent = t("aspectRatioPortrait2K");
    const aspectRatioCustom = document.querySelector('option[value="custom"]');
    if (aspectRatioCustom) aspectRatioCustom.textContent = t("aspectRatioCustom");
    const widthLabel = document.querySelector('label[for="option-width"]');
    if (widthLabel) widthLabel.textContent = t("width");
    const heightLabel = document.querySelector('label[for="option-height"]');
    if (heightLabel) heightLabel.textContent = t("height");
    const noLogoLabel = document.querySelector('label[for="option-nologo"]');
    if (noLogoLabel) noLogoLabel.textContent = t("noLogo");
    const numImagesLabel = document.querySelector('label[for="option-num-images"]');
    if (numImagesLabel) numImagesLabel.textContent = t("numImages");

    // 更新数量选择器选项
    const oneImageOption = document.querySelector('option[value="1"]');
    if (oneImageOption) oneImageOption.textContent = t("oneImage");

    const twoImagesOption = document.querySelector('option[value="2"]');
    if (twoImagesOption) twoImagesOption.textContent = t("twoImages");

    const fourImagesOption = document.querySelector('option[value="4"]');
    if (fourImagesOption) fourImagesOption.textContent = t("fourImages");

    // 更新快捷操作按钮（仅首页）
    const clearBtn = document.getElementById("clear-btn");
    if (clearBtn) clearBtn.textContent = t("clearButton");
    const optimizeBtn = document.getElementById("optimize-btn");
    if (optimizeBtn) optimizeBtn.textContent = t("optimizeButton");
    const randomBtn = document.getElementById("random-btn");
    if (randomBtn) randomBtn.textContent = t("randomButton");

    // 更新提示文本（仅首页）
    const typeHint = document.getElementById("type-hint");
    if (typeHint && this.typeImageRadio) {
      typeHint.textContent = this.typeImageRadio.checked ? t("imageHint") : t("audioHint");
    }

    // 更新输入区域标题（仅首页）
    const inputTitleEl = document.querySelector(".input-section h2");
    if (inputTitleEl) inputTitleEl.textContent = t("inputTitle");

    // 导航栏文案交由 data-i18n 与 setLanguage 统一更新，避免覆盖页面自定义顺序
    // 更新登录按钮（所有页面）
    const loginBtn = document.querySelector(".login-btn");
    if (loginBtn) loginBtn.textContent = t("navLogin");

    // 更新Generation Result标题（仅首页）
    const outputTitle = document.querySelector(".output-section h2");
    if (outputTitle) outputTitle.textContent = t("generationResult");

    // 更新主要特性区块标题（仅首页）
    const featuresTitle = document.querySelector(".features-title");
    if (featuresTitle) featuresTitle.textContent = t("featuresTitle");

    // 更新主要特性卡片内容（仅首页）
    const featureCards = document.querySelectorAll(".feature-card");
    const features = t("features");
    if (featureCards && Array.isArray(features)) {
      featureCards.forEach((card, idx) => {
        const titleEl = card.querySelector("h3");
        const descEl = card.querySelector("p");
        if (features[idx]) {
          if (titleEl) titleEl.textContent = features[idx].title;
          if (descEl) descEl.textContent = features[idx].desc;
        }
      });
    }

    // 更新footer内容（所有页面）
    const footerCopyright = document.querySelector(".footer-left");
    if (footerCopyright) footerCopyright.textContent = t("footerCopyright");
    const footerLinks = t("footerLinks");
    const footerRight = document.querySelector(".footer-right");
    if (footerRight && Array.isArray(footerLinks)) {
      footerRight.innerHTML = footerLinks
        .map((link) => `<a href="${link.url}" class="footer-link">${link.text}</a>`)
        .join("<br>");
    }
  }

  /**
   * 绑定所有事件处理器
   */
  bindEvents() {
    this.generateButton.addEventListener("click", () => this.handleGenerate());
    this.textInput.addEventListener("input", () => this.validateInput());

    // 新增：为类型选择和图片选项绑定事件
    this.typeImageRadio.addEventListener("change", () => this._toggleImageOptions());
    this.typeAudioRadio.addEventListener("change", () => this._toggleImageOptions());
    this.optionAspectRatio.addEventListener("change", () => this._handleAspectRatioChange());

    // 新增：为新的选项绑定事件
    this._bindNewOptionsEvents();

    this.validateInput();
  }

  /**
   * 绑定新选项的事件处理器
   */
  _bindNewOptionsEvents() {
    // 绑定AI模型选择事件
    const aiModelSelect = document.getElementById("option-ai-model");
    if (aiModelSelect) {
      aiModelSelect.addEventListener("change", () => {
        console.log("AI模型已更改为:", aiModelSelect.value);
        // 可以在这里添加模型切换时的特殊处理
      });
    }
  }

  /**
   * 验证用户输入
   * @returns {boolean} 输入是否有效
   */
  validateInput() {
    const text = this.textInput.value.trim();
    const isValid = text.length > 0;
    // 只有当没有正在进行的生成任务时，才根据输入有效性启用按钮
    if (!this.isGenerating) {
      this.generateButton.disabled = !isValid;
    } else {
      this.generateButton.disabled = true; // 如果正在生成，始终禁用
    }
    this.hideError(); // 在输入验证时隐藏错误信息
    return isValid;
  }

  /**
   * 显示加载状态
   */
  showLoading(
    message = getCurrentLang && getCurrentLang() === "zh"
      ? "AI服务繁忙时会自动排队重试，请耐心等待..."
      : "The AI service may queue and retry during peak times, please wait..."
  ) {
    this.loadingText.textContent = message;
    this.loadingIndicator.style.display = "block";
    this.generateButton.disabled = true;
    this.hideError();
    this.hideResults();
  }

  /**
   * 隐藏加载状态
   */
  hideLoading() {
    this.loadingIndicator.style.display = "none";
    // this.generateButton.disabled = false; // 移除，让 validateInput 通过 isGenerating 状态处理
    this.validateInput(); // 确保根据 isGenerating 和输入内容更新按钮状态
  }

  /**
   * 显示错误信息
   * @param {string} message 错误信息
   */
  showError(message) {
    this.errorMessage.textContent = message;
    this.errorMessage.style.display = "block";
  }

  /**
   * 隐藏错误信息
   */
  hideError() {
    this.errorMessage.style.display = "none";
  }

  /**
   * 隐藏所有结果
   */
  hideResults() {
    this.imageResultContainer.style.display = "none";
    this.imageResultContainer.innerHTML = ""; // 清空图片容器内容
    this.audioResultContainer.style.display = "none";
    this.generatedAudio.src = "";
    this.downloadAudioLink.href = "#";
    this.downloadAudioLink.style.display = "none";
  }

  /**
   * 显示图片结果
   * @param {Array<string>} imageDataURLs - base64图片数据URL数组
   */
  showImageResult(imageDataURLs) {
    if (!imageDataURLs || !Array.isArray(imageDataURLs) || imageDataURLs.length === 0) {
      console.error("UIHandler: showImageResult - 无效的imageDataURLs数组", imageDataURLs);
      this.showError(t("noValidImageData"));
      return;
    }

    // 过滤有效的图片数据 - 支持base64和URL格式
    const validImages = imageDataURLs.filter(
      (imageDataURL) =>
        typeof imageDataURL === "string" &&
        (imageDataURL.startsWith("data:image") ||
          imageDataURL.startsWith("http") ||
          imageDataURL.startsWith("https"))
    );

    if (validImages.length === 0) {
      console.warn("UIHandler: showImageResult - 没有有效的图片数据");
      this.showError(t("noImagesLoaded"));
      return;
    }

    // 优先使用 ImageDisplay 模块（存在时），否则回退到内置实现
    if (
      window.ImageDisplay &&
      typeof window.ImageDisplay.showSingle === "function" &&
      typeof window.ImageDisplay.showMultiple === "function"
    ) {
      if (validImages.length === 1) {
        window.ImageDisplay.showSingle(validImages[0]);
      } else {
        window.ImageDisplay.showMultiple(validImages);
      }
    } else {
      // 回退到原有全局实现，确保与既有行为保持一致（含下载/复制等按钮）
      if (validImages.length === 1) {
        displayImageResult(validImages[0], 1);
      } else {
        displayImageResult(validImages, validImages.length);
      }
    }

    // 隐藏音频结果容器
    this.audioResultContainer.style.display = "none";
  }

  /**
   * 显示音频结果
   * @param {string} audioUrl Can be Object URL (blob:...) or Base64 Data URL
   */
  showAudioResult(audioUrl) {
    if (!audioUrl || typeof audioUrl !== "string") {
      console.error("UIHandler: showAudioResult - 无效的audioUrl", audioUrl);
      this.showError(t("invalidAudioUrl"));
      return;
    }
    this.generatedAudio.src = audioUrl;
    this.downloadAudioLink.href = audioUrl;
    this.downloadAudioLink.download = `generated_audio_${Date.now()}.mp3`;
    this.downloadAudioLink.style.display = "inline-block";
    this.audioResultContainer.style.display = "block";
    this.imageResultContainer.style.display = "none";
  }

  // 新增：根据生成类型显隐图片选项
  _toggleImageOptions() {
    const imageOptionsContainer = document.getElementById("image-generation-options");

    if (this.typeImageRadio.checked) {
      // 显示图片选项
      if (imageOptionsContainer) imageOptionsContainer.style.display = "block";
    } else {
      // 隐藏图片选项
      if (imageOptionsContainer) imageOptionsContainer.style.display = "none";
    }
  }

  // 新增：处理宽高比选择变化
  _handleAspectRatioChange() {
    if (this.optionAspectRatio.value === "custom") {
      this.customDimensionsContainer.style.display = "block";
    } else {
      this.customDimensionsContainer.style.display = "none";
    }
  }

  /**
   * 主生成逻辑 - 升级版，支持Pollinations.AI新功能
   */
  async handleGenerate() {
    if (!this.validateInput() || this.isGenerating) {
      return;
    }

    const text = this.textInput.value.trim();
    const type = this.typeImageRadio.checked ? "image" : "audio";

    // 智能重定向：检测到语音生成时，提示并跳转到专业版
    if (type === "audio") {
      this._handleVoiceRedirect(text);
      return;
    }

    // 只处理图像生成
    this.isGenerating = true;
    this.showLoading(t("loading"));

    try {
      await this._handleImageGeneration(text);
    } catch (error) {
      // 优化错误提示
      let msg =
        error.details && error.details.error
          ? error.details.error
          : error.details && error.details.details
            ? error.details.details
            : error.message;
      if (error.details && error.details.error && error.details.error.includes("AI服务繁忙")) {
        msg += "\n建议您稍后再试，或更换描述内容。";
      }
      this.showError(msg);
    } finally {
      this.isGenerating = false;
      this.generateButton.disabled = false;
      this.hideLoading();
    }
  }

  /**
   * 处理图像生成 - 支持Pollinations.AI新模型
   */
  async _handleImageGeneration(text) {
    // 对于图片生成，先进行提示词优化
    let optimizedText = text;
    try {
      this.showLoading(
        getCurrentLang && getCurrentLang() === "zh" ? "正在优化提示词..." : "Optimizing prompt..."
      );
      optimizedText = await this.apiClient.optimizeText(text);
      console.log("UIHandler: 提示词优化成功，原始文本:", text, "优化后:", optimizedText);
    } catch (optimizeError) {
      console.warn("UIHandler: 提示词优化失败，使用原始文本:", optimizeError);
      optimizedText = text;
    }

    const numImages = parseInt(this.optionNumImages.value, 10);
    const imageOptions = this._getImageOptions();
    const allImageUrls = [];
    let failedCount = 0;

    // 尝试使用Pollinations.AI新功能
    const usePollinations = this._shouldUsePollinations();

    for (let i = 0; i < numImages; i++) {
      try {
        this.showLoading(`${t("generating")} ${i + 1}/${numImages}...`);

        let imageUrl;
        if (usePollinations) {
          // 使用Pollinations.AI新API
          imageUrl = await this.apiClient.generateImageWithPollinations(optimizedText, {
            ...imageOptions,
            seed: Math.floor(Math.random() * 100000000),
          });
        } else {
          // 使用原有API
          const response = await this.apiClient.submitGenerationTask(optimizedText, "image", {
            ...imageOptions,
            seed: Math.floor(Math.random() * 100000000),
          });
          if (response && response.data) {
            imageUrl = `data:image/jpeg;base64,${response.data}`;
          } else {
            throw new Error("API did not return image data.");
          }
        }

        allImageUrls.push(imageUrl);
      } catch (error) {
        console.error(`UIHandler: Error generating image ${i + 1}:`, error);
        let userFriendlyError =
          getCurrentLang && getCurrentLang() === "zh"
            ? `图片 ${i + 1} 生成失败。`
            : `Image ${i + 1} generation failed.`;
        if (error.details && error.details.error) {
          userFriendlyError = error.details.error;
          if (error.details.details) {
            userFriendlyError += ` (${error.details.details})`;
          }
        } else {
          userFriendlyError = `${t("error")}: ${error.message}`;
        }
        this.showError(userFriendlyError);
        failedCount++;
        break;
      }
    }

    if (allImageUrls.length > 0) {
      this.showImageResult(allImageUrls);

      // V2.0: 如果用户已登录，自动保存图片
      if (window.authManager && window.authManager.isLoggedIn() && window.hdImageManager) {
        console.log("开始自动保存图片...");
        try {
          for (let i = 0; i < allImageUrls.length; i++) {
            const imageUrl = allImageUrls[i];
            console.log(`处理图片 ${i + 1}:`, imageUrl.substring(0, 50) + "...");

            // 从data URL中提取base64数据
            const base64Data = imageUrl.split(",")[1];
            if (!base64Data) {
              console.error(`图片 ${i + 1} 数据格式错误`);
              continue;
            }

            // 获取图片尺寸
            const aspectRatio = document.getElementById("option-aspect-ratio")?.value || "square";
            let width = 1024,
              height = 1024;

            // 根据宽高比设置尺寸
            switch (aspectRatio) {
              case "portrait":
                width = 768;
                height = 1024;
                break;
              case "landscape":
                width = 1024;
                height = 768;
                break;
              case "wide":
                width = 1280;
                height = 720;
                break;
              case "ultrawide":
                width = 1920;
                height = 1080;
                break;
              default: // square
                width = 1024;
                height = 1024;
            }

            const imageData = {
              prompt: text,
              data: base64Data,
              width: width,
              height: height,
              seed: Math.floor(Math.random() * 100000000),
              model: document.getElementById("option-ai-model")?.value || "flux",
              negative: document.getElementById("negative-prompt")?.value || "",
            };

            console.log(`保存图片 ${i + 1} 数据:`, {
              prompt: imageData.prompt,
              width: imageData.width,
              height: imageData.height,
              model: imageData.model,
              dataLength: imageData.data.length,
            });

            const result = await window.hdImageManager.saveHDImage(imageData);
            if (result.success) {
              console.log(`图片 ${i + 1} 保存成功:`, result.id);
              // 显示保存成功消息
              if (window.authManager) {
                const msg =
                  getCurrentLang && getCurrentLang() === "zh"
                    ? `图片 ${i + 1} 已自动保存到您的账户`
                    : `Image ${i + 1} has been saved to your account`;
                window.authManager.showMessage(msg, "success");
              }
            } else {
              console.warn(`图片 ${i + 1} 保存失败:`, result.error);
              // 显示保存失败消息
              if (window.authManager) {
                const msg =
                  getCurrentLang && getCurrentLang() === "zh"
                    ? `图片 ${i + 1} 保存失败: ${result.error}`
                    : `Image ${i + 1} save failed: ${result.error}`;
                window.authManager.showMessage(msg, "error");
              }
            }
          }
        } catch (error) {
          console.error("自动保存图片失败:", error);
          if (window.authManager) {
            const msg =
              getCurrentLang && getCurrentLang() === "zh"
                ? `自动保存图片失败: ${error.message}`
                : `Auto-saving image failed: ${error.message}`;
            window.authManager.showMessage(msg, "error");
          }
        }
      } else {
        console.log("用户未登录或图片管理器未加载，跳过自动保存");
      }

      if (failedCount > 0) {
        const msg =
          getCurrentLang && getCurrentLang() === "zh"
            ? `成功生成 ${allImageUrls.length} 张图片，但有 ${failedCount} 次失败。请检查错误信息。`
            : `Successfully generated ${allImageUrls.length} images, but ${failedCount} failed. Please check the error messages.`;
        this.showError(msg);
      }
    } else {
      if (failedCount === 0) {
        this.showError(
          getCurrentLang && getCurrentLang() === "zh"
            ? "未能生成任何图片。"
            : "No images were generated."
        );
      }
    }
  }

  /**
   * 处理语音生成重定向到专业版
   */
  _handleVoiceRedirect(text) {
    this._showVoiceRedirectModal(text);
  }

  /**
   * 显示美观的语音重定向模态框
   */
  _showVoiceRedirectModal(text) {
    // 创建模态框HTML
    const modalHTML = `
            <div id="voice-redirect-modal" class="voice-redirect-modal" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            ">
                <div class="modal-content" style="
                    background: var(--color-surface-on-light-white, #fff);
                    border-radius: 12px;
                    padding: 30px;
                    max-width: 500px;
                    width: 90%;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                    animation: slideUp 0.3s ease;
                    text-align: center;
                ">
                    <div class="modal-icon" style="
                        font-size: 48px;
                        margin-bottom: 16px;
                    ">🎵</div>
                    <h3 style="
                        margin: 0 0 16px 0;
                        color: var(--color-text-on-light-strong, #333);
                        font-size: 24px;
                        font-weight: 600;
                    ">${getCurrentLang() === "zh" ? "语音生成检测" : "Voice Generation Detected"}</h3>
                    <p style="
                        margin: 0 0 24px 0;
                        color: var(--color-text-on-light-muted, #666);
                        line-height: 1.6;
                        font-size: 16px;
                    ">
                        ${
                          getCurrentLang() === "zh"
                            ? "为了提供更好的语音合成体验，我们建议您使用专业版语音合成器。<br><br><strong>专业版特色：</strong><br>• 6种专业音色选择<br>• 语速调节控制<br>• 高质量音频输出<br>• 专业级用户界面"
                            : "For a better voice synthesis experience, we recommend using our professional voice synthesizer.<br><br><strong>Professional Features:</strong><br>• 6 professional voice options<br>• Speed control<br>• High-quality audio output<br>• Professional user interface"
                        }
                    </p>
                    <div class="modal-actions" style="
                        display: flex;
                        gap: 12px;
                        justify-content: center;
                    ">
                        <button id="voice-redirect-confirm" class="btn-primary" style="
                            background: linear-gradient(135deg, var(--color-brand-secondary, #667eea) 0%, var(--color-accent-purple-strong, #764ba2) 100%);
                            color: var(--color-surface-on-light-white, #fff);
                            border: none;
                            padding: 12px 24px;
                            border-radius: 8px;
                            font-size: 16px;
                            font-weight: 500;
                            cursor: pointer;
                            transition: transform 0.2s;
                        ">${getCurrentLang() === "zh" ? "使用专业版" : "Use Professional Version"}</button>
                        <button id="voice-redirect-cancel" class="btn-secondary" style="
                            background: var(--color-surface-muted, #f8f9fa);
                            color: var(--color-text-on-light-muted, #666);
                            border: 1px solid var(--color-border-soft, #ddd);
                            padding: 12px 24px;
                            border-radius: 8px;
                            font-size: 16px;
                            font-weight: 500;
                            cursor: pointer;
                            transition: all 0.2s;
                        ">${getCurrentLang() === "zh" ? "取消" : "Cancel"}</button>
                    </div>
                </div>
            </div>
            <style>
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
                @keyframes slideUp {
                    from { transform: translateY(30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .voice-redirect-modal .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                }
                .voice-redirect-modal .btn-secondary:hover {
                    background: var(--color-border-muted, #e9ecef);
                    border-color: var(--color-border-subtle, #adb5bd);
                }
            </style>
        `;

    // 添加到页面
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // 绑定事件
    const modal = document.getElementById("voice-redirect-modal");
    const confirmBtn = document.getElementById("voice-redirect-confirm");
    const cancelBtn = document.getElementById("voice-redirect-cancel");

    confirmBtn.addEventListener("click", () => {
      const encodedText = encodeURIComponent(text);
      const targetUrl = `voice.html?text=${encodedText}&source=main`;
      window.location.href = targetUrl;
    });

    cancelBtn.addEventListener("click", () => {
      this._closeVoiceRedirectModal();
    });

    // 点击背景关闭
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        this._closeVoiceRedirectModal();
      }
    });

    // ESC键关闭
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this._closeVoiceRedirectModal();
      }
    });
  }

  /**
   * 关闭语音重定向模态框
   */
  _closeVoiceRedirectModal() {
    const modal = document.getElementById("voice-redirect-modal");
    if (modal) {
      modal.style.animation = "fadeOut 0.3s ease";
      setTimeout(() => {
        modal.remove();
      }, 300);
    }
  }

  /**
   * 处理音频生成 - 还原原始功能
   */
  async _handleAudioGeneration(text) {
    try {
      this.showLoading(
        getCurrentLang && getCurrentLang() === "zh" ? "正在生成音频..." : "Generating audio..."
      );

      // 使用原有的音频生成API
      const audioBuffer = await this.apiClient.submitGenerationTask(text, "audio");
      const audioBlob = new Blob([audioBuffer], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);
      this.showAudioResult(audioUrl);
    } catch (error) {
      console.error("UIHandler: Audio generation failed:", error);
      throw error;
    }
  }

  /**
   * 判断是否应该使用Pollinations.AI新功能 - 仅用于图像
   */
  _shouldUsePollinations() {
    // 检查是否有新的AI模型选择，仅用于图像生成
    const aiModel = document.getElementById("option-ai-model")?.value;
    return aiModel && (aiModel === "kontext" || aiModel === "turbo");
  }

  _ensureLoadingIsHidden() {
    // 新增一个方法确保loading最终被隐藏
    if (this.loadingIndicator.style.display !== "none") {
      this.hideLoading();
    }
  }

  /**
   * 获取图片生成选项
   */
  _getImageOptions() {
    const imageOptions = {};

    // 基础选项
    const nologoCheckbox = document.getElementById("option-nologo");
    imageOptions.nologo = nologoCheckbox ? nologoCheckbox.checked : true;

    // AI模型选择
    const aiModelSelect = document.getElementById("option-ai-model");
    if (aiModelSelect) {
      imageOptions.model = aiModelSelect.value;
    }

    // 尺寸选项
    const aspectRatioSelect = document.getElementById("option-aspect-ratio");
    if (aspectRatioSelect) {
      const aspectRatioValue = aspectRatioSelect.value;
      if (aspectRatioValue === "custom") {
        const widthInput = document.getElementById("option-width");
        const heightInput = document.getElementById("option-height");
        imageOptions.width = parseInt(widthInput?.value, 10);
        imageOptions.height = parseInt(heightInput?.value, 10);
      } else {
        const selectedOption = aspectRatioSelect.selectedOptions[0];
        imageOptions.width = parseInt(selectedOption.dataset.width, 10);
        imageOptions.height = parseInt(selectedOption.dataset.height, 10);
      }
    }

    // 验证尺寸
    if (isNaN(imageOptions.width) || imageOptions.width <= 0) delete imageOptions.width;
    if (isNaN(imageOptions.height) || imageOptions.height <= 0) delete imageOptions.height;

    return imageOptions;
  }

  _handleBreadcrumbVisibility() {
    const hash = window.location.hash;
    const showHashes = ["#features", "#create", "#results", "#faq", "#testimonials"];
    if (this.breadcrumbNav) {
      if (showHashes.includes(hash)) {
        this.breadcrumbNav.style.display = "";
      } else {
        this.breadcrumbNav.style.display = "none";
      }
    }
  }
}

// 将类设为全局变量
window.UIHandler = UIHandler;

/**
 * 显示生成的图片结果
 * @param {string|Array} imageData - Base64图片数据或图片数组
 * @param {number} numImages - 图片数量
 */
/* removed by P4-4: display handled inline in showImageResult */
function displayImageResult(imageData, numImages = 1) {
  // 优先委派到 ImageDisplay 模块
  if (
    window.ImageDisplay &&
    typeof window.ImageDisplay.showSingle === "function" &&
    typeof window.ImageDisplay.showMultiple === "function"
  ) {
    if (Array.isArray(imageData)) {
      window.ImageDisplay.showMultiple(imageData);
    } else {
      window.ImageDisplay.showSingle(imageData);
    }
    return;
  }
  // 回退：维持原有逻辑
  const imageContainer = document.getElementById("image-result-container");
  if (!imageContainer) {
    console.error("图片容器元素未找到");
    return;
  }
  imageContainer.innerHTML = "";
  if (Array.isArray(imageData)) {
    displayMultipleImages(imageContainer, imageData);
  } else {
    displaySingleImage(imageContainer, imageData);
  }
  imageContainer.style.display = "block";
}

/**
 * 显示单张图片
 */
/* removed by P4-4 */
function displaySingleImage(container, imageData) {
  const img = document.createElement("img");
  img.id = "generated-image";
  img.src = imageData;
  img.alt = `AI生成的图片 - ${imageData.prompt || "用户描述的内容"}`;

  // 添加图片加载事件
  img.onload = function () {
    // 添加图片信息
    addImageInfo(container, img);
    // 添加操作按钮
    addImageActions(container, img, imageData);
  };

  img.onerror = function () {
    console.error("图片加载失败");
    container.innerHTML =
      '<p style="color: var(--color-error-text, #e74c3c); text-align: center;">图片加载失败，请重试</p>';
  };

  container.appendChild(img);
}

/**
 * 显示多张图片
 */
/* removed by P4-4 */
function displayMultipleImages(container, imageDataArray) {
  const imageGrid = document.createElement("div");
  imageGrid.className = "image-grid";

  // 根据图片数量设置网格类
  switch (imageDataArray.length) {
    case 1:
      imageGrid.classList.add("single");
      break;
    case 2:
      imageGrid.classList.add("double");
      break;
    case 4:
      imageGrid.classList.add("quad");
      break;
    default:
      imageGrid.classList.add("quad"); // 默认4宫格
  }

  imageDataArray.forEach((imageData, index) => {
    const img = document.createElement("img");
    img.src = imageData;
    img.alt = `AI生成的图片 ${index + 1} - ${imageData.prompt || "用户描述的内容"}`;
    img.dataset.index = index;

    // 点击图片放大查看
    img.addEventListener("click", () => {
      showImageModal(imageData, index + 1);
    });

    imageGrid.appendChild(img);
  });

  container.appendChild(imageGrid);

  // 添加多图片信息
  addMultiImageInfo(container, imageDataArray.length);
  // 添加批量操作按钮
  addBatchImageActions(container, imageDataArray);
}

/**
 * 添加图片信息显示
 */
/* removed by P4-4 */
function addImageInfo(container, img) {
  const infoDiv = document.createElement("div");
  infoDiv.className = "image-info";
  const width = img.naturalWidth;
  const height = img.naturalHeight;
  const fileSize = Math.round((img.src.length * 0.75) / 1024); // 估算文件大小KB
  infoDiv.innerHTML = `${t("imageInfoSize")}: ${width} × ${height} ${t("pixels")} | ${t("imageInfoFileSize")}: ~${fileSize}KB`;
  container.appendChild(infoDiv);
}

/**
 * 添加多图片信息
 */
/* removed by P4-4 */
function addMultiImageInfo(container, count) {
  const infoDiv = document.createElement("div");
  infoDiv.className = "image-info";
  infoDiv.innerHTML = `${t("imageInfoCount").replace("{count}", count)}`;
  container.appendChild(infoDiv);
}

/**
 * 添加图片操作按钮
 */
/* removed by P4-4 */
function addImageActions(container, img, imageData) {
  const actionsDiv = document.createElement("div");
  actionsDiv.className = "image-actions";

  // 下载按钮
  const downloadBtn = document.createElement("a");
  downloadBtn.className = "image-action-btn";
  downloadBtn.href = imageData;
  downloadBtn.download = `AI生成图片_${new Date().getTime()}.jpg`;
  downloadBtn.innerHTML =
    getCurrentLang && getCurrentLang() === "zh" ? "⬇️ 下载图片" : "⬇️ Download";

  // 查看原图按钮
  const viewBtn = document.createElement("button");
  viewBtn.className = "image-action-btn";
  viewBtn.innerHTML =
    getCurrentLang && getCurrentLang() === "zh" ? "🔍 查看原图" : "🔍 View Original";
  viewBtn.onclick = () => showImageModal(imageData);

  // 复制链接按钮
  const copyBtn = document.createElement("button");
  copyBtn.className = "image-action-btn";
  copyBtn.innerHTML = getCurrentLang && getCurrentLang() === "zh" ? "📋 复制链接" : "📋 Copy Link";
  copyBtn.onclick = () => copyImageData(imageData);

  actionsDiv.appendChild(downloadBtn);
  actionsDiv.appendChild(viewBtn);
  actionsDiv.appendChild(copyBtn);

  container.appendChild(actionsDiv);
}

/**
 * 添加批量图片操作按钮
 */
/* removed by P4-4 */
function addBatchImageActions(container, imageDataArray) {
  const actionsDiv = document.createElement("div");
  actionsDiv.className = "image-actions";

  // 下载全部按钮
  const downloadAllBtn = document.createElement("button");
  downloadAllBtn.className = "image-action-btn";
  downloadAllBtn.innerHTML = "⬇️ 下载全部";
  downloadAllBtn.onclick = () => downloadAllImages(imageDataArray);

  // 查看网格按钮
  const gridBtn = document.createElement("button");
  gridBtn.className = "image-action-btn";
  gridBtn.innerHTML = "🏢 网格查看";
  gridBtn.onclick = () => showImageGrid(imageDataArray);

  actionsDiv.appendChild(downloadAllBtn);
  actionsDiv.appendChild(gridBtn);

  container.appendChild(actionsDiv);
}

/**
 * 显示图片模态框（放大查看）
 */
/* removed by P4-4 */
function showImageModal(imageData, index = 1) {
  // 创建模态框
  const modal = document.createElement("div");
  modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        cursor: pointer;
    `;

  const img = document.createElement("img");
  img.src = imageData;
  img.style.cssText = `
        max-width: 90vw;
        max-height: 90vh;
        object-fit: contain;
        border-radius: 8px;
        box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
    `;

  const closeBtn = document.createElement("div");
  closeBtn.innerHTML = "✕";
  closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 30px;
        color: var(--color-surface-on-light-white, #fff);
        font-size: 30px;
        font-weight: bold;
        cursor: pointer;
        user-select: none;
    `;

  const infoDiv = document.createElement("div");
  infoDiv.innerHTML = `图片 ${index} - 点击空白处关闭`;
  infoDiv.style.cssText = `
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        color: var(--color-surface-on-light-white, #fff);
        font-size: 14px;
        text-align: center;
    `;

  modal.appendChild(img);
  modal.appendChild(closeBtn);
  modal.appendChild(infoDiv);

  // 点击关闭
  modal.onclick = (e) => {
    if (e.target === modal || e.target === closeBtn) {
      document.body.removeChild(modal);
    }
  };

  // ESC键关闭
  const handleEscape = (e) => {
    if (e.key === "Escape") {
      document.body.removeChild(modal);
      document.removeEventListener("keydown", handleEscape);
    }
  };
  document.addEventListener("keydown", handleEscape);

  document.body.appendChild(modal);
}

/**
 * 复制图片数据
 */
/* removed by P4-4 */
function copyImageData(imageData) {
  // 优先委派到 ImageDisplay 模块
  if (window.ImageDisplay && typeof window.ImageDisplay.copyImageData === "function") {
    try {
      return window.ImageDisplay.copyImageData(imageData);
    } catch (_) {}
  }
  // 优先使用 UIUtils 模块
  if (window.UIUtils && typeof window.UIUtils.copyText === "function") {
    try {
      return window.UIUtils.copyText(String(imageData || ""));
    } catch (_) {}
  }
  navigator.clipboard
    .writeText(imageData)
    .then(() => {
      // 显示复制成功提示（优先 UIUtils，其次回退）
      if (window.UIUtils && typeof window.UIUtils.toast === "function") {
        try {
          window.UIUtils.toast("📋 图片链接已复制到剪贴板", "success");
        } catch (_) {}
      } else if (window.uiEnhancements) {
        window.uiEnhancements.updateResultStatus("📋 图片链接已复制到剪贴板", "success");
      }
    })
    .catch(() => {
      // 显示复制失败提示（优先 UIUtils，其次回退）
      if (window.UIUtils && typeof window.UIUtils.toast === "function") {
        try {
          window.UIUtils.toast("复制失败，请手动复制", "error");
        } catch (_) {}
      } else if (window.uiEnhancements) {
        window.uiEnhancements.updateResultStatus("复制失败，请手动复制", "error");
      }
    });
}

/**
 * 下载所有图片
 */
/* removed by P4-4 */
function downloadAllImages(imageDataArray) {
  // 优先委派到 ImageDisplay 模块
  if (window.ImageDisplay && typeof window.ImageDisplay.downloadAll === "function") {
    try {
      return window.ImageDisplay.downloadAll(imageDataArray);
    } catch (_) {}
  }
  imageDataArray.forEach((imageData, index) => {
    const link = document.createElement("a");
    link.href = imageData;
    link.download = `AI生成图片_${index + 1}_${new Date().getTime()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 添加延迟避免浏览器阻止多文件下载
    if (index < imageDataArray.length - 1) {
      setTimeout(() => {}, 100);
    }
  });

  if (window.uiEnhancements) {
    window.uiEnhancements.updateResultStatus(
      `📁 开始下载 ${imageDataArray.length} 张图片`,
      "success"
    );
  }
}

/**
 * 显示图片网格视图
 */
/* removed by P4-4 */
function showImageGrid(imageDataArray) {
  // 优先委派到 ImageDisplay 模块（用 showImageModal 作简化）
  if (window.ImageDisplay && typeof window.ImageDisplay.showImageModal === "function") {
    try {
      return window.ImageDisplay.showImageModal(imageDataArray && imageDataArray[0], 1);
    } catch (_) {}
  }
  showImageModal(imageDataArray[0], 1); // 暂时显示第一张，后续可扩展为网格查看器
}
