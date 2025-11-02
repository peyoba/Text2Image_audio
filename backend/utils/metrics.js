import { logInfo } from "./logger.js";

function metricsEnabled(env) {
  try {
    return String(env.METRICS_ENABLED || "false").toLowerCase() === "true";
  } catch (_) {
    return false;
  }
}

function shouldSample(env) {
  try {
    const rate = parseFloat(env.METRICS_SAMPLE_RATE || "0");
    if (isNaN(rate) || rate <= 0) return false;
    const clamped = Math.max(0, Math.min(1, rate));
    return Math.random() < clamped;
  } catch (_) {
    return false;
  }
}

export function recordMetric(env, name, data) {
  try {
    if (!metricsEnabled(env)) return;
    if (!shouldSample(env)) return;
    const payload = { name, ts: Date.now(), ...data };
    logInfo(env, "[METRIC]", JSON.stringify(payload));
  } catch (_) {}
}
