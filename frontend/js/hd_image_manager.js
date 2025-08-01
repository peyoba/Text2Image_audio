/**
 * 前端高清图片管理器
 * 实现图片保存、查看、下载等功能
 */

class HDImageManager {
    constructor() {
        this.maxImagesPerDay = 3;
        this.maxImageSize = 2 * 1024 * 1024; // 2MB
        this.baseUrl = '/api';
        this.currentImageId = null;
        
        console.log('HDImageManager 初始化');
        // 初始化
        this.init();
    }

    /**
     * 初始化
     */
    init() {
        // 检查认证状态
        if (!window.authManager || !window.authManager.isLoggedIn()) {
            console.log('用户未登录，图片管理功能不可用');
            return;
        }

        // 加载今日图片
        this.loadDailyImages();
        
        // 更新统计信息
        this.updateStats();
        
        // 设置定时器，每小时更新一次
        setInterval(() => {
            this.updateStats();
        }, 3600000); // 1小时
    }

    /**
     * 保存高清图片
     * @param {Object} imageData - 图片数据
     * @returns {Promise<Object>} 保存结果
     */
    async saveHDImage(imageData) {
        console.log('HDImageManager: 开始保存图片', imageData);
        try {
            // 检查认证状态
            if (!window.authManager || !window.authManager.isLoggedIn()) {
                console.error('HDImageManager: 用户未登录');
                throw new Error('请先登录');
            }

            console.log('HDImageManager: 用户已登录，继续保存');

            // 检查图片大小
            const sizeInBytes = Math.ceil((imageData.data.length * 3) / 4);
            console.log('HDImageManager: 图片大小:', sizeInBytes, 'bytes');
            if (sizeInBytes > this.maxImageSize) {
                throw new Error('图片太大，请重试（最大2MB）');
            }

            // 显示保存中状态
            this.showSavingStatus('正在保存高清图片...');
            
            const requestData = {
                prompt: imageData.prompt,
                data: imageData.data, // 原始高清数据
                width: imageData.width,
                height: imageData.height,
                seed: imageData.seed,
                model: imageData.model,
                negative: imageData.negative
            };
            
            console.log('HDImageManager: 发送保存请求', {
                url: `${this.baseUrl}/images/save`,
                data: { ...requestData, data: requestData.data.substring(0, 50) + '...' }
            });
            
            // 发送到后端
            const response = await fetch(`${this.baseUrl}/images/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.authManager.getToken()}`
                },
                body: JSON.stringify({
                    prompt: imageData.prompt,
                    data: imageData.data, // 原始高清数据
                    width: imageData.width,
                    height: imageData.height,
                    seed: imageData.seed,
                    model: imageData.model,
                    negative: imageData.negative
                })
            });

            const result = await response.json();
            console.log('HDImageManager: 保存响应', result);
            
            if (result.success) {
                this.hideSavingStatus();
                this.showMessage('高清图片保存成功！', 'success');
                console.log('HDImageManager: 图片保存成功');
                
                // 重新加载图片列表
                this.loadDailyImages();
                this.updateStats();
                
                return result;
            } else {
                console.error('HDImageManager: 保存失败', result.error);
                throw new Error(result.error || '保存失败');
            }
        } catch (error) {
            this.hideSavingStatus();
            this.showMessage(error.message, 'error');
            throw error;
        }
    }

    /**
     * 获取图片列表
     * @returns {Promise<Object>} 图片列表
     */
    async getDailyImages() {
        try {
            const response = await fetch(`${this.baseUrl}/images/daily`, {
                headers: {
                    'Authorization': `Bearer ${window.authManager.getToken()}`
                }
            });

            const result = await response.json();
            
            if (result.success) {
                return result;
            } else {
                throw new Error(result.error || '获取图片列表失败');
            }
        } catch (error) {
            console.error('获取图片列表错误:', error);
            throw error;
        }
    }

    /**
     * 获取高清图片
     * @param {string} imageId - 图片ID
     * @returns {Promise<Object>} 图片数据
     */
    async getHDImage(imageId) {
        try {
            const response = await fetch(`${this.baseUrl}/images/${imageId}`, {
                headers: {
                    'Authorization': `Bearer ${window.authManager.getToken()}`
                }
            });

            const result = await response.json();
            
            if (result.data) {
                return result;
            } else {
                throw new Error(result.error || '获取图片失败');
            }
        } catch (error) {
            console.error('获取高清图片错误:', error);
            throw error;
        }
    }

    /**
     * 下载高清图片
     * @param {string} imageId - 图片ID
     */
    async downloadHDImage(imageId) {
        try {
            this.showMessage('正在准备下载...', 'info');
            
            const response = await fetch(`${this.baseUrl}/images/download/${imageId}`, {
                headers: {
                    'Authorization': `Bearer ${window.authManager.getToken()}`
                }
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `image_${imageId}.jpg`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                
                this.showMessage('下载成功！', 'success');
            } else {
                const error = await response.json();
                throw new Error(error.error || '下载失败');
            }
        } catch (error) {
            this.showMessage(error.message, 'error');
        }
    }

    /**
     * 删除图片
     * @param {string} imageId - 图片ID
     */
    async deleteImage(imageId) {
        try {
            if (!confirm('确定要删除这张图片吗？')) {
                return;
            }

            const response = await fetch(`${this.baseUrl}/images/${imageId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${window.authManager.getToken()}`
                }
            });

            const result = await response.json();
            
            if (result.success) {
                this.showMessage('图片删除成功！', 'success');
                this.loadDailyImages();
                this.updateStats();
            } else {
                throw new Error(result.error || '删除失败');
            }
        } catch (error) {
            this.showMessage(error.message, 'error');
        }
    }

    /**
     * 加载今日图片
     */
    async loadDailyImages() {
        try {
            const result = await this.getDailyImages();
            this.renderImageGrid(result.images);
            this.updateImageCount(result.count, result.maxCount);
        } catch (error) {
            console.error('加载今日图片错误:', error);
            this.showMessage('加载图片列表失败', 'error');
        }
    }

    /**
     * 渲染图片网格
     * @param {Array} images - 图片列表
     */
    renderImageGrid(images) {
        const container = document.getElementById('daily-images');
        if (!container) return;

        container.innerHTML = '';

        if (images.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📷</div>
                    <h3>还没有保存的图片</h3>
                    <p>生成的图片会在这里显示，最多保存3张</p>
                </div>
            `;
            return;
        }

        images.forEach(image => {
            const imageCard = this.createImageCard(image);
            container.appendChild(imageCard);
        });
    }

    /**
     * 创建图片卡片
     * @param {Object} image - 图片信息
     * @returns {HTMLElement} 图片卡片元素
     */
    createImageCard(image) {
        const card = document.createElement('div');
        card.className = 'image-card';
        card.innerHTML = `
            <div class="image-preview">
                <div class="image-placeholder" data-image-id="${image.id}">
                    <div class="loading-spinner"></div>
                    <span>点击查看高清图片</span>
                </div>
            </div>
            <div class="image-info">
                <h3 class="image-prompt">${this.truncateText(image.prompt, 50)}</h3>
                <div class="image-meta">
                    <span class="meta-item">${image.width}×${image.height}</span>
                    <span class="meta-item">${image.model}</span>
                    <span class="meta-item">${(image.size / 1024 / 1024).toFixed(2)}MB</span>
                </div>
                <div class="image-time">
                    ${new Date(image.created_at).toLocaleString()}
                </div>
            </div>
            <div class="image-actions">
                <button onclick="hdImageManager.viewImage('${image.id}')" class="btn btn-primary btn-small">
                    <span class="btn-icon">👁️</span>查看
                </button>
                <button onclick="hdImageManager.downloadHDImage('${image.id}')" class="btn btn-outline btn-small">
                    <span class="btn-icon">⬇️</span>下载
                </button>
                <button onclick="hdImageManager.deleteImage('${image.id}')" class="btn btn-danger btn-small">
                    <span class="btn-icon">🗑️</span>删除
                </button>
            </div>
        `;

        // 添加点击事件加载图片
        const placeholder = card.querySelector('.image-placeholder');
        placeholder.addEventListener('click', () => {
            this.viewImage(image.id);
        });

        return card;
    }

    /**
     * 查看高清图片
     * @param {string} imageId - 图片ID
     */
    async viewImage(imageId) {
        try {
            this.showLoading('正在加载高清图片...');
            
            const result = await this.getHDImage(imageId);
            this.currentImageId = imageId;
            
            // 显示高清图片模态框
            this.showImageModal(result);
            
            this.hideLoading();
        } catch (error) {
            this.hideLoading();
            this.showMessage(error.message, 'error');
        }
    }

    /**
     * 显示图片模态框
     * @param {Object} imageData - 图片数据
     */
    showImageModal(imageData) {
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        const modalCaption = document.getElementById('modalCaption');
        const modalInfo = document.getElementById('modalInfo');
        
        modalImg.src = `data:image/jpeg;base64,${imageData.data}`;
        modalCaption.textContent = imageData.prompt;
        modalInfo.innerHTML = `
            <div class="modal-info-item">
                <span class="info-label">尺寸:</span>
                <span class="info-value">${imageData.width}×${imageData.height}</span>
            </div>
            <div class="modal-info-item">
                <span class="info-label">模型:</span>
                <span class="info-value">${imageData.model}</span>
            </div>
            <div class="modal-info-item">
                <span class="info-label">种子:</span>
                <span class="info-value">${imageData.seed}</span>
            </div>
            <div class="modal-info-item">
                <span class="info-label">时间:</span>
                <span class="info-value">${new Date(imageData.created_at).toLocaleString()}</span>
            </div>
        `;
        
        modal.style.display = 'block';
    }

    /**
     * 更新统计信息
     */
    async updateStats() {
        try {
            const response = await fetch(`${this.baseUrl}/images/stats`, {
                headers: {
                    'Authorization': `Bearer ${window.authManager.getToken()}`
                }
            });

            const result = await response.json();
            
            if (result.success) {
                this.renderStats(result.stats);
            }
        } catch (error) {
            console.error('更新统计信息错误:', error);
        }
    }

    /**
     * 渲染统计信息
     * @param {Object} stats - 统计信息
     */
    renderStats(stats) {
        const statsContainer = document.getElementById('image-stats');
        if (!statsContainer) return;

        const remainingTime = this.calculateRemainingTime();
        
        statsContainer.innerHTML = `
            <div class="stat-item">
                <span class="stat-label">已生成:</span>
                <span class="stat-value">${stats.totalImages}/${stats.maxImages}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">剩余时间:</span>
                <span class="stat-value">${remainingTime}</span>
            </div>
        `;
    }

    /**
     * 计算剩余时间
     * @returns {string} 剩余时间字符串
     */
    calculateRemainingTime() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const diff = tomorrow - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    /**
     * 更新图片数量显示
     * @param {number} count - 当前数量
     * @param {number} maxCount - 最大数量
     */
    updateImageCount(count, maxCount) {
        const countElement = document.getElementById('imageCount');
        if (countElement) {
            countElement.textContent = `${count}/${maxCount}`;
        }
    }

    /**
     * 截断文本
     * @param {string} text - 原文本
     * @param {number} maxLength - 最大长度
     * @returns {string} 截断后的文本
     */
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    /**
     * 显示消息
     * @param {string} message - 消息内容
     * @param {string} type - 消息类型
     */
    showMessage(message, type = 'info') {
        if (window.authManager && window.authManager.showMessage) {
            window.authManager.showMessage(message, type);
        } else {
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    }

    /**
     * 显示保存状态
     * @param {string} message - 状态消息
     */
    showSavingStatus(message) {
        const statusEl = document.getElementById('saving-status');
        if (statusEl) {
            statusEl.textContent = message;
            statusEl.style.display = 'block';
        }
    }

    /**
     * 隐藏保存状态
     */
    hideSavingStatus() {
        const statusEl = document.getElementById('saving-status');
        if (statusEl) {
            statusEl.style.display = 'none';
        }
    }

    /**
     * 显示加载状态
     * @param {string} message - 加载消息
     */
    showLoading(message) {
        const loadingEl = document.getElementById('loading-overlay');
        if (loadingEl) {
            loadingEl.querySelector('.loading-message').textContent = message;
            loadingEl.style.display = 'flex';
        }
    }

    /**
     * 隐藏加载状态
     */
    hideLoading() {
        const loadingEl = document.getElementById('loading-overlay');
        if (loadingEl) {
            loadingEl.style.display = 'none';
        }
    }
}

// 创建全局实例
const hdImageManager = new HDImageManager();

// 导出供其他模块使用
window.hdImageManager = hdImageManager; 