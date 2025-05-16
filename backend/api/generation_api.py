from flask import Blueprint, request, jsonify, current_app
from backend.tasks import generate_content_via_pollinations_task, get_task_status # 假设任务定义在 tasks.py
import logging

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 创建一个名为 \'generation_api\' 的蓝图对象。
# url_prefix 会使得此蓝图下所有路由都以 /api 开头。
generation_bp = Blueprint('generation_api', __name__, url_prefix='/api')

@generation_bp.route('/generate', methods=['POST'])
def generate_content():
    """
    接收生成请求，并将其作为异步任务提交。
    请求体:
    {
        "text": "要生成的文本",
        "type": "image" 或 "audio"
    }
    成功时返回任务ID。
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': '无效的请求数据'}), 400

        text = data.get('text')
        gen_type = data.get('type')

        if not text or not gen_type:
            return jsonify({'error': '缺少必要的参数'}), 400

        if gen_type not in ['image', 'audio']:
            return jsonify({'error': '不支持的生成类型'}), 400

        # 提交任务
        task = generate_content_via_pollinations_task.delay(text, gen_type)
        task_id = task.id
        logger.info(f"任务已提交: ID {task_id}, 类型 {gen_type}, 文本: '{text[:50]}...'")

        # 返回任务状态URL
        return jsonify({
            'status_url': f'/api/tasks/{task_id}',
            'task_id': task_id
        }), 202

    except Exception as e:
        logger.error(f"处理生成请求时出错: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500

@generation_bp.route('/tasks/<task_id>', methods=['GET'])
def get_task(task_id):
    """
    查询指定task_id的异步任务状态和结果。
    """
    try:
        status_info = get_task_status(task_id)
        if not status_info:
            return jsonify({'error': '任务不存在'}), 404

        logger.info(f"任务 {task_id} 状态: {status_info['status']}")
        return jsonify(status_info), 200

    except Exception as e:
        logger.error(f"获取任务状态时出错: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500 