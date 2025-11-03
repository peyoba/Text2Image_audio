import { logInfo } from "../utils/logger.js";

const REQUIRED_ENV_VARS = [
  "JWT_SECRET",
  "POLLINATIONS_IMAGE_API_BASE",
  "POLLINATIONS_TEXT_API_BASE",
  "DEEPSEEK_API_URL",
  "DEEPSEEK_API_KEY",
];

function normalizeStatus(statuses) {
  if (statuses.includes("error")) return "error";
  if (statuses.includes("degraded")) return "degraded";
  return "ok";
}

async function runKvCheck(env) {
  const result = {
    name: "kv.users",
    status: "ok",
    details: {},
  };

  try {
    if (!env?.USERS) {
      result.status = "degraded";
      result.details.reason = "USERS KV namespace 未绑定";
      return result;
    }

    const probeKey = `__health__:users:${Date.now()}`;
    await env.USERS.put(probeKey, "ok", { expirationTtl: 60 });
    const stored = await env.USERS.get(probeKey);
    if (stored !== "ok") {
      result.status = "degraded";
      result.details.reason = "写入后读取结果不一致";
    }
    await env.USERS.delete(probeKey).catch(() => {});
  } catch (error) {
    result.status = "error";
    result.details.reason = error.message || String(error);
  }

  return result;
}

function runConfigCheck(env) {
  const missing = [];
  for (const key of REQUIRED_ENV_VARS) {
    const raw = env?.[key];
    if (raw === undefined || raw === null || String(raw).trim() === "") {
      missing.push(key);
    }
  }

  return {
    name: "config.required_env",
    status: missing.length ? "degraded" : "ok",
    details: { missing },
  };
}

export async function runHealthChecks(env) {
  const checks = [];

  checks.push(runConfigCheck(env));
  checks.push(await runKvCheck(env));

  const aggregateStatus = normalizeStatus(checks.map((check) => check.status));
  const summary = {
    status: aggregateStatus,
    timestamp: new Date().toISOString(),
    checks,
  };

  if (aggregateStatus !== "ok") {
    logInfo(env, "[Health] 运行状况非正常:", JSON.stringify(summary));
  }

  return summary;
}
