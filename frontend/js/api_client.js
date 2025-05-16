/**
 * API客户端类，处理与后端的所有通信
 */
class ApiClient {
    constructor(baseUrl = 'http://localhost:5000/api') { // 使用完整的后端地址
        this.baseUrl = baseUrl;
        this.pollingInterval = 2000; // 轮询间隔ms，例如2秒
        this.maxPollingAttempts = 30; // 最大轮询次数，例如 30 * 2s = 1分钟超时
        console.log('ApiClient initialized with baseUrl:', this.baseUrl); // 添加初始化日志
    }

    /**
     * 提交生成任务到后端
     * @param {string} text - 用户输入的文本
     * @param {string} type - 生成类型 ('image' 或 'audio')
     * @returns {Promise<Object>} - 返回包含 task_id 和 status_url 的对象
     */
    async submitGenerationTask(text, type) {
        const requestUrl = `${this.baseUrl}/generate`;
        console.log(`ApiClient: Submitting task to ${requestUrl} - Type: ${type}, Text: ${text.substring(0, 50)}...`);
        try {
            const response = await fetch(requestUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    text: text,
                    type: type
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('ApiClient: Submit task error - Response not OK', response.status, errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            console.log('ApiClient: Task submitted successfully', responseData);
            return responseData;

        } catch (error) {
            console.error('ApiClient: submitGenerationTask - 请求失败:', error.message);
            if (error instanceof Error) {
                throw error;
            }
            throw new Error(error.toString());
        }
    }

    /**
     * 获取指定任务ID的状态
     * @param {string} taskStatusUrl - 任务状态查询的完整URL或相对路径 (例如 /api/tasks/task_id)
     * @returns {Promise<Object>} - 返回任务状态信息
     */
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
    async getGeneratedImage(imageId) {
        try {
            const response = await fetch(`${this.baseUrl}/image/${imageId}`);
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
     * @returns {Promise<string>} - 返回音频的base64数据
     */
    async getGeneratedAudio(audioId) {
        try {
            const response = await fetch(`${this.baseUrl}/audio/${audioId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.text();
        } catch (error) {
            console.error('获取音频失败:', error);
            throw error;
        }
    }

    /**
     * 下载音频文件
     * @param {string} audioId - 音频ID
     * @returns {Promise<Blob>} - 返回音频文件Blob
     */
    async downloadAudio(audioId) {
        try {
            const response = await fetch(`${this.baseUrl}/audio/${audioId}/download`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.blob();
        } catch (error) {
            console.error('下载音频失败:', error);
            throw error;
        }
    }
}

// 导出API客户端实例
const apiClient = new ApiClient();
// 若要在其他模块中使用，例如: import { apiClient } from './api_client.js'; (如果使用ES模块)
// 或者直接使用全局的 apiClient (如果按顺序加载脚本) 