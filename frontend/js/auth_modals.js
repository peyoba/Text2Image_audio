/**
 * 认证模态框脚本：负责绑定登录/注册表单事件
 * 注意：该脚本与 `auth-modals.html` 配合使用
 */

let isSubmittingLogin = false;
let isSubmittingRegister = false;

function setSubmitting(formEl, submitting) {
  const btn = formEl?.querySelector('button[type="submit"]');
  if (btn) {
    btn.disabled = submitting;
    btn.textContent = submitting ? '处理中...' : (btn.dataset.originText || '提交');
  }
}

function initAuthForms() {
  // 登录表单
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    const btn = loginForm.querySelector('button[type="submit"]');
    if (btn && !btn.dataset.originText) btn.dataset.originText = btn.textContent;
    loginForm.addEventListener('submit', handleLoginSubmit);
  }

  // 注册表单
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegisterSubmit);
    // 即时校验：显示密码规则提示
    const pwd = document.getElementById('registerPassword');
    if (pwd) {
      pwd.addEventListener('input', () => {
        const ok = pwd.value && pwd.value.length >= 6; // 降级为长度校验，避免浏览器对pattern差异
        pwd.setCustomValidity(ok ? '' : '至少6位');
      });
    }
    const btn = registerForm.querySelector('button[type="submit"]');
    if (btn && !btn.dataset.originText) btn.dataset.originText = btn.textContent;
  }

  // 忘记密码表单
  const forgotPasswordForm = document.getElementById('forgotPasswordForm');
  if (forgotPasswordForm) {
    const btn = forgotPasswordForm.querySelector('button[type="submit"]');
    if (btn && !btn.dataset.originText) btn.dataset.originText = btn.textContent;
    forgotPasswordForm.addEventListener('submit', handleForgotPasswordSubmit);
  }

  // 重置密码表单
  const resetPasswordForm = document.getElementById('resetPasswordForm');
  if (resetPasswordForm) {
    const btn = resetPasswordForm.querySelector('button[type="submit"]');
    if (btn && !btn.dataset.originText) btn.dataset.originText = btn.textContent;
    resetPasswordForm.addEventListener('submit', handleResetPasswordSubmit);
    
    // 确认密码验证
    const newPwd = document.getElementById('newPassword');
    const confirmPwd = document.getElementById('confirmNewPassword');
    if (newPwd && confirmPwd) {
      const validatePassword = () => {
        if (confirmPwd.value && newPwd.value !== confirmPwd.value) {
          confirmPwd.setCustomValidity('两次输入的密码不一致');
        } else {
          confirmPwd.setCustomValidity('');
        }
      };
      newPwd.addEventListener('input', validatePassword);
      confirmPwd.addEventListener('input', validatePassword);
    }
  }

  // Google登录按钮
  const googleLoginBtn = document.getElementById('googleLoginBtn');
  if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', handleGoogleLogin);
  }
}

async function handleLoginSubmit(e) {
  e.preventDefault();
  if (isSubmittingLogin) return;
  try {
    const form = e.target;
    const formData = new FormData(form);
    const email = String(formData.get('email') || '').trim();
    const password = String(formData.get('password') || '');
    if (!email || !password || password.length < 6) {
      window.authManager?.showMessage('请填写邮箱与至少6位密码', 'error');
      return;
    }
    const credentials = { email, password };
    isSubmittingLogin = true;
    setSubmitting(form, true);
    const result = await window.authManager.login(credentials);
    if (result.success) {
      if (typeof closeModal === 'function') closeModal('loginModal');
      form.reset();
    }
    if (!result.success) {
      window.authManager?.showMessage(result.message || '登录失败', 'error');
      console.error('Login failed payload:', credentials.email);
    }
  } catch (err) {
    console.error('登录失败: ', err);
    window.authManager?.showMessage('登录失败，请稍后重试', 'error');
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
    const username = String(formData.get('username') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const password = String(formData.get('password') || '');
    const confirmPassword = String(formData.get('confirmPassword') || '');
    if (password !== confirmPassword) {
      window.authManager?.showMessage('两次输入的密码不一致', 'error');
      return;
    }
    if (!password || password.length < 6) {
      window.authManager?.showMessage('密码需至少6位', 'error');
      return;
    }
    if (!username || !email) {
      window.authManager?.showMessage('请输入用户名与邮箱', 'error');
      return;
    }
    const userData = { username, email, password };
    const result = await window.authManager.register(userData);
    if (result.success) {
      if (typeof closeModal === 'function') closeModal('registerModal');
      form.reset();
    }
    if (!result.success) {
      window.authManager?.showMessage(result.message || '注册失败', 'error');
      console.error('Register failed payload:', { username, email });
    }
  } catch (err) {
    console.error('注册失败: ', err);
    window.authManager?.showMessage('注册失败，请稍后重试', 'error');
  } finally {
    isSubmittingRegister = false;
    setSubmitting(e.target, false);
  }
}

// 点击模态框外部关闭
window.addEventListener('click', (event) => {
  const modals = document.querySelectorAll('.modal');
  modals.forEach((modal) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
});

// 忘记密码处理函数
async function handleForgotPasswordSubmit(e) {
  e.preventDefault();
  try {
    const form = e.target;
    const formData = new FormData(form);
    const email = String(formData.get('email') || '').trim();
    
    if (!email) {
      window.authManager?.showMessage('请输入邮箱地址', 'error');
      return;
    }
    
    setSubmitting(form, true);
    
    const result = await window.authManager?.forgotPassword(email);
    
    if (result?.success) {
      window.authManager?.showMessage(result.message, 'success');
      closeModal('forgotPasswordModal');
      
      // 开发环境：显示重置链接
      if (result.resetUrl) {
        console.log('重置链接:', result.resetUrl);
        window.authManager?.showMessage(`重置链接: ${result.resetUrl}`, 'info');
      }
    } else {
      window.authManager?.showMessage(result?.message || '发送失败', 'error');
    }
  } catch (err) {
    console.error('忘记密码失败:', err);
    window.authManager?.showMessage('网络错误，请稍后重试', 'error');
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
    const newPassword = String(formData.get('newPassword') || '');
    const confirmNewPassword = String(formData.get('confirmNewPassword') || '');
    
    if (!newPassword || newPassword.length < 6) {
      window.authManager?.showMessage('密码长度至少6位', 'error');
      return;
    }
    
    if (newPassword !== confirmNewPassword) {
      window.authManager?.showMessage('两次输入的密码不一致', 'error');
      return;
    }
    
    // 从URL获取token
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (!token) {
      window.authManager?.showMessage('重置链接无效', 'error');
      return;
    }
    
    setSubmitting(form, true);
    
    const result = await window.authManager?.resetPassword(token, newPassword);
    
    if (result?.success) {
      window.authManager?.showMessage(result.message, 'success');
      closeModal('resetPasswordModal');
      
      // 清除URL中的token
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      
      // 显示登录模态框
      setTimeout(() => {
        showModal('loginModal');
      }, 1000);
    } else {
      window.authManager?.showMessage(result?.message || '重置失败', 'error');
    }
  } catch (err) {
    console.error('重置密码失败:', err);
    window.authManager?.showMessage('网络错误，请稍后重试', 'error');
  } finally {
    setSubmitting(e.target, false);
  }
}

// Google登录处理函数
async function handleGoogleLogin() {
  try {
    // 检查Google API是否已加载
    if (typeof google === 'undefined' || !google.accounts) {
      window.authManager?.showMessage(
        (getCurrentLang && getCurrentLang() === 'zh') 
          ? 'Google登录服务不可用，请使用邮箱登录' 
          : 'Google login service unavailable, please use email login', 
        'warning'
      );
      return;
    }
    
    // 使用Google One Tap API（不使用FedCM以避免错误）
    google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // 如果One Tap不可用，显示提示信息
        window.authManager?.showMessage(
          (getCurrentLang && getCurrentLang() === 'zh') 
            ? 'Google登录暂时不可用，请使用邮箱登录' 
            : 'Google login temporarily unavailable, please use email login', 
          'info'
        );
      }
    });
  } catch (err) {
    console.error('Google登录错误:', err);
    window.authManager?.showMessage(
      (getCurrentLang && getCurrentLang() === 'zh') 
        ? 'Google登录暂时不可用，请使用邮箱登录' 
        : 'Google login temporarily unavailable, please use email login', 
      'warning'
    );
  }
}

// Google登录回调函数
window.handleGoogleCredentialResponse = async function(response) {
  try {
    const result = await window.authManager?.googleLogin(response.credential);
    
    if (result?.success) {
      window.authManager?.showMessage(result.message, 'success');
      closeModal('loginModal');
    } else {
      window.authManager?.showMessage(result?.message || 'Google登录失败', 'error');
    }
  } catch (err) {
    console.error('Google登录回调错误:', err);
    window.authManager?.showMessage(
      (getCurrentLang && getCurrentLang() === 'zh') 
        ? 'Google登录失败，请稍后重试' 
        : 'Google login failed, please try again later', 
      'error'
    );
  }
};

// 检查URL中是否有重置密码token
window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  
  if (token) {
    // 显示重置密码模态框
    showModal('resetPasswordModal');
  }
});

// 导出初始化函数
window.initAuthForms = initAuthForms;

