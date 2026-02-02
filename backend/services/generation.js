import { fetchWithRetry } from "../utils/fetch.js";
import { logInfo } from "../utils/logger.js";

/**
 * 免费模型列表 - 使用旧 API (image.pollinations.ai)
 * 这些模型可以免费无限使用，仅有速率限制
 * 2026-02 更新：根据 Pollinations 最新定价，只有 flux 和 zimage 完全免费
 */
const FREE_MODELS = ["flux", "zimage"];

/**
 * 付费模型列表 - 使用新 API (gen.pollinations.ai)
 * 这些模型需要 Pollen 积分，提供更高级的功能
 * 2026-02 更新：turbo 现在也需要 Pollen 积分 (0.0003/张)
 */
const PREMIUM_MODELS = [
  "turbo",             // SDXL Turbo - 现在需要积分 (0.0003/张)
  "kontext",           // FLUX.1 Kontext - 图像编辑
  "klein",             // FLUX.2 Klein 4B
  "klein-large",       // FLUX.2 Klein 9B
  "gptimage",          // GPT Image Mini
  "gptimage-large",    // GPT Image 1.5
  "nanobanana",        // NanoBanana (Gemini)
  "nanobanana-pro",    // NanoBanana Pro
  "seedream",          // Seedream 4.0 (字节跳动)
  "seedream-pro",      // Seedream 4.5 Pro
];

/**
 * 判断模型是否为付费模型
 */
function isPremiumModel(model) {
  return PREMIUM_MODELS.includes(model);
}

/**
 * 使用 Pollinations API 生成图片
 * 2026-01 更新：根据模型类型自动选择 API
 * - 免费模型：使用 image.pollinations.ai (无需 API Key)
 * - 付费模型：使用 gen.pollinations.ai (需要 Pollen 积分)
 */
export async function generateImageFromPollinations(
  prompt,
  env,
  width,
  height,
  seed,
  nologo,
  negative,
  model = "flux"
) {
  // 根据模型类型选择 API
  if (isPremiumModel(model)) {
    return generateImageWithPremiumApi(prompt, env, width, height, seed, nologo, negative, model);
  } else {
    return generateImageWithFreeApi(prompt, env, width, height, seed, nologo, negative, model);
  }
}

/**
 * 使用免费 API 生成图片 (image.pollinations.ai)
 * 支持模型：flux, turbo, zimage
 */
async function generateImageWithFreeApi(prompt, env, width, height, seed, nologo, negative, model) {
  const imageApiBase = "https://image.pollinations.ai";
  const referrer = env.POLLINATIONS_REFERRER || "aistone.org";

  // 构建请求参数
  const params = new URLSearchParams();
  if (width) params.append("width", width);
  if (height) params.append("height", height);
  if (seed && seed !== -1) params.append("seed", seed);
  if (nologo) params.append("nologo", "true");
  if (negative) params.append("negative", negative);
  if (model) params.append("model", model);
  params.append("referrer", referrer);

  // 免费 API 端点格式：/prompt/{prompt}
  const fullUrl = `${imageApiBase}/prompt/${encodeURIComponent(prompt)}?${params.toString()}`;
  logInfo(env, `[Worker Log] [免费API] 生成图片 (模型: ${model})`);

  const response = await fetchWithRetry(
    fullUrl,
    {
      method: "GET",
      headers: {
        "Referer": `https://${referrer}/`,
      },
    },
    "Pollinations Free API",
    env
  );

  return response.arrayBuffer();
}

/**
 * 使用付费 API 生成图片 (gen.pollinations.ai)
 * 支持高级模型：kontext, klein, gptimage, nanobanana, seedream 等
 * 需要配置 POLLINATIONS_API_TOKEN
 */
async function generateImageWithPremiumApi(prompt, env, width, height, seed, nologo, negative, model) {
  const genApiBase = env.POLLINATIONS_GEN_API_BASE || "https://gen.pollinations.ai";
  const apiToken = env.POLLINATIONS_API_TOKEN || env.POLLINATIONS_API_KEY;

  // 付费模型必须有 API Token
  if (!apiToken) {
    throw new Error(
      `模型 "${model}" 是付费模型，需要 Pollen 积分。` +
      `请访问 https://enter.pollinations.ai 购买积分，或选择免费模型 (flux, turbo, zimage)。`
    );
  }

  // 构建请求参数
  const params = new URLSearchParams();
  if (width) params.append("width", width);
  if (height) params.append("height", height);
  if (seed && seed !== -1) params.append("seed", seed);
  if (nologo) params.append("nologo", "true");
  if (negative) params.append("negative", negative);
  params.append("model", model);

  // 付费 API 端点格式：/image/{prompt}
  const fullUrl = `${genApiBase}/image/${encodeURIComponent(prompt)}?${params.toString()}`;
  logInfo(env, `[Worker Log] [付费API] 生成图片 (模型: ${model})`);

  const response = await fetchWithRetry(
    fullUrl,
    {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiToken}`,
      },
    },
    "Pollinations Premium API",
    env
  );

  return response.arrayBuffer();
}

/**
 * 使用 Pollinations API 生成音频
 * 2026-01 更新：语音生成需要 Pollen 积分，使用 gen.pollinations.ai
 * 如果没有配置 API Token，则抛出友好错误提示
 * 可用声音：alloy, echo, fable, onyx, nova, shimmer, coral, verse, ballad, ash, sage
 */
export async function generateAudioFromPollinations(prompt, env, voice = "nova", model = "openai-audio", speed) {
  // 语音生成需要 API Token (Pollen 积分)
  const genApiBase = env.POLLINATIONS_GEN_API_BASE || "https://gen.pollinations.ai";
  const apiToken = env.POLLINATIONS_API_TOKEN || env.POLLINATIONS_API_KEY;
  
  // 检查 API Token
  if (!apiToken) {
    throw new Error("语音生成功能需要 Pollen 积分。请访问 https://enter.pollinations.ai 购买积分后配置 API Key。图片生成功能仍可免费使用。");
  }
  
  // 构建请求体（OpenAI 兼容格式）
  const requestBody = {
    model: "openai-audio",
    messages: [
      {
        role: "user",
        content: prompt
      }
    ],
    modalities: ["text", "audio"],
    audio: {
      voice: voice,
      format: "mp3"
    }
  };
  
  const fullUrl = `${genApiBase}/v1/chat/completions`;
  logInfo(env, `[Worker Log] 向 Pollinations Gen API (Audio) 发送请求: voice=${voice}`);
  
  const response = await fetchWithRetry(
    fullUrl,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiToken}`
      },
      body: JSON.stringify(requestBody),
    },
    "Pollinations Audio API",
    env
  );
  
  const contentType = response.headers.get("Content-Type")?.toLowerCase() || "";
  logInfo(env, `[Worker Log] Pollinations Audio API response: ${response.status}, Content-Type: ${contentType}`);
  
  // 如果返回的是音频文件，直接返回
  if (contentType.includes("audio/")) {
    return response.arrayBuffer();
  }
  
  // 如果返回的是 JSON（OpenAI 格式），需要解析并提取音频
  if (contentType.includes("application/json")) {
    const jsonResponse = await response.json();
    
    // OpenAI 音频响应格式
    if (jsonResponse.choices && jsonResponse.choices[0]) {
      const choice = jsonResponse.choices[0];
      
      // 检查是否有音频数据
      if (choice.message && choice.message.audio && choice.message.audio.data) {
        // 音频数据是 base64 编码的
        const base64Audio = choice.message.audio.data;
        const binaryString = atob(base64Audio);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
      }
    }
    
    throw new Error(`API 响应中未找到音频数据: ${JSON.stringify(jsonResponse).substring(0, 500)}`);
  }
  
  throw new Error(`API 返回非预期内容，Content-Type: ${contentType}`);
}

