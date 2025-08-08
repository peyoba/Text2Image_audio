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

// 导出初始化函数
window.initAuthForms = initAuthForms;

