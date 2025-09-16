// backend/index.js

import { 
    handleUserRegistration, 
    handleUserLogin, 
    validateUserToken, 
    extractTokenFromRequest,
    handleForgotPassword,
    handleResetPassword,
    handleGoogleLogin,
    handleGoogleOAuth
} from './auth.js';

import {
    HDImageCacheManager,
    authenticateImageAccess
} from './image_cache.js';

function logInfo(env, ...args) {
    // Only log if LOG_LEVEL is explicitly set to 'debug'
    if ((env.LOG_LEVEL || 'info').toLowerCase() === 'debug') {
        console.log(...args);
    }
}

// --- Lightweight, opt-in metrics (default off) ---
function metricsEnabled(env) {
    try { return String(env.METRICS_ENABLED || 'false').toLowerCase() === 'true'; } catch(_) { return false; }
}

function shouldSample(env) {
    try {
        const rate = parseFloat(env.METRICS_SAMPLE_RATE || '0');
        if (isNaN(rate) || rate <= 0) return false;
        const clamped = Math.max(0, Math.min(1, rate));
        return Math.random() < clamped;
    } catch(_) { return false; }
}

function recordMetric(env, name, data) {
    try {
        if (!metricsEnabled(env)) return;
        if (!shouldSample(env)) return;
        const payload = { name, ts: Date.now(), ...data };
        console.log('[METRIC]', JSON.stringify(payload));
    } catch(_) {}
}

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname;
        const method = request.method;
        
        // Log all request headers for debugging
        logInfo(env, `[Worker Log] Received request: ${method} ${path}`);
        let headersLog = "[Worker Log] Request Headers: ";
        for (let pair of request.headers.entries()) {
            const k = pair[0];
            let v = pair[1];
            if (["authorization", "cookie", "set-cookie"].includes(k.toLowerCase())) {
                v = "[REDACTED]";
            }
            headersLog += `\n  ${k}: ${v}`;
        }
        logInfo(env, headersLog);

        if (method === "OPTIONS") {
            logInfo(env, "[Worker Log] Matched OPTIONS method. Request Origin:", request.headers.get("Origin"));
            logInfo(env, "[Worker Log] Access-Control-Request-Method:", request.headers.get("Access-Control-Request-Method"));
            logInfo(env, "[Worker Log] Access-Control-Request-Headers:", request.headers.get("Access-Control-Request-Headers"));
            logInfo(env, "[Worker Log] Calling makeCorsResponse for OPTIONS request.");
            return makeCorsResponse(request, env); // Pass request to makeCorsResponse
        }

        // CORS Preflight (This block might be redundant now due to the explicit check above, but keep for other scenarios if any)
        // if (method === "OPTIONS") { 
        //     return makeCorsResponse();
        // }

        try {
            // 认证相关路由
            if (method === "POST" && path === "/api/auth/register") {
                const requestData = await request.json();
                logInfo(env, `[Worker Log] Processing user registration for email: ${requestData.email}`);
                const result = await handleUserRegistration(requestData, env);
                return jsonResponse(result, env, result.success ? 201 : 400);
            } else if (method === "POST" && path === "/api/auth/login") {
                const requestData = await request.json();
                logInfo(env, `[Worker Log] Processing user login for email: ${requestData.email}`);
                const result = await handleUserLogin(requestData, env);
                return jsonResponse(result, env, result.success ? 200 : 401);
            } else if (method === "GET" && path === "/api/auth/validate") {
                const token = extractTokenFromRequest(request);
                logInfo(env, `[Worker Log] Validating user token`);
                const result = await validateUserToken(token, env);
                return jsonResponse(result, env, result.success ? 200 : 401);
            } else if (method === "POST" && path === "/api/auth/forgot-password") {
                const requestData = await request.json();
                logInfo(env, `[Worker Log] Processing forgot password for email: ${requestData.email}`);
                const result = await handleForgotPassword(requestData, env);
                return jsonResponse(result, env, result.success ? 200 : 400);
            } else if (method === "POST" && path === "/api/auth/reset-password") {
                const requestData = await request.json();
                logInfo(env, `[Worker Log] Processing password reset`);
                const result = await handleResetPassword(requestData, env);
                return jsonResponse(result, env, result.success ? 200 : 400);
            } else if (method === "POST" && path === "/api/auth/google-login") {
                const requestData = await request.json();
                logInfo(env, `[Worker Log] Processing Google login`);
                const result = await handleGoogleLogin(requestData, env);
                return jsonResponse(result, env, result.success ? 200 : 401);
            } else if (method === "POST" && path === "/api/auth/google-oauth") {
                const requestData = await request.json();
                logInfo(env, `[Worker Log] Processing Google OAuth`);
                const result = await handleGoogleOAuth(requestData, env);
                return jsonResponse(result, env, result.success ? 200 : 401);
            } else if (method === "POST" && path === "/api/images/save") {
                const user = await authenticateImageAccess(request, env);
                if (!user) {
                    return jsonResponse({ error: '需要登录' }, env, 401);
                }
                
                const requestData = await request.json();
                const cacheManager = new HDImageCacheManager(env);
                logInfo(env, `[Worker Log] Saving HD image for user: ${user.id}`);
                const result = await cacheManager.saveHDImage(user.id, requestData);
                return jsonResponse(result, env, result.success ? 201 : 400);
            } else if (method === "GET" && path === "/api/images/daily") {
                const user = await authenticateImageAccess(request, env);
                if (!user) {
                    return jsonResponse({ error: '需要登录' }, env, 401);
                }
                
                const cacheManager = new HDImageCacheManager(env);
                logInfo(env, `[Worker Log] Getting daily images for user: ${user.id}`);
                const result = await cacheManager.getDailyImageList(user.id);
                return jsonResponse(result, env, result.success ? 200 : 400);
            } else if (method === "GET" && path === "/api/images/stats") {
                const user = await authenticateImageAccess(request, env);
                if (!user) {
                    return jsonResponse({ error: '需要登录' }, env, 401);
                }
                
                const cacheManager = new HDImageCacheManager(env);
                logInfo(env, `[Worker Log] Getting image stats for user: ${user.id}`);
                const result = await cacheManager.getUserImageStats(user.id);
                return jsonResponse(result, env, result.success ? 200 : 400);
            } else if (method === "GET" && path.startsWith("/api/images/") && !path.includes("/download/") && path !== "/api/images/stats") {
                const user = await authenticateImageAccess(request, env);
                if (!user) {
                    return jsonResponse({ error: '需要登录' }, env, 401);
                }
                
                const imageId = path.split('/').pop();
                const cacheManager = new HDImageCacheManager(env);
                logInfo(env, `[Worker Log] Getting HD image: ${imageId} for user: ${user.id}`);
                const result = await cacheManager.getHDImage(user.id, imageId);
                
                if (result.success) {
                    return jsonResponse({
                        id: result.image.id,
                        prompt: result.image.prompt,
                        data: result.image.data, // 高清base64数据
                        width: result.image.width,
                        height: result.image.height,
                        seed: result.image.seed,
                        model: result.image.model,
                        negative: result.image.negative,
                        created_at: result.image.created_at,
                        quality: result.image.quality
                    }, env);
                } else {
                    return jsonResponse({ error: result.error }, env, 404);
                }
            } else if (method === "GET" && path.startsWith("/api/images/download/")) {
                const user = await authenticateImageAccess(request, env);
                if (!user) {
                    return jsonResponse({ error: '需要登录' }, env, 401);
                }
                
                const imageId = path.split('/').pop();
                const cacheManager = new HDImageCacheManager(env);
                logInfo(env, `[Worker Log] Downloading HD image: ${imageId} for user: ${user.id}`);
                const t0 = Date.now();
                const result = await cacheManager.getHDImage(user.id, imageId);
                
                if (result.success) {
                    // 返回下载响应
                    const response = new Response(
                        Uint8Array.from(atob(result.image.data), c => c.charCodeAt(0)),
                        {
                            headers: {
                                'Content-Type': 'image/jpeg',
                                'Content-Disposition': `attachment; filename="image_${imageId}.jpg"`,
                                'Cache-Control': 'no-cache'
                            }
                        }
                    );
                    
                    addCorsHeaders(response.headers, env);
                    addSecurityHeaders(response.headers, env);
                    const dt = Date.now() - t0;
                    recordMetric(env, 'download_image', { dt_ms: dt, image_id: imageId });
                    return response;
                } else {
                    return jsonResponse({ error: result.error }, env, 404);
                }
            } else if (method === "DELETE" && path.startsWith("/api/images/")) {
                const user = await authenticateImageAccess(request, env);
                if (!user) {
                    return jsonResponse({ error: '需要登录' }, env, 401);
                }
                
                const imageId = path.split('/').pop();
                const cacheManager = new HDImageCacheManager(env);
                logInfo(env, `[Worker Log] Deleting image: ${imageId} for user: ${user.id}`);
                const result = await cacheManager.deleteImage(user.id, imageId);
                return jsonResponse(result, env, result.success ? 200 : 400);
            } else if (method === "POST" && path === "/api/optimize") {
                const requestData = await request.json();
                const textPrompt = requestData.text;
                if (!textPrompt) {
                    return jsonResponse({ error: '缺少必要的参数: text' }, env, 400);
                }
                logInfo(env, `[Worker Log] Processing optimize request for prompt: '${textPrompt.substring(0, 50)}...'`);
                const optimizationResult = await optimizePromptWithDeepseek(textPrompt, env);
                return jsonResponse(optimizationResult, env);
            } else if (method === "POST" && path === "/api/generate") {
                const requestData = await request.json();
                const textPrompt = requestData.text;
                const genType = requestData.type;

                if (!textPrompt || !genType) {
                    return jsonResponse({ error: '缺少必要的参数: text 和 type' }, env, 400);
                }

                if (!['image', 'audio'].includes(genType)) {
                    return jsonResponse({ error: '不支持的生成类型，请使用 image 或 audio' }, env, 400);
                }

                if (genType === 'image') {
                    const t0 = Date.now();
                    // --- Use Actual Parameters from Request (directly from requestData) ---
                    const actualPrompt = requestData.text; 
                    const actualWidth = requestData.width; // Directly from requestData
                    const actualHeight = requestData.height; // Directly from requestData
                    const actualNologo = requestData.nologo; // Directly from requestData
                    const seed = requestData.seed; // Directly from requestData, if provided
                    const negative = requestData.negative; // 新增，负面提示词
                    const model = requestData.model || 'flux'; // 模型参数，默认为flux
                    // --- End of Actual Parameters ---

                    logInfo(env, `[Worker Log] Processing image generation for prompt: '${actualPrompt.substring(0,100)}...', width: ${actualWidth}, height: ${actualHeight}, seed: ${seed}, nologo: ${actualNologo}, negative: ${negative}, model: ${model}`);
                    const imageArrayBuffer = await generateImageFromPollinations(actualPrompt, env, actualWidth, actualHeight, seed, actualNologo, negative, model);
                    // Convert ArrayBuffer to Base64 string
                    const base64Image = arrayBufferToBase64(imageArrayBuffer);
                    const dt = Date.now() - t0;
                    recordMetric(env, 'generate_image', { dt_ms: dt, model, w: actualWidth, h: actualHeight, seed: typeof seed === 'number' ? seed : undefined });
                    return jsonResponse({ type: genType, data: base64Image, format: "base64", content_type: "image/jpeg" }, env); // Assuming jpeg
                } else if (genType === 'audio') {
                    const t0 = Date.now();
                    const voice = requestData.voice || env.DEFAULT_AUDIO_VOICE || 'nova';
                    const model = requestData.model || env.DEFAULT_AUDIO_MODEL || 'openai-audio';
                    const speed = requestData.speed || 1.0;
                    logInfo(env, `[Worker Log] Processing audio generation for prompt: '${textPrompt.substring(0, 50)}...', voice: ${voice}, speed: ${speed}`);
                    const audioArrayBuffer = await generateAudioFromPollinations(textPrompt, env, voice, model, speed);
                    
                    let audioContentType = "audio/mpeg"; // Default for mp3
                    // TODO: Determine actual audio content type from Pollinations response if possible, or make it configurable
                    // For example, if Pollinations API returns a more specific content type in its headers.
                    // if (outputFormat === "opus") audioContentType = "audio/opus";
                    // else if (outputFormat === "aac") audioContentType = "audio/aac";
                    // else if (outputFormat === "flac") audioContentType = "audio/flac";

                    const audioRespHeaders = new Headers();
                    audioRespHeaders.append('Content-Type', audioContentType);
                    addCorsHeaders(audioRespHeaders, env);
                    addSecurityHeaders(audioRespHeaders, env);
                    
                    const dt = Date.now() - t0;
                    recordMetric(env, 'generate_audio', { dt_ms: dt, model, voice, speed });
                    return new Response(audioArrayBuffer, { status: 200, headers: audioRespHeaders });
                }
            } else if (method === "POST" && path === "/api/pollinations/image") {
                const requestData = await request.json();
                const { prompt, model = 'flux', width = 1024, height = 1024, seed = -1, nologo = true } = requestData;
                
                if (!prompt) {
                    return jsonResponse({ error: '缺少必要的参数: prompt' }, env, 400);
                }

                try {
                    logInfo(env, `[Worker Log] Processing Pollinations image generation - Prompt: ${prompt.substring(0, 50)}..., Model: ${model}, Size: ${width}x${height}`);
                    
                    // 使用现有的generateImageFromPollinations函数，添加negative参数和model参数
                    const t0 = Date.now();
                    const imageArrayBuffer = await generateImageFromPollinations(prompt, env, width, height, seed, nologo, '', model);
                    
                    // 转换为Base64字符串
                    const base64Image = arrayBufferToBase64(imageArrayBuffer);
                    const dt = Date.now() - t0;
                    recordMetric(env, 'proxy_pollinations_image', { dt_ms: dt, model, w: width, h: height });
                    return jsonResponse({ 
                        type: 'image', 
                        data: base64Image, 
                        format: "base64", 
                        content_type: "image/jpeg" 
                    }, env);

                } catch (e) {
                    console.error(`[Worker Error] Pollinations image generation failed: ${e.message}`);
                    return jsonResponse({ error: `Pollinations图像生成失败: ${e.message}` }, env, 500);
                }
            } else if (method === "POST" && path === "/api/feedback") {
                const user = await authenticateImageAccess(request, env);
                if (!user) {
                    return jsonResponse({ error: '需要登录' }, env, 401);
                }
                
                const requestData = await request.json();
                logInfo(env, `[Worker Log] Processing feedback submission for user: ${user.id}`);
                const result = await handleFeedbackSubmission(user, requestData, env);
                return jsonResponse(result, env, result.success ? 201 : 400);
            } else if (method === "GET" && path === "/api/feedback/my") {
                const user = await authenticateImageAccess(request, env);
                if (!user) {
                    return jsonResponse({ error: '需要登录' }, env, 401);
                }
                
                logInfo(env, `[Worker Log] Getting feedback list for user: ${user.id}`);
                const result = await getUserFeedbackList(user, env);
                return jsonResponse(result, env, result.success ? 200 : 400);
            } else if (method === "GET" && path === "/api/admin/feedback") {
                // 管理员查看所有反馈（简单验证）
                const adminKey = url.searchParams.get('admin_key');
                if (adminKey !== env.ADMIN_KEY) {
                    return jsonResponse({ error: '管理员权限验证失败' }, env, 403);
                }
                
                logInfo(env, `[Worker Log] Admin getting all feedback`);
                const result = await getAllFeedbackForAdmin(env);
                return jsonResponse(result, env, result.success ? 200 : 400);
            } else if (method === "POST" && path === "/api/translate") {
                const requestData = await request.json();
                const text = requestData.text;
                if (!text) {
                    return jsonResponse({ error: '缺少必要的参数: text' }, env, 400);
                }

                const deepseekApiKey = env.DEEPSEEK_API_KEY;
                if (!deepseekApiKey) {
                    console.error("[Worker Error] DEEPSEEK_API_KEY not set for /api/translate.");
                    return jsonResponse({ error: '服务器配置错误：翻译服务不可用' }, env, 500);
                }

                try {
                    let deepseekApiUrl = env.DEEPSEEK_API_URL || 'https://api.siliconflow.cn/v1/chat/completions';
                    if (!deepseekApiUrl.endsWith('/v1/chat/completions')) {
                        deepseekApiUrl = deepseekApiUrl.endsWith('/') ? deepseekApiUrl + 'v1/chat/completions' : deepseekApiUrl + '/v1/chat/completions';
                    }
                    
                    const prompt = `请将下列中文负面提示词精准翻译为英文，保持逗号分隔，且不要添加任何修饰或润色，只输出英文短语列表：\n${text}`;
                    const headers = {
                        'Authorization': `Bearer ${deepseekApiKey}`,
                        'Content-Type': 'application/json'
                    };
                    const payload = {
                        model: env.DEEPSEEK_MODEL || "deepseek-ai/DeepSeek-V2.5",
                        messages: [{ role: "user", content: prompt }],
                        temperature: 0.2
                    };
                    const response = await fetch(deepseekApiUrl, {
                        method: "POST",
                        headers: headers,
                        body: JSON.stringify(payload)
                    });

                    if (!response.ok) {
                        console.error(`[Worker Error] DeepSeek API call failed for translation with status: ${response.status}`);
                        return jsonResponse({ translated_text: text, translated: false }, env);
                    }

                    const result = await response.json();
                    const translated = result.choices[0].message.content.trim();
                    return jsonResponse({ translated_text: translated, translated: true }, env);

                } catch (e) {
                    console.error(`[Worker Error] An unexpected error occurred in translation fetch: ${e.message}`);
                    return jsonResponse({ translated_text: text, translated: false }, env);
                }
            } else {
                return jsonResponse({ error: "Not Found", path: path }, env, 404);
            }
        } catch (e) {
            console.error(`[Worker Error] An unexpected error occurred in fetch: ${e.message}`);
            console.error(e.stack);
            // 针对429/502等重试失败，返回友好提示
            if (e.status === 429 || e.status === 502) {
                return jsonResponse({
                    error: "AI服务繁忙，已为您排队重试多次但仍未成功，请稍后再试。",
                    details: e.message
                }, env, 503);
            }
            return jsonResponse({ error: "服务器内部错误", details: e.message }, env, 500);
        }
    }
};

function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

async function optimizePromptWithDeepseek(textPrompt, env) {
    let deepseekApiUrl = env.DEEPSEEK_API_URL || 'https://api.siliconflow.cn/v1/chat/completions';
    if (!deepseekApiUrl.endsWith('/v1/chat/completions')) {
        deepseekApiUrl = deepseekApiUrl.endsWith('/') ? deepseekApiUrl + 'v1/chat/completions' : deepseekApiUrl + '/v1/chat/completions';
    }
    const deepseekApiKey = env.DEEPSEEK_API_KEY;

    if (!deepseekApiKey) {
        console.error("[Worker Error] DEEPSEEK_API_KEY not found in environment variables.");
        // Throw an error that can be caught by the main fetch handler
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
        'Authorization': `Bearer ${deepseekApiKey}`,
        'Content-Type': 'application/json'
    };
    const payload = {
        model: env.DEEPSEEK_MODEL || "deepseek-ai/DeepSeek-V2.5", // Consider making model configurable via env
        messages: [{ role: "user", content: engineeredPrompt }],
        temperature: 0.5
    };

    logInfo(env, `[Worker Log] 向 DeepSeek API 发送请求 (JS fetch): URL=${deepseekApiUrl}`);
    
    try {
        const response = await fetch(deepseekApiUrl, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorContent = await response.text();
            console.error(`[Worker Error] DeepSeek API HTTPError: Status ${response.status}, Response: ${errorContent}`);
            return { error: `优化API调用失败 (HTTP ${response.status})`, details: errorContent, optimized_text: textPrompt, raw_optimized: textPrompt, original_prompt: textPrompt };
        }

        const result = await response.json();
        logInfo(env, `[Worker Log] DeepSeek API 原始响应:`, result); // Logging the whole object might be too verbose
        const optimizedTextRaw = result.choices[0].message.content.trim();

        const englishPattern = /[a-zA-Z0-9\s.,!?'":;()\[\]{}<>#@$%^&*+=_\\\|/~-]+/g;
        const englishParts = optimizedTextRaw.match(englishPattern) || [];
        let optimizedText = englishParts.join(" ").trim();
        
        if (!optimizedText && optimizedTextRaw) {
            console.warn(`[Worker Warning] DeepSeek优化后的提示词清洗后为空（原始：'${optimizedTextRaw}'）。将返回原始优化文本。`);
            optimizedText = optimizedTextRaw;
        } else if (!optimizedTextRaw) {
            console.error("[Worker Error] DeepSeek API返回了完全空的内容。将使用原始提示。");
            return { error: '优化API返回空内容', optimized_text: textPrompt, raw_optimized: textPrompt, original_prompt: textPrompt };
        }

        // Heuristic check for significant reduction in length if original contained Chinese characters.
        // This check is a bit simplistic in JS without a robust unicode character range check for CJK.
        // A more robust check would involve regex for specific Unicode ranges.
        if (optimizedTextRaw.length > optimizedText.length + 10 && textPrompt.match(/[\u4e00-\u9fff]/)) {
             console.warn(`[Worker Warning] 清洗后的提示词长度显著减少。原始: '${optimizedTextRaw}', 清洗后: '${optimizedText}'.`);
        }

        logInfo(env, `[Worker Log] 优化后的提示词 (原始): ${optimizedTextRaw}`);
        logInfo(env, `[Worker Log] 优化后的提示词 (清洗后): ${optimizedText}`);
        return { optimized_text: optimizedText, raw_optimized: optimizedTextRaw, original_prompt: textPrompt };

    } catch (e) {
        console.error(`[Worker Error] DeepSeek API 调用时发生未知错误 (JS fetch): ${e.message}`);
        console.error(e.stack);
        return { error: `优化API调用失败 (JS fetch): ${e.message}`, optimized_text: textPrompt, raw_optimized: textPrompt, original_prompt: textPrompt };
    }
}

async function generateImageFromPollinations(prompt, env, width, height, seed, nologo, negative, model = 'flux') {
    let imageApiBase = env.POLLINATIONS_IMAGE_API_BASE || "https://image.pollinations.ai"; // Default base
    if (!imageApiBase) {
        console.error("[Worker Error] Image API base URL not provided in env.POLLINATIONS_IMAGE_API_BASE");
        throw new Error("图片API基地址未在环境变量中配置");
    }

    if (imageApiBase.endsWith('/')) {
        imageApiBase = imageApiBase.slice(0, -1);
    }
    
    const promptPath = "/prompt/";
    const encodedPrompt = encodeURIComponent(prompt);
    
    const params = new URLSearchParams();
    if (width) params.append('width', width);
    if (height) params.append('height', height);
    if (seed && seed !== -1) params.append('seed', seed);
    if (nologo) params.append('nologo', nologo);
    if (negative) params.append('negative', negative);
    if (model) params.append('model', model);

    const fullUrl = `${imageApiBase}${promptPath}${encodedPrompt}?${params.toString()}`;
    logInfo(env, `[Worker Log] 向 Pollinations Image API 发送请求 (模型: ${model}): ${fullUrl}`);
    
    // 创建请求头并添加认证信息
    const headers = {};
    const apiToken = env.POLLINATIONS_API_TOKEN;
    if (apiToken) {
        headers['Authorization'] = `Bearer ${apiToken}`;
        logInfo(env, "[Worker Log] 使用 Pollinations API Token进行认证。");
    }

    const response = await fetchWithRetry(fullUrl, {
        method: "GET",
        headers: headers
        // 移除超时限制，让Pollinations.AI有足够时间生成图像
    }, "Pollinations Image API", env);

    return await response.arrayBuffer();
}

async function generateAudioFromPollinations(prompt, env, voice = "nova", model = "openai-audio", speed = 1.0) {
    let textApiBase = env.POLLINATIONS_TEXT_API_BASE || "https://text.pollinations.ai";
    if (!textApiBase) {
        console.error("[Worker Error] Text API base URL not provided in env.POLLINATIONS_TEXT_API_BASE");
        throw new Error("语音API基地址未在环境变量中配置");
    }
    if (!textApiBase.endsWith('/')) {
        textApiBase = textApiBase + '/';
    }

    // 强化TTS指令，强制逐字朗读且不添加多余内容；附加语速提示（部分API可能忽略speed参数）
    const normalizedSpeed = (typeof speed !== 'undefined' && !isNaN(Number(speed))) ? Math.max(0.25, Math.min(4.0, Number(speed))) : 1.0;
    const speedInstruction = normalizedSpeed !== 1.0
        ? ` Speak at approximately ${normalizedSpeed}x speed while keeping natural prosody; do not unnaturally shorten or lengthen pauses. 语速要求：约 ${normalizedSpeed} 倍速，保持自然节奏，不要不自然地缩短或拉长停顿。`
        : '';
    const engineeredPrompt = `Read out exactly and only the following text, with natural prosody.${speedInstruction} Do not translate, do not summarize, and do not add any extra words. 只朗读下面文本，不要添加任何额外内容，也不要翻译或改写。文本："""${prompt}"""`;
    const encodedPrompt = encodeURIComponent(engineeredPrompt);
    
    const params = new URLSearchParams({
        model: model,
        voice: voice
    });
    // 可选参数：语速和模式（若API不支持将被忽略）
    if (speed && Number(speed) !== 1.0) params.append('speed', speed);
    params.append('mode', 'tts');
    const fullUrl = `${textApiBase}${encodedPrompt}?${params.toString()}`;
    logInfo(env, `[Worker Log] 向 Pollinations Text(Audio) API 发送请求: ${fullUrl}`);

    // 创建请求头并添加认证信息
    const headers = {};
    const apiToken = env.POLLINATIONS_API_TOKEN;
    if (apiToken) {
        headers['Authorization'] = `Bearer ${apiToken}`;
        logInfo(env, "[Worker Log] 使用 Pollinations API Token进行认证。");
    }

    const response = await fetchWithRetry(fullUrl, {
        method: "GET",
        headers: headers
    }, "Pollinations Text(Audio) API", env);

    const actualContentType = response.headers.get('Content-Type')?.toLowerCase() || '';
    logInfo(env, `[Worker Log] Pollinations API response status: ${response.status}, Content-Type: ${actualContentType}`);

    if (response.status === 200 && actualContentType.includes("audio/")) {
        const audioDataArrayBuffer = await response.arrayBuffer();
        if (audioDataArrayBuffer.byteLength < 100) {
            logInfo(env, `[Worker Warning] Pollinations API 返回的音频内容很小 (length: ${audioDataArrayBuffer.byteLength})。`);
        }
        return audioDataArrayBuffer;
    } else {
        // 不是音频，打印部分内容
        const errorTextContent = await response.text();
        logInfo(env, `[Worker Error] Pollinations API 返回非音频内容。Content-Type: ${actualContentType}, 内容片段: ${errorTextContent.substring(0, 500)}...`);
        throw new Error(`API 返回非音频内容，Content-Type: ${actualContentType}`);
    }
}

/**
 * 处理用户反馈提交
 * @param {Object} user - 用户信息
 * @param {Object} requestData - 反馈数据
 * @param {Object} env - 环境变量
 * @returns {Promise<Object>} 处理结果
 */
async function handleFeedbackSubmission(user, requestData, env) {
    try {
        const { category, content } = requestData;
        
        // 验证必要字段
        if (!category || !content) {
            return { success: false, error: '缺少必要参数：category 和 content' };
        }
        
        // 验证内容长度
        if (content.length > 1000) {
            return { success: false, error: '反馈内容不能超过1000字符' };
        }
        
        // 基本XSS防护
        const sanitizedContent = content.replace(/<[^>]*>/g, '').trim();
        if (!sanitizedContent) {
            return { success: false, error: '反馈内容不能为空' };
        }
        
        // 防刷检查：同用户10分钟内只能提交1条
        const rateLimitKey = `feedback_rate_limit:${user.id}`;
        const lastSubmission = await env.FEEDBACK.get(rateLimitKey);
        const now = Date.now();
        
        if (lastSubmission) {
            const timeDiff = now - parseInt(lastSubmission);
            if (timeDiff < 10 * 60 * 1000) { // 10分钟
                const remainingTime = Math.ceil((10 * 60 * 1000 - timeDiff) / 60000);
                return { success: false, error: `请等待${remainingTime}分钟后再提交反馈` };
            }
        }
        
        // 生成反馈ID
        const feedbackId = `feedback_${user.id}_${now}`;
        
        // 构建反馈对象
        const feedback = {
            id: feedbackId,
            userId: user.id,
            email: user.email,
            category: category,
            content: sanitizedContent,
            created_at: new Date().toISOString(),
            status: 'pending'
        };
        
        // 保存反馈
        await env.FEEDBACK.put(feedbackId, JSON.stringify(feedback));
        
        // 更新用户反馈列表
        const userFeedbackKey = `user_feedback:${user.id}`;
        const existingList = await env.FEEDBACK.get(userFeedbackKey);
        const feedbackList = existingList ? JSON.parse(existingList) : [];
        feedbackList.unshift(feedbackId); // 新的在前
        
        // 只保留最近20条
        if (feedbackList.length > 20) {
            feedbackList.splice(20);
        }
        
        await env.FEEDBACK.put(userFeedbackKey, JSON.stringify(feedbackList));
        
        // 设置频率限制
        await env.FEEDBACK.put(rateLimitKey, now.toString(), { expirationTtl: 600 }); // 10分钟过期
        
        return {
            success: true,
            message: '反馈提交成功，感谢您的建议！',
            feedbackId: feedbackId
        };
        
    } catch (error) {
        console.error('处理反馈提交时出错:', error);
        return { success: false, error: '提交失败，请稍后重试' };
    }
}

/**
 * 管理员获取所有反馈
 * @param {Object} env - 环境变量
 * @returns {Promise<Object>} 所有反馈列表
 */
async function getAllFeedbackForAdmin(env) {
    try {
        // 获取所有以 "feedback_" 开头的键
        const allKeys = await env.FEEDBACK.list({ prefix: 'feedback_' });
        const allFeedback = [];
        
        // 获取每个反馈的详细信息
        for (const key of allKeys.keys) {
            try {
                const feedbackStr = await env.FEEDBACK.get(key.name);
                if (feedbackStr) {
                    const feedback = JSON.parse(feedbackStr);
                    allFeedback.push(feedback);
                }
            } catch (e) {
                console.error(`获取反馈详情失败: ${key.name}`, e);
            }
        }
        
        // 按时间倒序排列
        allFeedback.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        // 计算统计信息
        const stats = {
            total: allFeedback.length,
            pending: allFeedback.filter(f => f.status === 'pending').length,
            processed: allFeedback.filter(f => f.status === 'processed').length,
            today: allFeedback.filter(f => {
                const today = new Date().toISOString().split('T')[0];
                const feedbackDate = new Date(f.created_at).toISOString().split('T')[0];
                return feedbackDate === today;
            }).length
        };
        
        return {
            success: true,
            feedbacks: allFeedback,
            stats: stats,
            count: allFeedback.length
        };
        
    } catch (error) {
        console.error('管理员获取反馈列表时出错:', error);
        return { success: false, error: '获取反馈列表失败' };
    }
}

/**
 * 获取用户反馈列表
 * @param {Object} user - 用户信息
 * @param {Object} env - 环境变量
 * @returns {Promise<Object>} 反馈列表
 */
async function getUserFeedbackList(user, env) {
    try {
        const userFeedbackKey = `user_feedback:${user.id}`;
        const feedbackListStr = await env.FEEDBACK.get(userFeedbackKey);
        
        if (!feedbackListStr) {
            return {
                success: true,
                feedbacks: [],
                count: 0
            };
        }
        
        const feedbackIds = JSON.parse(feedbackListStr);
        const feedbacks = [];
        
        // 获取每个反馈的详细信息
        for (const feedbackId of feedbackIds) {
            try {
                const feedbackStr = await env.FEEDBACK.get(feedbackId);
                if (feedbackStr) {
                    const feedback = JSON.parse(feedbackStr);
                    // 只返回必要信息，不包含敏感数据
                    feedbacks.push({
                        id: feedback.id,
                        category: feedback.category,
                        content: feedback.content,
                        created_at: feedback.created_at,
                        status: feedback.status || 'pending'
                    });
                }
            } catch (e) {
                console.error(`获取反馈详情失败: ${feedbackId}`, e);
            }
        }
        
        return {
            success: true,
            feedbacks: feedbacks,
            count: feedbacks.length
        };
        
    } catch (error) {
        console.error('获取用户反馈列表时出错:', error);
        return { success: false, error: '获取反馈列表失败' };
    }
}

// 通用的带有重试逻辑的fetch函数
async function fetchWithRetry(url, options, apiName, env, maxRetries = 8, initialDelay = 1500) {
    // 允许通过 ENV 覆盖默认重试配置（不改变默认行为）
    const envMax = parseInt(env.RETRY_MAX_ATTEMPTS || env.FETCH_RETRY_MAX || '', 10);
    if (!isNaN(envMax) && envMax >= 0) maxRetries = envMax;
    const envDelay = parseInt(env.RETRY_INITIAL_DELAY_MS || env.FETCH_RETRY_INITIAL_DELAY_MS || '', 10);
    if (!isNaN(envDelay) && envDelay >= 0) initialDelay = envDelay;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(url, options);

            if (response.ok) {
                logInfo(env, `[Worker Log] 成功从 ${apiName} 获取响应 (尝试 ${attempt}/${maxRetries}).`);
                return response;
            }

            // Specific handling for 429 Too Many Requests
            if (response.status === 429) {
                if (attempt < maxRetries) {
                    const jitter = Math.floor(Math.random() * 1000);
                    const delay = initialDelay * Math.pow(2, attempt - 1) + jitter; // Exponential backoff with jitter
                    const errorContent = await response.text().catch(() => "无法读取错误内容");
                    logInfo(env, `[Worker Warning] ${apiName} 返回 429 (Too Many Requests). 尝试 #${attempt} of ${maxRetries}. 在 ${delay}ms 后重试... 错误: ${errorContent}`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue; // Next attempt
                }
            }

            // For other HTTP errors, or the last 429 attempt, construct and throw
            const errorContent = await response.text().catch(() => `Status ${response.status} with no readable body`);
            const err = new Error(`${apiName}调用失败 (HTTP ${response.status}): ${errorContent}`);
            err.status = response.status; // Attach status to the error object
            throw err;

        } catch (e) {
            console.error(`[Worker Error] 调用 ${apiName} 时发生错误 (尝试 #${attempt}/${maxRetries}): ${e.message}`);
            
            if (attempt < maxRetries) {
                const jitter = Math.floor(Math.random() * 1000);
                const delay = initialDelay * Math.pow(2, attempt - 1) + jitter;
                logInfo(env, `[Worker Warning] 请求失败，将在 ${delay}ms 后重试...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                console.error(`[Worker Error] 所有 ${maxRetries} 次尝试均失败。`);
                throw e; // Rethrow the last error, which will have the status code
            }
        }
    }
    // This should not be reached, but as a fallback
    throw new Error(`${apiName} 在 ${maxRetries} 次重试后仍然失败。`);
}

// Helper for JSON response
function jsonResponse(body, env, status = 200, additionalHeaders = {}) {
    const headers = new Headers({
        'Content-Type': 'application/json',
        ...additionalHeaders
    });
    addCorsHeaders(headers, env); // Add CORS headers here
    addSecurityHeaders(headers, env);

    // Log final response headers for jsonResponse
    let finalHeadersLog = "[Worker Log] jsonResponse final headers: ";
    for (let pair of headers.entries()) {
        finalHeadersLog += `\n  ${pair[0]}: ${pair[1]}`;
    }
    logInfo(env, finalHeadersLog);

    return new Response(JSON.stringify(body), {
        status: status,
        headers: headers
    });
}

// Helper for CORS preflight
function makeCorsResponse(request, env) { // Added request parameter
    logInfo(env, "[Worker Log] makeCorsResponse called.");
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*", // Allow all origins
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS", // Specify allowed methods
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With", // Specify allowed headers
        "Access-Control-Max-Age": "86400", // Cache preflight response for 1 day
    };

    // Handle specific preflight requests by echoing back the Access-Control-Request-Headers
    // This is important for complex requests that include custom headers.
    if (request && request.method === "OPTIONS") {
        const requestHeaders = request.headers.get("Access-Control-Request-Headers");
        if (requestHeaders) {
            corsHeaders["Access-Control-Allow-Headers"] = requestHeaders;
            logInfo(env, `[Worker Log] makeCorsResponse: Echoing Access-Control-Request-Headers: ${requestHeaders}`);
        }
    }
    
    const headers = new Headers(corsHeaders);
    addSecurityHeaders(headers, env);

    let headersLog = "[Worker Log] makeCorsResponse returning headers: ";
    for (let pair of headers.entries()) {
        headersLog += `\n  ${pair[0]}: ${pair[1]}`;
    }
    logInfo(env, headersLog);

    return new Response(null, {
        status: 204, // No Content for preflight
        headers: headers
    });
}

function addCorsHeaders(responseHeaders, env) { // responseHeaders should be a Headers object
    logInfo(env, "[Worker Log] addCorsHeaders called.");
    responseHeaders.set("Access-Control-Allow-Origin", "*");
    responseHeaders.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS"); // Should match makeCorsResponse
    responseHeaders.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With"); // Should match

    let headersLog = "[Worker Log] addCorsHeaders added headers: ";
    for (let pair of responseHeaders.entries()) { // Iterate over Headers object
        headersLog += `\n  ${pair[0]}: ${pair[1]}`;
    }
    logInfo(env, headersLog);
    // No need to return, as Headers object is modified by reference
} 

// Helper for Security headers (no behavior change)
function addSecurityHeaders(responseHeaders, env) {
    // Minimal, safe defaults that do not alter existing CORS behavior
    responseHeaders.set("Vary", "Origin");
    responseHeaders.set("X-Content-Type-Options", "nosniff");
    responseHeaders.set("Referrer-Policy", "no-referrer-when-downgrade");
    // Conservative Permissions-Policy: features not used by the app are disabled
    responseHeaders.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), interest-cohort=()");

    let headersLog = "[Worker Log] addSecurityHeaders added headers: ";
    for (let pair of responseHeaders.entries()) {
        headersLog += `\n  ${pair[0]}: ${pair[1]}`;
    }
    logInfo(env, headersLog);
}