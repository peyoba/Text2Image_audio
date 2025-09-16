/**
 * API客户端类，处理与后端的所有通信
 */
class ApiClient {
    constructor() {
        // 允许通过 window.API_BASE 或 localStorage 覆盖后端地址
        try {
            const saved = (typeof window !== 'undefined' && window.API_BASE)
                || (typeof localStorage !== 'undefined' && localStorage.getItem('api_base'));
            this.baseUrl = (saved && typeof saved === 'string' && saved.trim())
                ? saved.trim()
                : 'https://text2image-api.peyoba660703.workers.dev';
        } catch (e) {
            this.baseUrl = 'https://text2image-api.peyoba660703.workers.dev';
        }
        this.maxPollingAttempts = 60; // 最大轮询次数 (60 * 2秒 = 2分钟)
        this.pollingInterval = 2000; // 轮询间隔 (2秒)
        console.log('ApiClient initialized with baseUrl:', this.baseUrl); // 添加初始化日志
    }

    getBaseUrl() {
        try {
            if (typeof window !== 'undefined' && window.API_BASE && window.API_BASE.trim()) {
                return window.API_BASE.trim();
            }
        } catch (e) {}
        return this.baseUrl;
    }

    setBaseUrl(url) {
        if (typeof url === 'string' && url.trim()) {
            this.baseUrl = url.trim();
            try { if (typeof localStorage !== 'undefined') localStorage.setItem('api_base', this.baseUrl); } catch(e){}
            if (typeof window !== 'undefined') window.API_BASE = this.baseUrl;
            console.log('ApiClient baseUrl updated to:', this.baseUrl);
        }
    }

    /**
     * 提交生成任务
     * @param {string} text - 输入文本
     * @param {string} type - 任务类型 ('image' 或 'audio')
     * @param {Object} options - 额外选项 (仅用于图片生成)
     * @returns {Promise<Object|ArrayBuffer>} - 返回任务结果或直接返回ArrayBuffer (音频)
     */
    async submitGenerationTask(text, type, options = {}) {
        const requestUrl = `${this.getBaseUrl()}/api/generate`;
        console.log(`ApiClient: Submitting task to ${requestUrl} - Type: ${type}, Text: ${text.substring(0, 50)}..., Options:`, options);
        
        const payload = {
            text: text,
            type: type
        };

        if (type === 'image' && options) {
            Object.assign(payload, options); // 合并options到payload，包括negative
        }

        try {
            const response = await fetch(requestUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 对于音频，后端直接返回 ArrayBuffer，所以 Accept application/json 可能不再完全准确
                    // 但通常服务器会忽略不适用的 Accept 头，或者我们可以根据 type 动态设置 Accept
                    'Accept': type === 'image' ? 'application/json' : '*/*' // 更通用的 Accept for audio
                },
                body: JSON.stringify(payload) // 使用包含选项的payload
            });

            if (!response.ok) {
                // 尝试将错误响应体解析为JSON
                let errorDetails;
                try {
                    errorDetails = await response.json();
                } catch (e) {
                    // 如果解析失败，回退到读取文本
                    errorDetails = { error: '无法解析错误详情', details: await response.text().catch(() => '无法读取错误文本') };
                }
                console.error('ApiClient: Submit task error - Response not OK', response.status, errorDetails);
                const error = new Error(`HTTP error! status: ${response.status}`);
                error.details = errorDetails; // 将解析后的对象附加到错误上
                throw error;
            }

            if (type === 'image') {
                const responseData = await response.json();
                console.log('ApiClient: Image task submitted successfully', responseData);
                return responseData;
            } else if (type === 'audio') {
                // 对于音频，后端直接发送 ArrayBuffer
                const arrayBuffer = await response.arrayBuffer();
                console.log('ApiClient: Audio task completed, received ArrayBuffer length:', arrayBuffer.byteLength);
                return arrayBuffer; // 直接返回 ArrayBuffer
            } else {
                console.error('ApiClient: Unknown type for submitGenerationTask:', type);
                throw new Error('Unknown generation type');
            }

        } catch (error) {
            console.error(`ApiClient: submitGenerationTask (type: ${type}) - 请求失败:`, error.message);
            // 避免重复包装错误
            if (error instanceof Error && error.message.startsWith('HTTP error!')) {
                throw error;
            }
            throw new Error(`任务提交或处理失败: ${error.message || error.toString()}`);
        }
    }

    /**
     * 获取指定任务ID的状态
     * @param {string} taskStatusUrl - 任务状态查询的完整URL或相对路径 (例如 /api/tasks/task_id)
     * @returns {Promise<Object>} - 返回任务状态信息
     */
    // @deprecated 后端当前未提供 /tasks/:id 查询路由；仅保留以兼容旧调用路径
    async getTaskStatus(taskStatusUrl) {
        // 如果 taskStatusUrl 不是以 http 开头，则假定它是相对路径并拼接 baseUrl
        const fullUrl = taskStatusUrl.startsWith('http') ? taskStatusUrl : `${this.baseUrl}/tasks/${taskStatusUrl.split('/').pop()}`;
        console.log(`ApiClient: Getting task status from ${fullUrl}`);
        try {
            const response = await fetch(fullUrl, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) {
                console.error('ApiClient: Get task status error - Response not OK', response.status);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const responseData = await response.json(); // 任务状态API总是返回JSON
            console.log('ApiClient: Task status response:', responseData); // 添加响应日志
            return responseData; // 期望包含 status, result/error 等字段

        } catch (error) {
            console.error('ApiClient: getTaskStatus - 请求失败:', error.message);
            if (error instanceof Error) {
                throw error;
            }
            throw new Error(error.toString());
        }
    }

    /**
     * 轮询任务状态直到任务完成或失败
     * @param {string} taskStatusUrl - 任务状态查询的URL
     * @param {function} onProgress - (可选) 进度回调函数，接收任务状态对象
     * @returns {Promise<Object>} - 返回最终的任务结果对象
     */
    pollTaskUntilCompletion(taskStatusUrl, onProgress) {
        return new Promise((resolve, reject) => {
            let attempts = 0;

            const poll = async () => {
                try {
                    attempts++;
                    const taskInfo = await this.getTaskStatus(taskStatusUrl);

                    if (onProgress && typeof onProgress === 'function') {
                        onProgress(taskInfo); // 调用进度回调
                    }

                    if (taskInfo.status === 'SUCCESS' || taskInfo.status === 'FAILURE') {
                        console.log(`ApiClient: Task ${taskInfo.task_id} polling complete. Status: ${taskInfo.status}`);
                        resolve(taskInfo); // 任务完成 (成功或失败)
                    } else if (attempts >= this.maxPollingAttempts) {
                        console.warn(`ApiClient: Task polling reached max attempts (${this.maxPollingAttempts}).`);
                        reject(new Error('任务处理超时，请稍后再试。'));
                    } else {
                        // 任务仍在进行中，继续轮询
                        setTimeout(poll, this.pollingInterval);
                    }
                } catch (error) {
                    console.error('ApiClient: Polling error:', error.message);
                    reject(error); // 轮询过程中发生错误
                }
            };

            console.log(`ApiClient: Starting to poll task at ${taskStatusUrl}`);
            poll(); // 开始轮询
        });
    }

    /**
     * 获取生成的图片
     * @param {string} imageId - 图片ID
     * @returns {Promise<string>} - 返回图片的base64数据
     */
    // @deprecated 后端未提供 /image/:id 路由；请改用 /api/images/:id（需要认证）
    async getGeneratedImage(imageId) {
        try {
            const response = await fetch(`${this.getBaseUrl()}/image/${imageId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.text();
        } catch (error) {
            console.error('获取图片失败:', error);
            throw error;
        }
    }

    /**
     * 获取生成的音频
     * @param {string} audioId - 音频ID
     * @returns {Promise<ArrayBuffer>} - 返回音频数据
     */
    // @deprecated 后端未提供 /audio/:id 路由；音频请直接使用 /api/generate (type=audio) 的返回
    async getGeneratedAudio(audioId) {
        try {
            const response = await fetch(`${this.getBaseUrl()}/audio/${audioId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.arrayBuffer();
        } catch (error) {
            console.error('获取音频失败:', error);
            throw error;
        }
    }

    /**
     * 下载音频文件
     * @param {string} audioId - 音频ID
     * @returns {Promise<Blob>} - 返回音频Blob对象
     */
    async downloadAudio(audioId) {
        try {
            const audioBuffer = await this.getGeneratedAudio(audioId);
            return new Blob([audioBuffer], { type: 'audio/mpeg' });
        } catch (error) {
            console.error('下载音频失败:', error);
            throw error;
        }
    }

    /**
     * 优化文本提示词
     * @param {string} text - 原始文本
     * @returns {Promise<string>} - 返回优化后的文本
     */
    async optimizeText(text) {
        try {
            console.log(`ApiClient: Optimizing text: ${text.substring(0, 50)}...`);
            
            const response = await fetch(`${this.getBaseUrl()}/api/optimize`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: text })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('ApiClient: Text optimization result:', result);
            
            if (result.optimized_text) {
                return result.optimized_text;
            } else {
                throw new Error('优化服务未返回优化后的文本');
            }
        } catch (error) {
            console.error('ApiClient: Text optimization failed:', error);
            throw error;
        }
    }

    /**
     * 翻译文本
     * @param {string} text - 要翻译的文本
     * @param {string} targetLang - 目标语言 (默认 'en')
     * @returns {Promise<string>} - 返回翻译后的文本
     */
    async translateText(text, targetLang = 'en') {
        try {
            console.log(`ApiClient: Translating text to ${targetLang}: ${text.substring(0, 50)}...`);
            
            const response = await fetch(`${this.getBaseUrl()}/api/translate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    text: text,
                    target_language: targetLang
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('ApiClient: Translation result:', result);
            
            if (result.translated_text) {
                return result.translated_text;
            } else {
                throw new Error('翻译服务未返回翻译后的文本');
            }
        } catch (error) {
            console.error('ApiClient: Translation failed:', error);
            throw error;
        }
    }

    /**
     * 使用Pollinations.AI生成图像（通过后端代理）
     * @param {string} prompt - 图像描述
     * @param {Object} options - 生成选项
     * @param {string} options.model - 模型名称 (flux, turbo, kontext)
     * @param {number} options.width - 图像宽度
     * @param {number} options.height - 图像高度
     * @param {number} options.seed - 随机种子
     * @param {boolean} options.nologo - 是否移除logo
     * @returns {Promise<string>} 图像URL
     */
    async generateImageWithPollinations(prompt, options = {}) {
        try {
            const {
                model = 'flux',
                width = 1024,
                height = 1024,
                seed = -1,
                nologo = true
            } = options;

            console.log(`ApiClient: Generating image with Pollinations - Prompt: ${prompt.substring(0, 50)}..., Model: ${model}, Size: ${width}x${height}`);

            // 通过后端代理调用Pollinations.AI
            const response = await fetch(`${this.getBaseUrl()}/api/pollinations/image`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt,
                    model,
                    width,
                    height,
                    seed,
                    nologo
                })
            });

            if (!response.ok) {
                throw new Error(`Pollinations proxy error: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            console.log('ApiClient: Pollinations proxy result:', result);
            
            if (result.data) {
                // 返回base64格式的图像数据
                return `data:image/jpeg;base64,${result.data}`;
            } else {
                throw new Error('Pollinations代理未返回图像数据');
            }
        } catch (error) {
            console.error(`ApiClient: Pollinations image generation failed:`, error.message);
            throw error;
        }
    }

    /**
     * 获取可用的图像模型
     * @returns {Array} 模型列表
     */
    getAvailableImageModels() {
        return [
            { id: 'flux', name: 'FLUX', description: '高质量图像生成，适合艺术创作' },
            { id: 'turbo', name: 'Turbo', description: '快速生成，适合快速原型' },
            { id: 'kontext', name: 'Kontext', description: '图像到图像生成，适合图像编辑' }
        ];
    }

    /**
     * 获取预设的图像尺寸
     * @returns {Array} 尺寸列表
     */
    getPresetImageSizes() {
        return [
            { id: 'square', name: '正方形', width: 1024, height: 1024 },
            { id: 'portrait', name: '竖版', width: 768, height: 1024 },
            { id: 'landscape', name: '横版', width: 1024, height: 768 },
            { id: 'wide', name: '宽屏', width: 1280, height: 720 },
            { id: 'ultrawide', name: '超宽', width: 1920, height: 1080 }
        ];
    }

    /**
     * 生成语音（专门为语音页面使用）
     * @param {Object} options - 语音生成选项
     * @param {string} options.text - 要转换的文本
     * @param {string} options.voice - 音色选择
     * @param {number} options.speed - 语速
     * @returns {Promise<Object>} 返回包含音频URL的结果对象
     */
    async generateVoice(options) {
        try {
            const { text, voice = 'nova', speed = 1.0 } = options;
            
            console.log(`ApiClient: Generating voice - Text: ${text.substring(0, 50)}..., Voice: ${voice}, Speed: ${speed}`);

            const response = await fetch(`${this.getBaseUrl()}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                    type: 'audio',
                    voice: voice,
                    speed: speed,
                    mode: 'tts'
                })
            });

            if (!response.ok) {
                let errorMessage = `HTTP错误: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (e) {
                    // 如果无法解析错误信息，使用默认错误
                }
                throw new Error(errorMessage);
            }

            // 对于音频生成，后端应该返回音频的blob数据
            const audioBlob = await response.blob();
            const mimeType = audioBlob.type || response.headers.get('content-type') || '';
            let fileExtension = 'wav';
            const lowerMime = (mimeType || '').toLowerCase();
            if (lowerMime.includes('mpeg') || lowerMime.includes('mp3')) fileExtension = 'mp3';
            else if (lowerMime.includes('ogg')) fileExtension = 'ogg';
            else if (lowerMime.includes('wav') || lowerMime.includes('wave') || lowerMime.includes('x-wav')) fileExtension = 'wav';
            
            // 创建音频URL
            const audioUrl = URL.createObjectURL(audioBlob);
            
            console.log('ApiClient: Voice generation successful, audio URL created');
            
            return {
                success: true,
                audioUrl: audioUrl,
                blob: audioBlob,
                mimeType,
                fileExtension
            };

        } catch (error) {
            console.error('ApiClient: Voice generation failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * 获取可用的语音模型
     * @returns {Array} 语音模型列表
     */
    getAvailableVoiceModels() {
        return [
            { id: 'nova', name: 'Nova', description: '女声-清晰自然' },
            { id: 'alloy', name: 'Alloy', description: '男声-温和友好' },
            { id: 'echo', name: 'Echo', description: '男声-深沉有力' },
            { id: 'fable', name: 'Fable', description: '男声-年轻活泼' },
            { id: 'onyx', name: 'Onyx', description: '男声-磁性成熟' },
            { id: 'shimmer', name: 'Shimmer', description: '女声-甜美温柔' }
        ];
    }

    /**
     * 获取语速选项
     * @returns {Array} 语速选项列表
     */
    getVoiceSpeedOptions() {
        return [
            { value: 0.25, label: '0.25x - 极慢' },
            { value: 0.5, label: '0.5x - 很慢' },
            { value: 0.75, label: '0.75x - 慢' },
            { value: 1.0, label: '1.0x - 正常' },
            { value: 1.25, label: '1.25x - 稍快' },
            { value: 1.5, label: '1.5x - 快' },
            { value: 2.0, label: '2.0x - 很快' },
            { value: 3.0, label: '3.0x - 极快' },
            { value: 4.0, label: '4.0x - 超快' }
        ];
    }
}

// 导出到全局作用域
window.APIClient = new ApiClient(); 