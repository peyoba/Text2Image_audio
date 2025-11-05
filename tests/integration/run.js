#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:net';
import { setTimeout as delay } from 'node:timers/promises';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import process from 'node:process';

import { buildTestSuite } from './cases.js';

const WRANGLER_CMD = 'npx';
const WRANGLER_ARGS = ['wrangler', 'dev', '--local'];
const TEST_TIMEOUT_MS = 60_000;
const WORKER_VARS = {
  HEALTH_CHECK_TOKEN: process.env.HEALTH_CHECK_TOKEN || 'test-token',
  JWT_SECRET: process.env.JWT_SECRET || 'integration-secret',
  POLLINATIONS_IMAGE_API_BASE:
    process.env.POLLINATIONS_IMAGE_API_BASE || 'https://example.com/pollinations/image',
  POLLINATIONS_TEXT_API_BASE:
    process.env.POLLINATIONS_TEXT_API_BASE || 'https://example.com/pollinations/text',
  DEEPSEEK_API_URL: process.env.DEEPSEEK_API_URL || 'https://example.com/deepseek',
  DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY || 'integration-deepseek-key',
  FRONTEND_URL: process.env.FRONTEND_URL || 'https://example.com',
};

async function reservePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once('error', (err) => {
      server.close(() => reject(err));
    });
    server.listen(0, () => {
      const address = server.address();
      if (!address || typeof address !== 'object') {
        server.close(() => reject(new Error('无法获取端口')));
        return;
      }
      const port = address.port;
      server.close(() => resolve(port));
    });
  });
}

async function writeTempEnvFile() {
  const dir = await mkdtemp(path.join(tmpdir(), 'wrangler-test-'));
  const envFile = path.join(dir, '.dev.vars');
  const lines = Object.entries(WORKER_VARS).map(([key, value]) => `${key}=${JSON.stringify(value)}`);
  await writeFile(envFile, `${lines.join('\n')}\n`, 'utf8');
  return {
    envFile,
    cleanup: async () => {
      await rm(dir, { recursive: true, force: true });
    },
  };
}

function buildWranglerArgs(port, envFile) {
  return [...WRANGLER_ARGS, '--port', String(port), '--env-file', envFile, '--log-level', 'error'];
}

async function startWrangler(port, envFile) {
  const env = {
    ...process.env,
    WRANGLER_LOG_DISABLE_FILE: '1',
    HOME: process.cwd(),
  };
  const child = spawn(WRANGLER_CMD, buildWranglerArgs(port, envFile), {
    cwd: process.cwd(),
    env,
    stdio: 'pipe',
  });

  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');

  child.stdout.on('data', (chunk) => {
    process.stdout.write(`[wrangler] ${chunk}`);
  });
  child.stderr.on('data', (chunk) => {
    process.stderr.write(`[wrangler:err] ${chunk}`);
  });

  return child;
}

async function waitForWorkerReady(port, timeoutMs = 30_000) {
  const start = Date.now();
  const target = `http://127.0.0.1:${port}/internal/health?token=test-token`;
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(target);
      if (res.status === 200 || res.status === 401 || res.status === 503) {
        return true;
      }
    } catch (_) {
      // ignore and retry
    }
    await delay(500);
  }
  throw new Error('等待 Worker 启动超时');
}

async function runTestCases(port) {
  const base = `http://127.0.0.1:${port}`;
  const tests = buildTestSuite(base);
  const failures = [];

  for (const { name, fn } of tests) {
    try {
      await fn();
      console.log(`✔ ${name}`);
    } catch (err) {
      console.error(`✘ ${name}:`, err);
      failures.push({ name, err });
    }
  }

  if (failures.length) {
    const error = new Error(`Integration tests failed: ${failures.length}`);
    error.failures = failures;
    throw error;
  }
}

async function main() {
  const { envFile, cleanup } = await writeTempEnvFile();
  const port = await reservePort();
  const child = await startWrangler(port, envFile);

  const timeout = setTimeout(() => {
    console.error('测试超时，准备终止 wrangler');
    if (child.pid) child.kill('SIGINT');
  }, TEST_TIMEOUT_MS);

  try {
    await waitForWorkerReady(port);
    await runTestCases(port);
    clearTimeout(timeout);
    console.log('集成测试完成');
  } catch (err) {
    clearTimeout(timeout);
    console.error('集成测试失败:', err);
    process.exitCode = 1;
  } finally {
    if (child.pid) {
      child.kill('SIGINT');
      await once(child, 'exit').catch(() => {});
    }
    await cleanup().catch(() => {});
  }
}

main().catch((err) => {
  console.error('测试执行器异常:', err);
  process.exit(1);
});
