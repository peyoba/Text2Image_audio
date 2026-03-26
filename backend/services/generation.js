import { fetchWithRetry } from "../utils/fetch.js";
import { logInfo } from "../utils/logger.js";

/**
 * 获取 Pollinations API Token（必需）
 * 所有 gen.pollinations.ai 请求都需要认证
 */
function getApiToken(env) {
  return env.POLLINATIONS_API_TOKEN || env.POLLINATIONS_API_KEY;
}

/**
 * 使用 Pollinations API 生成图片
 * 2026-03 更新：统一使用 gen.pollinations.ai，所有请求需要 Bearer Token
 * 端点：GET /image/{prompt}
 * 可用模型：flux, zimage, kontext, nanobanana, nanobanana-2, nanobanana-pro,
 *           seedream5, seedream, seedream-pro, gptimage, gptimage-large,
 *           qwen-image, grok-imagine, klein, p-image, nova-canvas 等
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
  const genApiBase = env.POLLINATIONS_GEN_API_BASE || "https://gen.pollinations.ai";
  const apiToken = getApiToken(env);

  if (!apiToken) {
    throw new Error(
      "Pollinations API 需要认证。请在 Cloudflare Workers 环境变量中配置 POLLINATIONS_API_TOKEN。" +
        "获取方式：访问 https://enter.pollinations.ai"
    );
  }

  // 构建请求参数
  const params = new URLSearchParams();
  if (width) params.append("width", width);
  if (height) params.append("height", height);
  if (seed && seed !== -1) params.append("seed", seed);
  if (nologo) params.append("nologo", "true");
  if (negative) params.append("negative_prompt", negative);
  if (model) params.append("model", model);

  const fullUrl = `${genApiBase}/image/${encodeURIComponent(prompt)}?${params.toString()}`;
  logInfo(env, `[Worker Log] 生成图片 (模型: ${model})`);

  const response = await fetchWithRetry(
    fullUrl,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    },
    "Pollinations Image API",
    env
  );

  return response.arrayBuffer();
}

/**
 * 使用 Pollinations API 生成音频（文本转语音）
 * 2026-03 更新：使用 OpenAI 兼容的 POST /v1/audio/speech 端点
 * 直接将输入文本朗读为语音，而非聊天回答
 * 可用声音：alloy, echo, fable, onyx, nova, shimmer, ash, ballad, coral, sage, verse 等
 */
export async function generateAudioFromPollinations(
  prompt,
  env,
  voice = "nova",
  model = "openai-audio",
  speed
) {
  const genApiBase = env.POLLINATIONS_GEN_API_BASE || "https://gen.pollinations.ai";
  const apiToken = getApiToken(env);

  if (!apiToken) {
    throw new Error(
      "语音生成需要 API Key。请在 Cloudflare Workers 环境变量中配置 POLLINATIONS_API_TOKEN。" +
        "获取方式：访问 https://enter.pollinations.ai"
    );
  }

  // 使用 OpenAI TTS 兼容端点，直接朗读输入文本
  const requestBody = {
    model: "openai-audio",
    input: prompt,
    voice: voice,
    response_format: "mp3",
  };
  if (speed && speed !== 1.0) {
    requestBody.speed = speed;
  }

  const fullUrl = `${genApiBase}/v1/audio/speech`;
  logInfo(env, `[Worker Log] 生成音频 TTS (voice: ${voice}, speed: ${speed || 1.0})`);

  const response = await fetchWithRetry(
    fullUrl,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify(requestBody),
    },
    "Pollinations TTS API",
    env
  );

  return response.arrayBuffer();
}
