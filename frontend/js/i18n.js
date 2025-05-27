/**
 * 多语言配置文件
 * 支持中文和英文
 */
const i18n = {
    zh: {
        // 标题和描述
        title: '超感AI创作站',
        subtitle: '图片·语音·无限免费生成',
        
        // 输入区域
        inputTitle: '输入内容',
        examplesTitle: '💡 点击示例快速填充：',
        inputPlaceholder: '请输入描述文本，例如：一只可爱的猫咪在草地上玩耍...',
        generateButton: '开始生成',
        quickFillLabel: '快速填充示例：',
        smartOptimizeTip: '✨ 智能优化：自动将描述翻译并优化为高质量英文提示词，提升出图效果',
        negativePromptLabel: '负面提示词：',
        negativePromptPlaceholder: '输入不想要的元素，用逗号分隔',
        
        // 生成类型
        generationType: '生成类型',
        typeImage: '生成图片',
        typeAudio: '生成语音',
        
        // 图片选项
        imageOptions: '图片选项',
        aspectRatio: '宽高比例',
        aspectRatioSquare: '正方形 (1:1 - 1024x1024)',
        aspectRatioLandscape: '横向 (16:9 - 1280x720)',
        aspectRatioPortrait: '竖向 (9:16 - 720x1280)',
        aspectRatioStandard: '标准 (4:3 - 1024x768)',
        aspectRatioStandardVertical: '标准竖向 (3:4 - 768x1024)',
        aspectRatioCustom: '自定义',
        width: '宽度',
        height: '高度',
        noLogo: '去除水印',
        numImages: '生成数量',
        oneImage: '1张图片',
        twoImages: '2张图片',
        fourImages: '4张图片',
        
        // 快捷操作
        clearButton: '清空',
        optimizeButton: '优化',
        randomButton: '随机',
        
        // 状态提示
        loading: '正在处理中，请稍候...',
        imageGenerating: '正在生成图片，请稍候...',
        audioGenerating: '正在生成语音，请稍候...',
        error: '发生错误',
        pleaseInput: '请输入描述文本后再生成。',
        optimizationSuccess: '✨ 提示词优化完成！',
        optimizationFailed: '优化失败，请稍后重试',
        pleaseInputFirst: '请先输入文本内容',
        generationComplete: '生成完成！',
        
        // 示例提示
        imageHint: '💡 图片生成支持多种尺寸和数量选择',
        audioHint: '🎵 语音生成支持播放和下载功能',
        
        // 示例按钮
        examples: {
            cat: { name: '🐱 可爱猫咪', text: '一只可爱的猫咪在草地上玩耍，阳光明媚，高清摄影', type: 'image' },
            city: { name: '🌃 科技城市', text: '未来科技城市夜景，霓虹灯闪烁，赛博朋克风格，超高清', type: 'image' },
            beauty: { name: '🌸 古风美女', text: '古风美女，汉服飘逸，桃花盛开，国风插画，精美细节', type: 'image' },
            dragon: { name: '🐉 史诗巨龙', text: '一条凶猛的龙在火山上空盘旋，熔岩流淌，史诗感', type: 'image' },
            lake: { name: '🏞️ 雪山湖景', text: '宁静的湖面倒映着雪山和森林，黄昏，油画风格', type: 'image' },
            welcome: { name: '🎵 欢迎语音', text: '欢迎使用AI内容生成器，希望您能创造出精彩的作品', type: 'audio' },
            weather: { name: '🌦️ 天气播报', text: '今天天气真不错，适合出门散步和拍照', type: 'audio' },
            forest: { name: '🌲 魔法森林', text: '梦幻森林，精灵飞舞，魔法光芒，幻想风景画', type: 'image' },
            mountain: { name: '⛰️ 星空山峰', text: '星空下的山峰，银河璀璨，摄影作品，震撼视觉', type: 'image' },
            robot: { name: '🤖 机械朋克', text: '机械朋克机器人，金属质感，蒸汽朋克风格，工业美学', type: 'image' },
            thanks: { name: '🙏 感谢语音', text: '感谢您的使用，祝您生活愉快，工作顺利', type: 'audio' },
            garden: { name: '🌸 日式庭院', text: '樱花飘落的日式庭院，宁静优美，水墨画风格', type: 'image' }
        },

        // 使用提示
        tips: {
            example: '💡 尝试点击示例按钮快速填充内容',
            optimize: '✨ 使用"优化"按钮提升AI生成效果',
            random: '🎲 点击"随机"按钮获取灵感',
            imageSize: '🖼️ 图片生成支持多种尺寸比例',
            audio: '🎵 语音生成支持下载功能'
        },

        // 结果操作
        download: '下载',
        copy: '复制',
        view: '查看',
        close: '关闭',

        // 新增：灵感获取专区
        inspirationTitle: '🎨 灵感获取专区',
        inspirationExamples: {
            forest: '梦幻森林',
            city: '未来都市',
            cottage: '童话小屋',
            cyberpunk: '赛博朋克'
        }
    },
    
    en: {
        // Title and description
        title: 'SuperSense AI Creation Hub',
        subtitle: 'Images · Audio · Unlimited Free Generation',
        
        // Input area
        inputTitle: 'Input Content',
        examplesTitle: '💡 Click an example to quickly fill in:',
        inputPlaceholder: 'Enter description text, e.g.: A cute cat playing on the grass...',
        generateButton: 'Generate',
        quickFillLabel: 'Quick Fill Examples:',
        smartOptimizeTip: '✨ Smart Optimize: Automatically translate and optimize descriptions into high-quality English prompts to enhance image results.',
        negativePromptLabel: 'Negative Prompts:',
        negativePromptPlaceholder: 'Enter unwanted elements, separated by commas',
        
        // Generation type
        generationType: 'Generation Type',
        typeImage: 'Generate Image',
        typeAudio: 'Generate Audio',
        
        // Image options
        imageOptions: 'Image Options',
        aspectRatio: 'Aspect Ratio',
        aspectRatioSquare: 'Square (1:1 - 1024x1024)',
        aspectRatioLandscape: 'Landscape (16:9 - 1280x720)',
        aspectRatioPortrait: 'Portrait (9:16 - 720x1280)',
        aspectRatioStandard: 'Standard (4:3 - 1024x768)',
        aspectRatioStandardVertical: 'Standard Vertical (3:4 - 768x1024)',
        aspectRatioCustom: 'Custom',
        width: 'Width',
        height: 'Height',
        noLogo: 'Remove Watermark',
        numImages: 'Number of Images',
        oneImage: '1 Image',
        twoImages: '2 Images',
        fourImages: '4 Images',
        
        // Quick actions
        clearButton: 'Clear',
        optimizeButton: 'Optimize',
        randomButton: 'Random',
        
        // Status messages
        loading: 'Processing, please wait...',
        imageGenerating: 'Generating image, please wait...',
        audioGenerating: 'Generating audio, please wait...',
        error: 'An error occurred',
        pleaseInput: 'Please enter description text before generating.',
        optimizationSuccess: '✨ Prompt optimization complete!',
        optimizationFailed: 'Optimization failed, please try again later',
        pleaseInputFirst: 'Please enter text content first',
        generationComplete: 'Generation complete!',
        
        // Example hints
        imageHint: '💡 Image generation supports various sizes and quantities',
        audioHint: '🎵 Audio generation supports playback and download',
        
        // Example buttons
        examples: {
            cat: { name: '🐱 Cute Cat', text: 'A cute cat playing on the grass, sunny day, HD photography', type: 'image' },
            city: { name: '🌃 Tech City', text: 'Futuristic city night view, neon lights, cyberpunk style, ultra HD', type: 'image' },
            beauty: { name: '🌸 Traditional Beauty', text: 'Traditional Chinese beauty, flowing Hanfu, peach blossoms, detailed illustration', type: 'image' },
            dragon: { name: '🐉 Epic Dragon', text: 'A fierce dragon hovers over a volcano, lava flowing, epic sense', type: 'image' },
            lake: { name: '🏞️ Snowy Mountain Lake', text: 'A tranquil lake reflects snowy mountains and forests, dusk, oil painting style', type: 'image' },
            welcome: { name: '🎵 Welcome', text: 'Welcome to the AI Content Generator, hope you create amazing works', type: 'audio' },
            weather: { name: '🌦️ Weather', text: "It's a beautiful day, perfect for a walk and taking photos", type: 'audio' },
            forest: { name: '🌲 Magic Forest', text: 'Dreamy forest, fairies flying, magical light, fantasy landscape', type: 'image' },
            mountain: { name: '⛰️ Starry Mountain', text: 'Mountain under starry sky, brilliant Milky Way, stunning photography', type: 'image' },
            robot: { name: '🤖 Mech Punk', text: 'Mechanical punk robot, metallic texture, steampunk style, industrial aesthetics', type: 'image' },
            thanks: { name: '🙏 Thanks', text: 'Thank you for using our service, wish you happiness and success', type: 'audio' },
            garden: { name: '🌸 Japanese Garden', text: 'Japanese garden with falling cherry blossoms, peaceful and elegant, ink painting style', type: 'image' }
        },

        // Usage tips
        tips: {
            example: '💡 Try clicking example buttons to quickly fill content',
            optimize: '✨ Use "Optimize" button to enhance AI generation',
            random: '🎲 Click "Random" button for inspiration',
            imageSize: '🖼️ Image generation supports various aspect ratios',
            audio: '🎵 Audio generation supports download'
        },

        // Result operations
        download: 'Download',
        copy: 'Copy',
        view: 'View',
        close: 'Close',

        // Added: Inspiration Gallery
        inspirationTitle: '🎨 Inspiration Gallery',
        inspirationExamples: {
            forest: 'Mystic Forest',
            city: 'Future City',
            cottage: 'Fairy Tale Cottage',
            cyberpunk: 'Cyberpunk'
        }
    }
};

// 获取当前语言
function getCurrentLang() {
    const storedLang = localStorage.getItem('preferred_language');
    console.log('从localStorage获取语言:', storedLang); // 调试日志
    return storedLang || 'en'; // 默认使用英文
}

// 更新语言切换按钮状态
function updateLanguageButtons() {
    const currentLang = getCurrentLang();
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.dataset.lang === currentLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// 设置语言
function setLanguage(lang) {
    console.log('设置语言:', lang); // 调试日志
    if (i18n[lang]) {
        localStorage.setItem('preferred_language', lang);
        console.log('语言已保存到localStorage'); // 调试日志
        
        // 触发语言变更事件
        const event = new CustomEvent('languageChanged', { detail: { language: lang } });
        document.dispatchEvent(event);
        
        // 更新语言按钮状态
        updateLanguageButtons();
        
        // 更新页面文本
        if (window.uiHandler) {
            window.uiHandler.updatePageText();
        }
        
        return true;
    }
    return false;
}

// 获取翻译文本
function t(key) {
    const lang = getCurrentLang();
    const keys = key.split('.');
    let value = i18n[lang];
    
    for (const k of keys) {
        if (value && value[k]) {
            value = value[k];
        } else {
            console.warn(`Translation missing for key: ${key} in language: ${lang}`);
            return key;
        }
    }
    
    return value;
}

// 更新页面所有文本
function updatePageText() {
    // 更新标题
    document.title = t('title');
    document.querySelector('header h1').textContent = t('title');
    document.querySelector('header p').textContent = t('subtitle');

    // 更新输入区域标题
    const inputTitleEl = document.querySelector('section.input-section h2');
    if (inputTitleEl) inputTitleEl.textContent = t('inputTitle');

    // 更新示例区域标签
    const quickFillLabelEl = document.querySelector('[data-i18n="quickFillLabel"]');
    if (quickFillLabelEl) quickFillLabelEl.textContent = t('quickFillLabel');

    // 更新智能优化提示
    const smartOptimizeTipEl = document.querySelector('[data-i18n="smartOptimizeTip"]');
    if (smartOptimizeTipEl) smartOptimizeTipEl.textContent = t('smartOptimizeTip');

    // 更新负面提示词标签
    const negativePromptLabelEl = document.querySelector('[data-i18n="negativePromptLabel"]');
    if (negativePromptLabelEl) negativePromptLabelEl.textContent = t('negativePromptLabel');

    // 更新负面提示词输入框的placeholder
    const negativePromptInputEl = document.getElementById('negative-prompt');
    if (negativePromptInputEl) negativePromptInputEl.placeholder = t('negativePromptPlaceholder');

    // 更新示例标题
    const examplesTitle = document.querySelector('.examples-title');
    if (examplesTitle) examplesTitle.textContent = t('examplesTitle');

    // 更新输入区域
    const textInput = document.getElementById('text-input');
    if (textInput) {
        textInput.placeholder = t('inputPlaceholder');
    }

    const generateButton = document.getElementById('generate-button');
    if (generateButton) {
        generateButton.textContent = t('generateButton');
    }

    // 更新生成类型标签
    const generationTypeLabel = document.querySelector('.options label:first-child');
    if (generationTypeLabel) generationTypeLabel.textContent = t('generationType') + ':';

    const typeImageLabel = document.querySelector('label[for="type-image"]');
    const typeAudioLabel = document.querySelector('label[for="type-audio"]');
    if (typeImageLabel) typeImageLabel.textContent = t('typeImage');
    if (typeAudioLabel) typeAudioLabel.textContent = t('typeAudio');

    // 更新图片选项
    const imageOptionsTitle = document.querySelector('.image-options h3');
    if (imageOptionsTitle) imageOptionsTitle.textContent = t('imageOptions');

    // 更新宽高比选项
    const aspectRatioLabel = document.querySelector('label[for="option-aspect-ratio"]');
    if (aspectRatioLabel) aspectRatioLabel.textContent = t('aspectRatio') + ':';

    const aspectRatioSelect = document.getElementById('option-aspect-ratio');
    if (aspectRatioSelect) {
        aspectRatioSelect.querySelector('option[value="1:1"]').textContent = t('aspectRatioSquare');
        aspectRatioSelect.querySelector('option[value="16:9"]').textContent = t('aspectRatioLandscape');
        aspectRatioSelect.querySelector('option[value="9:16"]').textContent = t('aspectRatioPortrait');
        aspectRatioSelect.querySelector('option[value="4:3"]').textContent = t('aspectRatioStandard');
        aspectRatioSelect.querySelector('option[value="3:4"]').textContent = t('aspectRatioStandardVertical');
        aspectRatioSelect.querySelector('option[value="custom"]').textContent = t('aspectRatioCustom');
    }

    // 更新数量选择
    const numImagesLabel = document.querySelector('label[for="option-num-images"]');
    if (numImagesLabel) numImagesLabel.textContent = t('numImages') + ':';

    const numImagesSelect = document.getElementById('option-num-images');
    if (numImagesSelect) {
        numImagesSelect.querySelector('option[value="1"]').textContent = t('oneImage');
        numImagesSelect.querySelector('option[value="2"]').textContent = t('twoImages');
        numImagesSelect.querySelector('option[value="4"]').textContent = t('fourImages');
    }

    // 更新水印选项
    const noLogoLabel = document.querySelector('label[for="option-nologo"]');
    if (noLogoLabel) noLogoLabel.textContent = t('noLogo');

    // 更新宽高输入标签
    const widthLabel = document.querySelector('label[for="option-width"]');
    const heightLabel = document.querySelector('label[for="option-height"]');
    if (widthLabel) widthLabel.textContent = t('width') + ' (px):';
    if (heightLabel) heightLabel.textContent = t('height') + ' (px):';

    // 更新快捷操作按钮
    const clearBtn = document.getElementById('clear-btn');
    const optimizeBtn = document.getElementById('optimize-btn');
    const randomBtn = document.getElementById('random-btn');
    if (clearBtn) clearBtn.textContent = t('clearButton');
    if (optimizeBtn) optimizeBtn.textContent = t('optimizeButton');
    if (randomBtn) randomBtn.textContent = t('randomButton');

    // 更新示例按钮
    document.querySelectorAll('.example-btn').forEach(btn => {
        const i18nNameKey = btn.dataset.i18nName; // 例如: "examples.cat.name"
        if (i18nNameKey) {
            const translatedName = t(i18nNameKey); // 获取包含emoji的完整翻译名称
            
            // 从 i18nNameKey (e.g., "examples.cat.name") 构建 textKey (e.g., "examples.cat.text")
            const parts = i18nNameKey.split('.');
            if (parts.length === 3 && parts[0] === 'examples') {
                const exampleKey = parts[1]; // "cat", "dragon", etc.
                const textKey = `examples.${exampleKey}.text`;
                const translatedText = t(textKey);

                if (translatedName && translatedName !== i18nNameKey) {
                    btn.textContent = translatedName; // 设置按钮文本 (包含emoji)
                }
                if (translatedText && translatedText !== textKey) {
                    btn.dataset.text = translatedText; // 设置按钮的data-text属性
                }
            } else {
                console.warn(`Invalid data-i18n-name format: ${i18nNameKey}`);
            }
        } else {
            console.warn('Button missing data-i18n-name attribute:', btn);
        }
    });

    // 更新提示文本
    const typeHint = document.getElementById('type-hint');
    if (typeHint) {
        const isImage = document.getElementById('type-image')?.checked;
        typeHint.textContent = isImage ? t('imageHint') : t('audioHint');
    }

    // 更新灵感获取专区标题
    const inspirationTitleEl = document.querySelector('[data-i18n="inspirationTitle"]');
    if (inspirationTitleEl) {
        inspirationTitleEl.textContent = t('inspirationTitle');
    }

    // 更新灵感获取专区卡片标题
    const inspirationForestEl = document.querySelector('[data-i18n="inspirationExamples.forest"]');
    if (inspirationForestEl) {
        inspirationForestEl.textContent = t('inspirationExamples.forest');
    }
    const inspirationCityEl = document.querySelector('[data-i18n="inspirationExamples.city"]');
    if (inspirationCityEl) {
        inspirationCityEl.textContent = t('inspirationExamples.city');
    }
    const inspirationCottageEl = document.querySelector('[data-i18n="inspirationExamples.cottage"]');
    if (inspirationCottageEl) {
        inspirationCottageEl.textContent = t('inspirationExamples.cottage');
    }
    const inspirationCyberpunkEl = document.querySelector('[data-i18n="inspirationExamples.cyberpunk"]');
    if (inspirationCyberpunkEl) {
        inspirationCyberpunkEl.textContent = t('inspirationExamples.cyberpunk');
    }

    // 如果存在UI增强实例，更新其示例 (注释掉此调用，因为示例按钮的文本应完全由i18n.js通过data-i18n-name控制)
    // if (window.uiEnhancements) {
    //     window.uiEnhancements.updateExamples();
    // }
}

// 监听语言变更事件
document.addEventListener('languageChanged', () => {
    updatePageText();
});

// 将函数设为全局变量
window.getCurrentLang = getCurrentLang;
window.setLanguage = setLanguage;
window.t = t;
window.i18n = i18n;
window.updatePageText = updatePageText;

// 初始化时更新页面文本
document.addEventListener('DOMContentLoaded', () => {
    updatePageText();
    updateLanguageButtons(); // 初始化时也更新按钮状态
}); 