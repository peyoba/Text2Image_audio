import { fetchWithRetry } from "../utils/fetch.js";
import { logInfo } from "../utils/logger.js";

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
  let imageApiBase = env.POLLINATIONS_IMAGE_API_BASE || "https://image.pollinations.ai";
  if (!imageApiBase) {
    throw new Error("图片API基地址未在环境变量中配置");
  }
  if (imageApiBase.endsWith("/")) {
    imageApiBase = imageApiBase.slice(0, -1);
  }

  const params = new URLSearchParams();
  if (width) params.append("width", width);
  if (height) params.append("height", height);
  if (seed && seed !== -1) params.append("seed", seed);
  if (nologo) params.append("nologo", nologo);
  if (negative) params.append("negative", negative);
  if (model) params.append("model", model);

  const fullUrl = `${imageApiBase}/prompt/${encodeURIComponent(prompt)}?${params.toString()}`;
  logInfo(env, `[Worker Log] 向 Pollinations Image API 发送请求 (模型: ${model}): ${fullUrl}`);

  const headers = {};
  const apiToken = env.POLLINATIONS_API_TOKEN;
  if (apiToken) {
    headers["Authorization"] = `Bearer ${apiToken}`;
    logInfo(env, "[Worker Log] 使用 Pollinations API Token进行认证。");
  }

  const response = await fetchWithRetry(
    fullUrl,
    {
      method: "GET",
      headers,
    },
    "Pollinations Image API",
    env
  );

  return response.arrayBuffer();
}

export async function generateAudioFromPollinations(prompt, env, voice, model, speed) {
  let textApiBase = env.POLLINATIONS_TEXT_API_BASE || "https://text.pollinations.ai";
  if (!textApiBase) {
    throw new Error("语音API基地址未在环境变量中配置");
  }
  if (!textApiBase.endsWith("/")) {
    textApiBase = `${textApiBase}/`;
  }

  const normalizedSpeed =
    typeof speed !== "undefined" && !isNaN(Number(speed))
      ? Math.max(0.25, Math.min(4.0, Number(speed)))
      : 1.0;
  const speedInstruction =
    normalizedSpeed !== 1.0
      ? ` Speak at approximately ${normalizedSpeed}x speed while keeping natural prosody; do not unnaturally shorten or lengthen pauses. 语速要求：约 ${normalizedSpeed} 倍速，保持自然节奏，不要不自然地缩短或拉长停顿。`
      : "";
  const engineeredPrompt = `Read out exactly and only the following text, with natural prosody.${speedInstruction} Do not translate, do not summarize, and do not add any extra words. 只朗读下面文本，不要添加任何额外内容，也不要翻译或改写。文本："""${prompt}"""`;
  const encodedPrompt = encodeURIComponent(engineeredPrompt);

  const params = new URLSearchParams({ model, voice });
  if (speed && Number(speed) !== 1.0) params.append("speed", speed);
  params.append("mode", "tts");
  const fullUrl = `${textApiBase}${encodedPrompt}?${params.toString()}`;
  logInfo(env, `[Worker Log] 向 Pollinations Text(Audio) API 发送请求: ${fullUrl}`);

  const headers = {};
  const apiToken = env.POLLINATIONS_API_TOKEN;
  if (apiToken) {
    headers["Authorization"] = `Bearer ${apiToken}`;
    logInfo(env, "[Worker Log] 使用 Pollinations API Token进行认证。");
  }

  const response = await fetchWithRetry(
    fullUrl,
    {
      method: "GET",
      headers,
    },
    "Pollinations Text(Audio) API",
    env
  );

  const actualContentType = response.headers.get("Content-Type")?.toLowerCase() || "";
  logInfo(
    env,
    `[Worker Log] Pollinations API response status: ${response.status}, Content-Type: ${actualContentType}`
  );

  if (!actualContentType.includes("audio/")) {
    const errorTextContent = await response.text();
    throw new Error(
      `API 返回非音频内容，Content-Type: ${actualContentType}, 片段: ${errorTextContent.substring(0, 500)}...`
    );
  }

  return response.arrayBuffer();
}
