/**
 * 多语言配置文件
 * 支持中文和英文
 */
const i18n = {
    en: {
        // Title and description
        title: 'AISTONE',
        subtitle: 'Images · Voice · Unlimited Free Generation',
        
        // Input area
        inputTitle: 'Description Text',
        examplesTitle: '💡 Click examples to quickly fill:',
        inputPlaceholder: 'Please enter description text, e.g.: A cute cat playing on the grass...',
        generateButton: 'Start Generation',
        quickFillLabel: 'Quick fill examples:',
        smartOptimizeTip: '✨ Smart optimization: Automatically translate and optimize descriptions into high-quality English prompts to improve image generation',
        negativePromptLabel: 'Negative prompt:',
        negativePromptPlaceholder: 'Enter unwanted elements, separated by commas',
        
        // Generation type
        generationType: 'Generation Type',
        typeImage: 'Generate Image',
        typeAudio: 'Generate Voice',
        generationResult: 'Generation Result',
        
        // Image options
        imageOptions: 'Image Options',
        aiModel: 'AI Model',
        aiModelFlux: 'FLUX - High Quality Art Creation',
        aiModelTurbo: 'Turbo - Fast Generation',
        aiModelKontext: 'Kontext - Image-to-Image Generation',
        modelHint: '💡 Different models suit different scenarios: FLUX for art creation, Turbo for fast prototyping, Kontext for image editing',
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
        aspectRatioLandscape2K: 'Landscape 2K (16:9 - 2560x1440)',
        aspectRatioPortrait2K: 'Portrait 2K (9:16 - 1440x2560)',
        
        // Audio options
        audioOptions: 'Audio Options',
        voiceSelection: 'Voice Selection',
        voiceNova: 'Nova - Clear and professional female voice',
        voiceEcho: 'Echo - Warm and friendly male voice',
        voiceFable: 'Fable - Expressive narrative voice',
        voiceOnyx: 'Onyx - Deep and authoritative male voice',
        voiceShimmer: 'Shimmer - Bright and lively female voice',
        voiceAlloy: 'Alloy - Balanced multi-purpose voice',
        audioModel: 'Audio Model',
        audioModelOpenai: 'OpenAI Audio - Latest voice synthesis',
        
        // Quick actions
        clearButton: 'Clear',
        optimizeButton: 'Optimize',
        randomButton: 'Random',
        
        // Status messages
        loading: 'Processing, please wait...',
        imageGenerating: 'Generating image, please wait...',
        audioGenerating: 'Generating voice, please wait...',
        error: 'An error occurred',
        pleaseInput: 'Please enter description text before generating.',
        optimizationSuccess: '✨ Prompt optimization completed!',
        optimizationFailed: 'Optimization failed, please try again later',
        pleaseInputFirst: 'Please enter text content first',
        generationComplete: 'Generation completed!',
        generating: 'Generating...',
        preparingContent: 'Preparing content...',
        generatingContent: 'Generating content, please wait...',
        generatedAudio: 'Generated Audio:',
        downloadAudioFile: 'Download Audio File',
        
        // Example hints
        imageHint: '💡 Image generation supports multiple sizes and quantities',
        audioHint: '🎵 Voice generation supports play and download functions',
        
        // Welcome to AISTONE section
        welcomeToAistone: 'Welcome to AISTONE',
        aistoneIntro: 'AISTONE is your premier destination for AI-powered image generation and voice synthesis. As a leading AI content creation platform, AISTONE combines cutting-edge technology with user-friendly design to deliver exceptional results.',
        aistoneImageGenerator: 'AISTONE AI Image Generator',
        aistoneImageDesc: 'Experience the power of AISTONE\'s advanced AI models including Kontext, FLUX, and Turbo for stunning visual creation.',
        aistoneVoiceSynthesis: 'AISTONE Voice Synthesis',
        aistoneVoiceDesc: 'Transform text into natural speech with AISTONE\'s state-of-the-art voice synthesis technology.',
        aistoneFreePlatform: 'AISTONE Free Platform',
        aistoneFreeDesc: 'Enjoy AISTONE\'s complete feature set completely free - no registration, no limits, no hidden costs.',
        
        // About AISTONE section
        aboutAistone: 'About AISTONE',
        whatIsAistone: 'What is AISTONE?',
        whatIsAistoneDesc: 'AISTONE is a revolutionary AI-powered platform that combines cutting-edge image generation and voice synthesis technologies. Founded with the vision of democratizing AI content creation, AISTONE provides free access to advanced AI models including Kontext, FLUX, and Turbo.',
        aistoneMission: 'AISTONE\'s Mission',
        aistoneMissionDesc: 'AISTONE is committed to making AI content creation accessible to everyone. Whether you\'re a professional designer, content creator, or just someone with creative ideas, AISTONE provides the tools you need to bring your vision to life without any barriers.',
        whyChooseAistone: 'Why Choose AISTONE?',
        whyChooseAistoneDesc: 'AISTONE stands out with its commitment to privacy, quality, and accessibility. Our platform processes all content in real-time without storing user data, ensuring complete privacy while delivering professional-grade results powered by the latest AI technology.',
        aistonePartner: 'AISTONE - Your AI Content Creation Partner',
        aistonePartnerDesc: 'Join thousands of users who trust AISTONE for their AI content creation needs. From stunning visual art to natural voice synthesis, AISTONE is your one-stop solution for all AI-powered creative projects. Experience the future of content creation with AISTONE today.',
        
        // Example buttons
        examples: {
            cat: { name: '🐱 Cute Cat', text: 'A cute cat playing on the grass, sunny day, high-definition photography', type: 'image' },
            city: { name: '🌃 Tech City', text: 'Future tech city night scene, neon lights flashing, cyberpunk style, ultra HD', type: 'image' },
            beauty: { name: '🌸 Ancient Beauty', text: 'Ancient beauty, flowing hanfu, peach blossoms, Chinese style illustration, exquisite details', type: 'image' },
            dragon: { name: '🐉 Epic Dragon', text: 'A fierce dragon circling above a volcano, lava flowing, epic feeling', type: 'image' },
            lake: { name: '🏞️ Mountain Lake', text: 'Peaceful lake reflecting snow mountains and forest, sunset, oil painting style', type: 'image' },
            welcome: { name: '🎵 Welcome Voice', text: 'Welcome to AI content generator, hope you can create wonderful works', type: 'audio' },
            weather: { name: '🌦️ Weather Report', text: 'The weather is really nice today, perfect for going out for a walk and taking photos', type: 'audio' },
            forest: { name: '🌲 Magic Forest', text: 'Dreamy forest, fairies dancing, magic light, fantasy landscape painting', type: 'image' },
            mountain: { name: '⛰️ Starry Mountain', text: 'Mountain under the starry sky, brilliant galaxy, photography work, stunning visuals', type: 'image' },
            robot: { name: '🤖 Mechanical Punk', text: 'Mechanical punk robot, metallic texture, steampunk style, industrial aesthetics', type: 'image' },
            thanks: { name: '🙏 Thanks Voice', text: 'Thank you for using, wish you a happy life and smooth work', type: 'audio' },
            garden: { name: '🌸 Japanese Garden', text: 'Japanese garden with falling cherry blossoms, peaceful and beautiful, ink painting style', type: 'image' }
        },
    },
    zh: {
        // 标题和描述
        title: 'AISTONE',
        subtitle: '图片·语音·无限免费生成',
        
        // 输入区域
        inputTitle: '描述文本',
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
        generationResult: '生成结果',
        
        // 图片选项
        imageOptions: '图片选项',
        aiModel: 'AI模型',
        aiModelFlux: 'FLUX - 高质量艺术创作',
        aiModelTurbo: 'Turbo - 快速生成',
        aiModelKontext: 'Kontext - 图像到图像生成',
        modelHint: '💡 不同模型适合不同场景：FLUX适合艺术创作，Turbo适合快速原型，Kontext适合图像编辑',
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
        aspectRatioLandscape2K: '横向2K (16:9 - 2560x1440)',
        aspectRatioPortrait2K: '竖向2K (9:16 - 1440x2560)',
        
        // 音频选项
        audioOptions: '音频选项',
        voiceSelection: '语音选择',
        voiceNova: 'Nova - 清晰专业的女声',
        voiceEcho: 'Echo - 温暖友好的男声',
        voiceFable: 'Fable - 富有表现力的叙事声音',
        voiceOnyx: 'Onyx - 深沉权威的男声',
        voiceShimmer: 'Shimmer - 明亮活泼的女声',
        voiceAlloy: 'Alloy - 平衡多用途的声音',
        audioModel: '音频模型',
        audioModelOpenai: 'OpenAI Audio - 最新语音合成',
        
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
        generating: '正在生成中...',
        preparingContent: '正在准备内容...',
        generatingContent: '正在生成内容，请稍候...',
        generatedAudio: '生成的音频：',
        downloadAudioFile: '下载音频文件',
        
        // 认证相关
        loginTitle: '用户登录',
        registerTitle: '用户注册',
        login: '登录',
        register: '注册',
        logout: '登出',
        emailLabel: '邮箱地址',
        passwordLabel: '密码',
        userUsername: '用户名',
        confirmPasswordLabel: '确认密码',
        noAccount: '还没有账号？',
        registerNow: '立即注册',
        haveAccount: '已有账号？',
        loginNow: '立即登录',
        
        // Google登录和忘记密码
        or: '或',
        googleLogin: '使用Google登录',
        forgotPassword: '忘记密码？',
        forgotPasswordTitle: '忘记密码',
        forgotPasswordTip: '我们将向您的邮箱发送重置密码的链接',
        sendResetLink: '发送重置链接',
        backToLogin: '返回登录',
        resetPasswordTitle: '重置密码',
        newPasswordLabel: '新密码',
        resetPassword: '重置密码',
        
        // 示例提示
        imageHint: '💡 图片生成支持多种尺寸和数量选择',
        audioHint: '🎵 语音生成支持播放和下载功能',
        
        // Welcome to AISTONE 部分
        welcomeToAistone: '欢迎使用 AISTONE',
        aistoneIntro: 'AISTONE 是您进行AI图片生成与语音合成的首选平台。作为领先的AI内容创作平台，AISTONE 结合前沿技术与用户友好设计，为您提供卓越的创作体验。',
        aistoneImageGenerator: 'AISTONE AI 图片生成器',
        aistoneImageDesc: '体验 AISTONE 先进AI模型的强大功能，包括Kontext、FLUX和Turbo，为您创造令人惊叹的视觉作品。',
        aistoneVoiceSynthesis: 'AISTONE 语音合成',
        aistoneVoiceDesc: '使用 AISTONE 最先进的语音合成技术，将文本转换为自然语音。',
        aistoneFreePlatform: 'AISTONE 免费平台',
        aistoneFreeDesc: '享受 AISTONE 完整功能集，完全免费 - 无需注册，无限制，无隐藏费用。',
        
        // About AISTONE 部分
        aboutAistone: '关于 AISTONE',
        whatIsAistone: '什么是 AISTONE？',
        whatIsAistoneDesc: 'AISTONE 是一个革命性的AI驱动平台，结合了前沿的图片生成和语音合成技术。以民主化AI内容创作为愿景，AISTONE 提供对包括Kontext、FLUX和Turbo在内的先进AI模型的免费访问。',
        aistoneMission: 'AISTONE 的使命',
        aistoneMissionDesc: 'AISTONE 致力于让AI内容创作对每个人都能触手可及。无论您是专业设计师、内容创作者，还是只是有创意想法的人，AISTONE 都提供您需要的工具，让您的愿景变为现实，没有任何障碍。',
        whyChooseAistone: '为什么选择 AISTONE？',
        whyChooseAistoneDesc: 'AISTONE 以其对隐私、质量和可访问性的承诺而脱颖而出。我们的平台实时处理所有内容而不存储用户数据，确保完全隐私的同时，提供由最新AI技术驱动的专业级结果。',
        aistonePartner: 'AISTONE - 您的AI内容创作伙伴',
        aistonePartnerDesc: '加入数千名信任 AISTONE 进行AI内容创作需求的用户。从令人惊叹的视觉艺术到自然语音合成，AISTONE 是您所有AI驱动创意项目的一站式解决方案。今天就与 AISTONE 一起体验内容创作的未来。',
        
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
        },

        // 导航栏
        navHome: '首页',
        navAbout: '关于',
        navServices: '服务',
        navContact: '联系',
        navLogin: '登录',

        // 面包屑导航
        breadcrumbCurrent: 'AI内容生成',

        // 主要特性区块
        featuresTitle: 'AISTONE 的主要特性',
        features: [
            { icon: '💸', title: '零成本创作', desc: '完全免费，无需注册，无限生成。' },
            { icon: '🧠', title: '最先进的质量', desc: '高分辨率，细节丰富，艺术风格多样。' },
            { icon: '⚡', title: '闪电般的速度', desc: '优化推理管道，快速生成不影响质量。' },
            { icon: '🔒', title: '隐私保护', desc: '零数据留存，生成内容不存储。' },
            { icon: '🌐', title: '多语言支持', desc: '支持中英文界面，全球可用。' },
            { icon: '🎨', title: '多风格支持', desc: '跨艺术风格，照片、插画、动漫等。' }
        ],
        generationResult: '生成结果',

        // Footer
        footerCopyright: '© 2025 AISTONE',
        footerLinks: [
            { text: '隐私政策', url: '#' },
            { text: '服务条款', url: '#' }
        ],

        // 弹窗内容
        aboutModal: {
            title: '关于 AISTONE',
            content: 'AISTONE 是一个基于 Pollinations.AI 技术的智能内容创作平台，集成了文本生成图片与语音功能，致力于为用户提供高效、便捷、免费的AI内容创作体验。<br><br>我们的平台支持文本生成图片、文本生成语音等多种创作功能。无论你是设计师、内容创作者，还是普通用户，只需输入一句描述，就能一键生成高质量的视觉内容或语音内容。平台支持中英文输入，内置智能优化和多种生成参数，满足多样化的创作需求。<br><br>平台特色：<br>• 100%免费使用，无需注册，无需API密钥，保护用户隐私<br>• 支持中英文输入，内置智能优化<br>• 多种生成参数可调，满足多样化创作需求<br>• 界面简洁友好，适配多终端设备<br>• 云端算力支持，保证生成速度与质量<br><br>本项目基于先进的AI模型，结合云端算力，保证生成速度与质量。我们相信AI技术应该普惠大众，因此所有功能永久免费开放，助力每一位用户释放创意灵感，实现从文字到视觉、从文字到语音的无限可能。'
        },
        contactModal: {
            title: '联系我们',
            content: '如果您在使用 AISTONE 的过程中有任何问题或建议，欢迎随时与我们联系！<br><br>我们致力于为用户提供最优质的服务体验，无论是技术问题、功能建议还是合作咨询，我们都将认真对待并及时回复。<br><br>联系方式：<br>• 邮箱：<a href="mailto:support@aistone.org">support@aistone.org</a><br>• 官方网站：<a href="https://aistone.org" target="_blank">https://aistone.org</a><br>• 技术支持：24/7在线支持<br><br>服务范围：<br>• <b>产品反馈与建议：</b>我们非常重视您的体验和意见，任何功能建议或改进想法都欢迎反馈<br>• <b>技术支持：</b>遇到技术问题或使用障碍，请详细描述您的问题，我们会尽快协助解决<br>• <b>商务合作：</b>如果您有商务合作需求，欢迎通过邮箱联系我们<br>• <b>媒体采访：</b>媒体朋友如需采访或报道，请提前预约<br><br>我们会在1-2个工作日内回复您的信息。感谢您的关注与支持！'
        },
        servicesModal: {
            title: '我们的服务',
            content: '<ul style="margin: 18px 0 18px 0; padding-left: 1.2em; line-height: 2; color: #AAB4D4;"><li><b>AI图片生成：</b>输入描述文本，智能生成高质量、多风格的图片，支持多种分辨率和比例选择。</li><li><b>AI语音生成：</b>输入文本，一键生成自然流畅的语音音频，适用于配音、播报等多种场景。</li><li><b>智能提示词优化：</b>内置AI优化和翻译功能，自动将您的描述转化为高质量英文提示词，提升生成效果。</li><li><b>多语言支持：</b>支持中文和英文界面，满足全球用户需求。</li><li><b>永久免费：</b>所有功能对用户永久免费，无需注册，无使用次数限制。</li></ul><div style="margin-top: 12px; color: #AAB4D4;">如需了解更多服务细节，欢迎通过"联系我们"与我们取得联系。</div>'
        },
        heroTitle: 'AISTONE - 免费AI图片生成与语音合成平台',
        heroSubtitle: '图片·语音·无限免费生成',
        heroSlogan: 'AI驱动·一键生成·释放你的创意！',
        faqTitle: '常见问题 FAQ',
        faqQ1: 'AISTONE 是否永久免费？',
        faqA1: '是的，平台所有功能永久免费，无需注册，无次数限制。',
        faqQ2: '使用平台需要登录吗？',
        faqA2: '无需登录，直接输入描述即可生成图片或语音。',
        faqQ3: '支持哪些输入语言？',
        faqA3: '支持中文和英文输入，界面可切换。',
        faqQ4: '生成的内容有版权吗？',
        faqA4: 'AI生成内容归用户所有，可自由使用。',
        faqQ5: '如何反馈问题或建议？',
        faqA5: '可通过页面底部的联系方式或邮箱 support@aistone.org 反馈。',
        aboutModalTitle: '关于 AISTONE',
        aboutModalContent: 'AISTONE 是一个基于 Pollinations.AI 技术的智能内容创作平台，集成了文本生成图片与语音功能，致力于为用户提供高效、便捷、免费的AI内容创作体验。<br><br>我们的平台支持文本生成图片、文本生成语音等多种创作功能。无论你是设计师、内容创作者，还是普通用户，只需输入一句描述，就能一键生成高质量的视觉内容或语音内容。平台支持中英文输入，内置智能优化和多种生成参数，满足多样化的创作需求。<br><br>平台特色：<br>• 100%免费使用，无需注册，无需API密钥，保护用户隐私<br>• 支持中英文输入，内置智能优化<br>• 多种生成参数可调，满足多样化创作需求<br>• 界面简洁友好，适配多终端设备<br>• 云端算力支持，保证生成速度与质量<br><br>本项目基于先进的AI模型，结合云端算力，保证生成速度与质量。我们相信AI技术应该普惠大众，因此所有功能永久免费开放，助力每一位用户释放创意灵感，实现从文字到视觉、从文字到语音的无限可能。',
        contactModalTitle: '联系我们',
        contactModalContent: '如果您在使用 AISTONE 的过程中有任何问题或建议，欢迎随时与我们联系！<br><br>我们致力于为用户提供最优质的服务体验，无论是技术问题、功能建议还是合作咨询，我们都将认真对待并及时回复。<br><br>联系方式：<br>• 邮箱：<a href="mailto:support@aistone.org">support@aistone.org</a><br>• 官方网站：<a href="https://aistone.org" target="_blank">https://aistone.org</a><br>• 技术支持：24/7在线支持<br><br>服务范围：<br>• <b>产品反馈与建议：</b>我们非常重视您的体验和意见，任何功能建议或改进想法都欢迎反馈<br>• <b>技术支持：</b>遇到技术问题或使用障碍，请详细描述您的问题，我们会尽快协助解决<br>• <b>商务合作：</b>如果您有商务合作需求，欢迎通过邮箱联系我们<br>• <b>媒体采访：</b>媒体朋友如需采访或报道，请提前预约<br><br>我们会在1-2个工作日内回复您的信息。感谢您的关注与支持！',
        servicesModalTitle: '我们的服务',
        servicesModalContent: '<ul style="margin: 18px 0 18px 0; padding-left: 1.2em; line-height: 2; color: #AAB4D4;"><li><b>AI图片生成：</b>输入描述文本，智能生成高质量、多风格的图片，支持多种分辨率和比例选择。</li><li><b>AI语音生成：</b>输入文本，一键生成自然流畅的语音音频，适用于配音、播报等多种场景。</li><li><b>智能提示词优化：</b>内置AI优化和翻译功能，自动将您的描述转化为高质量英文提示词，提升生成效果。</li><li><b>多语言支持：</b>支持中文和英文界面，满足全球用户需求。</li><li><b>永久免费：</b>所有功能对用户永久免费，无需注册，无使用次数限制。</li></ul><div style="margin-top: 12px; color: #AAB4D4;">如需了解更多服务细节，欢迎通过"联系我们"与我们取得联系。</div>',
        tagFree: '100% 免费',
        tagUnlimited: '无限生成',
        tagNoLogin: '无需登录',
        faqTip: '如有更多疑问，欢迎通过页面底部联系我们',
        faqQ6: '生成速度慢或失败怎么办？',
        faqA6: '如遇高峰期可能稍慢，请耐心等待或稍后重试。如持续失败请联系客服。',
        faqQ7: '平台有API接口吗？',
        faqA7: '支持API调用，详见开发文档或联系客服获取API接入方式。',
        faqQ8: '如何保护用户隐私？',
        faqA8: '平台不存储用户输入和生成内容，所有数据实时处理，保障隐私安全。',
        faqQ9: '未来会不会收费或限制？',
        faqA9: '目前永久免费，无次数限制。如有变动会提前公告。',
        faqQ10: '如何加入交流群或获取最新动态？',
        faqA10: '可关注官网、公众号或联系客服，获取交流群二维码和最新资讯。',
        heroIntro: 'AISTONE 是一个集AI图片生成与语音合成于一体的智能创作平台，支持中英文输入，永久免费，无需注册。无论你是设计师、内容创作者还是普通用户，只需一句描述，即可一键生成高质量图片和自然语音，释放无限创意。平台注重隐私保护，所有内容实时生成不留存，助力每一位用户高效创作、自由分享。',
        testimonialsTitle: '用户评价与真实案例',
        testimonialName1: 'Sarah Chen',
        testimonialRole1: '插画师',
        testimonialContent1: '“平台生成的插画非常精美，极大提升了我的设计效率！”',
        testimonialName2: 'Alex Wang',
        testimonialRole2: '短视频创作者',
        testimonialContent2: '“AI语音自然流畅，直接用于我的短视频配音。”',
        testimonialName3: '李明',
        testimonialRole3: '独立开发者',
        testimonialContent3: '“一键生成图片和语音，创作效率翻倍，强烈推荐！”',
        testimonialName4: 'Emily Zhang',
        testimonialRole4: '产品经理',
        testimonialContent4: '“AI内容生成工具极大提升了团队的创意产出效率。”',
        testimonialName5: 'Tom Lee',
        testimonialRole5: '自媒体人',
        testimonialContent5: '“生成速度快，内容质量高，值得推荐！”',
        imageInfoSize: 'Size',
        imageInfoFileSize: 'File Size',
        imageInfoCount: 'Total {count} images generated, click image to enlarge',
        pixels: 'pixels',
        userMetaDescription: 'AISTONE 个人中心 - 登录后管理你的高清图片与账户信息。',
        loginTitle: '用户登录',
        registerTitle: '用户注册',
        emailLabel: '邮箱地址',
        passwordLabel: '密码',
        confirmPasswordLabel: '确认密码',
        login: '登录',
        register: '注册',
        noAccount: '还没有账号？',
        registerNow: '立即注册',
        haveAccount: '已有账号？',
        loginNow: '立即登录',
        // User center page
        userAccountTitle: '账户资料',
        userGreeting: '您好，{name}',
        userUsername: '用户名',
        userEmail: '邮箱',
        userUpdateProfile: '更新资料',
        userChangePasswordTitle: '修改密码',
        userNewPassword: '新密码',
        userConfirmPassword: '确认新密码',
        userSave: '保存',
        userNotLoggedIn: '请先登录后使用个人中心功能',
        userLoginNow: '立即登录',
        userFeatureComing: '功能开发中，敬请期待',
        userUpdateSuccess: '更新成功',
        userPasswordMismatch: '两次输入的密码不一致',

        // 顶部用户区
        userCenter: '个人中心',
        logout: '登出',
        userCenterDevTip: '个人中心功能开发中...',

        // 高清图片管理
        hdTitle: '📸 今日高清图片',
        hdRefresh: '刷新',
        hdGeneratedLabel: '已生成:',
        hdRemainingTimeLabel: '剩余时间:',
        hdSaving: '正在保存高清图片...',
        hdEmptyTitle: '还没有保存的图片',
        hdEmptyDesc: '生成的图片会在这里显示，最多保存3张',
        hdPreviewTitle: '高清图片预览',
        hdDownloadHD: '下载高清',
        hdClickToView: '点击查看高清图片',
        hdLabelSize: '尺寸:',
        hdLabelModel: '模型:',
        hdLabelSeed: '种子:',
        hdLabelTime: '时间:',
        delete: '删除',
    },
    
    en: {
        // Title and description
        title: 'AISTONE',
        subtitle: 'Image · Audio · Unlimited Free Generation',
        
        // Input area
        inputTitle: 'Description',
        examplesTitle: '💡 Click examples to quickly fill:',
        inputPlaceholder: 'Enter description text, e.g.: A cute cat playing on the grass...',
        generateButton: 'Start Generation',
        quickFillLabel: 'Quick Fill Examples:',
        smartOptimizeTip: '✨ Smart Optimization: Automatically translates and optimizes descriptions into high-quality English prompts',
        negativePromptLabel: 'Negative Prompt:',
        negativePromptPlaceholder: 'Enter unwanted elements, separated by commas',
        
        // Generation type
        generationType: 'Generation Type',
        typeImage: 'Generate Image',
        typeAudio: 'Generate Audio',
        
        // Image options
        imageOptions: 'Image Options',
        aiModel: 'AI Model',
        aiModelFlux: 'FLUX - High Quality Art Creation',
        aiModelTurbo: 'Turbo - Fast Generation',
        aiModelKontext: 'Kontext - Image-to-Image Generation',
        modelHint: '💡 Different models suit different scenarios: FLUX for art creation, Turbo for fast prototyping, Kontext for image editing',
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
        numImages: 'Quantity',
        oneImage: '1 Image',
        twoImages: '2 Images',
        fourImages: '4 Images',
        aspectRatioLandscape2K: 'Landscape 2K (16:9 - 2560x1440)',
        aspectRatioPortrait2K: 'Portrait 2K (9:16 - 1440x2560)',
        
        // Audio options
        audioOptions: 'Audio Options',
        voiceSelection: 'Voice Selection',
        voiceNova: 'Nova - Clear Professional Female Voice',
        voiceEcho: 'Echo - Warm Friendly Male Voice',
        voiceFable: 'Fable - Expressive Narrative Voice',
        voiceOnyx: 'Onyx - Deep Authoritative Male Voice',
        voiceShimmer: 'Shimmer - Bright Lively Female Voice',
        voiceAlloy: 'Alloy - Balanced Versatile Voice',
        audioModel: 'Audio Model',
        audioModelOpenai: 'OpenAI Audio - Latest Speech Synthesis',
        
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
        optimizationSuccess: '✨ Prompt optimization completed!',
        optimizationFailed: 'Optimization failed, please try again later',
        pleaseInputFirst: 'Please enter text content first',
        generationComplete: 'Generation complete!',
        generating: 'Generating...',
        
        // Example hints
        imageHint: '💡 Image generation supports multiple sizes and quantities',
        audioHint: '🎵 Audio generation supports playback and download',
        
        // Auth related
        loginTitle: 'User Login',
        registerTitle: 'User Registration',
        login: 'Login',
        register: 'Register',
        logout: 'Logout',
        emailLabel: 'Email Address',
        passwordLabel: 'Password',
        userUsername: 'Username',
        confirmPasswordLabel: 'Confirm Password',
        noAccount: 'Don\'t have an account?',
        registerNow: 'Register Now',
        haveAccount: 'Already have an account?',
        loginNow: 'Login Now',
        
        // Google Login and forgot password
        or: 'OR',
        googleLogin: 'Sign in with Google',
        forgotPassword: 'Forgot Password?',
        forgotPasswordTitle: 'Forgot Password',
        forgotPasswordTip: 'We will send a password reset link to your email',
        sendResetLink: 'Send Reset Link',
        backToLogin: 'Back to Login',
        resetPasswordTitle: 'Reset Password',
        newPasswordLabel: 'New Password',
        resetPassword: 'Reset Password',
        
        // Welcome to AISTONE section
        welcomeToAistone: 'Welcome to AISTONE',
        aistoneIntro: 'AISTONE is your premier destination for AI-powered image generation and voice synthesis. As a leading AI content creation platform, AISTONE combines cutting-edge technology with user-friendly design to deliver exceptional results.',
        aistoneImageGenerator: 'AISTONE AI Image Generator',
        aistoneImageDesc: 'Experience the power of AISTONE\'s advanced AI models including Kontext, FLUX, and Turbo for stunning visual creation.',
        aistoneVoiceSynthesis: 'AISTONE Voice Synthesis',
        aistoneVoiceDesc: 'Transform text into natural speech with AISTONE\'s state-of-the-art voice synthesis technology.',
        aistoneFreePlatform: 'AISTONE Free Platform',
        aistoneFreeDesc: 'Enjoy AISTONE\'s complete feature set completely free - no registration, no limits, no hidden costs.',
        
        // About AISTONE section
        aboutAistone: 'About AISTONE',
        whatIsAistone: 'What is AISTONE?',
        whatIsAistoneDesc: 'AISTONE is a revolutionary AI-powered platform that combines cutting-edge image generation and voice synthesis technologies. Founded with the vision of democratizing AI content creation, AISTONE provides free access to advanced AI models including Kontext, FLUX, and Turbo.',
        aistoneMission: 'AISTONE\'s Mission',
        aistoneMissionDesc: 'AISTONE is committed to making AI content creation accessible to everyone. Whether you\'re a professional designer, content creator, or just someone with creative ideas, AISTONE provides the tools you need to bring your vision to life without any barriers.',
        whyChooseAistone: 'Why Choose AISTONE?',
        whyChooseAistoneDesc: 'AISTONE stands out with its commitment to privacy, quality, and accessibility. Our platform processes all content in real-time without storing user data, ensuring complete privacy while delivering professional-grade results powered by the latest AI technology.',
        aistonePartner: 'AISTONE - Your AI Content Creation Partner',
        aistonePartnerDesc: 'Join thousands of users who trust AISTONE for their AI content creation needs. From stunning visual art to natural voice synthesis, AISTONE is your one-stop solution for all AI-powered creative projects. Experience the future of content creation with AISTONE today.',
        
        // Example buttons
        examples: {
            cat: { name: '🐱 Cute Cat', text: 'A cute cat playing on the grass, sunny day, high quality photography', type: 'image' },
            city: { name: '🌃 Tech City', text: 'Futuristic city night scene, neon lights, cyberpunk style, ultra HD', type: 'image' },
            beauty: { name: '🌸 Ancient Beauty', text: 'Ancient beauty in Hanfu, cherry blossoms, Chinese style illustration', type: 'image' },
            dragon: { name: '🐉 Epic Dragon', text: 'A fierce dragon circling above a volcano, lava flowing, epic scene', type: 'image' },
            lake: { name: '🏞️ Mountain Lake', text: 'Peaceful lake reflecting mountains and forest, sunset, oil painting style', type: 'image' },
            welcome: { name: '🎵 Welcome Audio', text: 'Welcome to the AI content generator, hope you create amazing works', type: 'audio' },
            weather: { name: '🌦️ Weather Report', text: 'The weather is great today, perfect for walking and taking photos', type: 'audio' },
            forest: { name: '🌲 Magic Forest', text: 'Dreamy forest with fairies, magical lights, fantasy landscape', type: 'image' },
            mountain: { name: '⛰️ Starry Mountain', text: 'Mountain under starry sky, Milky Way, photography, stunning visuals', type: 'image' },
            robot: { name: '🤖 Steampunk Robot', text: 'Steampunk robot, metallic texture, industrial aesthetics', type: 'image' },
            thanks: { name: '🙏 Thank You Audio', text: 'Thank you for using our service, wish you a happy life and successful work', type: 'audio' },
            garden: { name: '🌸 Japanese Garden', text: 'Japanese garden with falling cherry blossoms, peaceful and beautiful, ink painting style', type: 'image' }
        },

        // Tips
        tips: {
            example: '💡 Try clicking example buttons to quickly fill content',
            optimize: '✨ Use "Optimize" button to improve AI generation results',
            random: '🎲 Click "Random" button for inspiration',
            imageSize: '🖼️ Image generation supports multiple aspect ratios',
            audio: '🎵 Audio generation supports download feature'
        },

        // Result actions
        download: 'Download',
        copy: 'Copy',
        view: 'View',
        close: 'Close',

        // Inspiration section
        inspirationTitle: '🎨 Inspiration Gallery',
        inspirationExamples: {
            forest: 'Magic Forest',
            city: 'Future City',
            cottage: 'Fairy Tale Cottage',
            cyberpunk: 'Cyberpunk'
        },

        // Navigation
        navHome: 'Home',
        navAbout: 'About',
        navServices: 'Services',
        navContact: 'Contact',
        navLogin: 'Login',

        // Breadcrumb navigation
        breadcrumbCurrent: 'AI Content Generation',

        // Main features section
        featuresTitle: 'Key Features of AISTONE',
        features: [
            { icon: '💸', title: 'Zero Cost Creation', desc: 'Completely free, no registration, unlimited generation.' },
            { icon: '🧠', title: 'State-of-the-art Quality', desc: 'High resolution, rich details, diverse artistic styles.' },
            { icon: '⚡', title: 'Lightning Fast', desc: 'Optimized inference pipeline, fast generation without quality loss.' },
            { icon: '🔒', title: 'Privacy Protection', desc: 'Zero data retention, generated content not stored.' },
            { icon: '🌐', title: 'Multi-language Support', desc: 'Supports Chinese and English interfaces, globally available.' },
            { icon: '🎨', title: 'Multi-style Support', desc: 'Across artistic styles, photos, illustrations, anime, etc.' }
        ],
        generationResult: 'Generation Result',

        // Footer
        footerCopyright: '© 2025 AISTONE',
        footerLinks: [
            { text: 'Privacy Policy', url: '#' },
            { text: 'Terms of Service', url: '#' }
        ],

        // Modal content
        aboutModal: {
            title: 'About AISTONE',
            content: 'AISTONE is an intelligent content creation platform powered by Pollinations.AI technology, integrating text-to-image and text-to-speech capabilities, dedicated to providing users with efficient, convenient, and free AI content creation experience.<br><br>Our platform supports various creative functions including text-to-image generation and text-to-speech synthesis. Whether you\'re a designer, content creator, or casual user, simply input a description to generate high-quality visual content or audio content with one click. The platform supports Chinese and English input with built-in intelligent optimization and multiple generation parameters to meet diverse creative needs.<br><br>Platform Features:<br>• 100% free to use, no registration required, no API keys needed, protecting user privacy<br>• Supports Chinese and English input with built-in intelligent optimization<br>• Multiple adjustable generation parameters to meet diverse creative needs<br>• Clean and friendly interface, compatible with multiple devices<br>• Cloud computing power support, ensuring generation speed and quality<br><br>This project is based on advanced AI models combined with cloud computing power, ensuring generation speed and quality. We believe AI technology should benefit everyone, which is why all features are permanently free and open, helping every user unleash their creative inspiration and realize unlimited possibilities from text to visual and from text to speech.'
        },
        contactModal: {
            title: 'Contact Us',
            content: 'If you have any questions or suggestions while using AISTONE, feel free to contact us!<br><br>We are committed to providing the best service experience for our users, whether it\'s technical issues, feature suggestions, or business consultation. We will handle your inquiries seriously and respond promptly.<br><br>Contact Information:<br>• Email: <a href="mailto:support@aistone.org">support@aistone.org</a><br>• Official Website: <a href="https://aistone.org" target="_blank">https://aistone.org</a><br>• Technical Support: 24/7 Online Support<br><br>Service Scope:<br>• <b>Product Feedback & Suggestions:</b> We highly value your experience and opinions, any feature suggestions or improvement ideas are welcome<br>• <b>Technical Support:</b> If you encounter technical issues or usage obstacles, please describe your problem in detail, and we will assist you as soon as possible<br>• <b>Business Cooperation:</b> If you have business cooperation needs, please contact us through email<br>• <b>Media Interview:</b> If media friends need to interview or report, please make an appointment in advance<br><br>We will reply to your message within 1-2 business days. Thank you for your attention and support!'
        },
        servicesModal: {
            title: 'Our Services',
            content: '<ul style="margin: 18px 0 18px 0; padding-left: 1.2em; line-height: 2; color: #AAB4D4;"><li><b>AI Image Generation:</b> Input description text to intelligently generate high-quality, multi-style images, supporting various resolutions and aspect ratios.</li><li><b>AI Audio Generation:</b> Input text to generate natural and fluent audio with one click, suitable for dubbing, broadcasting, and other scenarios.</li><li><b>Smart Prompt Optimization:</b> Built-in AI optimization and translation features, automatically converting your descriptions into high-quality English prompts to improve generation results.</li><li><b>Multi-language Support:</b> Supports Chinese and English interfaces to meet global user needs.</li><li><b>Permanently Free:</b> All features are permanently free for users, no registration required, no usage limits.</li></ul><div style="margin-top: 12px; color: #AAB4D4;">For more service details, please contact us through "Contact Us".</div>'
        },
        heroTitle: 'AISTONE - Free AI Image Generation & Audio Synthesis Platform',
        heroSubtitle: 'Image · Audio · Unlimited Free Generation',
        heroSlogan: 'AI-Driven · One-Click Generation · Unleash Your Creativity!',
        faqTitle: 'Frequently Asked Questions',
        faqQ1: 'Is AISTONE permanently free?',
        faqA1: 'Yes, all platform features are permanently free, no registration required, no usage limits.',
        faqQ2: 'Do I need to log in to use the platform?',
        faqA2: 'No login required, just input your description to generate images or audio.',
        faqQ3: 'What input languages are supported?',
        faqA3: 'Supports Chinese and English input, interface can be switched.',
        faqQ4: 'Who owns the copyright of generated content?',
        faqA4: 'AI-generated content belongs to the user and can be used freely.',
        faqQ5: 'How can I provide feedback or suggestions?',
        faqA5: 'You can contact us through the contact information at the bottom of the page or email support@aistone.org.',
        aboutModalTitle: 'About AISTONE',
        aboutModalContent: 'AISTONE is an intelligent content creation platform powered by Pollinations.AI technology, integrating text-to-image and text-to-speech capabilities, dedicated to providing users with efficient, convenient, and free AI content creation experience.<br><br>Our platform supports various creative functions including text-to-image generation and text-to-speech synthesis. Whether you\'re a designer, content creator, or casual user, simply input a description to generate high-quality visual content or audio content with one click. The platform supports Chinese and English input with built-in intelligent optimization and multiple generation parameters to meet diverse creative needs.<br><br>Platform Features:<br>• 100% free to use, no registration required, no API keys needed, protecting user privacy<br>• Supports Chinese and English input with built-in intelligent optimization<br>• Multiple adjustable generation parameters to meet diverse creative needs<br>• Clean and friendly interface, compatible with multiple devices<br>• Cloud computing power support, ensuring generation speed and quality<br><br>This project is based on advanced AI models combined with cloud computing power, ensuring generation speed and quality. We believe AI technology should benefit everyone, which is why all features are permanently free and open, helping every user unleash their creative inspiration and realize unlimited possibilities from text to visual and from text to speech.',
        contactModalTitle: 'Contact Us',
        contactModalContent: 'If you have any questions or suggestions while using AISTONE, feel free to contact us!<br><br>We are committed to providing the best service experience for our users, whether it\'s technical issues, feature suggestions, or business consultation. We will handle your inquiries seriously and respond promptly.<br><br>Contact Information:<br>• Email: <a href="mailto:support@aistone.org">support@aistone.org</a><br>• Official Website: <a href="https://aistone.org" target="_blank">https://aistone.org</a><br>• Technical Support: 24/7 Online Support<br><br>Service Scope:<br>• <b>Product Feedback & Suggestions:</b> We highly value your experience and opinions, any feature suggestions or improvement ideas are welcome<br>• <b>Technical Support:</b> If you encounter technical issues or usage obstacles, please describe your problem in detail, and we will assist you as soon as possible<br>• <b>Business Cooperation:</b> If you have business cooperation needs, please contact us through email<br>• <b>Media Interview:</b> If media friends need to interview or report, please make an appointment in advance<br><br>We will reply to your message within 1-2 business days. Thank you for your attention and support!',
        servicesModalTitle: 'Our Services',
        servicesModalContent: '<ul style="margin: 18px 0 18px 0; padding-left: 1.2em; line-height: 2; color: #AAB4D4;"><li><b>AI Image Generation:</b> Input description text to intelligently generate high-quality, multi-style images, supporting various resolutions and aspect ratios.</li><li><b>AI Audio Generation:</b> Input text to generate natural and fluent audio with one click, suitable for dubbing, broadcasting, and other scenarios.</li><li><b>Smart Prompt Optimization:</b> Built-in AI optimization and translation features, automatically converting your descriptions into high-quality English prompts to improve generation results.</li><li><b>Multi-language Support:</b> Supports Chinese and English interfaces to meet global user needs.</li><li><b>Permanently Free:</b> All features are permanently free for users, no registration required, no usage limits.</li></ul><div style="margin-top: 12px; color: #AAB4D4;">For more service details, please contact us through "Contact Us".</div>',
        tagFree: '100% Free',
        tagUnlimited: 'Unlimited Generation',
        tagNoLogin: 'No Login Required',
        faqTip: 'For more questions, please contact us through the bottom of the page',
        faqQ6: 'What if generation is slow or fails?',
        faqA6: 'It may be slower during peak hours, please be patient or try again later. If it continues to fail, please contact customer service.',
        faqQ7: 'Does the platform have an API?',
        faqA7: 'API calls are supported, see development documentation or contact customer service for API access.',
        faqQ8: 'How is user privacy protected?',
        faqA8: 'The platform does not store user input and generated content, all data is processed in real-time to ensure privacy and security.',
        faqQ9: 'Will there be charges or limits in the future?',
        faqA9: 'Currently permanently free with no usage limits. Any changes will be announced in advance.',
        faqQ10: 'How to join the community or get latest updates?',
        faqA10: 'Follow the official website, public account, or contact customer service for community QR code and latest news.',
        heroIntro: 'AISTONE is an intelligent creation platform integrating AI image generation and audio synthesis, supporting Chinese and English input, permanently free, no registration required. Whether you are a designer, content creator, or regular user, just input a description to generate high-quality images and natural audio with one click, unleashing unlimited creativity. The platform focuses on privacy protection, all content is generated in real-time without storage, helping every user create efficiently and share freely.',
        testimonialsTitle: 'User Reviews & Real Cases',
        testimonialName1: 'Sarah Chen',
        testimonialRole1: 'Illustrator',
        testimonialContent1: '"The platform generates beautiful illustrations, greatly improving my design efficiency!"',
        testimonialName2: 'Alex Wang',
        testimonialRole2: 'Short Video Creator',
        testimonialContent2: '"The AI audio is natural and fluent, directly used for my short video dubbing."',
        testimonialName3: 'Li Ming',
        testimonialRole3: 'Independent Developer',
        testimonialContent3: '"One-click generation of images and audio, creative efficiency doubled, highly recommended!"',
        testimonialName4: 'Emily Zhang',
        testimonialRole4: 'Product Manager',
        testimonialContent4: '"The AI content generation tool greatly improves the team\'s creative output efficiency."',
        testimonialName5: 'Tom Lee',
        testimonialRole5: 'Content Creator',
        testimonialContent5: '"Fast generation speed, high content quality, worth recommending!"',
        imageInfoSize: 'Size',
        imageInfoFileSize: 'File Size',
        imageInfoCount: 'Total {count} images generated, click image to enlarge',
        pixels: 'pixels',
        userMetaDescription: 'AISTONE User Center - Manage your HD images and account info after login.',
        loginTitle: 'Sign In',
        registerTitle: 'Sign Up',
        emailLabel: 'Email',
        passwordLabel: 'Password',
        confirmPasswordLabel: 'Confirm Password',
        login: 'Login',
        register: 'Register',
        noAccount: "Don't have an account?",
        registerNow: 'Register Now',
        haveAccount: 'Already have an account?',
        loginNow: 'Sign in now',
        // User center page
        userAccountTitle: 'Account Info',
        userGreeting: 'Hello, {name}',
        userUsername: 'Username',
        userEmail: 'Email',
        userUpdateProfile: 'Update Profile',
        userChangePasswordTitle: 'Change Password',
        userNewPassword: 'New Password',
        userConfirmPassword: 'Confirm New Password',
        userSave: 'Save',
        userNotLoggedIn: 'Please log in to use the user center features',
        userLoginNow: 'Log in now',
        userFeatureComing: 'Feature under development',
        userUpdateSuccess: 'Updated successfully',
        userPasswordMismatch: 'Passwords do not match',

        // Top user area
        userCenter: 'User Center',
        logout: 'Logout',
        userCenterDevTip: 'User center is under development...',

        // HD images manager
        hdTitle: '📸 Today\'s HD Images',
        hdRefresh: 'Refresh',
        hdGeneratedLabel: 'Generated:',
        hdRemainingTimeLabel: 'Time Left:',
        hdSaving: 'Saving HD image...',
        hdEmptyTitle: 'No saved images yet',
        hdEmptyDesc: 'Generated images will appear here, up to 3 saved per day',
        hdPreviewTitle: 'HD Image Preview',
        hdDownloadHD: 'Download HD',
        hdClickToView: 'Click to view HD image',
        hdLabelSize: 'Size:',
        hdLabelModel: 'Model:',
        hdLabelSeed: 'Seed:',
        hdLabelTime: 'Time:',
        delete: 'Delete',
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
    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
        langSelect.value = currentLang;
    }
}

// 新增递归读取函数
function getNestedI18nValue(lang, keyPath) {
    if (!i18n || !i18n[lang]) {
        return undefined;
    }
    
    const keys = keyPath.split('.');
    let value = i18n[lang];
    
    for (const k of keys) {
        if (value && value[k] !== undefined) {
            value = value[k];
        } else {
            return undefined;
        }
    }
    
    return value;
}

// 设置语言
function setLanguage(lang) {
            // console.log('[i18n] setLanguage called, lang=', lang);
    if (i18n[lang]) {
        try {
            // 保存语言设置
        localStorage.setItem('preferred_language', lang);
            // 设置HTML lang属性，使用标准的语言代码
            const langCode = lang === 'zh' ? 'zh-CN' : 'en';
            document.documentElement.lang = langCode;
            // console.log('[i18n] 语言已保存到localStorage:', lang, 'HTML lang属性设置为:', langCode);
            
            // 更新所有带有data-i18n属性的元素
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                const value = getNestedI18nValue(lang, key);
                if (value && value !== key) {
                    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                        el.placeholder = value;
                    } else if (el.tagName === 'OPTION') {
                        el.textContent = value;
                    } else {
                        el.innerHTML = value;
                    }
                }
            });

            // 更新特定元素
            const elements = {
                'title': 'title',
                'heroTitle': '.hero-title',
                'heroSubtitle': '.hero-subtitle',
                'heroSlogan': '.hero-slogan',
                'heroIntro': '.hero-intro',
                'inputTitle': '.input-section h2',
                'quickFillLabel': '.examples-label',
                'negativePromptLabel': '.negative-prompt h3',
                'generationType': '.options h3',
                'typeImage': 'label[for="type-image"]',
                'typeAudio': 'label[for="type-audio"]',
                'imageOptions': '.image-options h3',
                'aspectRatio': 'label[for="option-aspect-ratio"]',
                'width': 'label[for="option-width"]',
                'height': 'label[for="option-height"]',
                'noLogo': 'label[for="option-nologo"]',
                'numImages': 'label[for="option-num-images"]',
                'clearButton': '#clear-btn',
                'optimizeButton': '#optimize-btn',
                'randomButton': '#random-btn',
                'generateButton': '#generate-button'
            };

            for (const [key, selector] of Object.entries(elements)) {
                const element = document.querySelector(selector);
                if (element && i18n[lang][key]) {
                    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                        element.placeholder = i18n[lang][key];
                    } else {
                        element.textContent = i18n[lang][key];
                    }
                    console.log(`[i18n] 已更新元素 ${selector}`);
                }
            }

            // 更新示例按钮
            document.querySelectorAll('.example-btn').forEach(btn => {
                const i18nNameKey = btn.dataset.i18nName;
                if (i18nNameKey) {
                    btn.textContent = getNestedI18nValue(lang, i18nNameKey);
                    // 赋值text和type
                    const parts = i18nNameKey.split('.');
                    if (parts.length === 3 && parts[0] === 'examples') {
                        const exampleKey = parts[1];
                        const textVal = getNestedI18nValue(lang, `examples.${exampleKey}.text`);
                        const typeVal = getNestedI18nValue(lang, `examples.${exampleKey}.type`);
                        if (textVal) btn.dataset.text = textVal;
                        if (typeVal) btn.dataset.type = typeVal;
                    }
                }
            });

            // 更新提示文本
            const typeHint = document.getElementById('type-hint');
            if (typeHint) {
                const isImage = document.getElementById('type-image')?.checked;
                typeHint.textContent = isImage ? i18n[lang].imageHint : i18n[lang].audioHint;
            }
        
        // 触发语言变更事件
        const event = new CustomEvent('languageChanged', { detail: { language: lang } });
        document.dispatchEvent(event);
            console.log('[i18n] 已触发languageChanged事件');
            
            return true;
        } catch (error) {
            console.error('[i18n] 设置语言时发生错误:', error);
            return false;
        }
    }
    console.warn('[i18n] 不支持的语言:', lang);
    return false;
}

// 获取翻译文本
function t(key) {
    const lang = getCurrentLang();
    const keys = key.split('.');
    let value = i18n[lang];
    
    for (const k of keys) {
        if (value && value[k] !== undefined) {
            value = value[k];
        } else {
            console.warn(`[i18n] Translation missing for key: ${key} in language: ${lang}`);
            return key;
        }
    }
    
    console.log(`[i18n] t('${key}') =`, value, 'lang=', lang);
    return value;
}

// 更新页面所有文本
function updatePageText() {
    const lang = getCurrentLang();
    const dict = i18n[lang];
    console.log('[i18n] updatePageText called, lang=', lang);
    
    try {
        // 更新标题
    document.title = dict.title;
        console.log('[i18n] 已更新页面标题');
        
        // 更新所有带有data-i18n属性的元素
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const value = getNestedI18nValue(lang, key);
        if (value && value !== key) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = value;
            } else if (el.tagName === 'OPTION') {
                el.textContent = value;
            } else {
                el.innerHTML = value;
            }
                console.log(`[i18n] 已更新元素 [data-i18n=${key}]`);
            } else {
                console.warn(`[i18n] 未找到翻译键: ${key}`);
        }
    });

        // 更新特定元素
    const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.textContent = dict.title;
            console.log('[i18n] 已更新hero标题');
        }
        
    const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle) {
            heroSubtitle.textContent = dict.subtitle;
            console.log('[i18n] 已更新hero副标题');
        }

    // 更新输入区域
    const textInput = document.getElementById('text-input');
    if (textInput) {
        textInput.placeholder = dict.inputPlaceholder;
            console.log('[i18n] 已更新输入框placeholder');
    }

        // 更新生成按钮
    const generateButton = document.getElementById('generate-button');
    if (generateButton) {
        generateButton.textContent = dict.generateButton;
            console.log('[i18n] 已更新生成按钮文本');
        }
        
        // 更新其他UI元素
        const elements = {
            'inputTitle': '.input-section h2',
            'quickFillLabel': '.examples-label',
            'negativePromptLabel': '.negative-prompt h3',
            'generationType': '.options h3',
            'typeImage': 'label[for="type-image"]',
            'typeAudio': 'label[for="type-audio"]',
            'imageOptions': '.image-options h3',
            'aspectRatio': 'label[for="option-aspect-ratio"]',
            'width': 'label[for="option-width"]',
            'height': 'label[for="option-height"]',
            'noLogo': 'label[for="option-nologo"]',
            'numImages': 'label[for="option-num-images"]',
            'clearButton': '#clear-btn',
            'optimizeButton': '#optimize-btn',
            'randomButton': '#random-btn'
        };
        
        for (const [key, selector] of Object.entries(elements)) {
            const element = document.querySelector(selector);
            if (element && dict[key]) {
                element.textContent = dict[key];
                console.log(`[i18n] 已更新元素 ${selector}`);
            }
        }
        
        console.log('[i18n] 页面文本更新完成');

        // 修复：同步更新示例按钮内容
        document.querySelectorAll('.example-btn').forEach(btn => {
            const i18nNameKey = btn.dataset.i18nName;
            if (i18nNameKey) {
                btn.textContent = getNestedI18nValue(lang, i18nNameKey);
                // 赋值text和type
                const parts = i18nNameKey.split('.');
                if (parts.length === 3 && parts[0] === 'examples') {
                    const exampleKey = parts[1];
                    const textVal = getNestedI18nValue(lang, `examples.${exampleKey}.text`);
                    const typeVal = getNestedI18nValue(lang, `examples.${exampleKey}.type`);
                    if (textVal) btn.dataset.text = textVal;
                    if (typeVal) btn.dataset.type = typeVal;
                }
            }
        });
    } catch (error) {
        console.error('[i18n] 更新页面文本时发生错误:', error);
    }
}

// 监听语言变更事件
document.addEventListener('languageChanged', () => {
    updatePageText();
});

// 初始化时更新页面文本
document.addEventListener('DOMContentLoaded', () => {
    console.log('[i18n] DOMContentLoaded, initializing i18n...');
    
    // 初始化语言选择器
    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
        // 设置初始语言
        const currentLang = getCurrentLang();
        langSelect.value = currentLang;
        document.documentElement.lang = currentLang;
        
        // 添加change事件监听器
        langSelect.addEventListener('change', (e) => {
            console.log('[i18n] lang-select changed:', e.target.value);
            setLanguage(e.target.value);
        });
    }
    
    // 更新页面文本 - 使用setLanguage确保所有data-i18n元素正确处理
    const currentLang = getCurrentLang();
    setLanguage(currentLang);
});

// 将函数设为全局变量
window.getCurrentLang = getCurrentLang;
window.setLanguage = setLanguage;
window.t = t;
window.i18n = i18n;
window.updatePageText = updatePageText; 