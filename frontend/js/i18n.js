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
        aspectRatioLandscape4K: 'Landscape 4K (16:9 - 3840x2160)',
        aspectRatioPortrait4K: 'Portrait 4K (9:16 - 2160x3840)',
        
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
        
        // Image generator page
        imageGeneratorTitle: 'AISTONE - AI Image Generator',
        imageGeneratorSubtitle: 'AI-Driven · One-Click Generation · Unleash Creativity',
        imageGeneratorSlogan: 'Generate high-quality AI images for free, supporting various styles and sizes',
        breadcrumbImageGenerator: 'AI Image Generator',

        // About page
        aboutStatImages: 'Image Generations',
        aboutStatVoice: 'Voice Synthesis Duration',
        aboutStatUsers: 'Active Users',
        aboutStatUptime: 'Service Uptime',
        aboutCoreValuesTitle: '🎯 Our Core Values',
        aboutTechLeadTitle: 'Technical Leadership',
        aboutTechLeadDesc: 'Integrating latest AI models like FLUX and Stable Diffusion, providing industry-leading generation quality and speed',
        aboutOpenFreeTitle: 'Open & Free',
        aboutOpenFreeDesc: 'Adhering to technology accessibility principles, all core features are permanently free, lowering AI technology barriers',
        aboutEfficientTitle: 'Efficient & Convenient',
        aboutEfficientDesc: 'Use without registration, intuitive user interface, professional features at your fingertips',
        aboutSecureTitle: 'Secure & Reliable',
        aboutSecureDesc: 'Based on Cloudflare global network architecture, ensuring data security and service stability',

        // About page - extra keys
        aboutTimelineTitle: '📈 Milestones',
        aboutTimelineKickoff: 'Project Kickoff',
        aboutTimelineKickoffDesc: 'AISTONE officially launched with a focus on AI content generation, starting technical architecture design and prototyping.',
        aboutTimelineMvp: 'MVP Release',
        aboutTimelineMvpDesc: 'Released the minimum viable product with core image generation, receiving the first round of user feedback.',
        aboutTimelineImprove: 'Feature Improvements',
        aboutTimelineImproveDesc: 'Added TTS, improved UX, and introduced multilingual support and prompt optimization.',
        aboutTimelineEnterprise: 'Enterprise Services',
        aboutTimelineEnterpriseDesc: 'Launched enterprise-grade solutions with APIs and batch processing for B2B customers.',
        aboutTimelineUpgrade: 'Technology Upgrade',
        aboutTimelineUpgradeDesc: 'Integrated the latest FLUX models for higher image quality, plus advanced editing and post-processing.',
        aboutTimelineEcosystem: 'Ecosystem Building',
        aboutTimelineEcosystemDesc: 'Planning developer platform and plugin ecosystem to build an open AI creation ecosystem.',

        aboutTeamTitle: '👥 Team & Vision',
        aboutTeamProTitle: 'Professional Team',
        aboutTeamProDesc: 'Our team consists of AI experts, engineers and designers from top tech companies, turning cutting-edge AI into user-friendly products.',
        aboutTeamAI: '🤖 AI Research Team',
        aboutTeamAIDesc: 'Experts in deep learning, focusing on CV, NLP and speech research',
        aboutTeamEng: '💻 Engineering Team',
        aboutTeamEngDesc: 'Experienced engineers in cloud-native architecture, high concurrency systems and frontend tech',
        aboutTeamDesign: '🎨 Design Team',
        aboutTeamDesignDesc: 'UX designers focused on interaction and experience optimization for AI products',
        aboutTeamProduct: '📊 Product Team',
        aboutTeamProductDesc: 'PMs and analysts for product planning and user behavior analysis',

        aboutMissionTitle: 'Mission & Vision',
        aboutMission: '🎯 Mission',
        aboutMissionDesc: 'Make AI accessible, lower creation barriers and unleash creativity for everyone.',
        aboutVision: '🌟 Vision',
        aboutVisionDesc: 'Become a leading global AI content platform and drive innovation in creative AI.',
        aboutValues: '💎 Values',
        aboutValuesDesc: 'Open and inclusive, technology-first, user-centric, continuous innovation.',

        aboutEnterpriseTitle: '🏢 Enterprise Solutions',
        aboutEnterpriseIntroTitle: 'Tailored for Business',
        aboutEnterpriseIntroDesc: 'Beyond free services for individuals, AISTONE provides enterprise solutions for marketing, design and content production.',
        aboutSolutionBatch: 'Batch Content Generation',
        aboutSolutionBrand: 'Brand Customization',
        aboutSolutionPrivate: 'Private Deployment',

        aboutPartnerTitle: '🤝 Partnerships & Open Source',
        aboutPartnerAcademy: '🔬 Academic Cooperation',
        aboutPartnerAcademyDesc: 'Work with universities and institutes to advance AI research and application in creation.',
        aboutPartnerIndustry: '💼 Industrial Ecosystem',
        aboutPartnerIndustryDesc: 'Collaborate with chip vendors, cloud providers and content platforms to build a full-chain ecosystem.',
        aboutPartnerOpen: '🌐 Open Source',
        aboutPartnerOpenDesc: 'Contribute core components to open-source community and promote openness.',

        aboutAchievementsTitle: '🏆 Platform Data & Achievements',
        aboutAchievementsService: '📊 Service Data',
        aboutAchievementsTech: '🎖️ Technical Achievements',
        aboutAchievementsIndustry: '🌟 Industry Recognition',

        aboutContactTitle: '💬 Contact Us',
        aboutContactSupportTitle: 'Multi-channel Support',
        aboutContactSupportDesc: 'We provide various ways to stay connected and support your journey.',
        aboutContactEmail: 'Email Support',
        aboutContactEmailSla: 'Response within 24 hours on business days',
        aboutContactChat: 'Live Chat',
        aboutContactChatDesc: 'Chat window at the bottom-right of the site',
        aboutContactChatSla: 'Real-time during business hours',
        aboutContactFeedback: 'Feedback',
        aboutContactFeedbackDesc: 'Built-in feedback system',
        aboutContactFeedbackNote: 'Product suggestions and bug reports',

        aboutCommunityTitle: 'Join Our Community',

        aboutStartJourney: '🚀 Start Your AI Creation Journey',
        aboutStartCreate: '🎨 Start Creating Now',
        aboutStartCreateDesc: 'Experience AISTONE and create your AI artworks',
        aboutStartCreateCta: 'Create Now →',
        aboutStartGuide: '🧠 AI Guide',
        aboutStartGuideDesc: 'Learn the principles and practices of AI image generation',
        aboutStartGuideCta: 'Learn More →',
        aboutStartPrompt: '✍️ Prompt Engineering',
        aboutStartPromptDesc: 'Master prompting skills to improve creation quality',
        aboutStartPromptCta: 'Improve Skills →',
        aboutStartBiz: '💼 Business Cooperation',
        aboutStartBizDesc: 'Learn enterprise solutions and discuss customized needs',
        aboutStartBizCta: 'Contact Us →',

        // Tutorial page
        tutorialStep1Title: 'Step 1: Access Platform',
        tutorialStep1Desc: 'Open your browser and visit <a href="https://aistone.org">https://aistone.org</a>, no registration required to start using.',
        tutorialStep2Title: 'Step 2: Choose Generation Type',
        tutorialStep2Desc: 'On the page, select the type of content you want to generate:',
        tutorialImageGen: 'Generate Images:',
        tutorialImageGenDesc: 'Convert text descriptions into high-quality images',
        tutorialVoiceGen: 'Generate Voice:',
        tutorialVoiceGenDesc: 'Convert text into natural and fluent speech',
        tutorialWelcomeTitle: 'Welcome to AISTONE',
        tutorialWelcomeDesc: 'AISTONE is a powerful AI content creation platform supporting text-to-image and text-to-speech. This tutorial helps you get started quickly and make the most of the platform.',
        tutorialQuickStartTitle: '1. Quick Start',
        tutorialStep3Title: 'Step 3: Enter Description Text',
        tutorialStep3Desc: 'Enter your description in the text input box:',
        tutorialStep4Title: 'Step 4: Click Generate',
        tutorialStep4Desc: 'Click "Start Generation" and the AI will process your request. It usually takes 10–30 seconds.',
        tutorialImageFeaturesTitle: '2. Image Generation Features Explained',
        tutorialModelSelectionTitle: 'AI Model Selection',
        tutorialModelSelectionDesc: 'AISTONE provides multiple AI models to choose from:',

        // AI Guide page
        aiGuideCoreTechTitle: 'Core Technical Principles',
        aiGuideCoreTechDesc: '<strong>Diffusion Models</strong> are currently the most mainstream AI image generation technology. They mimic the diffusion process in physics:',
        aiGuideForwardProcess: 'Forward Process:',
        aiGuideForwardProcessDesc: 'Gradually add noise to clear images until they become pure noise',
        aiGuideReverseProcess: 'Reverse Process:',
        aiGuideReverseProcessDesc: 'AI learns to gradually denoise from noise, reconstructing meaningful images',
        aiGuideConditionalControl: 'Conditional Control:',
        aiGuideConditionalControlDesc: 'Convert prompts to mathematical vectors through text encoders to guide the generation process',
        aiGuideTechAdvantagesTitle: '💡 Technical Advantages',
        aiGuideHighQuality: 'High Quality Output:',
        aiGuideHighQualityDesc: 'Can generate professional-grade images at 8K resolution',
        aiGuideStyleDiversity: 'Style Diversity:',
        aiGuideStyleDiversityDesc: 'Supports various artistic styles including photography, painting, and illustration',
        aiGuideUnlimitedCreativity: 'Unlimited Creativity:',
        aiGuideUnlimitedCreativityDesc: 'Can create scenes and concepts that don\'t exist in reality',
        aiGuideCostEffective: 'Cost Effective:',
        aiGuideCostEffectiveDesc: 'Significantly reduces time and cost for visual content creation',
        
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
        // FAQ page
        faqIntro: 'This page collects the most common questions and answers. If you do not find the answer you need, please contact us via the page footer.',
        faqBasicTitle: 'Basic Usage Questions',
        faqImageGenTitle: 'Image Generation Features',
        faqQ5: 'What image formats and sizes are supported?',
        faqA5: 'Supports multiple mainstream formats (JPG, PNG, etc.) and aspect ratios: 1:1 (square), 16:9 (landscape), 9:16 (portrait), 4:3 (traditional ratio), etc. Also supports custom size settings (256-4096 pixels).',
        faqQ6: 'Can I generate multiple images?',
        faqA6: 'Yes, you can choose to generate 1, 2, or 4 images. The system will generate multiple variants based on your description for easy comparison and selection.',
        faqQ7: 'What are AI models? How to choose?',
        faqA7: 'AI models are algorithm engines for generating images:',
        faqFluxModel: 'FLUX:',
        faqFluxModelDesc: 'High-quality art creation, suitable for most scenarios',
        faqTurboModel: 'Turbo:',
        faqTurboModelDesc: 'Fast generation, suitable for prototyping',
        faqKontextModel: 'Kontext:',
        faqKontextModelDesc: 'Image-to-image generation, suitable for image editing',
        faqQ8: 'How long does image generation take?',
        faqA8: 'Usually takes 10-30 seconds, depending on description complexity, selected model, and current server load. Turbo model has the fastest generation speed.',
        faqQ9: 'What if image quality is poor?',
        faqA9: 'Try these methods to improve quality:',
        faqQualityTip1: 'Use more detailed descriptions',
        faqQualityTip2: 'Choose FLUX model',
        faqQualityTip3: 'Use higher resolution',
        faqQualityTip4: 'Utilize smart optimization features',
        faqQualityTip5: 'Add negative prompts to exclude unwanted elements',
        faqVoiceGenTitle: 'Voice Synthesis Features',
        faqQ10: 'What voice options are available?',
        faqA10: 'Provides 6 professional voice options:',
        faqVoiceAlloy: 'Alloy:',
        faqVoiceAlloyDesc: 'Professional female voice',
        faqVoiceEcho: 'Echo:',
        faqVoiceEchoDesc: 'Warm male voice',
        faqVoiceFable: 'Fable:',
        faqVoiceFableDesc: 'British female voice',
        faqVoiceOnyx: 'Onyx:',
        faqVoiceOnyxDesc: 'Deep male voice',
        faqVoiceNova: 'Nova:',
        faqVoiceNovaDesc: 'Lively female voice',
        faqVoiceShimmer: 'Shimmer:',
        faqVoiceShimmerDesc: 'Light female voice',
        faqQ11: 'Can I download generated voice?',
        faqA11: 'Yes, after generation you can play online or download audio files (WAV format) for local use.',
        faqQ12: 'How is the voice synthesis quality?',
        faqA12: 'Uses advanced AI voice synthesis technology to generate natural and fluent speech, supporting Chinese and English, suitable for videos, podcasts, voice content, and various scenarios.',
        
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
        // Contact help section
        contactHelpTitle: '📞 Get Help',
        contactHelpFAQTitle: '❓ Frequently Asked Questions',
        contactHelpFAQDesc: 'Check the FAQ first — your question may already be answered in detail.',
        contactHelpTutorialTitle: '📖 Tutorial',
        contactHelpTutorialDesc: 'Complete step-by-step guide to help you get started quickly.',
        contactHelpAboutTitle: 'ℹ️ About AISTONE',
        contactHelpAboutDesc: 'Learn about our platform vision and technical background.',
        contactHelpHomeTitle: '🏠 Back to Home',
        contactHelpHomeDesc: 'Return to the homepage to start using AI generation features.',
        
        // About page - Technology section
        aboutTechArchTitle: '🔬 Technology Architecture & Innovation',
        aboutTechIntegrationTitle: 'Cutting-edge AI Model Integration',
        aboutTechIntegrationDesc: 'AISTONE integrates the most advanced AI models to provide professional-grade content generation capabilities. Our tech stack is based on the latest diffusion model architecture, combining deep learning and neural network technologies to achieve high-quality text-to-image and text-to-speech conversion.',
        aboutImageTechTitle: '🎨 Image Generation Technology',
        aboutFluxModel: 'FLUX Series Models:',
        aboutFluxModelDesc: 'Latest open-source diffusion models supporting high-resolution image generation',
        aboutStableDiffusion: 'Stable Diffusion:',
        aboutStableDiffusionDesc: 'Mature and stable image generation foundation supporting various artistic styles',
        aboutPromptOptimization: 'Smart Prompt Optimization:',
        aboutPromptOptimizationDesc: 'Automatic prompt enhancement based on DeepSeek large language models',
        aboutParameterControl: 'Multi-parameter Control:',
        aboutParameterControlDesc: 'Supports professional parameter adjustments including size, ratio, steps, CFG, etc.',
        aboutVoiceTechTitle: '🎵 Voice Synthesis Technology',
        aboutNeuralTTS: 'Neural Network TTS:',
        aboutNeuralTTSDesc: 'High-quality voice synthesis based on Transformer architecture',
        aboutMultiVoice: 'Multi-voice Support:',
        aboutMultiVoiceDesc: '6 professional-grade voices adapted to different application scenarios',
        aboutEmotionControl: 'Emotional Expression:',
        aboutEmotionControlDesc: 'Supports detailed control of tone, speed, pauses, etc.',
        aboutRealTimeProcessing: 'Real-time Processing:',
        aboutRealTimeProcessingDesc: 'Millisecond-level response supporting long-text streaming synthesis',
        aboutCloudArchTitle: 'Cloud-native Architecture Design',
        aboutFrontendLayer: '🌐 Frontend Layer',
        aboutFrontendLayerDesc: 'Responsive web application supporting multi-device access, built on modern JavaScript frameworks',
        aboutAPIGateway: '⚡ API Gateway',
        aboutAPIGatewayDesc: 'Cloudflare Workers edge computing with global distributed deployment ensuring low-latency access',
        aboutAIInferenceLayer: '🧠 AI Inference Layer',
        aboutAIInferenceLayerDesc: 'Integrated multiple AI service providers with intelligent load balancing ensuring high availability',
        aboutDataStorage: '💾 Data Storage',
        aboutDataStorageDesc: 'KV storage for user data, R2 object storage for generated content management, global synchronization',
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
        aspectRatioLandscape4K: '横向4K (16:9 - 3840x2160)',
        aspectRatioPortrait4K: '竖向4K (9:16 - 2160x3840)',
        
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
        translateButton: '翻译',
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
        
        // 认证消息
        registerSuccess: '注册成功！',
        registerFailed: '注册失败',
        loginSuccess: '登录成功！',
        loginFailed: '登录失败',
        logoutSuccess: '已成功登出',
        networkError: '网络错误，请稍后重试',
        processing: '处理中...',
        submit: '提交',
        
        // 表单验证
        passwordMinLength: '至少6位',
        passwordMismatch: '两次输入的密码不一致',
        fillEmailPassword: '请填写邮箱与至少6位密码',
        fillUserInfo: '请输入用户名与邮箱',
        enterEmail: '请输入邮箱地址',
        passwordMinSix: '密码长度至少6位',
        invalidResetLink: '重置链接无效',
        
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

        // 图片生成器页面
        imageGeneratorTitle: 'AISTONE - AI图片生成器',
        imageGeneratorSubtitle: 'AI驱动·一键生成·释放创意',
        imageGeneratorSlogan: '免费生成高质量AI图片，支持多种风格和尺寸',
        breadcrumbImageGenerator: 'AI图片生成器',

        // 关于页面
        aboutStatImages: '图像生成次数',
        aboutStatVoice: '语音合成时长',
        aboutStatUsers: '活跃用户',
        aboutStatUptime: '服务可用性',
        aboutCoreValuesTitle: '🎯 我们的核心价值',
        aboutTechLeadTitle: '技术领先',
        aboutTechLeadDesc: '集成FLUX、Stable Diffusion等最新AI模型，提供业界领先的生成质量和速度',
        aboutOpenFreeTitle: '开放免费',
        aboutOpenFreeDesc: '坚持技术普惠理念，所有核心功能永久免费开放，降低AI技术使用门槛',
        aboutEfficientTitle: '高效便捷',
        aboutEfficientDesc: '无需注册即用，简洁直观的用户界面，专业级功能一键触达',
        aboutSecureTitle: '安全可靠',
        aboutSecureDesc: '基于Cloudflare全球网络架构，确保数据安全和服务稳定性',

        // 关于页 - 额外键位
        aboutTimelineTitle: '📈 发展历程',
        aboutTimelineKickoff: '项目启动',
        aboutTimelineKickoffDesc: 'AISTONE项目正式启动，确定以AI内容生成为核心的产品方向，开始技术架构设计和原型开发。',
        aboutTimelineMvp: 'MVP发布',
        aboutTimelineMvpDesc: '发布最小可用产品版本，集成基础的图像生成功能，获得首批用户验证和反馈。',
        aboutTimelineImprove: '功能完善',
        aboutTimelineImproveDesc: '新增语音合成功能，完善用户体验设计，增加多语言支持和智能提示词优化功能。',
        aboutTimelineEnterprise: '企业级服务',
        aboutTimelineEnterpriseDesc: '推出企业级解决方案，提供API接口和批量处理服务，服务B端客户需求。',
        aboutTimelineUpgrade: '技术升级',
        aboutTimelineUpgradeDesc: '集成最新的FLUX模型，大幅提升图像生成质量，新增高级编辑和后处理功能。',
        aboutTimelineEcosystem: '生态建设',
        aboutTimelineEcosystemDesc: '计划推出开发者平台、插件生态系统，建立AI内容创作的开放生态，赋能更多创作者。',

        aboutTeamTitle: '👥 团队与愿景',
        aboutTeamProTitle: '专业技术团队',
        aboutTeamProDesc: 'AISTONE团队由来自顶尖科技公司的AI专家、软件工程师和产品设计师组成。我们在机器学习、云计算和用户体验设计方面拥有丰富的经验，致力于将最前沿的AI技术转化为用户友好的产品。',
        aboutTeamAI: '🤖 AI研发团队',
        aboutTeamAIDesc: '深度学习算法专家，专注于计算机视觉、自然语言处理和语音技术研发',
        aboutTeamEng: '💻 工程团队',
        aboutTeamEngDesc: '资深软件工程师，擅长云原生架构、高并发系统和前端技术',
        aboutTeamDesign: '🎨 设计团队',
        aboutTeamDesignDesc: '用户体验设计师，专注于AI产品的交互设计和用户体验优化',
        aboutTeamProduct: '📊 产品团队',
        aboutTeamProductDesc: '产品经理和数据分析师，负责产品规划和用户行为分析',

        aboutMissionTitle: '使命与愿景',
        aboutMission: '🎯 使命',
        aboutMissionDesc: '让AI技术普惠大众，降低内容创作门槛，释放每个人的创造力潜能。',
        aboutVision: '🌟 愿景',
        aboutVisionDesc: '成为全球领先的AI内容创作平台，推动人工智能在创意领域的应用创新。',
        aboutValues: '💎 价值观',
        aboutValuesDesc: '开放包容、技术至上、用户第一、持续创新。',

        aboutEnterpriseTitle: '🏢 企业级解决方案',
        aboutEnterpriseIntroTitle: '为企业量身定制',
        aboutEnterpriseIntroDesc: '除了面向个人用户的免费服务，AISTONE还提供企业级解决方案，帮助企业客户在营销、设计、内容制作等领域实现AI化转型。',
        aboutSolutionBatch: '批量内容生成',
        aboutSolutionBrand: '品牌定制服务',
        aboutSolutionPrivate: '私有化部署',

        aboutPartnerTitle: '🤝 技术合作与开源贡献',
        aboutPartnerAcademy: '🔬 学术合作',
        aboutPartnerAcademyDesc: '与国内外知名高校和研究机构建立合作关系，共同推进AI技术在内容创作领域的研究与应用。',
        aboutPartnerIndustry: '💼 产业生态',
        aboutPartnerIndustryDesc: '与AI芯片厂商、云服务提供商、内容平台等建立生态合作，构建完整的AI内容创作产业链。',
        aboutPartnerOpen: '🌐 开源贡献',
        aboutPartnerOpenDesc: '积极参与开源社区建设，贡献核心技术组件，推动AI技术的开放发展。',

        aboutAchievementsTitle: '🏆 平台数据与成就',
        aboutAchievementsService: '📊 服务数据',
        aboutAchievementsTech: '🎖️ 技术成就',
        aboutAchievementsIndustry: '🌟 行业认可',

        aboutContactTitle: '💬 联系我们',
        aboutContactSupportTitle: '多渠道支持服务',
        aboutContactSupportDesc: '我们提供多种方式与用户保持联系，确保您在使用过程中得到及时的帮助和支持。',
        aboutContactEmail: '邮件支持',
        aboutContactEmailSla: '工作日24小时内回复',
        aboutContactChat: '在线客服',
        aboutContactChatDesc: '网站右下角聊天窗口',
        aboutContactChatSla: '工作时间实时响应',
        aboutContactFeedback: '问题反馈',
        aboutContactFeedbackDesc: '平台内置反馈系统',
        aboutContactFeedbackNote: '产品建议和Bug报告',

        aboutCommunityTitle: '加入我们的社区',

        aboutStartJourney: '🚀 开始您的AI创作之旅',
        aboutStartCreate: '🎨 立即开始创作',
        aboutStartCreateDesc: '体验AISTONE的强大功能，创造属于您的AI艺术作品',
        aboutStartCreateCta: '开始创作 →',
        aboutStartGuide: '🧠 AI技术指南',
        aboutStartGuideDesc: '深入了解AI图像生成技术原理和应用实践',
        aboutStartGuideCta: '学习技术 →',
        aboutStartPrompt: '✍️ 提示词工程',
        aboutStartPromptDesc: '掌握专业的提示词技巧，提升AI创作质量',
        aboutStartPromptCta: '提升技能 →',
        aboutStartBiz: '💼 企业合作',
        aboutStartBizDesc: '了解企业级解决方案，探讨定制化服务需求',
        aboutStartBizCta: '联系我们 →',

        // 教程页面
        tutorialStep1Title: '步骤1：访问平台',
        tutorialStep1Desc: '打开浏览器访问 <a href="https://aistone.org">https://aistone.org</a>，无需注册即可开始使用。',
        tutorialStep2Title: '步骤2：选择生成类型',
        tutorialStep2Desc: '在页面上选择您想要生成的内容类型：',
        tutorialImageGen: '生成图片：',
        tutorialImageGenDesc: '将文本描述转换为高质量图片',
        tutorialVoiceGen: '生成语音：',
        tutorialVoiceGenDesc: '将文本转换为自然流畅的语音',

        // AI指南页面
        aiGuideCoreTechTitle: '核心技术原理',
        aiGuideCoreTechDesc: '<strong>扩散模型（Diffusion Models）</strong>是目前最主流的AI图像生成技术。它模仿物理学中的扩散过程：',
        aiGuideForwardProcess: '正向过程：',
        aiGuideForwardProcessDesc: '将清晰图像逐步添加噪声，直到变成纯噪声',
        aiGuideReverseProcess: '逆向过程：',
        aiGuideReverseProcessDesc: 'AI学会从噪声中逐步去噪，重构出有意义的图像',
        aiGuideConditionalControl: '条件控制：',
        aiGuideConditionalControlDesc: '通过文本编码器将提示词转换为数学向量，引导生成过程',
        aiGuideTechAdvantagesTitle: '💡 技术优势',
        aiGuideHighQuality: '高质量输出：',
        aiGuideHighQualityDesc: '能够生成8K分辨率的专业级图像',
        aiGuideStyleDiversity: '风格多样性：',
        aiGuideStyleDiversityDesc: '支持摄影、绘画、插画等各种艺术风格',
        aiGuideUnlimitedCreativity: '创意无限：',
        aiGuideUnlimitedCreativityDesc: '可以创造现实中不存在的场景和概念',
        aiGuideCostEffective: '成本效益：',
        aiGuideCostEffectiveDesc: '大幅降低视觉内容创作的时间和成本',
        
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
        navImageGen: '图像生成',
        navVoiceGen: '语音合成',
        navAbout: '关于我们',
        navAIGuide: 'AI指南',
        navPromptEngineering: '提示词工程',
        navTutorial: '使用教程',
        navFAQ: '常见问题',
        navContact: '联系我们',
        navServices: '我们的服务',
        navLogin: '登录',
        
        // 面包屑导航
        breadcrumbHome: '首页',
        
        // 语音页面专用翻译
        voiceHeroTitle: 'AISTONE - 免费AI语音合成平台',
        voiceHeroSubtitle: '文本转语音 • 多种音色 • 完全免费',
        voiceHeroSlogan: 'AI驱动·自然语音·专业级品质！',
        voiceInputTitle: '文本内容',
        voiceGeneratorTitle: 'AI语音合成器',
        voiceGeneratorDesc: '输入文本，AI将为您生成自然流畅的语音',
        voiceTextLabel: '输入文本内容',
        voiceTextHint: '（支持中文和英文，建议300字以内）',
        voiceTextPlaceholder: '在这里输入您想要转换为语音的文本...',
        voiceModelLabel: '音色选择',
        voiceSpeedLabel: '语速调节',
        voiceExamplesLabel: '示例文本（点击使用）',
        generateVoiceBtn: '生成语音',
        voiceResultTitle: '生成结果',
        downloadAudio: '下载音频',
        copyLink: '复制链接',
        fileSize: '文件大小:',
        logsTitle: '调用日志',
        historyTitle: '历史记录',
        shareAudio: '分享',
        saveToGallery: '保存到个人中心',
        voiceLength: '时长',
        voiceModel: '音色',
        voiceSpeed: '语速',
        voiceFeature1: '多种AI音色',
        voiceFeature2: '中英文支持',
        voiceFeature3: '实时生成',
        voiceFeature4: '完全免费',
        
        // 语音特色功能
        voiceFeaturesTitle: 'AI语音合成特色',
        voiceFeatureTitle1: '多样音色选择',
        voiceFeatureDesc1: '提供6种不同风格的AI音色，包括男声、女声，适应不同场景需求，让每个声音都有独特的个性。',
        voiceFeatureTitle2: '实时快速生成',
        voiceFeatureDesc2: '采用先进的AI语音合成技术，支持实时文本转语音，几秒钟即可生成高质量的自然语音。',
        voiceFeatureTitle3: '中英双语支持',
        voiceFeatureDesc3: '完美支持中文和英文文本转语音，智能识别语言类型，为全球用户提供优质的语音合成服务。',
        voiceFeatureTitle4: '灵活语速控制',
        voiceFeatureDesc4: '支持0.25x到4.0x的语速调节，满足不同应用场景，从慢速学习到快速播报，自由控制。',
        voiceFeatureTitle5: '高质量输出',
        voiceFeatureDesc5: '生成的语音清晰自然，情感表达丰富，适合播客、有声书、教育内容等专业应用场景。',
        voiceFeatureTitle6: '完全免费使用',
        voiceFeatureDesc6: '无需注册，无使用限制，所有功能永久免费开放，让每个人都能享受AI语音合成的便利。',
        
        // 应用场景
        voiceUseCasesTitle: '应用场景',
        voiceUseCase1Title: '播客制作',
        voiceUseCase1Desc: '为播客节目制作专业的开场白、介绍语或背景旁白，提升内容的专业度和吸引力。',
        voiceUseCase2Title: '有声读物',
        voiceUseCase2Desc: '将文字内容转换为有声读物，让阅读更加便捷，适合学习、休闲等多种场景。',
        voiceUseCase3Title: '教育培训',
        voiceUseCase3Desc: '制作教学音频、课程讲解、语言学习材料，提升教育内容的可访问性和学习体验。',
        voiceUseCase4Title: '营销推广',
        voiceUseCase4Desc: '创建产品介绍、广告词、宣传片配音，为营销内容增加声音的感染力和说服力。',
        voiceUseCase5Title: '视频制作',
        voiceUseCase5Desc: '为视频内容添加旁白、解说或对话，提升视频的专业性和观看体验。',
        voiceUseCase6Title: '辅助工具',
        voiceUseCase6Desc: '为视障人士提供文本朗读服务，或作为语言学习的发音参考工具。',
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

        // 高清图片管理
        hdImageTooLarge: '图片太大，请重试（最大2MB）',
        hdImageSaved: '高清图片保存成功！',
        hdImageSaveFailed: '保存失败',
        hdImageListFailed: '获取图片列表失败',
        hdImageLoadError: '获取图片失败',
        hdImagePrepareDownload: '正在准备下载...',
        hdImageDownloadSuccess: '下载成功！',
        hdImageDownloadFailed: '下载失败',
        hdImageDeleteConfirm: '确定要删除这张图片吗？',
        hdImageDeleted: '图片删除成功！',
        hdImageDeleteFailed: '删除失败',
        hdImageLoadFailed: '加载图片列表失败',
        hdImageLoadingHD: '正在加载高清图片...',
        hdImageThumbnail: '缩略图',
        hdImageSaving: '正在保存...',
        hdImageStats: '统计信息错误',
        hdClickToView: '点击查看高清图片',
        
        // 用户中心
        userCenter: '个人中心',
        userUpdateSuccess: '更新成功',
        userPasswordMismatch: '两次输入的密码不一致',
        userFeatureComing: '功能开发中，敬请期待',
        newPassword: '新密码',
        confirmNewPassword: '确认新密码',
        
        // 反馈系统
        feedbackTitle: '留言与建议',
        feedbackCategory: '反馈类别',
        feedbackContent: '反馈内容',
        feedbackSubmit: '提交反馈',
        feedbackPlaceholder: '请描述您的问题或建议...',
        feedbackSuccess: '反馈提交成功，感谢您的建议！',
        feedbackError: '提交失败，请稍后重试',
        feedbackEmpty: '反馈内容不能为空',
        feedbackTooLong: '反馈内容不能超过1000字符',
        feedbackRateLimit: '请稍后再提交反馈',
        myFeedback: '我的留言',
        noFeedback: '暂无留言记录',
        feedbackStatus: '状态',
        feedbackTime: '提交时间',
        feedbackPending: '待处理',
        feedbackProcessed: '已处理',
        
        // 反馈类别
        feedbackCategories: {
            bug: '问题反馈',
            feature: '功能建议',
            improvement: '体验改进',
            other: '其他'
        },
        
        // 提示词模板
        promptTemplates: '常用模板',
        promptTemplateTitle: '常用提示词模板',
        templateCategories: {
            landscape: '风景',
            portrait: '人像',
            product: '产品拍摄',
            avatar: '头像',
            anime: '二次元',
            logo: 'Logo/海报'
        },
        useTemplate: '使用模板',
        templateApplied: '模板已应用',
        
        // 模态框和弹窗
        showModal: '显示模态框',
        closeModal: '关闭模态框',
        modalNotFound: '模态框未找到',
        authModalLoadFailed: '加载认证界面失败',
        authModuleInitSuccess: '认证模块初始化完成',
        authModuleNotLoaded: '认证模块未加载',
        imageModuleInitSuccess: '图片管理模块初始化完成',
        imageModuleNotLoaded: '图片管理模块未加载',
        userLoggedInInit: '用户已登录，初始化图片管理器',
        
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

        // AI指南页面
        aiGuideTitle: 'AI图像生成指南',
        aiGuideMainTitle: 'AI图像生成完整指南',
        aiGuideSubtitle: '从基础理论到实战技巧，成为AI艺术创作专家',
        aiGuideAuthor: 'AISTONE技术团队',
        aiGuideDate: '2025年9月9日',
        aiGuideReadingTime: '约10分钟阅读',
        
        // AI指南目录
        aiGuideTocTitle: '📋 目录',
        aiGuideToc1: '1. AI图像生成技术概述',
        aiGuideToc2: '2. 主流AI模型深度解析',
        aiGuideToc3: '3. 提示词工程实战技巧',
        aiGuideToc4: '4. 高质量图像生成策略',
        aiGuideToc5: '5. 常见问题与解决方案',
        aiGuideToc6: '6. 进阶创作技巧与工作流',
        
        // AI指南第一章
        aiGuideChapter1Title: '🧠 1. AI图像生成技术概述',
        aiGuideWhatIsTitle: '什么是AI图像生成？',
        aiGuideWhatIsDesc: 'AI图像生成是一种利用深度学习技术，通过文本描述自动创建图像的革命性技术。这项技术基于大规模的图像-文本数据集训练，能够理解自然语言描述并将其转换为视觉内容。',
        aiGuideTechHistoryTitle: '🔥 技术发展历程',

        // 提示词工程页面
        promptEngineeringTitle: '提示词工程教程',
        promptEngineeringMainTitle: '提示词工程专业教程',
        promptEngineeringSubtitle: '掌握AI图像生成的核心技能 - 从基础语法到高级策略',
        promptEngineeringAuthor: 'AISTONE专家团队',
        promptEngineeringDate: '2025年9月9日',
        promptEngineeringReadingTime: '约12分钟阅读',
        
        // 提示词工程课程概览（中文）
        promptOverviewTitle: '🎯 课程概览',
        promptBasicSyntaxTitle: '🚀 基础语法',
        promptBasicSyntaxDesc: '掌握提示词的基本结构和组织原则',
        promptWeightControlTitle: '⚡ 权重控制',
        promptWeightControlDesc: '学会精确控制各元素的重要性',
        promptNegativeTitle: '🚫 负面提示词',
        promptNegativeDesc: '排除不需要的元素，提升生成质量',
        promptStyleTitle: '🎨 风格融合',
        promptStyleDesc: '创造独特的艺术风格和视觉效果',

        // 关于页面
        aboutHeroTitle: 'AISTONE - 重新定义内容创作',
        aboutHeroSubtitle: '基于最新AI技术的专业内容创作平台，为创作者和企业提供高效、智能的图像生成与语音合成解决方案',
        
        // 服务页面相关内容推荐
        relatedContentTitle: '✨ 继续探索',
        relatedImageGen: '🎨 AI图片生成',
        tryNow: '前往体验 →',
        relatedAIGuide: '🧠 AI技术指南',
        relatedAIGuideDesc: '深入了解AI语音合成技术原理和应用实践',
        learnMore: '了解更多 →',
        relatedTutorial: '📖 使用教程',
        startLearning: '开始学习 →',
        relatedImageGenTitle: '🎨 AI图片生成',
        relatedImageGenDesc: '体验我们的核心服务，将想法转化为精美图像',
        relatedVoiceGenTitle: '🎵 AI语音合成',
        relatedVoiceGenDesc: '将文字转换为自然语音，完全免费使用',
        relatedTutorialTitle: '📖 快速上手',
        relatedTutorialDesc: '学习如何使用各项功能，获得最佳体验',
        relatedAboutTitle: 'ℹ️ 了解技术',
        relatedAboutDesc: '深入了解我们的AI技术和平台愿景',
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
        aspectRatioLandscape4K: 'Landscape 4K (16:9 - 3840x2160)',
        aspectRatioPortrait4K: 'Portrait 4K (9:16 - 2160x3840)',
        
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
        translateButton: 'Translate',
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
        
        // Authentication messages
        registerSuccess: 'Registration successful!',
        registerFailed: 'Registration failed',
        loginSuccess: 'Login successful!',
        loginFailed: 'Login failed',
        logoutSuccess: 'Logged out successfully',
        networkError: 'Network error, please try again later',
        processing: 'Processing...',
        submit: 'Submit',
        
        // Form validation
        passwordMinLength: 'At least 6 characters',
        passwordMismatch: 'Passwords do not match',
        fillEmailPassword: 'Please fill in email and password (at least 6 characters)',
        fillUserInfo: 'Please enter username and email',
        enterEmail: 'Please enter email address',
        passwordMinSix: 'Password must be at least 6 characters',
        invalidResetLink: 'Invalid reset link',
        
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
        navImageGen: 'Image Generation',
        navVoiceGen: 'Voice Synthesis',
        navAbout: 'About',
        navAIGuide: 'AI Guide',
        navPromptEngineering: 'Prompt Engineering',
        navTutorial: 'Tutorial',
        navFAQ: 'FAQ',
        navContact: 'Contact',
        navServices: 'Services',
        navLogin: 'Login',
        
        // Breadcrumb navigation
        breadcrumbHome: 'Home',
        
        // Voice page specific translations
        voiceHeroTitle: 'AISTONE - Free AI Voice Synthesis Platform',
        voiceHeroSubtitle: 'Text-to-Speech • Multiple Voices • Completely Free',
        voiceHeroSlogan: 'AI-Powered · Natural Voice · Professional Quality!',
        voiceInputTitle: 'Text Content',
        voiceGeneratorTitle: 'AI Voice Synthesizer',
        voiceGeneratorDesc: 'Enter text and AI will generate natural, fluent speech for you',
        voiceTextLabel: 'Enter text content',
        voiceTextHint: '(Supports Chinese and English, recommended within 300 characters)',
        voiceTextPlaceholder: 'Enter the text you want to convert to speech here...',
        voiceModelLabel: 'Voice Selection',
        voiceSpeedLabel: 'Speed Control',
        voiceExamplesLabel: 'Example texts (click to use)',
        generateVoiceBtn: 'Generate Voice',
        voiceResultTitle: 'Generation Result',
        downloadAudio: 'Download Audio',
        copyLink: 'Copy link',
        fileSize: 'File Size:',
        logsTitle: 'Logs',
        historyTitle: 'History',
        shareAudio: 'Share',
        saveToGallery: 'Save to Personal Center',
        voiceLength: 'Duration:',
        voiceModel: 'Voice:',
        voiceSpeed: 'Speed:',
        voiceFeature1: 'Multiple AI Voices',
        voiceFeature2: 'Chinese-English Support',
        voiceFeature3: 'Real-time Generation',
        voiceFeature4: 'Completely Free',
        
        // Voice features
        voiceFeaturesTitle: 'AI Voice Synthesis Features',
        voiceFeatureTitle1: 'Diverse Voice Options',
        voiceFeatureDesc1: 'Provides 6 different styles of AI voices, including male and female voices, adapting to different scenarios and giving each voice unique personality.',
        voiceFeatureTitle2: 'Real-time Fast Generation',
        voiceFeatureDesc2: 'Adopts advanced AI voice synthesis technology, supports real-time text-to-speech, generating high-quality natural speech in seconds.',
        voiceFeatureTitle3: 'Chinese-English Bilingual Support',
        voiceFeatureDesc3: 'Perfect support for Chinese and English text-to-speech, intelligently recognizes language types, providing quality voice synthesis services for global users.',
        voiceFeatureTitle4: 'Flexible Speed Control',
        voiceFeatureDesc4: 'Supports speed adjustment from 0.25x to 4.0x, meeting different application scenarios, from slow learning to fast broadcasting, free control.',
        voiceFeatureTitle5: 'High-quality Output',
        voiceFeatureDesc5: 'Generated speech is clear and natural with rich emotional expression, suitable for professional application scenarios such as podcasts, audiobooks, educational content.',
        voiceFeatureTitle6: 'Completely Free to Use',
        voiceFeatureDesc6: 'No registration required, no usage restrictions, all features permanently free and open, allowing everyone to enjoy the convenience of AI voice synthesis.',
        
        // Voice use cases
        voiceUseCasesTitle: 'Application Scenarios',
        voiceUseCase1Title: 'Podcast Production',
        voiceUseCase1Desc: 'Create professional intros, introductions, or background narration for podcast programs to enhance content professionalism and appeal.',
        voiceUseCase2Title: 'Audiobooks',
        voiceUseCase2Desc: 'Convert text content into audiobooks, making reading more convenient and suitable for various scenarios such as learning and leisure.',
        voiceUseCase3Title: 'Educational Training',
        voiceUseCase3Desc: 'Create teaching audio, course explanations, language learning materials to enhance accessibility and learning experience of educational content.',
        voiceUseCase4Title: 'Marketing Promotion',
        voiceUseCase4Desc: 'Create product introductions, advertising copy, promotional video dubbing, adding voice appeal and persuasiveness to marketing content.',
        voiceUseCase5Title: 'Video Production',
        voiceUseCase5Desc: 'Add narration, commentary, or dialogue to video content, enhancing video professionalism and viewing experience.',
        voiceUseCase6Title: 'Auxiliary Tools',
        voiceUseCase6Desc: 'Provide text reading services for visually impaired people, or serve as pronunciation reference tools for language learning.',
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

        // HD Image Management
        hdImageTooLarge: 'Image too large, please retry (max 2MB)',
        hdImageSaved: 'HD image saved successfully!',
        hdImageSaveFailed: 'Save failed',
        hdImageListFailed: 'Failed to get image list',
        hdImageLoadError: 'Failed to get image',
        hdImagePrepareDownload: 'Preparing download...',
        hdImageDownloadSuccess: 'Download succeeded!',
        hdImageDownloadFailed: 'Download failed',
        hdImageDeleteConfirm: 'Are you sure you want to delete this image?',
        hdImageDeleted: 'Image deleted successfully!',
        hdImageDeleteFailed: 'Delete failed',
        hdImageLoadFailed: 'Failed to load image list',
        hdImageLoadingHD: 'Loading HD image...',
        hdImageThumbnail: 'Thumbnail',
        hdImageSaving: 'Saving...',
        hdImageStats: 'Statistics error',
        hdClickToView: 'Click to view HD image',
        
        // User Center
        userCenter: 'User Center',
        userUpdateSuccess: 'Update successful',
        userPasswordMismatch: 'Passwords do not match',
        userFeatureComing: 'Feature coming soon, stay tuned',
        newPassword: 'New Password',
        confirmNewPassword: 'Confirm New Password',
        
        // Feedback System
        feedbackTitle: 'Feedback & Suggestions',
        feedbackCategory: 'Feedback Category',
        feedbackContent: 'Feedback Content',
        feedbackSubmit: 'Submit Feedback',
        feedbackPlaceholder: 'Please describe your issue or suggestion...',
        feedbackSuccess: 'Feedback submitted successfully, thank you for your suggestion!',
        feedbackError: 'Submission failed, please try again later',
        feedbackEmpty: 'Feedback content cannot be empty',
        feedbackTooLong: 'Feedback content cannot exceed 1000 characters',
        feedbackRateLimit: 'Please wait before submitting another feedback',
        myFeedback: 'My Feedback',
        noFeedback: 'No feedback records yet',
        feedbackStatus: 'Status',
        feedbackTime: 'Submit Time',
        feedbackPending: 'Pending',
        feedbackProcessed: 'Processed',
        
        // Feedback Categories
        feedbackCategories: {
            bug: 'Bug Report',
            feature: 'Feature Request',
            improvement: 'User Experience',
            other: 'Other'
        },
        
        // Prompt Templates
        promptTemplates: 'Templates',
        promptTemplateTitle: 'Common Prompt Templates',
        templateCategories: {
            landscape: 'Landscape',
            portrait: 'Portrait',
            product: 'Product Photography',
            avatar: 'Avatar',
            anime: 'Anime',
            logo: 'Logo/Poster'
        },
        useTemplate: 'Use Template',
        templateApplied: 'Template Applied',
        
        // Modals and Popups
        showModal: 'Show modal',
        closeModal: 'Close modal',
        modalNotFound: 'Modal not found',
        authModalLoadFailed: 'Failed to load authentication interface',
        authModuleInitSuccess: 'Authentication module initialized successfully',
        authModuleNotLoaded: 'Authentication module not loaded',
        imageModuleInitSuccess: 'Image management module initialized successfully',
        imageModuleNotLoaded: 'Image management module not loaded',
        userLoggedInInit: 'User logged in, initializing image manager',

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

        // AI Guide Page
        aiGuideTitle: 'AI Image Generation Guide',
        aiGuideMainTitle: 'Complete AI Image Generation Guide',
        aiGuideSubtitle: 'From basic theory to practical skills, become an AI art creation expert',
        aiGuideAuthor: 'AISTONE Technical Team',
        aiGuideDate: 'September 9, 2025',
        aiGuideReadingTime: 'About 10 minutes read',
        
        // AI Guide Table of Contents
        aiGuideTocTitle: '📋 Table of Contents',
        aiGuideToc1: '1. AI Image Generation Technology Overview',
        aiGuideToc2: '2. Mainstream AI Models Deep Analysis',
        aiGuideToc3: '3. Prompt Engineering Practical Skills',
        aiGuideToc4: '4. High-Quality Image Generation Strategies',
        aiGuideToc5: '5. Common Issues and Solutions',
        aiGuideToc6: '6. Advanced Creation Techniques and Workflows',
        
        // AI Guide Chapter 1
        aiGuideChapter1Title: '🧠 1. AI Image Generation Technology Overview',
        aiGuideWhatIsTitle: 'What is AI Image Generation?',
        aiGuideWhatIsDesc: 'AI image generation is a revolutionary technology that uses deep learning to automatically create images from text descriptions. This technology is trained on large-scale image-text datasets, enabling it to understand natural language descriptions and convert them into visual content.',
        aiGuideTechHistoryTitle: '🔥 Technology Development History',
        // AI Guide Chapters - English rich HTML containers
        aiGuide: {
            chapter2: {
                title: '🎯 2. In-depth Analysis of Mainstream AI Models',
                modelComparisonHTML: `
                        <h3>FLUX Model Series</h3>
                        <div class="model-card">
                            <h4>FLUX.1 [pro]</h4>
                            <ul>
                                <li><strong>Features:</strong> Highest quality commercial model with photo-grade output</li>
                                <li><strong>Best for:</strong> Commercial ads, product showcase, professional illustrations</li>
                                <li><strong>Advantages:</strong> Accurate color reproduction, rich details, professional composition</li>
                                <li><strong>Suggested size:</strong> 1024x1024 or higher</li>
                            </ul>
                        </div>

                        <div class="model-card">
                            <h4>FLUX.1 [dev]</h4>
                            <ul>
                                <li><strong>Features:</strong> Developer version balancing quality and speed</li>
                                <li><strong>Best for:</strong> Prototyping, concept art, creative exploration</li>
                                <li><strong>Advantages:</strong> Fast generation, low resource usage, stable results</li>
                                <li><strong>Suggested size:</strong> 512x512 to 1024x1024</li>
                            </ul>
                        </div>

                        <h3>Stable Diffusion Family</h3>
                        <div class="model-card">
                            <h4>Stable Diffusion XL (SDXL)</h4>
                            <ul>
                                <li><strong>Features:</strong> High-resolution expert with native 1024x1024 output</li>
                                <li><strong>Best for:</strong> Art creation, concept design, style experiments</li>
                                <li><strong>Advantages:</strong> Open-source, strong community, highly customizable</li>
                                <li><strong>Ecosystem:</strong> Supports LoRA, ControlNet and more</li>
                            </ul>
                        </div>

                        <h3>Other Notable Models</h3>
                        <div class="model-card">
                            <h4>Midjourney</h4>
                            <ul>
                                <li><strong>Features:</strong> Strong artistic expression and color performance</li>
                                <li><strong>Advantages:</strong> Unique creative styles, active community, constant updates</li>
                                <li><strong>Best for:</strong> Art creation, concept art, illustration design</li>
                            </ul>
                        </div>`,
                selectionHTML: `
                        <h3>🎯 Model Selection Guide</h3>
                        <table class="comparison-table">
                            <thead>
                                <tr>
                                    <th>Needs</th>
                                    <th>Recommended Model</th>
                                    <th>Reason</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Commercial Photography</td>
                                    <td>FLUX.1 [pro]</td>
                                    <td>Accurate colors, rich details</td>
                                </tr>
                                <tr>
                                    <td>Rapid Prototyping</td>
                                    <td>FLUX.1 [dev]</td>
                                    <td>Fast and stable</td>
                                </tr>
                                <tr>
                                    <td>Art Creation</td>
                                    <td>Midjourney</td>
                                    <td>Unique style, highly creative</td>
                                </tr>
                                <tr>
                                    <td>Customization</td>
                                    <td>Stable Diffusion</td>
                                    <td>Open-source and highly extensible</td>
                                </tr>
                            </tbody>
                        </table>`
            },
            chapter3: {
                title: '✍️ 3. Prompt Engineering in Practice',
                basicTitle: 'Basic Structure of Prompts',
                basicHTML: `
                        <div class="structure-element">
                            <h4>1. Subject</h4>
                            <p>Clearly describe the core subject or object</p>
                            <div class="example">
                                <strong>Example:</strong> "A young Asian woman", "Modern skyscraper", "Ancient forest"
                            </div>
                        </div>
                        <div class="structure-element">
                            <h4>2. Action/State</h4>
                            <p>Describe what the subject is doing or its state</p>
                            <div class="example">
                                <strong>Example:</strong> "Smiling", "Standing still", "Dancing in the sunlight"
                            </div>
                        </div>
                        <div class="structure-element">
                            <h4>3. Environment</h4>
                            <p>Set the time, place and environmental conditions</p>
                            <div class="example">
                                <strong>Example:</strong> "In a cherry blossom park", "City skyline background", "Seaside at sunset"
                            </div>
                        </div>
                        <div class="structure-element">
                            <h4>4. Style</h4>
                            <p>Specify artistic style and visual effects</p>
                            <div class="example">
                                <strong>Example:</strong> "Professional portrait photography", "Watercolor", "Cyberpunk aesthetics"
                            </div>
                        </div>
                        <div class="structure-element">
                            <h4>5. Technical</h4>
                            <p>Specify quality, composition and technical requirements</p>
                            <div class="example">
                                <strong>Example:</strong> "8K", "Depth of field", "Cinematic lighting"
                            </div>
                        </div>`,
                advancedTitle: 'Advanced Prompt Techniques',
                advancedHTML: `
                        <h4>🎨 Weight Control</h4>
                        <ul>
                            <li><strong>Emphasize important elements:</strong> (important:1.2)</li>
                            <li><strong>De-emphasize secondary elements:</strong> [secondary:0.8]</li>
                            <li><strong>Exclude unwanted:</strong> Use negative prompts</li>
                        </ul>
                        <h4>🎯 Composition Control</h4>
                        <ul>
                            <li><strong>Perspective:</strong> Low-angle, bird-eye, first-person</li>
                            <li><strong>Depth of Field:</strong> Shallow DOF, bokeh, pan-focus</li>
                            <li><strong>Rules:</strong> Rule of thirds, centered, symmetry</li>
                        </ul>
                        <h4>💡 Lighting Control</h4>
                        <ul>
                            <li><strong>Light Source:</strong> Natural, artificial, neon</li>
                            <li><strong>Direction:</strong> Side light, backlight, top light</li>
                            <li><strong>Quality:</strong> Soft, dramatic, even</li>
                        </ul>`,
                examplesHTML: `
                        <h3>🌟 High-quality Prompt Examples</h3>
                        <div class="example-category">
                            <h4>Portrait Photography</h4>
                            <div class="prompt-example">
                                <div class="prompt-text">"Professional business portrait of a confident woman ... 8K, studio lighting"</div>
                                <div class="prompt-analysis"><strong>Analysis:</strong> Covers subject, clothing, environment, technical parameters and style</div>
                            </div>
                        </div>`
            },
            chapter4: {
                title: '🏆 4. High-Quality Image Generation Strategies',
                paramsTitle: 'Parameter Optimization',
                paramsHTML: `
                        <div class="parameter-section">
                            <h4>Resolution</h4>
                            <ul>
                                <li><strong>1024x1024:</strong> Standard high quality for most uses</li>
                                <li><strong>1536x1024:</strong> Wide aspect, great for banners</li>
                                <li><strong>1024x1536:</strong> Portrait aspect, great for posters</li>
                                <li><strong>2048x2048:</strong> Ultra-high for print</li>
                            </ul>
                        </div>
                        <div class="parameter-section">
                            <h4>Steps & Samplers</h4>
                            <ul>
                                <li><strong>Recommended steps:</strong> 20–50</li>
                                <li><strong>DPM++:</strong> Quality first</li>
                                <li><strong>Euler:</strong> Faster iterations</li>
                                <li><strong>DDIM:</strong> Stable for batches</li>
                            </ul>
                        </div>
                        <div class="parameter-section">
                            <h4>CFG Scale</h4>
                            <ul>
                                <li><strong>7–12:</strong> Balanced</li>
                                <li><strong>4–6:</strong> More creative, artsy</li>
                                <li><strong>13–20:</strong> Strict prompt following</li>
                            </ul>
                        </div>`,
                qualityTitle: 'Quality Improvement Tips',
                qualityHTML: `
                        <div class="tip-category">
                            <h4>🎯 Prompt Optimization</h4>
                            <ul>
                                <li><strong>Be specific:</strong> Replace vague words with concrete details</li>
                                <li><strong>Style keywords:</strong> Add "high quality", "cinematic", etc.</li>
                                <li><strong>Reference masters:</strong> Mention famous photographers/artists</li>
                                <li><strong>Technical terms:</strong> Use professional photography terms</li>
                            </ul>
                        </div>
                        <div class="tip-category">
                            <h4>🚫 Negative Prompt Strategy</h4>
                            <ul>
                                <li><strong>Quality exclusion:</strong> low quality, blurry, pixelated, deformed</li>
                                <li><strong>Composition exclusion:</strong> cropped, cutoff, incomplete</li>
                                <li><strong>Style exclusion:</strong> cartoon, anime, doodle (if photorealism needed)</li>
                                <li><strong>Element exclusion:</strong> watermark, text, signature, border</li>
                            </ul>
                        </div>`,
                postTitle: 'Post-processing Optimization',
                postHTML: `
                        <h4>🔧 AI Tools</h4>
                        <ul>
                            <li><strong>Upscale:</strong> Real-ESRGAN for higher resolution</li>
                            <li><strong>Face restore:</strong> GFPGAN for facial details</li>
                            <li><strong>Detail enhancement:</strong> Img2Img for local edits</li>
                            <li><strong>Color correction:</strong> ControlNet for color/light control</li>
                        </ul>
                        <h4>📸 Traditional Editing</h4>
                        <ul>
                            <li><strong>Color balance:</strong> Adjust temperature and hue</li>
                            <li><strong>Sharpening:</strong> Moderate sharpening for clarity</li>
                            <li><strong>Denoise:</strong> Reduce noise for cleaner images</li>
                            <li><strong>Composition:</strong> Crop and follow visual rules</li>
                        </ul>`
            },
            chapter5: {
                title: '🔧 5. Common Issues and Solutions',
                html: `
                        <div class="problem-solution">
                            <h4>❌ Issue: Blurry images</h4>
                            <div class="solutions">
                                <h5>💡 Solutions:</h5>
                                <ul>
                                    <li>Increase resolution to 1024x1024 or higher</li>
                                    <li>Add "high quality", "sharp", "rich details"</li>
                                    <li>Adjust CFG Scale to 7–12</li>
                                    <li>Increase steps to 25–40</li>
                                    <li>Add negatives like "blurry, low quality, pixelated"</li>
                                </ul>
                            </div>
                        </div>`
            },
            chapter6: {
                title: '🚀 6. Advanced Creation Techniques & Workflows',
                workflowTitle: 'Professional Workflow',
                html: `
                        <div class="workflow-step">
                            <h4>Step 1: Concept</h4>
                            <ul>
                                <li>Define goals and usage</li>
                                <li>Collect references</li>
                                <li>Choose style and technical requirements</li>
                                <li>Draft visual plan</li>
                            </ul>
                        </div>`,
                advancedTitle: 'Advanced Techniques',
                advancedHTML: `
                        <div class="technique">
                            <h4>🎨 Style Fusion</h4>
                            <p>Combine multiple artistic styles to create unique visuals:</p>
                            <ul>
                                <li><strong>Classic Blend:</strong> "Oil painting style for modern cityscapes"</li>
                                <li><strong>Cross-era Fusion:</strong> "Baroque style sci-fi scene"</li>
                                <li><strong>Mixed Media:</strong> "Watercolor techniques in photography"</li>
                            </ul>
                        </div>
                        <div class="technique">
                            <h4>🔄 Iterative Optimization</h4>
                            <p>Systematic iteration to reach ideal results:</p>
                            <ol>
                                <li>Start from a base version and record each change</li>
                                <li>Change one variable at a time</li>
                                <li>Save intermediate versions</li>
                                <li>Review and summarize winning patterns</li>
                            </ol>
                        </div>
                        <div class="technique">
                            <h4>📐 Composition Control</h4>
                            <p>Precisely control composition and visual guidance:</p>
                            <ul>
                                <li><strong>Golden Ratio:</strong> Focal point at intersections</li>
                                <li><strong>Leading Lines:</strong> S-curves and paths</li>
                                <li><strong>Symmetry:</strong> Perfect symmetry and mirror frames</li>
                                <li><strong>Depth Layers:</strong> Foreground, midground, background</li>
                            </ul>
                        </div>`,
                businessTitle: 'Business Use Cases',
                businessHTML: `
                        <div class="application">
                            <h4>🏢 Branding Design</h4>
                            <ul>
                                <li>Logo concepts and variants</li>
                                <li>Visual identity system</li>
                                <li>Packaging exploration</li>
                                <li>Corporate posters</li>
                            </ul>
                        </div>
                        <div class="application">
                            <h4>📱 Social Media</h4>
                            <ul>
                                <li>Instagram/Weibo visuals</li>
                                <li>Short video thumbnails</li>
                                <li>Holiday themes</li>
                                <li>Profile avatars and covers</li>
                            </ul>
                        </div>
                        <div class="application">
                            <h4>🎯 Ad Creatives</h4>
                            <ul>
                                <li>Product showcase</li>
                                <li>Scenario-based marketing assets</li>
                                <li>Concept exploration</li>
                                <li>A/B testing materials</li>
                            </ul>
                        </div>
                        <div class="application">
                            <h4>🎮 Entertainment</h4>
                            <ul>
                                <li>Game character prototypes</li>
                                <li>Novel illustrations</li>
                                <li>Concept art</li>
                                <li>Virtual scene building</li>
                            </ul>
                        </div>`,
                trendsTitle: '🔮 Future Trends',
                trendsHTML: `
                        <div class="trend-item">
                            <h4>Real-time Generation</h4>
                            <p>Millisecond-level responses, real-time editing and preview.</p>
                        </div>
                        <div class="trend-item">
                            <h4>Multimodal Fusion</h4>
                            <p>Text, voice and gesture inputs work together for natural UX.</p>
                        </div>
                        <div class="trend-item">
                            <h4>Personalization</h4>
                            <p>AI learns user preferences and offers tailored suggestions.</p>
                        </div>
                        <div class="trend-item">
                            <h4>Copyright & Ethics</h4>
                            <p>Governance on rights, attribution and responsible AI.</p>
                        </div>`
            }
        },
        relatedHTML: `
            <h2 style="color: #333; margin-bottom: 25px; text-align: center;">📚 Recommended Reading</h2>
            <div class="related-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
                <div class="related-card" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid #e9ecef;">
                    <h3 style="font-size: 18px; margin: 0 0 12px 0; color: #007bff;">
                        <a href="prompt-engineering.html" style="text-decoration: none; color: inherit;">🎯 Prompt Engineering Tutorial</a>
                    </h3>
                    <p style="margin: 0 0 15px 0; font-size: 14px; color: #666; line-height: 1.5;">Master weights, style fusion and negative prompts</p>
                    <a href="prompt-engineering.html" style="font-size: 13px; color: #007bff; text-decoration: none; font-weight: 500;">Read Full Tutorial →</a>
                </div>
                <div class="related-card" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid #e9ecef;">
                    <h3 style="font-size: 18px; margin: 0 0 12px 0; color: #007bff;">
                        <a href="tutorial.html" style="text-decoration: none; color: inherit;">📖 AISTONE Tutorial</a>
                    </h3>
                    <p style="margin: 0 0 15px 0; font-size: 14px; color: #666; line-height: 1.5;">From beginner to advanced, learn all platform features</p>
                    <a href="tutorial.html" style="font-size: 13px; color: #007bff; text-decoration: none; font-weight: 500;">Start Learning →</a>
                </div>
                <div class="related-card" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid #e9ecef;">
                    <h3 style="font-size: 18px; margin: 0 0 12px 0; color: #007bff;">
                        <a href="/" style="text-decoration: none; color: inherit;">🚀 Start Creating</a>
                    </h3>
                    <p style="margin: 0 0 15px 0; font-size: 14px; color: #666; line-height: 1.5;">Put theory into practice with your first AI artwork</p>
                    <a href="/" style="font-size: 13px; color: #007bff; text-decoration: none; font-weight: 500;">Create Now →</a>
                </div>
                <div class="related-card" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid #e9ecef;">
                    <h3 style="font-size: 18px; margin: 0 0 12px 0; color: #007bff;">
                        <a href="faq.html" style="text-decoration: none; color: inherit;">❓ FAQ</a>
                    </h3>
                    <p style="margin: 0 0 15px 0; font-size: 14px; color: #666; line-height: 1.5;">Find answers to common issues and solutions</p>
                    <a href="faq.html" style="font-size: 13px; color: #007bff; text-decoration: none; font-weight: 500;">Find Answers →</a>
                </div>
            </div>`

        // Prompt Engineering Page（英文）
        promptEngineeringTitle: 'Prompt Engineering Tutorial',
        promptEngineeringMainTitle: 'Professional Prompt Engineering Tutorial',
        promptEngineeringSubtitle: 'Master the core skills of AI image generation - from basic syntax to advanced strategies',
        // Prompt overview (English)
        promptOverviewTitle: '🎯 Course Overview',
        promptBasicSyntaxTitle: '🚀 Basic Syntax',
        promptBasicSyntaxDesc: 'Master the basic structure and organization of prompts',
        promptWeightControlTitle: '⚡ Weight Control',
        promptWeightControlDesc: 'Learn to precisely control the importance of each element',
        promptNegativeTitle: '🚫 Negative Prompts',
        promptNegativeDesc: 'Exclude unwanted elements to improve generation quality',
        promptStyleTitle: '🎨 Style Fusion',
        promptStyleDesc: 'Create unique artistic styles and visual effects',
        promptEngineeringAuthor: 'AISTONE Expert Team',
        promptEngineeringDate: 'September 9, 2025',
        promptEngineeringReadingTime: 'About 12 minutes read',

        // About Page
        aboutHeroTitle: 'AISTONE - Redefining Content Creation',
        aboutHeroSubtitle: 'Professional content creation platform based on the latest AI technology, providing efficient and intelligent image generation and speech synthesis solutions for creators and enterprises',
        
        // Services page related content recommendations
        relatedContentTitle: '🚀 Try Now',
        relatedImageGen: '🎨 AI Image Generation',
        tryNow: 'Try Now →',
        relatedAIGuide: '🧠 AI Guide',
        relatedAIGuideDesc: 'Learn AI voice tech principles and practices',
        learnMore: 'Learn More →',
        relatedTutorial: '📖 Tutorial',
        startLearning: 'Start Learning →',
        relatedImageGenTitle: '🎨 AI Image Generation',
        relatedImageGenDesc: 'Experience our core service, transform ideas into stunning visuals',
        relatedVoiceGenTitle: '🎵 AI Voice Synthesis',
        relatedVoiceGenDesc: 'Convert text to natural speech, completely free to use',
        relatedTutorialTitle: '📖 Quick Start',
        relatedTutorialDesc: 'Learn how to use all features for the best experience',
        relatedAboutTitle: 'ℹ️ Learn Technology',
        relatedAboutDesc: 'Discover our AI technology and platform vision in depth',
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
function initI18n() {
    console.log('[i18n] initializing i18n...');
    // 初始化语言选择器
    const langSelect = document.getElementById('lang-select');
    const currentLang = getCurrentLang();
    if (langSelect) {
        langSelect.value = currentLang === 'zh' ? 'zh' : 'en';
        langSelect.addEventListener('change', (e) => {
            console.log('[i18n] lang-select changed:', e.target.value);
            setLanguage(e.target.value);
        });
    }
    // 使用setLanguage确保所有data-i18n元素正确处理
    setLanguage(currentLang);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initI18n);
} else {
    // 文档已就绪，立即初始化
    initI18n();
}

// 将函数设为全局变量
window.getCurrentLang = getCurrentLang;
window.setLanguage = setLanguage;
window.t = t;
window.i18n = i18n;
window.updatePageText = updatePageText; 