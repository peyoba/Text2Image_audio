import { authenticateImageAccess } from "../image_cache.js";
import { createJsonRoute } from "../router.js";
import {
  handleFeedbackSubmission,
  getUserFeedbackList,
  getAllFeedbackForAdmin,
} from "../services/feedback.js";
import { logWarn } from "../utils/logger.js";
import { recordMetric } from "../utils/metrics.js";
import { jsonResponse } from "../utils/response.js";

export function registerFeedbackRoutes(registerRoute) {
  registerRoute(
    createJsonRoute({
      method: "POST",
      path: "/api/feedback",
      bodyMessage: "反馈请求体必须为 JSON",
      async handler({ request, env, body }) {
        const t0 = Date.now();
        const user = await authenticateImageAccess(request, env);
        if (!user) {
          return jsonResponse({ error: "需要登录" }, env, 401);
        }
        const result = await handleFeedbackSubmission(user, body, env);
        const dt = Date.now() - t0;
        recordMetric(env, "feedback_submit", { success: result.success, dt_ms: dt });
        if (!result.success) {
          logWarn(env, "[Feedback] 提交失败", { userId: user.id, error: result.error });
        }
        return jsonResponse(result, env, result.success ? 201 : 400);
      },
    })
  );

  registerRoute({
    method: "GET",
    path: "/api/feedback/my",
    async handler({ request, env }) {
      const t0 = Date.now();
      const user = await authenticateImageAccess(request, env);
      if (!user) {
        return jsonResponse({ error: "需要登录" }, env, 401);
      }
      const result = await getUserFeedbackList(user, env);
      const dt = Date.now() - t0;
      recordMetric(env, "feedback_list_my", { success: result.success, dt_ms: dt });
      if (!result.success) {
        logWarn(env, "[Feedback] 获取个人反馈失败", { userId: user.id, error: result.error });
      }
      return jsonResponse(result, env, result.success ? 200 : 400);
    },
  });

  registerRoute({
    method: "GET",
    path: "/api/admin/feedback",
    async handler({ request, env, url }) {
      const authHeader = request.headers.get("Authorization") || "";
      const headerKey = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
      const adminKey = headerKey || url.searchParams.get("admin_key");
      if (!adminKey || adminKey !== env.ADMIN_KEY) {
        return jsonResponse({ error: "管理员权限验证失败" }, env, 403);
      }
      const page = parseInt(url.searchParams.get("page") || "1", 10);
      const pageSize = parseInt(url.searchParams.get("page_size") || "50", 10);
      const t0 = Date.now();
      const result = await getAllFeedbackForAdmin(env, { page, pageSize });
      const dt = Date.now() - t0;
      recordMetric(env, "feedback_admin_list", { success: result.success, dt_ms: dt });
      if (!result.success) {
        logWarn(env, "[Feedback] 管理员获取反馈失败", { error: result.error });
      }
      return jsonResponse(result, env, result.success ? 200 : 400);
    },
  });
}
