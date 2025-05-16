"""
应用配置文件
"""

import os

# 基础配置
class Config:
    # 应用根目录
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    
    DEBUG = False
    TESTING = False

    # Flask运行端口 (在 app.run 中使用)
    FLASK_RUN_PORT = os.environ.get('FLASK_RUN_PORT', 5000)
    FLASK_RUN_HOST = os.environ.get('FLASK_RUN_HOST', '0.0.0.0') # 添加 HOST 配置

    # 文件大小限制（16MB）- 如果未来有上传功能则有用
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024
    
    # 允许的文件类型 - 如果未来有上传功能则有用
    ALLOWED_EXTENSIONS = {
        'audio': {'wav', 'mp3'},
        'image': {'png', 'jpg', 'jpeg'}
    }
    
    # API配置
    API_PREFIX = '/api'

    # Pollinations API 配置
    POLLINATIONS_IMAGE_API_BASE = os.environ.get('POLLINATIONS_IMAGE_API_BASE', "https://pollinations.ai/p/")
    POLLINATIONS_TEXT_API_BASE = os.environ.get('POLLINATIONS_TEXT_API_BASE', "https://text.pollinations.ai/")
    POLLINATIONS_API_TIMEOUT = int(os.environ.get('POLLINATIONS_API_TIMEOUT', 60)) # 确保是整数

    # Celery 配置 (使用新的配置格式)
    broker_url = 'memory://'
    result_backend = 'cache+memory://'
    task_serializer = 'json'
    result_serializer = 'json'
    accept_content = ['json']
    timezone = 'Asia/Shanghai'
    enable_utc = True
    task_always_eager = True  # 在开发环境中同步执行任务
    task_store_eager_result = True # 当 task_always_eager 为 True 时，存储结果

# 开发环境配置
class DevelopmentConfig(Config):
    DEBUG = True
    FLASK_ENV = 'development'

# 生产环境配置
class ProductionConfig(Config):
    FLASK_ENV = 'production'

# 测试环境配置 (如果需要)
class TestingConfig(Config):
    TESTING = True
    FLASK_ENV = 'testing' # 明确设置FLASK_ENV以供get_config使用
    # 测试时可能使用更小的模型或mock掉外部API
    POLLINATIONS_IMAGE_API_BASE = "http://localhost:12345/mockapi/image/" # 示例 mock API
    POLLINATIONS_TEXT_API_BASE = "http://localhost:12345/mockapi/text/"   # 示例 mock API
    CELERY_BROKER_URL = os.environ.get('TEST_CELERY_BROKER_URL', 'memory://') 
    CELERY_RESULT_BACKEND = os.environ.get('TEST_CELERY_RESULT_BACKEND', 'cache+memory://')
    CELERY_TASK_ALWAYS_EAGER = True # 测试时任务同步执行,方便调试
    # POLLING_API_TIMEOUT = 5 # 测试时可以缩短超时

# 配置映射
config_by_name = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}

# 获取当前环境的配置函数，供 create_app 使用
def get_config(config_name=None):
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'default').lower() # 确保小写以匹配字典键
    # 返回配置类的实例
    ConfigClass = config_by_name.get(config_name, config_by_name['default'])
    return ConfigClass() 