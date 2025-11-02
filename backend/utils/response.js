import { computeAllowedOrigin } from "./cors.js";
import { logInfo } from "./logger.js";

export function addCorsHeaders(responseHeaders, env, request) {
  logInfo(env, "[Worker Log] addCorsHeaders called.");
  const allowOrigin = computeAllowedOrigin(request, env);
  responseHeaders.set("Access-Control-Allow-Origin", allowOrigin);
  responseHeaders.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  responseHeaders.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );

  let headersLog = "[Worker Log] addCorsHeaders added headers: ";
  for (const pair of responseHeaders.entries()) {
    headersLog += `\n  ${pair[0]}: ${pair[1]}`;
  }
  logInfo(env, headersLog);
}

export function addSecurityHeaders(responseHeaders, env) {
  responseHeaders.set("Vary", "Origin");
  responseHeaders.set("X-Content-Type-Options", "nosniff");
  responseHeaders.set("Referrer-Policy", "no-referrer-when-downgrade");
  responseHeaders.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  );

  let headersLog = "[Worker Log] addSecurityHeaders added headers: ";
  for (const pair of responseHeaders.entries()) {
    headersLog += `\n  ${pair[0]}: ${pair[1]}`;
  }
  logInfo(env, headersLog);
}

export function jsonResponse(body, env, status = 200, additionalHeaders = {}, request) {
  const headers = new Headers({
    "Content-Type": "application/json",
    ...additionalHeaders,
  });
  addCorsHeaders(headers, env, request);
  addSecurityHeaders(headers, env);

  const payload = body === undefined ? "null" : JSON.stringify(body);
  let finalHeadersLog = "[Worker Log] jsonResponse final headers:";
  for (const pair of headers.entries()) {
    finalHeadersLog += `\n  ${pair[0]}: ${pair[1]}`;
  }
  logInfo(env, finalHeadersLog);

  return new Response(payload, { status, headers });
}

export function makeCorsResponse(request, env) {
  logInfo(env, "[Worker Log] makeCorsResponse called.");
  const allowOrigin = computeAllowedOrigin(request, env);
  const headers = new Headers({
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
    "Access-Control-Max-Age": "86400",
  });

  if (request?.method === "OPTIONS") {
    const requestHeaders = request.headers.get("Access-Control-Request-Headers");
    if (requestHeaders) {
      headers.set("Access-Control-Allow-Headers", requestHeaders);
      logInfo(
        env,
        `[Worker Log] makeCorsResponse: Echoing Access-Control-Request-Headers: ${requestHeaders}`
      );
    }
  }

  addSecurityHeaders(headers, env);

  let headersLog = "[Worker Log] makeCorsResponse returning headers:";
  for (const pair of headers.entries()) {
    headersLog += `\n  ${pair[0]}: ${pair[1]}`;
  }
  logInfo(env, headersLog);

  return new Response(null, {
    status: 204,
    headers,
  });
}
