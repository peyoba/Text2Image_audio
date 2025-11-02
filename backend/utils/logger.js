export function logInfo(env, ...args) {
  if ((env?.LOG_LEVEL || "info").toLowerCase() === "debug") {
    console.log(...args);
  }
}
