import { logInfo } from "./logger.js";

export async function fetchWithRetry(
  url,
  options,
  apiName,
  env,
  maxRetries = 8,
  initialDelay = 1500
) {
  const envMax = parseInt(env.RETRY_MAX_ATTEMPTS || env.FETCH_RETRY_MAX || "", 10);
  if (!Number.isNaN(envMax) && envMax >= 0) {
    maxRetries = envMax;
  }
  const envDelay = parseInt(
    env.RETRY_INITIAL_DELAY_MS || env.FETCH_RETRY_INITIAL_DELAY_MS || "",
    10
  );
  if (!Number.isNaN(envDelay) && envDelay >= 0) {
    initialDelay = envDelay;
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        logInfo(env, `[Worker Log] 成功从 ${apiName} 获取响应 (尝试 ${attempt}/${maxRetries}).`);
        return response;
      }

      if (response.status === 429 && attempt < maxRetries) {
        const jitter = Math.floor(Math.random() * 1000);
        const delay = initialDelay * Math.pow(2, attempt - 1) + jitter;
        const errorContent = await response.text().catch(() => "无法读取错误内容");
        logInfo(
          env,
          `[Worker Warning] ${apiName} 返回 429 (Too Many Requests). 尝试 #${attempt} of ${maxRetries}. 在 ${delay}ms 后重试... 错误: ${errorContent}`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      const errorContent = await response
        .text()
        .catch(() => `Status ${response.status} with no readable body`);
      const err = new Error(`${apiName}调用失败 (HTTP ${response.status}): ${errorContent}`);
      err.status = response.status;
      throw err;
    } catch (error) {
      console.error(
        `[Worker Error] 调用 ${apiName} 时发生错误 (尝试 #${attempt}/${maxRetries}): ${error.message}`
      );

      if (attempt < maxRetries) {
        const jitter = Math.floor(Math.random() * 1000);
        const delay = initialDelay * Math.pow(2, attempt - 1) + jitter;
        logInfo(env, `[Worker Warning] 请求失败，将在 ${delay}ms 后重试...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        console.error(`[Worker Error] 所有 ${maxRetries} 次尝试均失败。`);
        throw error;
      }
    }
  }

  throw new Error(`${apiName} 在 ${maxRetries} 次重试后仍然失败。`);
}
