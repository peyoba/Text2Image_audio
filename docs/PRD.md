# AISTONE 产品需求文档 (PRD)

> 版本: v1.0  
> 日期: 2026-02-18  
> 状态: 审查阶段

---

## 1. 产品概述

### 1.1 产品定位

AISTONE 是一个基于 Pollinations.AI 开源 API 的 AI 内容创作平台，面向全球用户提供 AI 图片生成与语音合成服务。平台采用 Cloudflare 全栈 Serverless 架构（Pages + Workers + KV），前端使用原生 HTML/CSS/JS，后端运行于 Cloudflare Workers。

### 1.2 核心功能

| 功能模块 | 描述 | 当前状态 |
|---------|------|---------|
| AI 图片生成 | 支持 12 种模型（2 个免费 + 10 个付费），多种尺寸和批量生成 | 已上线 |
| AI 语音合成 | 11 种音色，支持中英文，可在线播放和下载 | 已上线 |
| 智能提示词优化 | 集成 DeepSeek，自动将中文描述优化为英文提示词 | 已上线 |
| 用户认证系统 | 邮箱注册/登录、Google OAuth、JWT token 管理 | 已上线 |
| 高清图片缓存 | 登录用户可保存高清图片，每日 3 张，24 小时过期 | 已上线（无路由） |
| 用户反馈系统 | 登录用户可提交反馈，管理员可查看全部反馈 | 已上线 |
| 多语言支持 | 中文/英文双语切换 | 已上线 |

### 1.3 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | 原生 HTML5 + CSS3 + JavaScript（无构建工具/框架） |
| 后端 | Cloudflare Workers（ES Module） |
| 存储 | Cloudflare KV（USERS / IMAGES_CACHE / RESET_TOKENS / FEEDBACK） |
| 图片 AI | Pollinations.AI（免费: image.pollinations.ai / 付费: gen.pollinations.ai） |
| 语音 AI | Pollinations Audio（gen.pollinations.ai/v1/chat/completions） |
| 文本 AI | DeepSeek（通过 SiliconFlow 代理） |
| 认证 | 自研 JWT（HS256）+ Google OAuth 2.0 |
| CI/CD | GitHub Actions（lint + unit tests + integration tests） |

---

## 2. 代码审查报告

### 2.1 安全问题（严重）

#### S1: JWT Secret 硬编码回退值

- **文件**: `backend/auth.js` (第 289、381、426、907、1100 行)
- **问题**: `env.JWT_SECRET || "your-secret-key"` — 如果环境变量未配置，会使用硬编码默认值，攻击者可直接伪造 token
- **风险等级**: **严重**
- **建议**: 当 `JWT_SECRET` 未配置时，应直接抛出错误拒绝启动，而非回退到不安全的默认值

#### S2: 密码重置 Token 使用 Math.random()

- **文件**: `backend/auth.js` (第 579-584 行)
- **问题**: `generateResetToken` 使用 `Math.random().toString(36)` 生成随机字符串，`Math.random()` 不是密码学安全的随机数生成器
- **风险等级**: **高**
- **建议**: 使用已导入的 `randomBytes` 替代 `Math.random()`

#### S3: 管理员密钥通过 URL 参数传递

- **文件**: `backend/routes/feedback.js` (第 58-59 行)
- **问题**: `url.searchParams.get("admin_key")` — 管理密钥作为 URL 参数传递，会被记录在服务器日志、浏览器历史、CDN 日志中
- **风险等级**: **高**
- **建议**: 改为通过 `Authorization` 请求头传递管理凭证

#### S4: 密码重置 URL 直接在 API 响应中返回

- **文件**: `backend/auth.js` (第 674-679 行)
- **问题**: 代码注释明确标注"生产环境删除此行"，但 `resetUrl` 仍在 API 响应中返回。任何人调用 forgot-password 接口都能直接获得重置链接
- **风险等级**: **高**
- **建议**: 生产环境必须删除 `resetUrl` 返回，并实现邮件发送功能

#### S5: 邮件发送功能缺失

- **文件**: `backend/auth.js` (第 672 行)
- **问题**: `// TODO: 这里应该发送邮件给用户` — 密码重置流程缺少邮件发送环节，当前的重置链接是直接返回给前端的
- **风险等级**: **高**
- **建议**: 集成邮件服务（如 Cloudflare Email Workers、SendGrid、Resend）

#### S6: 缺少 CSRF 防护

- **问题**: 所有 POST API 端点无 CSRF token 验证。虽然使用了 CORS 策略，但默认配置 `Access-Control-Allow-Origin: *` 削弱了保护
- **风险等级**: **中**
- **建议**: 对状态变更类操作添加 CSRF token 或 `SameSite` cookie 策略

#### S7: 用户输入未做提示词注入防护

- **问题**: 用户提交的 prompt 直接拼接到外部 API URL 中，虽然做了 `encodeURIComponent`，但未对恶意内容做内容层面过滤
- **风险等级**: **低**
- **建议**: 可考虑添加基本的内容过滤/长度限制

---

### 2.2 架构问题

#### A1: auth.js 文件过大（1225 行）

- **文件**: `backend/auth.js`
- **问题**: JWT 工具函数、密码哈希、用户注册/登录、Google OAuth、密码重置 — 全部堆积在同一个文件中
- **建议**: 拆分为独立模块：
  - `utils/jwt.js` — JWT 生成与验证
  - `utils/password.js` — 密码哈希与验证
  - `services/auth.js` — 注册/登录/token 验证逻辑
  - `services/google-oauth.js` — Google OAuth 处理
  - `services/password-reset.js` — 密码重置流程

#### A2: 前端全局变量污染

- **文件**: `frontend/js/*.js`
- **问题**: 所有模块通过 `window` 全局对象通信（`window.APIClient`、`window.uiHandler`、`window.UIHandler` 等），无模块化系统
- **建议**: 虽然项目选择了无构建工具的方案，但可以考虑使用原生 ES Modules（`<script type="module">`），或至少使用 IIFE 减少全局污染

#### A3: 已废弃方法仍保留在生产代码中

- **文件**: `frontend/js/api_client.js`
- **问题**: `getTaskStatus`、`pollTaskUntilCompletion`、`getGeneratedImage`、`getGeneratedAudio`、`downloadAudio` 均标注为 `@deprecated`，但仍然存在于代码中
- **建议**: 确认无调用后移除这些方法，或在方法内添加 `console.warn` 提醒

#### A4: 模块级全局可变状态

- **文件**: `backend/router.js` (第 1 行)
- **问题**: `const routes = []` 是模块级可变数组，配合 `routesRegistered` 全局标记使用。在 Workers 的热实例复用场景下，多次请求共享同一个 routes 数组可能导致路由重复注册
- **建议**: 使用 `clearRoutes()` 或在 `ensureRoutesRegistered` 中添加防重入检查

#### A5: 高清图片缓存模块无路由

- **文件**: `backend/image_cache.js`
- **问题**: `HDImageCacheManager` 类完整实现了 CRUD 操作，但没有在 `backend/routes/` 中注册任何对应路由。该功能实际不可访问
- **建议**: 注册对应的 API 路由或移除未使用代码

#### A6: 缺少请求速率限制

- **问题**: 除反馈模块外，图片生成、语音合成、提示词优化等核心 API 端点无速率限制。恶意调用会直接消耗 Pollen 积分
- **建议**: 基于 KV 实现简单的速率限制中间件，或使用 Cloudflare Rate Limiting

---

### 2.3 性能问题

#### P1: Base64 编码效率低

- **文件**: `backend/utils/base64.js`
- **问题**: `arrayBufferToBase64` 使用字符串拼接 `binary += String.fromCharCode(bytes[i])`，对于大图片（MB 级别）性能为 O(n^2)
- **建议**: 使用分块处理方式，例如：
  ```javascript
  const CHUNK = 8192;
  const parts = [];
  for (let i = 0; i < len; i += CHUNK) {
    parts.push(String.fromCharCode(...bytes.subarray(i, i + CHUNK)));
  }
  return btoa(parts.join(""));
  ```

#### P2: 反馈列表串行 KV 读取

- **文件**: `backend/services/feedback.js` (第 79-95 行)
- **问题**: `getUserFeedbackList` 在 for 循环中逐个 `await env.FEEDBACK.get(feedbackId)`，每次调用都是一次网络往返
- **建议**: 使用 `Promise.all` 并行读取，或将反馈数据直接嵌入列表 KV 值中

#### P3: 管理员反馈列表无分页

- **文件**: `backend/services/feedback.js` (第 108-147 行)
- **问题**: `getAllFeedbackForAdmin` 加载全部反馈到内存，数据量大时会超出 Workers 内存限制
- **建议**: 添加分页参数（`cursor`/`limit`），利用 KV list 的 `cursor` 支持

#### P4: KV 存储完整 Base64 图片数据

- **文件**: `backend/image_cache.js`
- **问题**: 高清图片（最大 2MB）作为 Base64 字符串存储在 KV 中，KV 值大小限制为 25MB 但读写性能会随数据量下降
- **建议**: 使用 Cloudflare R2 存储图片数据，KV 仅存储元数据和 R2 key

#### P5: 重试策略可能导致超长等待

- **文件**: `backend/utils/fetch.js`
- **问题**: 默认 8 次重试 + 指数退避（起始 1.5s），最坏情况下总等待时间可达 5 分钟以上，可能超出 Workers 的 CPU 时间限制
- **建议**: 
  - 降低默认重试次数到 3-4 次
  - 为每次请求添加 `AbortController` 超时控制
  - 设置总超时上限

#### P6: 前端未使用代码打包/压缩

- **问题**: 所有 JS/CSS 文件以原始形式加载，没有 minify/bundle 处理。前端 JS 总计 ~16000 行
- **建议**: 考虑使用轻量构建工具（如 esbuild/rollup）进行生产构建，减少请求数和传输体积

---

### 2.4 代码质量问题

#### Q1: 错误处理方式不一致

- **问题**: 后端部分函数返回 `{success: false, error: "..."}` 对象，部分函数直接 `throw new Error()`。调用方需要同时处理两种模式
- **建议**: 统一错误处理策略。推荐：服务层返回结果对象，路由层处理 HTTP 状态码

#### Q2: 前端生产环境大量 console.log

- **文件**: `frontend/js/api_client.js` 等
- **问题**: `app.js` 在非调试模式下只静默了 `console.debug/info/log`，但 `api_client.js` 等文件包含大量 `console.log` 调用用于调试
- **影响**: 非调试模式下这些 log 已被抑制，但代码中仍存在大量无用的字符串拼接开销
- **建议**: 使用条件编译或懒求值模式减少开销

#### Q3: 动态 import 在热路径上

- **文件**: `backend/image_cache.js` (第 245 行)
- **问题**: `authenticateImageAccess` 每次调用都执行 `await import("./auth.js")`
- **建议**: 改为文件顶部静态 import

#### Q4: 重复的验证逻辑

- **问题**: 邮箱验证正则 `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` 在 `auth.js` 中定义了两次（第 212 行和第 635 行），密码强度验证也有重复
- **建议**: 提取为共享的校验工具函数

#### Q5: 前后端模型列表不一致

- **文件**: `frontend/js/api_client.js` 第 396 行 vs `backend/services/generation.js` 第 9 行
- **问题**: 前端将 `turbo` 标记为 `isFree: true`，但后端将 `turbo` 列入 `PREMIUM_MODELS`（需付费）
- **影响**: 用户选择 turbo 模型时认为是免费的，但实际调用付费 API
- **建议**: 统一前后端的模型分类定义，最好由后端提供模型列表 API

#### Q6: 健康检查请求头传参不一致

- **文件**: `backend/routes/health.js` (第 30 行)
- **问题**: `jsonResponse(summary, env, statusCode, {}, request)` 在签名末尾传了 `request`，但 `jsonResponse` 的第 5 个参数 `request` 在内部仅用于 CORS 头计算，而第 4 个参数 `additionalHeaders` 传了空对象 `{}`。这种调用方式不直观
- **建议**: 统一 `jsonResponse` 的参数设计，考虑使用 options 对象模式

---

### 2.5 可维护性问题

#### M1: CLAUDE.md 职责膨胀

- **文件**: `CLAUDE.md` (678 行)
- **问题**: 该文件同时承担了 AI 助手指导、开发日志、变更记录、项目状态报告等多种职责
- **建议**: 保持 CLAUDE.md 精简，将开发日志和变更记录移至 `CHANGELOG.md`

#### M2: 多份重复的项目状态文档

- **文件**: `project_status_report_2025.md`、`docs/PROJECT_STATUS_REPORT_2025.md`、`docs/DEVELOPMENT_PROGRESS.md`
- **问题**: 项目状态和进度信息分散在多个文件中，且部分内容重叠
- **建议**: 合并为单一的项目状态文档

#### M3: 遗留测试文件在仓库根目录

- **文件**: `test_login.html`、`fix_navigation.html`、`color_audit.txt`、`color_audit_after.txt`、`color_audit_by_file.txt`
- **问题**: 调试/审计文件遗留在仓库根目录，增加了代码库的噪音
- **建议**: 移除或移至 `docs/audits/` 目录

#### M4: 前端 CSS 变量文件组织

- **文件**: `frontend/css/variables.css`、`frontend/css/style.css`
- **问题**: 仅 2 个 CSS 文件承载了所有样式，`style.css` 可能非常大
- **建议**: 按组件/页面拆分 CSS 文件

---

## 3. 优化建议优先级

### P0 - 必须立即修复（安全相关）

| 编号 | 问题 | 预估工时 |
|------|------|---------|
| S1 | 移除 JWT Secret 硬编码回退值 | 0.5h |
| S4 | 移除 API 响应中的重置 URL | 0.5h |
| S2 | 使用 cryptographically secure 随机数生成重置 token | 1h |
| S3 | 管理员认证改用请求头 | 1h |

### P1 - 高优先级（功能正确性 + 性能）

| 编号 | 问题 | 预估工时 |
|------|------|---------|
| Q5 | 统一前后端模型列表定义 | 2h |
| P1 | 优化 Base64 编码性能 | 1h |
| P5 | 调整重试策略，添加请求超时 | 2h |
| A6 | 添加核心 API 速率限制 | 4h |
| S5 | 实现邮件发送功能 | 8h |

### P2 - 中优先级（架构优化）

| 编号 | 问题 | 预估工时 |
|------|------|---------|
| A1 | 拆分 auth.js 模块 | 4h |
| A3 | 清理已废弃的前端方法 | 1h |
| A5 | 补全图片缓存路由或移除未用代码 | 2h |
| P2 | 优化反馈列表查询性能 | 2h |
| P3 | 添加管理员反馈分页 | 2h |
| Q1 | 统一后端错误处理模式 | 4h |
| Q4 | 抽取共享校验工具 | 1h |

### P3 - 低优先级（可维护性 + 体验优化）

| 编号 | 问题 | 预估工时 |
|------|------|---------|
| M1 | 精简 CLAUDE.md | 1h |
| M2 | 合并重复的状态文档 | 1h |
| M3 | 清理遗留测试文件 | 0.5h |
| A2 | 前端模块化改造 | 16h |
| P6 | 添加前端构建工具 | 8h |
| P4 | 图片存储迁移到 R2 | 8h |
| S6 | 添加 CSRF 防护 | 4h |

---

## 4. 产品路线图建议

### 4.1 近期（1-2 周）

- 修复全部 P0 安全问题
- 统一前后端模型列表
- 优化 Base64 编码和重试策略

### 4.2 中期（1-2 月）

- 实现邮件发送功能（密码重置）
- 添加 API 速率限制
- 拆分 auth.js 模块
- 清理废弃代码和冗余文件
- 补全图片缓存路由

### 4.3 远期（3-6 月）

- 前端模块化改造（引入 ES Modules 或轻量构建工具）
- 图片存储迁移到 R2
- 引入 TypeScript 类型系统
- 添加自动化端到端测试
- 引入 Sentry 等错误监控服务
- 用户使用量统计和分析面板

---

## 5. 附录

### 5.1 仓库结构

```
Text2Image_audio/
├── backend/
│   ├── index.js              # Worker 入口
│   ├── router.js             # 路由注册/匹配
│   ├── auth.js               # 认证模块（1225 行，需拆分）
│   ├── image_cache.js        # 高清图片缓存管理
│   ├── routes/
│   │   ├── auth.js           # 认证路由
│   │   ├── generation.js     # 图片/音频生成路由
│   │   ├── translate.js      # 翻译/优化路由
│   │   ├── feedback.js       # 反馈路由
│   │   └── health.js         # 健康检查路由
│   ├── services/
│   │   ├── generation.js     # Pollinations API 调用
│   │   ├── translate.js      # DeepSeek API 调用
│   │   ├── feedback.js       # 反馈 CRUD
│   │   └── health.js         # 健康检查逻辑
│   └── utils/
│       ├── base64.js         # Base64 编码
│       ├── cors.js           # CORS 处理
│       ├── fetch.js          # 带重试的 fetch
│       ├── logger.js         # 日志工具
│       ├── metrics.js        # 指标记录
│       └── response.js       # HTTP 响应构建
├── frontend/
│   ├── index.html            # 首页（图片生成）
│   ├── voice.html            # 语音合成页
│   ├── js/
│   │   ├── api_client.js     # API 客户端（546 行）
│   │   ├── app.js            # 应用入口
│   │   ├── auth.js           # 前端认证管理
│   │   ├── ui_handler.js     # UI 处理器（1389 行）
│   │   ├── voice_app.js      # 语音页逻辑（1119 行）
│   │   ├── i18n.js           # 国际化
│   │   └── ...               # 其他模块
│   └── css/
│       ├── style.css         # 主样式
│       └── variables.css     # CSS 变量
├── docs/                     # 文档目录
├── tests/                    # 测试目录
├── wrangler.toml             # Cloudflare Workers 配置
├── package.json              # 项目依赖
└── .github/workflows/ci.yml  # CI 配置
```

### 5.2 代码量统计

- 后端 JavaScript: ~2,800 行
- 前端 JavaScript: ~13,600 行
- 合计: ~16,400 行

### 5.3 API 端点清单

| 方法 | 路径 | 功能 | 认证 |
|------|------|------|------|
| POST | `/api/generate` | 图片/音频生成 | 否 |
| POST | `/api/pollinations/image` | Pollinations 图片代理 | 否 |
| POST | `/api/translate` | 负面提示词翻译 | 否 |
| POST | `/api/prompts/optimize` | 提示词优化 | 否 |
| POST | `/api/auth/register` | 用户注册 | 否 |
| POST | `/api/auth/login` | 用户登录 | 否 |
| GET  | `/api/auth/validate` | Token 验证 | 是 |
| POST | `/api/auth/forgot-password` | 忘记密码 | 否 |
| POST | `/api/auth/reset-password` | 重置密码 | 否 |
| POST | `/api/auth/google-login` | Google ID Token 登录 | 否 |
| POST | `/api/auth/google-oauth` | Google OAuth 授权码登录 | 否 |
| POST | `/api/feedback` | 提交反馈 | 是 |
| GET  | `/api/feedback/my` | 我的反馈列表 | 是 |
| GET  | `/api/admin/feedback` | 管理员反馈列表 | 管理密钥 |
| GET  | `/internal/health` | 健康检查 | 可选 Token |
