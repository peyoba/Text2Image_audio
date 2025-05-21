/**
 * UI处理器类，处理所有用户界面交互
 */
class UIHandler {
    constructor() {
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

        this.bindEvents();
        this._toggleImageOptions(); // 初始化时根据类型显隐图片选项
        this._handleAspectRatioChange(); // 初始化宽高比相关UI
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
        this.generateButton.disabled = !isValid;
        return isValid;
    }

    /**
     * 显示加载状态
     */
    showLoading(message = "正在处理中，请稍候...") {
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
        this.generateButton.disabled = false; // 重新启用按钮，除非任务仍在进行
        this.validateInput(); // 根据输入框内容决定按钮最终状态
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
        this.imageResultContainer.innerHTML = ''; // 清空旧图片
        if (!imageDataURLs || !Array.isArray(imageDataURLs) || imageDataURLs.length === 0) {
            console.error('UIHandler: showImageResult - 无效的imageDataURLs数组', imageDataURLs);
            this.showError('未收到有效的图片数据。');
            return;
        }

        imageDataURLs.forEach(imageDataURL => {
            if (typeof imageDataURL === 'string' && imageDataURL.startsWith('data:image')) {
                const imgElement = document.createElement('img');
                imgElement.src = imageDataURL;
                imgElement.alt = '生成的图片';
                this.imageResultContainer.appendChild(imgElement);
            } else {
                console.warn('UIHandler: showImageResult - 数组中包含无效的图片数据URL', imageDataURL);
            }
        });
        
        if (this.imageResultContainer.children.length > 0) {
            this.imageResultContainer.style.display = 'flex'; // 使用flex布局以便图片排列
            this.audioResultContainer.style.display = 'none';
        } else {
            this.showError('未能成功加载任何图片。');
        }
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
            // 预设宽高比时，可以从 selectedOption.dataset 获取预设的宽高
            // const selectedOption = this.optionAspectRatio.selectedOptions[0];
            // const width = selectedOption.dataset.width;
            // const height = selectedOption.dataset.height;
            // console.log(`Preset aspect ratio: ${this.optionAspectRatio.value}, width: ${width}, height: ${height}`);
            // 这里暂时不直接更新内部宽高变量，在 handleGenerate 时再读取
        }
    }

    /**
     * 处理生成请求
     */
    async handleGenerate() {
        if (!this.validateInput()) {
            this.showError("请输入描述文本后再生成。");
            return;
        }

        const text = this.textInput.value.trim();
        const type = this.typeImageRadio.checked ? 'image' : 'audio';
        const imageOptions = {}; // 用于收集图片生成选项

        try {
            if (type === 'image') {
                this.showLoading("准备中...");

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

                const numImages = parseInt(this.optionNumImages.value, 10) || 1;
                console.log('UIHandler: Generating with image options:', imageOptions, 'Number of images:', numImages);

                let textToGenerate = text;
                try {
                    this.showLoading("正在优化提示词...");
                    const optimizedText = await apiClient.optimizeText(text);
                    if (optimizedText && typeof optimizedText === 'string' && optimizedText.trim() !== '') {
                        textToGenerate = optimizedText.trim();
                        console.log("UIHandler: Text optimized, using for generation:", textToGenerate);
                    } else {
                        console.warn("UIHandler: Optimization returned no valid text, using original.");
                    }
                } catch (optimizationError) {
                    console.error("UIHandler: Text optimization failed, proceeding with original text.", optimizationError);
                }
                
                this.showLoading(numImages > 1 ? `正在生成 ${numImages} 张图片...` : "正在生成图片...");
                
                const generationPromises = [];
                for (let i = 0; i < numImages; i++) {
                    let currentImageOptions = {...imageOptions};
                    if (numImages > 1 && !currentImageOptions.seed) { 
                        currentImageOptions.seed = Math.floor(Math.random() * 1000000);
                    }
                    generationPromises.push(apiClient.submitGenerationTask(textToGenerate, type, currentImageOptions));
                }

                const results = await Promise.all(generationPromises);
                this.hideResults();
                this.hideError();

                const imageDataURLs = results.map(result => {
                    if (result && result.data && result.format === 'base64') {
                        const imageContentType = result.content_type || 'image/jpeg';
                        return `data:${imageContentType};base64,${result.data}`;
                    } else {
                        console.error('UIHandler: Image data from API is not in expected format for one of the images.', result);
                        return null;
                    }
                }).filter(url => url !== null);

                if (imageDataURLs.length > 0) {
                    this.showImageResult(imageDataURLs);
                } else if (numImages > 0) {
                    throw new Error('所有图片生成均失败或返回无效数据。');
                }

            } else if (type === 'audio') {
                this.showLoading("正在生成音频...");
                const result = await apiClient.submitGenerationTask(text, type);
                this.hideResults();
                this.hideError();
                if (result instanceof ArrayBuffer && result.byteLength > 0) {
                    const audioBlob = new Blob([result], { type: 'audio/mpeg' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    this.showAudioResult(audioUrl);
                } else {
                    console.error('UIHandler: Audio data from API is not an ArrayBuffer or is empty.', result);
                    throw new Error('音频数据响应格式不正确或为空。');
                }
            }
        } catch (error) {
            console.error('UIHandler: 生成处理主流程失败:', error.message, error.stack);
            let displayErrorMessage = error.message || '生成过程中发生未知错误，请稍后重试。';
            // error.details 可能来自 apiClient 的 HTTP error 包装
            if (error.details) { 
                displayErrorMessage += ` 详情: ${error.details}`;
            }
            this.showError(displayErrorMessage);
        } finally {
            this.hideLoading(); // 确保loading最终被隐藏
        }
    }

    _ensureLoadingIsHidden() { // 新增一个方法确保loading最终被隐藏
        if (this.loadingIndicator.style.display !== 'none') {
            this.hideLoading();
        }
    }
}

// 创建UI处理器实例 (确保在DOM加载完毕后执行，或者将脚本放在body底部)
// 如果 app.js 依赖它，确保 uiHandler 在 app.js 之前实例化或通过某种方式传递
// 在这个项目中，脚本是顺序加载的，所以这里实例化是OK的。
const uiHandler = new UIHandler(); 