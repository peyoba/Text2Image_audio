/**
 * Image display utilities module
 * High-verbosity, readable functions with safe fallbacks.
 *
 * Exposes a global namespace `window.ImageDisplay` so it can be consumed
 * without a bundler. Each function validates inputs and fails gracefully.
 */

(function () {
    'use strict';

    function ensureContainer() {
        var container = document.getElementById('image-result-container');
        if (!container) {
            console.error('ImageDisplay: #image-result-container not found');
            return null;
        }
        return container;
    }

    function clearContainer(container) {
        try { container.innerHTML = ''; } catch (_) {}
        container.style.display = 'none';
    }

    function showContainer(container) {
        container.style.display = 'block';
    }

    function isString(value) {
        return typeof value === 'string';
    }

    function isDataOrHttpUrl(value) {
        if (!isString(value)) return false;
        return value.startsWith('data:image') || value.startsWith('http') || value.startsWith('https');
    }

    function createInfo(text) {
        var info = document.createElement('div');
        info.className = 'image-info';
        info.textContent = text || '';
        return info;
    }

    function addImageActions(container, imageUrl) {
        var actionsDiv = document.createElement('div');
        actionsDiv.className = 'image-actions';

        var downloadBtn = document.createElement('a');
        downloadBtn.className = 'image-action-btn';
        downloadBtn.href = imageUrl;
        downloadBtn.download = 'AI生成图片_' + Date.now() + '.jpg';
        downloadBtn.textContent = (window.getCurrentLang && window.getCurrentLang()==='zh') ? '⬇️ 下载图片' : '⬇️ Download';

        var viewBtn = document.createElement('button');
        viewBtn.className = 'image-action-btn';
        viewBtn.textContent = (window.getCurrentLang && window.getCurrentLang()==='zh') ? '🔍 查看原图' : '🔍 View Original';
        viewBtn.onclick = function () { showImageModal(imageUrl, 1); };

        var copyBtn = document.createElement('button');
        copyBtn.className = 'image-action-btn';
        copyBtn.textContent = (window.getCurrentLang && window.getCurrentLang()==='zh') ? '📋 复制链接' : '📋 Copy Link';
        copyBtn.onclick = function () { copyImageData(imageUrl); };

        actionsDiv.appendChild(downloadBtn);
        actionsDiv.appendChild(viewBtn);
        actionsDiv.appendChild(copyBtn);
        container.appendChild(actionsDiv);
    }

    function showSingle(imageUrl) {
        var container = ensureContainer();
        if (!container) return;
        clearContainer(container);

        if (!isDataOrHttpUrl(imageUrl)) {
            console.error('ImageDisplay: invalid image url');
            return;
        }

        var img = document.createElement('img');
        img.id = 'generated-image';
        img.src = imageUrl;
        img.alt = 'AI生成的图片';

        img.onload = function () {
            var width = img.naturalWidth;
            var height = img.naturalHeight;
            var approxSizeKb = Math.round((img.src.length * 0.75) / 1024);
            container.appendChild(createInfo((window.t ? t('imageInfoSize') + ': ' : 'Size: ') + width + ' × ' + height + (window.t ? ' ' + t('pixels') + ' | ' : ' | ') + (window.t ? t('imageInfoFileSize') + ': ~' : '≈') + approxSizeKb + 'KB'));
            addImageActions(container, imageUrl);
        };

        img.onerror = function () {
            console.error('ImageDisplay: image load failed');
            var p = document.createElement('p');
            p.style.color = 'var(--color-error-text, #e74c3c)';
            p.style.textAlign = 'center';
            p.textContent = (window.getCurrentLang && window.getCurrentLang()==='zh') ? '图片加载失败，请重试' : 'Failed to load image';
            container.appendChild(p);
        };

        container.appendChild(img);
        showContainer(container);
    }

    function showMultiple(imageUrls) {
        var container = ensureContainer();
        if (!container) return;
        clearContainer(container);

        var valid = (Array.isArray(imageUrls) ? imageUrls : []).filter(isDataOrHttpUrl);
        if (!valid.length) {
            console.warn('ImageDisplay: no valid images to render');
            return;
        }

        var imageGrid = document.createElement('div');
        imageGrid.className = 'image-grid';
        switch (valid.length) {
            case 1: imageGrid.classList.add('single'); break;
            case 2: imageGrid.classList.add('double'); break;
            case 4: imageGrid.classList.add('quad'); break;
            default: imageGrid.classList.add('quad');
        }

        valid.forEach(function (url, index) {
            var img = document.createElement('img');
            img.src = url;
            img.alt = 'AI生成的图片 ' + (index + 1);
            img.dataset.index = String(index);
            img.addEventListener('click', function () { showImageModal(url, index + 1); });
            imageGrid.appendChild(img);
        });

        container.appendChild(imageGrid);
        container.appendChild(createInfo((window.t ? t('imageInfoCount').replace('{count}', valid.length) : ('Count: ' + valid.length))));

        var actionsDiv = document.createElement('div');
        actionsDiv.className = 'image-actions';
        var downloadAllBtn = document.createElement('button');
        downloadAllBtn.className = 'image-action-btn';
        downloadAllBtn.textContent = (window.getCurrentLang && window.getCurrentLang()==='zh') ? '⬇️ 下载全部' : '⬇️ Download All';
        downloadAllBtn.onclick = function () { downloadAll(valid); };
        var gridBtn = document.createElement('button');
        gridBtn.className = 'image-action-btn';
        gridBtn.textContent = (window.getCurrentLang && window.getCurrentLang()==='zh') ? '🏢 网格查看' : '🏢 Grid View';
        gridBtn.onclick = function () { showImageModal(valid[0], 1); };
        actionsDiv.appendChild(downloadAllBtn);
        actionsDiv.appendChild(gridBtn);
        container.appendChild(actionsDiv);

        showContainer(container);
    }

    function downloadAll(imageUrls) {
        (imageUrls || []).forEach(function (url, index) {
            try {
                var a = document.createElement('a');
                a.href = url;
                a.download = 'AI生成图片_' + (index + 1) + '_' + Date.now() + '.jpg';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } catch (_) {}
        });
        if (window.uiEnhancements && window.uiEnhancements.updateResultStatus) {
            window.uiEnhancements.updateResultStatus('\uD83D\uDCC1 ' + ((window.getCurrentLang && window.getCurrentLang()==='zh') ? ('开始下载 ' + imageUrls.length + ' 张图片') : ('Started download of ' + imageUrls.length + ' images')), 'success');
        }
    }

    function showImageModal(imageUrl, index) {
        // Reuse existing global if available
        if (typeof window.showImageModal === 'function') {
            try { return window.showImageModal(imageUrl, index); } catch (_) {}
        }
        // Minimal fallback modal
        var modal = document.createElement('div');
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.9);display:flex;justify-content:center;align-items:center;z-index:1000;cursor:pointer;';
        var img = document.createElement('img');
        img.src = imageUrl;
        img.style.cssText = 'max-width:90vw;max-height:90vh;object-fit:contain;border-radius:8px;box-shadow:0 10px 50px rgba(0,0,0,0.5);';
        var close = document.createElement('div');
        close.textContent = '✕';
        close.style.cssText = 'position:absolute;top:20px;right:30px;color:white;font-size:30px;font-weight:bold;user-select:none;';
        modal.appendChild(img);
        modal.appendChild(close);
        modal.onclick = function (e) { if (e.target === modal || e.target === close) document.body.removeChild(modal); };
        document.addEventListener('keydown', function esc(ev){ if (ev.key==='Escape'){ try{document.body.removeChild(modal);}catch(_){} document.removeEventListener('keydown', esc);} });
        document.body.appendChild(modal);
    }

    function copyImageData(imageUrl) {
        if (!imageUrl) return;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(imageUrl).then(function(){
                if (window.uiEnhancements && window.uiEnhancements.updateResultStatus) {
                    window.uiEnhancements.updateResultStatus('\uD83D\uDCCB ' + ((window.getCurrentLang && window.getCurrentLang()==='zh') ? '图片链接已复制到剪贴板' : 'Image link copied to clipboard'), 'success');
                }
            }).catch(function(){
                if (window.uiEnhancements && window.uiEnhancements.updateResultStatus) {
                    window.uiEnhancements.updateResultStatus((window.getCurrentLang && window.getCurrentLang()==='zh') ? '复制失败，请手动复制' : 'Copy failed, please copy manually', 'error');
                }
            });
        }
    }

    window.ImageDisplay = {
        showSingle: showSingle,
        showMultiple: showMultiple,
        downloadAll: downloadAll,
        copyImageData: copyImageData,
        showImageModal: showImageModal
    };
})();


