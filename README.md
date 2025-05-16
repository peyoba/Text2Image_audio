# 文生图与文生语音网站

本项目旨在创建一个Web应用程序，允许用户输入文本，并通过调用 Pollinations Multimodal MCP Server 生成相应的图片或语音。

## 项目结构 (初步)

- **`.cursorrules.json`**: AI协作与编码规范。
- **`开发计划.md`**: 项目的开发计划和任务分解。
- **`需求文档.md`**: 项目的详细需求规格说明。
- **`backend/`**: 存放所有后端代码 (Python/Flask)。
- **`frontend/`**: 存放所有前端代码 (HTML, CSS, JavaScript)。
- **`.gitignore`**: Git忽略文件配置。
- **`README.md`**: 本文件，项目总体说明。

## 快速开始

### 1. 环境准备

*   确保您的计算机上已安装以下软件：
    *   [Python](https://www.python.org/downloads/) (建议版本 3.8 或更高)
    *   [Node.js](https://nodejs.org/) (用于运行 `http-server`，可选，您也可以使用其他HTTP服务器)
    *   Git

### 2. 下载项目

```bash
git clone https://github.com/peyoba/Text2Image_audio.git # 请替换为您的项目仓库URL
cd Text2Image_audio
```

### 3. 后端配置与启动

1.  **进入后端目录**
    ```bash
    cd backend
    ```

2.  **创建并激活Python虚拟环境**
    *   Windows:
        ```bash
        python -m venv .venv
        .venv\Scripts\activate
        ```
    *   macOS/Linux:
        ```bash
        python3 -m venv .venv
        source .venv/bin/activate
        ```

3.  **安装后端依赖**
    ```bash
    pip install -r requirements.txt
    ```

4.  **启动后端Flask服务**
    ```bash
    python app.py
    ```
    服务默认运行在 `http://127.0.0.1:5000`。您应该会在终端看到类似 "Running on http://127.0.0.1:5000" 的输出。

### 4. 前端启动

1.  **进入前端目录** (在项目根目录下打开新的终端)
    ```bash
    cd frontend
    ```

2.  **启动HTTP服务器**
    *   如果您安装了 `http-server` (通过 `npm install -g http-server`):
        ```bash
        http-server -p 8000 --cors
        ```
    *   您也可以使用Python内置的HTTP服务器 (适用于简单测试):
        ```bash
        python -m http.server 8000
        ```
        注意：使用Python内置服务器时，请确保后端服务允许来自端口8000的跨域请求，或者在开发时暂时禁用浏览器的CORS策略。`http-server --cors` 是更推荐的方式。

3.  **访问应用**
    打开您的浏览器，访问前端服务器的地址，通常是 `http://127.0.0.1:8000` 或 `http://localhost:8000`。

### 5. 如何使用

1.  在文本框中输入您想要生成图片或语音的描述。
2.  选择"图片"或"语音"单选按钮。
3.  点击"生成"按钮。
4.  等待片刻，生成的结果将显示在下方区域。
    *   图片将直接显示。
    *   语音将提供一个播放器和下载链接。

## 项目API (后端)

### `/api/generate` (POST)

*   **功能**: 接收用户输入和生成类型，调用Pollinations API生成内容。
*   **请求体 (JSON)**:
    ```json
    {
      "text": "用户输入的描述",
      "type": "image" // 或 "audio"
    }
    ```
*   **成功响应 (JSON)**:
    *   图片类型:
        ```json
        {
          "type": "image",
          "data": "base64编码的图片数据..."
        }
        ```
    *   语音类型:
        ```json
        {
          "type": "audio",
          "url": "/audio_files/generated_audio_unique_filename.mp3" // 指向后端静态文件的URL
        }
        ```
*   **失败响应 (JSON)**:
    ```json
    {
      "error": "错误信息描述"
    }
    ```

## 注意事项
* 后端服务需要能够访问互联网以便调用 Pollinations.AI 的 API。
* 生成的音频文件会临时存储在 `backend/audio_files` 目录下。请考虑定期清理或设置更持久的存储方案。 