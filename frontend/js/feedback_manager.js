/**
 * 反馈管理器
 * 处理用户反馈的提交和显示
 * 运行环境：无打包直接引入（no-bundler），通过 window 全局使用
 */

class FeedbackManager {
  constructor() {
    // 优先使用全局配置，其次使用生产Worker地址，最后回退相对路径
    const apiBase = window.API_BASE || "https://text2image-api.peyoba660703.workers.dev";
    // 统一以 /api 结尾，确保后续拼接 /feedback/*
    this.baseUrl = apiBase.endsWith("/api") ? apiBase : `${apiBase}/api`;
    this.isInitialized = false;
  }

  /**
   * 初始化反馈管理器
   */
  init() {
    if (this.isInitialized) return;

    // 检查认证状态
    if (!window.authManager || !window.authManager.isLoggedIn()) {
      // 静默等待认证事件驱动再初始化
      this.setupAuthListener();
      return;
    }

    this.setupEventListeners();
    this.loadFeedbackList();
    this.isInitialized = true;

    console.log("FeedbackManager 初始化完成");
  }

  /**
   * 监听认证状态变化
   */
  setupAuthListener() {
    const handler = (event) => {
      const isAuthenticated = event?.detail?.isAuthenticated
        ? event.detail.isAuthenticated
        : window.authManager && window.authManager.isLoggedIn
          ? window.authManager.isLoggedIn()
          : false;
      if (isAuthenticated && !this.isInitialized) {
        this.init();
      }
    };

    try {
      // 同时兼容两种事件名
      window.addEventListener("authChanged", handler);
      window.addEventListener("auth-changed", handler);
    } catch (_) {}
  }

  /**
   * 设置事件监听器
   */
  setupEventListeners() {
    // 反馈表单提交
    const feedbackForm = document.getElementById("feedback-form");
    if (feedbackForm) {
      feedbackForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleFeedbackSubmit(e);
      });
    }

    // 内容计数器
    const contentTextarea = document.getElementById("feedback-content");
    const counter = document.getElementById("content-counter");
    if (contentTextarea && counter) {
      contentTextarea.addEventListener("input", () => {
        const length = contentTextarea.value.length;
        counter.textContent = length;

        // 字符数接近上限时改变颜色
        if (length > 900) {
          counter.style.color = "#ef4444";
        } else if (length > 800) {
          counter.style.color = "#f59e0b";
        } else {
          counter.style.color = "#94a3b8";
        }
      });
    }
  }

  /**
   * 处理反馈提交
   */
  async handleFeedbackSubmit(event) {
    const form = event.target;
    const formData = new FormData(form);
    const category = formData.get("category");
    const content = formData.get("content")?.trim();

    // 客户端验证
    if (!content) {
      this.showMessage(t("feedbackEmpty"), "error");
      return;
    }

    if (content.length > 1000) {
      this.showMessage(t("feedbackTooLong"), "error");
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    try {
      // 禁用提交按钮
      submitButton.disabled = true;
      submitButton.textContent = t("processing") || "提交中...";

      const response = await fetch(`${this.baseUrl}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.authManager.getToken()}`,
        },
        body: JSON.stringify({
          category: category,
          content: content,
        }),
      });

      const result = await response.json();

      if (result.success) {
        this.showMessage(result.message || t("feedbackSuccess"), "success");
        form.reset();
        document.getElementById("content-counter").textContent = "0";
        document.getElementById("content-counter").style.color = "#94a3b8";

        // 重新加载反馈列表
        this.loadFeedbackList();
      } else {
        this.showMessage(result.error || t("feedbackError"), "error");
      }
    } catch (error) {
      console.error("提交反馈时出错:", error);
      this.showMessage(t("feedbackError"), "error");
    } finally {
      // 恢复提交按钮
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  }

  /**
   * 加载反馈列表
   */
  async loadFeedbackList() {
    const loadingEl = document.getElementById("feedback-loading");
    const emptyEl = document.getElementById("feedback-empty");
    const containerEl = document.getElementById("feedback-list-container");

    if (!containerEl) return;

    try {
      // 显示加载状态
      if (loadingEl) loadingEl.style.display = "flex";
      if (emptyEl) emptyEl.style.display = "none";
      containerEl.innerHTML = "";

      const response = await fetch(`${this.baseUrl}/feedback/my`, {
        headers: {
          Authorization: `Bearer ${window.authManager.getToken()}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        if (loadingEl) loadingEl.style.display = "none";

        if (result.feedbacks && result.feedbacks.length > 0) {
          this.renderFeedbackList(result.feedbacks);
        } else {
          if (emptyEl) emptyEl.style.display = "block";
        }
      } else {
        throw new Error(result.error || "获取反馈列表失败");
      }
    } catch (error) {
      console.error("加载反馈列表时出错:", error);
      if (loadingEl) loadingEl.style.display = "none";
      this.showMessage("加载反馈列表失败", "error");
    }
  }

  /**
   * 渲染反馈列表
   */
  renderFeedbackList(feedbacks) {
    const container = document.getElementById("feedback-list-container");
    if (!container) return;

    container.innerHTML = "";

    feedbacks.forEach((feedback) => {
      const feedbackEl = this.createFeedbackElement(feedback);
      container.appendChild(feedbackEl);
    });
  }

  /**
   * 创建反馈元素
   */
  createFeedbackElement(feedback) {
    const div = document.createElement("div");
    div.className = "feedback-item";

    const categoryText = this.getCategoryText(feedback.category);
    const statusText = this.getStatusText(feedback.status);
    const timeText = this.formatTime(feedback.created_at);

    div.innerHTML = `
            <div class="feedback-header">
                <span class="feedback-category">${categoryText}</span>
                <span class="feedback-status ${feedback.status}">${statusText}</span>
            </div>
            <div class="feedback-content">${this.escapeHtml(feedback.content)}</div>
            <div class="feedback-time">${timeText}</div>
        `;

    return div;
  }

  /**
   * 获取类别文本
   */
  getCategoryText(category) {
    const categories = {
      bug: t("feedbackCategories.bug") || "问题反馈",
      feature: t("feedbackCategories.feature") || "功能建议",
      improvement: t("feedbackCategories.improvement") || "体验改进",
      other: t("feedbackCategories.other") || "其他",
    };
    return categories[category] || category;
  }

  /**
   * 获取状态文本
   */
  getStatusText(status) {
    const statuses = {
      pending: t("feedbackPending") || "待处理",
      processed: t("feedbackProcessed") || "已处理",
    };
    return statuses[status] || status;
  }

  /**
   * 格式化时间
   */
  formatTime(timeString) {
    try {
      const date = new Date(timeString);
      const now = new Date();
      const diffMs = now - date;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // 今天
        return date.toLocaleTimeString("zh-CN", {
          hour: "2-digit",
          minute: "2-digit",
        });
      } else if (diffDays === 1) {
        // 昨天
        return getCurrentLang() === "zh" ? "昨天" : "Yesterday";
      } else if (diffDays < 7) {
        // 一周内
        return `${diffDays}${getCurrentLang() === "zh" ? "天前" : " days ago"}`;
      } else {
        // 超过一周显示具体日期
        return date.toLocaleDateString("zh-CN");
      }
    } catch (e) {
      return timeString;
    }
  }

  /**
   * HTML转义
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * 显示消息
   */
  showMessage(message, type = "info") {
    if (window.authManager && window.authManager.showMessage) {
      window.authManager.showMessage(message, type);
    } else {
      // 回退到alert
      alert(message);
    }
  }
}

// 创建全局实例
window.feedbackManager = new FeedbackManager();

// 页面加载完成后尝试初始化
document.addEventListener("DOMContentLoaded", () => {
  if (window.authManager && window.authManager.isLoggedIn && window.authManager.isLoggedIn()) {
    window.feedbackManager.init();
  }
});
