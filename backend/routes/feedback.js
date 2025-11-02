import { authenticateImageAccess } from "../image_cache.js";
import { createJsonRoute } from "../router.js";
import {
  handleFeedbackSubmission,
  getUserFeedbackList,
  getAllFeedbackForAdmin,
} from "../services/feedback.js";
import { jsonResponse } from "../utils/response.js";

export function registerFeedbackRoutes(registerRoute) {
  registerRoute(
    createJsonRoute({
      method: "POST",
      path: "/api/feedback",
      bodyMessage: "反馈请求体必须为 JSON",
      async handler({ request, env, body }) {
        const user = await authenticateImageAccess(request, env);
        if (!user) {
          return jsonResponse({ error: "需要登录" }, env, 401);
        }
        const result = await handleFeedbackSubmission(user, body, env);
        return jsonResponse(result, env, result.success ? 201 : 400);
      },
    })
  );

  registerRoute({
    method: "GET",
    path: "/api/feedback/my",
    async handler({ request, env }) {
      const user = await authenticateImageAccess(request, env);
      if (!user) {
        return jsonResponse({ error: "需要登录" }, env, 401);
      }
      const result = await getUserFeedbackList(user, env);
      return jsonResponse(result, env, result.success ? 200 : 400);
    },
  });

  registerRoute({
    method: "GET",
    path: "/api/admin/feedback",
    async handler({ env, url }) {
      const adminKey = url.searchParams.get("admin_key");
      if (adminKey !== env.ADMIN_KEY) {
        return jsonResponse({ error: "管理员权限验证失败" }, env, 403);
      }
      const result = await getAllFeedbackForAdmin(env);
      return jsonResponse(result, env, result.success ? 200 : 400);
    },
  });
}
