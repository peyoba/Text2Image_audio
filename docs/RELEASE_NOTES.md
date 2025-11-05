# 发布说明（Refactor & Observability Milestone）

## 概览

- **版本范围**：2025-08 ~ 2025-11 重构里程碑
- **部署目标**：Cloudflare Worker `text2image-api`、Cloudflare Pages 前端
- **重点改动**：模块化路由、PBKDF2 鉴权、可观测性提升、SEO 调整、CI/CD 与测试体系

## 主要更新

### 后端与安全
- `backend/index.js` 重构为注册式路由体系，业务逻辑下沉至 `routes/`、`services/`、`utils/`。
- 密码哈希由 SHA256 改为 PBKDF2，旧用户登录自动升级哈希。
- Google OAuth：配置校验增强，客户端/密钥/回调需明确定义，token 交换与 audience 验证提供详细日志。
- JWT 采用标准 HS256，响应封装统一使用 `jsonResponse` + 安全头。

### 可观测性
- `fetchWithRetry` 支持指数退避及环境变量调节；日志脱敏处理授权信息。
- 新增 `logInfo/logWarn/logError`、`recordMetric`，对生成、翻译、反馈等接口埋点。
- `/internal/health` 增强：检测环境变量缺失、KV 读写能力，可选 token 保护。
- `scripts/health-check.mjs` 提供 CLI 健康巡检；`docs/MONITORING_GUIDE.md` 详述指标与开关。

### SEO 与前端
- `frontend/robots.txt` 拦截 `cdn-cgi` 目录抓取。
- `frontend/admin/tutorial.html` 加入静态重定向与 `noindex`。
- 导航新增 `Services` 链接，避免孤岛页面。

### 测试与 CI/CD
- 单元测试（`tests/unit/auth.test.js`）覆盖 PBKDF2、OAuth 配置等关键逻辑。
- 集成测试运行器（`tests/integration/run.js`）自动注入环境变量并验证健康检查与参数校验。
- GitHub Actions Workflow `.github/workflows/ci.yml`：`npm ci → lint → test:unit → test:integration`。
- 文档补充 `docs/QA_TEST_PLAN.md`、`docs/CI_GUIDE.md`、`docs/OPERATIONS_RUNBOOK.md`。

## 验证与回归

部署前建议执行：

```powershell
npm run lint
npm run test:unit
npm run test:integration
```

部署后执行：

```powershell
npm run health:check -- --url https://text2image-api.<域名>.workers.dev --token <HEALTH_CHECK_TOKEN>
```

## 注意事项

- 确保 Cloudflare Worker 环境变量完整；缺失会导致 `/internal/health` 返回 503。
- PBKDF2 升级后，旧哈希将在首次登录时更新；建议备份 KV 数据并监控登录报错。
- 集成测试在 CI 中需同步配置外部 API 的 mock/占位值，避免访问真实服务。
- Cloudflare API Token 需具备 `Workers KV Storage` 与 `Workers Scripts` 权限。

## 关联文档

- `docs/RETROSPECTIVE.md`
- `docs/OPERATIONS_RUNBOOK.md`
- `docs/MONITORING_GUIDE.md`
- `docs/QA_TEST_PLAN.md`
- `docs/CI_GUIDE.md`


