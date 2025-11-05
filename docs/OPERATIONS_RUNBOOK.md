# 运维运行手册（Text2Image_audio）

> 目标：提供最小可行的部署、验证、回滚与排障指南，确保在 Cloudflare Workers 与 Pages 环境下稳定运行。所有步骤遵循 **KISS / YAGNI / SOLID / DRY** 原则，只保留必要动作。

## 1. 系统概览

- **后端**：Cloudflare Worker，入口 `backend/index.js`，通过路由模块化分发请求。
- **存储**：Cloudflare KV（USERS/IMAGES_CACHE/RESET_TOKENS/FEEDBACK）。
- **前端**：Cloudflare Pages，仓库 `Text2Image_audio` 自动部署。
- **外部依赖**：Pollinations（图像/音频）、DeepSeek（提示词优化）、Google OAuth。

## 2. 角色与权限

| 场景             | 所需权限                     |
| ---------------- | ---------------------------- |
| 代码推送         | GitHub `Text2Image_audio` 写入 |
| Worker 部署      | Cloudflare API Token（Workers KV 写/读、Worker 编辑、Pages 读取） |
| KV 巡检 / 日志   | Cloudflare Dashboard 访问权   |

## 3. 环境变量速查

> 所有变量在 Cloudflare Worker 仪表盘或 `wrangler secret` 中维护。CI 运行需要在 GitHub Secrets 同步。

| 变量                      | 作用 / 备注                                                 |
| ------------------------- | ------------------------------------------------------------ |
| `JWT_SECRET`              | JWT 签名密钥                                                |
| `POLLINATIONS_IMAGE_API_BASE` | Pollinations 图像 API 基地址                              |
| `POLLINATIONS_TEXT_API_BASE`  | Pollinations 音频/文本 API 基地址                         |
| `DEEPSEEK_API_URL`        | DeepSeek API URL                                            |
| `DEEPSEEK_API_KEY`        | DeepSeek 授权密钥                                           |
| `GOOGLE_CLIENT_ID`        | Google OAuth Client ID                                      |
| `GOOGLE_CLIENT_SECRET`    | Google OAuth Client Secret                                  |
| `GOOGLE_REDIRECT_URI`     | OAuth 回调地址（未配置时自动根据 `FRONTEND_URL` 推导）      |
| `FRONTEND_URL`            | 前端站点根地址                                              |
| `HEALTH_CHECK_TOKEN`      | `/internal/health` 访问令牌                                 |
| `LOG_LEVEL`（可选）       | 日志级别，`error`/`info`/`debug`，默认 `error`              |
| `METRICS_ENABLED`（可选） | 指标采样开关，默认关闭                                       |

## 4. 部署流水（Cloudflare Worker）

1. **拉取最新代码**
   ```powershell
   git pull origin main
   npm install
   ```

2. **本地校验**（保持 DRY，使用统一脚本）
   ```powershell
   npm run lint
   npm run test:unit
   npm run test:integration
   ```

3. **配置 Cloudflare API Token**
   ```powershell
   $env:CLOUDFLARE_API_TOKEN = "<your_token>"
   ```

4. **部署**
   ```powershell
   wrangler deploy
   ```

> 若需灰度，可使用 `wrangler deploy --env staging` 并在 `wrangler.toml` 中配置对应 section。

## 5. 发布后验证

1. **健康检查**
   ```powershell
   npm run health:check -- --url https://<worker-url> --token <HEALTH_CHECK_TOKEN>
   ```
   - 200：全部正常
   - 503：部分 degraded，查看输出 JSON 中的 `checks[]`

2. **核心 API 探活**（示例）
   ```powershell
   curl -X POST https://<worker-url>/api/generate -H "Content-Type: application/json" -d '{"text":"test","type":"image"}'
   ```
   - 期待 200 / Base64 响应或 4xx 参数错误（验证鉴权/校验逻辑）

3. **日志巡检**：Cloudflare Dashboard → Workers → `text2image-api` → Logs，过滤 `[Worker Error]`、`[METRIC]`。

## 6. 回滚策略

- **代码层**：使用 `git revert <commit>` 生成回滚提交，重新 `wrangler deploy`。
- **配置层**：还原 Cloudflare 环境变量旧值；所有关键变量变更需在变更记录中留档。
- **紧急开关**：
  - `METRICS_ENABLED=false` 关闭指标
  - `LOG_LEVEL=error` 降低日志量
  - 必要时将 Worker 指向前一版本（Cloudflare → Workers → Deployments → Rollback）。

## 7. 常见故障处理

| 现象 | 排查步骤 |
| ---- | -------- |
| `401` → `集成测试 Health requires auth` | 确保 `HEALTH_CHECK_TOKEN` 在部署环境中配置，或测试脚本注入临时令牌。|
| `wrangler deploy` 报 Token 缺失 | 检查终端 `CLOUDFLARE_API_TOKEN` 是否设置，或使用 `wrangler login`。|
| Pollinations 429 / 超时 | 调整 `FETCH_RETRY_MAX` / `FETCH_RETRY_INITIAL_DELAY_MS`，并关注监控日志。|
| DeepSeek 401 | 检查 `DEEPSEEK_API_KEY` 是否过期、被重置。|
| PBKDF2 密码登录失败 | 确认旧账号已自动升级，更换密码或检查 KV 写入权限。|

## 8. 监控与告警

- 参考 `docs/MONITORING_GUIDE.md` 获取日志、指标与告警建议。
- `scripts/health-check.mjs` 支持定时巡检，可结合 `cron`/GitHub Actions 运行。

## 9. CI/CD 集成

- GitHub Actions Workflow：`.github/workflows/ci.yml`
  - **流程**：`npm ci` → `npm run lint` → `npm run test:unit` → `npm run test:integration`
  - **Secrets**：需同步 Worker 环境变量，避免测试因缺配置失败。
- 推送到 `main` 自动触发，失败需在 CI 修复后再部署。

## 10. 变更留痕

- 每次部署后记录：部署人、Git 提交、部署时间、对应的 Cloudflare Deployment ID。
- 若涉及秘钥更新，请同步更新到 GitHub Secrets 与线下备份。避免在代码库明文暴露。

> 本运行手册可与 `docs/QA_TEST_PLAN.md`、`docs/CI_GUIDE.md` 共同使用，覆盖「测试 → 部署 → 监控 → 回滚」全链路，减少重复沟通与失误。


