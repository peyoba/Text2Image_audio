# 最终详细指导文件（2026-03-14）

> 本文件为唯一保留的“最详细、可执行指导文件”，包含：
> 1) 域名更换 SOP
> 2) 后期开发技术蓝图（Phase 1–6）
> 3) 已确认关键决策

---

# Part A：域名更换详细 SOP

## A1. 目标与已确认事项
- 新域名：`aistone.cfd`
- 旧域名：`aistone.org` 保留并 301/308 重定向（至少 12 个月）
- 注册商：Spaceship
- DNS 托管：Cloudflare
- 部署：Cloudflare Pages + Cloudflare Workers
- API 建议使用自定义域名：`api.aistone.cfd`
- `www.aistone.cfd` 统一 301 到主域

## A2. 当前状态盘点（必须知道的事实）
- 前端默认 API 指向 `workers.dev`
- 代码与文档中大量硬编码 `aistone.org`（canonical/OG/sitemap/rss/邮箱/OAuth 回调/CORS 白名单）

## A3. 执行顺序（逐步操作）

### Step 1：购买域名
- 在 Spaceship 购买 `aistone.cfd`

### Step 2：接入 Cloudflare DNS
- Cloudflare 添加 `aistone.cfd` 站点
- 在 Spaceship 修改 NS 指向 Cloudflare
- 建议在切换前将旧域名 TTL 降到 300 秒

### Step 3：Pages 自定义域名
- Pages 项目添加 `aistone.cfd`
- 添加 `www.aistone.cfd`
- 将 `www.aistone.cfd` 301 到 `aistone.cfd`
- 验证 SSL 生效

### Step 4：Workers API 自定义域名
- Worker 绑定 `api.aistone.cfd`
- 验证证书和路由

### Step 5：旧域名重定向
- `aistone.org/*` → `aistone.cfd/*`（路径保持一致）
- 保留旧域名续费至少 12 个月

### Step 6：代码与配置更新
- 更新 Cloudflare 环境变量：
  - `FRONTEND_URL`
  - `ALLOWED_ORIGINS`
  - `GOOGLE_REDIRECT_URI`
- 批量替换所有 `aistone.org` 硬编码：
  - canonical/OG/meta
  - sitemap/robots/rss
  - 文案与邮箱地址
  - OAuth 回调地址
- 若启用 `api.aistone.cfd`，替换前端默认 API 地址

### Step 7：SEO 与平台更新
- Search Console 添加新域名
- 提交站点迁移
- 更新 sitemap 指向新域名
- 更新 OAuth/支付/Webhook 回调

## A4. 验收清单
- `aistone.cfd` 全站可访问
- `www.aistone.cfd` 正确 301
- API 新域名可调用
- OAuth 登录正常
- 旧域名正确 301/308

## A5. 回滚策略
- DNS 回滚恢复旧域名指向
- 临时撤销旧域名重定向
- 保留旧域名解析记录

---

# Part B：后期开发（详细可执行蓝图）

> 总体原则：先控成本与登录稳定，再支付闭环，再资产与后台，最后合规与增长。

## Phase 1：风控 + 额度（P0）

### 目标
- 控成本、防刷
- 为支付/资产打基础

### 详细策略
**身份识别**
- 登录用户：userId
- 匿名用户：IP（CF-Connecting-IP）

**限流策略**
- 60 秒窗口
- 匿名：8 次/60 秒
- 登录：30 次/60 秒
- 超限返回 429

**额度策略**
- 日额度按日期重置
- 匿名：10 次/天
- 登录：100 次/天
- 额度耗尽返回 402

### 数据结构（KV）
- `RATE_LIMIT:{scope}:{id}` -> { count, resetAt }
- `USAGE:{scope}:{id}:{date}` -> { used, day }

### 接口行为
- `/api/generate` 前置限流 + 额度检查

### 错误返回约定
```json
{ "error": "请求过于频繁，请稍后再试", "retry_after": 18 }
```
```json
{ "error": "今日额度已用完", "remaining": 0, "total": 100 }
```

### 监控指标
- 限流命中率
- 额度耗尽率
- `/api/generate` 成功率
- 高频 IP 分布

### 验收标准
- 高频请求返回 429
- 额度耗尽返回 402
- 正常用户不受影响
- 日额度自动重置

### 风险规避
- 限流阈值保守
- 先观测后拦截（可选）

---

## Phase 2：邮箱体系（验证码 + 密码）

### 目标
- 登录与找回真实可用

### 登录方案
- 默认邮箱验证码登录
- 保留密码登录兜底

### 邮件服务
- 推荐：Resend
- 正式上线需配置 SPF/DKIM/DMARC

### 数据结构（KV）
- `EMAIL_CODES:{email}` -> { code, expiresAt, attempts }
- `EMAIL_SEND_LOG:{email}` -> { lastSentAt }

### 接口清单
- `POST /api/auth/send-code`
- `POST /api/auth/verify-code`
- 现有 `/api/auth/login` 保留
- 现有 `/api/auth/forgot-password` 改为真实发送邮件

### 安全策略
- 验证码 5 分钟过期
- 60 秒内不可重复发送
- 错误 5 次锁 10 分钟

### 验收标准
- 可发码
- 可验证码登录
- 密码登录不受影响

### 风险规避
- 邮件失败需可追踪
- 验证码频控必须严格

---

## Phase 3：支付闭环（Creem + 额度包）

### 目标
- 付费 → 额度发放 → 用户可见

### 订单状态机
- `pending` / `paid` / `failed` / `expired` / `refunded`

### 数据结构（KV）
- `ORDERS:{orderId}` -> { userId, amount, credits, status, createdAt, paidAt }
- `PAYMENTS:{provider}:{id}` -> { status, rawPayload }

### 接口清单
- `POST /api/payment/create`
- `POST /api/payment/webhook`
- `GET /api/payment/status`

### 幂等策略
- 以 paymentId 为幂等键
- 重复回调不重复发放

### 验收标准
- 支付成功后额度增加
- 重复回调不会重复发放
- 支付失败订单可追踪

### 风险规避
- 必做验签
- 金额不可由前端传入（仅传套餐 ID）

---

## Phase 4：用户资产（R2 直接长期存储）

### 已确认策略
- 默认私有
- 分享链接有效期 7 天
- 免费用户 30 天
- 付费用户永久
- 访问域名：`assets.aistone.cfd`

### 数据结构
- `ASSETS:{assetId}` -> { userId, type, prompt, model, r2Key, createdAt, expiresAt, visibility }

### 接口清单
- `POST /api/assets/save`
- `GET /api/assets/list`
- `DELETE /api/assets/{id}`
- `POST /api/assets/{id}/share`

### 访问控制
- 默认私有
- 分享生成 7 天临时链接

### 验收标准
- 资产可保存到 R2
- 用户可查看历史
- 可删除资产
- 分享链接可访问

### 风险规避
- 免费 30 天自动清理
- 付费永久保存

---

## Phase 5：管理后台

### 目标
- 运营可控

### 功能范围
- 用户管理（封禁/解封/额度调整）
- 订单管理（查询/补发）
- 资产管理（下架/删除）
- 举报与反馈处理

### 接口清单
- `GET /api/admin/users`
- `POST /api/admin/users/ban`
- `POST /api/admin/users/credits`
- `GET /api/admin/orders`
- `POST /api/admin/orders/credit`
- `GET /api/admin/assets`
- `DELETE /api/admin/assets/{id}`
- `GET /api/admin/reports`
- `POST /api/admin/reports/resolve`

### 风险规避
- 后台接口必须强鉴权
- 操作留痕

---

## Phase 6：合规与增长

### 合规模块
- 关键词黑名单
- 举报入口
- 封禁联动

### 增长模块
- 分享落地页
- 模板库

### 数据结构
- `BLOCKLIST:*`
- `REPORTS:{id}`
- `TEMPLATES:{id}`

### 接口清单
- `POST /api/moderation/check`
- `POST /api/report`
- `GET /api/templates/list`

---

# 已确认关键决策（不可遗漏）
- 新域名：`aistone.cfd`
- 旧域名 301/308 保留 12 个月
- DNS：Cloudflare
- 注册商：Spaceship
- 登录：验证码 + 密码
- 支付：Creem（海外）
- 资产存储：直接 R2
- 分享链接：7 天
- 免费 30 天 / 付费永久
- 资产域名：`assets.aistone.cfd`

