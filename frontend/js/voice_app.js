/**
 * AISTONE语音合成应用主脚本
 * 处理语音生成、播放、下载等功能
 */

class VoiceApp {
    constructor() {
        this.apiClient = null;
        this.uiHandler = null;
        this.currentAudioUrl = null;
        this.currentAudioBlob = null;
        this.isGenerating = false;
        this.abortController = null;
        this.waveformCtx = null;
        this.waveformAnimation = null;
        this.logs = [];
        
        this.init();
    }

    init() {
        // 等待依赖加载完成
        this.waitForDependencies()
            .then(() => {
                this.apiClient = window.APIClient;
                this.uiHandler = window.UIHandler;
                this.setupEventListeners();
                this.setupTextCounter();
                this.setupSpeedSlider();
                this.setupExamples();
                this.handleUrlParameters(); // 处理URL参数
                this.initWaveform();
                this.restoreHistory();
                console.log('语音应用初始化完成');
            })
            .catch(error => {
                console.error('语音应用初始化失败:', error);
                this.showError('应用初始化失败，请刷新页面重试');
            });
    }

    async waitForDependencies() {
        // 仅依赖 APIClient 即可运行，避免因其他脚本加载异常导致语音页失效
        const maxWait = 10000; // 最大等待10秒
        const startTime = Date.now();
        while (Date.now() - startTime < maxWait) {
            if (window.APIClient) {
                return Promise.resolve();
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        throw new Error('依赖加载超时: APIClient 未准备就绪');
    }

    setupEventListeners() {
        // 语音生成表单提交
        const form = document.getElementById('voice-generation-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.generateVoice();
            });
        }
        // 兜底：按钮点击也触发，防止某些浏览器/自定义表单行为导致 submit 未触发
        const generateBtn = document.getElementById('generate-voice-btn');
        if (generateBtn) {
            generateBtn.addEventListener('click', (e) => {
                // 如果不是表单原生提交，依然手动触发
                if (form) e.preventDefault();
                this.generateVoice();
            });
        }

        // 下载按钮
        const downloadBtn = document.getElementById('download-audio-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadAudio());
        }

        // 复制链接按钮
        const copyBtn = document.getElementById('copy-audio-url-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyAudioUrl());
        }

        // 分享按钮
        const shareBtn = document.getElementById('share-audio-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareAudio());
        }

        // 保存按钮
        const saveBtn = document.getElementById('save-audio-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveAudio());
        }

        // 音频播放完成事件
        const audioPlayer = document.getElementById('generated-audio');
        if (audioPlayer) {
            audioPlayer.addEventListener('loadedmetadata', () => {
                this.updateAudioInfo();
            });
            audioPlayer.addEventListener('play', () => this.startWaveform());
            audioPlayer.addEventListener('pause', () => this.stopWaveform());
        }

        // 文本按钮
        const optimizeBtn = document.getElementById('optimize-voice-text-btn');
        const translateBtn = document.getElementById('translate-voice-text-btn');
        const clearBtn = document.getElementById('clear-voice-text-btn');
        if (optimizeBtn) optimizeBtn.addEventListener('click', () => this.optimizeText());
        if (translateBtn) translateBtn.addEventListener('click', () => this.translateText());
        if (clearBtn) clearBtn.addEventListener('click', () => this.clearText());
    }

    setupTextCounter() {
        const textInput = document.getElementById('voice-text-input');
        const textCount = document.getElementById('text-count');
        
        if (textInput && textCount) {
            textInput.addEventListener('input', () => {
                const count = textInput.value.length;
                textCount.textContent = count;
                
                // 接近限制时变色提醒
                if (count > 800) {
                    textCount.style.color = '#e74c3c';
                } else if (count > 600) {
                    textCount.style.color = '#f39c12';
                } else {
                    textCount.style.color = '#666';
                }
            });
        }
    }

    setupSpeedSlider() {
        const speedSlider = document.getElementById('voice-speed');
        const speedDisplay = document.getElementById('speed-display');
        
        if (speedSlider && speedDisplay) {
            speedSlider.addEventListener('input', () => {
                speedDisplay.textContent = speedSlider.value + 'x';
            });
        }
    }

    setupExamples() {
        const exampleBtns = document.querySelectorAll('.example-btn[data-text]');
        const textInput = document.getElementById('voice-text-input');
        
        exampleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (textInput) {
                    textInput.value = btn.dataset.text;
                    textInput.dispatchEvent(new Event('input')); // 触发计数器更新
                    textInput.focus();
                }
            });
        });
    }

    handleUrlParameters() {
        // 解析URL参数
        const urlParams = new URLSearchParams(window.location.search);
        const text = urlParams.get('text');
        const source = urlParams.get('source');
        
        if (text) {
            const textInput = document.getElementById('voice-text-input');
            if (textInput) {
                // 解码并填充文本
                textInput.value = decodeURIComponent(text);
                textInput.dispatchEvent(new Event('input')); // 触发计数器更新
                
                // 如果来源是主页，显示欢迎信息
                if (source === 'main') {
                    this.showInfo('已自动填入您在主页输入的文本，您可以直接生成语音或进行修改。');
                }
                
                // 滚动到输入框
                textInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        
        // 清理URL参数（可选，保持URL简洁）
        if (text || source) {
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
        }
    }

    async generateVoice() {
        if (this.isGenerating) return;

        const textInput = document.getElementById('voice-text-input');
        const voiceModel = document.getElementById('voice-model');
        const voiceSpeed = document.getElementById('voice-speed');
        const generateBtn = document.getElementById('generate-voice-btn');

        if (!textInput || !voiceModel || !voiceSpeed || !generateBtn) {
            this.showError('页面元素加载不完整，请刷新页面重试');
            return;
        }

        const text = textInput.value.trim();
        if (!text) {
            this.showError('请输入要转换的文本内容');
            textInput.focus();
            return;
        }

        if (text.length > 1000) {
            this.showError('文本内容不能超过1000个字符');
            return;
        }

        this.isGenerating = true;
        this.updateGenerateButton(true);
        this.updateProgress(2, '准备中...');

        try {
            const requestData = {
                text: text,
                voice: voiceModel.value,
                speed: parseFloat(voiceSpeed.value)
            };

            console.log('开始语音生成，参数:', requestData);
            this.log(`请求: ${JSON.stringify(requestData)}`);

            // 调用API生成语音
            this.abortController = new AbortController();
            const response = await this.apiClient.generateVoice(requestData);

            if (response.success && response.audioUrl) {
                this.currentAudioUrl = response.audioUrl;
                this.currentAudioBlob = response.blob || null;
                this.displayVoiceResult(response);
                this.showSuccess('语音生成成功！');
                this.updateProgress(100, '完成');
                this.saveHistory();
            } else {
                throw new Error(response.error || '语音生成失败');
            }

        } catch (error) {
            console.error('语音生成错误:', error);
            this.showError('语音生成失败: ' + error.message);
            this.log(`错误: ${error.message}`);
        } finally {
            this.isGenerating = false;
            this.updateGenerateButton(false);
            this.updateProgress(0);
            this.abortController = null;
        }
    }

    displayVoiceResult(response) {
        const resultSection = document.getElementById('voice-result-section');
        const audioPlayer = document.getElementById('generated-audio');

        if (!resultSection || !audioPlayer) return;

        // 设置音频源
        audioPlayer.src = response.audioUrl;
        audioPlayer.load();

        // 显示结果区域
        resultSection.style.display = 'block';
        
        // 滚动到结果区域
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // 存储生成参数用于信息显示
        this.lastGenerationParams = {
            voice: document.getElementById('voice-model').value,
            speed: document.getElementById('voice-speed').value,
            text: document.getElementById('voice-text-input').value
        };

        // 文件大小
        const fileSizeEl = document.getElementById('voice-filesize');
        if (fileSizeEl && this.currentAudioBlob && this.currentAudioBlob.size) {
            fileSizeEl.textContent = this.formatBytes(this.currentAudioBlob.size);
        }

        // 显示保存按钮（如果用户已登录）
        if (window.AuthManager && window.AuthManager.isLoggedIn()) {
            const saveBtn = document.getElementById('save-audio-btn');
            if (saveBtn) {
                saveBtn.style.display = 'inline-flex';
            }
        }
    }

    updateAudioInfo() {
        const audioPlayer = document.getElementById('generated-audio');
        const durationElement = document.getElementById('voice-duration');
        const modelElement = document.getElementById('used-voice-model');
        const speedElement = document.getElementById('used-voice-speed');

        if (audioPlayer && this.lastGenerationParams) {
            // 更新时长
            if (durationElement) {
                const duration = audioPlayer.duration;
                if (!isNaN(duration)) {
                    const minutes = Math.floor(duration / 60);
                    const seconds = Math.floor(duration % 60);
                    durationElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                }
            }

            // 更新音色信息
            if (modelElement) {
                const voiceNames = {
                    'nova': 'Nova (女声)',
                    'alloy': 'Alloy (男声)',
                    'echo': 'Echo (男声)',
                    'fable': 'Fable (男声)',
                    'onyx': 'Onyx (男声)',
                    'shimmer': 'Shimmer (女声)'
                };
                modelElement.textContent = voiceNames[this.lastGenerationParams.voice] || this.lastGenerationParams.voice;
            }

            // 更新语速信息
            if (speedElement) {
                speedElement.textContent = this.lastGenerationParams.speed + 'x';
            }
        }
    }

    async downloadAudio() {
        if (!this.currentAudioUrl) {
            this.showError('没有可下载的音频文件');
            return;
        }

        try {
            const blob = this.currentAudioBlob || (await (await fetch(this.currentAudioUrl)).blob());
            
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const ext = (response && response.fileExtension) || 'wav';
            a.download = `aistone_voice_${Date.now()}.${ext}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            this.showSuccess('音频下载已开始');
        } catch (error) {
            console.error('下载失败:', error);
            this.showError('音频下载失败，请重试');
        }
    }

    async copyAudioUrl() {
        if (!this.currentAudioUrl) {
            this.showError('当前没有可复制的音频链接');
            return;
        }
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(this.currentAudioUrl);
            } else {
                const ta = document.createElement('textarea');
                ta.value = this.currentAudioUrl;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
            }
            this.showSuccess('音频链接已复制');
        } catch (e) {
            this.showError('复制失败，请手动复制');
        }
    }

    async shareAudio() {
        if (!this.currentAudioUrl) {
            this.showError('没有可分享的音频文件');
            return;
        }

        // 检查Web Share API支持
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'AISTONE语音合成',
                    text: '我使用AISTONE生成了一段AI语音，快来听听吧！',
                    url: window.location.href
                });
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('分享失败:', error);
                    this.fallbackShare();
                }
            }
        } else {
            this.fallbackShare();
        }
    }

    fallbackShare() {
        // 降级分享方案：复制链接
        const url = window.location.href;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(() => {
                this.showSuccess('页面链接已复制到剪贴板');
            });
        } else {
            // 更老的浏览器降级方案
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showSuccess('页面链接已复制到剪贴板');
        }
    }

    async saveAudio() {
        if (!this.currentAudioUrl) {
            this.showError('没有可保存的音频文件');
            return;
        }

        if (!window.AuthManager || !window.AuthManager.isLoggedIn()) {
            this.showError('请先登录再保存音频');
            return;
        }

        try {
            // 这里应该调用保存音频到用户个人中心的API
            // 暂时显示功能开发中的提示
            this.showInfo('音频保存功能正在开发中，敬请期待！');
            
            // TODO: 实现音频保存到用户个人中心
            /*
            const saveResult = await this.apiClient.saveAudio({
                audioUrl: this.currentAudioUrl,
                text: this.lastGenerationParams.text,
                voice: this.lastGenerationParams.voice,
                speed: this.lastGenerationParams.speed
            });

            if (saveResult.success) {
                this.showSuccess('音频已保存到个人中心');
            } else {
                throw new Error(saveResult.error || '保存失败');
            }
            */

        } catch (error) {
            console.error('保存音频失败:', error);
            this.showError('音频保存失败: ' + error.message);
        }
    }

    updateGenerateButton(isLoading) {
        const generateBtn = document.getElementById('generate-voice-btn');
        if (!generateBtn) return;

        const btnText = generateBtn.querySelector('.btn-text');
        const btnLoading = generateBtn.querySelector('.btn-loading');

        if (isLoading) {
            generateBtn.disabled = true;
            if (btnText) btnText.style.display = 'none';
            if (btnLoading) btnLoading.style.display = 'flex';
        } else {
            generateBtn.disabled = false;
            if (btnText) btnText.style.display = 'inline';
            if (btnLoading) btnLoading.style.display = 'none';
        }
    }

    updateProgress(percent = 0, label = '') {
        const bar = document.getElementById('voice-progress-bar');
        const box = document.getElementById('voice-progress');
        const text = document.getElementById('voice-progress-label');
        if (!bar || !box) return;
        if (percent > 0 && percent < 100) {
            box.style.display = 'block';
            bar.style.width = `${Math.max(2, Math.min(100, percent))}%`;
            if (text) text.textContent = label || '处理中...';
        } else if (percent >= 100) {
            bar.style.width = '100%';
            if (text) text.textContent = label || '完成';
            setTimeout(() => { if (box) box.style.display = 'none'; }, 600);
        } else {
            box.style.display = 'none';
            bar.style.width = '0%';
        }
    }

    log(message) {
        const ts = new Date().toLocaleTimeString();
        const line = `[${ts}] ${message}`;
        this.logs.push(line);
        const el = document.getElementById('voice-log');
        if (el) {
            el.textContent += (el.textContent ? '\n' : '') + line;
            el.scrollTop = el.scrollHeight;
        }
    }

    initWaveform() {
        const canvas = document.getElementById('voice-waveform');
        if (!canvas) return;
        this.waveformCtx = canvas.getContext('2d');
        // 初始清屏
        this.waveformCtx.fillStyle = '#0e1424';
        this.waveformCtx.fillRect(0, 0, canvas.width, canvas.height);
    }

    startWaveform() {
        const audio = document.getElementById('generated-audio');
        const canvas = document.getElementById('voice-waveform');
        if (!audio || !canvas || !this.waveformCtx) return;
        const ctx = this.waveformCtx;
        const width = canvas.width;
        const height = canvas.height;
        cancelAnimationFrame(this.waveformAnimation);
        const draw = () => {
            // 轻量级占位波形：随时间滚动的条形动画
            ctx.fillStyle = '#0e1424';
            ctx.fillRect(0, 0, width, height);
            const now = performance.now() / 200;
            const bars = 64;
            const barWidth = width / bars;
            for (let i = 0; i < bars; i++) {
                const h = (Math.sin(now + i * 0.5) * 0.5 + 0.5) * (height * 0.8);
                ctx.fillStyle = '#00cfff';
                const x = i * barWidth + 1;
                const y = (height - h) / 2;
                ctx.fillRect(x, y, Math.max(1, barWidth - 2), h);
            }
            this.waveformAnimation = requestAnimationFrame(draw);
        };
        this.waveformAnimation = requestAnimationFrame(draw);
    }

    stopWaveform() {
        cancelAnimationFrame(this.waveformAnimation);
    }

    formatBytes(bytes) {
        if (!bytes && bytes !== 0) return '--';
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), sizes.length - 1);
        const val = bytes / Math.pow(1024, i);
        return `${val.toFixed(val >= 100 ? 0 : val >= 10 ? 1 : 2)} ${sizes[i]}`;
    }

    saveHistory() {
        try {
            const item = {
                t: Date.now(),
                text: (this.lastGenerationParams && this.lastGenerationParams.text) || '',
                voice: (this.lastGenerationParams && this.lastGenerationParams.voice) || '',
                speed: (this.lastGenerationParams && this.lastGenerationParams.speed) || '1.0',
                url: this.currentAudioUrl || ''
            };
            const key = 'voice_history';
            const list = JSON.parse(localStorage.getItem(key) || '[]');
            list.unshift(item);
            localStorage.setItem(key, JSON.stringify(list.slice(0, 10)));
            this.renderHistory(list.slice(0, 10));
            document.getElementById('voice-history-section').style.display = 'block';
        } catch(e) {}
    }

    restoreHistory() {
        try {
            const key = 'voice_history';
            const list = JSON.parse(localStorage.getItem(key) || '[]');
            if (list.length) {
                this.renderHistory(list);
                const sec = document.getElementById('voice-history-section');
                if (sec) sec.style.display = 'block';
            }
        } catch(e) {}
    }

    renderHistory(list) {
        const ul = document.getElementById('voice-history-list');
        if (!ul) return;
        ul.innerHTML = '';
        list.forEach((it, idx) => {
            const li = document.createElement('li');
            li.style.cssText = 'padding:10px; background:#0e1424; border:1px solid #2A3A57; border-radius:8px; display:flex; align-items:center; gap:10px;';
            const meta = document.createElement('div');
            meta.style.cssText = 'flex:1; color:#AAB4D4;';
            meta.innerHTML = `<div style="font-size:12px;">${new Date(it.t).toLocaleString()} • ${it.voice} • ${it.speed}x</div><div style="font-size:12px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width: 100%;">${(it.text || '').replace(/[\n\r]+/g,' ').slice(0,120)}</div>`;
            const play = document.createElement('button');
            play.className = 'action-btn';
            play.textContent = '▶ 播放';
            play.addEventListener('click', () => {
                const audio = document.getElementById('generated-audio');
                if (audio) {
                    audio.src = it.url;
                    audio.play();
                }
            });
            const copy = document.createElement('button');
            copy.className = 'action-btn';
            copy.textContent = '复制链接';
            copy.addEventListener('click', async () => {
                try { await navigator.clipboard.writeText(it.url); this.showSuccess('已复制'); } catch(e) { this.showError('复制失败'); }
            });
            li.appendChild(meta);
            li.appendChild(play);
            li.appendChild(copy);
            ul.appendChild(li);
        });
    }

    async optimizeText() {
        const textInput = document.getElementById('voice-text-input');
        if (!textInput || !textInput.value.trim()) {
            this.showError('请先输入文本');
            return;
        }
        try {
            this.updateProgress(15, '优化文本...');
            const optimized = await this.apiClient.optimizeText(textInput.value.trim());
            textInput.value = optimized;
            textInput.dispatchEvent(new Event('input'));
            this.showSuccess('优化完成');
        } catch (e) {
            this.showError('优化失败，请稍后重试');
        } finally {
            this.updateProgress(0);
        }
    }

    async translateText() {
        const textInput = document.getElementById('voice-text-input');
        const lang = (window.getCurrentLang && window.getCurrentLang()) || 'zh';
        if (!textInput || !textInput.value.trim()) {
            this.showError('请先输入文本');
            return;
        }
        try {
            this.updateProgress(15, '翻译中...');
            const target = lang === 'zh' ? 'en' : 'zh';
            const translated = await this.apiClient.translateText(textInput.value.trim(), target);
            textInput.value = translated;
            textInput.dispatchEvent(new Event('input'));
            this.showSuccess('翻译完成');
        } catch (e) {
            this.showError('翻译失败，请稍后重试');
        } finally {
            this.updateProgress(0);
        }
    }

    clearText() {
        const textInput = document.getElementById('voice-text-input');
        if (textInput) {
            textInput.value = '';
            textInput.dispatchEvent(new Event('input'));
        }
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showInfo(message) {
        this.showMessage(message, 'info');
    }

    showMessage(message, type = 'info') {
        // 创建消息提示
        const messageEl = document.createElement('div');
        messageEl.className = `voice-message voice-message-${type}`;
        messageEl.textContent = message;
        
        // 样式
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;

        // 不同类型的背景色
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            info: '#17a2b8'
        };
        messageEl.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(messageEl);

        // 自动移除
        setTimeout(() => {
            messageEl.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, 3000);
    }
}

// 添加动画CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.VoiceApp = new VoiceApp();
});