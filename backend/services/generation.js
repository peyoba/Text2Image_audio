import { fetchWithRetry } from "../utils/fetch.js";
import { logInfo } from "../utils/logger.js";

/**
 * 使用 Pollinations 新 API (gen.pollinations.ai) 生成图片
 * 2026-01 更新：Pollinations 已迁移到新的 API 系统，需要 API Key 认证
 * 文档：https://enter.pollinations.ai/api/docs
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
  // 新 API 基础 URL：gen.pollinations.ai（2026-01 更新）
  // 旧 API image.pollinations.ai 已弃用
  let imageApiBase = env.POLLINATIONS_GEN_API_BASE || env.POLLINATIONS_IMAGE_API_BASE || "https://gen.pollinations.ai";
  
  // 兼容旧配置：如果配置的是旧 API 地址，自动切换到新地址
  if (imageApiBase.includes("image.pollinations.ai")) {
    imageApiBase = "https://gen.pollinations.ai";
    logInfo(env, "[Worker Log] 检测到旧 API 地址，已自动切换到新 API: gen.pollinations.ai");
  }
  
  if (imageApiBase.endsWith("/")) {
    imageApiBase = imageApiBase.slice(0, -1);
  }

  // 构建请求参数
  const params = new URLSearchParams();
  if (width) params.append("width", width);
  if (height) params.append("height", height);
  if (seed && seed !== -1) params.append("seed", seed);
  if (nologo) params.append("nologo", nologo);
  if (negative) params.append("negative", negative);
  if (model) params.append("model", model);

  // 新 API 端点格式：/image/{prompt}（不是 /prompt/{prompt}）
  const fullUrl = `${imageApiBase}/image/${encodeURIComponent(prompt)}?${params.toString()}`;
  logInfo(env, `[Worker Log] 向 Pollinations Gen API 发送请求 (模型: ${model}): ${fullUrl}`);

  // 设置请求头 - 新 API 必须使用 API Key 认证
  const headers = {};
  const apiToken = env.POLLINATIONS_API_TOKEN || env.POLLINATIONS_API_KEY;
  if (!apiToken) {
    throw new Error("未配置 POLLINATIONS_API_TOKEN，请在 Cloudflare Workers 控制台设置 API Key");
  }
  headers["Authorization"] = `Bearer ${apiToken}`;
  logInfo(env, "[Worker Log] 使用 Pollinations API Key 进行认证。");

  const response = await fetchWithRetry(
    fullUrl,
    {
      method: "GET",
      headers,
    },
    "Pollinations Gen API",
    env
  );

  return response.arrayBuffer();
}

/**
 * 使用 Pollinations 新 API (gen.pollinations.ai) 生成音频
 * 2026-01 更新：音频生成现在使用 OpenAI 兼容的 chat completions 端点
 * 模型：openai-audio
 * 可用声音：alloy, echo, fable, onyx, nova, shimmer, coral, verse, ballad, ash, sage, amuch, dan
 */
export async function generateAudioFromPollinations(prompt, env, voice = "nova", model = "openai-audio", speed) {
  // 新 API 基础 URL
  const genApiBase = env.POLLINATIONS_GEN_API_BASE || "https://gen.pollinations.ai";
  const apiToken = env.POLLINATIONS_API_TOKEN || env.POLLINATIONS_API_KEY;
  
  // 新 API 必须使用 API Token
  if (!apiToken) {
    throw new Error("未配置 POLLINATIONS_API_TOKEN，请在 Cloudflare Workers 控制台设置 API Key");
  }
  
  return await generateAudioWithNewApi(prompt, env, voice, model, speed, genApiBase, apiToken);
}

/**
 * 使用新 API 生成音频（OpenAI 兼容格式）
 */
async function generateAudioWithNewApi(prompt, env, voice, model, speed, genApiBase, apiToken) {
  const fullUrl = `${genApiBase}/v1/chat/completions`;
  
  // 构建语速指令
  const normalizedSpeed =
    typeof speed !== "undefined" && !isNaN(Number(speed))
      ? Math.max(0.25, Math.min(4.0, Number(speed)))
      : 1.0;
  const speedInstruction =
    normalizedSpeed !== 1.0
      ? ` Please speak at approximately ${normalizedSpeed}x speed.`
      : "";
  
  // 构建请求体（OpenAI 兼容格式）
  const requestBody = {
    model: "openai-audio",
    messages: [
      {
        role: "system",
        content: `You are a text-to-speech assistant. Read the user's text naturally and clearly.${speedInstruction} Voice: ${voice}`
      },
      {
        role: "user",
        content: prompt
      }
    ],
    // 指定音频输出
    modalities: ["text", "audio"],
    audio: {
      voice: voice,
      format: "mp3"
    }
  };
  
  logInfo(env, `[Worker Log] 向 Pollinations Gen API (Audio) 发送请求: ${fullUrl}, voice: ${voice}`);
  
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiToken}`
  };
  
  const response = await fetchWithRetry(
    fullUrl,
    {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    },
    "Pollinations Gen Audio API",
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

