import requests
import urllib.parse
import logging
import base64
# from flask import current_app # 不再需要 current_app

# # Pollinations API 基地址 (将从配置中读取)
# POLLINATIONS_IMAGE_API_BASE = \"https://pollinations.ai/p/\"
# POLLINATIONS_TEXT_API_BASE = \"https://text.pollinations.ai/\"

# 获取一个logger实例
logger = logging.getLogger(__name__)

def generate_image_from_api(prompt: str, image_api_base: str, api_timeout: int, width: int = None, height: int = None, seed: int = None) -> bytes:
    """
    通过 Pollinations API 生成图片。
    API URL 和超时时间作为参数传入。
    """
    if not image_api_base:
        logger.error("image_api_base 参数未提供")
        raise ValueError("图片API基地址未提供")

    encoded_prompt = urllib.parse.quote(prompt)
    params = {}
    if width:
        params['width'] = width
    if height:
        params['height'] = height
    if seed:
        params['seed'] = seed
    
    url = f"{image_api_base}{encoded_prompt}"
    logger.info(f"向 Pollinations 图片 API 发送请求: {url}，参数: {params}, 超时: {api_timeout}s")
    
    try:
        response = requests.get(url, params=params, timeout=api_timeout)
        response.raise_for_status()
        logger.info(f"Pollinations 图片 API 响应成功，状态码: {response.status_code}")
        return response.content
    except requests.exceptions.RequestException as e:
        logger.error(f"Pollinations 图片 API 请求失败: {e}")
        raise
    except Exception as e:
        logger.error(f"处理图片生成时发生未知错误: {e}")
        status_code = response.status_code if 'response' in locals() and hasattr(response, 'status_code') else '未知'
        raise ValueError(f"API返回错误状态: {status_code}")


def generate_audio_from_api(prompt: str, text_api_base: str, api_timeout: int, voice: str = "nova", model: str = "openai-audio", output_format: str = "mp3") -> bytes:
    """
    通过 Pollinations API 生成语音。
    API URL 和超时时间作为参数传入。
    """
    if not text_api_base:
        logger.error("text_api_base 参数未提供")
        raise ValueError("文本/语音API基地址未提供")

    api_description = f"GET {text_api_base}"
    logger.info(f"generate_audio_from_api ({api_description}) called with original_prompt: '{prompt}', model: '{model}', voice: '{voice}', 超时: {api_timeout}s")

    instructional_prefix = "Say: "
    engineered_prompt = f"{instructional_prefix}{prompt}"
    encoded_prompt = urllib.parse.quote(engineered_prompt)
    
    current_text_api_base = text_api_base
    if not current_text_api_base.endswith('/'):
        current_text_api_base += '/'
    
    url = f"{current_text_api_base}{encoded_prompt}?model={model}&voice={voice}"
    logger.info(f"向 Pollinations 文本/语音 API 发送请求: {url}")

    try:
        response = requests.get(url, timeout=api_timeout)
        actual_content_type = response.headers.get('Content-Type', '').lower()
        logger.info(f"Pollinations API ({api_description}) response status: {response.status_code}, content length: {len(response.content)}")
        logger.debug(f"Response headers: {response.headers}")

        if response.status_code == 200:
            if f"audio/{output_format.lower()}" in actual_content_type or "audio/mpeg" in actual_content_type:
                if len(response.content) < 100:
                    logger.warning(f"Pollinations API ({api_description}) returned very small audio content (length: {len(response.content)}).")
                logger.info(f"成功从 Pollinations API 接收到音频流. Content-Type: {actual_content_type}")
                return response.content
            else:
                logger.error(f"Pollinations API ({api_description}) 返回 200 但 Content-Type 不符合预期: {actual_content_type}. Raw content: {response.text[:500]}...")
                raise ValueError(f"API 返回 200 但 Content-Type 不符合预期: {actual_content_type}")
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
            
            logger.error(f"Pollinations API ({api_description}) 返回非200状态码. Status: {response.status_code}, Content-Type: {actual_content_type}. Details: {error_details}")
            raise ValueError(f"API 请求失败. Status: {response.status_code}. Details: {error_details}")

    except requests.exceptions.RequestException as e:
        logger.error(f"Pollinations API ({api_description}) 请求失败: {e}")
        raise
    except Exception as e:
        logger.error(f"处理 Pollinations API ({api_description}) 音频生成时发生未知错误: {e}")
        raise

if __name__ == '__main__':
    print("此脚本包含API处理函数，需要配置信息（如API URL和超时）作为参数传入才能执行。")
    print("不能直接运行此文件进行有效测试。") 