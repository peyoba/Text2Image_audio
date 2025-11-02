const LEVEL_PRIORITY = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

function resolveLogLevel(env) {
  const raw = String(env?.LOG_LEVEL || "info").toLowerCase();
  return LEVEL_PRIORITY[raw] !== undefined ? raw : "info";
}

function canLog(env, level) {
  const configured = resolveLogLevel(env);
  return LEVEL_PRIORITY[level] <= LEVEL_PRIORITY[configured];
}

export function logDebug(env, ...args) {
  if (canLog(env, "debug")) {
    console.log(...args);
  }
}

export function logInfo(env, ...args) {
  if (canLog(env, "info")) {
    console.log(...args);
  }
}

export function logWarn(env, ...args) {
  if (canLog(env, "warn")) {
    console.warn(...args);
  }
}

export function logError(env, ...args) {
  if (canLog(env, "error")) {
    console.error(...args);
  }
}
