import { jsonFetch } from "./helpers.js";

export function buildTestSuite(baseUrl) {
  const tests = [];

  function add(name, fn) {
    tests.push({ name, fn });
  }

  add("Health requires auth", async () => {
    const res = await fetch(`${baseUrl}/internal/health`);
    if (res.status !== 401) {
      throw new Error(`expected 401, got ${res.status}`);
    }
  });

  add("Health with token", async () => {
    const res = await fetch(`${baseUrl}/internal/health?token=test-token`);
    if (![200, 503].includes(res.status)) {
      throw new Error(`unexpected status ${res.status}`);
    }
    const data = await res.json();
    if (!data || typeof data !== "object") {
      throw new Error("invalid health response");
    }
  });

  add("Auth register missing fields", async () => {
    const res = await jsonFetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      body: JSON.stringify({}),
    });
    if (res.status !== 400) {
      throw new Error(`expected 400, got ${res.status}`);
    }
  });

  add("Generate missing params", async () => {
    const res = await jsonFetch(`${baseUrl}/api/generate`, {
      method: "POST",
      body: JSON.stringify({}),
    });
    if (res.status !== 400) {
      throw new Error(`expected 400, got ${res.status}`);
    }
  });

  return tests;
}
