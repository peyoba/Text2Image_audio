import {
  handleUserRegistration,
  handleUserLogin,
  validateUserToken,
  extractTokenFromRequest,
  handleForgotPassword,
  handleResetPassword,
  handleGoogleLogin,
  handleGoogleOAuth,
} from "../auth.js";
import { createJsonRoute, jsonResponse } from "../router.js";
import { logInfo } from "../utils/logger.js";

export function registerAuthRoutes(registerRoute) {
  registerRoute(
    createJsonRoute({
      method: "POST",
      path: "/api/auth/register",
      bodyMessage: "注册请求体必须为 JSON",
      async handler({ env, body }) {
        logInfo(env, `[Worker Log] 处理注册请求: ${body.email}`);
        const result = await handleUserRegistration(body, env);
        return jsonResponse(result, env, result.success ? 201 : 400);
      },
    })
  );

  registerRoute(
    createJsonRoute({
      method: "POST",
      path: "/api/auth/login",
      bodyMessage: "登录请求体必须为 JSON",
      async handler({ env, body }) {
        logInfo(env, `[Worker Log] 处理登录请求: ${body.email}`);
        const result = await handleUserLogin(body, env);
        return jsonResponse(result, env, result.success ? 200 : 401);
      },
    })
  );

  registerRoute({
    method: "GET",
    path: "/api/auth/validate",
    async handler({ request, env }) {
      const token = extractTokenFromRequest(request);
      logInfo(env, `[Worker Log] 验证用户 Token`);
      const result = await validateUserToken(token, env);
      return jsonResponse(result, env, result.success ? 200 : 401);
    },
  });

  registerRoute(
    createJsonRoute({
      method: "POST",
      path: "/api/auth/forgot-password",
      bodyMessage: "忘记密码请求体必须为 JSON",
      async handler({ env, body }) {
        logInfo(env, `[Worker Log] 处理忘记密码请求: ${body.email}`);
        const result = await handleForgotPassword(body, env);
        return jsonResponse(result, env, result.success ? 200 : 400);
      },
    })
  );

  registerRoute(
    createJsonRoute({
      method: "POST",
      path: "/api/auth/reset-password",
      bodyMessage: "重置密码请求体必须为 JSON",
      async handler({ env, body }) {
        logInfo(env, `[Worker Log] 处理密码重置请求`);
        const result = await handleResetPassword(body, env);
        return jsonResponse(result, env, result.success ? 200 : 400);
      },
    })
  );

  registerRoute(
    createJsonRoute({
      method: "POST",
      path: "/api/auth/google-login",
      bodyMessage: "Google 登录请求体必须为 JSON",
      async handler({ env, body }) {
        logInfo(env, `[Worker Log] 处理 Google 登录请求`);
        const result = await handleGoogleLogin(body, env);
        return jsonResponse(result, env, result.success ? 200 : 401);
      },
    })
  );

  registerRoute(
    createJsonRoute({
      method: "POST",
      path: "/api/auth/google-oauth",
      bodyMessage: "Google OAuth 请求体必须为 JSON",
      async handler({ env, body }) {
        logInfo(env, `[Worker Log] 处理 Google OAuth 请求`);
        const result = await handleGoogleOAuth(body, env);
        return jsonResponse(result, env, result.success ? 200 : 401);
      },
    })
  );
}
