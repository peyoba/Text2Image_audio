# Text2Image_audio 测试计划（阶段 4 最小集）

> 原则：保持 KISS、YAGNI、SOLID、DRY——仅覆盖当前必须验证的能力，同时设计可在后续扩展时复用的结构。

## 1. 目标与范围

- **目标**：验证核心业务路径（认证、生成、翻译、反馈）在 Cloudflare Workers 环境中的稳定性与安全性，确保 PBKDF2 迁移及 OAuth 加固后无回归。
- **范围**：后台 Worker 接口与关键前端无状态页面；不包含 UI 视觉验证、第三方脚本统计等非核心功能。
- **排除项**：未来扩展（多租户、额外模型、批量导出等）暂不测试，避免违反 YAGNI。

## 2. 测试类型与策略

| 测试类型 | 目的 | 策略 | 工具/框架 |
| --- | --- | --- | --- |
| 单元测试 | 覆盖纯函数/逻辑，保障 PBKDF2、JWT、OAuth 配置解析、健康检查聚合等 | 重点挑选 SRP 明确的工具函数，使用 Node.js 原生 test runner + `node:test` | Node 20+ test runner |
| 集成测试 | 从外部视角调用 Worker 接口，校验路由、认证、KV 交互与外部 API 代理 | 通过 `wrangler dev` + supertest/fetch 发请求；对外部服务 stub | `wrangler dev --test-socket`, fetch | 
| 冒烟/端到端 | 部署后小规模验证主要 API | 触发 `/api/auth/register`、`/api/auth/login`、`/api/generate` (mock)、`/api/translate` 等 | `wrangler deploy` 后使用自定义脚本 |

## 3. 测试分层与用例矩阵

### 3.1 认证模块

- **PBKDF2 哈希**（单元）
  - `hashPasswordPBKDF2` 输出长度/格式校验
  - `verifyPasswordAgainstUser` 对 legacy 与新哈希均返回正确布尔值
  - `upgradeUserPassword` 迁移后属性更新、算法标记为 `pbkdf2`
- **JWT**（单元）
  - `generateJWT`/`verifyJWT` 正常流程、过期 token
- **Google OAuth 配置**（单元）
  - 缺失 client id/secret/redirect → 报错；redirect 与生产域不匹配给出 warning
- **认证路由**（集成）
  - 注册→登录→验证 token
  - 重复注册返回 409
  - 忘记密码流程（生成 token 并写入 RESET_TOKENS KV）

### 3.2 生成服务

- **Pollinations 代理**（集成）
  - 请求缺失 `text/type` 返回 400
  - image/audio 请求成功路径：对外部 API 使用 stub/mock，验证响应结构与 CORS 头
  - 错误时返回 500 并记录 metric（可通过 mock logger 检查）

### 3.3 翻译与提示词优化

- **DeepSeek 代理**（单元/集成）
  - 缺参数 400
  - 模拟 429/5xx 重试逻辑触发，确保 `fetchWithRetry` 按策略退避

### 3.4 反馈模块

- 需要登录才可访问 POST/GET `/api/feedback`（集成）
- 管理员端 `/api/admin/feedback` 必须校验 `admin_key`
- KV 写入异常时返回错误并记录 metric

### 3.5 可观测性

- `/internal/health` 在未提供 token 时返回 401
- 提供正确 token，返回 `status: ok` 且包含配置/KV 检查
- 缺失必需环境变量时 `status: degraded`

## 4. 环境与依赖

- Node.js 20+
- `wrangler` 3.x
- 测试使用本地 `.env.test`，覆盖：`JWT_SECRET`, `ADMIN_KEY`, `HEALTH_CHECK_TOKEN`, Pollinations/DeepSeek 伪造值
- KV 模拟：使用 `@miniflare/kv` 或 `wrangler dev --test-socket`
- 外部 API 通过 `undici` mock agent 或 Miniflare `fetchMock`

## 5. 自动化执行流程

1. **单元测试阶段**：`npm run test:unit`（待新增） → Node test runner + coverage 输出
2. **集成测试阶段**：
   - 启动 `wrangler dev --test-socket`（背景进程）
   - 使用脚本 `tests/integration/*.test.js` 发送请求
   - 测试结束后关闭 Worker
3. **CI 集成**（阶段 6 实施）：将以上命令纳入 GitHub Actions

## 6. 人工校验与回归清单

- Cloudflare Dashboard 检查：KV 命名空间绑定、环境变量配置
- 部署后实际访问：
  - `https://<worker>/internal/health?token=`
  - OAuth 登录是否成功
  - 服务首页、`services.html` 是否正常

## 7. 后续迭代留白

- 以后若引入新的模型/支付流程，应新建服务层接口并追加对应测试模块，借助 SRP/OCP 确保现有测试无需大改。
- 评估是否需要浏览器端 e2e（Playwright）——当前阶段保持 YAGNI。


