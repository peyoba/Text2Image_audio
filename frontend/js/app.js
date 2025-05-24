/**
 * 主应用类，负责初始化和协调各个组件
 */
class App {
    constructor() {
        // 初始化时禁用生成按钮
        // document.getElementById('generate-button').disabled = true;
        
        // 添加页面加载完成事件监听
        // document.addEventListener('DOMContentLoaded', () => {
        //     this.initializeApp();
        // });
        this.initializeApp(); // 直接调用初始化方法
    }

    /**
     * 初始化应用
     */
    initializeApp() {
        console.log('应用初始化完成');
        
        // 检查浏览器兼容性
        this.checkBrowserCompatibility();
        
        // 初始化错误处理
        this.initializeErrorHandling();
    }

    /**
     * 检查浏览器兼容性
     */
    checkBrowserCompatibility() {
        // 检查是否支持必要的API
        const requiredFeatures = [
            'fetch',
            'Promise',
            'FileReader',
            'AudioContext'
        ];

        const missingFeatures = requiredFeatures.filter(feature => !window[feature]);
        
        if (missingFeatures.length > 0) {
            console.warn('浏览器可能不支持以下功能:', missingFeatures);
            uiHandler.showError('您的浏览器可能不支持某些必要功能，请使用最新版本的Chrome、Firefox或Edge浏览器。');
        }
    }

    /**
     * 初始化错误处理
     */
    initializeErrorHandling() {
        // 全局错误处理
        window.addEventListener('error', (event) => {
            console.error('全局错误:', event.error);
            uiHandler.showError('发生未知错误，请刷新页面重试');
        });

        // 未处理的Promise错误
        window.addEventListener('unhandledrejection', (event) => {
            console.error('未处理的Promise错误:', event.reason);
            uiHandler.showError('操作失败，请稍后重试');
        });
    }
}

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', () => {
    console.log('当前语言:', getCurrentLang()); // 调试：打印当前语言

    // 初始化UI处理器
    window.uiHandler = new UIHandler();
    
    // 初始化UI增强功能
    window.uiEnhancements = new UIEnhancements();
    
    // 初始化语言切换按钮
    document.querySelectorAll('.lang-btn').forEach(btn => {
        const lang = btn.dataset.lang;
        console.log('按钮语言:', lang); // 调试：打印按钮语言

        // 设置当前语言的按钮状态
        if (lang === getCurrentLang()) {
            btn.classList.add('active');
            document.documentElement.lang = lang; // 更新HTML lang属性
        } else {
            btn.classList.remove('active');
        }

        // 移除旧的事件监听器（如果有）
        btn.removeEventListener('click', handleLangButtonClick);
        // 添加新的事件监听器
        btn.addEventListener('click', handleLangButtonClick);
    });

    // 调试：监听localStorage变化
    window.addEventListener('storage', (e) => {
        console.log('localStorage变化:', e);
    });
});

// 语言切换按钮点击处理函数
function handleLangButtonClick(e) {
    e.preventDefault();
    const lang = e.target.dataset.lang;
    console.log('点击语言按钮:', lang); // 调试：打印点击事件
    
    if (lang !== getCurrentLang()) {
        // 更新按钮状态
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');
        
        // 更新语言
        console.log('切换语言到:', lang); // 调试：打印语言切换
        localStorage.setItem('preferred_language', lang);
        document.documentElement.lang = lang;
        window.location.reload();
    }
}

// 创建应用实例
const app = new App(); 