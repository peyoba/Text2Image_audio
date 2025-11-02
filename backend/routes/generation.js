import { createJsonRoute, jsonResponse } from "../router.js";
import {
  generateImageFromPollinations,
  generateAudioFromPollinations,
} from "../services/generation.js";
import { arrayBufferToBase64 } from "../utils/base64.js";
import { logInfo } from "../utils/logger.js";
import { recordMetric } from "../utils/metrics.js";
import { addCorsHeaders, addSecurityHeaders } from "../utils/response.js";

export function registerGenerationRoutes(registerRoute) {
  registerRoute(
    createJsonRoute({
      method: "POST",
      path: "/api/generate",
      bodyMessage: "生成请求体必须为 JSON",
      async handler({ request, env, body }) {
        const textPrompt = body.text;
        const genType = body.type;

        if (!textPrompt || !genType) {
          return jsonResponse({ error: "缺少必要的参数: text 和 type" }, env, 400);
        }

        if (!["image", "audio"].includes(genType)) {
          return jsonResponse({ error: "不支持的生成类型，请使用 image 或 audio" }, env, 400);
        }

        if (genType === "image") {
          return handleImageGeneration(body, env);
        }

        return handleAudioGeneration(body, env, request);
      },
    })
  );

  registerRoute(
    createJsonRoute({
      method: "POST",
      path: "/api/pollinations/image",
      bodyMessage: "图片代理请求体必须为 JSON",
      async handler({ env, body }) {
        return handlePollinationsImage(body, env);
      },
    })
  );
}

async function handleImageGeneration(body, env) {
  const t0 = Date.now();
  const actualPrompt = body.text;
  const actualWidth = body.width;
  const actualHeight = body.height;
  const actualNologo = body.nologo;
  const seed = body.seed;
  const negative = body.negative;
  const model = body.model || "flux";

  logInfo(
    env,
    `[Worker Log] Processing image generation for prompt: '${actualPrompt.substring(0, 100)}...', width: ${actualWidth}, height: ${actualHeight}, seed: ${seed}, nologo: ${actualNologo}, negative: ${negative}, model: ${model}`
  );

  const imageArrayBuffer = await generateImageFromPollinations(
    actualPrompt,
    env,
    actualWidth,
    actualHeight,
    seed,
    actualNologo,
    negative,
    model
  );

  const base64Image = arrayBufferToBase64(imageArrayBuffer);
  const dt = Date.now() - t0;
  recordMetric(env, "generate_image", {
    dt_ms: dt,
    model,
    w: actualWidth,
    h: actualHeight,
    seed: typeof seed === "number" ? seed : undefined,
  });

  return jsonResponse(
    { type: "image", data: base64Image, format: "base64", content_type: "image/jpeg" },
    env
  );
}

async function handleAudioGeneration(body, env, request) {
  const t0 = Date.now();
  const textPrompt = body.text;
  const voice = body.voice || env.DEFAULT_AUDIO_VOICE || "nova";
  const model = body.model || env.DEFAULT_AUDIO_MODEL || "openai-audio";
  const speed = body.speed || 1.0;

  logInfo(
    env,
    `[Worker Log] Processing audio generation for prompt: '${textPrompt.substring(0, 50)}...', voice: ${voice}, speed: ${speed}`
  );

  const audioArrayBuffer = await generateAudioFromPollinations(
    textPrompt,
    env,
    voice,
    model,
    speed
  );

  const audioRespHeaders = new Headers();
  audioRespHeaders.append("Content-Type", "audio/mpeg");
  addCorsHeaders(audioRespHeaders, env, request);
  addSecurityHeaders(audioRespHeaders, env);

  const dt = Date.now() - t0;
  recordMetric(env, "generate_audio", { dt_ms: dt, model, voice, speed });

  return new Response(audioArrayBuffer, { status: 200, headers: audioRespHeaders });
}

async function handlePollinationsImage(body, env) {
  const { prompt, model = "flux", width = 1024, height = 1024, seed = -1, nologo = true } = body;

  if (!prompt) {
    return jsonResponse({ error: "缺少必要的参数: prompt" }, env, 400);
  }

  try {
    logInfo(
      env,
      `[Worker Log] Processing Pollinations image generation - Prompt: ${prompt.substring(0, 50)}..., Model: ${model}, Size: ${width}x${height}`
    );

    const t0 = Date.now();
    const imageArrayBuffer = await generateImageFromPollinations(
      prompt,
      env,
      width,
      height,
      seed,
      nologo,
      "",
      model
    );

    const base64Image = arrayBufferToBase64(imageArrayBuffer);
    const dt = Date.now() - t0;
    recordMetric(env, "proxy_pollinations_image", { dt_ms: dt, model, w: width, h: height });

    return jsonResponse(
      {
        type: "image",
        data: base64Image,
        format: "base64",
        content_type: "image/jpeg",
      },
      env
    );
  } catch (e) {
    console.error(`[Worker Error] Pollinations image generation failed: ${e.message}`);
    return jsonResponse({ error: `Pollinations图像生成失败: ${e.message}` }, env, 500);
  }
}
