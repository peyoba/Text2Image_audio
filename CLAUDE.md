# CLAUDE.md

此文件为 Claude Code (claude.ai/code) 在此代码库中工作时提供指导。

## 重要规范

**文档和代码规范：**
- 所有 Markdown 文档必须使用中文编写
- 所有代码注释必须使用中文
- 与用户的所有对话必须使用中文

## 项目概述

AISTONE 是部署在 Cloudflare 上的无服务器 AI 内容创作平台，提供免费的文本生成图像和文本转语音服务。平台采用分离架构，前端为静态资源 (Cloudflare Pages)，后端为 API 服务 (Cloudflare Workers)。

## 环境要求

### 开发环境依赖
- **Node.js**: 版本 18.0.0 或更高 (用于 wrangler 等工具)
- **Python**: 版本 3.8.0 或更高 (用于本地开发服务器)
- **Git**: 最新版本 (用于版本控制和自动部署)

### 全局工具
- **Wrangler CLI**: Cloudflare Workers 部署工具
  ```bash
  npm install -g wrangler
  ```

### 浏览器支持
- 现代浏览器 (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- 支持 ES6+ 和 Fetch API

## 开发命令

### 前端开发
- **本地开发服务器**: `python -m http.server 8000` (在 `frontend/` 目录下执行)
- **Node.js 替代方案**: `npx http-server -p 8000 --cors` (在 `frontend/` 目录下执行)
- **访问地址**: `http://localhost:8000`

### 后端部署
- **部署到 Cloudflare Workers**: `wrangler deploy` (在项目根目录执行)
- **Worker 名称**: `text2image-api` (在 `wrangler.toml` 中定义)
- **Worker 入口文件**: `backend/index.js`

### 常用命令
- **构建项目**: 此项目为静态前端，无需构建
- **类型检查**: 目前未配置 TypeScript，使用原生 JavaScript
- **依赖管理**: `npm install` (仅用于 wrangler 等开发工具)

### 开发工作流
- 前端修改后直接推送到 GitHub，Cloudflare Pages 自动部署
- 后端修改后使用 `wrangler deploy` 手动部署
- 完成代码修改后建议进行手动功能测试

### 测试
- 目前未配置自动化测试套件
- 主要通过 Web 界面进行手动测试

## 架构

### 整体架构
```
frontend/               # 静态 Web 资源 (Cloudflare Pages)
├── index.html         # 主应用入口页面
├── user.html          # 个人中心页面，包含高清图片缓存
├── admin.html         # 管理员后台，反馈管理
├── css/style.css      # 主样式文件
└── js/
    ├── app.js         # 主应用逻辑
    ├── api_client.js  # API 通信层
    ├── ui_handler.js  # UI 交互处理
    ├── auth.js        # 认证管理
    ├── i18n.js        # 国际化 (中文/英文)
    ├── hd_image_manager.js      # 高清图片缓存管理
    ├── feedback_manager.js      # 用户反馈系统
    └── prompt_templates.js      # AI 提示词模板库

backend/               # Cloudflare Worker API
├── index.js          # Worker 主入口和路由处理
├── auth.js           # 认证逻辑 (JWT, Google OAuth)
└── image_cache.js    # 高清图片存储和检索
```

### 核心组件

**前端架构:**
- 原生 JavaScript ES6 模块，支持动态导入
- 模块化设计，关注点分离 (API, UI, Auth)
- 响应式设计，支持桌面和移动设备
- 完整的国际化支持 (中英文切换)

**后端架构:**
- 基于 ES 模块的 Cloudflare Workers
- JWT 认证集成 Google OAuth
- KV 存储用于用户数据、图片缓存和反馈
- 提供生成、认证和管理功能的 API 端点

**外部集成:**
- Pollinations.ai 用于图片和音频生成
- DeepSeek API (通过 SiliconFlow) 用于中英文提示词优化
- Google OAuth 用于用户认证

## 配置

### 环境变量 (在 wrangler.toml 中)
- `DEEPSEEK_API_KEY`: 提示词优化必需
- `JWT_SECRET`: JWT 令牌签名密钥
- `ADMIN_KEY`: 管理员后台访问密钥
- `LOG_LEVEL`: 设置为 "debug" 可获取详细日志

### KV 命名空间
- `USERS`: 用户账户数据存储
- `IMAGES_CACHE`: 高清图片缓存存储
- `RESET_TOKENS`: 密码重置令牌存储
- `FEEDBACK`: 用户反馈和建议

## API 端点

### 核心生成功能
- `POST /api/generate`: 文本转图片和文本转语音生成
- `POST /api/optimize`: 使用 DeepSeek 进行中文提示词优化

### 认证功能
- `POST /api/auth/register`: 用户注册
- `POST /api/auth/login`: 用户登录
- `POST /api/auth/google-login`: Google OAuth 登录
- `GET /api/auth/validate`: 令牌验证

### 用户功能
- `POST /api/images/save`: 保存生成的图片到用户缓存
- `GET /api/images/list`: 列出用户缓存的图片
- `DELETE /api/images/delete`: 删除缓存图片

### 管理员功能
- `GET /api/admin/feedback/list`: 列出所有反馈 (需要 ADMIN_KEY)
- `POST /api/admin/feedback/update`: 更新反馈状态

## 开发指南

### 代码编写规范
- **ES6+ 语法**: 使用现代 JavaScript 特性和 ES 模块 (import/export)
- **模块化设计**: 保持 UI、API 和业务逻辑的关注点分离
- **命名规范**: 使用有意义的变量和函数名，优先使用英文命名
- **文件组织**: 按功能模块组织文件，相关功能放在同一目录
- **错误处理**: 遵循现有的错误处理模式，提供用户友好的错误信息

### 代码风格
- 使用 ES6+ 特性和模块
- 在 UI、API 和业务逻辑之间保持关注点分离
- 遵循现有的错误处理和用户反馈模式
- 所有面向用户的字符串应通过 `i18n.js` 支持国际化
- **所有代码必须使用中文注释**：
  - 函数注释 - 用中文描述函数的用途、参数和返回值
  - 行内注释 - 用中文解释复杂逻辑或重要步骤
  - 代码块注释 - 用中文说明代码段的整体功能
  - 变量说明 - 在需要时用中文注释重要变量的含义
  - API 接口注释 - 用中文描述接口的功能和用法

### 代码质量要求
- **函数设计**: 保持函数单一职责，避免过长函数 (建议 < 50 行)
- **变量声明**: 优先使用 `const`，需要重新赋值时使用 `let`，避免 `var`
- **异步处理**: 使用 `async/await` 处理异步操作，避免回调地狱
- **错误边界**: 对所有外部 API 调用和用户输入进行适当的错误处理
- **性能考虑**: 避免不必要的 DOM 操作，合理使用事件监听器

### 测试要求
- **功能测试**: 每个新功能完成后必须进行手动功能测试
- **兼容性测试**: 在主流浏览器中测试 (Chrome, Firefox, Safari, Edge)
- **响应式测试**: 确保在不同屏幕尺寸下正常工作
- **API 测试**: 测试各种输入情况，包括边界条件和错误情况
- **回归测试**: 修改现有功能时，确保不影响其他功能
- **生产验证**: 部署后在生产环境进行完整功能验证

### 测试检查清单
- [ ] 图片生成功能 (不同尺寸、参数组合)
- [ ] 语音生成功能 (不同文本长度)
- [ ] 用户认证流程 (注册、登录、注销)
- [ ] 个人中心功能 (图片保存、管理)
- [ ] 多语言切换功能
- [ ] 提示词模板功能
- [ ] 反馈提交功能
- [ ] 响应式布局适配

### API 集成模式
- 使用 `fetchWithRetry` 辅助函数进行外部 API 调用 (实现自动重试逻辑)
- 优雅地处理速率限制和 API 故障
- 返回标准化的 JSON 响应和适当的 HTTP 状态码

### 认证流程
- JWT 令牌存储在 localStorage 中并自动刷新
- Google OAuth 集成用于社交登录
- 在受保护端点上进行适当的令牌验证

### 图片生成工作流程
1. 文本输入 (支持中文)
2. 通过 DeepSeek API 自动优化提示词
3. 通过 Pollinations API 生成图片
4. 为已登录用户提供可选的高清图片缓存
5. 下载和分享功能

## Git 工作流规范

### 分支管理
- **主分支**: `main` - 生产环境代码，自动部署到 Cloudflare Pages
- **开发流程**: 直接在 `main` 分支开发 (小型项目简化流程)
- **紧急修复**: 可创建 `hotfix/` 分支进行紧急修复

### 提交规范
- **提交信息格式**: 使用中文描述，格式为 `类型: 简要描述`
- **常用类型**:
  - `feat: 新增功能`
  - `fix: 修复bug`
  - `docs: 文档更新`
  - `style: 样式调整`
  - `refactor: 代码重构`
  - `perf: 性能优化`

### 提交示例
```bash
git commit -m "feat: 新增用户反馈管理功能"
git commit -m "fix: 修复图片生成API超时问题"
git commit -m "docs: 更新API文档和使用说明"
```

### 发布流程
1. **开发完成**: 本地测试功能正常
2. **提交代码**: 使用规范的提交信息
3. **推送到main**: `git push origin main`
4. **前端自动部署**: Cloudflare Pages 自动触发
5. **后端手动部署**: 执行 `wrangler deploy`
6. **生产验证**: 访问 https://aistone.org 确认功能正常

## 部署

### 前端 (Cloudflare Pages)
- **部署方式**: GitHub 推送自动触发部署
- **发布目录**: `frontend/`
- **自定义域名**: https://aistone.org
- **无需构建过程** (静态文件直接部署)
- **部署命令**: 无需手动命令，推送代码到 main 分支即可自动部署

### 后端 (Cloudflare Workers)
- **部署命令**: 
  ```bash
  # 在项目根目录执行
  wrangler deploy
  ```
- **Worker 名称**: `text2image-api` (在 wrangler.toml 中定义)
- **Worker URL**: `https://text2image-api.peyoba660703.workers.dev`
- **入口文件**: `backend/index.js`

### 部署前准备
1. **安装 Wrangler CLI** (如果尚未安装):
   ```bash
   npm install -g wrangler
   ```

2. **登录 Cloudflare**:
   ```bash
   wrangler login
   ```

3. **配置环境变量**: 在 Cloudflare Workers 控制台中设置必需的环境变量

### 完整部署流程
1. **前端部署**: 推送代码到 GitHub main 分支 → Cloudflare Pages 自动部署
2. **后端部署**: 在本地执行 `wrangler deploy` → 部署到 Cloudflare Workers
3. **验证**: 访问 https://aistone.org 确认服务正常运行

## 开发调试

### 本地调试技巧
- **前端调试**: 使用浏览器开发者工具，重点关注 Network 和 Console 面板
- **API 调试**: 在前端代码中添加 `console.log` 调试 API 响应
- **跨域问题**: 确保本地服务器启用 CORS 支持

### Worker 日志查看
- **实时日志**: `wrangler tail` (查看 Worker 实时日志)
- **部署日志**: `wrangler deploy --compatibility-date=2024-03-01` (查看部署过程)
- **调试模式**: 在 `wrangler.toml` 中设置 `LOG_LEVEL=debug` 获取详细日志

### 常见调试场景
- **API 响应异常**: 检查 Worker 日志和外部 API 状态
- **认证问题**: 验证 JWT 令牌和 localStorage 存储
- **图片生成失败**: 检查 Pollinations API 响应和提示词格式
- **部署失败**: 检查环境变量配置和 KV 命名空间绑定

### 错误排查步骤
1. **检查控制台错误** - 浏览器 F12 控制台
2. **查看 Worker 日志** - `wrangler tail`
3. **验证 API 状态** - 直接访问 API 端点测试
4. **检查网络请求** - 浏览器 Network 面板分析请求响应

## 性能监控

### 性能指标监控
- **API 响应时间**: 关注图片和语音生成 API 的响应时间
- **错误率监控**: 监控 API 调用失败率和错误类型
- **用户体验**: 关注页面加载速度和交互响应
- **资源使用**: 监控 Worker 执行时间和内存使用

### Cloudflare 监控工具
- **Workers 分析面板**: 查看请求量、错误率、执行时间
- **Pages 分析**: 监控页面访问量和性能指标
- **Real User Monitoring**: 监控真实用户体验数据
- **日志聚合**: 通过 `wrangler tail` 实时查看日志

### 性能优化建议
- **图片优化**: 合理设置图片尺寸，避免过大请求
- **缓存策略**: 利用浏览器缓存和 Cloudflare CDN
- **API 重试**: 使用 `fetchWithRetry` 处理临时故障
- **错误处理**: 提供用户友好的错误提示，避免白屏

### 监控告警
- **API 故障**: 监控外部 API (Pollinations, DeepSeek) 的可用性
- **配额监控**: 关注 API 配额使用情况，避免超限
- **错误日志**: 定期检查 Worker 错误日志，及时发现问题
- **用户反馈**: 通过反馈系统了解用户遇到的问题

### 日志查看方法
- **实时日志**: `wrangler tail --format=pretty`
- **错误过滤**: `wrangler tail --format=json | grep "error"`
- **生产日志**: Cloudflare 控制台 → Workers → 日志选项卡
- **KV 操作日志**: 通过调试模式查看 KV 读写操作

## 常见问题

### CORS 配置
- Worker 包含全面的 CORS 处理，支持跨域请求
- 支持预检 OPTIONS 请求
- 为前端域名访问进行了配置

### 外部 API 速率限制
- Pollinations API 调用包含指数退避的重试逻辑
- DeepSeek API 有速率限制 - 适当处理 429 响应
- 在生产环境中监控配额使用情况

### 认证调试
- 在 wrangler.toml 中设置 `LOG_LEVEL=debug` 获取详细认证日志
- 检查 JWT 令牌过期和刷新逻辑
- 验证 Google OAuth 配置和重定向 URL