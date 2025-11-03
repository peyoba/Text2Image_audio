/**
 * 后端入口（Cloudflare Workers）
 * 统一路由分发、CORS/安全头、认证与图片接口、中间件与指标日志。此编辑仅为文档头说明，无行为改动。
 */
// backend/index.js

import { registerRoute, matchRoute, HttpError, jsonResponse, makeCorsResponse } from "./router.js";
import { registerAuthRoutes } from "./routes/auth.js";
import { registerFeedbackRoutes } from "./routes/feedback.js";
import { registerGenerationRoutes } from "./routes/generation.js";
import { registerHealthRoutes } from "./routes/health.js";
import { registerTranslateRoutes } from "./routes/translate.js";
import { logInfo } from "./utils/logger.js";

let routesRegistered = false;

function registerAllRoutes() {
  registerAuthRoutes(registerRoute);
  registerGenerationRoutes(registerRoute);
  registerFeedbackRoutes(registerRoute);
  registerTranslateRoutes(registerRoute);
  registerHealthRoutes(registerRoute);
}

function ensureRoutesRegistered() {
  if (!routesRegistered) {
    registerAllRoutes();
    routesRegistered = true;
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Log all request headers for debugging
    logInfo(env, `[Worker Log] Received request: ${method} ${path}`);
    let headersLog = "[Worker Log] Request Headers: ";
    for (const pair of request.headers.entries()) {
      const k = pair[0];
      let v = pair[1];
      if (["authorization", "cookie", "set-cookie"].includes(k.toLowerCase())) {
        v = "[REDACTED]";
      }
      headersLog += `\n  ${k}: ${v}`;
    }
    logInfo(env, headersLog);

    if (method === "OPTIONS") {
      logInfo(
        env,
        "[Worker Log] Matched OPTIONS method. Request Origin:",
        request.headers.get("Origin")
      );
      logInfo(
        env,
        "[Worker Log] Access-Control-Request-Method:",
        request.headers.get("Access-Control-Request-Method")
      );
      logInfo(
        env,
        "[Worker Log] Access-Control-Request-Headers:",
        request.headers.get("Access-Control-Request-Headers")
      );
      logInfo(env, "[Worker Log] Calling makeCorsResponse for OPTIONS request.");
      return makeCorsResponse(request, env); // 预检请求按白名单/回退处理
    }

    try {
      ensureRoutesRegistered();
      const match = matchRoute(method, path);
      if (!match) {
        return jsonResponse({ error: "Not Found", path }, env, 404);
      }

      const { route, params } = match;
      const context = { request, env, ctx, params, url, method, path };
      return await route.handler(context);
    } catch (e) {
      if (e instanceof HttpError) {
        const status = typeof e.status === "number" ? e.status : 400;
        const body =
          e.body && typeof e.body === "object" ? e.body : { error: e.message || "请求处理失败" };
        return jsonResponse(body, env, status);
      }
      console.error(`[Worker Error] An unexpected error occurred in fetch: ${e.message}`);
      console.error(e.stack);
      if (e.status === 429 || e.status === 502) {
        return jsonResponse(
          {
            error: "AI服务繁忙，已为您排队重试多次但仍未成功，请稍后再试。",
            details: e.message,
          },
          env,
          503
        );
      }
      return jsonResponse({ error: "服务器内部错误", details: e.message }, env, 500);
    }
  },
};
