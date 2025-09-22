# 命名与部署规范

> **重要说明：请严格区分项目ID/仓库名与品牌名，所有部署命令均使用真实Cloudflare项目名，不要用品牌名。**

- **Cloudflare 项目ID/仓库名**：`Text2Image_audio`
  - 用于本地文件夹、GitHub仓库、Cloudflare Pages/Workers 的真实项目名。
- **网站品牌名/展示名**：`AISTONE`
  - 仅用于前端页面、LOGO、UI展示，不参与任何Cloudflare命令或控制台操作。
- **Cloudflare Pages 项目名**：`Text2Image_audio`（通过 GitHub 自动集成部署）。
  - **部署方式**：GitHub 推送自动触发部署，无需手动命令。
  - **生产域名**：https://aistone.org
- **Cloudflare Worker 名称**：`text2image-api`
  - 由 `wrangler.toml` 的 `name` 字段决定。
  - 部署命令：
    ```powershell
    wrangler deploy
    ```
  - 入口文件为 `backend/index.js`。

---

# AISTONE - 智能AI内容创作平台

**AISTONE** 是一个革命性的AI驱动内容创作平台，专注于为用户提供高质量、免费的AI图片生成与语音合成服务。我们的使命是让AI内容创作对每个人都触手可及，无论您是专业设计师、内容创作者，还是有创意想法的普通用户。

## 🌟 关于 AISTONE

**AISTONE** 结合了前沿的AI技术与用户友好的设计理念，为全球用户提供：

- **🎨 专业级AI图片生成**：基于先进的Pollinations.AI技术，支持Kontext、FLUX、Turbo等多种AI模型
- **🎵 自然语音合成**：高质量的文本转语音服务，支持多种音色和语言
- **🧠 智能提示词优化**：集成DeepSeek AI，自动优化中文描述为高质量英文提示词
- **🌍 全球化服务**：完整的中英文支持，基于Cloudflare CDN的全球加速
- **🔒 隐私优先**：零数据留存，所有内容实时处理不存储

### 为什么选择 AISTONE？

1. **完全免费**：所有功能永久免费，无需注册，无使用限制
2. **专业品质**：采用最新的AI模型，生成效果媲美专业工具
3. **简单易用**：直观的界面设计，一键生成高质量内容
4. **技术先进**：Serverless架构，全球CDN加速，毫秒级响应
5. **持续创新**：定期更新功能，引入最新AI技术

**官方网站**：[https://aistone.org](https://aistone.org)

本项目采用 Serverless 架构，部署在 Cloudflare 平台上，为全球用户提供稳定可靠的AI内容生成服务。

## 🛠️ 本地开发环境

### 环境变量配置

在项目根目录创建 `api.env` 文件，配置以下环境变量：

```env
# Cloudflare KV 存储
KV_NAMESPACE_ID=your_kv_namespace_id

# 日志级别
LOG_LEVEL=error

# API 配置
API_BASE_URL=https://text2image-api.your-domain.workers.dev

# 认证配置（可选）
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 本地调试步骤

1. **安装依赖**

   ```powershell
   npm install
   ```

2. **启动本地开发服务器**

   ```powershell
   # 启动前端开发服务器
   npx http-server frontend -p 8080

   # 启动后端 Worker 开发服务器
   wrangler dev
   ```

3. **访问本地环境**
   - 前端：http://localhost:8080
   - 后端 API：http://localhost:8787

4. **调试工具**
   - 使用浏览器开发者工具查看网络请求
   - 使用 Cloudflare Workers 控制台查看日志
   - 使用 `wrangler tail` 实时查看 Worker 日志

### 生产环境部署

```powershell
# 部署 Worker
wrangler deploy

# 部署 Pages（通过 GitHub 自动部署）
git push origin main
```

## 版本

### V2.0 (2025-08-09)

- 新增个人中心（高清图片缓存/管理），首页生成后自动保存到个人中心
- 多语言（中/英）全面补齐，移除硬编码中文
- 顶部用户菜单与语言选择器统一深色主题，移除白框
- 取消左下角悬浮登录区，避免重复用户区块
- SEO：`user.html` 可索引并加入站点地图
- 为前端脚本追加版本参数，确保线上缓存刷新

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
├── dev_plan.md               # 开发进度和规划
├── APIDOCS.md               # Pollinations API文档
├── wrangler.toml            # Worker部署配置
├── cloudflare-pages.toml    # Pages部署配置
└── README.md                # 项目说明（本文件）
```

## 🚀 快速开始

### 在线访问（推荐）

**AISTONE** 已部署到 Cloudflare 平台，可直接访问：

- **官方网站**：[https://aistone.org](https://aistone.org)
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

### Cloudflare Pages 自动部署

项目前端已配置 GitHub 自动集成部署：

1. ✅ **已连接**：GitHub 仓库已连接到 Cloudflare Pages
2. ✅ **自动构建**：推送代码自动触发部署
   - **构建命令**：无需构建（静态文件）
   - **发布目录**：`frontend`
   - **生产域名**：https://aistone.org
3. ✅ **零维护**：推送即部署，无需手动操作

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

**当前版本**：V2.1 (2025-09-03 - 最新功能更新)
**部署状态**：✅ 生产环境运行中  
**官方网站**：✅ [https://aistone.org](https://aistone.org)  
**后端API**：✅ Cloudflare Workers已部署  
**功能完成度**：98% （所有核心功能完整）

### 🆕 最新更新 (V2.1 - 2025-09-03)

- ✅ **完整国际化支持**：所有界面和交互完全支持中英文切换
- ✅ **用户反馈系统**：个人中心新增留言与建议功能，支持分类管理
- ✅ **提示词模板库**：6大类别×24个专业模板，一键应用高质量提示词
- ✅ **用户体验优化**：优化所有交互细节，提升整体使用体验

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

_最后更新时间：2025-09-03_  
_项目状态：生产环境稳定运行_ 🚀

## 主要功能

- 文本生成图片（多尺寸、多风格、可选水印、批量生成）
- 文本生成语音（多音色、在线播放、下载）
- 智能提示词优化（DeepSeek AI集成）
- 响应式现代UI，支持中英文切换
- 完善的错误处理与用户友好提示

## 开发进度与状态

- MVP核心功能全部实现，生产环境已部署
- 前端：Cloudflare Pages，静态资源自动化部署
- 后端：Cloudflare Workers，API接口独立部署
- 详细开发阶段、后续规划见《dev_plan.md》

## 当前部署状态

- 前端：Cloudflare Pages（`frontend/`目录）
- 后端：Cloudflare Workers（`backend/index.js`）
- Worker API地址：`https://text2image-api.peyoba660703.workers.dev`
- 详细状态、性能、已知问题见《status_report.md》

## 后续规划

- UI持续现代化优化
- 用户账户系统、生成历史、更多风格与参数
- 移动端体验优化、API统计与监控
- 详细规划见《dev_plan.md》

## 🚀 AISTONE 正式上线

**AISTONE** 已于2025年5月正式上线，并持续更新优化，欢迎访问体验最新功能！

### 🌐 访问地址

- **官方网站**：[https://aistone.org](https://aistone.org)
- **后端API**：[https://text2image-api.peyoba660703.workers.dev](https://text2image-api.peyoba660703.workers.dev)
- **GitHub仓库**：[https://github.com/peyoba/Text2Image_audio](https://github.com/peyoba/Text2Image_audio)

### 🎯 立即体验

访问 [https://aistone.org](https://aistone.org) 即可：

- 🎨 生成专业级AI图片（支持多种风格和尺寸）
- 🎵 创建自然流畅的AI语音（支持在线播放和下载）
- 📝 使用专业提示词模板（6大类别×24个精选模板）
- 💬 提交反馈建议（个人中心反馈系统）
- 🌍 享受完整中英文体验（一键语言切换）

所有功能均已在生产环境稳定运行，详细技术文档见 [docs/](./docs/) 目录。
