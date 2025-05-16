"""
Celery任务定义文件，处理异步生成任务。
"""
import logging
import base64
import io # for audio mimetypes if needed
from celery import Celery
from celery.result import AsyncResult
# from flask import current_app # 如果 ContextTask 被使用且任务需要app context，则可能需要

# 从 backend 包导入，以确保相对路径正确
# from backend.utils.model_utils import ModelManager # 不再需要 ModelManager
from backend.config import get_config # 导入配置
from backend import pollinations_api_handler # 导入整个模块

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 创建Celery实例并直接应用配置
config = get_config()
celery_app = Celery('text2image_audio')
celery_app.conf.update(
    broker_url=config.broker_url,
    result_backend=config.result_backend,
    task_serializer=config.task_serializer,
    result_serializer=config.result_serializer,
    accept_content=config.accept_content,
    timezone=config.timezone,
    enable_utc=config.enable_utc,
    task_always_eager=config.task_always_eager,
    task_store_eager_result=config.task_store_eager_result
)

def init_celery(app):
    """初始化 Celery 配置"""
    celery_app.conf.update(app.config)
    return celery_app

@celery_app.task(bind=True)
def generate_content_via_pollinations_task(self, text: str, gen_type: str):
    """
    通过 Pollinations API 异步生成内容。
    """
    task_id = self.request.id
    logger.info(f"[Task ID: {task_id}] 开始通过 Pollinations API 生成内容。类型: {gen_type}, 文本: '{text[:50]}...'")
    
    # 获取当前配置
    config = get_config()
    
    # 从配置中获取API URL和超时
    image_api_base = config.POLLINATIONS_IMAGE_API_BASE
    text_api_base = config.POLLINATIONS_TEXT_API_BASE
    api_timeout = config.POLLINATIONS_API_TIMEOUT

    if not image_api_base or not text_api_base:
        error_msg = "Pollinations API基地址未在配置中正确设置。"
        logger.error(f"[Task ID: {task_id}] {error_msg}")
        raise ValueError(error_msg)

    try:
        if gen_type == 'image':
            image_bytes = pollinations_api_handler.generate_image_from_api(
                prompt=text, 
                image_api_base=image_api_base, 
                api_timeout=api_timeout
            )
            image_base64 = base64.b64encode(image_bytes).decode('utf-8')
            logger.info(f"[Task ID: {task_id}] 图片生成成功 (Pollinations API)。")
            return {
                'type': 'image',
                'data': f"data:image/jpeg;base64,{image_base64}"
            }
        elif gen_type == 'audio':
            audio_bytes = pollinations_api_handler.generate_audio_from_api(
                prompt=text, 
                text_api_base=text_api_base, 
                api_timeout=api_timeout
            )
            audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')
            logger.info(f"[Task ID: {task_id}] 音频生成成功 (Pollinations API)。")
            return {
                'type': 'audio',
                'data': f"data:audio/mpeg;base64,{audio_base64}"
            }
        else:
            error_msg = f"不支持的生成类型: {gen_type}"
            logger.error(f"[Task ID: {task_id}] {error_msg}")
            raise ValueError(error_msg)
            
    except Exception as e:
        error_msg = f"通过 Pollinations API 生成内容时出错: {str(e)}"
        logger.error(f"[Task ID: {task_id}] {error_msg}", exc_info=True)
        raise

# cleanup_old_files 任务不再需要，因为我们不生成本地文件了
# @celery_app.task
# def cleanup_old_files():
#     """清理旧文件的任务 (如果本地生成音频/图片并保存了文件)"""
#     try:
#         output_dir = celery_app.conf.get('GENERATED_OUTPUT_DIR')
#         if output_dir:
#             logger.info(f"开始清理旧文件任务，目标目录: {output_dir}")
#         else:
#             logger.warning("GENERATED_OUTPUT_DIR 未配置，跳过文件清理。")
#         pass
#     except Exception as e:
#         logger.error(f"清理文件失败: {str(e)}", exc_info=True)

def get_task_status(task_id: str):
    """
    获取Celery任务的状态和结果。
    返回一个包含任务信息的字典，如果任务未找到则返回None。
    """
    task_result = AsyncResult(task_id, app=celery_app)
    
    status_info = {
        'task_id': task_id,
        'status': task_result.status,
    }
    
    if task_result.date_done:
        status_info['last_updated'] = task_result.date_done.isoformat()

    if task_result.successful():
        status_info['status'] = 'SUCCESS'  # 确保返回 SUCCESS 状态
        status_info['result'] = task_result.result
    elif task_result.failed():
        status_info['status'] = 'FAILURE'  # 确保返回 FAILURE 状态
        status_info['error'] = str(task_result.info)
        status_info['traceback'] = task_result.traceback
    elif task_result.status == 'PENDING':
        status_info['status'] = 'PENDING'
        status_info['result'] = None
    elif task_result.status in ['STARTED', 'RETRY']:
        status_info['status'] = task_result.status
        status_info['result'] = task_result.info
    
    return status_info 