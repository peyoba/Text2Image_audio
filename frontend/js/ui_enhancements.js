/**
 * UI增强功能模块
 * 提供示例填充、快捷操作、智能提示等交互功能
 * 版本: 1.0.0
 * 日期: 2025-05-24
 */

class UIEnhancements {
    constructor() {
        this.examples = [
            { type: 'image', text: t('examples.cat.text'), icon: '🐱', name: t('examples.cat.name') },
            { type: 'image', text: t('examples.city.text'), icon: '🌃', name: t('examples.city.name') },
            { type: 'image', text: t('examples.beauty.text'), icon: '🌸', name: t('examples.beauty.name') },
            { type: 'audio', text: t('examples.welcome.text'), icon: '🎵', name: t('examples.welcome.name') },
            { type: 'audio', text: t('examples.weather.text'), icon: '☀️', name: t('examples.weather.name') },
            { type: 'image', text: t('examples.forest.text'), icon: '🧚', name: t('examples.forest.name') },
            { type: 'image', text: t('examples.mountain.text'), icon: '🏔️', name: t('examples.mountain.name') },
            { type: 'image', text: t('examples.robot.text'), icon: '🤖', name: t('examples.robot.name') },
            { type: 'audio', text: t('examples.thanks.text'), icon: '🙏', name: t('examples.thanks.name') },
            { type: 'image', text: t('examples.garden.text'), icon: '🌸', name: t('examples.garden.name') }
        ];
        
        // 监听语言变更事件
        document.addEventListener('languageChanged', () => {
            this.updateExamples();
            this.updateTypeHint();
        });
        
        this.initializeEventListeners();
        this.updateTypeHint();
    }

    /**
     * 初始化事件监听器
     */
    initializeEventListeners() {
        // 示例按钮点击事件
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('example-btn')) {
                this.handleExampleClick(e.target);
            }
        });

        // 快捷操作按钮事件
        document.getElementById('clear-btn')?.addEventListener('click', () => this.clearText());
        document.getElementById('optimize-btn')?.addEventListener('click', () => this.optimizeText());
        document.getElementById('random-btn')?.addEventListener('click', () => this.fillRandomExample());

        // 生成类型变化事件
        document.querySelectorAll('input[name="generation-type"]').forEach(radio => {
            radio.addEventListener('change', () => this.updateTypeHint());
        });

        // 结果状态更新
        this.setupResultStatusUpdates();
    }

    /**
     * 处理示例按钮点击
     */
    handleExampleClick(button) {
        const text = button.dataset.text;
        const type = button.dataset.type;
        
        // 填充文本
        const textInput = document.getElementById('text-input');
        if (textInput) {
            textInput.value = text;
            textInput.focus();
            
            // 触发input事件以更新按钮状态
            textInput.dispatchEvent(new Event('input'));
            
            // 添加填充动画效果
            textInput.style.background = 'rgba(102, 126, 234, 0.1)';
            setTimeout(() => {
                textInput.style.background = '';
            }, 500);
        }

        // 设置对应的生成类型
        const typeRadio = document.getElementById(`type-${type}`);
        if (typeRadio) {
            typeRadio.checked = true;
            this.updateTypeHint();
        }

        // 按钮点击反馈
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);

        // 更新状态提示
        this.updateResultStatus(`已填充${type === 'image' ? '图片' : '语音'}示例："${text.substring(0, 20)}..."`);
    }

    /**
     * 清空文本
     */
    clearText() {
        const textInput = document.getElementById('text-input');
        if (textInput) {
            textInput.value = '';
            textInput.focus();
            this.updateResultStatus(t('tips.clear'));
        }
    }

    /**
     * 智能优化文本
     */
    async optimizeText() {
        const textInput = document.getElementById('text-input');
        if (!textInput || !textInput.value.trim()) {
            this.updateResultStatus(t('pleaseInputFirst'), 'warning');
            return;
        }

        try {
            this.updateResultStatus(t('loading'), 'loading');
            
            const response = await fetch('https://text2image-api.peyoba660703.workers.dev/api/optimize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: textInput.value
                })
            });

            if (response.ok) {
                const result = await response.json();
                if (result.optimized_text) {
                    textInput.value = result.optimized_text;
                    this.updateResultStatus(t('optimizationSuccess'));
                    
                    textInput.style.borderColor = '#2ecc71';
                    setTimeout(() => {
                        textInput.style.borderColor = '';
                    }, 1000);
                }
            } else {
                throw new Error(t('error'));
            }
        } catch (error) {
            console.error('优化失败:', error);
            this.updateResultStatus(t('optimizationFailed'), 'error');
        }
    }

    /**
     * 填充随机示例
     */
    fillRandomExample() {
        const currentType = document.querySelector('input[name="generation-type"]:checked')?.value || 'image';
        const typeExamples = this.examples.filter(ex => ex.type === currentType);
        
        if (typeExamples.length > 0) {
            const randomExample = typeExamples[Math.floor(Math.random() * typeExamples.length)];
            const textInput = document.getElementById('text-input');
            
            if (textInput) {
                textInput.value = randomExample.text;
                this.updateResultStatus(`🎲 随机填充：${randomExample.name}`);
                
                // 添加随机填充动画
                textInput.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)';
                setTimeout(() => {
                    textInput.style.background = '';
                }, 800);
            }
        }
    }

    /**
     * 更新类型提示
     */
    updateTypeHint() {
        const typeHint = document.getElementById('type-hint');
        const selectedType = document.querySelector('input[name="generation-type"]:checked')?.value;
        
        if (typeHint) {
            typeHint.textContent = selectedType === 'audio' ? t('audioHint') : t('imageHint');
        }
    }

    /**
     * 更新结果状态提示
     */
    updateResultStatus(message, type = 'info') {
        const resultStatus = document.getElementById('result-status');
        const statusIcon = resultStatus?.querySelector('.status-icon');
        const statusText = resultStatus?.querySelector('.status-text');
        
        if (resultStatus && statusIcon && statusText) {
            // 设置图标
            switch (type) {
                case 'loading':
                    statusIcon.textContent = '⏳';
                    break;
                case 'success':
                    statusIcon.textContent = '✅';
                    break;
                case 'warning':
                    statusIcon.textContent = '⚠️';
                    break;
                case 'error':
                    statusIcon.textContent = '❌';
                    break;
                default:
                    statusIcon.textContent = 'ℹ️';
            }
            
            statusText.textContent = message;
            resultStatus.style.display = 'flex';
            
            // 自动隐藏（除了加载状态）
            if (type !== 'loading') {
                setTimeout(() => {
                    resultStatus.style.display = 'none';
                }, 3000);
            }
        }
    }

    /**
     * 设置结果状态更新监听
     */
    setupResultStatusUpdates() {
        // 监听生成按钮状态变化
        const generateButton = document.getElementById('generate-button');
        if (generateButton) {
            // 创建观察器监听按钮状态变化
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
                        const isDisabled = generateButton.disabled;
                        if (isDisabled) {
                            this.updateResultStatus('正在生成内容，请稍候...', 'loading');
                        }
                    }
                });
            });

            observer.observe(generateButton, {
                attributes: true,
                attributeFilter: ['disabled']
            });
        }

        // 监听结果容器的显示状态
        const imageContainer = document.getElementById('image-result-container');
        const audioContainer = document.getElementById('audio-result-container');
        
        [imageContainer, audioContainer].forEach(container => {
            if (container) {
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                            const isVisible = container.style.display !== 'none';
                            if (isVisible) {
                                const type = container.id.includes('image') ? '图片' : '语音';
                                this.updateResultStatus(`🎉 ${type}生成完成！`, 'success');
                            }
                        }
                    });
                });

                observer.observe(container, {
                    attributes: true,
                    attributeFilter: ['style']
                });
            }
        });
    }

    /**
     * 显示使用提示
     */
    showUsageTips() {
        const tips = [
            t('tips.example'),
            t('tips.optimize'),
            t('tips.random'),
            t('tips.imageSize'),
            t('tips.audio')
        ];

        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        this.updateResultStatus(randomTip);
    }

    // 新增：更新示例数据
    updateExamples() {
        this.examples = [
            { type: 'image', text: t('examples.cat.text'), icon: '🐱', name: t('examples.cat.name') },
            { type: 'image', text: t('examples.city.text'), icon: '🌃', name: t('examples.city.name') },
            { type: 'image', text: t('examples.beauty.text'), icon: '🌸', name: t('examples.beauty.name') },
            { type: 'audio', text: t('examples.welcome.text'), icon: '🎵', name: t('examples.welcome.name') },
            { type: 'audio', text: t('examples.weather.text'), icon: '☀️', name: t('examples.weather.name') },
            { type: 'image', text: t('examples.forest.text'), icon: '🧚', name: t('examples.forest.name') },
            { type: 'image', text: t('examples.mountain.text'), icon: '🏔️', name: t('examples.mountain.name') },
            { type: 'image', text: t('examples.robot.text'), icon: '🤖', name: t('examples.robot.name') },
            { type: 'audio', text: t('examples.thanks.text'), icon: '🙏', name: t('examples.thanks.name') },
            { type: 'image', text: t('examples.garden.text'), icon: '🌸', name: t('examples.garden.name') }
        ];
        
        // 更新示例按钮
        document.querySelectorAll('.example-btn').forEach((btn, index) => {
            if (this.examples[index]) {
                const example = this.examples[index];
                btn.textContent = `${example.icon} ${example.name}`;
                btn.dataset.text = example.text;
                btn.dataset.type = example.type;
            }
        });
    }
}

// 页面加载完成后初始化UI增强功能
document.addEventListener('DOMContentLoaded', () => {
    window.uiEnhancements = new UIEnhancements();
    
    // 显示欢迎提示
    setTimeout(() => {
        window.uiEnhancements.showUsageTips();
    }, 1000);
});

// 将类设为全局变量
window.UIEnhancements = UIEnhancements; 