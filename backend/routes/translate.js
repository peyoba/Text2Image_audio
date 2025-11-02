import { createJsonRoute, jsonResponse } from "../router.js";
import { optimizePromptWithDeepseek, translateNegativePrompt } from "../services/translate.js";
import { logInfo } from "../utils/logger.js";

export function registerTranslateRoutes(registerRoute) {
  registerRoute(
    createJsonRoute({
      method: "POST",
      path: "/api/translate",
      bodyMessage: "翻译请求体必须为 JSON",
      async handler({ env, body }) {
        const text = body.text;
        if (!text) {
          return jsonResponse({ error: "缺少必要的参数: text" }, env, 400);
        }

        try {
          logInfo(env, `[Worker Log] Processing translation request`);
          const translated = await translateNegativePrompt(text, env);
          return jsonResponse(translated, env, translated.translated ? 200 : 400);
        } catch (error) {
          console.error(`[Worker Error] 翻译服务调用失败: ${error.message}`);
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
          return jsonResponse({ error: "缺少必要的参数: text" }, env, 400);
        }

        try {
          const optimized = await optimizePromptWithDeepseek(prompt, env);
          return jsonResponse(optimized, env, optimized.error ? 500 : 200);
        } catch (error) {
          console.error(`[Worker Error] 提示词优化失败: ${error.message}`);
          return jsonResponse({ error: error.message }, env, 500);
        }
      },
    })
  );
}
