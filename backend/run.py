"""
启动脚本，用于运行Flask应用和Celery工作进程。
"""

import subprocess
import sys
import os
import signal
import time
from threading import Thread

# 获取当前脚本所在的目录，用于构建到 backend 的相对路径
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# BACKEND_DIR = os.path.join(SCRIPT_DIR, 'backend') # 如果 run.py 在项目根目录，backend目录是其子目录
# 如果 run.py 就在 backend 目录内，则 BACKEND_DIR 就是 SCRIPT_DIR
BACKEND_DIR = SCRIPT_DIR # 假设 run.py 在 backend 目录内

def run_flask():
    """运行Flask应用"""
    # FLASK_APP 指向应用工厂函数
    # FLASK_ENV 会被 create_app 和 get_config 用到
    flask_env = os.environ.get('FLASK_ENV', 'development')
    os.environ['FLASK_APP'] = 'backend.main:create_app' 
    os.environ['FLASK_ENV'] = flask_env
    
    # 从配置中获取端口 (如果 Flask app 实例能被这里访问到会更好，但通过环境变量传递也行)
    # 或者让 flask run 命令自行处理端口，它会默认5000或从配置中读取 (如果配置了 SERVER_NAME)
    # 这里我们先用固定的5000，或者可以尝试从 config.py 读取 (需要额外逻辑)
    flask_port = os.environ.get('FLASK_RUN_PORT', '5000') # 与 config.py 中 FLASK_RUN_PORT 对应

    cmd = [sys.executable, '-m', 'flask', 'run', '--host=0.0.0.0', f'--port={flask_port}']
    if flask_env == 'development':
        # cmd.append('--debug') # flask run 在 development env 下默认开启 debug 和 reloader
        pass

    print(f"Starting Flask app with command: {' '.join(cmd)}")
    # 注意：subprocess.run 会阻塞，直到命令完成。对于长时间运行的服务，这适合在单独线程中。
    # 在Windows上，如果 flask run 使用 reloader，它可能会创建子进程，有时会导致 subprocess 管理复杂。
    # 如果遇到问题，可以考虑 flask run --no-reload
    subprocess.run(cmd, cwd=os.path.dirname(BACKEND_DIR)) # 确保从项目根目录运行flask

def run_celery_worker():
    """运行Celery工作进程"""
    # -A 指向Celery应用实例，现在它在 backend.tasks.celery_app
    # 需要确保PYTHONPATH包含项目根目录，以便Celery能找到 backend.tasks
    celery_cmd = [
        sys.executable, '-m', 'celery', '-A', 'backend.tasks.celery_app', 'worker',
        '--loglevel=info',
    ]
    # Windows下Celery的并发池建议，在旧版本中 solo 是一个选择
    # 新版本Celery (5.x+) 在Windows上对 prefork 的支持有改进，但 solo 或 gevent/eventlet (如果安装) 仍是选项
    if sys.platform == "win32":
        celery_cmd.append('--pool=solo') 
        # 或者考虑 eventlet/gevent 如果它们被安装并在项目中配置
        # celery_cmd.extend(['--pool=eventlet', '-c', '1']) # 示例：使用eventlet，并发为1

    print(f"Starting Celery worker with command: {' '.join(celery_cmd)}")
    # 设置PYTHONPATH环境变量，使其能找到模块，cwd设置为项目根目录
    env = os.environ.copy()
    project_root = os.path.dirname(BACKEND_DIR) # 项目根目录是 backend 的上一级
    if 'PYTHONPATH' in env:
        env['PYTHONPATH'] = f"{project_root}{os.pathsep}{env['PYTHONPATH']}"
    else:
        env['PYTHONPATH'] = project_root

    subprocess.run(celery_cmd, cwd=project_root, env=env)

def run_redis():
    """运行Redis服务器（如果未运行）。仅为开发方便，生产环境应独立管理Redis。"""
    try:
        # 检查Redis是否已运行
        # 在Windows上，'redis-cli' 可能不在PATH中，或者需要通过 wsl 运行
        # 此处简化为假设 redis-cli 可用
        subprocess.run(['redis-cli', 'ping'], check=True, capture_output=True)
        print("Redis服务器已在运行")
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("Redis服务器未运行或redis-cli不可用。")
        # 尝试启动Redis (这非常依赖于系统配置，例如 redis-server 是否在PATH中)
        try:
            print("尝试启动本地Redis服务器...")
            # 在Windows下，需要指定redis-server.exe的路径或确保它在PATH中
            # Popen 用于非阻塞启动
            subprocess.Popen(['redis-server'], creationflags=subprocess.CREATE_NEW_CONSOLE if sys.platform == "win32" else 0)
            time.sleep(2) # 给Redis一些启动时间
            # 再次检查
            subprocess.run(['redis-cli', 'ping'], check=True, capture_output=True)
            print("本地Redis服务器已启动并成功连接。")
            return True
        except (subprocess.CalledProcessError, FileNotFoundError, Exception) as e:
            print(f"启动本地Redis服务器失败或连接失败: {e}")
            print("请确保Redis已安装并正在运行，或者redis-server/redis-cli在系统PATH中。")
            print("对于Windows，您可能需要从 https://redis.io/docs/getting-started/installation/install-redis-on-windows/ 下载并运行Redis。")
            return False

# 全局变量用于管理线程，以便可以优雅地关闭它们
flask_process_thread = None
celery_process_thread = None

def cleanup(signum=None, frame=None):
    print("\n正在关闭服务...")
    # Celery 和 Flask 进程由 subprocess.run 启动，它们会在 SIGINT/SIGTERM 时自行处理（通常）
    # 如果它们是用 Popen 启动并且没有自己的信号处理，我们可能需要在这里显式终止它们
    # 由于subprocess.run是阻塞的，当主线程退出时，这些线程也会被终止。
    # 主要确保任何后台进程（如用Popen启动的Redis）得到处理，但这部分已移至run_redis的尝试。
    sys.exit(0)

def main():
    signal.signal(signal.SIGINT, cleanup)
    signal.signal(signal.SIGTERM, cleanup)

    print("后台服务启动脚本...")
    if not run_redis():
        print("Redis未能成功启动或连接。Celery可能无法工作。请检查Redis状态。")
        # 可以选择在这里退出，或者允许继续尝试启动其他服务
        # sys.exit(1)
    else:
        print("Redis检查/启动完成。")

    print("准备启动Flask应用和Celery worker...")
    global flask_process_thread, celery_process_thread
    flask_process_thread = Thread(target=run_flask, name="FlaskThread")
    celery_process_thread = Thread(target=run_celery_worker, name="CeleryThread")

    flask_process_thread.start()
    print("Flask应用线程已启动。")
    # 短暂延时，确保Flask日志先输出，或者让Celery不那么快地开始记录
    time.sleep(1)
    celery_process_thread.start()
    print("Celery worker线程已启动。")

    # 等待线程完成 (实际上它们是长时间运行的服务，所以会一直运行直到被中断)
    try:
        flask_process_thread.join() # run_flask 使用 subprocess.run, 所以 join 会等待它完成
        celery_process_thread.join() # 同上
    except KeyboardInterrupt:
        print("\n检测到Ctrl+C，开始关闭...")
        cleanup()
    finally:
        print("所有服务已关闭或尝试关闭。")

if __name__ == '__main__':
    # 确保此脚本在 backend 目录的上一级（项目根目录）运行，
    # 或者调整 BACKEND_DIR 和 project_root 的计算方式。
    # 当前脚本假设它位于 backend 目录中。
    # 如果要从项目根目录运行 python backend/run.py，那么 SCRIPT_DIR 会是 backend 目录。
    main() 