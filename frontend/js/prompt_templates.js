/**
 * 提示词模板管理器
 * 管理常用提示词模板的显示和应用
 */

// 模板数据
const PROMPT_TEMPLATES = {
  landscape: [
    {
      name: "山水风景",
      nameEn: "Mountain Landscape",
      prompt:
        "Majestic mountain landscape at golden hour, crystal clear lake reflection, pine trees, dramatic clouds, professional landscape photography, high resolution, award winning photograph",
      negative: "people, buildings, cars, urban elements",
    },
    {
      name: "森林小径",
      nameEn: "Forest Path",
      prompt:
        "Enchanted forest path, dappled sunlight through trees, moss covered stones, magical atmosphere, depth of field, cinematic lighting, nature photography",
      negative: "people, artificial objects, buildings",
    },
    {
      name: "海边日落",
      nameEn: "Beach Sunset",
      prompt:
        "Stunning ocean sunset, golden waves, dramatic sky with vibrant colors, silhouette of palm trees, peaceful seascape, professional photography",
      negative: "people, buildings, boats, pollution",
    },
    {
      name: "雪山全景",
      nameEn: "Snow Mountain",
      prompt:
        "Snow-capped mountain peaks, pristine white snow, blue sky, alpine scenery, wide angle landscape, sharp details, professional nature photography",
      negative: "people, buildings, vehicles, tracks",
    },
  ],
  portrait: [
    {
      name: "专业头像",
      nameEn: "Professional Portrait",
      prompt:
        "Professional headshot portrait, confident expression, clean background, studio lighting, sharp focus, business attire, high quality photography",
      negative: "blurry, low quality, bad lighting, unprofessional",
    },
    {
      name: "艺术肖像",
      nameEn: "Artistic Portrait",
      prompt:
        "Artistic portrait photography, dramatic lighting, emotional expression, creative composition, fine art style, professional model",
      negative: "amateur, snapshot, poor lighting, distracting background",
    },
    {
      name: "自然光肖像",
      nameEn: "Natural Light Portrait",
      prompt:
        "Natural light portrait, soft window lighting, genuine smile, relaxed pose, warm atmosphere, lifestyle photography",
      negative: "harsh lighting, artificial, posed, studio flash",
    },
    {
      name: "黑白肖像",
      nameEn: "Black White Portrait",
      prompt:
        "Classic black and white portrait, dramatic contrast, timeless elegance, professional lighting, sharp focus, artistic composition",
      negative: "color, low contrast, blurry, amateur",
    },
  ],
  product: [
    {
      name: "产品展示",
      nameEn: "Product Showcase",
      prompt:
        "Professional product photography, clean white background, soft shadows, studio lighting, high resolution, commercial quality, detailed texture",
      negative: "cluttered background, poor lighting, blurry, amateur",
    },
    {
      name: "电子产品",
      nameEn: "Electronics Product",
      prompt:
        "Modern electronic device, sleek design, reflective surface, gradient background, professional product shot, commercial photography",
      negative: "outdated, damaged, poor quality, cluttered",
    },
    {
      name: "食物摄影",
      nameEn: "Food Photography",
      prompt:
        "Delicious food photography, appetizing presentation, natural lighting, rustic wooden table, fresh ingredients, culinary art",
      negative: "unappetizing, artificial, poor presentation, stale",
    },
    {
      name: "时尚配件",
      nameEn: "Fashion Accessory",
      prompt:
        "Luxury fashion accessory, elegant presentation, soft lighting, premium materials, sophisticated styling, high-end photography",
      negative: "cheap, tacky, poor quality, bad lighting",
    },
  ],
  avatar: [
    {
      name: "卡通头像",
      nameEn: "Cartoon Avatar",
      prompt:
        "Cute cartoon avatar, friendly expression, bright colors, simple design, digital art style, character illustration",
      negative: "realistic, scary, dark, complex details",
    },
    {
      name: "专业头像",
      nameEn: "Professional Avatar",
      prompt:
        "Professional avatar illustration, clean design, business appropriate, friendly appearance, digital portrait style",
      negative: "casual, unprofessional, cartoon, childish",
    },
    {
      name: "游戏头像",
      nameEn: "Gaming Avatar",
      prompt:
        "Cool gaming avatar, dynamic pose, vibrant colors, digital art style, character design, fantasy elements",
      negative: "boring, static, dull colors, realistic",
    },
    {
      name: "简约头像",
      nameEn: "Minimalist Avatar",
      prompt:
        "Minimalist avatar design, simple shapes, clean lines, modern style, geometric elements, vector art style",
      negative: "complex, detailed, cluttered, realistic",
    },
  ],
  anime: [
    {
      name: "动漫少女",
      nameEn: "Anime Girl",
      prompt:
        "Beautiful anime girl, large expressive eyes, colorful hair, cute outfit, manga style, high quality digital art, detailed illustration",
      negative: "realistic, western style, low quality, blurry",
    },
    {
      name: "动漫男主",
      nameEn: "Anime Boy",
      prompt:
        "Handsome anime boy, cool expression, stylish hair, detailed clothing, manga art style, professional illustration",
      negative: "realistic, ugly, poor quality, western cartoon",
    },
    {
      name: "赛博朋克",
      nameEn: "Cyberpunk Anime",
      prompt:
        "Cyberpunk anime character, neon lights, futuristic city background, high-tech outfit, dynamic pose, detailed digital art",
      negative: "medieval, fantasy, low-tech, boring background",
    },
    {
      name: "魔法少女",
      nameEn: "Magical Girl",
      prompt:
        "Magical girl anime character, sparkles and stars, colorful magical outfit, wand or staff, fantasy background, kawaii style",
      negative: "realistic, dark, scary, non-magical",
    },
  ],
  logo: [
    {
      name: "现代Logo",
      nameEn: "Modern Logo",
      prompt:
        "Modern minimalist logo design, clean typography, professional branding, vector style, simple geometric shapes, corporate identity",
      negative: "cluttered, outdated, amateur, complex details",
    },
    {
      name: "科技Logo",
      nameEn: "Tech Logo",
      prompt:
        "Technology company logo, futuristic design, digital elements, blue and silver colors, innovative concept, professional branding",
      negative: "old-fashioned, analog, warm colors, traditional",
    },
    {
      name: "创意海报",
      nameEn: "Creative Poster",
      prompt:
        "Creative poster design, bold typography, vibrant colors, artistic composition, modern layout, eye-catching graphics",
      negative: "boring, monochrome, poor composition, amateur",
    },
    {
      name: "品牌标识",
      nameEn: "Brand Identity",
      prompt:
        "Professional brand identity design, memorable symbol, balanced composition, premium quality, versatile logo, corporate branding",
      negative: "generic, amateur, unbalanced, low quality",
    },
  ],
};

class PromptTemplateManager {
  constructor() {
    this.isModalOpen = false;
    this.init();
  }

  init() {
    this.createTemplateModal();
    this.bindEvents();
  }

  createTemplateModal() {
    // 创建模态框HTML
    const modalHTML = `
            <div id="template-modal" class="template-modal" style="display: none;">
                <div class="template-modal-content">
                    <div class="template-modal-header">
                        <h2 data-i18n="promptTemplateTitle">常用提示词模板</h2>
                        <button class="template-modal-close">&times;</button>
                    </div>
                    <div class="template-modal-body">
                        <div class="template-categories">
                            <button class="template-category active" data-category="landscape" data-i18n="templateCategories.landscape">风景</button>
                            <button class="template-category" data-category="portrait" data-i18n="templateCategories.portrait">人像</button>
                            <button class="template-category" data-category="product" data-i18n="templateCategories.product">产品拍摄</button>
                            <button class="template-category" data-category="avatar" data-i18n="templateCategories.avatar">头像</button>
                            <button class="template-category" data-category="anime" data-i18n="templateCategories.anime">二次元</button>
                            <button class="template-category" data-category="logo" data-i18n="templateCategories.logo">Logo/海报</button>
                        </div>
                        <div class="template-list" id="template-list">
                            <!-- 模板列表将动态生成 -->
                        </div>
                    </div>
                </div>
            </div>
        `;

    // 添加到页面
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // 添加样式
    this.addModalStyles();

    // 初始加载第一个分类的模板
    this.loadTemplates("landscape");
  }

  addModalStyles() {
    const style = document.createElement("style");
    style.textContent = `
            .template-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                backdrop-filter: blur(5px);
            }

            .template-modal-content {
                background: #1a1f2e;
                border-radius: 16px;
                width: 90%;
                max-width: 800px;
                max-height: 80vh;
                overflow: hidden;
                border: 1px solid var(--color-accent-border-strong, #273548);
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
            }

            .template-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 24px;
                border-bottom: 1px solid var(--color-accent-border-strong, #273548);
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }

            .template-modal-header h2 {
                margin: 0;
                color: var(--color-surface-on-light-white, #fff);
                font-size: 1.25rem;
            }

            .template-modal-close {
                background: none;
                border: none;
                color: var(--color-surface-on-light-white, #fff);
                font-size: 1.5rem;
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 4px;
                transition: background 0.2s;
            }

            .template-modal-close:hover {
                background: rgba(255, 255, 255, 0.1);
            }

            .template-modal-body {
                padding: 0;
                overflow-y: auto;
                max-height: calc(80vh - 80px);
            }

            .template-categories {
                display: flex;
                padding: 16px 24px 0;
                gap: 8px;
                flex-wrap: wrap;
                border-bottom: 1px solid var(--color-accent-border-strong, #273548);
                background: #151c29;
            }

            .template-category {
                padding: 8px 16px;
                background: transparent;
                border: 1px solid var(--color-accent-border-strong, #273548);
                color: #AAB4D4;
                border-radius: 20px;
                cursor: pointer;
                font-size: 0.875rem;
                transition: all 0.3s ease;
                margin-bottom: 16px;
            }

            .template-category:hover {
                border-color: var(--color-cta-primary, #4f46e5);
                color: var(--color-cta-primary, #4f46e5);
            }

            .template-category.active {
                background: var(--color-cta-primary, #4f46e5);
                border-color: var(--color-cta-primary, #4f46e5);
                color: var(--color-surface-on-light-white, #fff);
            }

            .template-list {
                padding: 24px;
            }

            .template-item {
                background: rgba(15, 23, 42, 0.8);
                border: 1px solid var(--color-accent-border-strong, #273548);
                border-radius: 12px;
                padding: 16px;
                margin-bottom: 16px;
                transition: all 0.3s ease;
            }

            .template-item:hover {
                border-color: var(--color-cta-primary, #4f46e5);
                transform: translateY(-2px);
                box-shadow: 0 8px 24px rgba(79, 70, 229, 0.1);
            }

            .template-item-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
            }

            .template-item-name {
                font-weight: 600;
                color: var(--color-text-verylight, #e5e7eb);
                font-size: 1rem;
            }

            .template-use-btn {
                background: var(--color-cta-primary, #4f46e5);
                color: var(--color-surface-on-light-white, #fff);
                border: none;
                padding: 6px 12px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 0.875rem;
                transition: all 0.2s;
            }

            .template-use-btn:hover {
                background: var(--color-cta-primary-dark, #4338ca);
                transform: translateY(-1px);
            }

            .template-prompt {
                color: #d1d5db;
                font-size: 0.875rem;
                line-height: 1.4;
                margin-bottom: 8px;
                font-family: 'Courier New', monospace;
                background: rgba(0, 0, 0, 0.2);
                padding: 8px;
                border-radius: 6px;
                border-left: 3px solid var(--color-cta-primary, #4f46e5);
            }

            .template-negative {
                color: #fca5a5;
                font-size: 0.75rem;
                font-family: 'Courier New', monospace;
                background: rgba(239, 68, 68, 0.1);
                padding: 6px 8px;
                border-radius: 4px;
                border-left: 3px solid #ef4444;
            }

            .template-negative-label {
                color: #ef4444;
                font-weight: 500;
                margin-right: 4px;
            }

            @media (max-width: 768px) {
                .template-modal-content {
                    width: 95%;
                    max-height: 90vh;
                }

                .template-categories {
                    padding: 12px 16px 0;
                }

                .template-list {
                    padding: 16px;
                }

                .template-item-header {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 8px;
                }
            }
        `;
    document.head.appendChild(style);
  }

  bindEvents() {
    // 模板按钮点击事件
    const templateBtn = document.getElementById("template-btn");
    if (templateBtn) {
      templateBtn.addEventListener("click", () => this.showModal());
    }

    // 模态框关闭事件
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("template-modal-close")) {
        this.hideModal();
      }
      if (e.target.id === "template-modal") {
        this.hideModal();
      }
    });

    // ESC键关闭
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isModalOpen) {
        this.hideModal();
      }
    });

    // 分类切换事件
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("template-category")) {
        const category = e.target.dataset.category;
        this.switchCategory(category);
      }
    });

    // 使用模板事件
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("template-use-btn")) {
        const templateData = JSON.parse(e.target.dataset.template);
        this.useTemplate(templateData);
      }
    });
  }

  showModal() {
    const modal = document.getElementById("template-modal");
    if (modal) {
      modal.style.display = "flex";
      this.isModalOpen = true;
      document.body.style.overflow = "hidden";

      // 应用当前语言
      if (typeof setLanguage === "function" && typeof getCurrentLang === "function") {
        setLanguage(getCurrentLang());
      }
    }
  }

  hideModal() {
    const modal = document.getElementById("template-modal");
    if (modal) {
      modal.style.display = "none";
      this.isModalOpen = false;
      document.body.style.overflow = "";
    }
  }

  switchCategory(category) {
    // 更新分类按钮状态
    document.querySelectorAll(".template-category").forEach((btn) => {
      btn.classList.remove("active");
    });
    document.querySelector(`[data-category="${category}"]`).classList.add("active");

    // 加载对应分类的模板
    this.loadTemplates(category);
  }

  loadTemplates(category) {
    const templateList = document.getElementById("template-list");
    if (!templateList) return;

    const templates = PROMPT_TEMPLATES[category] || [];
    const currentLang = getCurrentLang();

    templateList.innerHTML = templates
      .map(
        (template) => `
            <div class="template-item">
                <div class="template-item-header">
                    <div class="template-item-name">
                        ${currentLang === "zh" ? template.name : template.nameEn}
                    </div>
                    <button class="template-use-btn" 
                            data-template='${JSON.stringify(template)}' 
                            data-i18n="useTemplate">使用模板</button>
                </div>
                <div class="template-prompt">${template.prompt}</div>
                ${
                  template.negative
                    ? `
                    <div class="template-negative">
                        <span class="template-negative-label">Negative:</span>${template.negative}
                    </div>
                `
                    : ""
                }
            </div>
        `
      )
      .join("");

    // 应用翻译
    if (typeof setLanguage === "function" && typeof getCurrentLang === "function") {
      setLanguage(getCurrentLang());
    }
  }

  useTemplate(template) {
    const textInput = document.getElementById("text-input");
    const negativeInput = document.getElementById("negative-prompt");

    if (textInput) {
      textInput.value = template.prompt;
      textInput.focus();
    }

    if (negativeInput && template.negative) {
      negativeInput.value = template.negative;
    }

    // 显示成功消息
    if (window.authManager && window.authManager.showMessage) {
      window.authManager.showMessage(t("templateApplied") || "模板已应用", "success");
    }

    // 关闭模态框
    this.hideModal();
  }
}

// 创建全局实例
window.promptTemplateManager = new PromptTemplateManager();

// 确保在DOM加载完成后初始化
document.addEventListener("DOMContentLoaded", () => {
  if (!window.promptTemplateManager) {
    window.promptTemplateManager = new PromptTemplateManager();
  }
});
