# 域名迁移 SOP 教程

> 本文档记录 `aistone.org` → `aistone.cfd` 的完整域名迁移操作流程。
> 执行日期：2026-03-14
> 适用场景：Cloudflare Pages + Cloudflare Workers 架构的域名迁移

---

## 前置条件

| 项目 | 状态 |
|------|------|
| 新域名已购买（Spaceship） | ✅ |
| 新域名 DNS 已接入 Cloudflare | ✅ |
| Cloudflare Pages 已绑定新域名 | ✅ |
| Workers API 自定义域名已配置 | ✅ |

---

## 第一步：配置 www 重定向（www.aistone.cfd → aistone.cfd）

### 1.1 确认 DNS 记录

在 Cloudflare Dashboard → `aistone.cfd` → **DNS → 记录** 中确认：

| 类型 | 名称 | 内容 | 代理状态 |
|------|------|------|----------|
| CNAME | `www` | Pages 项目地址 | 已代理（橙色云朵） |

> 如果没有 www 记录，添加一条 AAAA 记录：名称 `www`，内容 `100::`，开启代理。

### 1.2 创建重定向规则

1. Cloudflare Dashboard → `aistone.cfd` → **Rules → 重定向规则**
2. 点击 **「+ 创建规则」**
3. 使用模板 **「从 WWW 重定向到根」**
4. 模板会自动填写以下内容：

| 设置项 | 值 |
|--------|-----|
| 请求 URL | `https://www.*` |
| 目标 URL | `https://${1}` |
| 状态代码 | `301` |

5. 勾选 **「保留查询字符串」**
6. 点击 **「部署」**

> ⚠️ 如果弹出「此规则可能不适用于您的流量」警告，检查 www 的 DNS 记录是否已开启代理（橙色云朵）。如果已开启，可以直接跳过警告继续部署。

---

## 第二步：配置旧域名重定向（aistone.org → aistone.cfd）

### 2.1 确认旧域名 DNS

在 Cloudflare Dashboard → `aistone.org` → **DNS** 中确认域名仍在 Cloudflare 托管且有代理记录。

### 2.2 创建重定向规则

1. Cloudflare Dashboard → **切换到 `aistone.org` 站点**
2. 进入 **Rules → 重定向规则**
3. 点击 **「+ 创建规则」**
4. 选择模板 **「重定向到其他域」**，或手动配置：

**方式 A：使用自定义筛选表达式（推荐）**

| 设置项 | 值 |
|--------|-----|
| 规则名称 | `旧域名重定向到新域名` |
| 匹配条件 | **所有传入请求** |
| 类型 | **动态** |
| 表达式 | `concat("https://aistone.cfd", http.request.uri.path)` |
| 状态代码 | `301` |
| 保留查询字符串 | ✅ 勾选 |

> ⚠️ 注意：通配符模式 `https://aistone.org/*` 配合 `${1}` / `${2}` 可能会报 "Out of bounds replacement reference" 错误。建议直接使用「所有传入请求」+ 动态表达式方式，更可靠。

5. 点击 **「部署」**

---

## 第三步：批量替换代码中的旧域名引用

### 3.1 扫描所有引用

使用 ripgrep 扫描项目中所有 `aistone.org` 引用（排除 node_modules、.git、文档等）：

```bash
rg "aistone\.org" --glob '!{node_modules/**,package-lock.json,.git/**,notes/**,docs/**,*.md}' -n
```

### 3.2 需要替换的内容类型

| 类型 | 示例 | 涉及文件 |
|------|------|----------|
| canonical 链接 | `<link rel="canonical" href="https://aistone.org/...">` | 所有 HTML |
| OG/Twitter meta | `<meta property="og:url" content="https://aistone.org/...">` | 所有 HTML |
| 结构化数据 | `"url": "https://aistone.org/"` | index.html, about.html 等 |
| sitemap | `<loc>https://aistone.org/...</loc>` | sitemap.xml |
| robots.txt | `Sitemap: https://aistone.org/sitemap.xml` | robots.txt |
| RSS | `<link>https://aistone.org/...</link>` | rss.xml |
| 邮箱地址 | `support@aistone.org` | 多个 HTML + i18n.js |
| OAuth 回调 | `https://aistone.org/auth/google/callback` | functions/api/auth.js |
| API referrer | `"aistone.org"` | backend/services/generation.js |
| 后端默认 URL | `https://aistone.org` | backend/auth.js |
| i18n 翻译文本 | 各种包含域名的中英文文案 | i18n.js, i18n.js.backup |
| 前端 CORS | `"https://aistone.org"` | auth_modals.js |
| Footer 文案 | `aistone.org` | blog 页面 |

### 3.3 执行批量替换

```bash
sed -i '' 's/aistone\.org/aistone.cfd/g' \
  frontend/privacy.html \
  frontend/prompt-engineering.html \
  frontend/services.html \
  frontend/robots.txt \
  frontend/sitemap.xml \
  frontend/admin/tutorial.html \
  frontend/terms.html \
  frontend/user.html \
  frontend/blog_prompt_engineering.html \
  frontend/faq.html \
  frontend/image-generator.html \
  frontend/contact.html \
  frontend/blog_tutorial.html \
  frontend/ai-guide.html \
  frontend/blog_faq.html \
  frontend/voice.html \
  frontend/about.html \
  frontend/index.html \
  frontend/rss.xml \
  frontend/tutorial.html \
  frontend/blog.html \
  frontend/blog_ai_guide.html \
  frontend/js/i18n.js \
  frontend/js/auth_modals.js \
  frontend/js/i18n.js.backup \
  frontend/functions/api/auth.js \
  backend/services/generation.js \
  backend/auth.js
```

### 3.4 验证替换结果

```bash
# 确认没有遗漏
rg "aistone\.org" --glob '!{node_modules/**,package-lock.json,.git/**,notes/**,docs/**,*.md}'

# 确认新域名已生效
rg "aistone\.cfd" --glob '!{node_modules/**,package-lock.json,.git/**,notes/**,docs/**,*.md}' -l
```

本次替换结果：**28 个文件，130+ 处引用，0 处遗漏**。

---

## 第四步：提交代码并部署

### 4.1 提交代码

```bash
git add -A
git commit -m "feat: 域名迁移 aistone.org → aistone.cfd，批量更新所有引用"
git push origin main
```

> 推送后 Cloudflare Pages 会自动部署前端。

### 4.2 部署后端 Worker

```bash
# 方式一：已登录 wrangler
wrangler deploy

# 方式二：使用 API Token（非交互式环境）
CLOUDFLARE_API_TOKEN=你的token npx wrangler deploy
```

> 如果 `wrangler login` 遇到 bot 防护（403 错误），使用 API Token 方式：
> 1. 访问 https://dash.cloudflare.com/profile/api-tokens
> 2. 点击 Create Token → 使用「Edit Cloudflare Workers」模板
> 3. 创建后复制 Token，用上面方式二的命令部署

---

## 第五步：更新 Cloudflare Workers 环境变量

在 Cloudflare Dashboard → Workers → `text2image-api` → **Settings → Variables** 中更新：

| 变量名 | 值 |
|--------|-----|
| `FRONTEND_URL` | `https://aistone.cfd` |
| `ALLOWED_ORIGINS` | 添加 `https://aistone.cfd` |
| `GOOGLE_REDIRECT_URI` | `https://aistone.cfd/auth/google/callback` |

---

## 第六步：更新 Google OAuth 设置

1. 访问 https://console.cloud.google.com/apis/credentials
2. 点击 OAuth 2.0 Client IDs 下的 **「AISTONE Web Client」**
3. 添加以下配置（保留旧域名的配置不删除）：

**已获授权的 JavaScript 来源：**

| URI |
|-----|
| `https://aistone.org`（保留） |
| `https://aistone.cfd`（新增） |

**已获授权的重定向 URI：**

| URI |
|-----|
| `https://aistone.org/auth/google/callback`（保留） |
| `https://aistone.cfd/auth/google/callback`（新增） |

4. 点击 **「保存」**

> ⚠️ Google OAuth 设置可能需要 5 分钟到几小时生效。过渡期内保留旧域名的 URI 确保两个域名都能正常登录。

---

## 第七步：验证

### 7.1 重定向验证

```bash
# www 重定向
curl -I https://www.aistone.cfd
# 预期：301 → https://aistone.cfd

# 旧域名重定向
curl -I https://aistone.org
# 预期：301 → https://aistone.cfd

# 旧域名路径保留
curl -I https://aistone.org/about.html
# 预期：301 → https://aistone.cfd/about.html
```

### 7.2 功能验证清单

- [ ] `https://aistone.cfd` 主页正常加载
- [ ] `https://www.aistone.cfd` 正确 301 跳转
- [ ] `https://aistone.org` 正确 301 跳转
- [ ] 图片生成功能正常
- [ ] 语音生成功能正常
- [ ] Google OAuth 登录正常
- [ ] 中英文语言切换正常
- [ ] API 调用正常（检查浏览器 Network 面板）

---

## 第八步：SEO 迁移（后续）

1. **Google Search Console**
   - 添加 `aistone.cfd` 属性
   - 验证所有权
   - 提交站点迁移（Settings → Change of Address）
   - 提交新域名的 sitemap

2. **旧域名维护**
   - `aistone.org` 保持续费至少 **12 个月**
   - 301 重定向规则保持至少 **12 个月**
   - 期间搜索引擎会逐步将权重转移到新域名

---

## 回滚方案

如果迁移出现严重问题：

1. **DNS 回滚** — 将 `aistone.org` 的 Pages 绑定恢复，移除重定向规则
2. **代码回滚** — `git revert` 恢复域名替换的 commit
3. **Worker 回滚** — 重新部署旧版本代码
4. **OAuth 回滚** — Google Console 中的旧域名 URI 未删除，无需操作

---

## 本次迁移成果

| 项目 | 结果 |
|------|------|
| 重定向规则 | 2 条（www + 旧域名） |
| 代码文件修改 | 28 个文件 |
| 域名引用替换 | 130+ 处 |
| 遗漏引用 | 0 处 |
| 前端部署 | ✅ 自动部署 |
| 后端部署 | ✅ 手动部署 |
| Google OAuth | ✅ 新域名已添加 |
| 全站验证 | ✅ 正常访问 |
