/**
 * 前端高清图片管理器
 * 实现图片保存、查看、下载等功能
 * 运行环境：无打包直接引入（no-bundler），通过 window 全局使用
 */

class HDImageManager {
  constructor() {
    this.maxImagesPerDay = 3;
    this.maxImageSize = 2 * 1024 * 1024; // 2MB
    // 与 auth.js 一致：优先 window.API_BASE，其次生产 Worker，最后相对路径
    const apiBase = (window.APP_CONFIG && window.APP_CONFIG.API_BASE) || window.API_BASE || "";
    this.baseUrl = apiBase.endsWith("/api") ? apiBase : `${apiBase}/api`;
    this.currentImageId = null;
    this._statsTimerId = null;
    this._authListenerBound = false;

    try {
      if (window.DEBUG) console.log("HDImageManager 初始化");
    } catch (_) {}
    // 初始化
    this.init();
    // 监听登录状态变化，登录完成后自动加载
    this.setupAuthListener();
  }

  /**
   * 初始化
   */
  init() {
    // 检查认证状态
    if (!window.authManager || !window.authManager.isLoggedIn()) {
      // 静默等待认证事件驱动再初始化，避免刷新时噪声日志
      return;
    }

    // 等待 UI 容器注入完成后再加载
    this.ensureUiReadyThenLoad();

    // 设置定时器（灰度可调），避免重复设置
    if (!this._statsTimerId) {
      const getIntervalMs = () => {
        try {
          // 允许 window.HD_STATS_POLL_INTERVAL_MS 或 localStorage 覆盖；0 表示关闭
          const g =
            typeof window !== "undefined" && typeof window.HD_STATS_POLL_INTERVAL_MS !== "undefined"
              ? Number(window.HD_STATS_POLL_INTERVAL_MS)
              : undefined;
          const ls =
            typeof localStorage !== "undefined"
              ? Number(localStorage.getItem("hd_stats_poll_ms"))
              : undefined;
          const v =
            typeof g === "number" && !isNaN(g)
              ? g
              : typeof ls === "number" && !isNaN(ls)
                ? ls
                : 3600000;
          return Math.max(0, v);
        } catch (_) {
          return 3600000;
        }
      };
      const interval = getIntervalMs();
      if (interval > 0) {
        this._statsTimerId = setInterval(() => {
          this.updateStats();
        }, interval);
      }
    }
  }

  /**
   * 监听认证状态变化，认证成功后自动初始化图片模块
   */
  setupAuthListener() {
    if (this._authListenerBound) return;
    const handler = (evt) => {
      try {
        const loggedIn =
          evt && evt.detail && typeof evt.detail.isAuthenticated === "boolean"
            ? evt.detail.isAuthenticated
            : window.authManager && window.authManager.isLoggedIn
              ? window.authManager.isLoggedIn()
              : false;
        if (loggedIn) {
          // 登录完成后立即加载
          this.init();
        }
      } catch (_) {}
    };
    try {
      // 同时兼容两种事件名
      window.addEventListener("authChanged", handler);
      window.addEventListener("auth-changed", handler);
      this._authListenerBound = true;
    } catch (_) {}
    // 兜底：页面就绪后再次检查一次登录状态
    try {
      document.addEventListener("DOMContentLoaded", () => {
        if (window.authManager?.isLoggedIn?.()) this.init();
      });
    } catch (_) {}
  }

  /**
   * 等待高清图片 UI 容器注入完成后再加载数据
   */
  ensureUiReadyThenLoad(maxTries = 25) {
    const hasContainers =
      !!document.getElementById("daily-images") || !!document.getElementById("image-stats");
    if (hasContainers) {
      // 加载今日图片与统计
      this.loadDailyImages();
      this.updateStats();
      return;
    }
    if (maxTries <= 0) {
      // 超时仍未注入，直接尝试加载一次（容器可能在内部创建）
      this.loadDailyImages();
      this.updateStats();
      return;
    }
    setTimeout(() => this.ensureUiReadyThenLoad(maxTries - 1), 200);
  }

  /**
   * 保存高清图片
   * @param {Object} imageData - 图片数据
   * @returns {Promise<Object>} 保存结果
   */
  async saveHDImage(imageData) {
    console.log("HDImageManager: 开始保存图片", imageData);
    try {
      // 检查认证状态
      if (!window.authManager || !window.authManager.isLoggedIn()) {
        console.error("HDImageManager: 用户未登录");
        throw new Error(t("navLogin"));
      }

      console.log("HDImageManager: 用户已登录，继续保存");

      // 检查图片大小
      const sizeInBytes = Math.ceil((imageData.data.length * 3) / 4);
      console.log("HDImageManager: 图片大小:", sizeInBytes, "bytes");
      if (sizeInBytes > this.maxImageSize) {
        throw new Error(t("hdImageTooLarge"));
      }

      // 显示保存中状态
      this.showSavingStatus(t("hdSaving"));

      const requestData = {
        prompt: imageData.prompt,
        data: imageData.data, // 原始高清数据
        width: imageData.width,
        height: imageData.height,
        seed: imageData.seed,
        model: imageData.model,
        negative: imageData.negative,
      };

      const token = window.authManager.getToken();
      console.log("HDImageManager: 发送保存请求", {
        url: `${this.baseUrl}/images/save`,
        data: { ...requestData, data: requestData.data.substring(0, 50) + "..." },
      });

      // 发送到后端
      const response = await fetch(`${this.baseUrl}/images/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt: imageData.prompt,
          data: imageData.data, // 原始高清数据
          width: imageData.width,
          height: imageData.height,
          seed: imageData.seed,
          model: imageData.model,
          negative: imageData.negative,
        }),
      });

      const result = await response.json();
      console.log("HDImageManager: 保存响应", result);

      if (result.success) {
        this.hideSavingStatus();
        this.showMessage(t("hdImageSaved"), "success");
        console.log("HDImageManager: 图片保存成功");

        // 重新加载图片列表
        this.loadDailyImages();
        this.updateStats();

        return result;
      } else {
        console.error("HDImageManager: 保存失败", result.error);
        throw new Error(result.error || t("hdImageSaveFailed"));
      }
    } catch (error) {
      this.hideSavingStatus();
      this.showMessage(error.message, "error");
      throw error;
    }
  }

  /**
   * 获取图片列表
   * @returns {Promise<Object>} 图片列表
   */
  async getDailyImages() {
    try {
      const response = await fetch(`${this.baseUrl}/images/daily`, {
        headers: {
          Authorization: `Bearer ${window.authManager.getToken()}`,
        },
      });

      const result = await response.json();

      if (result && result.success) return result;
      // 某些部署下返回 {images:[], count,...} 无 success 标记，做兼容
      if (result && (Array.isArray(result.images) || Array.isArray(result.list))) {
        return {
          success: true,
          images: result.images || result.list,
          count: result.count || result.images?.length || 0,
          maxCount: result.maxCount || this.maxImagesPerDay,
        };
      }
      throw new Error((result && result.error) || t("hdImageListFailed"));
    } catch (error) {
      console.error("获取图片列表错误:", error);
      throw error;
    }
  }

  /**
   * 获取高清图片
   * @param {string} imageId - 图片ID
   * @returns {Promise<Object>} 图片数据
   */
  async getHDImage(imageId) {
    try {
      const response = await fetch(`${this.baseUrl}/images/${imageId}`, {
        headers: {
          Authorization: `Bearer ${window.authManager.getToken()}`,
        },
      });

      const result = await response.json();

      if (result && result.success && result.image) return result.image;
      // 兼容直接返回图片对象
      if (result && result.data && result.width && result.height) return result;
      throw new Error((result && result.error) || t("hdImageLoadError"));
    } catch (error) {
      console.error("获取高清图片错误:", error);
      throw error;
    }
  }

  /**
   * 下载高清图片
   * @param {string} imageId - 图片ID
   */
  async downloadHDImage(imageId) {
    try {
      this.showMessage(t("hdImagePrepareDownload"), "info");

      const response = await fetch(`${this.baseUrl}/images/download/${imageId}`, {
        headers: {
          Authorization: `Bearer ${window.authManager.getToken()}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `image_${imageId}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        this.showMessage(t("hdImageDownloadSuccess"), "success");
      } else {
        const error = await response.json();
        throw new Error(error.error || t("hdImageDownloadFailed"));
      }
    } catch (error) {
      this.showMessage(error.message, "error");
    }
  }

  /**
   * 删除图片
   * @param {string} imageId - 图片ID
   */
  async deleteImage(imageId) {
    try {
      if (!confirm(t("hdImageDeleteConfirm"))) {
        return;
      }

      const response = await fetch(`${this.baseUrl}/images/${imageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${window.authManager.getToken()}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        this.showMessage(t("hdImageDeleted"), "success");
        this.loadDailyImages();
        this.updateStats();
      } else {
        throw new Error(result.error || t("hdImageDeleteFailed"));
      }
    } catch (error) {
      this.showMessage(error.message, "error");
    }
  }

  /**
   * 加载今日图片
   */
  async loadDailyImages() {
    try {
      const result = await this.getDailyImages();
      this.renderImageGrid(result.images);
      this.updateImageCount(result.count, result.maxCount);
    } catch (error) {
      console.error("加载今日图片错误:", error);
      this.showMessage(t("hdImageLoadFailed"), "error");
    }
  }

  /**
   * 渲染图片网格
   * @param {Array} images - 图片列表
   */
  renderImageGrid(images) {
    const container = document.getElementById("daily-images");
    if (!container) return;

    container.innerHTML = "";

    if (images.length === 0) {
      container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📷</div>
                    <h3>${t("hdEmptyTitle")}</h3>
                    <p>${t("hdEmptyDesc")}</p>
                </div>
            `;
      return;
    }

    images.forEach((image) => {
      const imageCard = this.createImageCard(image);
      container.appendChild(imageCard);
    });
  }

  /**
   * 创建图片卡片
   * @param {Object} image - 图片信息
   * @returns {HTMLElement} 图片卡片元素
   */
  createImageCard(image) {
    const card = document.createElement("div");
    card.className = "image-card";
    card.innerHTML = `
            <div class="image-preview">
                <img class="thumb" alt="${t("hdImageThumbnail")}" style="display:none;"/>
                    <div class="image-placeholder" data-image-id="${image.id}">
                    <div class="loading-spinner"></div>
                    <span>${t("hdClickToView")}</span>
                </div>
            </div>
            <div class="image-info">
                <h3 class="image-prompt">${this.truncateText(image.prompt, 50)}</h3>
                <div class="image-meta">
                    <span class="meta-item">${image.width}×${image.height}</span>
                    <span class="meta-item">${image.model}</span>
                    <span class="meta-item">${(image.size / 1024 / 1024).toFixed(2)}MB</span>
                </div>
                <div class="image-time">
                    ${new Date(image.created_at).toLocaleString()}
                </div>
            </div>
            <div class="image-actions">
                    <button onclick="hdImageManager.viewImage('${image.id}')" class="btn btn-primary btn-small">
                        <span class="btn-icon">👁️</span>${t("view")}
                </button>
                    <button onclick="hdImageManager.downloadHDImage('${image.id}')" class="btn btn-outline btn-small">
                        <span class="btn-icon">⬇️</span>${t("download")}
                </button>
                    <button onclick="hdImageManager.deleteImage('${image.id}')" class="btn btn-danger btn-small">
                        <span class="btn-icon">🗑️</span>${t("delete")}
                </button>
            </div>
        `;

    // 点击查看高清
    const preview = card.querySelector(".image-preview");
    preview.addEventListener("click", () => this.viewImage(image.id));

    // 异步加载缩略图（每日最多3张，直接用高清数据即可）
    this.getHDImage(image.id)
      .then((imgData) => {
        const imgEl = card.querySelector(".thumb");
        const ph = card.querySelector(".image-placeholder");
        if (imgEl && imgData && imgData.data) {
          imgEl.src = `data:image/jpeg;base64,${imgData.data}`;
          imgEl.style.display = "block";
          if (ph) ph.style.display = "none";
        }
      })
      .catch(() => {
        /* 忽略缩略图错误，保留占位 */
      });

    return card;
  }

  /**
   * 查看高清图片
   * @param {string} imageId - 图片ID
   */
  async viewImage(imageId) {
    try {
      this.showLoading(t("hdImageLoadingHD"));

      const result = await this.getHDImage(imageId);
      this.currentImageId = imageId;

      // 显示高清图片模态框
      this.showImageModal(result);

      this.hideLoading();
    } catch (error) {
      this.hideLoading();
      this.showMessage(error.message, "error");
    }
  }

  /**
   * 显示图片模态框
   * @param {Object} imageData - 图片数据
   */
  showImageModal(imageData) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const modalCaption = document.getElementById("modalCaption");
    const modalInfo = document.getElementById("modalInfo");

    modalImg.src = `data:image/jpeg;base64,${imageData.data}`;
    modalCaption.textContent = imageData.prompt;
    modalInfo.innerHTML = `
            <div class="modal-info-item">
                <span class="info-label">${t("hdLabelSize")}</span>
                <span class="info-value">${imageData.width}×${imageData.height}</span>
            </div>
            <div class="modal-info-item">
                <span class="info-label">${t("hdLabelModel")}</span>
                <span class="info-value">${imageData.model}</span>
            </div>
            <div class="modal-info-item">
                <span class="info-label">${t("hdLabelSeed")}</span>
                <span class="info-value">${imageData.seed}</span>
            </div>
            <div class="modal-info-item">
                <span class="info-label">${t("hdLabelTime")}</span>
                <span class="info-value">${new Date(imageData.created_at).toLocaleString()}</span>
            </div>
        `;

    modal.style.display = "block";
  }

  /**
   * 更新统计信息
   */
  async updateStats() {
    try {
      const response = await fetch(`${this.baseUrl}/images/stats`, {
        headers: {
          Authorization: `Bearer ${window.authManager.getToken()}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        this.renderStats(result.stats);
      }
    } catch (error) {
      console.error("更新统计信息错误:", error);
    }
  }

  /**
   * 渲染统计信息
   * @param {Object} stats - 统计信息
   */
  renderStats(stats) {
    const statsContainer = document.getElementById("image-stats");
    if (!statsContainer) return;

    const remainingTime = this.calculateRemainingTime();

    statsContainer.innerHTML = `
            <div class="stat-item">
                <span class="stat-label">${t("hdGeneratedLabel")}</span>
                <span class="stat-value">${stats.totalImages}/${stats.maxImages}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">${t("hdRemainingTimeLabel")}</span>
                <span class="stat-value">${remainingTime}</span>
            </div>
        `;
  }

  /**
   * 计算剩余时间
   * @returns {string} 剩余时间字符串
   */
  calculateRemainingTime() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const diff = tomorrow - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  /**
   * 更新图片数量显示
   * @param {number} count - 当前数量
   * @param {number} maxCount - 最大数量
   */
  updateImageCount(count, maxCount) {
    const countElement = document.getElementById("imageCount");
    if (countElement) {
      countElement.textContent = `${count}/${maxCount}`;
    }
  }

  /**
   * 截断文本
   * @param {string} text - 原文本
   * @param {number} maxLength - 最大长度
   * @returns {string} 截断后的文本
   */
  truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  }

  /**
   * 显示消息
   * @param {string} message - 消息内容
   * @param {string} type - 消息类型
   */
  showMessage(message, type = "info") {
    if (window.authManager && window.authManager.showMessage) {
      window.authManager.showMessage(message, type);
    } else {
      console.log(`[${type.toUpperCase()}] ${message}`);
    }
  }

  /**
   * 显示保存状态
   * @param {string} message - 状态消息
   */
  showSavingStatus(message) {
    const statusEl = document.getElementById("saving-status");
    if (statusEl) {
      statusEl.textContent = message;
      statusEl.style.display = "block";
    }
  }

  /**
   * 隐藏保存状态
   */
  hideSavingStatus() {
    const statusEl = document.getElementById("saving-status");
    if (statusEl) {
      statusEl.style.display = "none";
    }
  }

  /**
   * 显示加载状态
   * @param {string} message - 加载消息
   */
  showLoading(message) {
    const loadingEl = document.getElementById("loading-overlay");
    if (loadingEl) {
      loadingEl.querySelector(".loading-message").textContent = message;
      loadingEl.style.display = "flex";
    }
  }

  /**
   * 隐藏加载状态
   */
  hideLoading() {
    const loadingEl = document.getElementById("loading-overlay");
    if (loadingEl) {
      loadingEl.style.display = "none";
    }
  }
}

// 创建全局实例
const hdImageManager = new HDImageManager();

// 导出供其他模块使用
window.hdImageManager = hdImageManager;
