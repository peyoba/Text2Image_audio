#!/usr/bin/env node

import process from 'node:process';
import { setTimeout as delay } from 'node:timers/promises';

function parseArgs(argv) {
  const options = {
    url: process.env.HEALTH_CHECK_URL || '',
    token: process.env.HEALTH_CHECK_TOKEN || '',
    retries: parseInt(process.env.HEALTH_CHECK_RETRIES || '1', 10) || 1,
    interval: parseInt(process.env.HEALTH_CHECK_INTERVAL_MS || '2000', 10) || 2000,
    verbose: false,
  };

  const args = [...argv];
  while (args.length) {
    const arg = args.shift();
    if (!arg) continue;
    if (arg === '--help') {
      options.help = true;
      break;
    }
    if (arg === '--url') {
      options.url = args.shift() || '';
    } else if (arg === '--token') {
      options.token = args.shift() || '';
    } else if (arg === '--retries') {
      options.retries = parseInt(args.shift() || '1', 10) || 1;
    } else if (arg === '--interval') {
      options.interval = parseInt(args.shift() || '2000', 10) || 2000;
    } else if (arg === '--verbose' || arg === '-v') {
      options.verbose = true;
    } else {
      // positional fallback (url token)
      if (!options.url) {
        options.url = arg;
      } else if (!options.token) {
        options.token = arg;
      }
    }
  }
  return options;
}

function printUsage() {
  console.log(`用法: node scripts/health-check.mjs [--url <worker_url>] [--token <token>] [选项]

选项:
  --url <worker_url>          目标 Worker 基地址 (默认读取 HEALTH_CHECK_URL)
  --token <token>             健康检查令牌 (默认读取 HEALTH_CHECK_TOKEN)
  --retries <n>               重试次数，默认 1
  --interval <ms>             重试间隔毫秒数，默认 2000
  -v, --verbose               输出完整 JSON
  --help                      显示此帮助

示例:
  node scripts/health-check.mjs --url https://worker.workers.dev --token mytoken --retries 3
`);
}

async function probeOnce(url, token) {
  const target = new URL('/internal/health', url);
  if (token) {
    target.searchParams.set('token', token);
  }
  const res = await fetch(target, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  let bodyText = '';
  let data = null;
  try {
    bodyText = await res.text();
    data = bodyText ? JSON.parse(bodyText) : null;
  } catch (err) {
    data = null;
  }
  return { status: res.status, data, bodyText };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printUsage();
    return;
  }
  if (!options.url) {
    console.error('缺少目标 URL，请使用 --url 或设置 HEALTH_CHECK_URL');
    process.exit(1);
  }
  const retries = Math.max(1, options.retries);

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const result = await probeOnce(options.url, options.token);
      const { status, data, bodyText } = result;
      const statusLabel = status === 200 ? 'OK' : status === 503 ? 'DEGRADED' : 'ERROR';
      console.log(`Attempt ${attempt}/${retries}: status=${status} (${statusLabel})`);
      if (data) {
        console.log(`  summary: ${data.status}`);
        if (options.verbose) {
          console.log(JSON.stringify(data, null, 2));
        } else if (Array.isArray(data.checks)) {
          for (const check of data.checks) {
            console.log(`  - ${check.name}: ${check.status}`);
          }
        }
      } else if (bodyText) {
        console.log(`  body: ${bodyText}`);
      }
      if (status === 200) {
        return;
      }
      if (attempt < retries) {
        await delay(options.interval);
      }
    } catch (err) {
      console.error(`Attempt ${attempt}/${retries} 失败:`, err);
      if (attempt < retries) {
        await delay(options.interval);
      }
    }
  }
  process.exit(1);
}

main().catch((err) => {
  console.error('健康检查脚本错误:', err);
  process.exit(1);
});
