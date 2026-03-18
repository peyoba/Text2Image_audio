/**
 * 风控与额度限制中间件 (Rate Limiting & Quotas)
 */
import { authenticateUser } from "../auth.js";

import { logWarn, logError } from "./logger.js";

/**
 * 检查请求频率与今日额度
 * @param {Request} request
 * @param {Object} env
 * @returns {Promise<Object>} { allowed: boolean, error?: string, status?: number, headers?: Object, retryAfter?: number, remaining?: number, total?: number }
 */
export async function checkRateLimitAndQuota(request, env) {
  try {
    // 1. 尝试获取登录态
    const user = await authenticateUser(request, env);
    const isAnonymous = !user;

    // 2. 身份识别标识（优先 User ID，否则 fallback 到 IP）
    const ip =
      request.headers.get("CF-Connecting-IP") ||
      request.headers.get("X-Forwarded-For") ||
      "anonymous";
    const identifier = user ? user.id : ip;
    const scope = user ? "user" : "anon";

    // 3. 读取配置（允许配置或回退默认）
    const rateLimitMax = isAnonymous ? 8 : 30; // 每分钟最大请求数
    const quotaMax = isAnonymous ? 10 : 100; // 每天最大请求数

    // 日期键：格式 'YYYY-MM-DD' 取 UTC
    const dateStr = new Date().toISOString().split("T")[0];

    const rateLimitKey = `RATE_LIMIT:${scope}:${identifier}`;
    const usageKey = `USAGE:${scope}:${identifier}:${dateStr}`;

    // 并发读取 KV 降低延迟 (如果 env.USERS 不存在，可能报错，注意兜底)
    const kv = env.USERS;
    if (!kv) {
      logError(env, "[RateLimit] USERS KV 绑定缺失，跳过检查");
      return { allowed: true };
    }

    const [rlStateData, usageStateData] = await Promise.all([
      kv.get(rateLimitKey, "json"),
      kv.get(usageKey, "json"),
    ]);

    // ---- 检查限流 (60秒窗口) ----
    const nowStamp = Date.now();
    let rlState = rlStateData || { count: 0, resetAt: nowStamp + 60000 };

    // 如果过期已经重置，则清零 (KV 的过期是 lazy 的，所以增加应用层检查)
    if (nowStamp > rlState.resetAt) {
      rlState = { count: 0, resetAt: nowStamp + 60000 };
    }

    if (rlState.count >= rateLimitMax) {
      logWarn(env, `[RateLimit] 请求速率超限: ${scope}=${identifier}`, {
        count: rlState.count,
        limit: rateLimitMax,
      });
      const waitSeconds = Math.max(1, Math.ceil((rlState.resetAt - nowStamp) / 1000));
      return {
        allowed: false,
        status: 429,
        error: "请求过于频繁，请稍后再试",
        retryAfter: waitSeconds,
      };
    }

    // ---- 检查日额度 ----
    const usageState = usageStateData || { used: 0, day: dateStr };

    if (usageState.used >= quotaMax) {
      logWarn(env, `[RateLimit] 每日额度耗尽: ${scope}=${identifier}`, {
        used: usageState.used,
        total: quotaMax,
      });
      return {
        allowed: false,
        status: 402,
        error: "今日额度已用完",
        remaining: 0,
        total: quotaMax,
      };
    }

    // ---- 更新状态并在后台保存 (乐观执行以减少响应延迟) ----
    rlState.count += 1;
    usageState.used += 1;

    // KV 写入：频率键 60s 过期，额度键 24小时(86400秒)过期
    // 因为路由可能没有透传 ctx，为了确保写入，使用 await 阻塞保存
    await Promise.all([
      kv.put(rateLimitKey, JSON.stringify(rlState), { expirationTtl: 60 }),
      kv.put(usageKey, JSON.stringify(usageState), { expirationTtl: 86400 }),
    ]).catch((err) => logError(env, "[RateLimit] 保存状态失败", err));

    // 返回允许并携带当前剩余配额信息可以放在 headers
    return {
      allowed: true,
      remaining: quotaMax - usageState.used,
      total: quotaMax,
    };
  } catch (err) {
    logError(env, "[RateLimit] 风控系统异常", err);
    // 为保证系统高可用，风控系统报错直接放行
    return { allowed: true };
  }
}
