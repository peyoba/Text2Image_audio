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

// 创建应用实例
const app = new App(); 