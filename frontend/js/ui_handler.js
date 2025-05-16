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
        this.generatedImage = document.getElementById('generated-image');
        this.generatedAudio = document.getElementById('generated-audio');
        this.downloadAudioLink = document.getElementById('download-audio-link');

        this.bindEvents();
    }

    /**
     * 绑定所有事件处理器
     */
    bindEvents() {
        this.generateButton.addEventListener('click', () => this.handleGenerate());
        this.textInput.addEventListener('input', () => this.validateInput());
        // 初始化时也校验一次，以防刷新页面时按钮状态不对
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
        this.audioResultContainer.style.display = 'none';
        this.generatedImage.src = '#'; // 清除旧图片
        this.generatedAudio.src = ''; // 清除旧音频
        this.downloadAudioLink.href = '#';
        this.downloadAudioLink.style.display = 'none';
    }

    /**
     * 显示图片结果
     * @param {string} imageDataURL base64图片数据URL (例如 data:image/jpeg;base64,...)
     */
    showImageResult(imageDataURL) {
        if (!imageDataURL || typeof imageDataURL !== 'string' || !imageDataURL.startsWith('data:image')) {
            console.error('UIHandler: showImageResult - 无效的imageDataURL', imageDataURL);
            this.showError('收到的图片数据格式不正确。');
            return;
        }
        this.generatedImage.src = imageDataURL;
        this.imageResultContainer.style.display = 'block';
        this.audioResultContainer.style.display = 'none';
    }

    /**
     * 显示音频结果
     * @param {string} audioDataURL base64音频数据URL (例如 data:audio/mpeg;base64,...)
     */
    showAudioResult(audioDataURL) {
        if (!audioDataURL || typeof audioDataURL !== 'string' || !audioDataURL.startsWith('data:audio')) {
            console.error('UIHandler: showAudioResult - 无效的audioDataURL', audioDataURL);
            this.showError('收到的音频数据格式不正确。');
            return;
        }
        this.generatedAudio.src = audioDataURL;
        this.downloadAudioLink.href = audioDataURL;
        // 尝试从data URL中提取或智能判断文件名后缀，但目前后端固定mpeg，所以mp3是合理的
        this.downloadAudioLink.download = `generated_audio_${Date.now()}.mp3`; // 添加时间戳以避免重名
        this.downloadAudioLink.style.display = 'inline-block';
        this.audioResultContainer.style.display = 'block';
        this.imageResultContainer.style.display = 'none';
    }

    handlePollingProgress(taskInfo) {
        if (!taskInfo) return;
        let statusMessage = "正在处理中...";
        switch (taskInfo.status) {
            case 'PENDING':
                statusMessage = "任务已提交，等待处理...";
                break;
            case 'STARTED':
                statusMessage = "任务已开始，正在生成...";
                break;
            case 'RETRY':
                statusMessage = "任务遇到临时问题，正在重试...";
                break;
            // SUCCESS 和 FAILURE 在 pollTaskUntilCompletion 的 resolve/reject 中处理
        }
        // 避免在最终状态（SUCCESS/FAILURE）时覆盖加载文本，因为那时会直接显示结果或错误
        if (taskInfo.status !== 'SUCCESS' && taskInfo.status !== 'FAILURE') {
            this.loadingText.textContent = statusMessage;
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

        this.showLoading("正在提交任务...");

        try {
            const taskSubmissionResponse = await apiClient.submitGenerationTask(text, type);
            
            if (!taskSubmissionResponse || !taskSubmissionResponse.task_id || !taskSubmissionResponse.status_url) {
                throw new Error('提交任务失败，未收到有效的任务ID或状态URL。');
            }

            this.showLoading("任务已提交，等待服务器处理..."); // 更新加载文本

            // 轮询任务状态
            const finalTaskInfo = await apiClient.pollTaskUntilCompletion(
                taskSubmissionResponse.status_url,
                (progressInfo) => this.handlePollingProgress(progressInfo) // 传递进度回调
            );

            this.hideResults(); // 先清除旧结果
            this.hideError();

            if (finalTaskInfo.status === 'SUCCESS') {
                const resultData = finalTaskInfo.result;
                if (!resultData || !resultData.data) {
                    throw new Error('任务成功，但结果数据缺失或格式不正确。');
                }
                if (resultData.type === 'image') {
                    this.showImageResult(resultData.data);
                } else if (resultData.type === 'audio') {
                    this.showAudioResult(resultData.data);
                } else {
                    throw new Error('任务成功，但返回了未知的结果类型。');
                }
            } else { // FAILURE
                throw new Error(finalTaskInfo.error || '任务执行失败，请检查日志或联系管理员。');
            }

        } catch (error) {
            console.error('UIHandler: 生成处理失败:', error);
            this.showError(error.message || '生成过程中发生未知错误，请稍后重试。');
        } finally {
            this.hideLoading();
            // validateInput 会根据当前输入框内容决定按钮是否可用
        }
    }
}

// 创建UI处理器实例 (确保在DOM加载完毕后执行，或者将脚本放在body底部)
// 如果 app.js 依赖它，确保 uiHandler 在 app.js 之前实例化或通过某种方式传递
// 在这个项目中，脚本是顺序加载的，所以这里实例化是OK的。
const uiHandler = new UIHandler(); 