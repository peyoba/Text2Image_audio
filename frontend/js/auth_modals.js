/**
 * 认证模态框脚本：负责绑定登录/注册表单事件
 * 注意：该脚本与 `auth-modals.html` 配合使用
 * 运行环境：无打包直接引入（no-bundler），通过 window 全局使用
 */

let isSubmittingLogin = false;
let isSubmittingRegister = false;

function setSubmitting(formEl, submitting) {
  const btn = formEl?.querySelector('button[type="submit"]');
  if (btn) {
    btn.disabled = submitting;
    btn.textContent = submitting ? t("processing") : btn.dataset.originText || t("submit");
  }
}

function initAuthForms() {
  // 登录表单
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    const btn = loginForm.querySelector('button[type="submit"]');
    if (btn && !btn.dataset.originText) btn.dataset.originText = btn.textContent;
    loginForm.addEventListener("submit", handleLoginSubmit);
  }

  // 注册表单
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", handleRegisterSubmit);
    // 即时校验：显示密码规则提示
    const pwd = document.getElementById("registerPassword");
    if (pwd) {
      pwd.addEventListener("input", () => {
        const ok = pwd.value && pwd.value.length >= 6; // 降级为长度校验，避免浏览器对pattern差异
        pwd.setCustomValidity(ok ? "" : t("passwordMinLength"));
      });
    }
    const btn = registerForm.querySelector('button[type="submit"]');
    if (btn && !btn.dataset.originText) btn.dataset.originText = btn.textContent;
  }

  // 忘记密码表单
  const forgotPasswordForm = document.getElementById("forgotPasswordForm");
  if (forgotPasswordForm) {
    const btn = forgotPasswordForm.querySelector('button[type="submit"]');
    if (btn && !btn.dataset.originText) btn.dataset.originText = btn.textContent;
    forgotPasswordForm.addEventListener("submit", handleForgotPasswordSubmit);
  }

  // 重置密码表单
  const resetPasswordForm = document.getElementById("resetPasswordForm");
  if (resetPasswordForm) {
    const btn = resetPasswordForm.querySelector('button[type="submit"]');
    if (btn && !btn.dataset.originText) btn.dataset.originText = btn.textContent;
    resetPasswordForm.addEventListener("submit", handleResetPasswordSubmit);

    // 确认密码验证
    const newPwd = document.getElementById("newPassword");
    const confirmPwd = document.getElementById("confirmNewPassword");
    if (newPwd && confirmPwd) {
      const validatePassword = () => {
        if (confirmPwd.value && newPwd.value !== confirmPwd.value) {
          confirmPwd.setCustomValidity(t("passwordMismatch"));
        } else {
          confirmPwd.setCustomValidity("");
        }
      };
      newPwd.addEventListener("input", validatePassword);
      confirmPwd.addEventListener("input", validatePassword);
    }
  }

  // Google登录按钮
  const googleLoginBtn = document.getElementById("googleLoginBtn");
  if (googleLoginBtn) {
    googleLoginBtn.addEventListener("click", handleGoogleLogin);
  }
}

async function handleLoginSubmit(e) {
  e.preventDefault();
  if (isSubmittingLogin) return;
  try {
    const form = e.target;
    const formData = new FormData(form);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    if (!email || !password || password.length < 6) {
      window.authManager?.showMessage(t("fillEmailPassword"), "error");
      return;
    }
    const credentials = { email, password };
    isSubmittingLogin = true;
    setSubmitting(form, true);
    const result = await window.authManager.login(credentials);
    if (result.success) {
      if (typeof closeModal === "function") closeModal("loginModal");
      form.reset();
    }
    if (!result.success) {
      window.authManager?.showMessage(result.message || t("loginFailed"), "error");
      console.error("Login failed payload:", credentials.email);
    }
  } catch (err) {
    console.error("登录失败: ", err);
    window.authManager?.showMessage(t("networkError"), "error");
  } finally {
    isSubmittingLogin = false;
    setSubmitting(e.target, false);
  }
}

async function handleRegisterSubmit(e) {
  e.preventDefault();
  if (isSubmittingRegister) return;
  try {
    const form = e.target;
    const formData = new FormData(form);
    const username = String(formData.get("username") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");
    if (password !== confirmPassword) {
      window.authManager?.showMessage(t("passwordMismatch"), "error");
      return;
    }
    if (!password || password.length < 6) {
      window.authManager?.showMessage("密码需至少6位", "error");
      return;
    }
    if (!username || !email) {
      window.authManager?.showMessage("请输入用户名与邮箱", "error");
      return;
    }
    const userData = { username, email, password };
    const result = await window.authManager.register(userData);
    if (result.success) {
      if (typeof closeModal === "function") closeModal("registerModal");
      form.reset();
    }
    if (!result.success) {
      window.authManager?.showMessage(result.message || "注册失败", "error");
      console.error("Register failed payload:", { username, email });
    }
  } catch (err) {
    console.error("注册失败: ", err);
    window.authManager?.showMessage("注册失败，请稍后重试", "error");
  } finally {
    isSubmittingRegister = false;
    setSubmitting(e.target, false);
  }
}

// 点击模态框外部关闭
window.addEventListener("click", (event) => {
  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});

// 忘记密码处理函数
async function handleForgotPasswordSubmit(e) {
  e.preventDefault();
  try {
    const form = e.target;
    const formData = new FormData(form);
    const email = String(formData.get("email") || "").trim();

    if (!email) {
      window.authManager?.showMessage("请输入邮箱地址", "error");
      return;
    }

    setSubmitting(form, true);

    const result = await window.authManager?.forgotPassword(email);

    if (result?.success) {
      window.authManager?.showMessage(result.message, "success");
      closeModal("forgotPasswordModal");

      // 开发环境：显示重置链接
      if (result.resetUrl) {
        console.log("重置链接:", result.resetUrl);
        window.authManager?.showMessage(`重置链接: ${result.resetUrl}`, "info");
      }
    } else {
      window.authManager?.showMessage(result?.message || "发送失败", "error");
    }
  } catch (err) {
    console.error("忘记密码失败:", err);
    window.authManager?.showMessage("网络错误，请稍后重试", "error");
  } finally {
    setSubmitting(e.target, false);
  }
}

// 重置密码处理函数
async function handleResetPasswordSubmit(e) {
  e.preventDefault();
  try {
    const form = e.target;
    const formData = new FormData(form);
    const newPassword = String(formData.get("newPassword") || "");
    const confirmNewPassword = String(formData.get("confirmNewPassword") || "");

    if (!newPassword || newPassword.length < 6) {
      window.authManager?.showMessage("密码长度至少6位", "error");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      window.authManager?.showMessage(t("passwordMismatch"), "error");
      return;
    }

    // 从URL获取token
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (!token) {
      window.authManager?.showMessage("重置链接无效", "error");
      return;
    }

    setSubmitting(form, true);

    const result = await window.authManager?.resetPassword(token, newPassword);

    if (result?.success) {
      window.authManager?.showMessage(result.message, "success");
      closeModal("resetPasswordModal");

      // 清除URL中的token
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);

      // 显示登录模态框
      setTimeout(() => {
        showModal("loginModal");
      }, 1000);
    } else {
      window.authManager?.showMessage(result?.message || "重置失败", "error");
    }
  } catch (err) {
    console.error("重置密码失败:", err);
    window.authManager?.showMessage("网络错误，请稍后重试", "error");
  } finally {
    setSubmitting(e.target, false);
  }
}

// Google登录处理函数 - 使用OAuth 2.0弹窗模式
async function handleGoogleLogin() {
  try {
    // 直接使用OAuth 2.0弹窗，避免Google Identity Services的复杂性
    const clientId = "432588178769-n7vgnnmsh8l118heqmgtj92iir4i4n3s.apps.googleusercontent.com";
    // 动态构建回调URL，支持不同环境
    const baseUrl = window.location.origin;
    const redirectUri = `${baseUrl}/auth/google/callback`;
    const scope = "openid email profile";
    const state = Math.random().toString(36).substring(2, 15); // 随机状态参数

    console.log("Google登录配置:", { clientId, redirectUri, baseUrl });

    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${encodeURIComponent(clientId)}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(scope)}&` +
      `response_type=code&` +
      `access_type=offline&` +
      `prompt=select_account&` +
      `state=${encodeURIComponent(state)}`;

    console.log("Google授权URL:", authUrl);

    // 打开弹窗进行登录
    const popup = window.open(
      authUrl,
      "google-signin",
      "width=500,height=600,scrollbars=yes,resizable=yes"
    );

    console.log("弹窗已打开:", popup);

    if (!popup) {
      const warnMsg =
        getCurrentLang && getCurrentLang() === "zh"
          ? "检测到浏览器阻止弹窗，将在当前页面跳转至 Google 登录。"
          : "The browser blocked the popup. Redirecting to Google sign-in in this tab.";
      window.authManager?.showMessage(warnMsg, "warning");
      // 降级：直接在当前窗口打开授权页
      window.location.href = authUrl;
      return;
    }

    // 如果用户立即关闭弹窗，给予提示
    const popupWatchTimer = setInterval(() => {
      try {
        if (popup.closed) {
          clearInterval(popupWatchTimer);
          window.authManager?.showMessage(
            getCurrentLang && getCurrentLang() === "zh"
              ? "登录窗口已关闭，如需继续请允许弹窗或检查浏览器提示。"
              : "The login window was closed. Please allow popups or retry the sign-in flow.",
            "warning"
          );
        }
      } catch (_) {
        clearInterval(popupWatchTimer);
      }
    }, 1000);

    // 监听弹窗的消息
    const messageListener = (event) => {
      console.log("收到消息:", event);

      // 放宽来源校验：允许同站常见变体，避免 www/非www、端口差异导致丢消息
      try {
        const thisOrigin = window.location.origin;
        const allowed = new Set([
          thisOrigin,
          "https://aistone.org",
          "https://www.aistone.org",
          "http://localhost:5173",
          "http://127.0.0.1:5500",
        ]);
        if (!allowed.has(event.origin)) {
          console.log("消息来源不匹配，已忽略:", event.origin, "当前:", thisOrigin);
          // 不返回，继续兼容处理：仅当数据结构符合预期时也放行
        }
      } catch (_) {}

      console.log("处理Google OAuth消息:", event.data);

      if (event.data.type === "GOOGLE_AUTH_LOGIN_READY") {
        // 回调页已写入 token+user，本页只需校验并关闭弹窗
        try {
          window.authManager?.validateToken().then(() => window.authManager?.forceUpdateUI());
        } catch (_) {}
        try {
          if (typeof closeModal === "function") closeModal("loginModal");
        } catch (_) {}
        window.removeEventListener("message", messageListener);
        popup && popup.close();
        clearInterval(popupWatchTimer);
        return;
      } else if (event.data.type === "GOOGLE_AUTH_TOKEN" && event.data.token) {
        // 兜底：回调页直接把 token+user 发来
        try {
          if (window.authManager?.setToken) window.authManager.setToken(event.data.token);
          if (event.data.user && window.authManager?.setUser)
            window.authManager.setUser(event.data.user);
          window.authManager?.validateToken().then(() => window.authManager?.forceUpdateUI());
        } catch (_) {}
        try {
          if (typeof closeModal === "function") closeModal("loginModal");
        } catch (_) {}
        window.removeEventListener("message", messageListener);
        popup && popup.close();
        clearInterval(popupWatchTimer);
        return;
      } else if (event.data.type === "GOOGLE_AUTH_SUCCESS") {
        // 处理成功的Google登录
        console.log("Google授权成功，code:", event.data.code);
        handleGoogleAuthSuccess(event.data.code, state);
        popup.close();
        window.removeEventListener("message", messageListener);
        clearInterval(popupWatchTimer);
      } else if (event.data.type === "GOOGLE_AUTH_ERROR") {
        // 处理错误
        console.log("Google授权错误:", event.data.error);
        window.authManager?.showMessage(
          getCurrentLang && getCurrentLang() === "zh"
            ? "Google登录失败: " + event.data.error
            : "Google login failed: " + event.data.error,
          "error"
        );
        popup.close();
        window.removeEventListener("message", messageListener);
        clearInterval(popupWatchTimer);
      }
    };

    window.addEventListener("message", messageListener);

    // 只依赖postMessage机制，不检查popup.closed以避免COOP错误
    console.log("等待Google登录完成...");

    // 设置超时清理，防止无限等待
    setTimeout(() => {
      window.removeEventListener("message", messageListener);
      try {
        if (popup && !popup.closed) {
          popup.close();
        }
      } catch (error) {
        // 忽略可能的跨域错误
      }
      clearInterval(popupWatchTimer);
    }, 300000); // 5分钟超时
  } catch (err) {
    console.error("Google登录错误:", err);
    window.authManager?.showMessage(
      getCurrentLang && getCurrentLang() === "zh"
        ? "Google登录出现错误，请尝试使用邮箱登录"
        : "Google login error, please try email login",
      "warning"
    );
  }
}

// 处理Google授权成功
async function handleGoogleAuthSuccess(code, state) {
  try {
    // 将授权码发送到后端进行token交换
    const result = await window.authManager?.googleAuthCodeLogin(code, state);

    if (result?.success) {
      window.authManager?.showMessage(result.message, "success");
      closeModal("loginModal");
    } else {
      window.authManager?.showMessage(result?.message || "Google登录失败", "error");
    }
  } catch (err) {
    console.error("Google授权处理错误:", err);
    window.authManager?.showMessage(
      getCurrentLang && getCurrentLang() === "zh"
        ? "Google登录处理失败，请稍后重试"
        : "Google login processing failed, please try again later",
      "error"
    );
  }
}

// Google登录回调函数
window.handleGoogleCredentialResponse = async function (response) {
  try {
    const result = await window.authManager?.googleLogin(response.credential);

    if (result?.success) {
      window.authManager?.showMessage(result.message, "success");
      closeModal("loginModal");
    } else {
      window.authManager?.showMessage(result?.message || "Google登录失败", "error");
    }
  } catch (err) {
    console.error("Google登录回调错误:", err);
    window.authManager?.showMessage(
      getCurrentLang && getCurrentLang() === "zh"
        ? "Google登录失败，请稍后重试"
        : "Google login failed, please try again later",
      "error"
    );
  }
};

// 检查URL中是否有重置密码token
window.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  if (token) {
    // 显示重置密码模态框
    showModal("resetPasswordModal");
  }
});

// 导出初始化函数
window.initAuthForms = initAuthForms;
