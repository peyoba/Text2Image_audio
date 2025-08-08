/**
 * 认证模态框脚本：负责绑定登录/注册表单事件
 * 注意：该脚本与 `auth-modals.html` 配合使用
 */

function initAuthForms() {
  // 登录表单
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
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
        const ok = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(pwd.value);
        pwd.setCustomValidity(ok ? '' : '至少6位且需包含字母和数字');
      });
    }
  }
}

async function handleLoginSubmit(e) {
  e.preventDefault();
  try {
    const formData = new FormData(e.target);
    const credentials = {
      email: formData.get('email'),
      password: formData.get('password')
    };
    const result = await window.authManager.login(credentials);
    if (result.success) {
      if (typeof closeModal === 'function') closeModal('loginModal');
      e.target.reset();
    }
  } catch (err) {
    console.error('登录失败: ', err);
  }
}

async function handleRegisterSubmit(e) {
  e.preventDefault();
  try {
    const formData = new FormData(e.target);
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    if (password !== confirmPassword) {
      window.authManager?.showMessage('两次输入的密码不一致', 'error');
      return;
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(password)) {
      window.authManager?.showMessage('密码需至少6位，且包含字母和数字', 'error');
      return;
    }
    const userData = {
      username: formData.get('username'),
      email: formData.get('email'),
      password
    };
    const result = await window.authManager.register(userData);
    if (result.success) {
      if (typeof closeModal === 'function') closeModal('registerModal');
      e.target.reset();
    }
  } catch (err) {
    console.error('注册失败: ', err);
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

