import { logInfo } from "./logger.js";

export function parseAllowedOrigins(env) {
  try {
    const raw = String(env.ALLOWED_ORIGINS || "").trim();
    if (!raw) return [];
    return raw
      .split(/[\s,]+/)
      .map((o) => o.trim())
      .filter(Boolean);
  } catch (_) {
    return [];
  }
}

export function computeAllowedOrigin(request, env) {
  const list = parseAllowedOrigins(env);
  if (!list.length) return "*";
  const strict = String(env.CORS_STRICT || "false").toLowerCase() === "true";
  const origin =
    (request && (request.headers.get("Origin") || request.headers.get("origin"))) || "";
  if (origin && list.includes(origin)) {
    logInfo(env, `[CORS] 命中白名单 Origin=${origin}`);
    return origin;
  }
  return strict ? "null" : "*";
}
