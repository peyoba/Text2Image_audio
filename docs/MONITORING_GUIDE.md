# 监控与告警方案（Text2Image_audio）

## 目标
- 可见性：关键服务链路（DeepSeek、Pollinations、Workers、Pages）有可观测指标
- 低侵入：以日志与现有平台能力为主，不引入重型依赖
- 零风险：默认关闭，通过开关灰度开启，随时可回退

## 指标（建议）
- 后端（Workers）
  - 请求量/错误率：按接口分类（/api/generate、/api/optimize、/api/translate、/api/images/*）
  - 外部依赖失败率：DeepSeek、Pollinations 各自的 HTTP 状态分布、429/5xx 次数
  - 重试情况：`fetchWithRetry` 成功/失败次数、最终失败的 API 名称
  - 时延分位：P50/P95/P99（按接口）
- 前端（可选）
  - 语音/图片生成成功率（前端视角）
  - 轮询量（HD stats）

## 采集与平台
- Cloudflare Workers Analytics
  - 使用 `console.log`/`console.error` 打点，结合 Workers Analytics 观察错误与流量
- Cloudflare Pages Analytics（前端）
  - 仅统计访问量与资源加载情况；不采集个人数据

## 打点与日志规范（后端）
- 等级与前缀：`[Worker Log]`（info级别，仅当 LOG_LEVEL=debug）与 `[Worker Error]`（错误）
- 脱敏：Authorization/Cookie 已 [REDACTED]
- 建议扩展字段（逐步灰度）：
  - `api=DeepSeek|Pollinations`、`op=optimize|image|audio`、`status=HTTP_CODE`、`attempt=n/N`
  - 样例：`[Worker Error] api=Pollinations op=image status=502 attempt=3/8 msg="Bad Gateway"`

## 开关与配置（默认关闭）
- 环境变量（Workers）
  - `LOG_LEVEL=debug`：开启详细日志（仅灰度环境）
  - `RETRY_MAX_ATTEMPTS`/`FETCH_RETRY_MAX`：重试最大次数（默认8）
  - `RETRY_INITIAL_DELAY_MS`/`FETCH_RETRY_INITIAL_DELAY_MS`：初始回退延迟（默认1500）
  - `JWT_ALLOW_LEGACY`：旧制式JWT兼容（默认true，逐步迁移可设为false）
- 前端运行时
  - `window.HD_STATS_POLL_INTERVAL_MS` 或 localStorage `hd_stats_poll_ms`（默认3600000；0关闭）

## 阈值与告警建议（轻量）
- 短期内错误率 > 5%（按接口）→ 升级日志级别到 debug 并采样
- Pollinations 429/5xx 持续 5 分钟 → 降低并发/延长重试间隔
- DeepSeek 失败率 > 10% → 暂时跳过优化，使用原始提示词（需开关）

## 回滚与应急
- 每项改动独立提交，可单独回滚
- 开关化策略：发现异常立即关闭开关或恢复默认值
- 重大故障：将 LOG_LEVEL=debug 开启 30 分钟收敛排障后恢复

## 路线图（可选）
- 引入轻量埋点上报（如 Workers Analytics Engine 或 RUM）
- 指标看板：错误率、状态码分布、耗时分布、重试次数趋势
- 异常检测：简单阈值 → 百分位基线 → 自适应
