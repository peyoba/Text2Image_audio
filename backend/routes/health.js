import { jsonResponse } from "../router.js";
import { runHealthChecks } from "../services/health.js";

function authorizeHealthRequest(request, env) {
  const expectedToken = String(env?.HEALTH_CHECK_TOKEN || "").trim();
  if (!expectedToken) {
    return { authorized: true };
  }

  const authHeader = request.headers.get("Authorization") || "";
  if (authHeader.startsWith("Bearer ") && authHeader.slice(7).trim() === expectedToken) {
    return { authorized: true };
  }

  const url = new URL(request.url);
  if (url.searchParams.get("token") === expectedToken) {
    return { authorized: true };
  }

  return { authorized: false };
}

export function registerHealthRoutes(registerRoute) {
  registerRoute({
    method: "GET",
    path: "/internal/health",
    async handler({ request, env }) {
      const authResult = authorizeHealthRequest(request, env);
      if (!authResult.authorized) {
        return jsonResponse({ status: "unauthorized" }, env, 401, {}, request);
      }

      const summary = await runHealthChecks(env);
      const statusCode = summary.status === "ok" ? 200 : 503;
      return jsonResponse(summary, env, statusCode, {}, request);
    },
  });
}
