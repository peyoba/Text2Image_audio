import { fetchWithRetry } from "../utils/fetch.js";
import { logInfo } from "../utils/logger.js";

export async function optimizePromptWithDeepseek(textPrompt, env) {
  let deepseekApiUrl = env.DEEPSEEK_API_URL || "https://api.siliconflow.cn/v1/chat/completions";
  if (!deepseekApiUrl.endsWith("/v1/chat/completions")) {
    deepseekApiUrl = deepseekApiUrl.endsWith("/")
      ? deepseekApiUrl + "v1/chat/completions"
      : deepseekApiUrl + "/v1/chat/completions";
  }

  const deepseekApiKey = env.DEEPSEEK_API_KEY;
  if (!deepseekApiKey) {
    console.error("[Worker Error] DEEPSEEK_API_KEY not found in environment variables.");
    throw new Error("服务器配置错误：DeepSeek API密钥未配置");
  }

  const engineeredPrompt = `你是一个顶级的提示词工程师，专注于为最先进的文生图模型创作具有艺术性和画面感的提示词。请严格基于用户提供的原始描述中的核心主体、数量、场景和明确指定的风格（例如"写实风格"、"卡通风格"、"油画风格"等），进行优化和丰富。
你的任务是：
1.  **精准翻译与丰富细节**：将用户的中文描述准确翻译成艺术感强且表意清晰的英文。在用户描述基础上，智能补充能显著提升画面效果的细节，包括但不限于：
    *   **人物**：姿态、表情、眼神（确保清晰可见）、服装的材质与款式、配饰等。
    *   **环境**：若用户未指定，则根据主体选择一个和谐且出图效果好的场景（例如：简洁明亮的摄影棚背景、阳光明媚的户外草地/公园、温馨的室内客厅、有氛围感的咖啡馆角落等）。确保场景描述具体，且不会喧宾夺主或不当遮挡主体。
    *   **光照**：使用专业且能营造氛围的光照描述（例如：柔和的自然窗边光、专业的蝴蝶光或伦勃朗光、温暖的黄金时刻光照、戏剧性的体积光、霓虹灯氛围等），确保主体有良好、清晰的照明，避免重要区域（如面部）完全陷入阴影。
    *   **构图与视角**：可适当添加如 'close-up portrait' (特写肖像), 'waist-up shot' (半身照), 'dynamic angle' (动态视角) 等构图提示。**构图时应优先保证核心主体的清晰度和完整性。**
2.  **保留并强化核心要素与主体完整清晰**：确保最终的英文提示词准确反映用户的核心意图。特别是主体数量、性别、年龄段、种族（如果提及）以及用户已明确指定的场景和风格（如 '赛博朋克城市街道', '梵高油画风格'）必须保留并得到强化。**力求画面中的所有主体（人物、动物等）都得到完整、清晰、无不当遮挡的呈现，尤其是面部特征必须清晰可见。避免重要部分被不自然地截断、隐藏或被次要元素严重遮挡。**如果用户仅指定了宽泛风格如"写实"，请向"摄影级真实感 (photorealistic)"方向优化，注重细节和质感。
3.  **提升画面质量的通用词汇**：在优化后的提示词中，酌情加入能普遍提升AI绘图效果的通用高品质描述，例如：'masterpiece', 'best quality', 'high resolution', 'highly detailed', 'intricate details', 'sharp focus', 'cinematic lighting', 'professional photography'。
4.  **避免过度解读和无关添加**：不要添加与用户原始描述核心内容无关或冲突的概念。保持提示词的连贯性和主题集中。
5.  **输出格式**：只输出优化和丰富后的高质量英文提示词，不要包含任何其他解释或说明文字。

原始描述：${textPrompt}`;

  const headers = {
    Authorization: `Bearer ${deepseekApiKey}`,
    "Content-Type": "application/json",
  };
  const payload = {
    model: env.DEEPSEEK_MODEL || "deepseek-ai/DeepSeek-V2.5",
    messages: [{ role: "user", content: engineeredPrompt }],
    temperature: 0.5,
  };

  logInfo(env, `[Worker Log] 向 DeepSeek API 发送请求 (服务: optimizePromptWithDeepseek)`);

  try {
    const response = await fetchWithRetry(
      deepseekApiUrl,
      {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      },
      "DeepSeek Chat Completions",
      env
    );

    if (!response.ok) {
      const errorContent = await response.text();
      console.error(
        `[Worker Error] DeepSeek API HTTPError: Status ${response.status}, Response: ${errorContent}`
      );
      return {
        error: `优化API调用失败 (HTTP ${response.status})`,
        details: errorContent,
        optimized_text: textPrompt,
        raw_optimized: textPrompt,
        original_prompt: textPrompt,
      };
    }

    const result = await response.json();
    const optimizedTextRaw = result.choices?.[0]?.message?.content?.trim() || "";

    const englishPattern = /[a-zA-Z0-9\s.,!?'":;()[\]{}<>#@$%^&*+=_\\|/~-]+/g;
    const englishParts = optimizedTextRaw.match(englishPattern) || [];
    let optimizedText = englishParts.join(" ").trim();

    if (!optimizedText && optimizedTextRaw) {
      console.warn(
        `[Worker Warning] DeepSeek优化后的提示词清洗后为空（原始：'${optimizedTextRaw}'）。将返回原始优化文本。`
      );
      optimizedText = optimizedTextRaw;
    } else if (!optimizedTextRaw) {
      console.error("[Worker Error] DeepSeek API返回了完全空的内容。将使用原始提示。");
      return {
        error: "优化API返回空内容",
        optimized_text: textPrompt,
        raw_optimized: textPrompt,
        original_prompt: textPrompt,
      };
    }

    if (optimizedTextRaw.length > optimizedText.length + 10 && /[\u4e00-\u9fff]/.test(textPrompt)) {
      console.warn(
        `[Worker Warning] 清洗后的提示词长度显著减少。原始: '${optimizedTextRaw}', 清洗后: '${optimizedText}'.`
      );
    }

    logInfo(env, `[Worker Log] 优化后的提示词 (原始): ${optimizedTextRaw}`);
    logInfo(env, `[Worker Log] 优化后的提示词 (清洗后): ${optimizedText}`);
    return {
      optimized_text: optimizedText,
      raw_optimized: optimizedTextRaw,
      original_prompt: textPrompt,
    };
  } catch (error) {
    console.error(`[Worker Error] DeepSeek API 调用时发生未知错误: ${error.message}`);
    console.error(error.stack);
    return {
      error: `优化API调用失败: ${error.message}`,
      optimized_text: textPrompt,
      raw_optimized: textPrompt,
      original_prompt: textPrompt,
    };
  }
}

export async function translateNegativePrompt(text, env) {
  const deepseekApiKey = env.DEEPSEEK_API_KEY;
  if (!deepseekApiKey) {
    console.error("[Worker Error] DEEPSEEK_API_KEY not set for translateNegativePrompt.");
    throw new Error("服务器配置错误：翻译服务不可用");
  }

  let deepseekApiUrl = env.DEEPSEEK_API_URL || "https://api.siliconflow.cn/v1/chat/completions";
  if (!deepseekApiUrl.endsWith("/v1/chat/completions")) {
    deepseekApiUrl = deepseekApiUrl.endsWith("/")
      ? deepseekApiUrl + "v1/chat/completions"
      : deepseekApiUrl + "/v1/chat/completions";
  }

  const prompt = `请将下列中文负面提示词精准翻译为英文，保持逗号分隔，且不要添加任何修饰或润色，只输出英文短语列表：\n${text}`;
  const headers = {
    Authorization: `Bearer ${deepseekApiKey}`,
    "Content-Type": "application/json",
  };
  const payload = {
    model: env.DEEPSEEK_MODEL || "deepseek-ai/DeepSeek-V2.5",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  };

  const response = await fetchWithRetry(
    deepseekApiUrl,
    {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    },
    "DeepSeek Chat Completions",
    env
  );

  if (!response.ok) {
    console.error(
      `[Worker Error] DeepSeek API call failed for translation with status: ${response.status}`
    );
    return { translated_text: text, translated: false };
  }

  const result = await response.json();
  const translated = result.choices?.[0]?.message?.content?.trim() || text;
  return { translated_text: translated, translated: true };
}
