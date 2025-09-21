/**
 * 移动端交互增强管理器
 * 处理触摸手势、移动端菜单、PWA安装等功能
 */
class MobileInteractionsManager {
    constructor() {
        this.isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        this.longPressTimer = null;
        this.longPressDelay = 500; // 长按延迟500ms
        
        this.init();
    }
    
    init() {
        if (this.isMobile || this.isTouch) {
            this.setupMobileNavigation();
            this.setupTouchOptimizations();
            this.setupLongPress();
            this.setupSwipeGestures();
            this.setupVirtualKeyboardHandling();
            this.setupPWAInstall();
            this.addMobileClasses();
        }
    }
    
    /**
     * 设置移动端导航
     */
    setupMobileNavigation() {
        // 添加汉堡菜单按钮
        const nav = document.querySelector('nav');
        if (nav && !nav.querySelector('.mobile-menu-toggle')) {
            const mobileToggle = document.createElement('button');
            mobileToggle.className = 'mobile-menu-toggle';
            mobileToggle.innerHTML = '☰';
            mobileToggle.setAttribute('aria-label', '打开导航菜单');
            
            // 插入到导航的开始位置
            nav.insertBefore(mobileToggle, nav.firstChild);
            
            // 绑定点击事件
            mobileToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMobileMenu();
            });
        }
        
        // 点击外部关闭菜单
        document.addEventListener('click', (e) => {
            const nav = document.querySelector('nav ul');
            const toggle = document.querySelector('.mobile-menu-toggle');
            
            if (nav && nav.classList.contains('mobile-menu-open') && 
                !nav.contains(e.target) && !toggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }
    
    /**
     * 切换移动端菜单
     */
    toggleMobileMenu() {
        const navMenu = document.querySelector('nav ul');
        const toggle = document.querySelector('.mobile-menu-toggle');
        
        if (navMenu && toggle) {
            navMenu.classList.toggle('mobile-menu-open');
            toggle.innerHTML = navMenu.classList.contains('mobile-menu-open') ? '×' : '☰';
            toggle.setAttribute('aria-label', 
                navMenu.classList.contains('mobile-menu-open') ? '关闭导航菜单' : '打开导航菜单'
            );
        }
    }
    
    /**
     * 关闭移动端菜单
     */
    closeMobileMenu() {
        const navMenu = document.querySelector('nav ul');
        const toggle = document.querySelector('.mobile-menu-toggle');
        
        if (navMenu && toggle) {
            navMenu.classList.remove('mobile-menu-open');
            toggle.innerHTML = '☰';
            toggle.setAttribute('aria-label', '打开导航菜单');
        }
    }
    
    /**
     * 设置触摸优化
     */
    setupTouchOptimizations() {
        // 防止双击缩放
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
        
        // 优化触摸滚动
        document.addEventListener('touchmove', (e) => {
            // 只在需要时阻止默认行为
            if (e.target.closest('.no-scroll')) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // 添加触摸反馈
        this.addTouchFeedback();
    }
    
    /**
     * 添加触摸反馈效果
     */
    addTouchFeedback() {
        const touchElements = document.querySelectorAll(
            'button, .btn, .card, .feature-card, a[href]'
        );
        
        touchElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                element.classList.add('touch-active');
            }, { passive: true });
            
            element.addEventListener('touchend', () => {
                setTimeout(() => {
                    element.classList.remove('touch-active');
                }, 150);
            }, { passive: true });
        });
    }
    
    /**
     * 设置长按手势
     */
    setupLongPress() {
        const longPressElements = document.querySelectorAll('.card, .feature-card, img');
        
        longPressElements.forEach(element => {
            let startX, startY;
            
            element.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                
                this.longPressTimer = setTimeout(() => {
                    this.showLongPressMenu(element, e);
                }, this.longPressDelay);
            }, { passive: true });
            
            element.addEventListener('touchmove', (e) => {
                const moveX = e.touches[0].clientX;
                const moveY = e.touches[0].clientY;
                const distance = Math.sqrt(
                    Math.pow(moveX - startX, 2) + Math.pow(moveY - startY, 2)
                );
                
                // 如果移动距离超过10px，取消长按
                if (distance > 10) {
                    clearTimeout(this.longPressTimer);
                }
            }, { passive: true });
            
            element.addEventListener('touchend', () => {
                clearTimeout(this.longPressTimer);
            }, { passive: true });
        });
    }
    
    /**
     * 显示长按菜单
     */
    showLongPressMenu(element, event) {
        // 震动反馈（如果支持）
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        // 移除已存在的菜单
        const existingMenu = document.querySelector('.long-press-menu');
        if (existingMenu) {
            existingMenu.remove();
        }
        
        const menu = document.createElement('div');
        menu.className = 'long-press-menu show';
        
        // 根据元素类型添加不同的选项
        let menuOptions = [];
        
        if (element.tagName === 'IMG') {
            menuOptions = [
                { text: '保存图片', action: () => this.saveImage(element) },
                { text: '复制图片', action: () => this.copyImage(element) },
                { text: '分享', action: () => this.shareImage(element) }
            ];
        } else if (element.classList.contains('card') || element.classList.contains('feature-card')) {
            menuOptions = [
                { text: '复制链接', action: () => this.copyLink(element) },
                { text: '分享', action: () => this.shareCard(element) },
                { text: '添加到收藏', action: () => this.addToFavorites(element) }
            ];
        }
        
        menuOptions.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option.text;
            button.addEventListener('click', () => {
                option.action();
                menu.remove();
            });
            menu.appendChild(button);
        });
        
        // 定位菜单
        const touch = event.touches[0];
        menu.style.left = `${touch.clientX}px`;
        menu.style.top = `${touch.clientY}px`;
        
        document.body.appendChild(menu);
        
        // 点击外部关闭菜单
        setTimeout(() => {
            document.addEventListener('click', function closeMenu(e) {
                if (!menu.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            });
        }, 100);
    }
    
    /**
     * 设置滑动手势
     */
    setupSwipeGestures() {
        let startX, startY, startTime;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startTime = Date.now();
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const endTime = Date.now();
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const deltaTime = endTime - startTime;
            
            // 只处理快速滑动
            if (deltaTime < 500 && Math.abs(deltaX) > Math.abs(deltaY)) {
                if (Math.abs(deltaX) > 50) {
                    if (deltaX > 0) {
                        this.onSwipeRight();
                    } else {
                        this.onSwipeLeft();
                    }
                }
            }
            
            startX = startY = null;
        }, { passive: true });
    }
    
    /**
     * 右滑手势处理
     */
    onSwipeRight() {
        // 可以实现侧边栏菜单、返回上一页等功能
        console.log('右滑手势');
        
        // 如果有移动菜单且未打开，则打开
        const navMenu = document.querySelector('nav ul');
        if (navMenu && !navMenu.classList.contains('mobile-menu-open')) {
            this.toggleMobileMenu();
        }
    }
    
    /**
     * 左滑手势处理
     */
    onSwipeLeft() {
        console.log('左滑手势');
        
        // 如果有移动菜单且已打开，则关闭
        const navMenu = document.querySelector('nav ul');
        if (navMenu && navMenu.classList.contains('mobile-menu-open')) {
            this.closeMobileMenu();
        }
    }
    
    /**
     * 设置虚拟键盘处理
     */
    setupVirtualKeyboardHandling() {
        if (!window.visualViewport) return;
        
        const viewport = window.visualViewport;
        
        viewport.addEventListener('resize', () => {
            const keyboardHeight = window.innerHeight - viewport.height;
            
            if (keyboardHeight > 0) {
                // 键盘打开
                document.body.classList.add('keyboard-open');
                document.body.style.setProperty('--keyboard-height', `${keyboardHeight}px`);
            } else {
                // 键盘关闭
                document.body.classList.remove('keyboard-open');
                document.body.style.removeProperty('--keyboard-height');
            }
        });
    }
    
    /**
     * 设置PWA安装提示
     */
    setupPWAInstall() {
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            // 显示自定义安装提示
            this.showPWAInstallPrompt(deferredPrompt);
        });
        
        // 检测是否已安装为PWA
        window.addEventListener('appinstalled', () => {
            console.log('PWA 已安装');
            this.hidePWAInstallPrompt();
        });
    }
    
    /**
     * 显示PWA安装提示
     */
    showPWAInstallPrompt(deferredPrompt) {
        // 检查是否已经显示过或用户已拒绝
        if (localStorage.getItem('pwa-install-dismissed') === 'true') {
            return;
        }
        
        const prompt = document.createElement('div');
        prompt.className = 'pwa-install-prompt';
        prompt.innerHTML = `
            <div>
                <strong>安装 AISTONE</strong>
                <p>添加到主屏幕，获得更好的体验</p>
            </div>
            <button id="pwa-install">安装</button>
            <button id="pwa-dismiss">×</button>
        `;
        
        document.body.appendChild(prompt);
        
        // 延迟显示动画
        setTimeout(() => prompt.classList.add('show'), 1000);
        
        // 安装按钮事件
        prompt.querySelector('#pwa-install').addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const result = await deferredPrompt.userChoice;
                
                if (result.outcome === 'accepted') {
                    console.log('用户同意安装PWA');
                } else {
                    console.log('用户拒绝安装PWA');
                }
                
                deferredPrompt = null;
                this.hidePWAInstallPrompt();
            }
        });
        
        // 关闭按钮事件
        prompt.querySelector('#pwa-dismiss').addEventListener('click', () => {
            localStorage.setItem('pwa-install-dismissed', 'true');
            this.hidePWAInstallPrompt();
        });
    }
    
    /**
     * 隐藏PWA安装提示
     */
    hidePWAInstallPrompt() {
        const prompt = document.querySelector('.pwa-install-prompt');
        if (prompt) {
            prompt.classList.remove('show');
            setTimeout(() => prompt.remove(), 300);
        }
    }
    
    /**
     * 添加移动端相关的CSS类
     */
    addMobileClasses() {
        document.body.classList.add('mobile-device');
        
        if (this.isTouch) {
            document.body.classList.add('touch-device');
        }
        
        // 检测iOS设备
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            document.body.classList.add('ios-device');
        }
        
        // 检测Android设备
        if (/Android/.test(navigator.userAgent)) {
            document.body.classList.add('android-device');
        }
    }
    
    // 长按菜单功能实现
    
    async saveImage(img) {
        try {
            const response = await fetch(img.src);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'image.jpg';
            a.click();
            
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('保存图片失败:', error);
        }
    }
    
    async copyImage(img) {
        try {
            const response = await fetch(img.src);
            const blob = await response.blob();
            
            await navigator.clipboard.write([
                new ClipboardItem({ [blob.type]: blob })
            ]);
            
            this.showToast('图片已复制到剪贴板');
        } catch (error) {
            console.error('复制图片失败:', error);
            this.showToast('复制失败');
        }
    }
    
    async shareImage(img) {
        if (navigator.share) {
            try {
                const response = await fetch(img.src);
                const blob = await response.blob();
                const file = new File([blob], 'image.jpg', { type: blob.type });
                
                await navigator.share({
                    files: [file],
                    title: 'AISTONE生成的图片',
                    text: '来自AISTONE的AI生成图片'
                });
            } catch (error) {
                console.error('分享失败:', error);
            }
        } else {
            // 降级到复制链接
            this.copyLink(img);
        }
    }
    
    copyLink(element) {
        const url = element.href || element.querySelector('a')?.href || window.location.href;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(() => {
                this.showToast('链接已复制');
            });
        } else {
            // 降级方案
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            this.showToast('链接已复制');
        }
    }
    
    shareCard(element) {
        if (navigator.share) {
            navigator.share({
                title: element.querySelector('h3, h2, h1')?.textContent || 'AISTONE',
                text: element.querySelector('p')?.textContent || 'AI内容创作平台',
                url: window.location.href
            });
        } else {
            this.copyLink(element);
        }
    }
    
    addToFavorites(element) {
        // 简单的收藏功能实现
        const favorites = JSON.parse(localStorage.getItem('aistone-favorites') || '[]');
        const item = {
            title: element.querySelector('h3, h2, h1')?.textContent || '未命名',
            url: window.location.href,
            timestamp: Date.now()
        };
        
        favorites.push(item);
        localStorage.setItem('aistone-favorites', JSON.stringify(favorites));
        
        this.showToast('已添加到收藏');
    }
    
    /**
     * 显示提示信息
     */
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'mobile-toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: var(--color-surface-on-light-white, #fff);
            padding: 12px 20px;
            border-radius: 20px;
            font-size: 14px;
            z-index: 10000;
            animation: fadeInOut 2s ease-in-out;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 2000);
    }
}

// 初始化移动端交互管理器
document.addEventListener('DOMContentLoaded', () => {
    new MobileInteractionsManager();
});

// 添加动画CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0%, 100% { opacity: 0; transform: translateX(-50%) translateY(10px); }
        20%, 80% { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    
    .touch-active {
        opacity: 0.8;
        transform: scale(0.98);
        transition: all 0.1s ease;
    }
    
    .mobile-device .no-select {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    
    .keyboard-open .viewport-height {
        height: calc(100vh - var(--keyboard-height, 0px));
    }
`;

document.head.appendChild(style);