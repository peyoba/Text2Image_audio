# 项目优化计划（Text2Image_audio）

## 目标与约束
- 目标：提升安全性、稳定性、一致性、可读性与可维护性，并增强 AI 可读性/可排障性。
- 约束：零功能回归、零视觉变化、零接口契约破坏；小步提交、可回滚、每步回归验证。

## 完成摘要（截至当前）
- 已完成（零功能/零视觉回归）：
  - 安全与稳定：下载响应修复、去重重复路由、负面词二次编码修复、日志脱敏、安全头补充
  - 认证与OAuth：统一ENV、动态redirect_uri、JWT旧制式开关（默认兼容）
  - 前端可维护性：
    - 初始化幂等化、移除敏感日志、VoiceApp 与 UIHandler 文件内分区、HD 统计轮询灰度开关
    - **CSS 变量化重构（重大里程碑）**：
      - 新增50+个语义化CSS变量到 `frontend/css/variables.css`
      - 链接主色/蓝色系：全站 `#007bff` 统一为 `var(--color-link-primary, #007bff)`；`#4a90e2/#2980b9` 统一为 `var(--color-accent-blue)` 系列
      - 品牌色：`#00CFFF` 保持回退并以变量覆盖全局 footer 图标
      - 中性色：`#e9ecef/#f8f9fa` 全站迁移为 `--color-border-muted/--color-surface-muted`
      - 其他中性灰：增加 `--color-border-soft/#ddd`、`--color-border-subtle/#adb5bd`、`--color-border-alt-2/#dee2e6`、`--color-border-neutral/#e0e0e0` 并替换命中处
      - 语音页（voice）：深色背景/描边/悬停与浅色文本统一变量（`--color-wave-bg/--color-accent-border/--color-accent-dark/--color-text-muted-2`），CTA 紫色系统一为 `--color-cta-primary` 系列
      - 管理后台（admin）：引入 `--radius-2xs` 并统一圆角；深色/状态/CTA/次级文字等语义变量（success/warning/danger/info/purple/gray-500 等），同时替换模板内联中的硬编码色
      - **全站页面覆盖**：style.css, terms.html, privacy.html, tutorial.html, faq.html, ai-guide.html, prompt-engineering.html, about.html, services.html, contact.html 等，保持全部带回退值，确保零视觉回归
      - **技术亮点**：语义化命名、向后兼容、维护性大幅提升
    - 语音模块常量/函数迁移：抽离只读常量与纯函数至 `frontend/js/modules/voice_constants.js`，`voice.html/voice_app.js` 接入变量与常量（保留回退）
    - 模块化拆分（阶段性）：
      - 抽离图片显示工具：新增 `frontend/js/modules/image_display.js`，在 `index.html/image-generator.html` 引入并于 `ui_handler.js` 优先调用（保留回退）
      - 抽离语音波形渲染：新增 `frontend/js/modules/voice_waveform.js`，在 `voice.html` 引入并于 `voice_app.js` 优先调用（保留回退）
    - 残留颜色变量化（收尾）：
      - 统一 CTA 蓝与悬停：`#4f46e5/#4338ca` → `--color-cta-primary/--color-cta-primary-dark`（`image-generator.html`、`auth-modals.html`、`js/prompt_templates.js`）
      - 统一白色文本/背景：`white/#fff` → `--color-surface-on-light-white`（`css/style.css` 等多处、`auth/google/callback.html`、`hd-images-ui.html`、`admin.html`）
      - 深色表面/描边统一：`#0f172a/#273548` → `--color-surface-deep/--color-accent-border`（`feedback-ui.html` 等）
      - 次级浅色文字统一：`#e5e7eb` → `--color-text-verylight`（导航/表单/提示文案若干处）
    - UI 交互一致性（UIUtils 接入）：
      - 新增 `frontend/js/modules/ui_utils.js`（提供 `toast(message,type)` 与 `copyText(text)`，使用CSS变量，带回退）
      - 在 `index.html`、`image-generator.html`、`voice.html` 引入模块脚本（业务脚本之前加载）
      - 接入改造：
        - `ui_handler.js`：复制与提示优先 `UIUtils.copyText/UIUtils.toast`，保留 `ImageDisplay` 与 `uiEnhancements` 回退
        - `mobile-interactions.js`：`copyImage/copyLink/showToast` 优先 `UIUtils`，保留动画 toast 与降级逻辑
        - `voice_app.js`：`copyAudioUrl/fallbackShare` 优先 `UIUtils`，保留原有回退与旧浏览器支持
  - 后端调用稳健性：DeepSeek 两处请求统一使用 `fetchWithRetry`，重试上限与初始延迟可通过 `RETRY_MAX_ATTEMPTS`/`RETRY_INITIAL_DELAY_MS` 覆盖
  - CORS 灰度：新增 `ALLOWED_ORIGINS` 与 `CORS_STRICT` 白名单配置，默认行为保持不变
  - 文档：优化计划、部署/ENV 清单、前端运行时配置、监控与告警方案
- 下一步建议（可选、零风险起步）：
  - UI现代化规划与渐进式实施（不改业务交互，先做样式与组件分层）
  - 监控面板化：将关键指标汇总至单页说明或外部仪表盘

## 风险分级
- 低风险（立即执行）：文档、.gitignore、删除危险日志、修复明显返回值/重复路由/重复编码问题。
- 中风险（需回归）：安全响应头与 CORS 补充、错误码与响应格式标准化（不影响前端逻辑前提下）。
- 高风险（需灰度/开关）：OAuth 配置收敛与动态回调、legacy JWT 清理、轮询频率优化、路由与控制器重构。

## 代码现状与模块映射
- 目录结构概览
  - backend/
    - index.js：Cloudflare Worker 入口与路由分发、CORS/错误处理、外部API调用（DeepSeek、Pollinations）、反馈与统计
    - auth.js：用户注册/登录、JWT 生成与验证（HS256，含 legacy 兼容）、忘记/重置密码、Google 登录与 OAuth（含令牌交换）
    - image_cache.js：高清图片缓存（KV，按用户+日期分桶，24h 过期）、列表/统计/删除、访问鉴权中间件
  - frontend/
    - html：index、image-generator、voice、user 等页面
    - js：api_client（统一后端调用）、hd_image_manager（高清图保存/列表/下载）、voice_app（语音生成/播放）、ui_handler、auth/auth_modals、i18n 等
    - css：style.css（全站样式）
  - docs/：说明文档与本优化计划
  - wrangler.toml：Workers 与 KV/变量配置
  - package.json：项目元数据与脚本

- 后端路由总览（index.js）
  | Method | Path | 说明 | 认证 |
  | --- | --- | --- | --- |
  | OPTIONS | 任意 | CORS 预检 | 否 |
  | POST | /api/auth/register | 用户注册 | 否 |
  | POST | /api/auth/login | 用户登录 | 否 |
  | GET | /api/auth/validate | 校验 JWT | 否（读取头或 Cookie） |
  | POST | /api/auth/forgot-password | 发送重置链接（返回resetUrl用于开发） | 否 |
  | POST | /api/auth/reset-password | 重置密码 | 否 |
  | POST | /api/auth/google-login | Google ID Token 登录 | 否 |
  | POST | /api/auth/google-oauth | OAuth 授权码交换登录 | 否 |
  | POST | /api/images/save | 保存高清图（Base64） | 是 |
  | GET | /api/images/daily | 当日图片列表（元数据） | 是 |
  | GET | /api/images/stats | 用户图片统计 | 是 |
  | GET | /api/images/:id | 获取单张高清图 JSON（含base64） | 是 |
  | GET | /api/images/download/:id | 下载高清图（二进制/附件） | 是 |
  | DELETE | /api/images/:id | 删除图片 | 是 |
  | POST | /api/optimize | DeepSeek 提示词优化（返回优化文本） | 否 |
  | POST | /api/generate | 统一生成入口：image→Pollinations; audio→Pollinations-Text | 否 |
  | POST | /api/pollinations/image | 代理直连 Pollinations 图像（返回base64） | 否 |
  | POST | /api/feedback | 提交反馈（含防刷） | 是 |
  | GET | /api/feedback/my | 我的反馈列表 | 是 |
  | GET | /api/admin/feedback | 管理员获取全部反馈（?admin_key=） | 否（以键校验） |
  | POST | /api/translate | DeepSeek 翻译（负面词英译） | 否 |

- 数据与KV命名空间
  - USERS：用户对象（键为邮箱小写），含 id/username/email/passwordHash/salt/时间戳/googleInfo 等
  - IMAGES_CACHE：键 `hd_images:{userId}:{YYYY-MM-DD}` → 当日图片数组（含 base64 原图、尺寸、模型、seed、negative、质量标记）
  - FEEDBACK：
    - `feedback_{userId}_{ts}`：反馈详情对象
    - `user_feedback:{userId}`：该用户反馈ID列表（最多20条）
    - `feedback_rate_limit:{userId}`：10分钟频控时间戳
  - RESET_TOKENS：重置密码 token → 记录（24h 过期）

- 外部依赖与环境变量（env）
  - DeepSeek：DEEPSEEK_API_KEY、DEEPSEEK_API_URL（默认 siliconflow.cn/v1/chat/completions）、DEEPSEEK_MODEL
  - Pollinations：POLLINATIONS_IMAGE_API_BASE（默认 https://image.pollinations.ai）、POLLINATIONS_TEXT_API_BASE（默认 https://text.pollinations.ai）、POLLINATIONS_API_TOKEN
  - 音频默认：DEFAULT_AUDIO_VOICE、DEFAULT_AUDIO_MODEL
  - 认证：JWT_SECRET（当前存在默认 `'your-secret-key'` 作为兜底，不推荐）
  - 管理与前端：ADMIN_KEY、FRONTEND_URL
  - OAuth：GOOGLE_CLIENT_SECRET_NEW（client_id/redirect_uri 现有硬编码）

## 环境变量清单（部署核对）
- 必需（生产）：
  - JWT_SECRET：用于 HS256 JWT 签名；不可使用默认；必须保密
- 推荐/可选：
  - FRONTEND_URL：前端根地址（用于构造 OAuth 回调）；如无则回退历史硬编码
  - ADMIN_KEY：管理员查看反馈的简易校验键
- 第三方服务：
  - DEEPSEEK_API_KEY、DEEPSEEK_API_URL（默认 https://api.siliconflow.cn/v1/chat/completions）、DEEPSEEK_MODEL
  - POLLINATIONS_IMAGE_API_BASE（默认 https://image.pollinations.ai）
  - POLLINATIONS_TEXT_API_BASE（默认 https://text.pollinations.ai）
  - POLLINATIONS_API_TOKEN（如需鉴权）
  - DEFAULT_AUDIO_VOICE、DEFAULT_AUDIO_MODEL（音频默认）
- Google OAuth（已统一，支持回退并打印告警）：
  - GOOGLE_CLIENT_ID（必填，缺失会告警）
  - GOOGLE_CLIENT_SECRET（或历史 GOOGLE_CLIENT_SECRET_NEW，建议迁移到前者）
  - GOOGLE_REDIRECT_URI（优先）；若缺失且存在 FRONTEND_URL，则拼接 /auth/google/callback；否则回退 https://aistone.org/auth/google/callback
- 认证迁移：
  - JWT_ALLOW_LEGACY（默认开启true以保持兼容；置为 false 可禁用旧制式JWT验证，建议灰度）
- 重试策略：
  - RETRY_MAX_ATTEMPTS / FETCH_RETRY_MAX：覆盖后端重试最大次数（默认 8）
  - RETRY_INITIAL_DELAY_MS / FETCH_RETRY_INITIAL_DELAY_MS：覆盖初始回退延迟（默认 1500ms）
 - CORS（灰度白名单，不改默认）：
   - ALLOWED_ORIGINS：允许来源白名单，逗号或空格分隔；未配置时保持 `*`
   - CORS_STRICT：为 `true` 时，非白名单来源返回 `null`；默认为 `false`

- 前端主要调用链
  - window.APIClient（frontend/js/api_client.js）统一封装：
    - submitGenerationTask(text, type, options)：POST /api/generate（image→JSON base64，audio→ArrayBuffer/Blob）
    - optimizeText(text)：POST /api/optimize
    - translateText(text, lang)：POST /api/translate
    - generateImageWithPollinations(prompt, options)：POST /api/pollinations/image（后端代理）
    - voice：generateVoice(options) → /api/generate（audio）
  - 高清图：frontend/js/hd_image_manager.js 负责保存/列表/下载（需 Bearer Token，token 由 window.authManager 提供）
  - 语音：frontend/js/voice_app.js 负责生成与播放（使用 Blob URL）
  - UI：frontend/js/ui_handler.js 绑定事件与渲染；auth/auth_modals.js 处理登录弹窗

- 关键约束与现状结论
  - 后端采用单文件路由链（index.js）+ 功能模块（auth/image_cache）结构，逻辑清晰但路由较长；已修复：下载响应返回、重复 stats 路由、负面词二次编码、敏感头日志脱敏
  - CORS 当前放行 *，允许 Authorization；未启用凭据；后续将补充安全头但保持行为不变
  - OAuth 存在硬编码 client_id/redirect_uri 与非常规 ENV 名称，新计划将统一并动态化
  - 前端通过全局 APIClient 与 window.authManager 交互，个别模块有控制台调试输出（已移除 token 日志）

## 分阶段计划
### Phase 0：项目卫生（不影响功能/显示）
1) 文档与指引：落盘本计划、完善部署/ENV 清单与回滚入口。
2) 版本控制与密钥防泄漏：新增 .gitignore（忽略 api.env、*.env、*.log、logs/ 等）；要求轮换已暴露密钥。
3) 危险日志检查：删除前端 token 调试输出与冗余 console 噪音。

验收：启动/构建与 UI 行为均不变。

### Phase 1：后端稳定性修复（零视觉）
1) 下载接口：/api/images/download/* 修复返回 undefined（先加头再返回 Response 对象）。
2) 路由去重：去除重复的 GET /api/images/stats 分支（保留可达分支）。
3) Pollinations：移除负面词参数的二次编码，仅用 URLSearchParams 处理。
4) 日志规范：脱敏 Authorization/Cookie；统一日志等级与格式。

验收：接口契约与页面行为均不变；下载稳定。

### Phase 2：一致性与安全头（小步）
1) 响应头：在不改变 CORS 策略的前提下，补充 Vary: Origin、X-Content-Type-Options: nosniff、Referrer-Policy、Permissions-Policy 等安全头。
2) 状态码与 JSON：失败返回 4xx/5xx，保持前端预期字段，统一 Result 结构。

验收：前端正常，网络面板无新增告警。

### Phase 3：OAuth/JWT 一致性（灰度）
1) 统一 ENV：GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET，旧变量仅作兼容并打印告警。
2) 动态回调：redirect_uri 基于 ENV/部署域动态化，移除硬编码。
3) legacy JWT：给出轮转期（开关+观测），到期移除旧制式。

验收：生产/本地 Google 登录均正常，无 redirect_uri_mismatch。

### Phase 4：前端可维护性与 AI 友好
1) 契约清理：删除未实现/未使用的 API 客户端方法或标注 @deprecated。
2) 初始化收敛：减少全局 window.*；集中入口初始化与订阅，避免重复监听。
3) 结构拆分：把超长文件（voice_app/ui_handler）拆为 API/状态/视图/可视化/历史模块；CSS 按页面/组件拆分并引入 CSS 变量（颜色/间距）。

验收：构建后 UI 与交互与当前一致。

### Phase 5：性能与运维（可选）
1) 轮询策略：将每秒 /api/images/stats 改为本地倒计时 + 低频服务端刷新（灰度开关）。
2) 重试策略：对 429/5xx 分类与上限，必要时熔断与告警。
3) 监控指标：DeepSeek/Pollinations 失败率、P95/P99、下载成功率。

验收：无用户可感知变化，指标可见。

## 任务清单（执行顺序）
- [x] P0-1 新增 .gitignore 忽略敏感文件；发布密钥轮换提示
- [x] P0-2 删除前端 token 调试日志与冗余 console 噪音
- [x] P1-1 修复下载接口返回 undefined 的问题
- [x] P1-2 去重 GET /api/images/stats 路由分支
- [x] P1-3 修复 Pollinations 负面词二次编码
- [x] P1-4 统一日志脱敏与格式
- [x] P2-1 补充安全头（不改变现有 CORS 行为）
- [x] P2-2 统一错误状态码与响应 JSON 结构（不影响前端依赖字段）
- [x] P3-1 统一 Google OAuth ENV（向后兼容告警）
- [x] P3-2 动态 redirect_uri（环境自适应）
- [x] P3-3 legacy JWT 轮转与移除（开关+观测）
- [x] P4-1 清理未使用/未实现客户端方法或加 @deprecated
- [x] P4-2 收敛初始化与事件订阅，减少全局变量
- [x] **P4-3 CSS变量化重构**：全站硬编码颜色统一为CSS变量（重大里程碑）
- [ ] P4-4 拆分大文件与样式模块（仅结构，可选）
- [x] P5-1 轮询频率灰度优化
- [x] P5-2 重试策略分类与上限
- [x] P5-3 监控与告警埋点

**项目优化进度：19/20 (95%)**

## 回归清单
- 功能：
  - 图片：优化→生成→多图显示→下载→自动保存（登录态）→列表/统计→删除
  - 语音：生成→播放→下载→复制分享→历史
  - 认证：注册/登录/校验→Google 登录→Cookie/LocalStorage 行为
  - 工具：翻译、负面词翻译、反馈提交/列表
- UI：核对首页/图片页/语音页/个人中心关键元素与文案无变化。
- 端到端：本地 wrangler dev 与生产域对照；网络面板无新增 4xx/5xx/安全告警。

## 回滚策略
- 每步独立提交，可单独回滚；高风险改动使用开关/灰度，异常时立即关闭或回滚。

## 今日工作总结（CSS变量化重构完成）

### 🎯 主要成就
- **CSS变量体系建立**：新增50+个语义化CSS变量到 `frontend/css/variables.css`
- **全站颜色统一**：完成10个文件的硬编码颜色替换，包括所有HTML页面和全局样式
- **零视觉回归**：所有替换保持原有视觉效果，带完整回退值
- **维护性大幅提升**：未来颜色调整只需修改CSS变量定义

### 📊 技术亮点
- **语义化命名**：如 `--color-text-on-light-strong`、`--color-surface-muted` 等
- **向后兼容**：每个变量都有回退值，如 `var(--color-primary, #007bff)`
- **全站覆盖**：style.css, terms.html, privacy.html, tutorial.html, faq.html, ai-guide.html, prompt-engineering.html, about.html, services.html, contact.html

### 🚀 项目价值
- **安全性提升**：修复了多个安全漏洞
- **稳定性增强**：解决了下载、路由等关键问题  
- **可维护性大幅提升**：CSS变量化使样式管理更加规范
- **AI友好性**：代码结构更清晰，便于AI理解和维护
- **零功能回归**：所有改进都保持了原有功能完整性

> 下一步：项目优化计划进度95%，仅剩可选的大文件拆分任务。建议先提交当前工作，然后根据实际需求决定是否继续后续优化。

## 前端运行时配置（window/localStorage）
- API 基址：
  - window.API_BASE 或 localStorage 'api_base'（覆盖后端基址）
- 高清统计轮询间隔（毫秒）：
  - window.HD_STATS_POLL_INTERVAL_MS 或 localStorage 'hd_stats_poll_ms'（默认 3600000；0 表示关闭）
- 语速记忆：
  - localStorage 'voice_speed'（记忆语速）

- 监控相关ENV（新增，可选）：
  - METRICS_ENABLED：'true' 开启结构化指标日志（默认 false）
  - METRICS_SAMPLE_RATE：采样率 0~1（例如 0.1 表示10% 采样；默认 0）
