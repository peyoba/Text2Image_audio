// backend/index.js

function logInfo(env, ...args) {
    // Only log if LOG_LEVEL is explicitly set to 'debug'
    if ((env.LOG_LEVEL || 'info').toLowerCase() === 'debug') {
        console.log(...args);
    }
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
            headersLog += `\n  ${pair[0]}: ${pair[1]}`;
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
            if (method === "POST" && path === "/api/optimize") {
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
                    // --- Use Actual Parameters from Request (directly from requestData) ---
                    const actualPrompt = requestData.text; 
                    const actualWidth = requestData.width; // Directly from requestData
                    const actualHeight = requestData.height; // Directly from requestData
                    const actualNologo = requestData.nologo; // Directly from requestData
                    const seed = requestData.seed; // Directly from requestData, if provided
                    const negative = requestData.negative; // 新增，负面提示词
                    // --- End of Actual Parameters ---

                    logInfo(env, `[Worker Log] Processing image generation for prompt: '${actualPrompt.substring(0,100)}...', width: ${actualWidth}, height: ${actualHeight}, seed: ${seed}, nologo: ${actualNologo}, negative: ${negative}`);
                    const imageArrayBuffer = await generateImageFromPollinations(actualPrompt, env, actualWidth, actualHeight, seed, actualNologo, negative);
                    // Convert ArrayBuffer to Base64 string
                    const base64Image = arrayBufferToBase64(imageArrayBuffer);
                    return jsonResponse({ type: genType, data: base64Image, format: "base64", content_type: "image/jpeg" }, env); // Assuming jpeg
                } else if (genType === 'audio') {
                    const voice = requestData.voice || env.DEFAULT_AUDIO_VOICE || 'nova';
                    const model = requestData.model || env.DEFAULT_AUDIO_MODEL || 'openai-audio';
                    // const outputFormat = requestData.output_format || 'mp3'; // output_format was defined in python but not used for request.
                    logInfo(env, `[Worker Log] Processing audio generation for prompt: '${textPrompt.substring(0, 50)}...'`);
                    const audioArrayBuffer = await generateAudioFromPollinations(textPrompt, env, voice, model);
                    
                    let audioContentType = "audio/mpeg"; // Default for mp3
                    // TODO: Determine actual audio content type from Pollinations response if possible, or make it configurable
                    // For example, if Pollinations API returns a more specific content type in its headers.
                    // if (outputFormat === "opus") audioContentType = "audio/opus";
                    // else if (outputFormat === "aac") audioContentType = "audio/aac";
                    // else if (outputFormat === "flac") audioContentType = "audio/flac";

                    const audioRespHeaders = new Headers();
                    audioRespHeaders.append('Content-Type', audioContentType);
                    addCorsHeaders(audioRespHeaders, env);
                    
                    return new Response(audioArrayBuffer, { status: 200, headers: audioRespHeaders });
                }
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
            // Check if the error has a status property and if it's 429
            if (e.status === 429) {
                return jsonResponse({
                    error: "生成服务正忙",
                    details: "当前生成服务队列已满，我们的系统已自动重试数次但仍未成功。这通常是临时状况，请您稍等片刻再重新提交。"
                }, env, 503); // 503 Service Unavailable is more appropriate for a temporary overload
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

async function generateImageFromPollinations(prompt, env, width, height, seed, nologo, negative) {
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
    if (seed) params.append('seed', seed);
    if (nologo) params.append('nologo', nologo);
    if (negative) params.append('negative', encodeURIComponent(negative)); // Ensure negative prompt is also encoded

    const fullUrl = `${imageApiBase}${promptPath}${encodedPrompt}?${params.toString()}`;
    logInfo(env, `[Worker Log] 向 Pollinations Image API 发送请求: ${fullUrl}`);
    
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
    }, "Pollinations Image API", env);

    return await response.arrayBuffer();
}

async function generateAudioFromPollinations(prompt, env, voice = "nova", model = "openai-audio") {
    let textApiBase = env.POLLINATIONS_TEXT_API_BASE || "https://text.pollinations.ai";
    if (!textApiBase) {
        console.error("[Worker Error] Text API base URL not provided in env.POLLINATIONS_TEXT_API_BASE");
        throw new Error("语音API基地址未在环境变量中配置");
    }
    if (!textApiBase.endsWith('/')) {
        textApiBase = textApiBase + '/';
    }

    // 添加 'Say: ' 前缀
    const instructionalPrefix = "Say: ";
    const engineeredPrompt = `${instructionalPrefix}${prompt}`;
    const encodedPrompt = encodeURIComponent(engineeredPrompt);
    
    const params = new URLSearchParams({
        model: model,
        voice: voice
    });
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

// 通用的带有重试逻辑的fetch函数
async function fetchWithRetry(url, options, apiName, env, maxRetries = 3, initialDelay = 3000) {
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
    
    let headersLog = "[Worker Log] makeCorsResponse returning headers: ";
    for (let key in corsHeaders) {
        headersLog += `\n  ${key}: ${corsHeaders[key]}`;
    }
    logInfo(env, headersLog);

    return new Response(null, {
        status: 204, // No Content for preflight
        headers: corsHeaders
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