const routes = [];

export class HttpError extends Error {
  constructor(status, message, body) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.body = body;
  }
}

export { jsonResponse, makeCorsResponse } from "./utils/response.js";

export function registerRoute(route) {
  if (!route || !route.method || !route.path || typeof route.handler !== "function") {
    throw new Error("Invalid route definition");
  }
  const normalized = {
    ...route,
    method: route.method.toUpperCase(),
  };
  routes.push(normalized);
}

export function registerRoutes(routeList = []) {
  for (const route of routeList) {
    registerRoute(route);
  }
}

export function getRoutes() {
  return [...routes];
}

export async function readJsonBody(request, errorMessage = "请求体必须是合法 JSON") {
  try {
    return await request.json();
  } catch (error) {
    throw new HttpError(400, errorMessage || "JSON 解析失败");
  }
}

export function createJsonRoute({ method, path, bodyMessage, handler }) {
  if (!method || !path || typeof handler !== "function") {
    throw new Error("createJsonRoute 需要有效的 method、path 和 handler");
  }
  return {
    method,
    path,
    async handler(context) {
      const body = await readJsonBody(context.request, bodyMessage);
      return handler({ ...context, body });
    },
  };
}

export function matchRoute(method, path) {
  const normalizedMethod = method.toUpperCase();
  for (const route of routes) {
    if (route.method !== normalizedMethod) {
      continue;
    }

    if (typeof route.path === "string") {
      if (route.path === path) {
        return { route, params: {} };
      }
      continue;
    }

    if (route.path instanceof RegExp) {
      const match = route.path.exec(path);
      if (match) {
        const params = route.getParams
          ? route.getParams(match)
          : match.groups
            ? match.groups
            : match.slice(1);
        return { route, params };
      }
      continue;
    }

    if (typeof route.match === "function") {
      const result = route.match(path);
      if (result) {
        const params = typeof result === "object" ? result.params || {} : {};
        return { route, params };
      }
    }
  }
  return null;
}

export function clearRoutes() {
  routes.length = 0;
}
