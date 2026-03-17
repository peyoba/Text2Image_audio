/**
 * UI增强功能模块
 * 提供示例填充、快捷操作、智能提示等交互功能
 * 运行环境：无打包直接引入（no-bundler），通过 window 全局使用
 * 版本: 1.0.0
 * 日期: 2025-05-24
 */

class UIEnhancements {
  constructor() {
    // 初始化空示例数组
    // this.examples = []; // 不再需要内部的 this.examples 数组

    // 监听语言变更事件
    document.addEventListener("languageChanged", () => {
      // this.updateExamples(); // 移除调用，依赖 i18n.js 的 updatePageText
      this.updateTypeHint();
    });

    this.initializeEventListeners();
    this.updateTypeHint();

    // 初始化示例
    // this.updateExamples(); // 移除调用，依赖 i18n.js 的 updatePageText

    this.initializeExampleCards();
  }

  /**
   * 初始化事件监听器
   */
  initializeEventListeners() {
    // 示例按钮点击事件
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("example-btn")) {
        this.handleExampleClick(e.target);
      }
    });

    // 快捷操作按钮事件
    document.getElementById("clear-btn")?.addEventListener("click", () => this.clearText());
    document.getElementById("optimize-btn")?.addEventListener("click", () => this.optimizeText());
    document
      .getElementById("random-btn")
      ?.addEventListener("click", () => this.fillRandomExample());

    // 生成类型变化事件
    document.querySelectorAll('input[name="generation-type"]').forEach((radio) => {
      radio.addEventListener("change", () => this.updateTypeHint());
    });

    // 结果状态更新
    this.setupResultStatusUpdates();
  }

  /**
   * 处理示例按钮点击
   */
  handleExampleClick(button) {
    const text = button.dataset.text;
    const type = button.dataset.type;

    // 填充文本
    const textInput = document.getElementById("text-input");
    if (textInput) {
      textInput.value = text;
      textInput.focus();

      // 触发input事件以更新按钮状态
      textInput.dispatchEvent(new Event("input"));

      // 添加填充动画效果
      textInput.style.background = "rgba(102, 126, 234, 0.1)";
      setTimeout(() => {
        textInput.style.background = "";
      }, 500);
    }

    // 设置对应的生成类型
    const typeRadio = document.getElementById(`type-${type}`);
    if (typeRadio) {
      typeRadio.checked = true;
      this.updateTypeHint();
    }

    // 按钮点击反馈
    button.style.transform = "scale(0.95)";
    setTimeout(() => {
      button.style.transform = "";
    }, 150);

    // 更新状态提示
    this.updateResultStatus(
      `已填充${type === "image" ? "图片" : "语音"}示例："${text.substring(0, 20)}..."`
    );
  }

  /**
   * 清空文本
   */
  clearText() {
    const textInput = document.getElementById("text-input");
    if (textInput) {
      textInput.value = "";
      textInput.focus();
      this.updateResultStatus(t("tips.clear"));
    }
  }

  /**
   * 智能优化文本
   */
  async optimizeText() {
    const textInput = document.getElementById("text-input");
    if (!textInput || !textInput.value.trim()) {
      this.updateResultStatus(t("pleaseInputFirst"), "warning");
      return;
    }

    try {
      this.updateResultStatus(t("loading"), "loading");

      const apiBase = (window.APP_CONFIG && window.APP_CONFIG.API_BASE) || window.API_BASE || "";
      const response = await fetch(`${apiBase}/api/prompts/optimize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: textInput.value,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.optimized_text) {
          textInput.value = result.optimized_text;
          this.updateResultStatus(t("optimizationSuccess"));

          textInput.style.borderColor = "#2ecc71";
          setTimeout(() => {
            textInput.style.borderColor = "";
          }, 1000);
        }
      } else {
        throw new Error(t("error"));
      }
    } catch (error) {
      console.error("优化失败:", error);
      this.updateResultStatus(t("optimizationFailed"), "error");
    }
  }

  /**
   * 填充随机示例
   */
  fillRandomExample() {
    const currentSelectedType =
      document.querySelector('input[name="generation-type"]:checked')?.value || "image";
    const currentLang = window.getCurrentLang(); // 获取当前语言
    const allExamplesInCurrentLang = window.i18n[currentLang].examples; // 获取当前语言的所有示例对象

    if (!allExamplesInCurrentLang) {
      console.error(`No examples found for language: ${currentLang}`);
      return;
    }

    // 将示例对象转换为数组，并根据当前选中的类型进行筛选
    const availableExamples = Object.values(allExamplesInCurrentLang).filter(
      (ex) => ex.type === currentSelectedType
    );

    if (availableExamples.length > 0) {
      const randomExample = availableExamples[Math.floor(Math.random() * availableExamples.length)];
      const textInput = document.getElementById("text-input");

      if (textInput) {
        textInput.value = randomExample.text; // 使用示例的 text 属性
        // 从 randomExample.name (e.g., "🐱 可爱猫咪") 中提取纯名称用于提示
        const pureName = randomExample.name.substring(randomExample.name.indexOf(" ") + 1);
        this.updateResultStatus(`🎲 随机填充：${pureName}`);

        // 触发input事件以更新按钮状态 (如果需要)
        textInput.dispatchEvent(new Event("input"));

        // 添加随机填充动画
        textInput.style.background =
          "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)";
        setTimeout(() => {
          textInput.style.background = "";
        }, 800);
      }
    }
  }

  /**
   * 更新类型提示
   */
  updateTypeHint() {
    const typeHint = document.getElementById("type-hint");
    const selectedType = document.querySelector('input[name="generation-type"]:checked')?.value;

    if (typeHint) {
      typeHint.textContent = selectedType === "audio" ? t("audioHint") : t("imageHint");
    }
  }

  /**
   * 更新结果状态提示
   */
  updateResultStatus(message, type = "info") {
    const resultStatus = document.getElementById("result-status");
    const statusIcon = resultStatus?.querySelector(".status-icon");
    const statusText = resultStatus?.querySelector(".status-text");

    if (resultStatus && statusIcon && statusText) {
      // 设置图标
      switch (type) {
        case "loading":
          statusIcon.textContent = "⏳";
          break;
        case "success":
          statusIcon.textContent = "✅";
          break;
        case "warning":
          statusIcon.textContent = "⚠️";
          break;
        case "error":
          statusIcon.textContent = "❌";
          break;
        default:
          statusIcon.textContent = "ℹ️";
      }

      statusText.textContent = message;
      resultStatus.style.display = "flex";

      // 自动隐藏（除了加载状态）
      if (type !== "loading") {
        setTimeout(() => {
          resultStatus.style.display = "none";
        }, 3000);
      }
    }
  }

  /**
   * 设置结果状态更新监听
   */
  setupResultStatusUpdates() {
    // 监听生成按钮状态变化
    const generateButton = document.getElementById("generate-button");
    if (generateButton) {
      // 创建观察器监听按钮状态变化
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "attributes" && mutation.attributeName === "disabled") {
            const isDisabled = generateButton.disabled;
            if (isDisabled) {
              const msg = window.t ? t("generatingContent") : "Generating content, please wait...";
              this.updateResultStatus(msg, "loading");
            }
          }
        });
      });

      observer.observe(generateButton, {
        attributes: true,
        attributeFilter: ["disabled"],
      });
    }

    // 监听结果容器的显示状态
    const imageContainer = document.getElementById("image-result-container");
    const audioContainer = document.getElementById("audio-result-container");

    [imageContainer, audioContainer].forEach((container) => {
      if (container) {
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === "attributes" && mutation.attributeName === "style") {
              const isVisible = container.style.display !== "none";
              if (isVisible) {
                const isImage = container.id.includes("image");
                const msg = window.t
                  ? isImage
                    ? t("imageGeneratedDone")
                    : t("audioGeneratedDone")
                  : `🎉 ${isImage ? "图片生成完成！" : "语音生成完成！"}`;
                this.updateResultStatus(msg, "success");
              }
            }
          });
        });

        observer.observe(container, {
          attributes: true,
          attributeFilter: ["style"],
        });
      }
    });
  }

  /**
   * 显示使用提示
   */
  showUsageTips() {
    const tips = [
      t("tips.example"),
      t("tips.optimize"),
      t("tips.random"),
      t("tips.imageSize"),
      t("tips.audio"),
    ];

    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    this.updateResultStatus(randomTip);
  }

  /**
   * 更新示例按钮
   * 此方法现在不再需要主动修改按钮内容，因为按钮内容由 i18n.js 的 updatePageText 统一处理。
   * 保留此方法名，但将其内容清空或注释掉，以防其他地方意外调用时出错。
   */
  updateExamples() {
    console.log("UIEnhancements.updateExamples() 被调用 - textContent 修改已被禁用"); // 更新调试日志
    const exampleButtons = document.querySelectorAll(".example-btn");
    const lang = window.getCurrentLang();
    const examplesData = window.i18n[lang].examples;

    if (!examplesData) {
      console.error(`No examples data found for language: ${lang}`);
      return;
    }

    // 将i18n中的示例数据转换为数组以便按顺序处理
    const exampleKeys = Object.keys(examplesData); // e.g., ["cat", "dragon", "lake", "welcome"]

    exampleButtons.forEach((button, index) => {
      // 尝试从HTML的data-i18n-name获取原始key，例如 "examples.cat.name"
      const i18nNameKey = button.dataset.i18nName; // e.g., "examples.cat.name"

      if (i18nNameKey) {
        const parts = i18nNameKey.split(".");
        if (parts.length === 3 && parts[0] === "examples") {
          const exampleKey = parts[1]; // "cat", "dragon", etc.
          const exampleEntry = examplesData[exampleKey];

          if (exampleEntry) {
            // 关键：这里不应该再修改textContent，textContent由i18n.js的updatePageText负责
            // button.textContent = exampleEntry.name; // ！！！确保此行被注释或删除 ！！！
            button.dataset.text = exampleEntry.text;
            button.dataset.type = exampleEntry.type;
            // console.log(`更新按钮 ${index}: key=${exampleKey}, name=${exampleEntry.name}, text=${exampleEntry.text}, type=${exampleEntry.type}`);
          } else {
            // console.warn(`No data found for example key: ${exampleKey} in i18n data for lang ${lang}`);
          }
        } else {
          // 如果 i18nNameKey 格式不对，或者我们想严格按照 i18n.js 中定义的顺序来填充前 N 个按钮
          // 这是一个备用逻辑，但理想情况下，HTML中的按钮应该与i18n.js中的key对应
          if (exampleKeys[index]) {
            const exampleKey = exampleKeys[index];
            const exampleEntry = examplesData[exampleKey];
            // button.textContent = exampleEntry.name; // ！！！确保此行被注释或删除 ！！！
            button.dataset.text = exampleEntry.text;
            button.dataset.type = exampleEntry.type;
            // console.log(`(Fallback) 更新按钮 ${index} (顺序): key=${exampleKey}, name=${exampleEntry.name}, text=${exampleEntry.text}, type=${exampleEntry.type}`);
          }
        }
      } else {
        // 如果按钮没有 data-i18n-name，则按顺序从 i18n 数据中获取
        // 这种方式更脆弱，依赖于HTML按钮顺序和i18n数据顺序一致
        if (exampleKeys[index]) {
          const exampleKey = exampleKeys[index];
          const exampleEntry = examplesData[exampleKey];
          // button.textContent = exampleEntry.name; // ！！！确保此行被注释或删除 ！！！
          button.dataset.text = exampleEntry.text;
          button.dataset.type = exampleEntry.type;
          // console.log(`(No data-i18n-name) 更新按钮 ${index} (顺序): key=${exampleKey}, name=${exampleEntry.name}, text=${exampleEntry.text}, type=${exampleEntry.type}`);
        }
      }
    });
  }

  initializeExampleCards() {
    const exampleCards = document.querySelectorAll(".example-card");
    exampleCards.forEach((card) => {
      card.addEventListener("click", () => {
        const text = card.dataset.text;
        const type = card.dataset.type;

        // 更新输入框
        document.getElementById("text-input").value = text;

        // 更新生成类型
        const typeRadio = document.getElementById(`type-${type}`);
        if (typeRadio) {
          typeRadio.checked = true;
        }
      });
    });
  }

  displayImageResult(imageData) {
    const container = document.getElementById("image-result-container");
    container.style.display = "block";

    // 创建图片元素
    const img = document.createElement("img");
    img.src = imageData.imageURL;
    img.alt = `AI生成的图片 - ${imageData.prompt || "用户描述的内容"}`;
    img.className = "generated-image";

    // 添加图片信息
    const info = document.createElement("div");
    info.className = "image-info";
    info.innerHTML = `
            <p>尺寸: ${imageData.width}x${imageData.height}</p>
            <p>提示词: ${imageData.prompt || "无"}</p>
        `;

    // 清空容器并添加新内容
    container.innerHTML = "";
    container.appendChild(img);
    container.appendChild(info);
  }
}

// 关于弹窗模块化逻辑
// eslint-disable-next-line no-unused-vars
function setupAboutModal() {
  // 注释掉弹窗逻辑，让链接正常跳转
  /*
    const aboutBtn = document.getElementById('about-link');
    const aboutModal = document.getElementById('about-modal');
    const aboutClose = document.getElementById('about-modal-close');
    if (!aboutBtn || !aboutModal || !aboutClose) return;
    aboutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // 动态设置内容
        const lang = window.getCurrentLang ? window.getCurrentLang() : 'zh';
        const i18nData = window.i18n && window.i18n[lang] ? window.i18n[lang] : window.i18n['zh'];
        aboutModal.querySelector('h2').innerHTML = i18nData.aboutModal.title;
        aboutModal.querySelector('p').innerHTML = i18nData.aboutModal.content;
        aboutModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
    aboutClose.addEventListener('click', () => {
        aboutModal.style.display = 'none';
        document.body.style.overflow = '';
    });
    aboutModal.addEventListener('click', (e) => {
        if (e.target === aboutModal) {
            aboutModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
    */
}

// eslint-disable-next-line no-unused-vars
function setupContactModal() {
  // 注释掉弹窗逻辑，让链接正常跳转
  /*
    const contactBtn = document.getElementById('contact-link');
    const contactModal = document.getElementById('contact-modal');
    const contactClose = document.getElementById('contact-modal-close');
    if (!contactBtn || !contactModal || !contactClose) return;
    contactBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = window.getCurrentLang ? window.getCurrentLang() : 'zh';
        const i18nData = window.i18n && window.i18n[lang] ? window.i18n[lang] : window.i18n['zh'];
        contactModal.querySelector('h2').innerHTML = i18nData.contactModal.title;
        contactModal.querySelector('p').innerHTML = i18nData.contactModal.content;
        contactModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
    contactClose.addEventListener('click', () => {
        contactModal.style.display = 'none';
        document.body.style.overflow = '';
    });
    contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            contactModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
    */
}

// eslint-disable-next-line no-unused-vars
function setupServicesModal() {
  // 注释掉弹窗逻辑，让链接正常跳转
  /*
    const servicesBtn = document.getElementById('services-link');
    const servicesModal = document.getElementById('services-modal');
    const servicesClose = document.getElementById('services-modal-close');
    if (!servicesBtn || !servicesModal || !servicesClose) return;
    servicesBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = window.getCurrentLang ? window.getCurrentLang() : 'zh';
        const i18nData = window.i18n && window.i18n[lang] ? window.i18n[lang] : window.i18n['zh'];
        servicesModal.querySelector('h2').innerHTML = i18nData.servicesModal.title;
        servicesModal.querySelector('ul').outerHTML = i18nData.servicesModal.content;
        // 兼容content为ul+div结构
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = i18nData.servicesModal.content;
        const modalContent = servicesModal.querySelector('.modal-content');
        // 清空原ul和div内容
        while (modalContent.children.length > 3) { modalContent.removeChild(modalContent.lastChild); }
        Array.from(tempDiv.children).forEach(child => modalContent.appendChild(child));
        servicesModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
    servicesClose.addEventListener('click', () => {
        servicesModal.style.display = 'none';
        document.body.style.overflow = '';
    });
    servicesModal.addEventListener('click', (e) => {
        if (e.target === servicesModal) {
            servicesModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
    */
}

document.addEventListener("DOMContentLoaded", () => {
  // 注意：UIEnhancements 类的实例化已经移至 app.js 以保证幂等性并避免重复绑定
  // 但我们仍可在这里注册延迟显示提示等不冲突的轻量逻辑
  setTimeout(() => {
    if (window.uiEnhancements) {
      window.uiEnhancements.showUsageTips();
    }
  }, 1000);
});

// 将类设为全局变量
window.UIEnhancements = UIEnhancements;

// 用户评价区块卡片式自动轮播（修复双重定时器/卡顿问题并增加响应式支持）
(function () {
  const wrapper = document.querySelector(".testimonial-carousel-wrapper");
  const container = wrapper && wrapper.querySelector(".testimonial-cards");
  if (!container) return;

  const cards = Array.from(container.children);
  const cardCount = cards.length;
  if (cardCount === 0) return;

  // 1. 先克隆前 N 张卡片到末尾，保证无缝滚动视觉
  const clonedCount = 3;
  for (let i = 0; i < Math.min(clonedCount, cardCount); i++) {
    const clone = cards[i].cloneNode(true);
    // 标记为克隆体避免重复计算
    clone.classList.add('clone-card');
    container.appendChild(clone);
  }

  let index = 0;
  let paused = false;
  let timer = null;

  function getCardUnitWidth() {
    const gap = parseFloat(window.getComputedStyle(container).gap) || 0;
    return (cards[0].offsetWidth || 0) + gap;
  }

  function scrollToIndex(idx, smooth = true) {
    const unitWidth = getCardUnitWidth();
    if (unitWidth <= 0) return; // 未正确渲染时跳过
    
    container.style.transition = smooth ? "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)" : "none";
    container.style.transform = `translateX(${-idx * unitWidth}px)`;
  }

  function next() {
    if (paused) return;
    index++;
    scrollToIndex(index, true);
    
    // 如果已经滚到了原数组结尾开始（即进入克隆卡片区域）
    if (index >= cardCount) {
      setTimeout(() => {
        // 重置到头部，无缝瞬间切回
        index = 0;
        scrollToIndex(index, false);
      }, 600); // 必须与 CSS 过渡时间基本一致
    }
  }

  // 避免之前代码里两个 setInterval 冲突的问题（原代码580和590行各写了一个）
  function startCarousel() {
    if (timer) clearInterval(timer);
    timer = setInterval(next, 3500);
  }

  function stopCarousel() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  wrapper.addEventListener("mouseenter", () => {
    paused = true;
  });
  wrapper.addEventListener("mouseleave", () => {
    paused = false;
  });

  // 移动端触摸暂停
  wrapper.addEventListener("touchstart", () => { paused = true; }, { passive: true });
  wrapper.addEventListener("touchend", () => { setTimeout(() => { paused = false; }, 2000); }, { passive: true });

  // 窗口改变时重置布局，避免出现留白偏移
  window.addEventListener("resize", () => {
    scrollToIndex(index, false);
  });

  // 初始化
  scrollToIndex(index, false);
  startCarousel();
})();
