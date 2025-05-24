/**
 * UI增强功能模块
 * 提供示例填充、快捷操作、智能提示等交互功能
 * 版本: 1.0.0
 * 日期: 2025-05-24
 */

class UIEnhancements {
    constructor() {
        this.examples = [
            { type: 'image', text: '一只可爱的猫咪在草地上玩耍，阳光明媚，高清摄影', icon: '🐱', name: '可爱猫咪' },
            { type: 'image', text: '未来科技城市夜景，霓虹灯闪烁，赛博朋克风格，超高清', icon: '🌃', name: '科技城市' },
            { type: 'image', text: '古风美女，汉服飘逸，桃花盛开，国风插画，精美细节', icon: '🌸', name: '古风美女' },
            { type: 'audio', text: '欢迎使用AI内容生成器，希望您能创造出精彩的作品', icon: '🎵', name: '欢迎语音' },
            { type: 'audio', text: '今天天气真不错，适合出门散步和拍照', icon: '☀️', name: '天气播报' },
            { type: 'image', text: '梦幻森林，精灵飞舞，魔法光芒，幻想风景画', icon: '🧚', name: '魔法森林' },
            { type: 'image', text: '星空下的山峰，银河璀璨，摄影作品，震撼视觉', icon: '🏔️', name: '星空山峰' },
            { type: 'image', text: '机械朋克机器人，金属质感，蒸汽朋克风格，工业美学', icon: '🤖', name: '机械朋克' },
            { type: 'audio', text: '感谢您的使用，祝您生活愉快，工作顺利', icon: '🙏', name: '感谢语音' },
            { type: 'image', text: '樱花飘落的日式庭院，宁静优美，水墨画风格', icon: '🌸', name: '日式庭院' }
        ];
        
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
            this.updateResultStatus('文本已清空，请输入新的内容');
        }
    }

    /**
     * 智能优化文本（调用现有的优化功能）
     */
    async optimizeText() {
        const textInput = document.getElementById('text-input');
        if (!textInput || !textInput.value.trim()) {
            this.updateResultStatus('请先输入文本内容', 'warning');
            return;
        }

        try {
            this.updateResultStatus('正在智能优化提示词...', 'loading');
            
            // 调用现有的优化API
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
                    this.updateResultStatus('✨ 提示词优化完成！');
                    
                    // 添加优化成功动画
                    textInput.style.borderColor = '#2ecc71';
                    setTimeout(() => {
                        textInput.style.borderColor = '';
                    }, 1000);
                }
            } else {
                throw new Error('优化服务暂时不可用');
            }
        } catch (error) {
            console.error('优化失败:', error);
            this.updateResultStatus('优化失败，请稍后重试', 'error');
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
            if (selectedType === 'audio') {
                typeHint.textContent = '🎵 语音生成支持播放和下载功能';
            } else {
                typeHint.textContent = '💡 图片生成支持多种尺寸和数量选择';
            }
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
            '💡 尝试点击示例按钮快速填充内容',
            '✨ 使用"优化"按钮提升AI生成效果',
            '🎲 点击"随机"按钮获取灵感',
            '🖼️ 图片生成支持多种尺寸比例',
            '🎵 语音生成支持下载功能'
        ];

        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        this.updateResultStatus(randomTip);
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

// 导出给其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIEnhancements;
} 