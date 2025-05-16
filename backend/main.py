# backend/main.py
"""
后端主应用程序入口。
负责初始化Flask应用、注册蓝图、初始化Celery和启动Web服务。
"""

import os # 需要导入 os
from flask import Flask, jsonify, send_from_directory # 需要导入 send_from_directory
from flask_cors import CORS  # 导入 CORS
from backend.config import get_config # 导入配置加载函数
from backend.tasks import init_celery, celery_app # 导入 init_celery 和 celery_app 实例
from backend.api.generation_api import generation_bp # 导入新的API蓝图
import logging

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_app(config_name=None):
    """
    应用工厂函数，用于创建和配置Flask应用实例。
    """
    # 计算 frontend 目录的绝对路径
    # __file__ 是 backend/main.py 的路径
    # os.path.dirname(__file__) 是 backend/ 目录
    # os.path.join(os.path.dirname(__file__), '..', 'frontend') 会得到 project_root/frontend
    frontend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend'))
    
    app = Flask(__name__, static_folder=frontend_dir, static_url_path='')
    # app = Flask(__name__) # 旧的初始化

    # 配置 CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:8000", "http://127.0.0.1:8000", "http://192.168.0.114:8000"],
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type"]
        }
    })

    # 从配置对象加载配置
    # config_name 通常是 'development', 'production' 等
    # 如果未提供，则 get_config() 会使用 FLASK_ENV 或默认值
    current_config = get_config(config_name) 
    app.config.from_object(current_config)

    # 初始化Celery并确保配置正确传递
    celery_app.conf.update(app.config)
    init_celery(app)

    # 定义一个简单的根路由用于测试服务是否运行
    @app.route('/')
    def home():
        """
        根路径，返回一个简单的欢迎信息。
        """
        # return jsonify({"message": "欢迎来到文生图与文生语音后端服务! (Celery集成版)", "status": "running"})
        # 修改为服务 index.html
        if not app.static_folder: # 防御性编程，确保 static_folder 已设置
            return "Error: Static folder not configured.", 500
        return send_from_directory(app.static_folder, 'index.html')

    # 定义一个路由来处理所有其他静态文件请求（CSS, JS, images等）
    # Flask 默认会从 static_folder 查找 static_url_path 下的路径
    # 由于我们将 static_url_path 设置为 ''， 像 /js/app.js 这样的请求会被正确处理
    # 但是，如果 index.html 中的资源路径是相对的，例如 "js/app.js" 而不是 "/js/app.js"
    # 并且用户访问的是 / (而不是 /index.html)，则可能需要这个额外的路由。
    # 不过，更标准的方式是确保 index.html 中的资源路径是以 / 开头或者 Flask 的 static_url_path 不是空字符串。
    # 鉴于我们将 static_url_path 设置为空字符串，Flask 的默认静态文件处理应该足够。
    # 如果 index.html 引用如 "css/style.css"，它会被 Flask 视为相对于当前请求路径 (/)
    # 除非我们显式地将 static_url_path 设置为例如 "/static"，然后在html中用 "/static/css/style.css"。
    # 我们当前设置 static_url_path='' 且 static_folder 指向 'frontend'，
    # index.html 中的 "css/style.css" 和 "js/app.js" 会被 Flask 正确地从 'frontend/css/style.css' 和 'frontend/js/app.js' 提供。

    # 注册新的API蓝图
    # generation_bp 已经在其定义中设置了 url_prefix='/api'
    app.register_blueprint(generation_bp)
    app.logger.info("Generation API blueprint registered with prefix /api")

    return app

# 主程序入口点
if __name__ == '__main__':
    app = create_app() 
    app.run(
        host=app.config.get('FLASK_RUN_HOST', '0.0.0.0'), 
        port=int(app.config.get('FLASK_RUN_PORT', 5000)), 
        debug=app.config.get('DEBUG', True)
    ) 