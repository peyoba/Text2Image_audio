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
import { logInfo, logWarn, logError } from "../utils/logger.js";
import { recordMetric } from "../utils/metrics.js";

export function registerAuthRoutes(registerRoute) {
  registerRoute(
    createJsonRoute({
      method: "POST",
      path: "/api/auth/register",
      bodyMessage: "注册请求体必须为 JSON",
      async handler({ env, body }) {
        logInfo(env, `[Worker Log] 处理注册请求: ${body.email}`);
        const t0 = Date.now();
        const result = await handleUserRegistration(body, env);
        const dt = Date.now() - t0;
        recordMetric(env, "auth_register", { success: result.success, dt_ms: dt });
        if (!result.success) {
          logWarn(env, "[Auth] 注册失败", { email: body.email, error: result.error });
        }
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
        const t0 = Date.now();
        const result = await handleUserLogin(body, env);
        const dt = Date.now() - t0;
        recordMetric(env, "auth_login", { success: result.success, dt_ms: dt });
        if (!result.success) {
          logWarn(env, "[Auth] 登录失败", { email: body.email, error: result.error });
        }
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
      const t0 = Date.now();
      const result = await validateUserToken(token, env);
      const dt = Date.now() - t0;
      recordMetric(env, "auth_validate", { success: result.success, dt_ms: dt });
      if (!result.success) {
        logWarn(env, "[Auth] token 验证失败", { cause: result.cause, error: result.error });
      }
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
        const t0 = Date.now();
        const result = await handleForgotPassword(body, env);
        const dt = Date.now() - t0;
        recordMetric(env, "auth_forgot_password", { success: result.success, dt_ms: dt });
        if (!result.success) {
          logWarn(env, "[Auth] 忘记密码处理失败", { email: body.email, error: result.error });
        }
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
        const t0 = Date.now();
        const result = await handleResetPassword(body, env);
        const dt = Date.now() - t0;
        recordMetric(env, "auth_reset_password", { success: result.success, dt_ms: dt });
        if (!result.success) {
          logWarn(env, "[Auth] 密码重置失败", { error: result.error });
        }
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
        const t0 = Date.now();
        const result = await handleGoogleLogin(body, env);
        const dt = Date.now() - t0;
        recordMetric(env, "auth_login_google", { success: result.success, dt_ms: dt });
        if (!result.success) {
          logWarn(env, "[Auth] Google 登录失败", { error: result.error });
        }
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
        const t0 = Date.now();
        const result = await handleGoogleOAuth(body, env);
        const dt = Date.now() - t0;
        recordMetric(env, "auth_oauth_google", {
          success: result.success,
          dt_ms: dt,
          status: result.status,
          google_error: result.google_error,
        });
        if (!result.success) {
          logError(env, "[Auth] Google OAuth 失败", {
            error: result.error,
            status: result.status,
            google_error: result.google_error,
          });
        }
        return jsonResponse(result, env, result.success ? 200 : 401);
      },
    })
  );
}
