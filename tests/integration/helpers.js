export function requireEnv(key, fallback) {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Missing required env ${key}`);
  }
  return value;
}

export function jsonFetch(url, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  return fetch(url, { ...options, headers });
}
