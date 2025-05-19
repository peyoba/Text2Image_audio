import os
import requests
from flask import Blueprint, request, jsonify
import re
import logging

logger = logging.getLogger(__name__)

optimize_bp = Blueprint('optimize_api', __name__, url_prefix='/api')

# DEEPSEEK_API_URL = os.environ.get('DEEPSEEK_API_URL', 'https://api.siliconflow.cn/v1/chat/completions')
# DEEPSEEK_API_KEY = os.environ.get('DEEPSEEK_API_KEY', '')

# 修正 DEEPSEEK_API_URL 的获取，确保指向正确的端点
raw_deepseek_api_url = os.environ.get('DEEPSEEK_API_URL', 'https://api.siliconflow.cn/v1/chat/completions')
if not raw_deepseek_api_url.endswith('/v1/chat/completions'):
    if raw_deepseek_api_url.endswith('/'):
        DEEPSEEK_API_URL = raw_deepseek_api_url + 'v1/chat/completions'
    else:
        DEEPSEEK_API_URL = raw_deepseek_api_url + '/v1/chat/completions'
else:
    DEEPSEEK_API_URL = raw_deepseek_api_url

DEEPSEEK_API_KEY = os.environ.get('DEEPSEEK_API_KEY', '')

# 启动时自动测试 deepseek key
if __name__ != '__main__':
    print('[DEEPSEEK自动测试] 当前key:', DEEPSEEK_API_KEY)
    test_prompt = "你现在是一个AI图片生成机器人。请发挥你的想象力，优化并丰富用户的图片描述，补充细节、风格、氛围等信息，并将其转换为适合AI绘画的英文提示词。只输出英文提示词，不要输出其他内容。\n\n原始描述：一只可爱的猫。"
    payload = {
        "model": "deepseek-ai/DeepSeek-V2.5",
        "messages": [
            {"role": "user", "content": test_prompt}
        ],
        "temperature": 0.7
    }
    headers = {
        'Authorization': f'Bearer {DEEPSEEK_API_KEY}',
        'Content-Type': 'application/json'
    }
    try:
        print('[DEEPSEEK自动测试] 请求体:', payload)
        resp = requests.post(DEEPSEEK_API_URL, headers=headers, json=payload, timeout=30)
        print('[DEEPSEEK自动测试] 状态码:', resp.status_code)
        print('[DEEPSEEK自动测试] 响应内容:', resp.text)
    except Exception as e:
        print('[DEEPSEEK自动测试] 异常:', str(e))

@optimize_bp.route('/optimize', methods=['POST', 'OPTIONS'])
def optimize_prompt():
    if request.method == 'OPTIONS':
        return '', 200
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({'error': '缺少必要参数 text'}), 400
    text = data['text']
    # 构造prompt
    prompt = f"""你是一个顶级的提示词工程师，专注于为最先进的文生图模型创作具有艺术性和画面感的提示词。请严格基于用户提供的原始描述中的核心主体、数量、场景和明确指定的风格（例如"写实风格"、"卡通风格"、"油画风格"等），进行优化和丰富。
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

原始描述：{text}"""
    try:
        headers = {
            'Authorization': f'Bearer {DEEPSEEK_API_KEY}',
            'Content-Type': 'application/json'
        }
        payload = {
            "model": "deepseek-ai/DeepSeek-V2.5",
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.5
        }
        print('[DeepSeek请求]', {'url': DEEPSEEK_API_URL, 'key': DEEPSEEK_API_KEY[:8]+'***', 'payload': payload})
        resp = requests.post(DEEPSEEK_API_URL, headers=headers, json=payload, timeout=30)
        resp.raise_for_status()
        result = resp.json()
        print('[DeepSeek原始响应]', result)
        optimized_text_raw = result['choices'][0]['message']['content'].strip()

        # 清洗DeepSeek的输出，只保留英文字符、数字、常见标点和空格
        # 使用正则表达式匹配常见的英文内容，去除可能混入的中文
        # 这个正则表达式会匹配大部分英文字母、数字、空格以及一些基本标点符号
        # 对于更复杂的标点或特殊字符，可能需要调整
        english_pattern = re.compile(r"[a-zA-Z0-9\s\.,!?'\"\-\:;()\[\]{}<>#@$%^&*+=_\\|/~`]+") # Restored original regex
        english_parts = english_pattern.findall(optimized_text_raw)
        optimized_text = " ".join(english_parts).strip()
        
        if not optimized_text: # 如果清洗后为空，则回退到原始提示词
            logger.warning(f"DeepSeek优化后的提示词清洗后为空，原始输出为: '{optimized_text_raw}'. 将使用用户原始提示词.")
            # 注意：这里应该返回用户输入的原始中文提示词对应的 *英文翻译* 或用户原始提示词本身（如果已经是英文）
            # 但当前 optimize_api 设计为只优化，不直接翻译。因此，如果优化出问题，返回原始中文文本给一个只接受英文的API是不合适的。
            # 更好的做法可能是：如果清洗后为空，则直接报错，或者返回一个通用的安全英文提示词。
            # 这里暂时返回一个错误，提示优化失败，前端应处理此情况。
            # 或者，如果text本身已经是英文（虽然不太可能进入这个API），可以直接返回text。
            # 为了简单起见，如果清洗失败，我们还是返回原始的、可能带中文的优化文本，依赖下游API的容错性，或者在前端提示。
            # 但更好的策略是确保DeepSeek的输出符合预期，或者有更鲁棒的清洗方案。
            # 决定：如果清洗后为空，那么就认为优化失败，返回原始未清洗的，并记录日志。
            # 更进一步，如果optimized_text_raw明显包含中文，而清洗后为空，说明清洗逻辑可能过于激进或模式不匹配
            # 更好的处理是，如果清洗后结果与原始结果差异过大（例如长度锐减且原始包含中文），也应警惕。

            # 重新考虑：如果清洗后为空，但原始文本不为空，说明清洗可能过度，此时返回原始的优化文本并警告
            if optimized_text_raw: # 确保原始优化文本不为空
                logger.warning(f"DeepSeek优化后的提示词清洗后为空（原始：'{optimized_text_raw}'）。可能清洗逻辑过于激进或模式不匹配。将返回原始优化文本。")
                optimized_text = optimized_text_raw 
            else: # 如果原始优化文本也为空（不太可能）
                logger.error("DeepSeek API返回了完全空的内容。")
                # 这种情况也应该让前端知道优化失败
                return jsonify({'error': '优化API返回空内容', 'optimized_text': text}), 200 # 返回原始text

        # 检查清洗后的文本是否与原始优化文本差异过大 (比如，如果原始包含中文，清洗后几乎没了)
        # 这是一个简单的启发式检查，可以根据需要调整
        if len(optimized_text_raw) > len(optimized_text) + 10 and any(c >= '\u4e00' and c <= '\u9fff' for c in optimized_text_raw):
            logger.warning(f"清洗后的提示词长度显著减少，可能丢失了信息。原始: '{optimized_text_raw}', 清洗后: '{optimized_text}'. 考虑检查清洗逻辑或DeepSeek输出。")
            # 在这种情况下，也可能选择返回原始未清洗的文本，或者更复杂的处理
            # 当前选择：相信清洗逻辑，但留下警告

        logger.info(f"优化后的提示词 (原始): {optimized_text_raw}")
        logger.info(f"优化后的提示词 (清洗后): {optimized_text}")

        return jsonify({'optimized_text': optimized_text, 'raw_optimized': optimized_text_raw, 'original_prompt': text})
    except Exception as e:
        print('[DeepSeek异常]', str(e))
        if 'resp' in locals():
            try:
                print('[DeepSeek异常响应]', resp.text)
                return jsonify({'error': f'优化API调用失败: {str(e)}', 'optimized_text': text, 'raw': resp.text}), 200
            except Exception:
                pass
        return jsonify({'error': f'优化API调用失败: {str(e)}', 'optimized_text': text}), 200 