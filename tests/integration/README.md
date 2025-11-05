# 集成测试说明

- `run.js`：启动 wrangler dev --test-socket 并运行测试用例
- `cases.js`：按 add(name, fn) 形式维护测试列表
- `helpers.js`：通用 fetch/环境变量工具

执行方式：
```bash
npm run test:integration
```
