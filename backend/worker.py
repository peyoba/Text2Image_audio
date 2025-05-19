import json
import requests # Ensure 'requests' is in backend/requirements.txt for the build command
import urllib.parse
import base64
import re # For DeepSeek text cleaning

# Placeholder for future imports from your other backend modules if needed
# e.g., from pollinations_api_handler import PollinationsAPI
# e.g., from config_module import AppConfig

# We will integrate logic from pollinations_api_handler.py and parts of generation_api.py here.
# No need to import config_module directly in worker.py as secrets/configs come from `env`.

class Handler:
    # --- Helper method for DeepSeek API call (adapted from optimize_api.py) ---
    def _optimize_prompt_with_deepseek(self, text_prompt: str, env):
        # Get DeepSeek API URL and Key from environment variables
        raw_deepseek_api_url = getattr(env, 'DEEPSEEK_API_URL', 'https://api.siliconflow.cn/v1/chat/completions')
        if not raw_deepseek_api_url.endswith('/v1/chat/completions'):
            if raw_deepseek_api_url.endswith('/'):
                DEEPSEEK_API_URL = raw_deepseek_api_url + 'v1/chat/completions'
            else:
                DEEPSEEK_API_URL = raw_deepseek_api_url + '/v1/chat/completions'
        else:
            DEEPSEEK_API_URL = raw_deepseek_api_url
        
        DEEPSEEK_API_KEY = getattr(env, 'DEEPSEEK_API_KEY', None)

        if not DEEPSEEK_API_KEY:
            print("[Worker Error] DEEPSEEK_API_KEY not found in environment variables.")
            # Fallback to original text if key is missing, and inform the user.
            return {'error': 'DeepSeek API密钥未配置', 'optimized_text': text_prompt, 'raw_optimized': text_prompt, 'original_prompt': text_prompt}

        # Construct the prompt for DeepSeek API
        engineered_prompt = f"""你是一个顶级的提示词工程师，专注于为最先进的文生图模型创作具有艺术性和画面感的提示词。请严格基于用户提供的原始描述中的核心主体、数量、场景和明确指定的风格（例如"写实风格"、"卡通风格"、"油画风格"等），进行优化和丰富。
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

原始描述：{text_prompt}"""

        headers = {
            'Authorization': f'Bearer {DEEPSEEK_API_KEY}',
            'Content-Type': 'application/json'
        }
        payload = {
            "model": "deepseek-ai/DeepSeek-V2.5",
            "messages": [
                {"role": "user", "content": engineered_prompt}
            ],
            "temperature": 0.5 # As per your optimize_api.py
        }
        api_timeout = int(getattr(env, 'DEEPSEEK_API_TIMEOUT', 30)) # Allow configuring timeout

        print(f"[Worker Log] 向 DeepSeek API 发送请求: URL={DEEPSEEK_API_URL}, Timeout={api_timeout}s")
        # print(f"[Worker Debug] DeepSeek Payload: {payload}") # Uncomment for debugging

        try:
            resp = requests.post(DEEPSEEK_API_URL, headers=headers, json=payload, timeout=api_timeout)
            resp.raise_for_status() # Raises HTTPError for bad responses (4xx or 5xx)
            result = resp.json()
            print(f"[Worker Log] DeepSeek API 原始响应: {result}")
            optimized_text_raw = result['choices'][0]['message']['content'].strip()

            # Cleaning logic from optimize_api.py
            english_pattern = re.compile(r"[a-zA-Z0-9\s\.,!?'\"\-\:\;()[\]{}<>#@$%^&*+=_\\|/~`]+")
            english_parts = english_pattern.findall(optimized_text_raw)
            optimized_text = " ".join(english_parts).strip()

            if not optimized_text and optimized_text_raw: 
                print(f"[Worker Warning] DeepSeek优化后的提示词清洗后为空（原始：'{optimized_text_raw}'）。将返回原始优化文本。")
                optimized_text = optimized_text_raw
            elif not optimized_text_raw:
                 print("[Worker Error] DeepSeek API返回了完全空的内容。将使用原始提示。")
                 return {'error': '优化API返回空内容', 'optimized_text': text_prompt, 'raw_optimized': text_prompt, 'original_prompt': text_prompt}
            
            # Heuristic check for significant reduction in length if original contained Chinese
            if len(optimized_text_raw) > len(optimized_text) + 10 and any(c >= '\u4e00' and c <= '\u9fff' for c in optimized_text_raw):
                print(f"[Worker Warning] 清洗后的提示词长度显著减少。原始: '{optimized_text_raw}', 清洗后: '{optimized_text}'.")

            print(f"[Worker Log] 优化后的提示词 (原始): {optimized_text_raw}")
            print(f"[Worker Log] 优化后的提示词 (清洗后): {optimized_text}")
            return {'optimized_text': optimized_text, 'raw_optimized': optimized_text_raw, 'original_prompt': text_prompt}
        
        except requests.exceptions.HTTPError as http_err:
            error_content = http_err.response.text if http_err.response else "No response content"
            print(f"[Worker Error] DeepSeek API HTTPError: {http_err}, Response: {error_content}")
            return {'error': f'优化API调用失败 (HTTP {http_err.response.status_code})', 'details': error_content, 'optimized_text': text_prompt, 'raw_optimized': text_prompt, 'original_prompt': text_prompt}
        except Exception as e:
            print(f"[Worker Error] DeepSeek API 调用时发生未知错误: {e}")
            import traceback
            traceback.print_exc()
            return {'error': f'优化API调用失败: {str(e)}', 'optimized_text': text_prompt, 'raw_optimized': text_prompt, 'original_prompt': text_prompt}

    # --- Helper methods adapted from pollinations_api_handler.py ---
    def _generate_image_from_pollinations(self, prompt: str, env, width: int = None, height: int = None, seed: int = None) -> bytes:
        image_api_base = getattr(env, 'POLLINATIONS_IMAGE_API_BASE', "https://pollinations.ai/p/")
        api_timeout = int(getattr(env, 'POLLINATIONS_API_TIMEOUT', 60))

        if not image_api_base:
            print("[Worker Error] Image API base URL not provided in env.POLLINATIONS_IMAGE_API_BASE")
            raise ValueError("图片API基地址未在环境变量中配置")

        encoded_prompt = urllib.parse.quote(prompt)
        params = {}
        if width:
            params['width'] = width
        if height:
            params['height'] = height
        if seed:
            params['seed'] = seed
        
        url = f"{image_api_base}{encoded_prompt}"
        print(f"[Worker Log] 向 Pollinations 图片 API 发送请求: {url}，参数: {params}, 超时: {api_timeout}s")
        
        try:
            response = requests.get(url, params=params, timeout=api_timeout)
            response.raise_for_status() # Raises an HTTPError for bad responses (4XX or 5XX)
            print(f"[Worker Log] Pollinations 图片 API 响应成功，状态码: {response.status_code}")
            return response.content
        except requests.exceptions.RequestException as e:
            print(f"[Worker Error] Pollinations 图片 API 请求失败: {e}")
            raise
        except Exception as e:
            print(f"[Worker Error] 处理图片生成时发生未知错误: {e}")
            status_code = response.status_code if 'response' in locals() and hasattr(response, 'status_code') else '未知'
            raise ValueError(f"API返回错误状态: {status_code}")

    def _generate_audio_from_pollinations(self, prompt: str, env, voice: str = "nova", model: str = "openai-audio", output_format: str = "mp3") -> bytes:
        text_api_base = getattr(env, 'POLLINATIONS_TEXT_API_BASE', "https://text.pollinations.ai/")
        api_timeout = int(getattr(env, 'POLLINATIONS_API_TIMEOUT', 60))

        if not text_api_base:
            print("[Worker Error] Text/Audio API base URL not provided in env.POLLINATIONS_TEXT_API_BASE")
            raise ValueError("文本/语音API基地址未在环境变量中配置")

        api_description = f"GET {text_api_base}"
        print(f"[Worker Log] _generate_audio_from_pollinations ({api_description}) called with prompt: '{prompt}', model: '{model}', voice: '{voice}', 超时: {api_timeout}s")

        instructional_prefix = "Say: "
        engineered_prompt = f"{instructional_prefix}{prompt}"
        encoded_prompt = urllib.parse.quote(engineered_prompt)
        
        current_text_api_base = text_api_base
        if not current_text_api_base.endswith('/'):
            current_text_api_base += '/'
        
        url = f"{current_text_api_base}{encoded_prompt}?model={model}&voice={voice}"
        print(f"[Worker Log] 向 Pollinations 文本/语音 API 发送请求: {url}")

        try:
            response = requests.get(url, timeout=api_timeout)
            actual_content_type = response.headers.get('Content-Type', '').lower()
            print(f"[Worker Log] Pollinations API ({api_description}) response status: {response.status_code}, content length: {len(response.content)}")
            # print(f"[Worker Debug] Response headers: {response.headers}") # Uncomment for debugging

            if response.status_code == 200:
                # Looser check for audio content type as Pollinations might vary
                if "audio/" in actual_content_type:
                    if len(response.content) < 100: # Arbitrary small size check
                        print(f"[Worker Warning] Pollinations API ({api_description}) returned very small audio content (length: {len(response.content)}).")
                    print(f"[Worker Log] 成功从 Pollinations API 接收到音频流. Content-Type: {actual_content_type}")
                    return response.content
                else:
                    error_text = response.text[:500] if hasattr(response, 'text') else "(no text in response)"
                    print(f"[Worker Error] Pollinations API ({api_description}) 返回 200 但 Content-Type 不符合预期音频: {actual_content_type}. Raw content snippet: {error_text}...")
                    raise ValueError(f"API 返回 200 但 Content-Type ({actual_content_type}) 不符合预期音频格式")
            else:
                error_details = ""
                try:
                    if 'application/json' in actual_content_type:
                        error_json = response.json()
                        error_details = f"JSON Response: {error_json}"
                    else:
                        error_details = f"Raw Text Response: {response.text[:500]}..."
                except ValueError:
                    error_details = f"Raw Text Response (JSON parse failed): {response.text[:500]}..."
                
                print(f"[Worker Error] Pollinations API ({api_description}) 返回非200状态码. Status: {response.status_code}, Content-Type: {actual_content_type}. Details: {error_details}")
                raise ValueError(f"API 请求失败. Status: {response.status_code}. Details: {error_details}")

        except requests.exceptions.RequestException as e:
            print(f"[Worker Error] Pollinations API ({api_description}) 请求失败: {e}")
            raise
        except Exception as e:
            print(f"[Worker Error] 处理 Pollinations API ({api_description}) 音频生成时发生未知错误: {e}")
            raise

    # --- Worker fetch handler ---
    async def fetch(self, request, env, ctx):
        """
        Entry point for Cloudflare Worker.
        request: The incoming HTTP Request object.
        env: An object containing environment variables, KV/R2 bindings, etc.
        ctx: The execution context, used for things like ctx.waitUntil().
        """
        path = request.url.path
        method = request.method

        # Handle CORS preflight (OPTIONS) requests
        if method == "OPTIONS":
            return self._make_cors_response()

        try:
            if method == "POST" and path == "/api/optimize":
                request_data = await request.json()
                text_prompt = request_data.get('text')
                if not text_prompt:
                    return self._json_response({'error': '缺少必要的参数: text'}, status=400)
                
                print(f"[Worker Log] Processing optimize request for prompt: '{text_prompt[:50]}...'")
                optimization_result = self._optimize_prompt_with_deepseek(text_prompt, env)
                return self._json_response(optimization_result)
            
            elif method == "POST" and path == "/api/generate":
                request_data = await request.json()
                text_prompt = request_data.get('text')
                gen_type = request_data.get('type')

                if not text_prompt or not gen_type:
                    return self._json_response({'error': '缺少必要的参数: text 和 type'}, status=400)

                if gen_type not in ['image', 'audio']:
                    return self._json_response({'error': '不支持的生成类型，请使用 image 或 audio'}, status=400)

                result_data = None
                content_type_label = ""

                if gen_type == 'image':
                    # Extract optional image parameters from request_data
                    width = request_data.get('width')
                    height = request_data.get('height')
                    seed = request_data.get('seed')
                    print(f"[Worker Log] Processing image generation for prompt: '{text_prompt[:50]}...'")
                    image_bytes = self._generate_image_from_pollinations(text_prompt, env, width=width, height=height, seed=seed)
                    result_data = base64.b64encode(image_bytes).decode('utf-8')
                    content_type_label = "image/jpeg" # Assuming jpeg, adjust if API provides specific type
                    return self._json_response({"type": gen_type, "data": result_data, "format": "base64", "content_type": content_type_label })
                
                elif gen_type == 'audio':
                    # Extract optional audio parameters
                    voice = request_data.get('voice', 'nova')
                    model = request_data.get('model', 'openai-audio')
                    print(f"[Worker Log] Processing audio generation for prompt: '{text_prompt[:50]}...'")
                    audio_bytes = self._generate_audio_from_pollinations(text_prompt, env, voice=voice, model=model)
                    result_data = base64.b64encode(audio_bytes).decode('utf-8')
                    content_type_label = "audio/mpeg" # Assuming mp3, adjust if API provides specific type
                    return self._json_response({"type": gen_type, "data": result_data, "format": "base64", "content_type": content_type_label })

            # Removed /api/optimize placeholder as optimize_api.py does not exist
            # if method == "POST" and path == "/api/optimize":
            #     response_body = {"message": "Optimize endpoint reached (placeholder)"}
            #     return self._json_response(response_body)

            else:
                return self._json_response({"error": "Not Found", "path": path}, status=404)
        
        except Exception as e:
            error_message = f"An unexpected error occurred in fetch: {str(e)}"
            print(f"[Worker Error] {error_message}") 
            import traceback
            traceback.print_exc() # Print full traceback to worker logs
            return self._json_response({"error": "服务器内部错误", "details": error_message}, status=500)

    def _json_response(self, body, status=200):
        """Helper to create a JSON response with CORS headers."""
        headers = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",  # Be more specific in production
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        }
        # The global Response object is provided by the Cloudflare Workers runtime
        return Response(json.dumps(body), status=status, headers=headers)

    def _make_cors_response(self):
        """Helper to create a CORS preflight response."""
        headers = {
            "Access-Control-Allow-Origin": "*", # Be more specific in production
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Max-Age": "86400", # Cache preflight for 1 day
        }
        return Response(status=204, headers=headers)

# The Cloudflare Python Worker runtime looks for a class (often named Handler or Worker)
# with an async fetch method. 