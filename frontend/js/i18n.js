// ============================================
// 📋 i18n.js - 多语言翻译配置文件
// ============================================
//
// 📖 文件说明：
//   - 支持语言：中文(zh) 和 英文(en)
//   - 运行环境：无打包直接引入（no-bundler），通过 window 全局使用
//   - 总行数：~3855行
//   - 翻译键：~1400+个英文键，~1200+个中文键
//
// ============================================
// 📍 快速导航索引
// ============================================
//
// 🔧 工具函数与初始化 (第1-30行)
//   └─ DEBUG日志抑制、normalizeLang()
//
// 🌍 英文翻译 (en) - 第32-1920行
//   ├─ 🏠 首页与通用 (第33-140行)
//   │   ├─ 标题描述 (第33-36行)
//   │   ├─ 输入区域 (第37-47行)
//   │   ├─ 生成类型 (第48-53行)
//   │   ├─ 快捷操作 (第93-97行)
//   │   ├─ 状态消息 (第98-122行)
//   │   └─ 欢迎区域 (第127-140行)
//   │
//   ├─ 🎨 图片生成 (第54-80行)
//   │   ├─ AI模型选择
//   │   ├─ 尺寸比例
//   │   └─ 图片数量
//   │
//   ├─ 🎵 语音生成 (第81-92行)
//   │   ├─ 音频选项
//   │   └─ 声音选择
//   │
//   ├─ 📝 博客页面 (第264-489行)
//   │   ├─ AI指南 (第264-371行)
//   │   ├─ 提示词工程 (第372-433行)
//   │   └─ 教程博客 (第434-489行)
//   │
//   ├─ 📄 关于页面 (第497-805行)
//   │   ├─ 关于AISTONE (第666-679行)
//   │   └─ 技术架构 (第805-846行)
//   │
//   ├─ ❓ FAQ页面 (第680-730行)
//   │
//   ├─ 🔐 认证登录 (第922-969行)
//   │   ├─ 登录注册
//   │   ├─ Google登录
//   │   └─ 密码找回
//   │
//   ├─ 👤 用户中心 (第1269-1276行)
//   │
//   ├─ 💬 反馈系统 (第1277-1316行)
//   │
//   ├─ 🖼️ HD图片管理 (第1250-1268行)
//   │
//   ├─ 📋 提示词模板 (第1303-1316行)
//   │
//   ├─ 🔗 导航与Footer (第1090-1104行, 第1328-1472行)
//   │
//   ├─ 📜 服务条款 (第1487-1608行)
//   │
//   └─ 🔒 隐私政策 (第1609-1718行)
//
// 🇨🇳 中文翻译 (zh) - 第1922-3381行
//   └─ (结构与英文对应，键名相同)
//
// ⚙️ 核心函数 (第3387-3855行)
//   ├─ getCurrentLang() - 获取当前语言 (第3387行)
//   ├─ updateLanguageButtons() - 更新语言按钮 (第3396行)
//   ├─ getNestedI18nValue() - 递归读取翻译值 (第3405行)
//   ├─ setLanguage() - 设置语言 (第3436行)
//   ├─ t() - 翻译函数 (第3639行)
//   ├─ updatePageText() - 更新页面文本 (第3658行)
//   └─ initI18n() - 初始化i18n (第3811行)
//
// ============================================
// 💡 使用提示
// ============================================
//
// 1. 查找翻译键：使用 Ctrl+F 搜索键名
// 2. 添加新翻译：在对应section添加，保持en和zh同步
// 3. 修改翻译：同时修改en和zh对应的键
// 4. 测试翻译：调用 t('keyName') 或使用 data-i18n="keyName"
//
// ============================================

// DEBUG 日志抑制（默认关闭），与 app.js 逻辑一致，尽早执行
(function () {
  try {
    var qs = new URLSearchParams(location.search || "");
    var debugFlag =
      window.DEBUG === true ||
      qs.get("debug") === "1" ||
      (typeof localStorage !== "undefined" &&
        (localStorage.getItem("DEBUG") === "1" || localStorage.getItem("debug") === "1"));
    if (!debugFlag) {
      var noop = function () {};
      console.debug = noop;
      console.info = noop;
      console.log = noop;
    }
  } catch (_) {}
})();

// 确保在多语言渲染完成前屏蔽页面闪烁
(function () {
  try {
    const docEl = document.documentElement;
    if (docEl && !docEl.classList.contains("lang-loading")) {
      docEl.classList.add("lang-loading");
    }
  } catch (_) {}
})();

let languageReadyMarked = false;
function markLanguageReady() {
  if (languageReadyMarked) {
    return;
  }
  languageReadyMarked = true;
  try {
    const docEl = document.documentElement;
    if (docEl) {
      docEl.classList.remove("lang-loading");
      docEl.classList.add("lang-ready");
    }
  } catch (error) {
    console.warn("[i18n] 无法移除语言加载遮罩:", error);
  }
}

/**
 * 语言规范化函数
 */
function normalizeLang(lang) {
  if (!lang) return "en";
  const lower = String(lang).toLowerCase();
  if (lower.startsWith("zh")) return "zh";
  return "en";
}

const i18n = {
  // ============================================
  // 🌍 英文翻译 (English Translations)
  // ============================================
  en: {
    // ========== 🏠 首页与通用 (Homepage & Common) ==========
    
    // Title and description (English defaults now in HTML)
    title: "AISTONE",
    subtitle: "Images · Voice · Unlimited Free Generation",

    // Input area
    inputTitle: "Description Text",
    examplesTitle: "💡 Click examples to quickly fill:",
    inputPlaceholder: "Please enter description text, e.g.: A cute cat playing on the grass...",
    generateButton: "Start Generation",
    quickFillLabel: "Quick fill examples:",
    smartOptimizeTip:
      "✨ Smart optimization: Automatically translate and optimize descriptions into high-quality English prompts to improve image generation",
    negativePromptLabel: "Negative prompt:",
    negativePromptPlaceholder: "Enter unwanted elements, separated by commas",

    // Generation type
    generationType: "Generation Type",
    typeImage: "Generate Image",
    typeAudio: "Generate Voice",
    generationResult: "Generation Result",

    // ========== 🎨 图片生成 (Image Generation) ==========

    // Image options
    imageOptions: "Image Options",
    aiModel: "AI Model",
    aiModelFlux: "FLUX Schnell - Free High Quality",
    aiModelZimage: "Z-Image Turbo - Fast 2x Upscale",
    aiModelTurbo: "SDXL Turbo - Single-step Fast",
    aiModelKontext: "FLUX Kontext - Image Editing",
    aiModelKlein: "FLUX.2 Klein 4B - Fast Editing",
    aiModelKleinLarge: "FLUX.2 Klein 9B - High Quality Editing",
    aiModelGptimage: "GPT Image Mini - OpenAI Image",
    aiModelGptimageLarge: "GPT Image 1.5 - Advanced Image",
    aiModelNanobanana: "NanoBanana - Gemini Image",
    aiModelNanobananaPro: "NanoBanana Pro - 4K Thinking",
    aiModelSeedream: "Seedream 4.0 - ByteDance",
    aiModelSeedreamPro: "Seedream 4.5 Pro - 4K Multi-Image",
    modelGroupFree: "⚡ Fast & Free",
    modelGroupFlux: "🎨 FLUX Series",
    modelGroupGPT: "🤖 GPT Image",
    modelGroupPremium: "✨ Premium",
    modelHint: "💡 FLUX is free unlimited, other models consume Pollen credits",
    aspectRatio: "Aspect Ratio",
    aspectRatioSquare: "Square (1:1 - 1024x1024)",
    aspectRatioLandscape: "Landscape (16:9 - 1280x720)",
    aspectRatioPortrait: "Portrait (9:16 - 720x1280)",
    aspectRatioStandard: "Standard (4:3 - 1024x768)",
    aspectRatioStandardVertical: "Standard Vertical (3:4 - 768x1024)",
    aspectRatioCustom: "Custom",
    width: "Width",
    height: "Height",
    noLogo: "Remove Watermark",
    numImages: "Number of Images",
    oneImage: "1 Image",
    twoImages: "2 Images",
    fourImages: "4 Images",
    aspectRatioLandscape2K: "Landscape 2K (16:9 - 2560x1440)",
    aspectRatioPortrait2K: "Portrait 2K (9:16 - 1440x2560)",
    aspectRatioLandscape4K: "Landscape 4K (16:9 - 3840x2160)",
    aspectRatioPortrait4K: "Portrait 4K (9:16 - 2160x3840)",

    // ========== 🎵 语音生成 (Voice Generation) ==========

    // Audio options
    audioOptions: "Audio Options",
    voiceSelection: "Voice Selection",
    voiceNova: "Nova (Female-Clear)",
    voiceEcho: "Echo (Male-Deep)",
    voiceFable: "Fable (Male-Young)",
    voiceOnyx: "Onyx (Male-Magnetic)",
    voiceShimmer: "Shimmer (Female-Sweet)",
    voiceAlloy: "Alloy (Neutral-Gentle)",
    voiceCoral: "Coral (Female-Warm)",
    voiceVerse: "Verse (Neutral-Elegant)",
    voiceBallad: "Ballad (Neutral-Lyrical)",
    voiceAsh: "Ash (Neutral-Calm)",
    voiceSage: "Sage (Neutral-Wise)",
    audioModel: "Audio Model",
    audioModelOpenai: "OpenAI Audio - Latest voice synthesis",

    // Quick actions
    clearButton: "Clear",
    optimizeButton: "Optimize",
    randomButton: "Random",

    // Status messages
    loading: "Processing, please wait...",
    imageGenerating: "Generating image, please wait...",
    audioGenerating: "Generating voice, please wait...",
    error: "An error occurred",
    pleaseInput: "Please enter description text before generating.",
    optimizationSuccess: "✨ Prompt optimization completed!",
    optimizationFailed: "Optimization failed, please try again later",
    pleaseInputFirst: "Please enter text content first",
    generationComplete: "Generation complete!",
    generating: "Generating...",
    imageGeneratedDone: "🎉 Image generation completed!",
    audioGeneratedDone: "🎉 Audio generation completed!",
    preparingContent: "Preparing content...",
    generatingContent: "Generating content, please wait...",
    generatedAudio: "Generated Audio:",
    downloadAudioFile: "Download Audio File",
    audioUnsupported: "Your browser does not support audio playback.",
    noValidImageData: "No valid image data received.",
    noImagesLoaded: "Failed to load any images.",
    imageLoadFailedRetry: "Image failed to load, please retry",
    invalidAudioUrl: "Invalid audio URL received.",
    downloadAll: "Download All",
    gridView: "Grid View",

    // Example hints
    imageHint: "💡 Image generation supports multiple sizes and quantities",
    audioHint: "🎵 Voice generation supports play and download functions",

    // Welcome to AISTONE section
    welcomeToAistone: "Welcome to AISTONE",
    aistoneIntro:
      "AISTONE is your premier destination for AI-powered image generation and voice synthesis. As a leading AI content creation platform, AISTONE combines cutting-edge technology with user-friendly design to deliver exceptional results.",
    aistoneImageGenerator: "AISTONE AI Image Generator",
    aistoneImageDesc:
      "Experience the power of AISTONE's advanced AI models including Kontext, FLUX, and Turbo for stunning visual creation.",
    aistoneVoiceSynthesis: "AISTONE Voice Synthesis",
    aistoneVoiceDesc:
      "Transform text into natural speech with AISTONE's state-of-the-art voice synthesis technology.",
    aistoneFreePlatform: "AISTONE Free Platform",
    aistoneFreeDesc:
      "Enjoy AISTONE's complete feature set completely free - no registration, no limits, no hidden costs.",

    // Homepage use case & workflow sections
    // Homepage case study & workflow (default text already updated in HTML)
    homeUseCaseTitle: "Case Study: From Prompt to Delivered Asset",
    homeUseCaseIntro:
      "This walkthrough shows how a marketing team finished a launch visual in five minutes with AISTONE. We include the exact prompt, parameters, and iteration notes so you can replicate the quality.",
    homeUseCasePromptTitle: "Core Prompt",
    homeUseCasePromptDesc:
      "We emphasise lighting, lens choice, and atmosphere to highlight the product texture. Add a Chinese prefix when collaborating in a bilingual workflow.",
    homeUseCasePromptModel: "Model: FLUX high-quality mode",
    homeUseCasePromptSize: "Resolution: 1024 × 1365 (portrait poster)",
    homeUseCasePromptCount: "Variations: 2 images for side-by-side review",
    homeUseCasePromptNegative: "Negative prompt: blurry, low contrast, watermark, extra hands",
    homeUseCaseOutcomeTitle: "Outcome Overview",
    homeUseCaseOutcomeDesc1:
      "Image #1 hit the brief but lighting was slightly blown out. Image #2 had better depth, so we upscaled it to 2048 × 2730 for the final export.",
    homeUseCaseOutcomeDesc2:
      "The final asset went live on the homepage banner and delivered a 23% lift in social ad CTR. No photoshoot or retouching was required.",
    homeUseCaseReuseTitle: "Reuse Tips",
    homeUseCaseReuse1:
      "Swap the product nouns and materials to adapt the prompt to new categories.",
    homeUseCaseReuse2:
      "Switch the aspect ratio to 16:9 for video covers while keeping the same lighting cues.",
    homeUseCaseReuse3:
      "Pair it with the voice module to script a 30-second narration for a complete asset kit.",
    homeWorkflowTitle: "Workflow to Produce Assets Consistently",
    homeWorkflowIntro:
      "Based on our internal best practices, these four steps help teams ship reliable AI visuals while reducing guesswork and revision cycles.",
    homeWorkflowStep1Label: "Step 1",
    homeWorkflowStep1Title: "Clarify requirements",
    homeWorkflowStep1Desc:
      "Log the target channel, aspect ratio, brand keywords, and references. Store them in the prompt notes so teammates stay aligned.",
    homeWorkflowStep2Label: "Step 2",
    homeWorkflowStep2Title: "Pick model and parameters",
    homeWorkflowStep2Desc:
      "Choose FLUX for polish, Turbo for speed, or Kontext for image-to-image. Set ratio, variation count, and negative prompts to match the channel.",
    homeWorkflowStep3Label: "Step 3",
    homeWorkflowStep3Title: "Iterate prompts",
    homeWorkflowStep3Desc:
      "Generate a draft, inspect composition and lighting, then tweak keywords. Compare prompt history to lock in the strongest version.",
    homeWorkflowStep4Label: "Step 4",
    homeWorkflowStep4Title: "Export and add voice",
    homeWorkflowStep4Desc:
      "Upscale the winning frame and export PNG or JPG. Switch to the voice page to create narration with the same script.",
    homeQuickFaqTitle: "Quick FAQ",
    homeQuickFaqIntro:
      "Here are the three questions advertisers ask most often. Visit the full FAQ for extended guidance.",
    homeQuickFaqQ1: "Is AISTONE completely free?",
    homeQuickFaqA1:
      "Core features, including HD export and voice synthesis, are free for all visitors. Enterprise deployments, brand customisation, and high-volume API usage are billed separately.",
    homeQuickFaqQ2: "Can I use generated assets commercially?",
    homeQuickFaqA2:
      "Yes. You own the assets for campaigns and ads. Please follow platform disclosure rules for AI-generated media.",
    homeQuickFaqQ3: "How do I improve prompt accuracy?",
    homeQuickFaqA3:
      "Combine subject, lighting, lens, and style keywords while using negative prompts to remove unwanted elements. The case study above breaks each part down.",

    navUserPlaceholder: "User",
    
    // ========== 📄 About Page (Customer-Facing) ==========
    aboutPageTitle: "About AISTONE",
    aboutPageSubtitle: "Making AI Creation Accessible to Everyone, Empowering Creative Expression",
    aboutMissionTitle: "Our Mission",
    aboutMissionDesc: "AISTONE is dedicated to making AI technology accessible to everyone for creation. We believe creativity should not be limited by technical barriers, and everyone should have the ability to turn ideas into reality.",
    aboutCoreValuesTitle: "Core Values",
    aboutValueCreativityTitle: "Unlimited Creativity",
    aboutValueCreativityDesc: "Support multiple AI models and styles to present your creative ideas in the best way",
    aboutValueFreeTitle: "Forever Free",
    aboutValueFreeDesc: "All core features are completely free, no registration required, no usage limits, making AI creation truly accessible to all",
    aboutValuePrivacyTitle: "Privacy & Security",
    aboutValuePrivacyDesc: "Your content is not stored, all processing is done in real-time in the cloud, protecting your privacy",
    aboutValueSpeedTitle: "Fast & Efficient",
    aboutValueSpeedDesc: "Based on global CDN deployment, millisecond-level response, keeping your creative inspiration uninterrupted",
    aboutFeaturesTitle: "Product Features",
    aboutFeatureImageTitle: "🎨 AI Image Generation",
    aboutFeatureImagePoint1: "✓ Support FLUX, Turbo and other AI models",
    aboutFeatureImagePoint2: "✓ Multiple size and aspect ratio options",
    aboutFeatureImagePoint3: "✓ Smart prompt optimization",
    aboutFeatureImagePoint4: "✓ High-definition image output",
    aboutFeatureVoiceTitle: "🎵 AI Voice Synthesis",
    aboutFeatureVoicePoint1: "✓ 6 professional-grade voice options",
    aboutFeatureVoicePoint2: "✓ Natural and fluent voice effects",
    aboutFeatureVoicePoint3: "✓ Support long text synthesis",
    aboutFeatureVoicePoint4: "✓ One-click audio file download",
    aboutWhyChooseTitle: "Why Choose AISTONE",
    aboutWhyPoint1Title: "User First",
    aboutWhyPoint1Desc: "Simple and easy-to-use interface, no professional knowledge required",
    aboutWhyPoint2Title: "Continuous Innovation",
    aboutWhyPoint2Desc: "Constantly introducing the latest AI technology, staying industry-leading",
    aboutWhyPoint3Title: "Dedicated Service",
    aboutWhyPoint3Desc: "Quick response to user feedback, continuous product experience optimization",
    aboutTeamTitle: "About the Team",
    aboutTeamDesc: "AISTONE is created by a passionate technical team. We come from different backgrounds but share a common vision of making AI technology accessible to all. We believe technology should serve people and let everyone enjoy the convenience brought by AI.",
    aboutContactUsTitle: "Contact Us",
    aboutContactDesc: "If you have any questions, suggestions, or cooperation intentions, please feel free to contact us. We value every user's feedback and will reply within 1 business day.",
    aboutContactEmailTitle: "Email",
    aboutContactFeedbackTitle: "Online Feedback",
    aboutContactFeedbackLink: "Submit Feedback",
    aboutContactSocialTitle: "Social Media",
    
    // Legacy About Keys (kept for compatibility)
    aboutHeroTitleNew: "Inside AISTONE",
    aboutHeroIntroNew:
      "We are a small remote team building a free, no-signup AI workspace on Cloudflare Workers with public release notes for every iteration.",
    aboutHeroApiPrefix: "API base:",
    aboutHeroApiSuffix: "(Cloudflare Workers)",
    aboutHeroRepoPrefix: "Source code & changelog:",
    aboutHeroReportPrefix: "Quarterly progress notes:",
    aboutGuidingTitle: "Guiding Principles",
    aboutGuidingOpenTitle: "Open playbook",
    aboutGuidingOpenDesc:
      "Every deployment step, monitoring script, and roadmap milestone lives in the docs/ directory for full auditability.",
    aboutGuidingDataTitle: "Data minimalism",
    aboutGuidingDataDesc:
      "Prompts run in-memory and cached assets only persist when a signed-in user explicitly saves them.",
    aboutGuidingTransparencyTitle: "Public accountability",
    aboutGuidingTransparencyDesc:
      "Feature launches, incidents, and roadmap changes are summarised in the Development Progress log.",
    aboutAssemblyTitle: "How the platform is assembled",
    aboutImagePipelineTitle: "Image pipeline",
    aboutImagePipelinePoint1:
      "Prompt validation and routing on Cloudflare Workers with rate limiting.",
    aboutImagePipelinePoint2: "Generation powered by Pollinations FLUX, Turbo, and Kontext models.",
    aboutImagePipelinePoint3:
      "Optional upscaling stored temporarily in Cloudflare R2 before download.",
    aboutVoicePipelineTitle: "Voice pipeline",
    aboutVoicePipelinePoint1:
      "Client-side text normalisation before streaming to OpenAI Audio TTS.",
    aboutVoicePipelinePoint2: "Audio buffers delivered as WAV with no server-side storage.",
    aboutVoicePipelinePoint3: "Policies mirror OpenAI content rules and block unsafe prompts.",
    aboutOpsTitle: "Operations snapshot",
    aboutOpsHostingTitle: "Hosting",
    aboutOpsHostingDesc:
      "Static frontend on Cloudflare Pages, Workers regions in Hong Kong & Singapore.",
    aboutOpsMonitoringTitle: "Monitoring",
    aboutOpsMonitoringDesc:
      "Synthetic checks in docs/MONITORING_GUIDE.md hit both image and voice endpoints hourly.",
    aboutOpsSecurityTitle: "Security",
    aboutOpsSecurityDesc:
      "HTTPS everywhere, optional JWT login, AdSense and GA as the only trackers.",
    aboutDocsTitle: "Documentation we publish",
    aboutDocsStatusTitle: "Project Status Report",
    aboutDocsStatusDescPrefix:
      "Quarterly summary of traffic, feature adoption, and backlog focus lives in ",
    aboutDocsStatusDescSuffix: ".",
    aboutDocsProgressTitle: "Development Progress Log",
    aboutDocsProgressDescPrefix: "Week-by-week deployment notes and fixes live in ",
    aboutDocsProgressDescSuffix: ".",
    aboutDocsMonitoringTitle: "Monitoring Playbook",
    aboutDocsMonitoringDescPrefix:
      "Our incident response checklist and latency budgets are documented in ",
    aboutDocsMonitoringDescSuffix: ".",
    aboutTeamTitleNew: "Who runs the project",
    aboutTeamMaintainersTitle: "Core maintainers",
    aboutTeamMaintainersDesc:
      "AISTONE is maintained by a remote crew across Singapore and Shenzhen with weekly on-call rotations and public issue tracking.",
    aboutTeamFeedbackTitle: "Feedback policy",
    aboutTeamFeedbackDesc:
      "In-app and email feedback is triaged within one business day and logged once resolved in Development Progress.",
    aboutContactTitle: "Contact & verifications",
    aboutContactEmailTitle: "Email",
    aboutContactEmailDesc: "Average response time: under one business day.",
    aboutContactGithubTitle: "GitHub",
    aboutContactGithubDesc: "Roadmap and issue tracking live in the repository.",
    aboutContactTwitterTitle: "Twitter / X",
    aboutContactTwitterDesc: "Outage notices and release highlights are posted on the account.",

    // ========== 📝 博客页面 (Blog Pages) ==========

    // Blog AI guide (English)
    blogAiGuideTocTitle: "Table of contents",
    blogAiGuideToc1: "1. Translate a business brief into AI requirements",
    blogAiGuideToc2: "2. Build prompts that survive stakeholder feedback",
    blogAiGuideToc3: "3. Pick the right model, ratio, and output settings",
    blogAiGuideToc4: "4. Iterate with measurable checkpoints",
    blogAiGuideToc5: "5. Final polish and delivery checklist",
    blogAiGuideToc6: "6. Collaboration patterns for teams",
    blogAiGuideSection1Title: "1. Translate a business brief into AI requirements",
    blogAiGuideSection1Intro:
      "Most projects fail before the first prompt is written. Spend five minutes converting the marketing brief into structured notes: channel, goal, brand guardrails, and must-have narrative beats. The table below is the template our customer success team uses in every workshop.",
    blogAiGuideTableHeaderQuestion: "Question",
    blogAiGuideTableHeaderCapture: "What to capture",
    blogAiGuideTableHeaderExample: "Example response",
    blogAiGuideTableRowChannel: "Channel",
    blogAiGuideTableRowChannelCapture: "Aspect ratio, format, maximum file size.",
    blogAiGuideTableRowChannelExample: "Instagram vertical ad (1080×1350).",
    blogAiGuideTableRowStory: "Story",
    blogAiGuideTableRowStoryCapture: "Call to action, emotion, key product benefit.",
    blogAiGuideTableRowStoryExample:
      "Premium earbuds floating above glass pedestal, cool lighting.",
    blogAiGuideTableRowBrand: "Brand guardrails",
    blogAiGuideTableRowBrandCapture: "Palette, typography hints, references to existing campaigns.",
    blogAiGuideTableRowBrandExample: "Use neon blue, avoid warm tones, no serif fonts on props.",
    blogAiGuideTableRowMandatory: "Mandatories",
    blogAiGuideTableRowMandatoryCapture: "Objects, props, or legal copy that must appear.",
    blogAiGuideTableRowMandatoryExample: "Show charging case, leave space for claim text.",
    blogAiGuideSection1Outro:
      "Once you have the answers, save them in the AISTONE notes panel or a shared doc. The information flows directly into the prompt blueprint in the next section.",
    blogAiGuideSection2Title: "2. Build prompts that survive stakeholder feedback",
    blogAiGuideSection2Intro:
      "Prompt engineering is less about poetic adjectives and more about covering the decision-maker's concerns. We recommend a five-part structure that you can copy-paste into AISTONE and tweak per project.",
    blogAiGuidePromptFormula:
      "[Subject] + [Setting & mood] + [Composition & camera] + [Materials & detail] + [Lighting]",
    blogAiGuideSection2ExampleIntro: "For the smartwatch campaign example:",
    blogAiGuideSection2ExamplePrompt:
      '"Premium fitness smartwatch placed on mirrored podium, sunrise light streaming through minimalist studio, photographed on 50mm lens, focus on brushed aluminum texture, crisp product staging"',
    blogAiGuideSection2Negative:
      '为每组提示词准备负面词，避免常见瑕疵。可以从 <em>"blurry, watermark, distorted hands, text logo, grainy"</em> 这类泛用组合起步，再根据反馈扩充。',
    blogAiGuideSection2TipTitle: "Stakeholder alignment tip:",
    blogAiGuideSection2TipDesc:
      "Share the prompt blueprint in your approval workflow so marketing leads understand exactly what will be generated before the first render lands in their inbox.",
    blogAiGuideSection3Title: "3. Pick the right model, ratio, and output settings",
    blogAiGuideSection3Intro:
      "AISTONE bundles three image models plus OpenAI voices. The cheat sheet below covers when to use each option.",
    blogAiGuideModelTableHeaderModel: "Model",
    blogAiGuideModelTableHeaderWhen: "When to choose it",
    blogAiGuideModelTableHeaderSettings: "Default settings",
    blogAiGuideModelFlux: "FLUX",
    blogAiGuideModelFluxWhen:
      "Hero visuals, campaign art, anything that needs impeccable lighting and texture fidelity.",
    blogAiGuideModelFluxSettings:
      "Generate 2 variations, upscale winning frame to 2048px, aspect ratio from brief.",
    blogAiGuideModelTurbo: "Turbo",
    blogAiGuideModelTurboWhen:
      "Fast brainstorming sessions and social content where speed outranks perfection.",
    blogAiGuideModelTurboSettings:
      "Generate 4 variations, 768px preview, iterate quickly before switching to FLUX.",
    blogAiGuideModelKontext: "Kontext",
    blogAiGuideModelKontextWhen:
      "Image-to-image edits, product recolors, consistent multi-angle campaigns.",
    blogAiGuideModelKontextSettings:
      "Upload reference, lock composition, tweak color temperature +/- 5 for fine control.",
    blogAiGuideSection3Outro:
      "Always set aspect ratio and resolution according to the channel map from section one. AISTONE remembers your last used configuration per workspace, so teams can maintain consistency across sprints.",
    blogAiGuideSection4Title: "4. Iterate with measurable checkpoints",
    blogAiGuideSection4Intro:
      "Treat every generation cycle like a design review. Capture objective notes so you know which experiments moved the project forward.",
    blogAiGuideSection4Step1:
      "<strong>First pass — composition only.</strong> Ignore color issues and focus on layout, hierarchy, and room for copy.",
    blogAiGuideSection4Step2:
      "<strong>Second pass — lighting and materials.</strong> Adjust adjectives, camera specifications, and negative prompts until textures look realistic.",
    blogAiGuideSection4Step3:
      "<strong>Third pass — brand alignment.</strong> Use the color palette controls and upload references into Kontext if you need exact pantones.",
    blogAiGuideSection4Outro:
      "Document the winning prompt + seed in the project tracker. It becomes instant training data for new teammates and justifies creative decisions when the legal or branding team asks for provenance.",
    blogAiGuideSection5Title: "5. Final polish and delivery checklist",
    blogAiGuideSection5Intro:
      "Before you ship assets to clients or ad platforms, run through this quality gate. It prevents last-minute rework.",
    blogAiGuideSection5Item1:
      "<strong>Resolution confirmed:</strong> Exported size matches channel spec (e.g. 2048×2730 for high-res ads).",
    blogAiGuideSection5Item2:
      "<strong>Artefact scan:</strong> Zoom to 200% to catch extra limbs, duplicated logos, or background glitches.",
    blogAiGuideSection5Item3:
      "<strong>Copy safe area:</strong> Leave negative space for copy overlays; use AISTONE guidelines when available.",
    blogAiGuideSection5Item4:
      "<strong>Version labeling:</strong> Name files with `campaign_model_revision` to keep DAM systems organised.",
    blogAiGuideSection5Outro:
      'Need narration or onboarding audio? Jump to the <a href="voice.html">voice studio</a> and reuse the same script to keep storytelling consistent. The Nova voice pairs well with premium hardware products, while Fable suits lifestyle explainers.',
    blogAiGuideSection6Title: "6. Collaboration patterns for teams",
    blogAiGuideSection6Intro:
      "High-performing teams build lightweight rituals around AI production. Consider adopting the following cadence:",
    blogAiGuideSection6Card1Title: "Daily stand-up",
    blogAiGuideSection6Card1Desc:
      'Designers share yesterday\'s prompts and results. Growth leads call out performance insights. Keeps everyone aligned on what "good" looks like.',
    blogAiGuideSection6Card2Title: "Weekly library update",
    blogAiGuideSection6Card2Desc:
      "Drop approved prompts, outputs, and usage notes into a shared knowledge base. Tag by campaign so future sprints can reference proven angles.",
    blogAiGuideSection6Card3Title: "Monthly retro",
    blogAiGuideSection6Card3Desc:
      'Compare campaign metrics against the creative choices made in prompts. Document learnings in your playbook to keep beating the "low quality" label.',
    blogAiGuideSection6Outro:
      'With consistent documentation, the "low value content" warning disappears: reviewers see clear expertise, effort, and tangible results from every asset you publish.',
    blogAiGuideDownload: "Download PDF",
    blogAiGuideShare: "Share Guide",
    blogAiGuideAuthor: "AISTONE Content Team",
    blogAiGuideDate: "April 2025",

    // Prompt engineering blog (English)
    promptEngineeringAuthor: "AISTONE Content Team",
    promptEngineeringDate: "April 2025",
    promptEngineeringOverviewTitle: "🎯 Why this playbook matters",
    promptEngineeringCard1Title: "🚀 Grammar foundations",
    promptEngineeringCard1Desc:
      "Structure prompts so primary subjects and modifiers never get lost.",
    promptEngineeringCard2Title: "⚡ Weight control",
    promptEngineeringCard2Desc: "Balance competing instructions with explicit weighting syntax.",
    promptEngineeringCard3Title: "🚫 Negative prompts",
    promptEngineeringCard3Desc:
      "Eliminate artefacts, odd limbs, and unwanted styles with reusable filters.",
    promptEngineeringCard4Title: "🎨 Style fusion",
    promptEngineeringCard4Desc:
      "Blend multiple artists, mediums, and lighting setups without losing cohesion.",
    promptEngineeringSection1Heading1: "1. Lead with the subject",
    promptEngineeringSection1Paragraph1:
      "Open with the primary noun phrase so the model locks onto your hero element.",
    promptEngineeringSection1Code:
      "✅ Correct: a cinematic portrait of a bioluminescent jellyfish<br />❌ Incorrect: cinematic, lighting, deep ocean, jellyfish portrait",
    promptEngineeringSection1Heading2: "2. Order modifiers by importance",
    promptEngineeringSection1Paragraph2:
      "Describe style, lighting, camera, and mood from most to least critical. This reduces conflicting signals and makes weight tuning easier.",
    promptEngineeringSection1Heading3: "3. Include context & action",
    promptEngineeringSection1Paragraph3:
      'Short clauses about location or motion ("in a rain-soaked alley", "hovering above a neon city") dramatically improve coherence, especially for cinematic shots.',
    promptEngineeringSection2Paragraph1:
      "Use weighting syntax to emphasise or downplay specific attributes. AISTONE supports both parenthetical weights and colon weights familiar to diffusion users.",
    promptEngineeringSection2List1: "<strong>1.4+</strong> — hero element, must-read instructions.",
    promptEngineeringSection2List2:
      "<strong>1.0</strong> — default priority for supporting descriptors.",
    promptEngineeringSection2List3:
      "<strong>&lt; 1.0</strong> — gentle hints; the model may ignore them if overwhelmed.",
    promptEngineeringSection2Paragraph2:
      "Combine weights with comma-separated structure. For multi-sentence prompts, restate the subject at least once so the model stays anchored.",
    promptEngineeringSection3Paragraph1:
      "Instead of maintaining enormous blacklists, build focused negative prompt bundles per asset type. Start with this baseline for portraits:",
    promptEngineeringSection3Paragraph2:
      "Maintain separate bundles for products (scratches, reflections), environments (tiling, stretched textures), and typography (warped lettering, bevel). Name them in your team documentation so everyone reuses the same guardrails.",
    promptEngineeringSection4List1:
      "<strong>Establish the base medium.</strong> Photography, oil painting, cel-shaded illustration — pick one anchor to avoid muddy results.",
    promptEngineeringSection4List2:
      '<strong>Add two complementary influences.</strong> Example: "shot on Kodak Portra 400" + "lighting by Gregory Crewdson".',
    promptEngineeringSection4List3:
      '<strong>Limit conflicting adjectives.</strong> "Minimalist" and "baroque" rarely work together unless intentionally juxtaposed.',
    promptEngineeringSection4List4:
      "<strong>Use references sparingly.</strong> Link to mood boards or concept art only when necessary; otherwise rely on textual cues.",
    promptEngineeringSection4Paragraph:
      "For iterative campaigns, log the final prompt + seed + reference assets so future shoots can recreate the signature look within minutes.",
    promptEngineeringSection5List1:
      "<strong>Prompt repository:</strong> Store approved prompts in a shared doc with screenshots.",
    promptEngineeringSection5List2:
      "<strong>Versioning:</strong> Append campaign + model + iteration to filenames (e.g., `launch_flux_v3`).",
    promptEngineeringSection5List3:
      "<strong>Review log:</strong> Capture stakeholder comments and resolutions for future training.",
    promptEngineeringSection5List4:
      "<strong>Hand-off package:</strong> Provide prompt, seed, aspect ratio, and any upscaling notes to downstream teams.",
    promptEngineeringSection5Paragraph:
      "Pair this checklist with AISTONE's prompt history so anyone can trace how a hero image evolved from first draft to final delivery.",
    promptEngineeringDownload: "Download PDF",
    promptEngineeringShare: "Share Guide",

    // Tutorial blog (English)
    tutorialAuthor: "AISTONE Content Team",
    tutorialDate: "April 2025",
    tutorialQuickStartTitle: "🚀 Quick start",
    tutorialQuickStartStep1:
      'Visit <a href="https://aistone.cfd">https://aistone.cfd</a> — no registration required.',
    tutorialQuickStartStep2:
      "Choose <strong>Image</strong> or <strong>Voice</strong> generation based on your task.",
    tutorialQuickStartStep3:
      "Enter a detailed description (English or Chinese) and optionally click example buttons to auto-fill prompts.",
    tutorialQuickStartStep4:
      "Adjust parameters (models, ratios, voices) and press <strong>Generate</strong>.",
    tutorialImageParamsTitle: "🎨 Image generation parameters",
    tutorialImageModelHeading: "1. Choose an AI model",
    tutorialImageModelFlux: "<strong>FLUX:</strong> highest fidelity for hero visuals.",
    tutorialImageModelTurbo: "<strong>Turbo:</strong> fast drafts and batch ideation.",
    tutorialImageModelKontext: "<strong>Kontext:</strong> image-to-image editing and recolor.",
    tutorialImageRatioHeading: "2. Pick an aspect ratio",
    tutorialImageRatioDesc:
      "Select presets (1:1, 16:9, 9:16, 4:3) or choose custom width/height for specific channels.",
    tutorialImageQuantityHeading: "3. Set quantity & watermark",
    tutorialImageQuantityItem1: "Generate 1–4 variations to compare composition.",
    tutorialImageQuantityItem2: "Enable watermark removal when you need clean deliverables.",
    tutorialPromptTipsTitle: "🧠 Prompt crafting tips",
    tutorialPromptTip1: "Start with the subject, then describe style, lighting, and mood.",
    tutorialPromptTip2: "Use commas to separate clauses; keep each clause focused.",
    tutorialPromptTip3: "Add context such as camera type, colour palette, or era.",
    tutorialPromptTip4: "Leverage the negative prompt field to filter unwanted artefacts.",
    tutorialVoiceTitle: "🎙️ Voice synthesis workflow",
    tutorialVoiceStep1: "Switch the generation type to <strong>Voice</strong>.",
    tutorialVoiceStep2: "Paste your script; paragraphs create natural pauses.",
    tutorialVoiceStep3: "Choose from six voices (Nova, Echo, Fable, Onyx, Shimmer, Alloy).",
    tutorialVoiceStep4: "Set speech speed (0.25x–4.0x) and click <strong>Generate Voice</strong>.",
    tutorialVoiceStep5: "Preview in the browser or download the WAV file for editing.",
    tutorialWorkflowTitle: "🛠️ Recommended workflow",
    tutorialWorkflowCard1Title: "Plan",
    tutorialWorkflowCard1Desc:
      "Gather brand guidelines, reference imagery, and usage specs before prompting.",
    tutorialWorkflowCard2Title: "Prototype",
    tutorialWorkflowCard2Desc:
      "Use Turbo for quick drafts, shortlist favourites, and copy prompts into FLUX for polish.",
    tutorialWorkflowCard3Title: "Finalize",
    tutorialWorkflowCard3Desc:
      "Upscale the winning image, export in required formats, and archive prompt + seed for reuse.",
    tutorialTroubleshootingTitle: "🧰 Troubleshooting",
    tutorialTroubleshootingItem1:
      "<strong>Images look blurry:</strong> Increase resolution or switch to FLUX, and add more concrete detail.",
    tutorialTroubleshootingItem2:
      '<strong>Voice pronunciations off:</strong> Add phonetic hints (e.g., "AISTONE (pronounced eye-stone)")',
    tutorialTroubleshootingItem3:
      "<strong>Timeouts:</strong> Retry with fewer variations or simplify prompts; check status page for outages.",
    tutorialTroubleshootingItem4:
      '<strong>Need support:</strong> Email <a href="mailto:support@aistone.cfd">support@aistone.cfd</a> or use the in-app feedback form.',
    tutorialDownload: "Download PDF",
    tutorialShare: "Share Guide",

    // Image generator page
    imageGeneratorTitle: "AISTONE - AI Image Generator",
    imageGeneratorSubtitle: "AI-Driven · One-Click Generation · Unleash Creativity",
    imageGeneratorSlogan:
      "Generate high-quality AI images for free, supporting various styles and sizes",
    breadcrumbImageGenerator: "AI Image Generator",

    // ========== 📄 关于页面 (About Page) ==========

    // About page
    aboutStatImages: "Image Generations",
    aboutStatVoice: "Voice Synthesis Duration",
    aboutStatUsers: "Active Users",
    aboutStatUptime: "Service Uptime",
    aboutCoreValuesTitle: "🎯 Our Core Values",
    aboutTechLeadTitle: "Technical Leadership",
    aboutTechLeadDesc:
      "Integrating latest AI models like FLUX and Stable Diffusion, providing industry-leading generation quality and speed",
    aboutOpenFreeTitle: "Open & Free",
    aboutOpenFreeDesc:
      "Adhering to technology accessibility principles, all core features are permanently free, lowering AI technology barriers",
    aboutEfficientTitle: "Efficient & Convenient",
    aboutEfficientDesc:
      "Use without registration, intuitive user interface, professional features at your fingertips",
    aboutSecureTitle: "Secure & Reliable",
    aboutSecureDesc:
      "Based on Cloudflare global network architecture, ensuring data security and service stability",

    // About page - extra keys
    aboutTimelineTitle: "📈 Milestones",
    aboutTimelineDate1: "Mar 2024",
    aboutTimelineDate2: "Jun 2024",
    aboutTimelineDate3: "Sep 2024",
    aboutTimelineDate4: "Dec 2024",
    aboutTimelineDate5: "Mar 2025",
    aboutTimelineDate6: "Future 2025",
    aboutTimelineKickoff: "Project Kickoff",
    aboutTimelineKickoffDesc:
      "AISTONE officially launched with a focus on AI content generation, starting technical architecture design and prototyping.",
    aboutTimelineMvp: "MVP Release",
    aboutTimelineMvpDesc:
      "Released the minimum viable product with core image generation, receiving the first round of user feedback.",
    aboutTimelineImprove: "Feature Improvements",
    aboutTimelineImproveDesc:
      "Added TTS, improved UX, and introduced multilingual support and prompt optimization.",
    aboutTimelineEnterprise: "Enterprise Services",
    aboutTimelineEnterpriseDesc:
      "Launched enterprise-grade solutions with APIs and batch processing for B2B customers.",
    aboutTimelineUpgrade: "Technology Upgrade",
    aboutTimelineUpgradeDesc:
      "Integrated the latest FLUX models for higher image quality, plus advanced editing and post-processing.",
    aboutTimelineEcosystem: "Ecosystem Building",
    aboutTimelineEcosystemDesc:
      "Planning developer platform and plugin ecosystem to build an open AI creation ecosystem.",

    aboutTeamTitle: "👥 Team & Vision",
    aboutTeamProTitle: "Professional Team",
    aboutTeamProDesc:
      "Our team consists of AI experts, engineers and designers from top tech companies, turning cutting-edge AI into user-friendly products.",
    aboutTeamAI: "🤖 AI Research Team",
    aboutTeamAIDesc: "Experts in deep learning, focusing on CV, NLP and speech research",
    aboutTeamEng: "💻 Engineering Team",
    aboutTeamEngDesc:
      "Experienced engineers in cloud-native architecture, high concurrency systems and frontend tech",
    aboutTeamDesign: "🎨 Design Team",
    aboutTeamDesignDesc:
      "UX designers focused on interaction and experience optimization for AI products",
    aboutTeamProduct: "📊 Product Team",
    aboutTeamProductDesc: "PMs and analysts for product planning and user behavior analysis",

    aboutMissionTitle: "Mission & Vision",
    aboutMission: "🎯 Mission",
    aboutMissionDesc:
      "Make AI accessible, lower creation barriers and unleash creativity for everyone.",
    aboutVision: "🌟 Vision",
    aboutVisionDesc:
      "Become a leading global AI content platform and drive innovation in creative AI.",
    aboutValues: "💎 Values",
    aboutValuesDesc: "Open and inclusive, technology-first, user-centric, continuous innovation.",

    aboutEnterpriseTitle: "🏢 Enterprise Solutions",
    aboutEnterpriseIntroTitle: "Tailored for Business",
    aboutEnterpriseIntroDesc:
      "Beyond free services for individuals, AISTONE provides enterprise solutions for marketing, design and content production.",
    aboutSolutionBatch: "Batch Content Generation",
    aboutSolutionBrand: "Brand Customization",
    aboutSolutionPrivate: "Private Deployment",

    aboutPartnerTitle: "🤝 Partnerships & Open Source",
    aboutPartnerAcademy: "🔬 Academic Cooperation",
    aboutPartnerAcademyDesc:
      "Work with universities and institutes to advance AI research and application in creation.",
    aboutPartnerIndustry: "💼 Industrial Ecosystem",
    aboutPartnerIndustryDesc:
      "Collaborate with chip vendors, cloud providers and content platforms to build a full-chain ecosystem.",
    aboutPartnerOpen: "🌐 Open Source",
    aboutPartnerOpenDesc:
      "Contribute core components to open-source community and promote openness.",

    aboutAchievementsTitle: "🏆 Platform Data & Achievements",
    aboutAchievementsService: "📊 Service Data",
    aboutAchievementsTech: "🎖️ Technical Achievements",
    aboutAchievementsIndustry: "🌟 Industry Recognition",

    aboutContactTitle: "💬 Contact Us",
    aboutContactSupportTitle: "Multi-channel Support",
    aboutContactSupportDesc: "We provide various ways to stay connected and support your journey.",
    aboutContactEmail: "Email Support",
    aboutContactEmailSla: "Response within 24 hours on business days",
    aboutContactChat: "Live Chat",
    aboutContactChatDesc: "Chat window at the bottom-right of the site",
    aboutContactChatSla: "Real-time during business hours",
    aboutContactFeedback: "Feedback",
    aboutContactFeedbackDesc: "Built-in feedback system",
    aboutContactFeedbackNote: "Product suggestions and bug reports",

    aboutCommunityTitle: "Join Our Community",

    aboutStartJourney: "🚀 Start Your AI Creation Journey",
    aboutStartCreate: "🎨 Start Creating Now",
    aboutStartCreateDesc: "Experience AISTONE and create your AI artworks",
    aboutStartCreateCta: "Create Now →",
    aboutStartGuide: "🧠 AI Guide",
    aboutStartGuideDesc: "Learn the principles and practices of AI image generation",
    aboutStartGuideCta: "Learn More →",
    aboutStartPrompt: "✍️ Prompt Engineering",
    aboutStartPromptDesc: "Master prompting skills to improve creation quality",
    aboutStartPromptCta: "Improve Skills →",
    aboutStartBiz: "💼 Business Cooperation",
    aboutStartBizDesc: "Learn enterprise solutions and discuss customized needs",
    aboutStartBizCta: "Contact Us →",

    // Tutorial page
    tutorialStep1Title: "Step 1: Access Platform",
    tutorialStep1Desc:
      'Open your browser and visit <a href="https://aistone.cfd">https://aistone.cfd</a>, no registration required to start using.',
    tutorialStep2Title: "Step 2: Choose Generation Type",
    tutorialStep2Desc: "On the page, select the type of content you want to generate:",
    tutorialImageGen: "Generate Images:",
    tutorialImageGenDesc: "Convert text descriptions into high-quality images",
    tutorialVoiceGen: "Generate Voice:",
    tutorialVoiceGenDesc: "Convert text into natural and fluent speech",
    tutorialWelcomeTitle: "Welcome to AISTONE",
    tutorialWelcomeDesc:
      "AISTONE is a powerful AI content creation platform supporting text-to-image and text-to-speech. This tutorial helps you get started quickly and make the most of the platform.",
    tutorialQuickStartTitle: "1. Quick Start",
    tutorialStep3Title: "Step 3: Enter Description Text",
    tutorialStep3Desc: "Enter your description in the text input box:",
    tutorialStep4Title: "Step 4: Click Generate",
    tutorialStep4Desc:
      'Click "Start Generation" and the AI will process your request. It usually takes 10–30 seconds.',
    tutorialImageFeaturesTitle: "2. Image Generation Features Explained",
    tutorialModelSelectionTitle: "AI Model Selection",
    tutorialModelSelectionDesc: "AISTONE provides multiple AI models to choose from:",

    // AI Guide page
    aiGuideCoreTechTitle: "Core Technical Principles",
    aiGuideCoreTechDesc:
      "<strong>Diffusion Models</strong> are currently the most mainstream AI image generation technology. They mimic the diffusion process in physics:",
    aiGuideForwardProcess: "Forward Process:",
    aiGuideForwardProcessDesc: "Gradually add noise to clear images until they become pure noise",
    aiGuideReverseProcess: "Reverse Process:",
    aiGuideReverseProcessDesc:
      "AI learns to gradually denoise from noise, reconstructing meaningful images",
    aiGuideConditionalControl: "Conditional Control:",
    aiGuideConditionalControlDesc:
      "Convert prompts to mathematical vectors through text encoders to guide the generation process",
    aiGuideTechAdvantagesTitle: "💡 Technical Advantages",
    aiGuideHighQuality: "High Quality Output:",
    aiGuideHighQualityDesc: "Can generate professional-grade images at 8K resolution",
    aiGuideStyleDiversity: "Style Diversity:",
    aiGuideStyleDiversityDesc:
      "Supports various artistic styles including photography, painting, and illustration",
    aiGuideUnlimitedCreativity: "Unlimited Creativity:",
    aiGuideUnlimitedCreativityDesc: "Can create scenes and concepts that don't exist in reality",
    aiGuideCostEffective: "Cost Effective:",
    aiGuideCostEffectiveDesc: "Significantly reduces time and cost for visual content creation",

    // About AISTONE section
    aboutAistone: "About AISTONE",
    whatIsAistone: "What is AISTONE?",
    whatIsAistoneDesc:
      "AISTONE is a revolutionary AI-powered platform that combines cutting-edge image generation and voice synthesis technologies. Founded with the vision of democratizing AI content creation, AISTONE provides free access to advanced AI models including Kontext, FLUX, and Turbo.",
    aistoneMission: "AISTONE's Mission",
    aistoneMissionDesc:
      "AISTONE is committed to making AI content creation accessible to everyone. Whether you're a professional designer, content creator, or just someone with creative ideas, AISTONE provides the tools you need to bring your vision to life without any barriers.",
    whyChooseAistone: "Why Choose AISTONE?",
    whyChooseAistoneDesc:
      "AISTONE stands out with its commitment to privacy, quality, and accessibility. Our platform processes all content in real-time without storing user data, ensuring complete privacy while delivering professional-grade results powered by the latest AI technology.",
    aistonePartner: "AISTONE - Your AI Content Creation Partner",
    aistonePartnerDesc:
      "Join thousands of users who trust AISTONE for their AI content creation needs. From stunning visual art to natural voice synthesis, AISTONE is your one-stop solution for all AI-powered creative projects. Experience the future of content creation with AISTONE today.",
    
    // ========== ❓ FAQ页面 (FAQ Page) ==========
    
    // FAQ page
    faqIntro:
      "This page collects the most common questions and answers. If you do not find the answer you need, please contact us via the page footer.",
    faqBasicTitle: "Basic Usage Questions",
    faqImageGenTitle: "Image Generation Features",
    faqQ5: "What image formats and sizes are supported?",
    faqA5:
      "Supports multiple mainstream formats (JPG, PNG, etc.) and aspect ratios: 1:1 (square), 16:9 (landscape), 9:16 (portrait), 4:3 (traditional ratio), etc. Also supports custom size settings (256-4096 pixels).",
    faqQ6: "Can I generate multiple images?",
    faqA6:
      "Yes, you can choose to generate 1, 2, or 4 images. The system will generate multiple variants based on your description for easy comparison and selection.",
    faqQ7: "What are AI models? How to choose?",
    faqA7: "AI models are algorithm engines for generating images:",
    faqFluxModel: "FLUX:",
    faqFluxModelDesc: "High-quality art creation, suitable for most scenarios",
    faqTurboModel: "Turbo:",
    faqTurboModelDesc: "Fast generation, suitable for prototyping",
    faqKontextModel: "Kontext:",
    faqKontextModelDesc: "Image-to-image generation, suitable for image editing",
    faqQ8: "How long does image generation take?",
    faqA8:
      "Usually takes 10-30 seconds, depending on description complexity, selected model, and current server load. Turbo model has the fastest generation speed.",
    faqQ9: "What if image quality is poor?",
    faqA9: "Try these methods to improve quality:",
    faqQualityTip1: "Use more detailed descriptions",
    faqQualityTip2: "Choose FLUX model",
    faqQualityTip3: "Use higher resolution",
    faqQualityTip4: "Utilize smart optimization features",
    faqQualityTip5: "Add negative prompts to exclude unwanted elements",
    faqVoiceGenTitle: "Voice Synthesis Features",
    faqQ10: "What voice options are available?",
    faqA10: "Provides 6 professional voice options:",
    faqVoiceAlloy: "Alloy:",
    faqVoiceAlloyDesc: "Professional female voice",
    faqVoiceEcho: "Echo:",
    faqVoiceEchoDesc: "Warm male voice",
    faqVoiceFable: "Fable:",
    faqVoiceFableDesc: "British female voice",
    faqVoiceOnyx: "Onyx:",
    faqVoiceOnyxDesc: "Deep male voice",
    faqVoiceNova: "Nova:",
    faqVoiceNovaDesc: "Lively female voice",
    faqVoiceShimmer: "Shimmer:",
    faqVoiceShimmerDesc: "Light female voice",
    faqQ11: "Can I download generated voice?",
    faqA11:
      "Yes, after generation you can play online or download audio files (WAV format) for local use.",
    faqQ12: "How is the voice synthesis quality?",
    faqA12:
      "Uses advanced AI voice synthesis technology to generate natural and fluent speech, supporting Chinese and English, suitable for videos, podcasts, voice content, and various scenarios.",

    // Example buttons
    examples: {
      cat: {
        name: "🐱 Cute Cat",
        text: "A cute cat playing on the grass, sunny day, high-definition photography",
        type: "image",
      },
      city: {
        name: "🌃 Tech City",
        text: "Future tech city night scene, neon lights flashing, cyberpunk style, ultra HD",
        type: "image",
      },
      beauty: {
        name: "🌸 Ancient Beauty",
        text: "Ancient beauty, flowing hanfu, peach blossoms, Chinese style illustration, exquisite details",
        type: "image",
      },
      dragon: {
        name: "🐉 Epic Dragon",
        text: "A fierce dragon circling above a volcano, lava flowing, epic feeling",
        type: "image",
      },
      lake: {
        name: "🏞️ Mountain Lake",
        text: "Peaceful lake reflecting snow mountains and forest, sunset, oil painting style",
        type: "image",
      },
      welcome: {
        name: "🎵 Welcome Voice",
        text: "Welcome to AI content generator, hope you can create wonderful works",
        type: "audio",
      },
      weather: {
        name: "🌦️ Weather Report",
        text: "The weather is really nice today, perfect for going out for a walk and taking photos",
        type: "audio",
      },
      forest: {
        name: "🌲 Magic Forest",
        text: "Dreamy forest, fairies dancing, magic light, fantasy landscape painting",
        type: "image",
      },
      mountain: {
        name: "⛰️ Starry Mountain",
        text: "Mountain under the starry sky, brilliant galaxy, photography work, stunning visuals",
        type: "image",
      },
      robot: {
        name: "🤖 Mechanical Punk",
        text: "Mechanical punk robot, metallic texture, steampunk style, industrial aesthetics",
        type: "image",
      },
      thanks: {
        name: "🙏 Thanks Voice",
        text: "Thank you for using, wish you a happy life and smooth work",
        type: "audio",
      },
      garden: {
        name: "🌸 Japanese Garden",
        text: "Japanese garden with falling cherry blossoms, peaceful and beautiful, ink painting style",
        type: "image",
      },
    },
    // Contact help section
    contactHelpTitle: "📞 Get Help",
    contactHelpFAQTitle: "❓ Frequently Asked Questions",
    contactHelpFAQDesc: "Check the FAQ first — your question may already be answered in detail.",
    contactHelpTutorialTitle: "📖 Tutorial",
    contactHelpTutorialDesc: "Complete step-by-step guide to help you get started quickly.",
    contactHelpAboutTitle: "ℹ️ About AISTONE",
    contactHelpAboutDesc: "Learn about our platform vision and technical background.",
    contactHelpHomeTitle: "🏠 Back to Home",
    contactHelpHomeDesc: "Return to the homepage to start using AI generation features.",

    // About page - Technology section
    aboutTechArchTitle: "🔬 Technology Architecture & Innovation",
    aboutTechIntegrationTitle: "Cutting-edge AI Model Integration",
    aboutTechIntegrationDesc:
      "AISTONE integrates the most advanced AI models to provide professional-grade content generation capabilities. Our tech stack is based on the latest diffusion model architecture, combining deep learning and neural network technologies to achieve high-quality text-to-image and text-to-speech conversion.",
    aboutImageTechTitle: "🎨 Image Generation Technology",
    aboutFluxModel: "FLUX Series Models:",
    aboutFluxModelDesc:
      "Latest open-source diffusion models supporting high-resolution image generation",
    aboutStableDiffusion: "Stable Diffusion:",
    aboutStableDiffusionDesc:
      "Mature and stable image generation foundation supporting various artistic styles",
    aboutPromptOptimization: "Smart Prompt Optimization:",
    aboutPromptOptimizationDesc:
      "Automatic prompt enhancement based on DeepSeek large language models",
    aboutParameterControl: "Multi-parameter Control:",
    aboutParameterControlDesc:
      "Supports professional parameter adjustments including size, ratio, steps, CFG, etc.",
    aboutVoiceTechTitle: "🎵 Voice Synthesis Technology",
    aboutNeuralTTS: "Neural Network TTS:",
    aboutNeuralTTSDesc: "High-quality voice synthesis based on Transformer architecture",
    aboutMultiVoice: "Multi-voice Support:",
    aboutMultiVoiceDesc: "6 professional-grade voices adapted to different application scenarios",
    aboutEmotionControl: "Emotional Expression:",
    aboutEmotionControlDesc: "Supports detailed control of tone, speed, pauses, etc.",
    aboutRealTimeProcessing: "Real-time Processing:",
    aboutRealTimeProcessingDesc:
      "Millisecond-level response supporting long-text streaming synthesis",
    aboutCloudArchTitle: "Cloud-native Architecture Design",
    aboutFrontendLayer: "🌐 Frontend Layer",
    aboutFrontendLayerDesc:
      "Responsive web application supporting multi-device access, built on modern JavaScript frameworks",
    aboutAPIGateway: "⚡ API Gateway",
    aboutAPIGatewayDesc:
      "Cloudflare Workers edge computing with global distributed deployment ensuring low-latency access",
    aboutAIInferenceLayer: "🧠 AI Inference Layer",
    aboutAIInferenceLayerDesc:
      "Integrated multiple AI service providers with intelligent load balancing ensuring high availability",
    aboutDataStorage: "💾 Data Storage",
    aboutDataStorageDesc:
      "KV storage for user data, R2 object storage for generated content management, global synchronization",

    // === 以下翻译键来自原第二个en对象（已合并） ===
    // Title and description
    title: "AISTONE",
    subtitle: "Image · Audio · Unlimited Free Generation",

    // Input area
    inputTitle: "Description",
    examplesTitle: "💡 Click examples to quickly fill:",
    inputPlaceholder: "Enter description text, e.g.: A cute cat playing on the grass...",
    generateButton: "Start Generation",
    quickFillLabel: "Quick Fill Examples:",
    smartOptimizeTip:
      "✨ Smart Optimization: Automatically translates and optimizes descriptions into high-quality English prompts",
    negativePromptLabel: "Negative Prompt:",
    negativePromptPlaceholder: "Enter unwanted elements, separated by commas",

    // Generation type
    generationType: "Generation Type",
    typeImage: "Generate Image",
    typeAudio: "Generate Audio",

    // Image options
    imageOptions: "Image Options",
    aiModel: "AI Model",
    aiModelFlux: "FLUX Schnell - Free High Quality",
    aiModelZimage: "Z-Image Turbo - Fast 2x Upscale",
    aiModelTurbo: "SDXL Turbo - Single-step Fast",
    aiModelKontext: "FLUX Kontext - Image Editing",
    aiModelKlein: "FLUX.2 Klein 4B - Fast Editing",
    aiModelKleinLarge: "FLUX.2 Klein 9B - High Quality Editing",
    aiModelGptimage: "GPT Image Mini - OpenAI Image",
    aiModelGptimageLarge: "GPT Image 1.5 - Advanced Image",
    aiModelNanobanana: "NanoBanana - Gemini Image",
    aiModelNanobananaPro: "NanoBanana Pro - 4K Thinking",
    aiModelSeedream: "Seedream 4.0 - ByteDance",
    aiModelSeedreamPro: "Seedream 4.5 Pro - 4K Multi-Image",
    modelGroupFree: "⚡ Fast & Free",
    modelGroupFlux: "🎨 FLUX Series",
    modelGroupGPT: "🤖 GPT Image",
    modelGroupPremium: "✨ Premium",
    modelHint: "💡 FLUX is free unlimited, other models consume Pollen credits",
    aspectRatio: "Aspect Ratio",
    aspectRatioSquare: "Square (1:1 - 1024x1024)",
    aspectRatioLandscape: "Landscape (16:9 - 1280x720)",
    aspectRatioPortrait: "Portrait (9:16 - 720x1280)",
    aspectRatioStandard: "Standard (4:3 - 1024x768)",
    aspectRatioStandardVertical: "Standard Vertical (3:4 - 768x1024)",
    aspectRatioCustom: "Custom",
    width: "Width",
    height: "Height",
    noLogo: "Remove Watermark",
    numImages: "Quantity",
    oneImage: "1 Image",
    twoImages: "2 Images",
    fourImages: "4 Images",
    aspectRatioLandscape2K: "Landscape 2K (16:9 - 2560x1440)",
    aspectRatioPortrait2K: "Portrait 2K (9:16 - 1440x2560)",
    aspectRatioLandscape4K: "Landscape 4K (16:9 - 3840x2160)",
    aspectRatioPortrait4K: "Portrait 4K (9:16 - 2160x3840)",

    // Audio options
    audioOptions: "Audio Options",
    audioModel: "Audio Model",
    audioModelOpenai: "OpenAI Audio - Latest Speech Synthesis",

    // Quick actions
    clearButton: "Clear",
    optimizeButton: "Optimize",
    translateButton: "Translate",
    randomButton: "Random",

    // Status messages
    loading: "Processing, please wait...",
    imageGenerating: "Generating image, please wait...",
    audioGenerating: "Generating audio, please wait...",
    error: "An error occurred",
    pleaseInput: "Please enter description text before generating.",
    optimizationSuccess: "✨ Prompt optimization completed!",
    optimizationFailed: "Optimization failed, please try again later",
    pleaseInputFirst: "Please enter text content first",
    generationComplete: "Generation complete!",
    generating: "Generating...",

    // Example hints
    imageHint: "💡 Image generation supports multiple sizes and quantities",
    audioHint: "🎵 Audio generation supports playback and download",

    // ========== 🔐 认证登录 (Authentication) ==========

    // Auth related
    loginTitle: "User Login",
    registerTitle: "User Registration",
    login: "Login",
    register: "Register",
    logout: "Logout",
    emailLabel: "Email Address",
    passwordLabel: "Password",
    userUsername: "Username",
    confirmPasswordLabel: "Confirm Password",
    noAccount: "Don't have an account?",
    registerNow: "Register Now",
    haveAccount: "Already have an account?",
    loginNow: "Login Now",

    // Authentication messages
    registerSuccess: "Registration successful!",
    registerFailed: "Registration failed",
    loginSuccess: "Login successful!",
    loginFailed: "Login failed",
    logoutSuccess: "Logged out successfully",
    networkError: "Network error, please try again later",
    processing: "Processing...",
    submit: "Submit",

    // Form validation
    passwordMinLength: "At least 6 characters",
    passwordMismatch: "Passwords do not match",
    fillEmailPassword: "Please fill in email and password (at least 6 characters)",
    fillUserInfo: "Please enter username and email",
    enterEmail: "Please enter email address",
    passwordMinSix: "Password must be at least 6 characters",
    invalidResetLink: "Invalid reset link",

    // Google Login and forgot password
    or: "OR",
    googleLogin: "Sign in with Google",
    loginOptional: "Logging in is optional—every feature works without registration",
    loginWithGoogle: "Continue with Google",
    forgotPassword: "Forgot Password?",
    forgotPasswordTitle: "Forgot Password",
    forgotPasswordTip: "We will send a password reset link to your email",
    sendResetLink: "Send Reset Link",
    backToLogin: "Back to Login",
    resetPasswordTitle: "Reset Password",
    newPasswordLabel: "New Password",
    resetPassword: "Reset Password",

    // Welcome to AISTONE section
    welcomeToAistone: "Welcome to AISTONE",
    aistoneIntro:
      "AISTONE is your premier destination for AI-powered image generation and voice synthesis. As a leading AI content creation platform, AISTONE combines cutting-edge technology with user-friendly design to deliver exceptional results.",
    aistoneImageGenerator: "AISTONE AI Image Generator",
    aistoneImageDesc:
      "Experience the power of AISTONE's advanced AI models including Kontext, FLUX, and Turbo for stunning visual creation.",
    aistoneVoiceSynthesis: "AISTONE Voice Synthesis",
    aistoneVoiceDesc:
      "Transform text into natural speech with AISTONE's state-of-the-art voice synthesis technology.",
    aistoneFreePlatform: "AISTONE Free Platform",
    aistoneFreeDesc:
      "Enjoy AISTONE's complete feature set completely free - no registration, no limits, no hidden costs.",

    // About AISTONE section
    aboutAistone: "About AISTONE",
    whatIsAistone: "What is AISTONE?",
    whatIsAistoneDesc:
      "AISTONE is a revolutionary AI-powered platform that combines cutting-edge image generation and voice synthesis technologies. Founded with the vision of democratizing AI content creation, AISTONE provides free access to advanced AI models including Kontext, FLUX, and Turbo.",
    aistoneMission: "AISTONE's Mission",
    aistoneMissionDesc:
      "AISTONE is committed to making AI content creation accessible to everyone. Whether you're a professional designer, content creator, or just someone with creative ideas, AISTONE provides the tools you need to bring your vision to life without any barriers.",
    whyChooseAistone: "Why Choose AISTONE?",
    whyChooseAistoneDesc:
      "AISTONE stands out with its commitment to privacy, quality, and accessibility. Our platform processes all content in real-time without storing user data, ensuring complete privacy while delivering professional-grade results powered by the latest AI technology.",
    aistonePartner: "AISTONE - Your AI Content Creation Partner",
    aistonePartnerDesc:
      "Join thousands of users who trust AISTONE for their AI content creation needs. From stunning visual art to natural voice synthesis, AISTONE is your one-stop solution for all AI-powered creative projects. Experience the future of content creation with AISTONE today.",

    // Example buttons
    examples: {
      cat: {
        name: "🐱 Cute Cat",
        text: "A cute cat playing on the grass, sunny day, high quality photography",
        type: "image",
      },
      city: {
        name: "🌃 Tech City",
        text: "Futuristic city night scene, neon lights, cyberpunk style, ultra HD",
        type: "image",
      },
      beauty: {
        name: "🌸 Ancient Beauty",
        text: "Ancient beauty in Hanfu, cherry blossoms, Chinese style illustration",
        type: "image",
      },
      dragon: {
        name: "🐉 Epic Dragon",
        text: "A fierce dragon circling above a volcano, lava flowing, epic scene",
        type: "image",
      },
      lake: {
        name: "🏞️ Mountain Lake",
        text: "Peaceful lake reflecting mountains and forest, sunset, oil painting style",
        type: "image",
      },
      welcome: {
        name: "🎵 Welcome Audio",
        text: "Welcome to the AI content generator, hope you create amazing works",
        type: "audio",
      },
      weather: {
        name: "🌦️ Weather Report",
        text: "The weather is great today, perfect for walking and taking photos",
        type: "audio",
      },
      forest: {
        name: "🌲 Magic Forest",
        text: "Dreamy forest with fairies, magical lights, fantasy landscape",
        type: "image",
      },
      mountain: {
        name: "⛰️ Starry Mountain",
        text: "Mountain under starry sky, Milky Way, photography, stunning visuals",
        type: "image",
      },
      robot: {
        name: "🤖 Steampunk Robot",
        text: "Steampunk robot, metallic texture, industrial aesthetics",
        type: "image",
      },
      thanks: {
        name: "🙏 Thank You Audio",
        text: "Thank you for using our service, wish you a happy life and successful work",
        type: "audio",
      },
      garden: {
        name: "🌸 Japanese Garden",
        text: "Japanese garden with falling cherry blossoms, peaceful and beautiful, ink painting style",
        type: "image",
      },
    },

    // Tips
    tips: {
      example: "💡 Try clicking example buttons to quickly fill content",
      optimize: '✨ Use "Optimize" button to improve AI generation results',
      random: '🎲 Click "Random" button for inspiration',
      imageSize: "🖼️ Image generation supports multiple aspect ratios",
      audio: "🎵 Audio generation supports download feature",
    },

    // Result actions
    download: "Download",
    copy: "Copy",
    view: "View",
    close: "Close",
    copied: "Copied",
    copyFailed: "Copy failed",
    audioUnsupported: "Your browser does not support audio playback.",

    // Inspiration section
    inspirationTitle: "🎨 Inspiration Gallery",
    inspirationExamples: {
      forest: "Magic Forest",
      city: "Future City",
      cottage: "Fairy Tale Cottage",
      cyberpunk: "Cyberpunk",
    },

    // Navigation
    navHome: "Home",
    navImageGen: "Image Generation",
    navVoice: "Voice Synthesis",
    navVoiceGen: "Voice Synthesis",
    navAbout: "About",
    navAIGuide: "AI Guide",
    navPromptEngineering: "Prompt Engineering",
    navTutorial: "Tutorial",
    navFAQ: "FAQ",
    navContact: "Contact",
    navServices: "Services",
    navLogin: "Login",
    navBlog: "Blog",

    // Blog related
    blogTitle: "AISTONE Blog - AI Technology Guides & Tutorials",
    blogHeroTitle: "AISTONE Tech Blog",
    blogHeroSubtitle:
      "Explore AI image generation technology, master prompt engineering, complete guides from beginner to expert",
    blogCategoryAll: "All Articles",
    blogCategoryGuide: "Tech Guides",
    blogCategoryTutorial: "Tutorials",
    blogCategoryPrompt: "Prompt Engineering",
    blogCategoryFAQ: "FAQ",

    tutorialTitle: "AISTONE Platform Tutorial",

    // Article excerpts
    aiGuideExcerpt:
      "From basic theory to practical skills, deep dive into diffusion models, FLUX, Stable Diffusion and cutting-edge AI image generation technologies...",
    aiGuideReadTime: "About 10 minutes read",
    promptEngineeringExcerpt:
      "Master the core skills of AI image generation, from basic syntax to advanced strategies, learn weight control, negative prompts and style fusion...",
    promptEngineeringReadTime: "About 12 minutes read",
    tutorialExcerpt:
      "Quick start with AISTONE platform, learn basic operations of image generation and voice synthesis, master various parameter settings and optimization tips...",
    tutorialReadTime: "About 8 minutes read",
    faqExcerpt:
      "Summary of common problems and solutions in platform usage, including account management, generation failures, quality optimization and practical suggestions...",
    faqReadTime: "About 5 minutes read",

    // Breadcrumb navigation
    breadcrumbHome: "Home",

    // Voice page specific translations
    voiceHeroTitle: "AISTONE - Free AI Voice Synthesis Platform",
    voiceHeroSubtitle: "Text-to-Speech • Multiple Voices • Completely Free",
    voiceHeroSlogan: "AI-Powered · Natural Voice · Professional Quality!",
    voiceInputTitle: "Text Content",
    voiceGeneratorTitle: "AI Voice Synthesizer",
    voiceGeneratorDesc: "Enter text and AI will generate natural, fluent speech for you",
    voiceTextLabel: "Enter text content",
    voiceTextHint: "(Supports Chinese and English, recommended within 300 characters)",
    voiceTextPlaceholder: "Enter the text you want to convert to speech here...",
    voiceModelLabel: "Voice Selection",
    voiceSpeedLabel: "Speed Control",
    voiceExamplesLabel: "Example texts (click to use)",
    generateVoiceBtn: "Generate Voice",
    voiceResultTitle: "Generation Result",
    downloadAudio: "Download Audio",
    copyLink: "Copy link",
    fileSize: "File Size:",
    logsTitle: "Logs",
    historyTitle: "History",
    shareAudio: "Share",
    saveToGallery: "Save to Personal Center",
    voiceLength: "Duration:",
    voiceModel: "Voice:",
    voiceSpeed: "Speed:",
    voiceFeature1: "Multiple AI Voices",
    voiceFeature2: "Chinese-English Support",
    voiceFeature3: "Real-time Generation",
    voiceFeature4: "Completely Free",

    // Voice features
    voiceFeaturesTitle: "AI Voice Synthesis Features",
    voiceFeatureTitle1: "Diverse Voice Options",
    voiceFeatureDesc1:
      "Provides 6 different styles of AI voices, including male and female voices, adapting to different scenarios and giving each voice unique personality.",
    voiceFeatureTitle2: "Real-time Fast Generation",
    voiceFeatureDesc2:
      "Adopts advanced AI voice synthesis technology, supports real-time text-to-speech, generating high-quality natural speech in seconds.",
    voiceFeatureTitle3: "Chinese-English Bilingual Support",
    voiceFeatureDesc3:
      "Perfect support for Chinese and English text-to-speech, intelligently recognizes language types, providing quality voice synthesis services for global users.",
    voiceFeatureTitle4: "Flexible Speed Control",
    voiceFeatureDesc4:
      "Supports speed adjustment from 0.25x to 4.0x, meeting different application scenarios, from slow learning to fast broadcasting, free control.",
    voiceFeatureTitle5: "High-quality Output",
    voiceFeatureDesc5:
      "Generated speech is clear and natural with rich emotional expression, suitable for professional application scenarios such as podcasts, audiobooks, educational content.",
    voiceFeatureTitle6: "Completely Free to Use",
    voiceFeatureDesc6:
      "No registration required, no usage restrictions, all features permanently free and open, allowing everyone to enjoy the convenience of AI voice synthesis.",

    // Voice use cases
    voiceUseCasesTitle: "Application Scenarios",
    voiceUseCase1Title: "Podcast Production",
    voiceUseCase1Desc:
      "Create professional intros, introductions, or background narration for podcast programs to enhance content professionalism and appeal.",
    voiceUseCase2Title: "Audiobooks",
    voiceUseCase2Desc:
      "Convert text content into audiobooks, making reading more convenient and suitable for various scenarios such as learning and leisure.",
    voiceUseCase3Title: "Educational Training",
    voiceUseCase3Desc:
      "Create teaching audio, course explanations, language learning materials to enhance accessibility and learning experience of educational content.",
    voiceUseCase4Title: "Marketing Promotion",
    voiceUseCase4Desc:
      "Create product introductions, advertising copy, promotional video dubbing, adding voice appeal and persuasiveness to marketing content.",
    voiceUseCase5Title: "Video Production",
    voiceUseCase5Desc:
      "Add narration, commentary, or dialogue to video content, enhancing video professionalism and viewing experience.",
    voiceUseCase6Title: "Auxiliary Tools",
    voiceUseCase6Desc:
      "Provide text reading services for visually impaired people, or serve as pronunciation reference tools for language learning.",
    navAbout: "About",
    navServices: "Services",
    navContact: "Contact",
    navLogin: "Login",

    // Breadcrumb navigation
    breadcrumbCurrent: "AI Content Generation",

    // Main features section
    featuresTitle: "Key Features of AISTONE",
    features: [
      {
        icon: "💸",
        title: "Zero Cost Creation",
        desc: "Completely free, no registration, unlimited generation.",
      },
      {
        icon: "🧠",
        title: "State-of-the-art Quality",
        desc: "High resolution, rich details, diverse artistic styles.",
      },
      {
        icon: "⚡",
        title: "Lightning Fast",
        desc: "Optimized inference pipeline, fast generation without quality loss.",
      },
      {
        icon: "🔒",
        title: "Privacy Protection",
        desc: "Zero data retention, generated content not stored.",
      },
      {
        icon: "🌐",
        title: "Multi-language Support",
        desc: "Supports Chinese and English interfaces, globally available.",
      },
      {
        icon: "🎨",
        title: "Multi-style Support",
        desc: "Across artistic styles, photos, illustrations, anime, etc.",
      },
    ],
    generationResult: "Generation Result",

    // HD Image Management
    hdImageTooLarge: "Image too large, please retry (max 2MB)",
    hdImageSaved: "HD image saved successfully!",
    hdImageSaveFailed: "Save failed",
    hdImageListFailed: "Failed to get image list",
    hdImageLoadError: "Failed to get image",
    hdImagePrepareDownload: "Preparing download...",
    hdImageDownloadSuccess: "Download succeeded!",
    hdImageDownloadFailed: "Download failed",
    hdImageDeleteConfirm: "Are you sure you want to delete this image?",
    hdImageDeleted: "Image deleted successfully!",
    hdImageDeleteFailed: "Delete failed",
    hdImageLoadFailed: "Failed to load image list",
    hdImageLoadingHD: "Loading HD image...",
    hdImageThumbnail: "Thumbnail",
    hdImageSaving: "Saving...",
    hdImageStats: "Statistics error",
    hdClickToView: "Click to view HD image",

    // User Center
    userCenter: "User Center",
    userUpdateSuccess: "Update successful",
    userPasswordMismatch: "Passwords do not match",
    userFeatureComing: "Feature coming soon, stay tuned",
    newPassword: "New Password",
    confirmNewPassword: "Confirm New Password",

    // Feedback System
    feedbackTitle: "Feedback & Suggestions",
    feedbackCategory: "Feedback Category",
    feedbackContent: "Feedback Content",
    feedbackSubmit: "Submit Feedback",
    feedbackPlaceholder: "Please describe your issue or suggestion...",
    feedbackSuccess: "Feedback submitted successfully, thank you for your suggestion!",
    feedbackError: "Submission failed, please try again later",
    feedbackEmpty: "Feedback content cannot be empty",
    feedbackTooLong: "Feedback content cannot exceed 1000 characters",
    feedbackRateLimit: "Please wait before submitting another feedback",
    myFeedback: "My Feedback",
    noFeedback: "No feedback records yet",
    feedbackStatus: "Status",
    feedbackTime: "Submit Time",
    feedbackPending: "Pending",
    feedbackProcessed: "Processed",

    // Feedback Categories
    feedbackCategories: {
      bug: "Bug Report",
      feature: "Feature Request",
      improvement: "User Experience",
      other: "Other",
    },

    // Prompt Templates
    promptTemplates: "Templates",
    promptTemplateTitle: "Common Prompt Templates",
    templateCategories: {
      landscape: "Landscape",
      portrait: "Portrait",
      product: "Product Photography",
      avatar: "Avatar",
      anime: "Anime",
      logo: "Logo/Poster",
    },
    useTemplate: "Use Template",
    templateApplied: "Template Applied",

    // Modals and Popups
    showModal: "Show modal",
    closeModal: "Close modal",
    modalNotFound: "Modal not found",
    authModalLoadFailed: "Failed to load authentication interface",
    authModuleInitSuccess: "Authentication module initialized successfully",
    authModuleNotLoaded: "Authentication module not loaded",
    imageModuleInitSuccess: "Image management module initialized successfully",
    imageModuleNotLoaded: "Image management module not loaded",
    userLoggedInInit: "User logged in, initializing image manager",

    // Footer
    footerCopyright: "© 2025 AISTONE",
    footerCopyrightFull: "© 2025 AISTONE. All rights reserved.",
    footerDescription: "Free AI Content Generation Platform",
    footerQuickLinks: "Quick Links",
    footerSupport: "Support",
    footerLinksTitle: "Friend Links",
    footerLinks: [
      { text: "Privacy Policy", url: "#" },
      { text: "Terms of Service", url: "#" },
      { text: "Friend Link: IDPhoto.space (Online ID Photo Tool)", url: "https://idphoto.space/" },
    ],

    // 主页CTA按钮
    startImageGeneration: "🎨 Start Image Generation",
    startVoiceSynthesis: "🎙️ Start Voice Synthesis",
    tagHighQuality: "High Quality",

    // 主页内容
    heroDescription:
      "Based on advanced Pollinations.AI technology, supports FLUX, Turbo, Kontext for images, and OpenAI Audio TTS for voice. No registration required, permanently free, supports Chinese and English input, optimized for creators.",
    tagChinese: "Chinese Support",

    // AI模型
    modelsTitle: "Supported AI Models",
    modelsSubtitle:
      "Advanced AI models based on Pollinations.AI technology to meet different creative needs",

    // 服务
    servicesTitle: "AI Creative Services",
    servicesSubtitle:
      "Experience the most advanced AI technology, transforming your ideas into stunning visual and audio works",
    imageGenerationTitle: "AI Image Generation",
    voiceSynthesisTitle: "AI Voice Synthesis",
    imageGenerationDesc:
      "Generate high-quality AI images from text descriptions, supporting multiple artistic styles and custom sizes. Based on Pollinations.AI technology, supports FLUX, Turbo, Kontext and other advanced models, letting your creativity extend infinitely.",
    voiceSynthesisDesc:
      "Convert text to natural and fluent speech, supporting multiple timbres and languages. Suitable for making videos, podcasts, audiobooks and other content, adding vivid sound to your works.",
    featureCommercial: "Commercial License",
    featureDownloadable: "Downloadable",
    featureHighQuality: "High Quality",
    featureMultiStyle: "Multiple Styles",
    featureCustomSize: "Custom Sizes",
    featureNaturalVoice: "Natural Voice",
    featureMultiVoice: "Multiple Timbres",
    featureMultiLang: "Multi-language",

    // 适用人群
    audienceTitle: "Target Users",
    audienceSubtitle: "AISTONE provides powerful AI tools for creators in all industries",

    // 特色功能
    featureFreeDesc:
      "All features permanently free, no hidden fees, no registration required, supports commercial use",
    featureSpeedDesc:
      "Based on advanced AI technology, second-level response, efficient creative experience, no waiting",
    featureQualityDesc:
      "High-definition output, multiple styles, supports various sizes, meets professional creative needs",
    featurePrivacyDesc:
      "Does not store user data, real-time processing, protects privacy and security, content copyright belongs to users",
    featureMultiLangDesc:
      "Supports Chinese and English input, interface can be switched, specially optimized for Chinese users",
    featureResponsiveDesc:
      "Responsive design, supports seamless experience on mobile, tablet, and computer",

    // 使用指南
    guideTitle: "Usage Guide",
    guideSubtitle: "Start your AI creation journey in just a few steps",

    // AI模型描述
    fluxModelDesc:
      "High-quality artistic creation model, optimized for creative design, generating artworks with rich details",
    turboModelDesc:
      "High-speed generation model, suitable for rapid prototyping and batch image creation, efficiency-focused",
    kontextModelDesc:
      "Advanced image-to-image generation and editing model, professional image processing",
    openaiAudioModelDesc:
      "OpenAI Audio Text-to-Speech providing Nova, Alloy, Echo, Fable, Onyx, Shimmer voices with natural prosody and speed control",

    // 适用人群标题
    designerTitle: "Designers",
    creatorTitle: "Content Creators",
    marketerTitle: "Marketers",
    ecommerceTitle: "E-commerce Sellers",
    educatorTitle: "Students & Teachers",
    generalUserTitle: "General Users",

    // 适用人群描述
    designerDesc: "Quickly generate design inspiration, create concept art and prototypes",
    creatorDesc: "Create images and voice content for articles, videos, and social media",
    marketerDesc: "Create advertising materials to enhance marketing effectiveness",
    ecommerceDesc: "Create product showcase images to enhance product appeal",
    educatorDesc: "Create teaching materials to enhance learning experience",
    generalUserDesc: "Personal creation, record life, express creativity",

    // 特色功能
    featuresTitle: "Key Features of AISTONE",
    featuresSubtitle: "Why choose AISTONE as your AI creative partner",

    // 特色功能标题
    featureFreeTitle: "Permanently Free",
    featureSpeedTitle: "Ultra-fast Generation",
    featureQualityTitle: "Professional Quality",
    featurePrivacyTitle: "Privacy Protection",
    featureMultiLangTitle: "Multi-language Support",
    featureResponsiveTitle: "Cross-platform Use",

    // 使用步骤
    step1Title: "Visit Platform",
    step1Desc:
      "Visit aistone.cfd, choose Image Generation or Voice Synthesis service, no registration required",
    step2Title: "Select Model",
    step2Desc:
      "Choose FLUX, Turbo, Kontext for images, or OpenAI Audio TTS for voice, each with unique advantages",
    step3Title: "Input Description",
    step3Desc:
      "Describe your desired content in Chinese or English, AI will generate corresponding images or voice",
    step4Title: "Generate Content",
    step4Desc:
      "Click generate button, AI will create high-quality images or natural voice, supports download and commercial use",

    // 关于AISTONE
    aboutTitle: "About AISTONE",
    aboutDesc1:
      "AISTONE is an intelligent content creation platform based on Pollinations.AI technology, integrating text-to-image and voice generation functions, committed to providing users with efficient, convenient, and free AI content creation experience. Our platform supports text-to-image, text-to-voice and other creative functions.",
    aboutDesc2:
      "Whether you are a designer, content creator, or general user, just input a description to generate high-quality visual or audio content with one click.",
    aboutImageTitle: "AI Image Generation",
    aboutImageDesc:
      "Based on advanced models like FLUX, Turbo, Kontext, supports various artistic styles from realistic photography to abstract art, meeting diverse creative needs",
    aboutVoiceTitle: "AI Voice Synthesis",
    aboutVoiceDesc:
      "Convert text to natural and fluent speech, supports multiple timbres and languages, suitable for podcasts, audiobooks, educational content, etc.",
    aboutSpeedTitle: "Ultra-fast & Convenient",
    aboutSpeedDesc:
      "Cloud computing support ensures generation speed and quality, with a simple and friendly interface, multi-device compatibility, create anytime, anywhere",
    aboutPhilosophyTitle: "Platform Philosophy",
    aboutPhilosophyDesc:
      "We believe AI technology should benefit everyone, so all features are permanently free and open. Help every user unleash creative inspiration, realize unlimited possibilities from text to visuals and voice. Protect user privacy, generated content copyright belongs to users, supports commercial use.",

    // 页脚链接
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    contactUs: "Contact Us",

    // Blog tags (shared)
    tagAITech: "AI Tech",
    tagDiffusion: "Diffusion Models",
    tagFlux: "FLUX",
    tagPrompt: "Prompts",
    tagWeight: "Weight Control",
    tagStyle: "Style Design",
    tagBeginner: "Beginner Guide",
    tagHowTo: "How-To",
    tagParam: "Parameter Setup",
    tagQnA: "Q&A",
    tagTroubleshoot: "Troubleshooting",
    tagTips: "Tips",

    // Terms of Service (EN)
    termsBreadcrumb: "Terms of Service",
    termsTitle: "Terms of Service",
    termsLastUpdated: "Last Updated: January 1, 2025",
    termsSection1Title: "1. Acceptance of Terms",
    termsSection1Intro:
      'Welcome to AISTONE (the "Platform"). By accessing or using the Platform\'s AI image generation and voice synthesis services, you agree to be bound by these Terms of Service. If you do not agree, please do not use the Platform.',
    termsSection2Title: "2. Service Description",
    termsSection2Intro:
      "AISTONE is an AI content generation platform based on Pollinations.AI technology, providing the following services:",
    termsSection2Item1:
      "AI Image Generation: Generate high-quality images based on user text prompts.",
    termsSection2Item2: "AI Voice Synthesis: Convert text into natural and fluent speech.",
    termsSection2Item3: "Prompt Optimization: Optimize user prompts using DeepSeek AI.",
    termsSection2Item4: "User authentication and personal center features.",
    termsSection2Item5: "High-definition image caching and management.",
    termsSection3Title: "3. User Eligibility",
    termsSection3Intro: "To use the Platform, you must:",
    termsSection3Item1: "Be at least 13 years old.",
    termsSection3Item2: "Agree to comply with all applicable laws and regulations.",
    termsSection3Item3: "Provide truthful and accurate registration information (if applicable).",
    termsSection3Item4: "Be responsible for your account and password (if applicable).",
    termsSection4Title: "4. User Responsibilities",
    termsSection4Intro: "When using the Platform, you agree to:",
    termsSection4Item1:
      "Lawful Use: Use the services only for lawful purposes and not for any illegal activities.",
    termsSection4Item2:
      "Content Compliance: Do not generate content involving violence, pornography, hate speech, or other harmful materials.",
    termsSection4Item3:
      "Intellectual Property: Respect others' IP rights and do not infringe copyrights or trademarks.",
    termsSection4Item4:
      "Platform Security: Do not attempt to disrupt, intrude into, or interfere with the normal operation of the platform.",
    termsSection4Item5: "Fair Use: Use the services reasonably; do not overuse or abuse them.",
    termsSection5Title: "5. Prohibited Conduct",
    termsSection5Intro: "The following behaviors are strictly prohibited:",
    termsSection5Item1: "Creating or distributing illegal, obscene, violent, or hateful content.",
    termsSection5Item2:
      "Infringing others' privacy, portrait rights, or intellectual property rights.",
    termsSection5Item3: "Conducting cyber attacks, data theft, or system sabotage.",
    termsSection5Item4: "Abusing the service for unfair competition or malicious activities.",
    termsSection5Item5: "Bypassing technical restrictions or performing reverse engineering.",
    termsSection5Item6: "Spreading false or misleading information.",
    termsSection5Item7: "Using automated tools for large-scale generation.",
    termsSection6Title: "6. Content Ownership",
    termsSection6Intro: "Regarding rights to generated content:",
    termsSection6Item1: "User-Generated Content: You own the content generated using the Platform.",
    termsSection6Item2:
      "Commercial Use: You may freely use generated content for commercial and personal purposes.",
    termsSection6Item3:
      "Platform Rights: We retain all rights to the platform technology, interface, and brand.",
    termsSection6Item4:
      "Third-Party Content: The platform may include third-party content whose copyrights belong to the original rights holders.",
    termsSection7Title: "7. Service Availability",
    termsSection7Intro: "Regarding service provision:",
    termsSection7Item1: "Free Service: The Platform currently offers services for free.",
    termsSection7Item2:
      "Service Interruptions: We may temporarily interrupt services due to maintenance, technical issues, or other reasons.",
    termsSection7Item3:
      "Feature Changes: We reserve the right to modify or terminate services at any time.",
    termsSection7Item4:
      "No Warranty: We do not guarantee 100% availability or error-free operation.",
    termsSection8Title: "8. Privacy Protection",
    termsSection8Intro: "We value your privacy:",
    termsSection8Item1:
      "Data Collection: We only collect information necessary to provide services.",
    termsSection8Item2:
      "Data Use: Collected information is used solely to improve services and user experience.",
    termsSection8Item3:
      "Data Security: We adopt appropriate technical and organizational measures to protect your data.",
    termsSection8Item4:
      "Data Retention: We do not store users' original generated content for the long term.",
    termsSection8Note: "For details, see: Privacy Policy",
    termsSection9Title: "9. Disclaimers",
    termsSection9Intro: "Please note the following important disclaimers:",
    termsSection9Item1:
      "Service Provided As-Is: We do not guarantee the accuracy, reliability, or suitability of the services.",
    termsSection9Item2:
      "AI-Generated Content: Outputs may contain inaccuracies or inappropriate information.",
    termsSection9Item3:
      "Third-Party Services: We are not responsible for the availability or content of third-party services.",
    termsSection9Item4:
      "Use at Your Own Risk: You bear full responsibility for using generated content.",
    termsSection9Item5:
      "Technical Limitations: AI technology has inherent limitations and may not meet all needs.",
    termsSection10Title: "10. Limitation of Liability",
    termsSection10Intro: "To the maximum extent permitted by law, we are not liable for:",
    termsSection10Item1: "Service interruptions, data loss, or functional failures.",
    termsSection10Item2: "Quality or accuracy issues in AI-generated content.",
    termsSection10Item3: "Third-party infringements or legal disputes.",
    termsSection10Item4: "Indirect or consequential losses suffered by users due to service usage.",
    termsSection10Item5: "Service interruptions caused by force majeure.",
    termsSection11Title: "11. Changes to Terms",
    termsSection11Intro: "We reserve the right to modify these Terms at any time:",
    termsSection11Item1:
      "Change Notice: Material changes will be announced on the website or via email.",
    termsSection11Item2:
      "Continued Use: Continued use of the services constitutes acceptance of the new terms.",
    termsSection11Item3:
      "Historical Versions: We will retain historical versions of the terms for reference.",
    termsSection12Title: "12. Termination of Services",
    termsSection12Intro:
      "We may terminate or restrict your services under the following circumstances:",
    termsSection12Item1: "Violation of these Terms of Service.",
    termsSection12Item2: "Engaging in illegal or improper activities.",
    termsSection12Item3: "Posing security threats to the platform.",
    termsSection12Item4: "Account inactivity for an extended period.",
    termsSection12Item5: "Termination required due to technical or business reasons.",
    termsSection13Title: "13. Governing Law",
    termsSection13Intro: "These Terms are governed by the laws of the People's Republic of China:",
    termsSection13Item1:
      "Jurisdiction: Disputes shall be litigated in courts within mainland China.",
    termsSection13Item2: "Applicable Law: The laws of the People's Republic of China apply.",
    termsSection13Item3:
      "Dispute Resolution: Amicable negotiation is encouraged to resolve disputes.",
    termsSection14Title: "14. Contact Us",
    termsSection14Intro:
      "If you have any questions about these Terms or need assistance, please contact us via:",
    termsSection14Item1: "Email: legal@aistone.cfd",
    termsSection14Item2: "Website: Contact Us page",
    termsSection15Title: "15. Effective Date",
    termsSection15Intro:
      "These Terms take effect on January 1, 2025, and supersede all previous versions.",
    // Privacy Policy (EN)
    privacyBreadcrumb: "Privacy Policy",
    privacyTitle: "Privacy Policy",
    privacyLastUpdated: "Last Updated: September 6, 2025",
    privacySection1Title: "1. Information Collection",
    privacySection1Intro:
      "AISTONE is committed to protecting user privacy. We collect the following types of information:",
    privacySection1Item1:
      "Automatically Collected Information: Technical data such as IP address, browser type, and access time.",
    privacySection1Item2:
      "User-Provided Information: Text content you voluntarily provide when using our services.",
    privacySection1Item3: "Cookie Information: Necessary cookies used to improve your experience.",
    privacySection2Title: "2. Use of Information",
    privacySection2Intro: "We use the collected information to:",
    privacySection2Item1: "Provide AI image generation and voice synthesis services.",
    privacySection2Item2: "Improve service quality and user experience.",
    privacySection2Item3: "Conduct necessary security monitoring and protection.",
    privacySection2Item4: "Comply with legal and regulatory requirements.",
    privacySection3Title: "3. Data Security",
    privacySection3Intro: "We protect your data through the following measures:",
    privacySection3Item1:
      "Zero-storage Policy: User-generated content is not stored on our servers for the long term.",
    privacySection3Item2: "Encrypted Transmission: All data is transmitted over HTTPS encryption.",
    privacySection3Item3: "Access Control: Strictly limited access to user data.",
    privacySection3Item4: "Regular Audits: Periodic security reviews and vulnerability scanning.",
    privacySection4Title: "4. Third-Party Services",
    privacySection4Intro: "Our services integrate the following third-party providers:",
    privacySection4Item1: "Pollinations AI: Provides image and voice generation technology.",
    privacySection4Item2: "DeepSeek AI: Provides prompt optimization services.",
    privacySection4Item3: "Google Analytics: Website analytics (where applicable).",
    privacySection4Item4: "Google AdSense: Advertising display (where applicable).",
    privacySection4Note:
      "Each third-party service has its own privacy policy. We recommend that you read them carefully.",
    privacySection5Title: "5. Cookie Policy",
    privacySection5Intro: "We use cookies to:",
    privacySection5Item1: "Remember your language preferences.",
    privacySection5Item2: "Analyze website usage.",
    privacySection5Item3: "Provide a personalized experience.",
    privacySection5Item4: "Display relevant ads (where applicable).",
    privacySection5Note:
      "You can manage cookies via your browser settings, but this may affect normal site functionality.",
    privacySection6Title: "6. Your Rights",
    privacySection6Intro:
      "Under applicable data protection laws, you may have the following rights:",
    privacySection6Item1:
      "Right to be Informed: Understand how we process your personal information.",
    privacySection6Item2:
      "Right of Access: Request access to personal information we hold about you.",
    privacySection6Item3:
      "Right to Rectification: Request correction of inaccurate personal information.",
    privacySection6Item4:
      "Right to Erasure: Request deletion of your personal information in certain circumstances.",
    privacySection6Item5: "Right to Object: Object to our processing of your personal information.",
    privacySection7Title: "7. Children's Privacy",
    privacySection7Intro:
      "Our services are not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If we discover such information has been collected, we will delete it immediately.",
    privacySection8Title: "8. Policy Updates",
    privacySection8Intro:
      "We may update this Privacy Policy from time to time. Material changes will be communicated through website notices or other appropriate means. Your continued use of our services indicates your acceptance of the updated policy.",
    privacySection9Title: "9. Contact Us",
    privacySection9Intro:
      "If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us via:",
    privacySection9Item1: "Email: privacy@aistone.cfd",
    privacySection9Item2: "Website: Contact Us page",

    // 语音合成按钮
    generateAndPlay: "▶ Generate & Play",
    copyDeepLink: "Copy Link",

    // 错误提示
    initializationError: "Application initialization failed, please refresh the page and try again",
    pageElementsIncomplete: "Page elements incomplete, please refresh the page and try again",
    pleaseEnterText: "Please enter text content to convert",
    textTooLong: "Text content cannot exceed 1000 characters",
    voiceGenerationFailed: "Voice generation failed",

    // 成功提示
    voiceGenerationSuccess: "Voice generation successful!",

    // 进度提示
    preparing: "Preparing...",
    completed: "Completed",
    processing: "Processing...",

    // 操作提示
    autoFilledFromHomepage:
      "Text automatically filled from homepage. You can generate voice directly or make modifications.",
    noAudioToDownload: "No audio file available for download",
    audioDownloadStarted: "Audio download started",
    audioDownloadFailed: "Audio download failed, please try again",
    noAudioUrlToCopy: "No audio URL available to copy",
    audioUrlCopied: "Audio URL copied",
    copyFailed: "Copy failed, please copy manually",
    noAudioToShare: "No audio file available to share",
    shareTitle: "AISTONE Voice Synthesis",
    shareText: "I generated an AI voice using AISTONE, come and listen!",
    pageLinkCopied: "Page link copied to clipboard",
    noAudioToSave: "No audio file available to save",
    pleaseLoginToSave: "Please login first to save audio",
    saveFeatureComingSoon: "Audio save feature is under development, stay tuned!",
    audioSaveFailed: "Audio save failed",

    // 图像生成页面专用翻译
    imageGeneratorTitle: "AI Image Generator",
    imageGeneratorSubtitle: "Transform text into stunning AI images",
    imageGeneratorSlogan: "Unleash creativity, let AI create visual wonders for you",
    breadcrumbImageGenerator: "Image Generation",
    preparingContent: "Preparing content...",
    generatingContent: "Generating content, please wait...",

    // Modal content
    aboutModal: {
      title: "About AISTONE",
      content:
        "AISTONE is an intelligent content creation platform powered by Pollinations.AI technology, integrating text-to-image and text-to-speech capabilities, dedicated to providing users with efficient, convenient, and free AI content creation experience.<br><br>Our platform supports various creative functions including text-to-image generation and text-to-speech synthesis. Whether you're a designer, content creator, or casual user, simply input a description to generate high-quality visual content or audio content with one click. The platform supports Chinese and English input with built-in intelligent optimization and multiple generation parameters to meet diverse creative needs.<br><br>Platform Features:<br>• 100% free to use, no registration required, no API keys needed, protecting user privacy<br>• Supports Chinese and English input with built-in intelligent optimization<br>• Multiple adjustable generation parameters to meet diverse creative needs<br>• Clean and friendly interface, compatible with multiple devices<br>• Cloud computing power support, ensuring generation speed and quality<br><br>This project is based on advanced AI models combined with cloud computing power, ensuring generation speed and quality. We believe AI technology should benefit everyone, which is why all features are permanently free and open, helping every user unleash their creative inspiration and realize unlimited possibilities from text to visual and from text to speech.",
    },
    contactModal: {
      title: "Contact Us",
      content:
        'If you have any questions or suggestions while using AISTONE, feel free to contact us!<br><br>We are committed to providing the best service experience for our users, whether it\'s technical issues, feature suggestions, or business consultation. We will handle your inquiries seriously and respond promptly.<br><br>Contact Information:<br>• Email: <a href="mailto:support@aistone.cfd">support@aistone.cfd</a><br>• Official Website: <a href="https://aistone.cfd" target="_blank">https://aistone.cfd</a><br>• Technical Support: 24/7 Online Support<br><br>Service Scope:<br>• <b>Product Feedback & Suggestions:</b> We highly value your experience and opinions, any feature suggestions or improvement ideas are welcome<br>• <b>Technical Support:</b> If you encounter technical issues or usage obstacles, please describe your problem in detail, and we will assist you as soon as possible<br>• <b>Business Cooperation:</b> If you have business cooperation needs, please contact us through email<br>• <b>Media Interview:</b> If media friends need to interview or report, please make an appointment in advance<br><br>We will reply to your message within 1-2 business days. Thank you for your attention and support!',
    },
    servicesModal: {
      title: "Our Services",
      content:
        '<ul style="margin: 18px 0 18px 0; padding-left: 1.2em; line-height: 2; color: #AAB4D4;"><li><b>AI Image Generation:</b> Input description text to intelligently generate high-quality, multi-style images, supporting various resolutions and aspect ratios.</li><li><b>AI Audio Generation:</b> Input text to generate natural and fluent audio with one click, suitable for dubbing, broadcasting, and other scenarios.</li><li><b>Smart Prompt Optimization:</b> Built-in AI optimization and translation features, automatically converting your descriptions into high-quality English prompts to improve generation results.</li><li><b>Multi-language Support:</b> Supports Chinese and English interfaces to meet global user needs.</li><li><b>Permanently Free:</b> All features are permanently free for users, no registration required, no usage limits.</li></ul><div style="margin-top: 12px; color: #AAB4D4;">For more service details, please contact us through "Contact Us".</div>',
    },
    heroTitle: "AISTONE - Free AI Image Generation & Audio Synthesis Platform",
    heroSubtitle: "Image · Audio · Unlimited Free Generation",
    heroSlogan: "AI-Driven · One-Click Generation · Unleash Your Creativity!",
    faqTitle: "Frequently Asked Questions",
    faqQ1: "Is AISTONE permanently free?",
    faqA1:
      "Yes, all platform features are permanently free, no registration required, no usage limits.",
    faqQ2: "Do I need to log in to use the platform?",
    faqA2: "No login required, just input your description to generate images or audio.",
    faqQ3: "What input languages are supported?",
    faqA3: "Supports Chinese and English input, interface can be switched.",
    faqQ4: "Who owns the copyright of generated content?",
    faqA4: "AI-generated content belongs to the user and can be used freely.",
    faqQ5: "How can I provide feedback or suggestions?",
    faqA5:
      "You can contact us through the contact information at the bottom of the page or email support@aistone.cfd.",
    aboutModalTitle: "About AISTONE",
    aboutModalContent:
      "AISTONE is an intelligent content creation platform powered by Pollinations.AI technology, integrating text-to-image and text-to-speech capabilities, dedicated to providing users with efficient, convenient, and free AI content creation experience.<br><br>Our platform supports various creative functions including text-to-image generation and text-to-speech synthesis. Whether you're a designer, content creator, or casual user, simply input a description to generate high-quality visual content or audio content with one click. The platform supports Chinese and English input with built-in intelligent optimization and multiple generation parameters to meet diverse creative needs.<br><br>Platform Features:<br>• 100% free to use, no registration required, no API keys needed, protecting user privacy<br>• Supports Chinese and English input with built-in intelligent optimization<br>• Multiple adjustable generation parameters to meet diverse creative needs<br>• Clean and friendly interface, compatible with multiple devices<br>• Cloud computing power support, ensuring generation speed and quality<br><br>This project is based on advanced AI models combined with cloud computing power, ensuring generation speed and quality. We believe AI technology should benefit everyone, which is why all features are permanently free and open, helping every user unleash their creative inspiration and realize unlimited possibilities from text to visual and from text to speech.",
    // Contact Page
    contactModalTitle: "Contact Us",
    contactIntro: "If you have any questions or suggestions while using AISTONE, feel free to contact us! We are committed to providing the best service experience.",
    contactEmailTitle: "Email Contact",
    contactEmailDesc: "We will reply within 1-2 business days",
    contactFeedbackTitle: "Online Feedback",
    contactFeedbackLink: "Submit Feedback Form",
    contactFeedbackDesc: "Quickly submit your questions or suggestions",
    contactSocialTitle: "Social Media",
    contactSocialDesc: "Follow us for the latest updates",
    contactServicesTitle: "Service Scope",
    contactServiceFeedbackTitle: "💡 Product Feedback & Suggestions",
    contactServiceFeedbackDesc: "We highly value your experience and opinions, any feature suggestions or improvement ideas are welcome",
    contactServiceTechTitle: "🔧 Technical Support",
    contactServiceTechDesc: "If you encounter technical issues or usage obstacles, please describe your problem in detail, and we will assist you as soon as possible",
    contactServiceBusinessTitle: "🤝 Business Cooperation",
    contactServiceBusinessDesc: "If you have business cooperation needs, please contact us through email",
    contactServiceMediaTitle: "📰 Media Interview",
    contactServiceMediaDesc: "If media friends need to interview or report, please make an appointment in advance",
    contactResponseTitle: "Quick Response Commitment",
    contactResponseDesc: "We commit to replying to your message within 1-2 business days. Thank you for your attention and support!",
    // Legacy
    contactModalContent:
      'If you have any questions or suggestions while using AISTONE, feel free to contact us!<br><br>We are committed to providing the best service experience for our users, whether it\'s technical issues, feature suggestions, or business consultation. We will handle your inquiries seriously and respond promptly.<br><br>Contact Information:<br>• Email: <a href="mailto:support@aistone.cfd">support@aistone.cfd</a><br>• Official Website: <a href="https://aistone.cfd" target="_blank">https://aistone.cfd</a><br>• Technical Support: 24/7 Online Support<br><br>Service Scope:<br>• <b>Product Feedback & Suggestions:</b> We highly value your experience and opinions, any feature suggestions or improvement ideas are welcome<br>• <b>Technical Support:</b> If you encounter technical issues or usage obstacles, please describe your problem in detail, and we will assist you as soon as possible<br>• <b>Business Cooperation:</b> If you have business cooperation needs, please contact us through email<br>• <b>Media Interview:</b> If media friends need to interview or report, please make an appointment in advance<br><br>We will reply to your message within 1-2 business days. Thank you for your attention and support!',
    servicesModalTitle: "Our Services",
    servicesModalContent:
      '<ul style="margin: 18px 0 18px 0; padding-left: 1.2em; line-height: 2; color: #AAB4D4;"><li><b>AI Image Generation:</b> Input description text to intelligently generate high-quality, multi-style images, supporting various resolutions and aspect ratios.</li><li><b>AI Audio Generation:</b> Input text to generate natural and fluent audio with one click, suitable for dubbing, broadcasting, and other scenarios.</li><li><b>Smart Prompt Optimization:</b> Built-in AI optimization and translation features, automatically converting your descriptions into high-quality English prompts to improve generation results.</li><li><b>Multi-language Support:</b> Supports Chinese and English interfaces to meet global user needs.</li><li><b>Permanently Free:</b> All features are permanently free for users, no registration required, no usage limits.</li></ul><div style="margin-top: 12px; color: #AAB4D4;">For more service details, please contact us through "Contact Us".</div>',
    tagFree: "100% Free",
    tagUnlimited: "Unlimited Generation",
    tagNoLogin: "No Login Required",
    faqTip: "For more questions, please contact us through the bottom of the page",
    faqQ6: "What if generation is slow or fails?",
    faqA6:
      "It may be slower during peak hours, please be patient or try again later. If it continues to fail, please contact customer service.",
    faqQ7: "Does the platform have an API?",
    faqA7:
      "API calls are supported, see development documentation or contact customer service for API access.",
    faqQ8: "How is user privacy protected?",
    faqA8:
      "The platform does not store user input and generated content, all data is processed in real-time to ensure privacy and security.",
    faqQ9: "Will there be charges or limits in the future?",
    faqA9:
      "Currently permanently free with no usage limits. Any changes will be announced in advance.",
    faqQ10: "How to join the community or get latest updates?",
    faqA10:
      "Follow the official website, public account, or contact customer service for community QR code and latest news.",
    heroIntro:
      "AISTONE is an intelligent creation platform integrating AI image generation and audio synthesis, supporting Chinese and English input, permanently free, no registration required. Whether you are a designer, content creator, or regular user, just input a description to generate high-quality images and natural audio with one click, unleashing unlimited creativity. The platform focuses on privacy protection, all content is generated in real-time without storage, helping every user create efficiently and share freely.",
    testimonialsTitle: "User Reviews & Real Cases",
    testimonialName1: "Sarah Chen",
    testimonialRole1: "Illustrator",
    testimonialContent1:
      '"The platform generates beautiful illustrations, greatly improving my design efficiency!"',
    testimonialName2: "Alex Wang",
    testimonialRole2: "Short Video Creator",
    testimonialContent2:
      '"The AI audio is natural and fluent, directly used for my short video dubbing."',
    testimonialName3: "Li Ming",
    testimonialRole3: "Independent Developer",
    testimonialContent3:
      '"One-click generation of images and audio, creative efficiency doubled, highly recommended!"',
    testimonialName4: "Emily Zhang",
    testimonialRole4: "Product Manager",
    testimonialContent4:
      '"The AI content generation tool greatly improves the team\'s creative output efficiency."',
    testimonialName5: "Tom Lee",
    testimonialRole5: "Content Creator",
    testimonialContent5: '"Fast generation speed, high content quality, worth recommending!"',
    imageInfoSize: "Size",
    imageInfoFileSize: "File Size",
    imageInfoCount: "Total {count} images generated, click image to enlarge",
    pixels: "pixels",
    userMetaDescription:
      "AISTONE User Center - Manage your HD images and account info after login.",
    loginTitle: "Sign In",
    registerTitle: "Sign Up",
    emailLabel: "Email",
    passwordLabel: "Password",
    confirmPasswordLabel: "Confirm Password",
    login: "Login",
    register: "Register",
    noAccount: "Don't have an account?",
    registerNow: "Register Now",
    haveAccount: "Already have an account?",
    loginNow: "Sign in now",
    // User center page
    userAccountTitle: "Account Info",
    userGreeting: "Hello, {name}",
    userUsername: "Username",
    userEmail: "Email",
    userUpdateProfile: "Update Profile",
    userChangePasswordTitle: "Change Password",
    userNewPassword: "New Password",
    userConfirmPassword: "Confirm New Password",
    userSave: "Save",
    userNotLoggedIn: "Please log in to use the user center features",
    userLoginNow: "Log in now",
    userFeatureComing: "Feature under development",
    userUpdateSuccess: "Updated successfully",
    userPasswordMismatch: "Passwords do not match",

    // Top user area
    userCenter: "User Center",
    logout: "Logout",
    userCenterDevTip: "User center is under development...",

    // HD images manager
    hdTitle: "📸 Today's HD Images",
    hdRefresh: "Refresh",
    hdGeneratedLabel: "Generated:",
    hdRemainingTimeLabel: "Time Left:",
    hdSaving: "Saving HD image...",
    hdEmptyTitle: "No saved images yet",
    hdEmptyDesc: "Generated images will appear here, up to 3 saved per day",
    hdPreviewTitle: "HD Image Preview",
    hdDownloadHD: "Download HD",
    hdClickToView: "Click to view HD image",
    hdLabelSize: "Size:",
    hdLabelModel: "Model:",
    hdLabelSeed: "Seed:",
    hdLabelTime: "Time:",
    delete: "Delete",

    // AI Guide Page
    aiGuideTitle: "AI Image Generation Guide",
    aiGuideMainTitle: "Complete AI Image Generation Guide",
    aiGuideSubtitle: "From basic theory to practical skills, become an AI art creation expert",
    aiGuideAuthor: "AISTONE Technical Team",
    aiGuideDate: "September 9, 2025",
    aiGuideReadingTime: "About 10 minutes read",

    // AI Guide Table of Contents
    aiGuideTocTitle: "📋 Table of Contents",
    aiGuideToc1: "1. AI Image Generation Technology Overview",
    aiGuideToc2: "2. Mainstream AI Models Deep Analysis",
    aiGuideToc3: "3. Prompt Engineering Practical Skills",
    aiGuideToc4: "4. High-Quality Image Generation Strategies",
    aiGuideToc5: "5. Common Issues and Solutions",
    aiGuideToc6: "6. Advanced Creation Techniques and Workflows",

    // AI Guide Chapter 1
    aiGuideChapter1Title: "🧠 1. AI Image Generation Technology Overview",
    aiGuideWhatIsTitle: "What is AI Image Generation?",
    aiGuideWhatIsDesc:
      "AI image generation is a revolutionary technology that uses deep learning to automatically create images from text descriptions. This technology is trained on large-scale image-text datasets, enabling it to understand natural language descriptions and convert them into visual content.",
    aiGuideTechHistoryTitle: "🔥 Technology Development History",

    // Prompt Engineering Page（英文）
    promptEngineeringTitle: "Prompt Engineering Tutorial",
    promptEngineeringMainTitle: "Professional Prompt Engineering Tutorial",
    promptEngineeringSubtitle:
      "Master the core skills of AI image generation - from basic syntax to advanced strategies",
    // Prompt overview (English)
    promptOverviewTitle: "🎯 Course Overview",
    promptBasicSyntaxTitle: "🚀 Basic Syntax",
    promptBasicSyntaxDesc: "Master the basic structure and organization of prompts",
    promptWeightControlTitle: "⚡ Weight Control",
    promptWeightControlDesc: "Learn to precisely control the importance of each element",
    promptNegativeTitle: "🚫 Negative Prompts",
    promptNegativeDesc: "Exclude unwanted elements to improve generation quality",
    promptStyleTitle: "🎨 Style Fusion",
    promptStyleDesc: "Create unique artistic styles and visual effects",
    promptEngineeringAuthor: "AISTONE Expert Team",
    promptEngineeringDate: "September 9, 2025",
    promptEngineeringReadingTime: "About 12 minutes read",

    // About Page
    aboutHeroTitle: "AISTONE - Redefining Content Creation",
    aboutHeroSubtitle:
      "Professional content creation platform based on the latest AI technology, providing efficient and intelligent image generation and speech synthesis solutions for creators and enterprises",

    // Services page related content recommendations
    relatedContentTitle: "🚀 Try Now",
    relatedImageGen: "🎨 AI Image Generation",
    tryNow: "Try Now →",
    relatedAIGuide: "🧠 AI Guide",
    relatedAIGuideDesc: "Learn AI voice tech principles and practices",
    learnMore: "Learn More →",
    relatedTutorial: "📖 Tutorial",
    startLearning: "Start Learning →",
    relatedImageGenTitle: "🎨 AI Image Generation",
    relatedImageGenDesc: "Experience our core service, transform ideas into stunning visuals",
    relatedVoiceGenTitle: "🎵 AI Voice Synthesis",
    relatedVoiceGenDesc: "Convert text to natural speech, completely free to use",
    relatedTutorialTitle: "📖 Quick Start",
    relatedTutorialDesc: "Learn how to use all features for the best experience",
    relatedAboutTitle: "ℹ️ Learn Technology",
    relatedAboutDesc: "Discover our AI technology and platform vision in depth",
  },
  
  // ============================================
  // 🇨🇳 中文翻译 (Chinese Translations)
  // ============================================
  zh: {
    // ========== 🏠 首页与通用 (Homepage & Common) ==========
    
    // 标题和描述
    title: "AISTONE",
    subtitle: "图片·语音·无限免费生成",

    // 输入区域
    inputTitle: "描述文本",
    examplesTitle: "💡 点击示例快速填充：",
    inputPlaceholder: "请输入描述文本，例如：一只可爱的猫咪在草地上玩耍...",
    generateButton: "开始生成",
    quickFillLabel: "快速填充示例：",
    smartOptimizeTip: "✨ 智能优化：自动将描述翻译并优化为高质量英文提示词，提升出图效果",
    negativePromptLabel: "负面提示词：",
    negativePromptPlaceholder: "输入不想要的元素，用逗号分隔",

    // 生成类型
    generationType: "生成类型",
    typeImage: "生成图片",
    typeAudio: "生成语音",
    generationResult: "生成结果",

    // ========== 🎨 图片生成 (Image Generation) ==========

    // 图片选项
    imageOptions: "图片选项",
    aiModel: "AI模型",
    aiModelFlux: "FLUX Schnell - 免费高质量",
    aiModelZimage: "Z-Image Turbo - 快速2倍放大",
    aiModelTurbo: "SDXL Turbo - 单步快速生成",
    aiModelKontext: "FLUX Kontext - 图像编辑",
    aiModelKlein: "FLUX.2 Klein 4B - 快速编辑",
    aiModelKleinLarge: "FLUX.2 Klein 9B - 高质量编辑",
    aiModelGptimage: "GPT Image Mini - OpenAI图像",
    aiModelGptimageLarge: "GPT Image 1.5 - 高级图像",
    aiModelNanobanana: "NanoBanana - Gemini图像",
    aiModelNanobananaPro: "NanoBanana Pro - 4K思考",
    aiModelSeedream: "Seedream 4.0 - 字节跳动",
    aiModelSeedreamPro: "Seedream 4.5 Pro - 4K多图",
    modelGroupFree: "⚡ 快速免费",
    modelGroupFlux: "🎨 FLUX系列",
    modelGroupGPT: "🤖 GPT图像",
    modelGroupPremium: "✨ 高级模型",
    modelHint: "💡 FLUX 免费无限使用，其他模型消耗 Pollen 积分",
    aspectRatio: "宽高比例",
    aspectRatioSquare: "正方形 (1:1 - 1024x1024)",
    aspectRatioLandscape: "横向 (16:9 - 1280x720)",
    aspectRatioPortrait: "竖向 (9:16 - 720x1280)",
    aspectRatioStandard: "标准 (4:3 - 1024x768)",
    aspectRatioStandardVertical: "标准竖向 (3:4 - 768x1024)",
    aspectRatioCustom: "自定义",
    width: "宽度",
    height: "高度",
    noLogo: "去除水印",
    numImages: "生成数量",
    oneImage: "1张图片",
    twoImages: "2张图片",
    fourImages: "4张图片",
    aspectRatioLandscape2K: "横向2K (16:9 - 2560x1440)",
    aspectRatioPortrait2K: "竖向2K (9:16 - 1440x2560)",
    aspectRatioLandscape4K: "横向4K (16:9 - 3840x2160)",
    aspectRatioPortrait4K: "竖向4K (9:16 - 2160x3840)",

    // ========== 🎵 语音生成 (Voice Generation) ==========

    // 音频选项
    audioOptions: "音频选项",
    voiceSelection: "语音选择",
    voiceNova: "Nova (女声-清晰)",
    voiceEcho: "Echo (男声-深沉)",
    voiceFable: "Fable (男声-年轻)",
    voiceOnyx: "Onyx (男声-磁性)",
    voiceShimmer: "Shimmer (女声-甜美)",
    voiceAlloy: "Alloy (中性-温和)",
    voiceCoral: "Coral (女声-温暖)",
    voiceVerse: "Verse (中性-优雅)",
    voiceBallad: "Ballad (中性-抒情)",
    voiceAsh: "Ash (中性-沉稳)",
    voiceSage: "Sage (中性-智慧)",
    audioModel: "音频模型",
    audioModelOpenai: "OpenAI Audio - 最新语音合成",

    // 快捷操作
    clearButton: "清空",
    optimizeButton: "优化",
    translateButton: "翻译",
    randomButton: "随机",

    // 状态提示
    loading: "正在处理中，请稍候...",
    imageGenerating: "正在生成图片，请稍候...",
    audioGenerating: "正在生成语音，请稍候...",
    error: "发生错误",
    pleaseInput: "请输入描述文本后再生成。",
    optimizationSuccess: "✨ 提示词优化完成！",
    optimizationFailed: "优化失败，请稍后重试",
    pleaseInputFirst: "请先输入文本内容",
    generationComplete: "生成完成！",
    generating: "正在生成中...",
    imageGeneratedDone: "🎉 图片生成完成！",
    audioGeneratedDone: "🎉 语音生成完成！",
    preparingContent: "正在准备内容...",
    generatingContent: "正在生成内容，请稍候...",
    generatedAudio: "生成的音频：",
    downloadAudioFile: "下载音频文件",
    audioUnsupported: "您的浏览器不支持音频播放。",
    noValidImageData: "未收到有效的图片数据。",
    noImagesLoaded: "未能成功加载任何图片。",
    imageLoadFailedRetry: "图片加载失败，请重试",
    invalidAudioUrl: "收到的音频数据链接不正确。",
    downloadAll: "下载全部",
    gridView: "网格查看",
    audioUnsupported: "您的浏览器不支持音频播放。",

    // ========== 🔐 认证登录 (Authentication) ==========

    // 认证相关
    loginTitle: "用户登录",
    registerTitle: "用户注册",
    login: "登录",
    register: "注册",
    logout: "登出",
    emailLabel: "邮箱地址",
    passwordLabel: "密码",
    userUsername: "用户名",
    confirmPasswordLabel: "确认密码",
    noAccount: "还没有账号？",
    registerNow: "立即注册",
    haveAccount: "已有账号？",
    loginNow: "立即登录",

    // 认证消息
    registerSuccess: "注册成功！",
    registerFailed: "注册失败",
    loginSuccess: "登录成功！",
    loginFailed: "登录失败",
    logoutSuccess: "已成功登出",
    networkError: "网络错误，请稍后重试",
    processing: "处理中...",
    submit: "提交",

    // 表单验证
    passwordMinLength: "至少6位",
    passwordMismatch: "两次输入的密码不一致",
    fillEmailPassword: "请填写邮箱与至少6位密码",
    fillUserInfo: "请输入用户名与邮箱",
    enterEmail: "请输入邮箱地址",
    passwordMinSix: "密码长度至少6位",
    invalidResetLink: "重置链接无效",

    // Google登录和忘记密码
    or: "或",
    googleLogin: "使用Google登录",
    loginOptional: "登录是可选的—所有功能无需注册即可使用",
    loginWithGoogle: "使用Google登录",
    forgotPassword: "忘记密码？",
    forgotPasswordTitle: "忘记密码",
    forgotPasswordTip: "我们将向您的邮箱发送重置密码的链接",
    sendResetLink: "发送重置链接",
    backToLogin: "返回登录",
    resetPasswordTitle: "重置密码",
    newPasswordLabel: "新密码",
    resetPassword: "重置密码",

    // 示例提示
    imageHint: "💡 图片生成支持多种尺寸和数量选择",
    audioHint: "🎵 语音生成支持播放和下载功能",

    // Welcome to AISTONE 部分
    welcomeToAistone: "欢迎使用 AISTONE",
    aistoneIntro:
      "AISTONE 是您进行AI图片生成与语音合成的首选平台。作为领先的AI内容创作平台，AISTONE 结合前沿技术与用户友好设计，为您提供卓越的创作体验。",
    aistoneImageGenerator: "AISTONE AI 图片生成器",
    aistoneImageDesc:
      "体验 AISTONE 先进AI模型的强大功能，包括Kontext、FLUX和Turbo，为您创造令人惊叹的视觉作品。",
    aistoneVoiceSynthesis: "AISTONE 语音合成",
    aistoneVoiceDesc: "使用 AISTONE 最先进的语音合成技术，将文本转换为自然语音。",
    aistoneFreePlatform: "AISTONE 免费平台",
    aistoneFreeDesc: "享受 AISTONE 完整功能集，完全免费 - 无需注册，无限制，无隐藏费用。",

    // 首页案例与流程
    homeUseCaseTitle: "真实案例：从提示词到交付成品",
    homeUseCaseIntro:
      "以下案例演示品牌营销团队如何在 5 分钟内完成新品发布海报。我们保留完整提示词、参数与迭代记录，帮助你复现专业质量。",
    homeUseCasePromptTitle: "核心提示词",
    homeUseCasePromptDesc:
      "为了凸显耳机的质感与科技感，提示词重点描述光线、镜头和场景氛围。若需要中文协作，可在前缀补充中文说明。",
    homeUseCasePromptModel: "模型：FLUX 高质量模式",
    homeUseCasePromptSize: "分辨率：1024 × 1365（竖版海报）",
    homeUseCasePromptCount: "生成数量：2 张，便于对比选择",
    homeUseCasePromptNegative: "负面提示词：blurry, low contrast, watermark, extra hands",
    homeUseCaseOutcomeTitle: "交付成果概览",
    homeUseCaseOutcomeDesc1:
      "第一轮生成中，图像1符合预期但光线略过曝；图像2层次更佳，因此放大至 2048 × 2730 作为终稿。",
    homeUseCaseOutcomeDesc2:
      "终稿用于官网 Banner，并带来 23% 的社交广告点击率提升。无需拍摄与额外修图，直接上线。",
    homeUseCaseReuseTitle: "复用建议：",
    homeUseCaseReuse1: "替换产品名词与材质描述，即可快速适配不同品类。",
    homeUseCaseReuse2: "若制作横版视频封面，将宽高比改为 16:9，并保持光线描述一致。",
    homeUseCaseReuse3: "结合语音合成功能，为海报撰写 30 秒配音脚本，输出完整素材包。",
    homeWorkflowTitle: "四步流程，稳定产出",
    homeWorkflowIntro:
      "基于内部最佳实践，我们将常见 AI 视觉任务拆分为四个步骤，遵循流程即可减少试错和返工。",
    homeWorkflowStep1Label: "Step 1",
    homeWorkflowStep1Title: "梳理需求与素材",
    homeWorkflowStep1Desc:
      "明确投放渠道、画面比例、品牌关键词，并收集参考素材。将要点记录在提示词备注中，方便团队共享。",
    homeWorkflowStep2Label: "Step 2",
    homeWorkflowStep2Title: "选择模型与参数",
    homeWorkflowStep2Desc:
      "依据目标选择 FLUX（高画质）、Turbo（快速预览）或 Kontext（图生图），同时设置宽高比、生成数量和负面提示词。",
    homeWorkflowStep3Label: "Step 3",
    homeWorkflowStep3Title: "迭代提示词",
    homeWorkflowStep3Desc:
      "先生成草稿观察构图与光线，再针对问题调整关键词。利用提示词历史记录对比版本，快速锁定最佳方案。",
    homeWorkflowStep4Label: "Step 4",
    homeWorkflowStep4Title: "导出并联动语音",
    homeWorkflowStep4Desc:
      "放大并导出满意作品（PNG/JPG），若需配音可切换至语音页面，用同一脚本生成自然口播。",
    homeQuickFaqTitle: "常见问题速览",
    homeQuickFaqIntro: "以下三问来自投放团队的高频反馈，更多细节请前往完整 FAQ 查看。",
    homeQuickFaqQ1: "AISTONE 是否完全免费？",
    homeQuickFaqA1:
      "核心功能（含高清导出与语音合成）对所有访客免费开放。企业私有化、品牌定制与高并发 API 需单独收费。",
    homeQuickFaqQ2: "生成的素材可以商用吗？",
    homeQuickFaqA2:
      "可以。您拥有生成素材的商用权，可用于广告投放。请遵守平台对 AI 生成内容的披露规则。",
    homeQuickFaqQ3: "如何提高提示词准确度？",
    homeQuickFaqA3:
      "明确主体、光线、镜头与风格关键词，并善用负面提示词排除不需要的元素。可参考上方案例逐项拆分描述。",

    navUserPlaceholder: "用户",
    
    // ========== 📄 About Page (Customer-Facing) ==========
    aboutPageTitle: "关于 AISTONE",
    aboutPageSubtitle: "让AI创作触手可及，为每个人赋能创意表达",
    aboutMissionTitle: "我们的使命",
    aboutMissionDesc: "AISTONE致力于让每个人都能轻松使用AI技术进行创作。我们相信，创意不应该被技术门槛所限制，每个人都应该拥有将想法变为现实的能力。",
    aboutCoreValuesTitle: "核心价值",
    aboutValueCreativityTitle: "创意无限",
    aboutValueCreativityDesc: "支持多种AI模型和风格，让您的创意想法以最佳方式呈现",
    aboutValueFreeTitle: "永久免费",
    aboutValueFreeDesc: "所有核心功能完全免费，无需注册，无使用限制，让AI创作真正普惠大众",
    aboutValuePrivacyTitle: "隐私安全",
    aboutValuePrivacyDesc: "您的创作内容不会被存储，所有处理都在云端实时完成，保护您的隐私",
    aboutValueSpeedTitle: "快速高效",
    aboutValueSpeedDesc: "基于全球CDN部署，毫秒级响应，让您的创作灵感不被等待打断",
    aboutFeaturesTitle: "产品特色",
    aboutFeatureImageTitle: "🎨 AI图片生成",
    aboutFeatureImagePoint1: "✓ 支持FLUX、Turbo等多种AI模型",
    aboutFeatureImagePoint2: "✓ 多种尺寸和比例选择",
    aboutFeatureImagePoint3: "✓ 智能提示词优化",
    aboutFeatureImagePoint4: "✓ 高清图片输出",
    aboutFeatureVoiceTitle: "🎵 AI语音合成",
    aboutFeatureVoicePoint1: "✓ 6种专业级语音选择",
    aboutFeatureVoicePoint2: "✓ 自然流畅的语音效果",
    aboutFeatureVoicePoint3: "✓ 支持长文本合成",
    aboutFeatureVoicePoint4: "✓ 一键下载音频文件",
    aboutWhyChooseTitle: "为什么选择 AISTONE",
    aboutWhyPoint1Title: "用户优先",
    aboutWhyPoint1Desc: "简单易用的界面，无需专业知识即可上手",
    aboutWhyPoint2Title: "持续创新",
    aboutWhyPoint2Desc: "不断引入最新AI技术，保持行业领先",
    aboutWhyPoint3Title: "用心服务",
    aboutWhyPoint3Desc: "快速响应用户反馈，持续优化产品体验",
    aboutTeamTitle: "关于团队",
    aboutTeamDesc: "AISTONE由一支充满激情的技术团队打造，我们来自不同的背景，但都怀揣着让AI技术普惠大众的共同愿景。我们相信技术应该服务于人，让每个人都能享受AI带来的便利。",
    aboutContactUsTitle: "联系我们",
    aboutContactDesc: "如果您有任何问题、建议或合作意向，欢迎随时与我们联系。我们重视每一位用户的反馈，并将在1个工作日内回复您。",
    aboutContactEmailTitle: "邮箱",
    aboutContactFeedbackTitle: "在线反馈",
    aboutContactFeedbackLink: "提交反馈",
    aboutContactSocialTitle: "社交媒体",
    
    // Legacy About Keys (kept for compatibility)
    aboutHeroTitleNew: "走进 AISTONE",
    aboutHeroIntroNew:
      "我们是一个远程协作的小团队，基于 Cloudflare Workers 打造免注册的 AI 创作工作台，并将每次迭代记录在公开仓库中。",
    aboutHeroApiPrefix: "API 基址：",
    aboutHeroApiSuffix: "(Cloudflare Workers)",
    aboutHeroRepoPrefix: "源码与更新日志：",
    aboutHeroReportPrefix: "季度进展摘要：",
    aboutGuidingTitle: "运作原则",
    aboutGuidingOpenTitle: "开放手册",
    aboutGuidingOpenDesc: "部署步骤、监控脚本与路线图里程碑全部存放在 docs/ 目录，便于外部审阅。",
    aboutGuidingDataTitle: "数据最小化",
    aboutGuidingDataDesc: "提示词全程内存处理，仅在用户明确保存时才缓存高清资源。",
    aboutGuidingTransparencyTitle: "透明汇报",
    aboutGuidingTransparencyDesc:
      "功能上线、事故记录与路线图调整都会汇总在 Development Progress 文档中。",
    aboutAssemblyTitle: "平台如何构建",
    aboutImagePipelineTitle: "图像流水线",
    aboutImagePipelinePoint1: "Cloudflare Workers 校验并限流提示词请求。",
    aboutImagePipelinePoint2: "调用 Pollinations 的 FLUX、Turbo 与 Kontext 模型生成图像。",
    aboutImagePipelinePoint3: "可选高清放大临时存放在 Cloudflare R2，下载后即清理。",
    aboutVoicePipelineTitle: "语音流水线",
    aboutVoicePipelinePoint1: "前端完成文本规范化后再调用 OpenAI Audio TTS。",
    aboutVoicePipelinePoint2: "返回 WAV 音频缓存于浏览器，不在服务器落地。",
    aboutVoicePipelinePoint3: "内容审核策略与 OpenAI 规则保持一致，过滤风险提示词。",
    aboutOpsTitle: "运维概览",
    aboutOpsHostingTitle: "托管",
    aboutOpsHostingDesc: "静态前端部署在 Cloudflare Pages，Workers 覆盖香港与新加坡区域。",
    aboutOpsMonitoringTitle: "监控",
    aboutOpsMonitoringDesc: "docs/MONITORING_GUIDE.md 定义的合成检测每小时访问图像与语音接口。",
    aboutOpsSecurityTitle: "安全",
    aboutOpsSecurityDesc: "全站 HTTPS，可选 JWT 登录，仅保留 AdSense 与 GA 两项统计脚本。",
    aboutDocsTitle: "对外公开的文档",
    aboutDocsStatusTitle: "项目状态报告",
    aboutDocsStatusDescPrefix: "每季度的流量、功能与待办摘要发布于 ",
    aboutDocsStatusDescSuffix: "。",
    aboutDocsProgressTitle: "开发进度日志",
    aboutDocsProgressDescPrefix: "逐周部署与修复记录保存在 ",
    aboutDocsProgressDescSuffix: "。",
    aboutDocsMonitoringTitle: "监控手册",
    aboutDocsMonitoringDescPrefix: "事故响应流程与延迟预算详见 ",
    aboutDocsMonitoringDescSuffix: "。",
    aboutTeamTitleNew: "项目维护团队",
    aboutTeamMaintainersTitle: "核心维护者",
    aboutTeamMaintainersDesc:
      "团队分布于新加坡与深圳，按周轮值值班，并通过公开 Issue 追踪重要更新。",
    aboutTeamFeedbackTitle: "反馈机制",
    aboutTeamFeedbackDesc:
      "站内反馈与邮件将在 1 个工作日内处理，完成后会同步到 Development Progress。",
    aboutContactTitle: "联系与验证渠道",
    aboutContactEmailTitle: "邮箱",
    aboutContactEmailDesc: "工作日平均响应时间 < 1 天。",
    aboutContactGithubTitle: "GitHub",
    aboutContactGithubDesc: "路线图与任务追踪统一在仓库 Issue 中维护。",
    aboutContactTwitterTitle: "Twitter / X",
    aboutContactTwitterDesc: "停机通知与版本亮点会第一时间发布。",

    // 博客 AI 指南（中文）
    blogAiGuideTocTitle: "目录",
    blogAiGuideToc1: "1. 将业务 Brief 拆解为 AI 需求",
    blogAiGuideToc2: "2. 构建经得起复审的提示词",
    blogAiGuideToc3: "3. 选择合适的模型、比例与输出参数",
    blogAiGuideToc4: "4. 以量化检查点迭代",
    blogAiGuideToc5: "5. 交付前的最终检查清单",
    blogAiGuideToc6: "6. 团队协作节奏",
    blogAiGuideSection1Title: "1. 将业务 Brief 拆解为 AI 需求",
    blogAiGuideSection1Intro:
      "大多数项目在提示词落笔前就埋下失败伏笔。先花 5 分钟把营销 Brief 拆解成结构化要点：投放渠道、目标、品牌限定与必须呈现的叙事元素。下表是我们在每场工作坊都会使用的模板。",
    blogAiGuideTableHeaderQuestion: "问题",
    blogAiGuideTableHeaderCapture: "需要记录的要素",
    blogAiGuideTableHeaderExample: "示例",
    blogAiGuideTableRowChannel: "渠道",
    blogAiGuideTableRowChannelCapture: "尺寸比例、素材格式、文件大小限制。",
    blogAiGuideTableRowChannelExample: "Instagram 竖版广告（1080×1350）。",
    blogAiGuideTableRowStory: "故事",
    blogAiGuideTableRowStoryCapture: "号召、情绪、产品核心卖点。",
    blogAiGuideTableRowStoryExample: "高端耳机悬浮在玻璃底座上，冷色霓虹灯。",
    blogAiGuideTableRowBrand: "品牌规范",
    blogAiGuideTableRowBrandCapture: "配色、字体提示、既有活动参考。",
    blogAiGuideTableRowBrandExample: "使用霓虹蓝，避免暖色，禁止衬线字体。",
    blogAiGuideTableRowMandatory: "必备元素",
    blogAiGuideTableRowMandatoryCapture: "必须出现的物件、道具或法律文案。",
    blogAiGuideTableRowMandatoryExample: "展示充电盒，并预留卖点文案空间。",
    blogAiGuideSection1Outro:
      "梳理完答案后，把它保存到 AISTONE 备注或共享文档，下一节的提示词蓝图就有了坚实依据。",
    blogAiGuideSection2Title: "2. 构建经得起复审的提示词",
    blogAiGuideSection2Intro:
      "提示词工程的核心不是堆砌华丽词汇，而是覆盖决策者的所有关注点。以下是五段式结构，可直接复制到 AISTONE 再按项目微调。",
    blogAiGuidePromptFormula: "[主体] + [场景与氛围] + [构图与镜头] + [材质细节] + [光线]",
    blogAiGuideSection2ExampleIntro: "以智能手表发布为例：",
    blogAiGuideSection2ExamplePrompt:
      '"Premium fitness smartwatch placed on mirrored podium, sunrise light streaming through minimalist studio, photographed on 50mm lens, focus on brushed aluminum texture, crisp product staging"',
    blogAiGuideSection2Negative:
      '为每组提示词准备负面词，避免常见瑕疵。可以从 <em>"blurry, watermark, distorted hands, text logo, grainy"</em> 这类泛用组合起步，再根据反馈扩充。',
    blogAiGuideSection2TipTitle: "审批协同小贴士：",
    blogAiGuideSection2TipDesc:
      "在流程中共享提示词蓝图，让市场负责人在首轮生成前就掌握预期，减少反复。",
    blogAiGuideSection3Title: "3. 选择合适的模型、比例与输出参数",
    blogAiGuideSection3Intro:
      "AISTONE 内置三种图像模型以及 OpenAI 语音，以下速查表帮助你快速决定使用场景。",
    blogAiGuideModelTableHeaderModel: "模型",
    blogAiGuideModelTableHeaderWhen: "适用场景",
    blogAiGuideModelTableHeaderSettings: "默认设置",
    blogAiGuideModelFlux: "FLUX",
    blogAiGuideModelFluxWhen: "主视觉、广告级别素材，需要极佳光影与质感。",
    blogAiGuideModelFluxSettings: "生成 2 张，挑选后放大至 2048px，比例遵循 Brief。",
    blogAiGuideModelTurbo: "Turbo",
    blogAiGuideModelTurboWhen: "头脑风暴、社媒快稿，速度优先。",
    blogAiGuideModelTurboSettings: "生成 4 张，768px 预览，确认方向后再切回 FLUX。",
    blogAiGuideModelKontext: "Kontext",
    blogAiGuideModelKontextWhen: "图生图、换色、保持多视角一致性。",
    blogAiGuideModelKontextSettings: "上传参考图、锁定构图，并微调色温 ±5 以控制色调。",
    blogAiGuideSection3Outro:
      "根据第一节的渠道清单设置尺寸与分辨率。AISTONE 会记住工作区的最新配置，便于团队保持一致。",
    blogAiGuideSection4Title: "4. 以量化检查点迭代",
    blogAiGuideSection4Intro: "把每轮生成当作设计评审，记录客观判断，清楚知道哪次实验推动了进展。",
    blogAiGuideSection4Step1:
      "<strong>第一轮——只看构图。</strong> 暂不纠结色彩，关注布局、层级与文案留白。",
    blogAiGuideSection4Step2:
      "<strong>第二轮——调整光线与材质。</strong> 修改形容词、镜头参数和负面词，直到质感自然。",
    blogAiGuideSection4Step3:
      "<strong>第三轮——品牌一致性。</strong> 使用配色控制，必要时在 Kontext 上传参考以匹配专色。",
    blogAiGuideSection4Outro:
      "把最终采用的提示词与 seed 记录到项目追踪表，既能培训新人，也能在品牌或法务追溯时提供依据。",
    blogAiGuideSection5Title: "5. 交付前的最终检查清单",
    blogAiGuideSection5Intro: "交付客户或投放平台前，依次通过以下检查，可避免临门一脚的返工。",
    blogAiGuideSection5Item1:
      "<strong>分辨率确认：</strong> 导出尺寸与渠道规范一致（例如高分广告 2048×2730）。",
    blogAiGuideSection5Item2:
      "<strong>细节巡检：</strong> 放大 200% 检查多余肢体、重复 Logo 或背景杂讯。",
    blogAiGuideSection5Item3:
      "<strong>文案安全区：</strong> 预留文案位置，必要时参考 AISTONE 指南。",
    blogAiGuideSection5Item4:
      "<strong>版本命名：</strong> 采用 `campaign_model_revision` 格式，方便 DAM 或归档。",
    blogAiGuideSection5Outro:
      '需要配音？前往 <a href="voice.html">语音合成工作室</a>，用同一份脚本生成自然口播。Nova 适合硬件产品，Fable 更贴近生活化场景。',
    blogAiGuideSection6Title: "6. 团队协作节奏",
    blogAiGuideSection6Intro: "高效团队会围绕 AI 生产建立轻量化的工作仪式，可参考以下节奏：",
    blogAiGuideSection6Card1Title: "每日站会",
    blogAiGuideSection6Card1Desc:
      'Designers share yesterday\'s prompts and results. Growth leads call out performance insights. Keeps everyone aligned on what "good" looks like.',
    blogAiGuideSection6Card2Title: "Weekly library update",
    blogAiGuideSection6Card2Desc:
      "Drop approved prompts, outputs, and usage notes into a shared knowledge base. Tag by campaign so future sprints can reference proven angles.",
    blogAiGuideSection6Card3Title: "Monthly retro",
    blogAiGuideSection6Card3Desc:
      'Compare campaign metrics against the creative choices made in prompts. Document learnings in your playbook to keep beating the "low quality" label.',
    blogAiGuideSection6Outro:
      'With consistent documentation, the "low value content" warning disappears: reviewers see clear expertise, effort, and tangible results from every asset you publish.',
    blogAiGuideDownload: "下载 PDF",
    blogAiGuideShare: "分享指南",
    blogAiGuideAuthor: "AISTONE 内容团队",
    blogAiGuideDate: "2025 年 4 月",

    // 提示词工程博客（中文）
    promptEngineeringAuthor: "AISTONE 内容团队",
    promptEngineeringDate: "2025 年 4 月",
    promptEngineeringOverviewTitle: "🎯 为什么这份手册值得阅读",
    promptEngineeringCard1Title: "🚀 基础语法",
    promptEngineeringCard1Desc: "让主体与修饰词有序排列，避免生成焦点丢失。",
    promptEngineeringCard2Title: "⚡ 权重控制",
    promptEngineeringCard2Desc: "通过权重语法平衡不同需求的优先级。",
    promptEngineeringCard3Title: "🚫 负面提示词",
    promptEngineeringCard3Desc: "用可复用的负面词过滤畸形肢体与不需要的风格。",
    promptEngineeringCard4Title: "🎨 风格融合",
    promptEngineeringCard4Desc: "混合多位艺术家或媒介，同时保持画面统一。",
    promptEngineeringSection1Heading1: "1. 以主体开头",
    promptEngineeringSection1Paragraph1: "先写出核心名词，让模型牢牢抓住主要对象。",
    promptEngineeringSection1Code:
      "✅ 正确：a cinematic portrait of a bioluminescent jellyfish<br />❌ 错误：cinematic, lighting, deep ocean, jellyfish portrait",
    promptEngineeringSection1Heading2: "2. 按重要性排列修饰词",
    promptEngineeringSection1Paragraph2:
      "依次描述风格、光线、镜头与情绪，越重要越靠前，方便后续权重调整。",
    promptEngineeringSection1Heading3: "3. 补充场景与动作",
    promptEngineeringSection1Paragraph3:
      'Short clauses about location or motion ("in a rain-soaked alley", "hovering above a neon city") dramatically improve coherence, especially for cinematic shots.',
    promptEngineeringSection2Paragraph1:
      "使用权重语法强调或弱化特定属性。AISTONE 支持括号权重与冒号权重两种常见写法。",
    promptEngineeringSection2List1: "<strong>1.4+</strong> — hero element, must-read instructions.",
    promptEngineeringSection2List2:
      "<strong>1.0</strong> — default priority for supporting descriptors.",
    promptEngineeringSection2List3:
      "<strong>&lt; 1.0</strong> — gentle hints; the model may ignore them if overwhelmed.",
    promptEngineeringSection2Paragraph2:
      "权重段落建议用逗号分隔，多句提示词要适度重述主体，保持聚焦。",
    promptEngineeringSection3Paragraph1:
      "与其维护庞大黑名单，不如为不同素材类型建立小而精的负面词组合。以下是人像常用模板：",
    promptEngineeringSection3Paragraph2:
      "产品图（划痕、反光）、环境图（平铺纹理、拉伸贴图）、字效（扭曲文字、浮雕）分别维护一套负面词，并在团队文档中统一命名。",
    promptEngineeringSection4List1:
      "<strong>确定基本媒介。</strong> 摄影、油画或赛璐璐风格只能二选一，避免画面混乱。",
    promptEngineeringSection4List2:
      '<strong>添加两种辅助风格。</strong> 例如"shot on Kodak Portra 400" + "lighting by Gregory Crewdson".',
    promptEngineeringSection4List3:
      '<strong>减少相冲突形容词。</strong> "极简"与"巴洛克"若非刻意对撞，通常不宜同用。',
    promptEngineeringSection4List4:
      "<strong>谨慎使用参考链接。</strong> 仅在必要时附上情绪板，其余情况优先使用文字提示。",
    promptEngineeringSection4Paragraph:
      "在迭代项目中记录最终提示词、seed 与参考素材，后续活动便能在几分钟内复刻同款质感。",
    promptEngineeringSection5List1:
      "<strong>提示词仓库：</strong> 将通过评审的提示词与截图集中存档。",
    promptEngineeringSection5List2:
      "<strong>版本命名：</strong> 文件名附加活动 + 模型 + 版本（如 `launch_flux_v3`）。",
    promptEngineeringSection5List3:
      "<strong>评审记录：</strong> 保存利益相关者意见与处理结果，方便复用。",
    promptEngineeringSection5List4:
      "<strong>交付包：</strong> 向下游提供提示词、seed、尺寸和放大说明。",
    promptEngineeringSection5Paragraph:
      "配合 AISTONE 的提示词历史功能，任何人都能追踪主视觉从草稿到成品的演变。",
    promptEngineeringDownload: "下载 PDF",
    promptEngineeringShare: "分享指南",

    // 教程博客（中文）
    tutorialAuthor: "AISTONE 内容团队",
    tutorialDate: "2025 年 4 月",
    tutorialQuickStartTitle: "🚀 快速开始",
    tutorialQuickStartStep1:
      '访问 <a href="https://aistone.cfd">https://aistone.cfd</a>，无需注册即可使用。',
    tutorialQuickStartStep2: "在页面选择 <strong>图像生成</strong> 或 <strong>语音合成</strong>。",
    tutorialQuickStartStep3: "输入详细描述（支持中文与英文），也可以使用示例按钮一键填充提示词。",
    tutorialQuickStartStep4:
      "根据需求调整参数（模型、比例、音色），然后点击 <strong>生成</strong>。",
    tutorialImageParamsTitle: "🎨 图像生成参数",
    tutorialImageModelHeading: "1. 选择 AI 模型",
    tutorialImageModelFlux: "<strong>FLUX：</strong> 适合追求高质量主视觉。",
    tutorialImageModelTurbo: "<strong>Turbo：</strong> 快速草稿与批量创意。",
    tutorialImageModelKontext: "<strong>Kontext：</strong> 图生图编辑与换色。",
    tutorialImageRatioHeading: "2. 设置宽高比",
    tutorialImageRatioDesc: "可选择 1:1、16:9、9:16、4:3 等预设，也可自定义长宽满足特定渠道。",
    tutorialImageQuantityHeading: "3. 设置数量与水印",
    tutorialImageQuantityItem1: "一次生成 1–4 张图片，便于对比构图。",
    tutorialImageQuantityItem2: "需要干净成品时可开启去水印。",
    tutorialPromptTipsTitle: "🧠 提示词撰写技巧",
    tutorialPromptTip1: "先写主体，再补充风格、光线与情绪。",
    tutorialPromptTip2: "使用逗号分隔短语，每个短语聚焦一个要点。",
    tutorialPromptTip3: "补充镜头、色彩、时代等上下文信息。",
    tutorialPromptTip4: "善用负面提示词过滤不想要的元素。",
    tutorialVoiceTitle: "🎙️ 语音合成流程",
    tutorialVoiceStep1: "在生成类型中切换到 <strong>语音</strong>。",
    tutorialVoiceStep2: "粘贴脚本，按段落分行可获得自然停顿。",
    tutorialVoiceStep3: "从 Nova、Echo、Fable、Onyx、Shimmer、Alloy 六种音色中选择。",
    tutorialVoiceStep4: "设置语速（0.25x–4.0x），点击 <strong>生成语音</strong>。",
    tutorialVoiceStep5: "在线试听或下载 WAV 文件以便后期处理。",
    tutorialWorkflowTitle: "🛠️ 推荐工作流",
    tutorialWorkflowCard1Title: "规划",
    tutorialWorkflowCard1Desc: "在生成前收集品牌规范、参考图和使用需求。",
    tutorialWorkflowCard2Title: "原型",
    tutorialWorkflowCard2Desc: "使用 Turbo 快速产出草稿，选出喜欢的版本后再用 FLUX 精修。",
    tutorialWorkflowCard3Title: "定稿",
    tutorialWorkflowCard3Desc: "放大最佳图像，按需求导出，并记录提示词与 seed 以便复用。",
    tutorialTroubleshootingTitle: "🧰 常见问题",
    tutorialTroubleshootingItem1:
      "<strong>图片模糊：</strong> 提升分辨率或切换 FLUX，并补充更具体的描述。",
    tutorialTroubleshootingItem2:
      '<strong>语音读音不准：</strong> 添加发音提示，例如 "AISTONE（读作 eye-stone）"。',
    tutorialTroubleshootingItem3:
      "<strong>生成超时：</strong> 减少生成数量或简化提示词，并留意状态页。",
    tutorialTroubleshootingItem4:
      '<strong>需要帮助：</strong> 可邮件至 <a href="mailto:support@aistone.cfd">support@aistone.cfd</a> 或使用站内反馈。',
    tutorialDownload: "下载 PDF",
    tutorialShare: "分享指南",

    // 图片生成器页面
    imageGeneratorTitle: "AISTONE - AI图片生成器",
    imageGeneratorSubtitle: "AI驱动·一键生成·释放创意",
    imageGeneratorSlogan: "免费生成高质量AI图片，支持多种风格和尺寸",
    breadcrumbImageGenerator: "AI图片生成器",

    // 关于页面
    aboutStatImages: "图像生成次数",
    aboutStatVoice: "语音合成时长",
    aboutStatUsers: "活跃用户",
    aboutStatUptime: "服务可用性",
    aboutCoreValuesTitle: "🎯 我们的核心价值",
    aboutTechLeadTitle: "技术领先",
    aboutTechLeadDesc: "集成FLUX、Stable Diffusion等最新AI模型，提供业界领先的生成质量和速度",
    aboutOpenFreeTitle: "开放免费",
    aboutOpenFreeDesc: "坚持技术普惠理念，所有核心功能永久免费开放，降低AI技术使用门槛",
    aboutEfficientTitle: "高效便捷",
    aboutEfficientDesc: "无需注册即用，简洁直观的用户界面，专业级功能一键触达",
    aboutSecureTitle: "安全可靠",
    aboutSecureDesc: "基于Cloudflare全球网络架构，确保数据安全和服务稳定性",

    // 关于页 - 额外键位
    aboutTimelineTitle: "📈 发展历程",
    aboutTimelineKickoff: "项目启动",
    aboutTimelineKickoffDesc:
      "AISTONE项目正式启动，确定以AI内容生成为核心的产品方向，开始技术架构设计和原型开发。",
    aboutTimelineMvp: "MVP发布",
    aboutTimelineMvpDesc: "发布最小可用产品版本，集成基础的图像生成功能，获得首批用户验证和反馈。",
    aboutTimelineImprove: "功能完善",
    aboutTimelineImproveDesc:
      "新增语音合成功能，完善用户体验设计，增加多语言支持和智能提示词优化功能。",
    aboutTimelineEnterprise: "企业级服务",
    aboutTimelineEnterpriseDesc: "推出企业级解决方案，提供API接口和批量处理服务，服务B端客户需求。",
    aboutTimelineUpgrade: "技术升级",
    aboutTimelineUpgradeDesc:
      "集成最新的FLUX模型，大幅提升图像生成质量，新增高级编辑和后处理功能。",
    aboutTimelineEcosystem: "生态建设",
    aboutTimelineEcosystemDesc:
      "计划推出开发者平台、插件生态系统，建立AI内容创作的开放生态，赋能更多创作者。",

    aboutTeamTitle: "👥 团队与愿景",
    aboutTeamProTitle: "专业技术团队",
    aboutTeamProDesc:
      "AISTONE团队由来自顶尖科技公司的AI专家、软件工程师和产品设计师组成。我们在机器学习、云计算和用户体验设计方面拥有丰富的经验，致力于将最前沿的AI技术转化为用户友好的产品。",
    aboutTeamAI: "🤖 AI研发团队",
    aboutTeamAIDesc: "深度学习算法专家，专注于计算机视觉、自然语言处理和语音技术研发",
    aboutTeamEng: "💻 工程团队",
    aboutTeamEngDesc: "资深软件工程师，擅长云原生架构、高并发系统和前端技术",
    aboutTeamDesign: "🎨 设计团队",
    aboutTeamDesignDesc: "用户体验设计师，专注于AI产品的交互设计和用户体验优化",
    aboutTeamProduct: "📊 产品团队",
    aboutTeamProductDesc: "产品经理和数据分析师，负责产品规划和用户行为分析",

    aboutMissionTitle: "使命与愿景",
    aboutMission: "🎯 使命",
    aboutMissionDesc: "让AI技术普惠大众，降低内容创作门槛，释放每个人的创造力潜能。",
    aboutVision: "🌟 愿景",
    aboutVisionDesc: "成为全球领先的AI内容创作平台，推动人工智能在创意领域的应用创新。",
    aboutValues: "💎 价值观",
    aboutValuesDesc: "开放包容、技术至上、用户第一、持续创新。",

    aboutEnterpriseTitle: "🏢 企业级解决方案",
    aboutEnterpriseIntroTitle: "为企业量身定制",
    aboutEnterpriseIntroDesc:
      "除了面向个人用户的免费服务，AISTONE还提供企业级解决方案，帮助企业客户在营销、设计、内容制作等领域实现AI化转型。",
    aboutSolutionBatch: "批量内容生成",
    aboutSolutionBrand: "品牌定制服务",
    aboutSolutionPrivate: "私有化部署",

    aboutPartnerTitle: "🤝 技术合作与开源贡献",
    aboutPartnerAcademy: "🔬 学术合作",
    aboutPartnerAcademyDesc:
      "与国内外知名高校和研究机构建立合作关系，共同推进AI技术在内容创作领域的研究与应用。",
    aboutPartnerIndustry: "💼 产业生态",
    aboutPartnerIndustryDesc:
      "与AI芯片厂商、云服务提供商、内容平台等建立生态合作，构建完整的AI内容创作产业链。",
    aboutPartnerOpen: "🌐 开源贡献",
    aboutPartnerOpenDesc: "积极参与开源社区建设，贡献核心技术组件，推动AI技术的开放发展。",

    aboutAchievementsTitle: "🏆 平台数据与成就",
    aboutAchievementsService: "📊 服务数据",
    aboutAchievementsTech: "🎖️ 技术成就",
    aboutAchievementsIndustry: "🌟 行业认可",

    aboutContactTitle: "💬 联系我们",
    aboutContactSupportTitle: "多渠道支持服务",
    aboutContactSupportDesc:
      "我们提供多种方式与用户保持联系，确保您在使用过程中得到及时的帮助和支持。",
    aboutContactEmail: "邮件支持",
    aboutContactEmailSla: "Response within 24 hours on business days",
    aboutContactChat: "在线客服",
    aboutContactChatDesc: "网站右下角聊天窗口",
    aboutContactChatSla: "工作时间实时响应",
    aboutContactFeedback: "问题反馈",
    aboutContactFeedbackDesc: "平台内置反馈系统",
    aboutContactFeedbackNote: "产品建议和Bug报告",

    aboutCommunityTitle: "加入我们的社区",

    aboutStartJourney: "🚀 开始您的AI创作之旅",
    aboutStartCreate: "🎨 立即开始创作",
    aboutStartCreateDesc: "体验AISTONE的强大功能，创造属于您的AI艺术作品",
    aboutStartCreateCta: "开始创作 →",
    aboutStartGuide: "🧠 AI技术指南",
    aboutStartGuideDesc: "深入了解AI图像生成技术原理和应用实践",
    aboutStartGuideCta: "学习技术 →",
    aboutStartPrompt: "✍️ 提示词工程",
    aboutStartPromptDesc: "掌握专业的提示词技巧，提升AI创作质量",
    aboutStartPromptCta: "提升技能 →",
    aboutStartBiz: "💼 企业合作",
    aboutStartBizDesc: "了解企业级解决方案，探讨定制化服务需求",
    aboutStartBizCta: "联系我们 →",

    // 教程页面
    tutorialStep1Title: "步骤1：访问平台",
    tutorialStep1Desc:
      '打开浏览器访问 <a href="https://aistone.cfd">https://aistone.cfd</a>，无需注册即可开始使用。',
    tutorialStep2Title: "步骤2：选择生成类型",
    tutorialStep2Desc: "在页面上选择您想要生成的内容类型：",
    tutorialImageGen: "生成图片：",
    tutorialImageGenDesc: "将文本描述转换为高质量图片",
    tutorialVoiceGen: "生成语音：",
    tutorialVoiceGenDesc: "将文本转换为自然流畅的语音",

    // AI指南页面
    aiGuideCoreTechTitle: "核心技术原理",
    aiGuideCoreTechDesc:
      "<strong>扩散模型（Diffusion Models）</strong>是目前最主流的AI图像生成技术。它模仿物理学中的扩散过程：",
    aiGuideForwardProcess: "正向过程：",
    aiGuideForwardProcessDesc: "将清晰图像逐步添加噪声，直到变成纯噪声",
    aiGuideReverseProcess: "逆向过程：",
    aiGuideReverseProcessDesc: "AI学会从噪声中逐步去噪，重构出有意义的图像",
    aiGuideConditionalControl: "条件控制：",
    aiGuideConditionalControlDesc: "通过文本编码器将提示词转换为数学向量，引导生成过程",
    aiGuideTechAdvantagesTitle: "💡 技术优势",
    aiGuideHighQuality: "高质量输出：",
    aiGuideHighQualityDesc: "能够生成8K分辨率的专业级图像",
    aiGuideStyleDiversity: "风格多样性：",
    aiGuideStyleDiversityDesc: "支持摄影、绘画、插画等各种艺术风格",
    aiGuideUnlimitedCreativity: "创意无限：",
    aiGuideUnlimitedCreativityDesc: "可以创造现实中不存在的场景和概念",
    aiGuideCostEffective: "成本效益：",
    aiGuideCostEffectiveDesc: "大幅降低视觉内容创作的时间和成本",

    // About AISTONE 部分
    aboutAistone: "关于 AISTONE",
    whatIsAistone: "什么是 AISTONE？",
    whatIsAistoneDesc:
      "AISTONE 是一个革命性的AI驱动平台，结合了前沿的图片生成和语音合成技术。以民主化AI内容创作为愿景，AISTONE 提供对包括Kontext、FLUX和Turbo在内的先进AI模型的免费访问。",
    aistoneMission: "AISTONE 的使命",
    aistoneMissionDesc:
      "AISTONE 致力于让AI内容创作对每个人都能触手可及。无论您是专业设计师、内容创作者，还是只是有创意想法的人，AISTONE 都提供您需要的工具，让您的愿景变为现实，没有任何障碍。",
    whyChooseAistone: "为什么选择 AISTONE？",
    whyChooseAistoneDesc:
      "AISTONE 以其对隐私、质量和可访问性的承诺而脱颖而出。我们的平台实时处理所有内容而不存储用户数据，确保完全隐私的同时，提供由最新AI技术驱动的专业级结果。",
    aistonePartner: "AISTONE - 您的AI内容创作伙伴",
    aistonePartnerDesc:
      "加入数千名信任 AISTONE 进行AI内容创作需求的用户。从令人惊叹的视觉艺术到自然语音合成，AISTONE 是您所有AI驱动创意项目的一站式解决方案。今天就与 AISTONE 一起体验内容创作的未来。",

    // 示例按钮
    examples: {
      cat: {
        name: "🐱 可爱猫咪",
        text: "一只可爱的猫咪在草地上玩耍，阳光明媚，高清摄影",
        type: "image",
      },
      city: {
        name: "🌃 科技城市",
        text: "未来科技城市夜景，霓虹灯闪烁，赛博朋克风格，超高清",
        type: "image",
      },
      beauty: {
        name: "🌸 古风美女",
        text: "古风美女，汉服飘逸，桃花盛开，国风插画，精美细节",
        type: "image",
      },
      dragon: {
        name: "🐉 史诗巨龙",
        text: "一条凶猛的龙在火山上空盘旋，熔岩流淌，史诗感",
        type: "image",
      },
      lake: {
        name: "🏞️ 雪山湖景",
        text: "宁静的湖面倒映着雪山和森林，黄昏，油画风格",
        type: "image",
      },
      welcome: {
        name: "🎵 欢迎语音",
        text: "欢迎使用AI内容生成器，希望您能创造出精彩的作品",
        type: "audio",
      },
      weather: { name: "🌦️ 天气播报", text: "今天天气真不错，适合出门散步和拍照", type: "audio" },
      forest: {
        name: "🌲 魔法森林",
        text: "梦幻森林，精灵飞舞，魔法光芒，幻想风景画",
        type: "image",
      },
      mountain: {
        name: "⛰️ 星空山峰",
        text: "星空下的山峰，银河璀璨，摄影作品，震撼视觉",
        type: "image",
      },
      robot: {
        name: "🤖 机械朋克",
        text: "机械朋克机器人，金属质感，蒸汽朋克风格，工业美学",
        type: "image",
      },
      thanks: { name: "🙏 感谢语音", text: "感谢您的使用，祝您生活愉快，工作顺利", type: "audio" },
      garden: {
        name: "🌸 日式庭院",
        text: "樱花飘落的日式庭院，宁静优美，水墨画风格",
        type: "image",
      },
    },

    // 使用提示
    tips: {
      example: "💡 尝试点击示例按钮快速填充内容",
      optimize: '✨ 使用"优化"按钮提升AI生成效果',
      random: '🎲 点击"随机"按钮获取灵感',
      imageSize: "🖼️ 图片生成支持多种尺寸比例",
      audio: "🎵 语音生成支持下载功能",
    },

    // 结果操作
    download: "下载",
    copy: "复制",
    view: "查看",
    close: "关闭",
    copied: "已复制",
    copyFailed: "复制失败",

    // 新增：灵感获取专区
    inspirationTitle: "🎨 灵感获取专区",
    inspirationExamples: {
      forest: "梦幻森林",
      city: "未来都市",
      cottage: "童话小屋",
      cyberpunk: "赛博朋克",
    },

    // 导航栏
    navHome: "首页",
    navImageGen: "图像生成",
    navVoice: "语音合成",
    navVoiceGen: "语音合成",
    navAbout: "关于我们",
    navAIGuide: "AI指南",
    navPromptEngineering: "提示词工程",
    navTutorial: "使用教程",
    navFAQ: "常见问题",
    navContact: "联系我们",
    navServices: "我们的服务",
    navLogin: "登录",
    navBlog: "博客",

    // 博客相关
    blogTitle: "AISTONE博客 - AI技术指南与教程",
    blogHeroTitle: "AISTONE 技术博客",
    blogHeroSubtitle: "深入探索AI图像生成技术，掌握提示词工程，从入门到精通的完整指南",
    blogCategoryAll: "全部文章",
    blogCategoryGuide: "技术指南",
    blogCategoryTutorial: "使用教程",
    blogCategoryPrompt: "提示词工程",
    blogCategoryFAQ: "常见问题",

    tutorialTitle: "AISTONE平台使用教程",

    // 文章摘要
    aiGuideExcerpt:
      "从基础理论到实战技巧，深入了解扩散模型、FLUX、Stable Diffusion等前沿AI图像生成技术...",
    aiGuideReadTime: "约10分钟阅读",
    promptEngineeringExcerpt:
      "掌握AI图像生成的核心技能，从基础语法到高级策略，学会权重控制、负面提示词和风格融合...",
    promptEngineeringReadTime: "约12分钟阅读",
    tutorialExcerpt:
      "快速上手AISTONE平台，学会图像生成、语音合成的基本操作，掌握各种参数设置和优化技巧...",
    tutorialReadTime: "约8分钟阅读",
    faqExcerpt:
      "汇总平台使用过程中的常见问题和解决方案，包括账号管理、生成失败、质量优化等实用建议...",
    faqReadTime: "约5分钟阅读",

    // 面包屑导航
    breadcrumbHome: "首页",

    // 语音页面专用翻译
    voiceHeroTitle: "AISTONE - 免费AI语音合成平台",
    voiceHeroSubtitle: "文本转语音 • 多种音色 • 完全免费",
    voiceHeroSlogan: "AI驱动·自然语音·专业级品质！",
    voiceInputTitle: "文本内容",
    voiceGeneratorTitle: "AI语音合成器",
    voiceGeneratorDesc: "输入文本，AI将为您生成自然流畅的语音",
    voiceTextLabel: "输入文本内容",
    voiceTextHint: "（支持中文和英文，建议300字以内）",
    voiceTextPlaceholder: "在这里输入您想要转换为语音的文本...",
    voiceModelLabel: "音色选择",
    voiceSpeedLabel: "语速调节",
    voiceExamplesLabel: "示例文本（点击使用）",
    generateVoiceBtn: "生成语音",
    voiceResultTitle: "生成结果",
    downloadAudio: "下载音频",
    copyLink: "复制链接",
    fileSize: "文件大小:",
    logsTitle: "调用日志",
    historyTitle: "历史记录",
    shareAudio: "分享",
    saveToGallery: "保存到个人中心",
    voiceLength: "时长",
    voiceModel: "音色",
    voiceSpeed: "语速",
    voiceFeature1: "多种AI音色",
    voiceFeature2: "中英文支持",
    voiceFeature3: "实时生成",
    voiceFeature4: "完全免费",

    // 语音特色功能
    voiceFeaturesTitle: "AI语音合成特色",
    voiceFeatureTitle1: "多样音色选择",
    voiceFeatureDesc1:
      "提供6种不同风格的AI音色，包括男声、女声，适应不同场景需求，让每个声音都有独特的个性。",
    voiceFeatureTitle2: "实时快速生成",
    voiceFeatureDesc2:
      "采用先进的AI语音合成技术，支持实时文本转语音，几秒钟即可生成高质量的自然语音。",
    voiceFeatureTitle3: "中英双语支持",
    voiceFeatureDesc3:
      "完美支持中文和英文文本转语音，智能识别语言类型，为全球用户提供优质的语音合成服务。",
    voiceFeatureTitle4: "灵活语速控制",
    voiceFeatureDesc4:
      "支持0.25x到4.0x的语速调节，满足不同应用场景，从慢速学习到快速播报，自由控制。",
    voiceFeatureTitle5: "高质量输出",
    voiceFeatureDesc5:
      "生成的语音清晰自然，情感表达丰富，适合播客、有声书、教育内容等专业应用场景。",
    voiceFeatureTitle6: "完全免费使用",
    voiceFeatureDesc6:
      "无需注册，无使用限制，所有功能永久免费开放，让每个人都能享受AI语音合成的便利。",

    // 应用场景
    voiceUseCasesTitle: "应用场景",
    voiceUseCase1Title: "播客制作",
    voiceUseCase1Desc: "为播客节目制作专业的开场白、介绍语或背景旁白，提升内容的专业度和吸引力。",
    voiceUseCase2Title: "有声读物",
    voiceUseCase2Desc: "将文字内容转换为有声读物，让阅读更加便捷，适合学习、休闲等多种场景。",
    voiceUseCase3Title: "教育培训",
    voiceUseCase3Desc: "制作教学音频、课程讲解、语言学习材料，提升教育内容的可访问性和学习体验。",
    voiceUseCase4Title: "营销推广",
    voiceUseCase4Desc: "创建产品介绍、广告词、宣传片配音，为营销内容增加声音的感染力和说服力。",
    voiceUseCase5Title: "视频制作",
    voiceUseCase5Desc: "为视频内容添加旁白、解说或对话，提升视频的专业性和观看体验。",
    voiceUseCase6Title: "辅助工具",
    voiceUseCase6Desc: "为视障人士提供文本朗读服务，或作为语言学习的发音参考工具。",
    navAbout: "关于",
    navServices: "服务",
    navContact: "联系",
    navLogin: "登录",

    // 面包屑导航
    breadcrumbCurrent: "AI内容生成",

    // 主要特性区块
    featuresTitle: "AISTONE 的主要特性",
    features: [
      { icon: "💸", title: "零成本创作", desc: "完全免费，无需注册，无限生成。" },
      { icon: "🧠", title: "最先进的质量", desc: "高分辨率，细节丰富，艺术风格多样。" },
      { icon: "⚡", title: "闪电般的速度", desc: "优化推理管道，快速生成不影响质量。" },
      { icon: "🔒", title: "隐私保护", desc: "零数据留存，生成内容不存储。" },
      { icon: "🌐", title: "多语言支持", desc: "支持中英文界面，全球可用。" },
      { icon: "🎨", title: "多风格支持", desc: "跨艺术风格，照片、插画、动漫等。" },
    ],
    generationResult: "生成结果",

    // 高清图片管理
    hdImageTooLarge: "图片太大，请重试（最大2MB）",
    hdImageSaved: "高清图片保存成功！",
    hdImageSaveFailed: "保存失败",
    hdImageListFailed: "获取图片列表失败",
    hdImageLoadError: "获取图片失败",
    hdImagePrepareDownload: "正在准备下载...",
    hdImageDownloadSuccess: "下载成功！",
    hdImageDownloadFailed: "下载失败",
    hdImageDeleteConfirm: "确定要删除这张图片吗？",
    hdImageDeleted: "图片删除成功！",
    hdImageDeleteFailed: "删除失败",
    hdImageLoadFailed: "加载图片列表失败",
    hdImageLoadingHD: "正在加载高清图片...",
    hdImageThumbnail: "缩略图",
    hdImageSaving: "正在保存...",
    hdImageStats: "统计信息错误",
    hdClickToView: "点击查看高清图片",

    // 用户中心
    userCenter: "个人中心",
    userUpdateSuccess: "更新成功",
    userPasswordMismatch: "两次输入的密码不一致",
    userFeatureComing: "功能开发中，敬请期待",
    newPassword: "新密码",
    confirmNewPassword: "确认新密码",

    // 反馈系统
    feedbackTitle: "留言与建议",
    feedbackCategory: "反馈类别",
    feedbackContent: "反馈内容",
    feedbackSubmit: "提交反馈",
    feedbackPlaceholder: "请描述您的问题或建议...",
    feedbackSuccess: "反馈提交成功，感谢您的建议！",
    feedbackError: "提交失败，请稍后重试",
    feedbackEmpty: "反馈内容不能为空",
    feedbackTooLong: "反馈内容不能超过1000字符",
    feedbackRateLimit: "请稍后再提交反馈",
    myFeedback: "我的留言",
    noFeedback: "暂无留言记录",
    feedbackStatus: "状态",
    feedbackTime: "提交时间",
    feedbackPending: "待处理",
    feedbackProcessed: "已处理",

    // 反馈类别
    feedbackCategories: {
      bug: "问题反馈",
      feature: "功能建议",
      improvement: "体验改进",
      other: "其他",
    },

    // 提示词模板
    promptTemplates: "常用模板",
    promptTemplateTitle: "常用提示词模板",
    templateCategories: {
      landscape: "风景",
      portrait: "人像",
      product: "产品拍摄",
      avatar: "头像",
      anime: "二次元",
      logo: "Logo/海报",
    },
    useTemplate: "使用模板",
    templateApplied: "模板已应用",

    // 模态框和弹窗
    showModal: "显示模态框",
    closeModal: "关闭模态框",
    modalNotFound: "模态框未找到",
    authModalLoadFailed: "加载认证界面失败",
    authModuleInitSuccess: "认证模块初始化完成",
    authModuleNotLoaded: "认证模块未加载",
    imageModuleInitSuccess: "图片管理模块初始化完成",
    imageModuleNotLoaded: "图片管理模块未加载",
    userLoggedInInit: "用户已登录，初始化图片管理器",

    // Footer
    footerCopyright: "© 2025 AISTONE",
    footerCopyrightFull: "© 2025 AISTONE. 保留所有权利。",
    footerDescription: "免费AI内容生成平台",
    footerQuickLinks: "快速链接",
    footerSupport: "支持",
    footerLinksTitle: "友情链接",
    footerLinks: [
      { text: "隐私政策", url: "#" },
      { text: "服务条款", url: "#" },
      { text: "友情链接：IDPhoto.space（在线证件照工具）", url: "https://idphoto.space/" },
    ],

    // 主页CTA按钮
    startImageGeneration: "开始图像生成",
    startVoiceSynthesis: "开始语音合成",
    tagHighQuality: "专业品质",

    // 主页内容
    heroDescription:
      "基于先进的 Pollinations.AI 技术，支持 FLUX、Turbo、Kontext 图像模型与 OpenAI Audio TTS 语音合成。无需注册，永久免费，支持中英文输入，专为创作者优化。",
    tagChinese: "中文支持",

    // AI模型
    modelsTitle: "支持的AI模型",
    modelsSubtitle: "基于Pollinations.AI技术的先进AI模型，满足不同创作需求",

    // 服务
    servicesTitle: "AI 创作服务",
    servicesSubtitle: "体验最先进的AI技术，将您的想法转化为令人惊叹的视觉和听觉作品",
    imageGenerationTitle: "AI 图像生成",
    voiceSynthesisTitle: "AI 语音合成",
    imageGenerationDesc:
      "从文本描述生成高质量的AI图像，支持多种艺术风格和自定义尺寸。基于Pollinations.AI技术，支持FLUX、Turbo、Kontext等先进模型，让您的创意无限延伸。",
    voiceSynthesisDesc:
      "将文本转换为自然流畅的语音，支持多种音色和语言。适合制作视频、播客、有声读物等内容，为您的作品增添生动的声音。",
    featureCommercial: "商用许可",
    featureDownloadable: "可下载",
    featureHighQuality: "高清质量",
    featureMultiStyle: "多种风格",
    featureCustomSize: "自定义尺寸",
    featureNaturalVoice: "自然语音",
    featureMultiVoice: "多种音色",
    featureMultiLang: "多语言支持",

    // 适用人群
    audienceTitle: "适用人群",
    audienceSubtitle: "AISTONE为各行各业的创作者提供强大的AI工具",

    // 特色功能
    featureFreeDesc: "所有功能永久免费，无隐藏费用，无需注册即可使用，支持商业用途",
    featureSpeedDesc: "基于先进的AI技术，秒级响应，高效创作体验，无需等待",
    featureQualityDesc: "高清输出，多种风格，支持各种尺寸，满足专业创作需求",
    featurePrivacyDesc: "不储存用户数据，实时处理，保护隐私安全，内容版权归用户所有",
    featureMultiLangDesc: "支持中英文输入，界面可切换，特别为中文用户优化",
    featureResponsiveDesc: "响应式设计，支持手机、平板、电脑无缝体验",

    // 使用指南
    guideTitle: "使用指南",
    guideSubtitle: "仅需几步即可开始您的AI创作之旅",

    // AI模型描述
    fluxModelDesc: "高质量艺术创作模型，专为创意设计优化，生成细节丰富的艺术作品",
    turboModelDesc: "极速生成模型，适合快速原型制作和批量图片生成，效率优先",
    kontextModelDesc: "图像到图像生成模型，支持图片编辑和风格转换，专业图像处理",
    openaiAudioModelDesc:
      "OpenAI Audio 语音合成（TTS），提供 Nova、Alloy、Echo、Fable、Onyx、Shimmer 多音色，发音自然流畅，支持语速调节",

    // 适用人群标题
    designerTitle: "设计师",
    creatorTitle: "内容创作者",
    marketerTitle: "营销人员",
    ecommerceTitle: "电商卖家",
    educatorTitle: "学生教师",
    generalUserTitle: "普通用户",

    // 适用人群描述
    designerDesc: "快速生成设计灵感，创建概念图和原型",
    creatorDesc: "为文章、视频、社交媒体制作配图和语音",
    marketerDesc: "制作广告素材，提升营销效果",
    ecommerceDesc: "创建产品展示图，提升商品吸引力",
    educatorDesc: "制作教学材料，增强学习体验",
    generalUserDesc: "个人创作，记录生活，表达创意",

    // 特色功能
    featuresTitle: "平台特色",
    featuresSubtitle: "为什么选择 AISTONE 作为您的AI创作伙伴",

    // 特色功能标题
    featureFreeTitle: "永久免费",
    featureSpeedTitle: "极速生成",
    featureQualityTitle: "专业品质",
    featurePrivacyTitle: "隐私保护",
    featureMultiLangTitle: "多语言支持",
    featureResponsiveTitle: "跨平台使用",

    // 使用步骤
    step1Title: "访问平台",
    step1Desc: "访问 aistone.cfd，选择图像生成或语音合成服务，无需注册直接使用",
    step2Title: "选择模型",
    step2Desc:
      "根据需求选择FLUX、Turbo、Kontext图像模型，或选择OpenAI Audio TTS用于语音，每个模型都有独特优势",
    step3Title: "输入描述",
    step3Desc: "用中文或英文详细描述您想要的内容，AI将基于描述生成对应的图像或语音",
    step4Title: "生成内容",
    step4Desc: "点击生成按钮，AI模型将创建高质量的图像或自然语音，支持下载和商用",

    // 关于AISTONE
    aboutTitle: "关于 AISTONE",
    aboutDesc1:
      "AISTONE 是一个基于 Pollinations.AI 技术的智能内容创作平台，集成了文本生成图片与语音功能，致力于为用户提供高效、便捷、免费的AI内容创作体验。我们的平台支持文本生成图片、文本生成语音等多种创作功能。",
    aboutDesc2:
      "无论你是设计师、内容创作者，还是普通用户，只需输入一句描述，就能一键生成高质量的视觉内容或语音内容。",
    aboutImageTitle: "AI 图像生成",
    aboutImageDesc:
      "基于FLUX、Turbo、Kontext等先进模型，支持多种艺术风格，从写实摄影到抽象艺术，满足各种创作需求",
    aboutVoiceTitle: "AI 语音合成",
    aboutVoiceDesc:
      "将文本转换为自然流畅的语音，支持多种音色和语言，适合制作播客、有声读物、教学内容等",
    aboutSpeedTitle: "极速便捷",
    aboutSpeedDesc: "云端算力支持，保证生成速度与质量，界面简洁友好，适配多终端设备，随时随地创作",
    aboutPhilosophyTitle: "平台理念",
    aboutPhilosophyDesc:
      "我们相信AI技术应该普惠大众，因此所有功能永久免费开放。助力每一位用户释放创意灵感，实现从文字到视觉、从文字到语音的无限可能。保护用户隐私，生成内容版权归用户所有，支持商业用途。",

    // 页脚链接
    privacyPolicy: "隐私政策",
    termsOfService: "服务条款",
    contactUs: "联系我们",

    // 博客标签（通用）
    tagAITech: "AI技术",
    tagDiffusion: "扩散模型",
    tagFlux: "FLUX",
    tagPrompt: "提示词",
    tagWeight: "权重控制",
    tagStyle: "风格设计",
    tagBeginner: "入门教程",
    tagHowTo: "操作指南",
    tagParam: "参数设置",
    tagQnA: "问题解答",
    tagTroubleshoot: "故障排除",
    tagTips: "使用技巧",

    // 使用条款（Terms of Service）
    termsBreadcrumb: "使用条款",
    termsTitle: "使用条款",
    termsLastUpdated: "最后更新时间：2025年1月1日",
    termsSection1Title: "1. 接受条款",
    termsSection1Intro:
      '欢迎使用AISTONE（以下简称"本平台"）提供的AI图片生成和语音合成服务。通过访问或使用本平台，您同意受本使用条款的约束。如果您不同意这些条款，请勿使用本平台。',
    termsSection2Title: "2. 服务描述",
    termsSection2Intro: "AISTONE是一个基于Pollinations.AI技术的AI内容生成平台，提供以下服务：",
    termsSection2Item1: "AI图片生成功能：根据用户输入的文本描述生成高质量图片",
    termsSection2Item2: "AI语音合成功能：将文本转换为自然流畅的语音",
    termsSection2Item3: "智能提示词优化：使用DeepSeek AI优化用户输入",
    termsSection2Item4: "用户认证和个人中心功能",
    termsSection2Item5: "高清图片缓存和管理功能",
    termsSection3Title: "3. 用户资格",
    termsSection3Intro: "要使用本平台服务，您必须：",
    termsSection3Item1: "年满13周岁",
    termsSection3Item2: "同意遵守所有适用的法律法规",
    termsSection3Item3: "提供真实、准确的注册信息（如适用）",
    termsSection3Item4: "对您的账户和密码负责（如适用）",
    termsSection4Title: "4. 用户责任",
    termsSection4Intro: "使用本平台时，您同意：",
    termsSection4Item1: "合法使用：仅将服务用于合法目的，不得用于任何违法活动",
    termsSection4Item2: "内容合规：不生成包含暴力、色情、仇恨言论或其他有害内容的材料",
    termsSection4Item3: "知识产权：尊重他人知识产权，不侵犯版权或商标权",
    termsSection4Item4: "平台安全：不尝试破坏、入侵或干扰平台正常运行",
    termsSection4Item5: "公平使用：合理使用服务，不进行过度或滥用行为",
    termsSection5Title: "5. 禁止行为",
    termsSection5Intro: "严禁以下行为：",
    termsSection5Item1: "生成或传播非法、淫秽、暴力或仇恨内容",
    termsSection5Item2: "侵犯他人隐私权、肖像权或知识产权",
    termsSection5Item3: "进行网络攻击、数据窃取或系统破坏",
    termsSection5Item4: "滥用服务进行商业竞争或恶意行为",
    termsSection5Item5: "绕过技术限制或进行逆向工程",
    termsSection5Item6: "散布虚假信息或误导性内容",
    termsSection5Item7: "使用自动化工具进行大规模生成",
    termsSection6Title: "6. 内容所有权",
    termsSection6Intro: "关于生成内容的权利：",
    termsSection6Item1: "用户生成内容：您对使用本平台生成的内容享有完整的所有权",
    termsSection6Item2: "商业使用：您可以自由地将生成内容用于商业和个人目的",
    termsSection6Item3: "平台权利：我们保留对平台技术、界面和品牌的所有权利",
    termsSection6Item4: "第三方内容：平台可能包含第三方提供的内容，其版权归原权利人所有",
    termsSection7Title: "7. 服务可用性",
    termsSection7Intro: "关于服务提供：",
    termsSection7Item1: "免费服务：本平台目前提供永久免费服务",
    termsSection7Item2: "服务中断：我们可能因维护、技术问题或其他原因暂时中断服务",
    termsSection7Item3: "功能变更：我们保留随时修改或终止服务的权利",
    termsSection7Item4: "无保证：我们不保证服务100%可用或无错误",
    termsSection8Title: "8. 隐私保护",
    termsSection8Intro: "我们重视您的隐私：",
    termsSection8Item1: "数据收集：我们仅收集必要的信息来提供服务",
    termsSection8Item2: "数据使用：收集的信息仅用于改善服务和用户体验",
    termsSection8Item3: "数据安全：我们采用适当的技术和组织措施保护您的数据",
    termsSection8Item4: "数据保留：我们不会长期存储用户生成的原始内容",
    termsSection8Note: "详细的隐私政策请参见：",
    termsSection9Title: "9. 免责声明",
    termsSection9Intro: "请注意以下重要免责事项：",
    termsSection9Item1: "服务按现状提供：我们不保证服务的准确性、可靠性或适用性",
    termsSection9Item2: "AI生成内容：AI生成的内容可能包含不准确或不适当的信息",
    termsSection9Item3: "第三方服务：我们不对第三方服务的可用性或内容负责",
    termsSection9Item4: "使用风险：您对使用生成内容承担全部责任",
    termsSection9Item5: "技术限制：AI技术存在固有限制，可能无法满足所有需求",
    termsSection10Title: "10. 责任限制",
    termsSection10Intro: "在法律允许的最大范围内，我们不对以下情况承担责任：",
    termsSection10Item1: "服务中断、数据丢失或功能故障",
    termsSection10Item2: "AI生成内容的质量或准确性问题",
    termsSection10Item3: "第三方侵权或法律纠纷",
    termsSection10Item4: "用户因使用服务遭受的间接或后果性损失",
    termsSection10Item5: "不可抗力事件导致的服务中断",
    termsSection11Title: "11. 条款变更",
    termsSection11Intro: "我们保留随时修改本使用条款的权利：",
    termsSection11Item1: "变更通知：重大变更将通过网站公告或邮件通知",
    termsSection11Item2: "继续使用：继续使用服务即表示接受新条款",
    termsSection11Item3: "历史版本：我们会保留条款的历史版本供查阅",
    termsSection12Title: "12. 终止服务",
    termsSection12Intro: "在以下情况下，我们可能终止或限制您的服务：",
    termsSection12Item1: "违反本使用条款",
    termsSection12Item2: "进行违法或不当活动",
    termsSection12Item3: "对平台造成安全威胁",
    termsSection12Item4: "账户长期未使用",
    termsSection12Item5: "技术或业务原因需要终止",
    termsSection13Title: "13. 适用法律",
    termsSection13Intro: "本使用条款受中华人民共和国法律管辖：",
    termsSection13Item1: "管辖法院：如发生争议，将在中国大陆法院诉讼",
    termsSection13Item2: "法律适用：适用中华人民共和国法律",
    termsSection13Item3: "争议解决：鼓励友好协商解决争议",
    termsSection14Title: "14. 联系我们",
    termsSection14Intro: "如果您对本使用条款有任何疑问或需要帮助，请通过以下方式联系我们：",
    termsSection14Item1: "邮箱：legal@aistone.cfd",
    termsSection14Item2: "网站：联系我们页面",
    termsSection15Title: "15. 生效日期",
    termsSection15Intro: "本使用条款于2025年1月1日生效，并取代之前的所有版本。",

    // 隐私政策（Privacy Policy）
    privacyBreadcrumb: "隐私政策",
    privacyTitle: "隐私政策",
    privacyLastUpdated: "最后更新时间：2025年9月6日",
    privacySection1Title: "1. 信息收集",
    privacySection1Intro: "AISTONE致力于保护用户隐私。我们收集的信息类型包括：",
    privacySection1Item1: "自动收集的信息：IP地址、浏览器类型、访问时间等技术信息",
    privacySection1Item2: "用户提供的信息：您在使用我们服务时主动提供的文本内容",
    privacySection1Item3: "Cookie信息：用于改善用户体验的必要Cookie",
    privacySection2Title: "2. 信息使用",
    privacySection2Intro: "我们使用收集的信息用于：",
    privacySection2Item1: "提供AI图片生成和语音合成服务",
    privacySection2Item2: "改善服务质量和用户体验",
    privacySection2Item3: "进行必要的安全监控和防护",
    privacySection2Item4: "遵守法律法规要求",
    privacySection3Title: "3. 数据安全",
    privacySection3Intro: "我们采用以下措施保护您的数据安全：",
    privacySection3Item1: "零存储政策：用户生成的内容不会在我们的服务器上长期存储",
    privacySection3Item2: "加密传输：所有数据传输均采用HTTPS加密",
    privacySection3Item3: "访问控制：严格限制对用户数据的访问权限",
    privacySection3Item4: "定期审计：定期进行安全审计和漏洞检测",
    privacySection4Title: "4. 第三方服务",
    privacySection4Intro: "我们的服务集成了以下第三方服务：",
    privacySection4Item1: "Pollinations AI：提供图片和语音生成技术",
    privacySection4Item2: "DeepSeek AI：提供提示词优化服务",
    privacySection4Item3: "Google Analytics：用于网站分析（如适用）",
    privacySection4Item4: "Google AdSense：用于展示广告（如适用）",
    privacySection4Note: "这些第三方服务有各自的隐私政策，我们建议您仔细阅读。",
    privacySection5Title: "5. Cookie政策",
    privacySection5Intro: "我们使用Cookie来：",
    privacySection5Item1: "记住您的语言偏好设置",
    privacySection5Item2: "分析网站使用情况",
    privacySection5Item3: "提供个性化的用户体验",
    privacySection5Item4: "展示相关广告（如适用）",
    privacySection5Note: "您可以通过浏览器设置管理Cookie，但这可能影响网站的正常功能。",
    privacySection6Title: "6. 用户权利",
    privacySection6Intro: "根据适用的数据保护法律，您享有以下权利：",
    privacySection6Item1: "知情权：了解我们如何处理您的个人信息",
    privacySection6Item2: "访问权：请求访问我们持有的您的个人信息",
    privacySection6Item3: "更正权：请求更正不准确的个人信息",
    privacySection6Item4: "删除权：在特定情况下请求删除您的个人信息",
    privacySection6Item5: "反对权：反对我们处理您的个人信息",
    privacySection7Title: "7. 儿童隐私",
    privacySection7Intro:
      "我们的服务不针对13岁以下的儿童。我们不会故意收集13岁以下儿童的个人信息。如果我们发现收集了此类信息，将立即删除。",
    privacySection8Title: "8. 政策更新",
    privacySection8Intro:
      "我们可能会不时更新本隐私政策。重大变更将通过网站公告或其他适当方式通知用户。继续使用我们的服务表示您接受更新后的政策。",
    privacySection9Title: "9. 联系我们",
    privacySection9Intro:
      "如果您对本隐私政策有任何疑问或需要行使您的权利，请通过以下方式联系我们：",
    privacySection9Item1: "邮箱：privacy@aistone.cfd",
    privacySection9Item2: "网站：联系我们页面",

    // 联系我们 - 获取帮助（补齐中文键）
    contactHelpTitle: "📞 获取帮助",
    contactHelpFAQTitle: "❓ 常见问题解答",
    contactHelpFAQDesc: "先查看FAQ，也许您的问题已有详细解答",
    contactHelpTutorialTitle: "📖 使用教程",
    contactHelpTutorialDesc: "完整的操作指南，帮您快速上手平台功能",
    contactHelpAboutTitle: "ℹ️ 关于AISTONE",
    contactHelpAboutDesc: "了解我们的平台理念和技术背景",
    contactHelpHomeTitle: "🏠 返回首页",
    contactHelpHomeDesc: "回到主页开始使用AI生成功能",

    // 语音合成按钮
    generateAndPlay: "▶ 生成并播放",
    copyDeepLink: "复制深链",

    // 错误提示
    initializationError: "应用初始化失败，请刷新页面重试",
    pageElementsIncomplete: "页面元素加载不完整，请刷新页面重试",
    pleaseEnterText: "请输入要转换的文本内容",
    textTooLong: "文本内容不能超过1000个字符",
    voiceGenerationFailed: "语音生成失败",

    // 成功提示
    voiceGenerationSuccess: "语音生成成功！",

    // 进度提示
    preparing: "准备中...",
    completed: "完成",
    processing: "处理中...",

    // 操作提示
    autoFilledFromHomepage: "已自动填入您在主页输入的文本，您可以直接生成语音或进行修改。",
    noAudioToDownload: "没有可下载的音频文件",
    audioDownloadStarted: "音频下载已开始",
    audioDownloadFailed: "音频下载失败，请重试",
    noAudioUrlToCopy: "当前没有可复制的音频链接",
    audioUrlCopied: "音频链接已复制",
    copyFailed: "复制失败，请手动复制",
    noAudioToShare: "没有可分享的音频文件",
    shareTitle: "AISTONE语音合成",
    shareText: "我使用AISTONE生成了一段AI语音，快来听听吧！",
    pageLinkCopied: "页面链接已复制到剪贴板",
    noAudioToSave: "没有可保存的音频文件",
    pleaseLoginToSave: "请先登录再保存音频",
    saveFeatureComingSoon: "音频保存功能正在开发中，敬请期待！",
    audioSaveFailed: "音频保存失败",

    // 图像生成页面专用翻译
    imageGeneratorTitle: "AI 图像生成器",
    imageGeneratorSubtitle: "将文本转换为令人惊叹的AI图像",
    imageGeneratorSlogan: "释放创意，让AI为您创造视觉奇迹",
    breadcrumbImageGenerator: "图像生成",
    preparingContent: "正在准备内容...",
    generatingContent: "正在生成内容，请稍候...",

    // 弹窗内容
    aboutModal: {
      title: "关于 AISTONE",
      content:
        "AISTONE 是一个基于 Pollinations.AI 技术的智能内容创作平台，集成了文本生成图片与语音功能，致力于为用户提供高效、便捷、免费的AI内容创作体验。<br><br>我们的平台支持文本生成图片、文本生成语音等多种创作功能。无论你是设计师、内容创作者，还是普通用户，只需输入一句描述，就能一键生成高质量的视觉内容或语音内容。平台支持中英文输入，内置智能优化和多种生成参数，满足多样化的创作需求。<br><br>平台特色：<br>• 100%免费使用，无需注册，无需API密钥，保护用户隐私<br>• 支持中英文输入，内置智能优化<br>• 多种生成参数可调，满足多样化创作需求<br>• 界面简洁友好，适配多终端设备<br>• 云端算力支持，保证生成速度与质量<br><br>本项目基于先进的AI模型，结合云端算力，保证生成速度与质量。我们相信AI技术应该普惠大众，因此所有功能永久免费开放，助力每一位用户释放创意灵感，实现从文字到视觉、从文字到语音的无限可能。",
    },
    contactModal: {
      title: "联系我们",
      content:
        '如果您在使用 AISTONE 的过程中有任何问题或建议，欢迎随时与我们联系！<br><br>我们致力于为用户提供最优质的服务体验，无论是技术问题、功能建议还是合作咨询，我们都将认真对待并及时回复。<br><br>联系方式：<br>• 邮箱：<a href="mailto:support@aistone.cfd">support@aistone.cfd</a><br>• 官方网站：<a href="https://aistone.cfd" target="_blank">https://aistone.cfd</a><br>• 技术支持：24/7在线支持<br><br>服务范围：<br>• <b>产品反馈与建议：</b>我们非常重视您的体验和意见，任何功能建议或改进想法都欢迎反馈<br>• <b>技术支持：</b>遇到技术问题或使用障碍，请详细描述您的问题，我们会尽快协助解决<br>• <b>商务合作：</b>如果您有商务合作需求，欢迎通过邮箱联系我们<br>• <b>媒体采访：</b>媒体朋友如需采访或报道，请提前预约<br><br>我们会在1-2个工作日内回复您的信息。感谢您的关注与支持！',
    },
    servicesModal: {
      title: "我们的服务",
      content:
        '<ul style="margin: 18px 0 18px 0; padding-left: 1.2em; line-height: 2; color: #AAB4D4;"><li><b>AI图片生成：</b>输入描述文本，智能生成高质量、多风格的图片，支持多种分辨率和比例选择。</li><li><b>AI语音生成：</b>输入文本，一键生成自然流畅的语音音频，适用于配音、播报等多种场景。</li><li><b>智能提示词优化：</b>内置AI优化和翻译功能，自动将您的描述转化为高质量英文提示词，提升生成效果。</li><li><b>多语言支持：</b>支持中文和英文界面，满足全球用户需求。</li><li><b>永久免费：</b>所有功能对用户永久免费，无需注册，无使用次数限制。</li></ul><div style="margin-top: 12px; color: #AAB4D4;">如需了解更多服务细节，欢迎通过"联系我们"与我们取得联系。</div>',
    },
    heroTitle: "AISTONE - 免费AI图片生成与语音合成平台",
    heroSubtitle: "图片·语音·无限免费生成",
    heroSlogan: "AI驱动·一键生成·释放你的创意！",
    faqTitle: "常见问题 FAQ",
    faqQ1: "AISTONE 是否永久免费？",
    faqA1: "是的，平台所有功能永久免费，无需注册，无次数限制。",
    faqQ2: "使用平台需要登录吗？",
    faqA2: "无需登录，直接输入描述即可生成图片或语音。",
    faqQ3: "支持哪些输入语言？",
    faqA3: "支持中文和英文输入，界面可切换。",
    faqQ4: "生成的内容有版权吗？",
    faqA4: "AI生成内容归用户所有，可自由使用。",
    faqQ5: "如何反馈问题或建议？",
    faqA5: "可通过页面底部的联系方式或邮箱 support@aistone.cfd 反馈。",
    aboutModalTitle: "关于 AISTONE",
    aboutModalContent:
      "AISTONE 是一个基于 Pollinations.AI 技术的智能内容创作平台，集成了文本生成图片与语音功能，致力于为用户提供高效、便捷、免费的AI内容创作体验。<br><br>我们的平台支持文本生成图片、文本生成语音等多种创作功能。无论你是设计师、内容创作者，还是普通用户，只需输入一句描述，就能一键生成高质量的视觉内容或语音内容。平台支持中英文输入，内置智能优化和多种生成参数，满足多样化的创作需求。<br><br>平台特色：<br>• 100%免费使用，无需注册，无需API密钥，保护用户隐私<br>• 支持中英文输入，内置智能优化<br>• 多种生成参数可调，满足多样化创作需求<br>• 界面简洁友好，适配多终端设备<br>• 云端算力支持，保证生成速度与质量<br><br>本项目基于先进的AI模型，结合云端算力，保证生成速度与质量。我们相信AI技术应该普惠大众，因此所有功能永久免费开放，助力每一位用户释放创意灵感，实现从文字到视觉、从文字到语音的无限可能。",
    // Contact Page
    contactModalTitle: "联系我们",
    contactIntro: "如果您在使用 AISTONE 的过程中有任何问题或建议，欢迎随时与我们联系！我们致力于为用户提供最优质的服务体验。",
    contactEmailTitle: "邮箱联系",
    contactEmailDesc: "我们会在1-2个工作日内回复",
    contactFeedbackTitle: "在线反馈",
    contactFeedbackLink: "提交反馈表单",
    contactFeedbackDesc: "快速提交您的问题或建议",
    contactSocialTitle: "社交媒体",
    contactSocialDesc: "关注我们获取最新动态",
    contactServicesTitle: "服务范围",
    contactServiceFeedbackTitle: "💡 产品反馈与建议",
    contactServiceFeedbackDesc: "我们非常重视您的体验和意见，任何功能建议或改进想法都欢迎反馈",
    contactServiceTechTitle: "🔧 技术支持",
    contactServiceTechDesc: "遇到技术问题或使用障碍，请详细描述您的问题，我们会尽快协助解决",
    contactServiceBusinessTitle: "🤝 商务合作",
    contactServiceBusinessDesc: "如果您有商务合作需求，欢迎通过邮箱联系我们",
    contactServiceMediaTitle: "📰 媒体采访",
    contactServiceMediaDesc: "媒体朋友如需采访或报道，请提前预约",
    contactResponseTitle: "快速响应承诺",
    contactResponseDesc: "我们承诺在1-2个工作日内回复您的信息。感谢您的关注与支持！",
    // Legacy
    contactModalContent:
      '如果您在使用 AISTONE 的过程中有任何问题或建议，欢迎随时与我们联系！<br><br>我们致力于为用户提供最优质的服务体验，无论是技术问题、功能建议还是合作咨询，我们都将认真对待并及时回复。<br><br>联系方式：<br>• 邮箱：<a href="mailto:support@aistone.cfd">support@aistone.cfd</a><br>• 官方网站：<a href="https://aistone.cfd" target="_blank">https://aistone.cfd</a><br>• 技术支持：24/7在线支持<br><br>服务范围：<br>• <b>产品反馈与建议：</b>我们非常重视您的体验和意见，任何功能建议或改进想法都欢迎反馈<br>• <b>技术支持：</b>遇到技术问题或使用障碍，请详细描述您的问题，我们会尽快协助解决<br>• <b>商务合作：</b>如果您有商务合作需求，欢迎通过邮箱联系我们<br>• <b>媒体采访：</b>媒体朋友如需采访或报道，请提前预约<br><br>我们会在1-2个工作日内回复您的信息。感谢您的关注与支持！',
    servicesModalTitle: "我们的服务",
    servicesModalContent:
      '<ul style="margin: 18px 0 18px 0; padding-left: 1.2em; line-height: 2; color: #AAB4D4;"><li><b>AI图片生成：</b>输入描述文本，智能生成高质量、多风格的图片，支持多种分辨率和比例选择。</li><li><b>AI语音生成：</b>输入文本，一键生成自然流畅的语音音频，适用于配音、播报等多种场景。</li><li><b>智能提示词优化：</b>内置AI优化和翻译功能，自动将您的描述转化为高质量英文提示词，提升生成效果。</li><li><b>多语言支持：</b>支持中文和英文界面，满足全球用户需求。</li><li><b>永久免费：</b>所有功能对用户永久免费，无需注册，无使用次数限制。</li></ul><div style="margin-top: 12px; color: #AAB4D4;">如需了解更多服务细节，欢迎通过"联系我们"与我们取得联系。</div>',
    tagFree: "100% 免费",
    tagUnlimited: "无限生成",
    tagNoLogin: "无需登录",
    faqTip: "如有更多疑问，欢迎通过页面底部联系我们",
    faqQ6: "生成速度慢或失败怎么办？",
    faqA6: "如遇高峰期可能稍慢，请耐心等待或稍后重试。如持续失败请联系客服。",
    faqQ7: "平台有API接口吗？",
    faqA7: "支持API调用，详见开发文档或联系客服获取API接入方式。",
    faqQ8: "如何保护用户隐私？",
    faqA8: "平台不存储用户输入和生成内容，所有数据实时处理，保障隐私安全。",
    faqQ9: "未来会不会收费或限制？",
    faqA9: "目前永久免费，无次数限制。如有变动会提前公告。",
    faqQ10: "如何加入交流群或获取最新动态？",
    faqA10: "可关注官网、公众号或联系客服，获取交流群二维码和最新资讯。",
    heroIntro:
      "AISTONE 是一个集AI图片生成与语音合成于一体的智能创作平台，支持中英文输入，永久免费，无需注册。无论你是设计师、内容创作者还是普通用户，只需一句描述，即可一键生成高质量图片和自然语音，释放无限创意。平台注重隐私保护，所有内容实时生成不留存，助力每一位用户高效创作、自由分享。",
    testimonialsTitle: "用户评价与真实案例",
    testimonialName1: "Sarah Chen",
    testimonialRole1: "插画师",
    testimonialContent1: "平台生成的插画非常精美，极大提升了我的设计效率！",
    testimonialName2: "Alex Wang",
    testimonialRole2: "短视频创作者",
    testimonialContent2: "AI语音自然流畅，直接用于我的短视频配音。",
    testimonialName3: "李明",
    testimonialRole3: "独立开发者",
    testimonialContent3: "一键生成图片和语音，创作效率翻倍，强烈推荐！",
    testimonialName4: "Emily Zhang",
    testimonialRole4: "产品经理",
    testimonialContent4: "AI内容生成工具极大提升了团队的创意产出效率。",
    testimonialName5: "Tom Lee",
    testimonialRole5: "自媒体人",
    testimonialContent5: "生成速度快，内容质量高，值得推荐！",
    imageInfoSize: "Size",
    imageInfoFileSize: "File Size",
    imageInfoCount: "Total {count} images generated, click image to enlarge",
    pixels: "pixels",
    userMetaDescription: "AISTONE 个人中心 - 登录后管理你的高清图片与账户信息。",
    loginTitle: "用户登录",
    registerTitle: "用户注册",
    emailLabel: "邮箱地址",
    passwordLabel: "密码",
    confirmPasswordLabel: "确认密码",
    login: "登录",
    register: "注册",
    noAccount: "还没有账号？",
    registerNow: "立即注册",
    haveAccount: "已有账号？",
    loginNow: "立即登录",
    // User center page
    userAccountTitle: "账户资料",
    userGreeting: "您好，{name}",
    userUsername: "用户名",
    userEmail: "邮箱",
    userUpdateProfile: "更新资料",
    userChangePasswordTitle: "修改密码",
    userNewPassword: "新密码",
    userConfirmPassword: "确认新密码",
    userSave: "保存",
    userNotLoggedIn: "请先登录后使用个人中心功能",
    userLoginNow: "立即登录",
    userFeatureComing: "功能开发中，敬请期待",
    userUpdateSuccess: "更新成功",
    userPasswordMismatch: "两次输入的密码不一致",

    // 顶部用户区
    userCenter: "个人中心",
    logout: "登出",
    userCenterDevTip: "个人中心功能开发中...",

    // 高清图片管理
    hdTitle: "📸 今日高清图片",
    hdRefresh: "刷新",
    hdGeneratedLabel: "已生成:",
    hdRemainingTimeLabel: "剩余时间:",
    hdSaving: "正在保存高清图片...",
    hdEmptyTitle: "还没有保存的图片",
    hdEmptyDesc: "生成的图片会在这里显示，最多保存3张",
    hdPreviewTitle: "高清图片预览",
    hdDownloadHD: "下载高清",
    hdClickToView: "点击查看高清图片",
    hdLabelSize: "尺寸:",
    hdLabelModel: "模型:",
    hdLabelSeed: "种子:",
    hdLabelTime: "时间:",
    delete: "删除",

    // AI指南页面
    aiGuideTitle: "AI图像生成指南",
    aiGuideMainTitle: "AI图像生成完整指南",
    aiGuideSubtitle: "从基础理论到实战技巧，成为AI艺术创作专家",
    aiGuideAuthor: "AISTONE技术团队",
    aiGuideDate: "2025年9月9日",
    aiGuideReadingTime: "约10分钟阅读",

    // AI指南目录
    aiGuideTocTitle: "📋 目录",
    aiGuideToc1: "1. AI图像生成技术概述",
    aiGuideToc2: "2. 主流AI模型深度解析",
    aiGuideToc3: "3. 提示词工程实战技巧",
    aiGuideToc4: "4. 高质量图像生成策略",
    aiGuideToc5: "5. 常见问题与解决方案",
    aiGuideToc6: "6. 进阶创作技巧与工作流",

    // AI指南第一章
    aiGuideChapter1Title: "🧠 1. AI图像生成技术概述",
    aiGuideWhatIsTitle: "什么是AI图像生成？",
    aiGuideWhatIsDesc:
      "AI图像生成是一种利用深度学习技术，通过文本描述自动创建图像的革命性技术。这项技术基于大规模的图像-文本数据集训练，能够理解自然语言描述并将其转换为视觉内容。",
    aiGuideTechHistoryTitle: "🔥 技术发展历程",

    // 提示词工程页面
    promptEngineeringTitle: "提示词工程教程",
    promptEngineeringMainTitle: "提示词工程专业教程",
    promptEngineeringSubtitle: "掌握AI图像生成的核心技能 - 从基础语法到高级策略",
    promptEngineeringAuthor: "AISTONE专家团队",
    promptEngineeringDate: "2025年9月9日",
    promptEngineeringReadingTime: "约12分钟阅读",

    // 提示词工程课程概览（中文）
    promptOverviewTitle: "🎯 课程概览",
    promptBasicSyntaxTitle: "🚀 基础语法",
    promptBasicSyntaxDesc: "掌握提示词的基本结构和组织原则",
    promptWeightControlTitle: "⚡ 权重控制",
    promptWeightControlDesc: "学会精确控制各元素的重要性",
    promptNegativeTitle: "🚫 负面提示词",
    promptNegativeDesc: "排除不需要的元素，提升生成质量",
    promptStyleTitle: "🎨 风格融合",
    promptStyleDesc: "创造独特的艺术风格和视觉效果",

    // 关于页面
    aboutHeroTitle: "AISTONE - 重新定义内容创作",
    aboutHeroSubtitle:
      "基于最新AI技术的专业内容创作平台，为创作者和企业提供高效、智能的图像生成与语音合成解决方案",
    // About extra dates
    aboutTimelineDate1: "2024年3月",
    aboutTimelineDate2: "2024年6月",
    aboutTimelineDate3: "2024年9月",
    aboutTimelineDate4: "2024年12月",
    aboutTimelineDate5: "2025年3月",
    aboutTimelineDate6: "2025年未来",

    // 服务页面相关内容推荐
    relatedContentTitle: "✨ 继续探索",
    relatedImageGen: "🎨 AI图片生成",
    tryNow: "前往体验 →",
    relatedAIGuide: "🧠 AI技术指南",
    relatedAIGuideDesc: "深入了解AI语音合成技术原理和应用实践",
    learnMore: "了解更多 →",
    relatedTutorial: "📖 使用教程",
    startLearning: "开始学习 →",
    relatedImageGenTitle: "🎨 AI图片生成",
    relatedImageGenDesc: "体验我们的核心服务，将想法转化为精美图像",
    relatedVoiceGenTitle: "🎵 AI语音合成",
    relatedVoiceGenDesc: "将文字转换为自然语音，完全免费使用",
    relatedTutorialTitle: "📖 快速上手",
    relatedTutorialDesc: "学习如何使用各项功能，获得最佳体验",
    relatedAboutTitle: "ℹ️ 了解技术",
    relatedAboutDesc: "深入了解我们的AI技术和平台愿景",
  },
};

// 兼容处理移除：已静态合并为单一 en

// 获取当前语言
function getCurrentLang() {
  const storedRaw = localStorage.getItem("preferred_language");
  const storedLang = normalizeLang(storedRaw);
  console.log("从localStorage获取语言:", storedRaw, "→", storedLang); // 调试日志
  return storedLang;
}

// 更新语言切换按钮状态
// eslint-disable-next-line no-unused-vars
function updateLanguageButtons() {
  const currentLang = getCurrentLang();
  const langSelect = document.getElementById("lang-select");
  if (langSelect) {
    langSelect.value = currentLang;
  }
}

// 新增递归读取函数
function getNestedI18nValue(lang, keyPath) {
  if (!i18n || !i18n[lang]) {
    return undefined;
  }

  // 直接检查平级键
  if (i18n[lang][keyPath]) {
    return i18n[lang][keyPath];
  }

  // 如果没有点分隔符，直接返回
  if (keyPath.indexOf(".") === -1) {
    return i18n[lang][keyPath];
  }

  // 处理嵌套路径
  const keys = keyPath.split(".");
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
  const normalized = normalizeLang(lang);
  if (i18n[normalized]) {
    try {
      // 保存语言设置
      localStorage.setItem("preferred_language", normalized);
      // 设置HTML lang属性，使用标准的语言代码
      const langCode = normalized === "zh" ? "zh-CN" : "en";
      document.documentElement.lang = langCode;
      // console.log('[i18n] 语言已保存到localStorage:', lang, 'HTML lang属性设置为:', langCode);

      // 更新所有带有data-i18n属性的元素
      document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        const value = getNestedI18nValue(normalized, key);
        console.log(`[i18n DEBUG] setLanguage processing key="${key}", value="${value ? value.substring(0, 50) : 'null'}...", lang=${normalized}`);
        if (value && value !== key && typeof value === "string") {
          if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
            el.placeholder = value;
          } else if (el.tagName === "OPTION") {
            el.textContent = value;
          } else {
            // 检查元素是否有需要保留的子元素（如图片、按钮等）
            const hasPreservableChildren = el.querySelectorAll("img, button, a, svg").length > 0;
            if (hasPreservableChildren) {
              // 有需要保留的子元素，查找并更新span或文本节点
              // 优先查找span元素
              const span = el.querySelector("span");
              if (span) {
                span.textContent = value;
              } else {
                // 没有span，清除所有文本节点并添加新的
                // 先移除所有现有的文本节点
                Array.from(el.childNodes).forEach(node => {
                  if (node.nodeType === Node.TEXT_NODE) {
                    node.remove();
                  }
                });
                // 在开头插入新的文本节点
                el.insertBefore(document.createTextNode(value), el.firstChild);
              }
            } else {
              // 没有需要保留的子元素，直接完全替换内容
              el.textContent = value;
            }
          }
          console.log(`[i18n] setLanguage 已更新元素 [data-i18n=${key}]`);
        } else if (!value) {
          console.warn(`[i18n] setLanguage 未找到翻译键: ${key}`);
        }
      });

      // 更新特定元素
      const elements = {
        title: "title",
        heroTitle: ".hero-title",
        heroSubtitle: ".hero-subtitle",
        heroSlogan: ".hero-slogan",
        heroIntro: ".hero-intro",
        inputTitle: ".input-section h2",
        quickFillLabel: ".examples-label",
        negativePromptLabel: ".negative-prompt h3",
        generationType: ".options h3",
        typeImage: 'label[for="type-image"]',
        typeAudio: 'label[for="type-audio"]',
        imageOptions: ".image-options h3",
        aspectRatio: 'label[for="option-aspect-ratio"]',
        width: 'label[for="option-width"]',
        height: 'label[for="option-height"]',
        noLogo: 'label[for="option-nologo"]',
        numImages: 'label[for="option-num-images"]',
        clearButton: "#clear-btn",
        optimizeButton: "#optimize-btn",
        randomButton: "#random-btn",
        generateButton: "#generate-button",
      };

      for (const [key, selector] of Object.entries(elements)) {
        const element = document.querySelector(selector);
        if (element && i18n[normalized][key]) {
          if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
            element.placeholder = i18n[normalized][key];
          } else {
            element.textContent = i18n[normalized][key];
          }
          console.log(`[i18n] 已更新元素 ${selector}`);
        }
      }

      // 更新示例按钮
      document.querySelectorAll(".example-btn").forEach((btn) => {
        const i18nNameKey = btn.dataset.i18nName;
        if (i18nNameKey) {
          btn.textContent = getNestedI18nValue(normalized, i18nNameKey);
          // 赋值text和type
          const parts = i18nNameKey.split(".");
          if (parts.length === 3 && parts[0] === "examples") {
            const exampleKey = parts[1];
            const textVal = getNestedI18nValue(normalized, `examples.${exampleKey}.text`);
            const typeVal = getNestedI18nValue(normalized, `examples.${exampleKey}.type`);
            if (textVal) btn.dataset.text = textVal;
            if (typeVal) btn.dataset.type = typeVal;
          }
        }
      });

      // 更新提示文本
      const typeHint = document.getElementById("type-hint");
      if (typeHint) {
        const isImage = document.getElementById("type-image")?.checked;
        typeHint.textContent = isImage ? i18n[normalized].imageHint : i18n[normalized].audioHint;
      }

      // 强制更新语音模型显示
      const voiceModelEl = document.getElementById("used-voice-model");
      if (voiceModelEl && voiceModelEl.textContent && voiceModelEl.textContent !== "--") {
        // 获取当前选中的语音模型
        const voiceSelect = document.getElementById("voice-model");
        if (voiceSelect && window.getVoiceName) {
          const currentVoice = voiceSelect.value;
          voiceModelEl.textContent = window.getVoiceName(currentVoice);
        }
      }

      // 强制更新select option元素（防止被其他代码覆盖）
      const forceUpdateOptions = () => {
        const voiceSelect = document.getElementById("voice-model");
        if (!voiceSelect) {
          // 生成页通常不会挂载语音选择器，降级为一次性的调试日志
          console.debug("[i18n] Voice select element not found on this page, skip option update");
          return false;
        }
        console.log(`[i18n] Force updating voice select options for language: ${lang}`);

        // 优先使用 data-i18n；若缺失则从 value 映射到对应 key
        const valueToKey = {
          nova: "voiceNova",
          alloy: "voiceAlloy",
          echo: "voiceEcho",
          fable: "voiceFable",
          onyx: "voiceOnyx",
          shimmer: "voiceShimmer",
        };

        const options = voiceSelect.querySelectorAll("option");
        console.log(`[i18n] Found ${options.length} options to update`);
        options.forEach((option) => {
          const key = option.getAttribute("data-i18n") || valueToKey[option.value];
          const oldText = option.textContent;

          let value = key ? getNestedI18nValue(normalized, key) : undefined;
          if (!value && typeof window.getVoiceName === "function") {
            // 回退：使用 value → name 的动态函数
            try {
              value = window.getVoiceName(option.value);
            } catch (_) {}
          }

          if (value && value !== key && typeof value === "string") {
            option.textContent = value;
            console.log(
              `[i18n] Updated option: ${key || option.value} = "${oldText}" → "${value}"`
            );
          } else if (key) {
            console.warn(`[i18n] No translation found for option key: ${key}`);
          }
        });

        return true;
      };

      // 立即执行一次；若不存在语音选择器则无需后续重试
      const shouldRetryVoiceOptions = forceUpdateOptions();
      if (shouldRetryVoiceOptions) {
        // 延迟执行防止被覆盖
        setTimeout(forceUpdateOptions, 50);
        setTimeout(forceUpdateOptions, 200);
        setTimeout(forceUpdateOptions, 500);
      }

      // 触发语言变更事件
      const event = new CustomEvent("languageChanged", { detail: { language: normalized } });
      document.dispatchEvent(event);
      console.log("[i18n] 已触发languageChanged事件");

      // 主动刷新页面文本，确保立即生效
      if (typeof updatePageText === "function") {
        console.log("[i18n] setLanguage 调用 updatePageText() 立即刷新文案");
        updatePageText();
      }

      markLanguageReady();
      return true;
    } catch (error) {
      console.error("[i18n] 设置语言时发生错误:", error);
      markLanguageReady();
      return false;
    }
  }
  console.warn("[i18n] 不支持的语言:", lang);
  markLanguageReady();
  return false;
}

// 获取翻译文本
function t(key) {
  const lang = getCurrentLang();
  const keys = key.split(".");
  let value = i18n[lang];

  for (const k of keys) {
    if (value && value[k] !== undefined) {
      value = value[k];
    } else {
      console.warn(`[i18n] Translation missing for key: ${key} in language: ${lang}`);
      return key;
    }
  }

  console.log(`[i18n] t('${key}') =`, value, "lang=", lang);
  return value;
}

// 更新页面所有文本
function updatePageText() {
  const lang = getCurrentLang();
  const dict = i18n[lang];
  console.log("[i18n] updatePageText called, lang=", lang);

  try {
    // 更新标题（按页面优先使用特定标题键）
    let pageTitle = dict.title;
    if (document.body.classList.contains("voice-page") && dict.voiceHeroTitle) {
      pageTitle = dict.voiceHeroTitle;
    } else if (document.location.pathname.includes("image-generator") && dict.imageGeneratorTitle) {
      pageTitle = dict.imageGeneratorTitle;
    }
    document.title = pageTitle;

    // 同步 og:title 与 twitter:title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", pageTitle);
    const twitterTitle = document.querySelector('meta[property="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute("content", pageTitle);
    console.log("[i18n] 已更新页面标题");

    // 更新所有带有data-i18n属性的元素
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const value = getNestedI18nValue(lang, key);
      if (value && value !== key && typeof value === "string") {
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
          el.placeholder = value;
        } else if (el.tagName === "OPTION") {
          el.textContent = value;
        } else {
          // 检查元素是否有需要保留的子元素（如图片、按钮等）
          const hasPreservableChildren = el.querySelectorAll("img, button, a, svg").length > 0;
          if (hasPreservableChildren) {
            // 有需要保留的子元素，查找并更新span或文本节点
            // 优先查找span元素
            const span = el.querySelector("span");
            if (span) {
              span.textContent = value;
            } else {
              // 没有span，清除所有文本节点并添加新的
              // 先移除所有现有的文本节点
              Array.from(el.childNodes).forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                  node.remove();
                }
              });
              // 在开头插入新的文本节点
              el.insertBefore(document.createTextNode(value), el.firstChild);
            }
          } else {
            // 没有需要保留的子元素，直接完全替换内容
            el.textContent = value;
          }
        }
        console.log(`[i18n] updatePageText 已更新元素 [data-i18n=${key}]`);
      } else if (!value) {
        console.warn(`[i18n] updatePageText 未找到翻译键: ${key}`);
      }
    });

    // 更新特定元素
    const heroTitle = document.querySelector(".hero-title");
    if (heroTitle) {
      // 若有更具体的页面级标题键（如 voiceHeroTitle），优先使用，否则回退通用 title
      const specificTitleKey = document.body.classList.contains("voice-page")
        ? "voiceHeroTitle"
        : undefined;
      heroTitle.textContent = (specificTitleKey && dict[specificTitleKey]) || dict.title;
      console.log("[i18n] 已更新hero标题");
    }

    const heroSubtitle = document.querySelector(".hero-subtitle");
    if (heroSubtitle) {
      const specificSubtitleKey = document.body.classList.contains("voice-page")
        ? "voiceHeroSubtitle"
        : undefined;
      heroSubtitle.textContent =
        (specificSubtitleKey && dict[specificSubtitleKey]) || dict.subtitle;
      console.log("[i18n] 已更新hero副标题");
    }

    // 更新输入区域
    const textInput = document.getElementById("text-input");
    if (textInput) {
      textInput.placeholder = dict.inputPlaceholder;
      console.log("[i18n] 已更新输入框placeholder");
    }

    // 更新生成按钮
    const generateButton = document.getElementById("generate-button");
    if (generateButton) {
      generateButton.textContent = dict.generateButton;
      console.log("[i18n] 已更新生成按钮文本");
    }

    // 更新其他UI元素
    const elements = {
      inputTitle: ".input-section h2",
      quickFillLabel: ".examples-label",
      negativePromptLabel: ".negative-prompt h3",
      generationType: ".options h3",
      typeImage: 'label[for="type-image"]',
      typeAudio: 'label[for="type-audio"]',
      imageOptions: ".image-options h3",
      aspectRatio: 'label[for="option-aspect-ratio"]',
      width: 'label[for="option-width"]',
      height: 'label[for="option-height"]',
      noLogo: 'label[for="option-nologo"]',
      numImages: 'label[for="option-num-images"]',
      clearButton: "#clear-btn",
      optimizeButton: "#optimize-btn",
      randomButton: "#random-btn",
    };

    for (const [key, selector] of Object.entries(elements)) {
      const element = document.querySelector(selector);
      if (element && dict[key]) {
        element.textContent = dict[key];
        console.log(`[i18n] 已更新元素 ${selector}`);
      }
    }

    console.log("[i18n] 页面文本更新完成");

    // 修复：同步更新示例按钮内容
    document.querySelectorAll(".example-btn").forEach((btn) => {
      const i18nNameKey = btn.dataset.i18nName;
      if (i18nNameKey) {
        btn.textContent = getNestedI18nValue(lang, i18nNameKey);
        // 赋值text和type
        const parts = i18nNameKey.split(".");
        if (parts.length === 3 && parts[0] === "examples") {
          const exampleKey = parts[1];
          const textVal = getNestedI18nValue(lang, `examples.${exampleKey}.text`);
          const typeVal = getNestedI18nValue(lang, `examples.${exampleKey}.type`);
          if (textVal) btn.dataset.text = textVal;
          if (typeVal) btn.dataset.type = typeVal;
        }
      }
    });
  } catch (error) {
    console.error("[i18n] 更新页面文本时发生错误:", error);
  }
}

// 监听语言变更事件
document.addEventListener("languageChanged", () => {
  updatePageText();
});

// 初始化时更新页面文本
function initI18n() {
  console.log("[i18n] initializing i18n...");
  // 初始化语言选择器
  const langSelect = document.getElementById("lang-select");
  const currentLang = getCurrentLang();
  if (langSelect) {
    langSelect.value = currentLang === "zh" ? "zh" : "en";
    langSelect.addEventListener("change", (e) => {
      console.log("[i18n] lang-select changed:", e.target.value);
      setLanguage(e.target.value);
    });
  }
  // 使用setLanguage确保所有data-i18n元素正确处理
  setLanguage(currentLang);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initI18n);
} else {
  // 文档已就绪，立即初始化
  initI18n();
}

// 兜底：在所有资源加载完成后再次应用语言，避免其他脚本覆盖文案
if (typeof window !== "undefined") {
  window.addEventListener("load", function () {
    try {
      const lang = getCurrentLang();
      setLanguage(lang);
      // 多次微延迟刷新，确保异步注入的节点也被覆盖
      setTimeout(updatePageText, 50);
      setTimeout(updatePageText, 200);
    } catch (e) {
      console.warn("[i18n] load fallback failed:", e);
    }
  });
}

// 将函数设为全局变量
window.getCurrentLang = getCurrentLang;
window.setLanguage = setLanguage;
window.t = t;
window.i18n = i18n;
window.updatePageText = updatePageText;
window.markLanguageReady = markLanguageReady;
