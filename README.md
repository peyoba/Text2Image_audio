# 文生图与文生语音网站

本项目是一个基于AI的内容生成Web应用程序，允许用户输入文本，并通过调用 Pollinations API 生成相应的图片或语音。项目采用 Serverless 架构，部署在 Cloudflare 平台上。

## 🎯 项目特色

- **🖼️ 智能文生图**：支持多种尺寸和风格的图片生成
- **🎵 文生语音**：高质量语音合成，支持在线播放和下载
- **🧠 提示词优化**：集成DeepSeek AI，自动优化中文描述为高质量英文提示词
- **⚡ 全球加速**：基于Cloudflare CDN，全球低延迟访问
- **📱 响应式设计**：支持桌面和移动设备

## 🏗️ 技术架构

### 前端
- **技术栈**：HTML5 + CSS3 + 原生JavaScript
- **部署平台**：Cloudflare Pages
- **架构特点**：模块化设计，组件分离

### 后端
- **技术栈**：JavaScript (ES Modules)
- **部署平台**：Cloudflare Workers
- **Worker URL**：`https://text2image-api.peyoba660703.workers.dev`
- **架构特点**：Serverless，无服务器运维

### API集成
- **图片生成**：Pollinations Image API
- **语音合成**：Pollinations Audio API  
- **提示词优化**：DeepSeek API (SiliconFlow)

## 📁 项目结构

```
Text2Image_audio/
├── frontend/                 # 前端静态资源
│   ├── index.html           # 主页面
│   ├── css/
│   │   └── style.css        # 样式文件
│   └── js/
│       ├── api_client.js    # API通信模块
│       ├── ui_handler.js    # UI交互处理
│       └── app.js           # 主应用逻辑
├── backend/
│   └── index.js             # Cloudflare Worker主文件
├── 需求文档.md               # 详细功能需求
├── 开发计划.md               # 开发进度和规划
├── APIDOCS.md               # Pollinations API文档
├── wrangler.toml            # Worker部署配置
├── cloudflare-pages.toml    # Pages部署配置
└── README.md                # 项目说明（本文件）
```

## 🚀 快速开始

### 在线访问（推荐）
项目已部署到 Cloudflare 平台，可直接访问：
- **前端地址**：[即将更新]
- **后端API**：`https://text2image-api.peyoba660703.workers.dev`

### 本地开发

#### 1. 环境准备
- [Python 3.8+](https://www.python.org/downloads/) （用于本地开发服务器）
- [Node.js](https://nodejs.org/) （可选，用于其他HTTP服务器）
- [Git](https://git-scm.com/)

#### 2. 克隆项目
```bash
git clone https://github.com/peyoba/Text2Image_audio.git
cd Text2Image_audio
```

#### 3. 启动前端（本地开发）
```bash
# 进入前端目录
cd frontend

# 启动Python HTTP服务器
python -m http.server 8000

# 或使用Node.js http-server（如已安装）
# npx http-server -p 8000 --cors
```

#### 4. 访问应用
打开浏览器访问：`http://localhost:8000`

## 📋 功能使用指南

### 🖼️ 图片生成
1. 在文本框中输入图片描述（支持中文）
2. 选择"图片"选项
3. 配置图片参数：
   - **宽高比**：正方形、风景、肖像等预设
   - **自定义尺寸**：手动设置宽度和高度
   - **去除水印**：生成无Logo图片
   - **生成数量**：1张、2张或4张
4. 点击"开始生成"等待结果

### 🎵 语音生成
1. 在文本框中输入要朗读的文字
2. 选择"语音"选项
3. 点击"开始生成"
4. 生成完成后可：
   - 在线播放音频
   - 下载音频文件

### 🧠 智能优化
系统会自动调用DeepSeek AI优化您的中文描述，转换为更适合AI理解的英文提示词，提升生成效果。

## 🔧 API接口说明

### POST /api/generate
**功能**：统一的内容生成接口

**请求体示例（图片）**：
```json
{
  "text": "一只可爱的猫咪在草地上玩耍",
  "type": "image",
  "width": 1024,
  "height": 1024,
  "nologo": true
}
```

**请求体示例（语音）**：
```json
{
  "text": "你好，欢迎使用AI语音合成服务",
  "type": "audio"
}
```

**成功响应（图片）**：
```json
{
  "type": "image",
  "data": "data:image/jpeg;base64,/9j/4AAQSkZJRgABA...",
  "format": "base64",
  "content_type": "image/jpeg"
}
```

**成功响应（语音）**：
直接返回音频文件流（ArrayBuffer）

### POST /api/optimize
**功能**：提示词优化接口

**请求体**：
```json
{
  "text": "一只可爱的猫咪"
}
```

**响应**：
```json
{
  "optimized_text": "A cute kitten playing on green grass, professional photography, high resolution, detailed",
  "raw_optimized": "原始优化结果",
  "original_prompt": "一只可爱的猫咪"
}
```

## 🛠️ 部署说明

### Cloudflare Workers 部署
```bash
# 安装Wrangler CLI
npm install -g wrangler

# 登录Cloudflare
wrangler login

# 在根目录下运行部署命令
wrangler deploy
```
部署前，请确保 `wrangler.toml` 文件已根据您的需求配置好。

### Cloudflare Pages 部署
1. 连接GitHub仓库到Cloudflare Pages
2. 设置构建配置：
   - **构建命令**：无需构建
   - **发布目录**：`frontend`
3. 部署完成后自动分配域名

## 🔐 环境变量配置

我们推荐通过 `wrangler.toml` 文件来管理环境变量，这样便于版本控制和团队协作。您也可以在Cloudflare Workers的控制台UI中进行设置。

**核心密钥（必须配置）**
- `DEEPSEEK_API_KEY`: 您的DeepSeek API密钥。

**API端点（可选，有默认值）**
- `DEEPSEEK_API_URL`: DeepSeek API的地址。
- `POLLINATIONS_IMAGE_API_BASE`: Pollinations图片API的基地址。
- `POLLINATIONS_TEXT_API_BASE`: Pollinations语音API的基地址。

**模型与参数配置（可选，有默认值）**
- `DEEPSEEK_MODEL`: 用于提示词优化的DeepSeek模型名称。 (默认: `deepseek-ai/DeepSeek-V2.5-Chat`)
- `AUDIO_VOICE`: 生成语音时使用的音色。 (默认: `nova`)
- `AUDIO_SPEED`: 生成语音的语速。 (默认: `1.0`)

**系统配置（可选，有默认值）**
- `LOG_LEVEL`: 后端服务的日志输出级别。设置为 `'debug'` 可查看详细的API请求日志。 (默认: `info`)

## ✨ 健壮性与可维护性

为了保证服务的稳定和项目的长期健康，我们进行了一系列优化：

- **通用重试逻辑**: 后端实现了一个 `fetchWithRetry` 辅助函数，当外部API（如Pollinations）调用瞬时失败时，会自动进行最多3次重试，大大提高了生成成功率。
- **标准化错误处理**: API现在会返回规范的HTTP状态码。例如，如果服务器未配置 `DEEPSEEK_API_KEY`，将返回 `500 Internal Server Error` 及详细错误信息，便于前端精确诊断问题。
- **配置外部化**: 核心参数（如模型名称、语音参数）已从代码中分离，通过环境变量进行管理，使得调整参数无需修改和重新部署代码。
- **可控日志级别**: 通过 `LOG_LEVEL` 环境变量，可以轻松在生产环境（静默运行）和开发环境（输出详细日志）之间切换。

## 📊 项目状态

**当前版本**：MVP 1.1 (已完成健壮性优化)
**部署状态**：✅ 生产就绪  
**前端状态**：✅ 本地开发服务器运行中 (端口8000)  
**后端状态**：✅ Cloudflare Workers已部署  
**功能完成度**：90% （核心功能完整）

### 🔄 当前工作重点
**UI界面现代化优化** (2025-05-24启动)
- 🎯 **目标**: 提升视觉现代化水平，参考业界最佳实践
- 📋 **方案**: 渐进式三阶段优化（视觉现代化→布局优化→交互增强）
- 🛡️ **原则**: 保护现有功能，模块化实施，随时可回滚
- ⏳ **当前**: 阶段一准备中（基础视觉现代化）

## 🎯 后续规划

- [ ] **UI界面现代化** (当前进行中)
- [ ] 用户账户系统
- [ ] 生成历史记录
- [ ] 更多图片风格选项
- [ ] 批量生成功能
- [ ] 移动端App
- [ ] API访问统计

## 📞 技术支持

- **GitHub仓库**：[https://github.com/peyoba/Text2Image_audio](https://github.com/peyoba/Text2Image_audio)
- **问题反馈**：请提交GitHub Issue
- **技术文档**：查看项目内的文档文件

## 📄 许可证

本项目采用 MIT 许可证。详细信息请查看 LICENSE 文件。

---

*最后更新时间：2025-05-24*  
*项目状态：活跃开发中* 🚀 