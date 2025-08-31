/**
 * 用户认证模块
 * 处理登录、注册、token管理等功能
 */

class AuthManager {
    constructor() {
        // 优先使用全局配置，其次使用生产Worker地址，最后回退相对路径
        const apiBase = (window.API_BASE || 'https://text2image-api.peyoba660703.workers.dev');
        // 统一以 /api 结尾，确保后续拼接 /auth/*
        this.baseUrl = apiBase.endsWith('/api') ? apiBase : `${apiBase}/api`;
        this.tokenKey = 'auth_token';
        this.userKey = 'user_info';
        this.isAuthenticated = false;
        this.currentUser = null;
        
        // 初始化时检查本地存储的token
        this.init();
    }

    /**
     * 初始化认证状态
     */
    async init() {
        const token = this.getToken();
        const user = this.getUser();
        
        if (token && user) {
            // 验证token是否仍然有效
            const isValid = await this.validateToken();
            if (isValid) {
                console.log('认证状态恢复成功');
                // 设置定期检查token有效性（每小时检查一次）
                this.setupTokenRefresh();
            } else {
                console.log('Token已过期，需要重新登录');
                this.logout();
            }
        } else {
            console.log('未找到认证信息');
            this.updateUI();
        }
    }

    /**
     * 用户注册
     * @param {Object} userData - 用户注册数据
     * @returns {Promise<Object>} 注册结果
     */
    async register(userData) {
        try {
            const response = await fetch(`${this.baseUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            const result = await response.json();

            if (response.ok && result && result.success && result.token) {
                        this.setToken(result.token);
                        this.setUser(result.user);
                        this.isAuthenticated = true;
                        this.currentUser = result.user;
                        this.updateUI();
                        this.forceUpdateUI(); // 强制刷新UI
                        console.log('注册成功，用户信息已保存');
                        return { success: true, message: '注册成功！' };
                    } else {
                return { success: false, message: (result && result.error) || '注册失败' };
                    }
        } catch (error) {
            console.error('注册错误:', error);
            return { success: false, message: '网络错误，请稍后重试' };
        }
    }

    /**
     * 用户登录
     * @param {Object} credentials - 登录凭据
     * @returns {Promise<Object>} 登录结果
     */
    async login(credentials) {
        try {
            const response = await fetch(`${this.baseUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            });

            const result = await response.json();

            if (response.ok && result && result.success && result.token) {
                        this.setToken(result.token);
                        this.setUser(result.user);
                        this.isAuthenticated = true;
                        this.currentUser = result.user;
                        this.updateUI();
                        this.forceUpdateUI(); // 强制刷新UI
                        console.log('登录成功，用户信息已保存');
            return { success: true, message: (getCurrentLang && getCurrentLang()==='zh') ? '登录成功！' : 'Logged in successfully' };
                    } else {
            return { success: false, message: (result && result.error) || ((getCurrentLang && getCurrentLang()==='zh') ? '登录失败' : 'Login failed') };
                    }
        } catch (error) {
            console.error('登录错误:', error);
            return { success: false, message: '网络错误，请稍后重试' };
        }
    }

    /**
     * 用户登出
     */
    logout() {
        this.clearToken();
        this.clearUser();
        this.isAuthenticated = false;
        this.currentUser = null;
        this.updateUI();
        
        // 显示登出成功消息
        this.showMessage((getCurrentLang && getCurrentLang()==='zh') ? '已成功登出' : 'Logged out successfully', 'success');
    }

    /**
     * 忘记密码
     * @param {string} email - 邮箱地址
     * @returns {Promise<Object>} 处理结果
     */
    async forgotPassword(email) {
        try {
            const response = await fetch(`${this.baseUrl}/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const result = await response.json();

            if (response.ok && result && result.success) {
                return { 
                    success: true, 
                    message: result.message || ((getCurrentLang && getCurrentLang()==='zh') ? '重置密码链接已发送到您的邮箱' : 'Password reset link has been sent to your email'),
                    resetUrl: result.resetUrl // 开发环境使用
                };
            } else {
                return { 
                    success: false, 
                    message: (result && result.error) || ((getCurrentLang && getCurrentLang()==='zh') ? '发送失败' : 'Failed to send reset email') 
                };
            }
        } catch (error) {
            console.error('忘记密码错误:', error);
            return { 
                success: false, 
                message: (getCurrentLang && getCurrentLang()==='zh') ? '网络错误，请稍后重试' : 'Network error, please try again later' 
            };
        }
    }

    /**
     * 重置密码
     * @param {string} token - 重置token
     * @param {string} newPassword - 新密码
     * @returns {Promise<Object>} 处理结果
     */
    async resetPassword(token, newPassword) {
        try {
            const response = await fetch(`${this.baseUrl}/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, newPassword })
            });

            const result = await response.json();

            if (response.ok && result && result.success) {
                return { 
                    success: true, 
                    message: result.message || ((getCurrentLang && getCurrentLang()==='zh') ? '密码重置成功，请使用新密码登录' : 'Password reset successfully, please login with your new password')
                };
            } else {
                return { 
                    success: false, 
                    message: (result && result.error) || ((getCurrentLang && getCurrentLang()==='zh') ? '重置失败' : 'Reset failed') 
                };
            }
        } catch (error) {
            console.error('重置密码错误:', error);
            return { 
                success: false, 
                message: (getCurrentLang && getCurrentLang()==='zh') ? '网络错误，请稍后重试' : 'Network error, please try again later' 
            };
        }
    }

    /**
     * Google登录
     * @param {string} idToken - Google ID token
     * @returns {Promise<Object>} 登录结果
     */
    async googleLogin(idToken) {
        try {
            const response = await fetch(`${this.baseUrl}/auth/google-login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idToken })
            });

            const result = await response.json();

            if (response.ok && result && result.success && result.token) {
                this.setToken(result.token);
                this.setUser(result.user);
                this.isAuthenticated = true;
                this.currentUser = result.user;
                this.updateUI();
                this.forceUpdateUI();
                console.log('Google登录成功，用户信息已保存');
                return { 
                    success: true, 
                    message: result.message || ((getCurrentLang && getCurrentLang()==='zh') ? 'Google登录成功！' : 'Google login successful!')
                };
            } else {
                return { 
                    success: false, 
                    message: (result && result.error) || ((getCurrentLang && getCurrentLang()==='zh') ? 'Google登录失败' : 'Google login failed') 
                };
            }
        } catch (error) {
            console.error('Google登录错误:', error);
            return { 
                success: false, 
                message: (getCurrentLang && getCurrentLang()==='zh') ? '网络错误，请稍后重试' : 'Network error, please try again later' 
            };
        }
    }

    /**
     * Google OAuth 2.0授权码登录
     * @param {string} code - Google授权码
     * @param {string} state - 状态参数
     * @returns {Promise<Object>} 登录结果
     */
    async googleAuthCodeLogin(code, state) {
        try {
            const response = await fetch(`${this.baseUrl}/auth/google-oauth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code, state })
            });

            const result = await response.json();

            if (response.ok && result && result.success && result.token) {
                this.setToken(result.token);
                this.setUser(result.user);
                this.isAuthenticated = true;
                this.currentUser = result.user;
                this.updateUI();
                this.forceUpdateUI();
                console.log('Google OAuth登录成功，用户信息已保存');
                return { 
                    success: true, 
                    message: result.message || ((getCurrentLang && getCurrentLang()==='zh') ? 'Google登录成功！' : 'Google login successful!')
                };
            } else {
                return { 
                    success: false, 
                    message: (result && result.error) || ((getCurrentLang && getCurrentLang()==='zh') ? 'Google登录失败' : 'Google login failed') 
                };
            }
        } catch (error) {
            console.error('Google OAuth登录错误:', error);
            return { 
                success: false, 
                message: (getCurrentLang && getCurrentLang()==='zh') ? '网络错误，请稍后重试' : 'Network error, please try again later' 
            };
        }
    }

    /**
     * 验证token是否有效
     * @returns {Promise<boolean>} token是否有效
     */
    async validateToken() {
        const token = this.getToken();
        if (!token) return false;

        try {
            const response = await fetch(`${this.baseUrl}/auth/validate`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success && result.user) {
                    this.setUser(result.user);
                    this.currentUser = result.user;
                    this.isAuthenticated = true;
                    this.updateUI();
                    return true;
                } else {
                    console.log('Token验证失败：服务器返回无效数据');
                    this.logout();
                    return false;
                }
            } else {
                console.log('Token验证失败：HTTP状态码', response.status);
                this.logout();
                return false;
            }
        } catch (error) {
            console.error('Token验证错误:', error);
            this.logout();
            return false;
        }
    }

    /**
     * 获取认证token
     * @returns {string|null} token
     */
    getToken() {
        return localStorage.getItem(this.tokenKey);
    }

    /**
     * 设置认证token
     * @param {string} token - JWT token
     */
    setToken(token) {
        localStorage.setItem(this.tokenKey, token);
    }

    /**
     * 清除认证token
     */
    clearToken() {
        localStorage.removeItem(this.tokenKey);
    }

    /**
     * 设置token定期刷新
     */
    setupTokenRefresh() {
        // 每小时检查一次token有效性
        setInterval(async () => {
            const isValid = await this.validateToken();
            if (!isValid) {
                console.log('Token验证失败，自动登出');
                this.logout();
            }
        }, 3600000); // 1小时 = 3600000毫秒
    }

    /**
     * 获取用户信息
     * @returns {Object|null} 用户信息
     */
    getUser() {
        const userStr = localStorage.getItem(this.userKey);
        return userStr ? JSON.parse(userStr) : null;
    }

    /**
     * 设置用户信息
     * @param {Object} user - 用户信息
     */
    setUser(user) {
        localStorage.setItem(this.userKey, JSON.stringify(user));
    }

    /**
     * 清除用户信息
     */
    clearUser() {
        localStorage.removeItem(this.userKey);
    }

    /**
     * 更新UI显示
     */
    updateUI() {
        console.log('开始更新UI，认证状态:', this.isAuthenticated);
        
        // 查找所有登录按钮（包括导航栏中的）
        const loginButtons = document.querySelectorAll('.login-btn');
        const authButtons = document.querySelectorAll('.auth-buttons');
        const userInfo = document.querySelectorAll('#nav-user-info');
        const loginModal = document.getElementById('loginModal');
        const registerModal = document.getElementById('registerModal');

        console.log('找到的元素:', {
            loginButtons: loginButtons.length,
            authButtons: authButtons.length,
            userInfo: userInfo.length,
            loginModal: !!loginModal,
            registerModal: !!registerModal
        });

        if (this.isAuthenticated) {
            // 用户已登录：隐藏登录按钮，显示用户信息
            loginButtons.forEach(btn => {
                btn.style.display = 'none';
                console.log('隐藏登录按钮:', btn);
            });
            authButtons.forEach(btn => btn.style.display = 'none');
            
            userInfo.forEach(info => {
                info.style.display = 'flex'; // 改为flex显示
                const usernameEl = info.querySelector('.username');
                if (usernameEl && this.currentUser) {
                    usernameEl.textContent = this.currentUser.username || this.currentUser.email;
                    console.log('设置用户名:', this.currentUser.username || this.currentUser.email);
                }
            });

            // 关闭模态框
            if (loginModal) loginModal.style.display = 'none';
            if (registerModal) registerModal.style.display = 'none';
            
            console.log('UI更新完成：用户已登录');
        } else {
            // 用户未登录：显示登录按钮，隐藏用户信息
            loginButtons.forEach(btn => {
                btn.style.display = 'inline-block'; // 改为inline-block显示
                console.log('显示登录按钮:', btn);
            });
            authButtons.forEach(btn => btn.style.display = 'block');
            userInfo.forEach(info => info.style.display = 'none');
            
            console.log('UI更新完成：用户未登录');
        }
    }

    /**
     * 显示消息提示
     * @param {string} message - 消息内容
     * @param {string} type - 消息类型 (success, error, warning)
     */
    showMessage(message, type = 'info') {
        // 创建消息元素
        const messageEl = document.createElement('div');
        messageEl.className = `message message-${type}`;
        messageEl.textContent = message;
        
        // 添加到页面
        document.body.appendChild(messageEl);
        
        // 3秒后自动移除
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 3000);
    }

    /**
     * 检查用户是否已登录
     * @returns {boolean} 是否已登录
     */
    isLoggedIn() {
        return this.isAuthenticated;
    }

    /**
     * 获取当前用户信息
     * @returns {Object|null} 当前用户信息
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * 强制刷新UI（延迟执行，确保DOM已更新）
     */
    forceUpdateUI() {
        setTimeout(() => {
            console.log('强制刷新UI...');
            this.updateUI();
        }, 100);
    }
}

// 创建全局认证管理器实例
const authManager = new AuthManager();

// 导出供其他模块使用
window.authManager = authManager; 