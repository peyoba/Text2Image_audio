/**
 * UI处理器类，处理所有用户界面交互
 */
class UIHandler {
    constructor() {
        // 初始化apiClient
        this.apiClient = new ApiClient();
        // 初始化语言切换
        this.initLanguageSwitcher();
        this.isGenerating = false; // 新增API请求状态标志
        
        // 获取DOM元素
        this.textInput = document.getElementById('text-input');
        this.generateButton = document.getElementById('generate-button');
        this.typeImageRadio = document.getElementById('type-image');
        this.typeAudioRadio = document.getElementById('type-audio');
        this.loadingIndicator = document.getElementById('loading-indicator');
        this.loadingText = this.loadingIndicator.querySelector('p'); // 获取加载指示器内的p标签
        this.errorMessage = document.getElementById('error-message');
        this.imageResultContainer = document.getElementById('image-result-container');
        this.audioResultContainer = document.getElementById('audio-result-container');
        this.generatedAudio = document.getElementById('generated-audio');
        this.downloadAudioLink = document.getElementById('download-audio-link');

        // 新增：获取图片选项UI元素
        this.imageOptionsContainer = document.getElementById('image-generation-options');
        this.optionNologo = document.getElementById('option-nologo');
        this.optionAspectRatio = document.getElementById('option-aspect-ratio');
        this.customDimensionsContainer = document.getElementById('custom-dimensions-container');
        this.optionWidth = document.getElementById('option-width');
        this.optionHeight = document.getElementById('option-height');
        this.optionNumImages = document.getElementById('option-num-images');

        // 更新页面文本
        this.updatePageText();
        
        // 监听语言变更事件
        document.addEventListener('languageChanged', () => {
            this.updatePageText();
        });

        this.bindEvents();
        this._toggleImageOptions(); // 初始化时根据类型显隐图片选项
        this._handleAspectRatioChange(); // 初始化宽高比相关UI
    }

    /**
     * 初始化语言切换功能
     */
    initLanguageSwitcher() {
        const currentLang = getCurrentLang();
        const langSelect = document.getElementById('lang-select');
        if (langSelect) {
            langSelect.value = currentLang;
            langSelect.addEventListener('change', (e) => {
                if (e.target.value !== getCurrentLang()) {
                    setLanguage(e.target.value);
                }
            });
        }
    }

    /**
     * 更新页面文本
     */
    updatePageText() {
        // 只保留自定义UI更新逻辑，不再调用window.updatePageText()
        // 更新标题
        document.title = t('title');
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) heroTitle.textContent = t('title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle) heroSubtitle.textContent = t('subtitle');

        // 更新输入区域
        this.textInput.placeholder = t('inputPlaceholder');
        this.generateButton.textContent = t('generateButton');

        // 更新生成类型
        document.querySelector('label[for="type-image"]').textContent = t('typeImage');
        document.querySelector('label[for="type-audio"]').textContent = t('typeAudio');

        // 更新图片选项
        document.querySelector('.image-options h3').textContent = t('imageOptions');
        document.querySelector('label[for="option-aspect-ratio"]').textContent = t('aspectRatio');
        document.querySelector('option[value="1:1"]').textContent = t('aspectRatioSquare');
        const option16_9_2k = document.querySelector('option[value="16:9-2k"]');
        if (option16_9_2k) option16_9_2k.textContent = t('aspectRatioLandscape2K');
        const option9_16_2k = document.querySelector('option[value="9:16-2k"]');
        if (option9_16_2k) option9_16_2k.textContent = t('aspectRatioPortrait2K');
        document.querySelector('option[value="custom"]').textContent = t('aspectRatioCustom');
        document.querySelector('label[for="option-width"]').textContent = t('width');
        document.querySelector('label[for="option-height"]').textContent = t('height');
        document.querySelector('label[for="option-nologo"]').textContent = t('noLogo');
        document.querySelector('label[for="option-num-images"]').textContent = t('numImages');

        // 更新快捷操作按钮
        document.getElementById('clear-btn').textContent = t('clearButton');
        document.getElementById('optimize-btn').textContent = t('optimizeButton');
        document.getElementById('random-btn').textContent = t('randomButton');

        // 更新提示文本
        document.getElementById('type-hint').textContent = 
            this.typeImageRadio.checked ? t('imageHint') : t('audioHint');

        // 更新输入区域标题
        const inputTitleEl = document.querySelector('.input-section h2');
        if (inputTitleEl) inputTitleEl.textContent = t('inputTitle');

        // 更新导航栏菜单项
        const navMenu = document.querySelectorAll('.navbar-menu li a');
        if (navMenu.length >= 4) {
            navMenu[0].textContent = t('navHome');
            navMenu[1].textContent = t('navAbout');
            navMenu[2].textContent = t('navServices');
            navMenu[3].textContent = t('navContact');
        }
        // 更新登录按钮
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) loginBtn.textContent = t('navLogin');

        // 更新Generation Result标题
        const outputTitle = document.querySelector('.output-section h2');
        if (outputTitle) outputTitle.textContent = t('generationResult');

        // 更新主要特性区块标题
        const featuresTitle = document.querySelector('.features-title');
        if (featuresTitle) featuresTitle.textContent = t('featuresTitle');

        // 更新主要特性卡片内容
        const featureCards = document.querySelectorAll('.feature-card');
        const features = t('features');
        if (featureCards && Array.isArray(features)) {
            featureCards.forEach((card, idx) => {
                const titleEl = card.querySelector('h3');
                const descEl = card.querySelector('p');
                if (features[idx]) {
                    if (titleEl) titleEl.textContent = features[idx].title;
                    if (descEl) descEl.textContent = features[idx].desc;
                }
            });
        }

        // 更新footer内容
        const footerCopyright = document.querySelector('.footer-left');
        if (footerCopyright) footerCopyright.textContent = t('footerCopyright');
        const footerLinks = t('footerLinks');
        const footerRight = document.querySelector('.footer-right');
        if (footerRight && Array.isArray(footerLinks)) {
            footerRight.innerHTML = footerLinks.map(link => `<a href="${link.url}" class="footer-link">${link.text}</a>`).join('<br>');
        }
    }

    /**
     * 绑定所有事件处理器
     */
    bindEvents() {
        this.generateButton.addEventListener('click', () => this.handleGenerate());
        this.textInput.addEventListener('input', () => this.validateInput());
        
        // 新增：为类型选择和图片选项绑定事件
        this.typeImageRadio.addEventListener('change', () => this._toggleImageOptions());
        this.typeAudioRadio.addEventListener('change', () => this._toggleImageOptions());
        this.optionAspectRatio.addEventListener('change', () => this._handleAspectRatioChange());

        this.validateInput();
    }

    /**
     * 验证用户输入
     * @returns {boolean} 输入是否有效
     */
    validateInput() {
        const text = this.textInput.value.trim();
        const isValid = text.length > 0;
        // 只有当没有正在进行的生成任务时，才根据输入有效性启用按钮
        if (!this.isGenerating) {
            this.generateButton.disabled = !isValid;
        } else {
            this.generateButton.disabled = true; // 如果正在生成，始终禁用
        }
        this.hideError(); // 在输入验证时隐藏错误信息
        return isValid;
    }

    /**
     * 显示加载状态
     */
    showLoading(message = 'AI服务繁忙时会自动排队重试，请耐心等待...') {
        this.loadingText.textContent = message;
        this.loadingIndicator.style.display = 'block';
        this.generateButton.disabled = true;
        this.hideError();
        this.hideResults();
    }

    /**
     * 隐藏加载状态
     */
    hideLoading() {
        this.loadingIndicator.style.display = 'none';
        // this.generateButton.disabled = false; // 移除，让 validateInput 通过 isGenerating 状态处理
        this.validateInput(); // 确保根据 isGenerating 和输入内容更新按钮状态
    }

    /**
     * 显示错误信息
     * @param {string} message 错误信息
     */
    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.style.display = 'block';
    }

    /**
     * 隐藏错误信息
     */
    hideError() {
        this.errorMessage.style.display = 'none';
    }

    /**
     * 隐藏所有结果
     */
    hideResults() {
        this.imageResultContainer.style.display = 'none';
        this.imageResultContainer.innerHTML = ''; // 清空图片容器内容
        this.audioResultContainer.style.display = 'none';
        this.generatedAudio.src = '';
        this.downloadAudioLink.href = '#';
        this.downloadAudioLink.style.display = 'none';
    }

    /**
     * 显示图片结果
     * @param {Array<string>} imageDataURLs - base64图片数据URL数组
     */
    showImageResult(imageDataURLs) {
        if (!imageDataURLs || !Array.isArray(imageDataURLs) || imageDataURLs.length === 0) {
            console.error('UIHandler: showImageResult - 无效的imageDataURLs数组', imageDataURLs);
            this.showError('未收到有效的图片数据。');
            return;
        }

        // 过滤有效的图片数据
        const validImages = imageDataURLs.filter(imageDataURL => 
            typeof imageDataURL === 'string' && imageDataURL.startsWith('data:image')
        );

        if (validImages.length === 0) {
            console.warn('UIHandler: showImageResult - 没有有效的图片数据');
            this.showError('未能成功加载任何图片。');
            return;
        }

        // 使用新的显示函数
        if (validImages.length === 1) {
            displayImageResult(validImages[0], 1);
        } else {
            displayImageResult(validImages, validImages.length);
        }
        
        // 隐藏音频结果容器
        this.audioResultContainer.style.display = 'none';
    }

    /**
     * 显示音频结果
     * @param {string} audioUrl Can be Object URL (blob:...) or Base64 Data URL
     */
    showAudioResult(audioUrl) { 
        if (!audioUrl || typeof audioUrl !== 'string') {
            console.error('UIHandler: showAudioResult - 无效的audioUrl', audioUrl);
            this.showError('收到的音频数据链接不正确。');
            return;
        }
        this.generatedAudio.src = audioUrl;
        this.downloadAudioLink.href = audioUrl; 
        this.downloadAudioLink.download = `generated_audio_${Date.now()}.mp3`;
        this.downloadAudioLink.style.display = 'inline-block';
        this.audioResultContainer.style.display = 'block';
        this.imageResultContainer.style.display = 'none';
    }

    // 新增：根据生成类型显隐图片选项
    _toggleImageOptions() {
        if (this.typeImageRadio.checked) {
            this.imageOptionsContainer.style.display = 'block';
        } else {
            this.imageOptionsContainer.style.display = 'none';
        }
    }

    // 新增：处理宽高比选择变化
    _handleAspectRatioChange() {
        if (this.optionAspectRatio.value === 'custom') {
            this.customDimensionsContainer.style.display = 'block';
        } else {
            this.customDimensionsContainer.style.display = 'none';
        }
    }

    /**
     * 主生成逻辑
     */
    async handleGenerate() {
        if (!this.validateInput() || this.isGenerating) {
            return;
        }

        this.isGenerating = true;
        const text = this.textInput.value.trim();
        const type = this.typeImageRadio.checked ? 'image' : 'audio';
        this.showLoading(t('loading'));

        try {
            if (type === 'image') {
                // 对于图片生成，先进行提示词优化
                let optimizedText = text;
                try {
                    this.showLoading('正在优化提示词...');
                    optimizedText = await this.apiClient.optimizeText(text);
                    console.log('UIHandler: 提示词优化成功，原始文本:', text, '优化后:', optimizedText);
                } catch (optimizeError) {
                    console.warn('UIHandler: 提示词优化失败，使用原始文本:', optimizeError);
                    // 如果优化失败，继续使用原始文本
                    optimizedText = text;
                }

                const numImages = parseInt(this.optionNumImages.value, 10);
                const imageOptions = this._getImageOptions();
                const allImageData = [];
                let failedCount = 0;

                for (let i = 0; i < numImages; i++) {
                    try {
                        // 更新加载提示
                        this.showLoading(`${t('generating')} ${i + 1}/${numImages}...`);
                        
                        const response = await this.apiClient.submitGenerationTask(optimizedText, 'image', {
                            ...imageOptions,
                            seed: Math.floor(Math.random() * 100000000) // 每次生成都用随机种子
                        });

                        if (response && response.data) {
                            allImageData.push(`data:image/jpeg;base64,${response.data}`);
                        } else {
                            throw new Error('API did not return image data.');
                        }
                    } catch (error) {
                        console.error(`UIHandler: Error generating image ${i + 1}:`, error);
                        // 优先使用后端返回的详细错误信息
                        let userFriendlyError = `图片 ${i + 1} 生成失败。`;
                        if (error.details && error.details.error) {
                            userFriendlyError = error.details.error; // e.g., "生成服务正忙"
                            if (error.details.details) {
                                userFriendlyError += ` (${error.details.details})`;
                            }
                        } else {
                            userFriendlyError = `${t('error')}: ${error.message}`;
                        }
                        this.showError(userFriendlyError);
                        failedCount++;
                        // 即使有一次失败，也跳出循环，因为很可能是同样的问题
                        break; 
                    }
                }

                if (allImageData.length > 0) {
                    this.showImageResult(allImageData);
                    if (failedCount > 0) {
                        this.showError(`成功生成 ${allImageData.length} 张图片，但有 ${failedCount} 次失败。请检查错误信息。`);
                    }
                } else {
                    // 如果 allImageData 为空且 failedCount > 0，错误信息已在循环内显示
                    if(failedCount === 0) {
                         this.showError('未能生成任何图片。');
                    }
                }

            } else { // type === 'audio'
                const audioBuffer = await this.apiClient.submitGenerationTask(text, 'audio');
                const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
                const audioUrl = URL.createObjectURL(audioBlob);
                this.showAudioResult(audioUrl);
            }
        } catch (error) {
            // 优化错误提示
            let msg = error.details && error.details.error ? error.details.error : (error.details && error.details.details ? error.details.details : error.message);
            if (error.details && error.details.error && error.details.error.includes('AI服务繁忙')) {
                msg += '\n建议您稍后再试，或更换描述内容。';
            }
            this.showError(msg);
        } finally {
            this.isGenerating = false;
            this.generateButton.disabled = false;
            this.hideLoading();
        }
    }

    _ensureLoadingIsHidden() { // 新增一个方法确保loading最终被隐藏
        if (this.loadingIndicator.style.display !== 'none') {
            this.hideLoading();
        }
    }

    /**
     * 获取图片生成选项
     */
    _getImageOptions() {
        const imageOptions = {};
        imageOptions.nologo = this.optionNologo.checked;
        const aspectRatioValue = this.optionAspectRatio.value;
        if (aspectRatioValue === 'custom') {
            imageOptions.width = parseInt(this.optionWidth.value, 10);
            imageOptions.height = parseInt(this.optionHeight.value, 10);
        } else {
            const selectedOption = this.optionAspectRatio.selectedOptions[0];
            imageOptions.width = parseInt(selectedOption.dataset.width, 10);
            imageOptions.height = parseInt(selectedOption.dataset.height, 10);
        }
        if (isNaN(imageOptions.width) || imageOptions.width <= 0) delete imageOptions.width;
        if (isNaN(imageOptions.height) || imageOptions.height <= 0) delete imageOptions.height;
        return imageOptions;
    }
}

// 将类设为全局变量
window.UIHandler = UIHandler;

/**
 * 显示生成的图片结果
 * @param {string|Array} imageData - Base64图片数据或图片数组
 * @param {number} numImages - 图片数量
 */
function displayImageResult(imageData, numImages = 1) {
    const imageContainer = document.getElementById('image-result-container');
    
    if (!imageContainer) {
        console.error('图片容器元素未找到');
        return;
    }

    // 清空之前的内容
    imageContainer.innerHTML = '';

    if (Array.isArray(imageData)) {
        // 多图片显示
        displayMultipleImages(imageContainer, imageData);
    } else {
        // 单图片显示
        displaySingleImage(imageContainer, imageData);
    }

    // 显示容器
    imageContainer.style.display = 'block';
}

/**
 * 显示单张图片
 */
function displaySingleImage(container, imageData) {
    const img = document.createElement('img');
    img.id = 'generated-image';
    img.src = imageData;
    img.alt = `AI生成的图片 - ${imageData.prompt || '用户描述的内容'}`;
    
    // 添加图片加载事件
    img.onload = function() {
        // 添加图片信息
        addImageInfo(container, img);
        // 添加操作按钮
        addImageActions(container, img, imageData);
    };
    
    img.onerror = function() {
        console.error('图片加载失败');
        container.innerHTML = '<p style="color: #e74c3c; text-align: center;">图片加载失败，请重试</p>';
    };

    container.appendChild(img);
}

/**
 * 显示多张图片
 */
function displayMultipleImages(container, imageDataArray) {
    const imageGrid = document.createElement('div');
    imageGrid.className = 'image-grid';
    
    // 根据图片数量设置网格类
    switch(imageDataArray.length) {
        case 1:
            imageGrid.classList.add('single');
            break;
        case 2:
            imageGrid.classList.add('double');
            break;
        case 4:
            imageGrid.classList.add('quad');
            break;
        default:
            imageGrid.classList.add('quad'); // 默认4宫格
    }

    imageDataArray.forEach((imageData, index) => {
        const img = document.createElement('img');
        img.src = imageData;
        img.alt = `AI生成的图片 ${index + 1} - ${imageData.prompt || '用户描述的内容'}`;
        img.dataset.index = index;
        
        // 点击图片放大查看
        img.addEventListener('click', () => {
            showImageModal(imageData, index + 1);
        });

        imageGrid.appendChild(img);
    });

    container.appendChild(imageGrid);
    
    // 添加多图片信息
    addMultiImageInfo(container, imageDataArray.length);
    // 添加批量操作按钮
    addBatchImageActions(container, imageDataArray);
}

/**
 * 添加图片信息显示
 */
function addImageInfo(container, img) {
    const infoDiv = document.createElement('div');
    infoDiv.className = 'image-info';
    const width = img.naturalWidth;
    const height = img.naturalHeight;
    const fileSize = Math.round(img.src.length * 0.75 / 1024); // 估算文件大小KB
    infoDiv.innerHTML = `${t('imageInfoSize')}: ${width} × ${height} ${t('pixels')} | ${t('imageInfoFileSize')}: ~${fileSize}KB`;
    container.appendChild(infoDiv);
}

/**
 * 添加多图片信息
 */
function addMultiImageInfo(container, count) {
    const infoDiv = document.createElement('div');
    infoDiv.className = 'image-info';
    infoDiv.innerHTML = `${t('imageInfoCount').replace('{count}', count)}`;
    container.appendChild(infoDiv);
}

/**
 * 添加图片操作按钮
 */
function addImageActions(container, img, imageData) {
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'image-actions';
    
    // 下载按钮
    const downloadBtn = document.createElement('a');
    downloadBtn.className = 'image-action-btn';
    downloadBtn.href = imageData;
    downloadBtn.download = `AI生成图片_${new Date().getTime()}.jpg`;
    downloadBtn.innerHTML = '⬇️ 下载图片';
    
    // 查看原图按钮
    const viewBtn = document.createElement('button');
    viewBtn.className = 'image-action-btn';
    viewBtn.innerHTML = '🔍 查看原图';
    viewBtn.onclick = () => showImageModal(imageData);
    
    // 复制链接按钮
    const copyBtn = document.createElement('button');
    copyBtn.className = 'image-action-btn';
    copyBtn.innerHTML = '📋 复制链接';
    copyBtn.onclick = () => copyImageData(imageData);
    
    actionsDiv.appendChild(downloadBtn);
    actionsDiv.appendChild(viewBtn);
    actionsDiv.appendChild(copyBtn);
    
    container.appendChild(actionsDiv);
}

/**
 * 添加批量图片操作按钮
 */
function addBatchImageActions(container, imageDataArray) {
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'image-actions';
    
    // 下载全部按钮
    const downloadAllBtn = document.createElement('button');
    downloadAllBtn.className = 'image-action-btn';
    downloadAllBtn.innerHTML = '⬇️ 下载全部';
    downloadAllBtn.onclick = () => downloadAllImages(imageDataArray);
    
    // 查看网格按钮
    const gridBtn = document.createElement('button');
    gridBtn.className = 'image-action-btn';
    gridBtn.innerHTML = '🏢 网格查看';
    gridBtn.onclick = () => showImageGrid(imageDataArray);
    
    actionsDiv.appendChild(downloadAllBtn);
    actionsDiv.appendChild(gridBtn);
    
    container.appendChild(actionsDiv);
}

/**
 * 显示图片模态框（放大查看）
 */
function showImageModal(imageData, index = 1) {
    // 创建模态框
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        cursor: pointer;
    `;
    
    const img = document.createElement('img');
    img.src = imageData;
    img.style.cssText = `
        max-width: 90vw;
        max-height: 90vh;
        object-fit: contain;
        border-radius: 8px;
        box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
    `;
    
    const closeBtn = document.createElement('div');
    closeBtn.innerHTML = '✕';
    closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 30px;
        color: white;
        font-size: 30px;
        font-weight: bold;
        cursor: pointer;
        user-select: none;
    `;
    
    const infoDiv = document.createElement('div');
    infoDiv.innerHTML = `图片 ${index} - 点击空白处关闭`;
    infoDiv.style.cssText = `
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        color: white;
        font-size: 14px;
        text-align: center;
    `;
    
    modal.appendChild(img);
    modal.appendChild(closeBtn);
    modal.appendChild(infoDiv);
    
    // 点击关闭
    modal.onclick = (e) => {
        if (e.target === modal || e.target === closeBtn) {
            document.body.removeChild(modal);
        }
    };
    
    // ESC键关闭
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            document.body.removeChild(modal);
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
    
    document.body.appendChild(modal);
}

/**
 * 复制图片数据
 */
function copyImageData(imageData) {
    navigator.clipboard.writeText(imageData).then(() => {
        // 显示复制成功提示
        if (window.uiEnhancements) {
            window.uiEnhancements.updateResultStatus('📋 图片链接已复制到剪贴板', 'success');
        }
    }).catch(() => {
        // 显示复制失败提示
        if (window.uiEnhancements) {
            window.uiEnhancements.updateResultStatus('复制失败，请手动复制', 'error');
        }
    });
}

/**
 * 下载所有图片
 */
function downloadAllImages(imageDataArray) {
    imageDataArray.forEach((imageData, index) => {
        const link = document.createElement('a');
        link.href = imageData;
        link.download = `AI生成图片_${index + 1}_${new Date().getTime()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // 添加延迟避免浏览器阻止多文件下载
        if (index < imageDataArray.length - 1) {
            setTimeout(() => {}, 100);
        }
    });
    
    if (window.uiEnhancements) {
        window.uiEnhancements.updateResultStatus(`📁 开始下载 ${imageDataArray.length} 张图片`, 'success');
    }
}

/**
 * 显示图片网格视图
 */
function showImageGrid(imageDataArray) {
    showImageModal(imageDataArray[0], 1); // 暂时显示第一张，后续可扩展为网格查看器
} 