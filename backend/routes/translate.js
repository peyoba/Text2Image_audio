import { createJsonRoute, jsonResponse } from "../router.js";
import { optimizePromptWithDeepseek, translateNegativePrompt } from "../services/translate.js";
import { logInfo, logWarn, logError } from "../utils/logger.js";
import { recordMetric } from "../utils/metrics.js";

export function registerTranslateRoutes(registerRoute) {
  registerRoute(
    createJsonRoute({
      method: "POST",
      path: "/api/translate",
      bodyMessage: "翻译请求体必须为 JSON",
      async handler({ env, body }) {
        const text = body.text;
        if (!text) {
          logWarn(env, "[Translate] 缺少 text 参数");
          return jsonResponse({ error: "缺少必要的参数: text" }, env, 400);
        }

        const t0 = Date.now();
        try {
          logInfo(env, `[Worker Log] Processing translation request`);
          const translated = await translateNegativePrompt(text, env);
          const dt = Date.now() - t0;
          recordMetric(env, "translate_negative", {
            success: translated.translated,
            dt_ms: dt,
          });
          if (!translated.translated) {
            logWarn(env, "[Translate] 翻译失败", { textSnippet: text.slice(0, 30) });
          }
          return jsonResponse(translated, env, translated.translated ? 200 : 400);
        } catch (error) {
          const dt = Date.now() - t0;
          recordMetric(env, "translate_negative", {
            success: false,
            dt_ms: dt,
            error: error.message,
          });
          logError(env, `[Worker Error] 翻译服务调用失败: ${error.message}`);
          return jsonResponse({ error: error.message }, env, 500);
        }
      },
    })
  );

  registerRoute(
    createJsonRoute({
      method: "POST",
      path: "/api/prompts/optimize",
      bodyMessage: "提示词优化请求体必须为 JSON",
      async handler({ env, body }) {
        const prompt = body.text;
        if (!prompt) {
          logWarn(env, "[Prompts] 缺少 text 参数");
          return jsonResponse({ error: "缺少必要的参数: text" }, env, 400);
        }

        const t0 = Date.now();
        try {
          const optimized = await optimizePromptWithDeepseek(prompt, env);
          const success = !optimized.error;
          const dt = Date.now() - t0;
          recordMetric(env, "prompt_optimize", {
            success,
            dt_ms: dt,
          });
          if (!success) {
            logWarn(env, "[Prompts] 优化失败", { reason: optimized.error });
          }
          return jsonResponse(optimized, env, success ? 200 : 500);
        } catch (error) {
          const dt = Date.now() - t0;
          recordMetric(env, "prompt_optimize", {
            success: false,
            dt_ms: dt,
            error: error.message,
          });
          logError(env, `[Worker Error] 提示词优化失败: ${error.message}`);
          return jsonResponse({ error: error.message }, env, 500);
        }
      },
    })
  );
}
