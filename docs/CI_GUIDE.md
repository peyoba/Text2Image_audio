# 持续集成指南

本项目使用 GitHub Actions (`.github/workflows/ci.yml`) 在 `main` 分支的 push / PR 触发以下流程：

1. **安装依赖**：`npm ci`
2. **静态检查**：`npm run lint`
3. **单元测试**：`npm run test:unit`
4. **集成测试**：`npm run test:integration`（启动 `wrangler dev --test-socket` 验证核心接口的关键路径）

## 环境变量

Workflow 默认注入以下值，确保测试能够在 CI 环境下运行而不依赖真实外部服务：

- `JWT_SECRET`: `test-secret`
- `HEALTH_CHECK_TOKEN`: `test-token`
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`: Dummy 值，用于通过配置校验
- `FRONTEND_URL`: `https://example.com`
- `PBKDF2_ITERATIONS` / `PBKDF2_KEYLEN` / `PBKDF2_DIGEST`: 单元测试覆盖 PBKDF2 兼容场景

如需扩展测试或执行部署，可在 workflow 中追加步骤或密钥。

## 本地模拟

开发者可通过以下命令模拟 CI 行为：

```bash
npm ci
npm run lint
PBKDF2_ITERATIONS=120000 PBKDF2_KEYLEN=64 PBKDF2_DIGEST=sha512 npm run test:unit
JWT_SECRET=test-secret HEALTH_CHECK_TOKEN=test-token npm run test:integration
```

保持流程简洁（KISS），仅校验当前必需路径（YAGNI）。如需新增检查，请通过独立脚本实现并在本地验证后，再纳入 workflow。
