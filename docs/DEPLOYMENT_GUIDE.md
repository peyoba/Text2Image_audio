# 部署指南

## 概述

本文档详细介绍Text2Image_audio项目的完整部署流程，包括开发环境搭建、生产环境部署、配置管理等。

## 技术架构

### 前端
- **技术栈**: HTML5 + CSS3 + 原生JavaScript
- **部署平台**: Cloudflare Pages（推荐）或静态服务器
- **域名**: https://aistone.org（生产环境）

### 后端
- **技术栈**: JavaScript (ES Modules)
- **部署平台**: Cloudflare Workers
- **API地址**: https://text2image-api.peyoba660703.workers.dev

## 部署前准备

### 1. 环境要求

#### 开发环境
- Node.js 16+ 
- npm 或 yarn
- Git
- 文本编辑器（推荐VS Code）

#### 云服务账号
- Cloudflare账号（免费版即可）
- Google Cloud Console账号（用于OAuth）
- DeepSeek API账号（用于AI优化功能）

### 2. 获取必要的API密钥

#### DeepSeek API
1. 访问 https://api.siliconflow.cn/
2. 注册账号并获取API Key
3. 记录API密钥，稍后在环境变量中配置

#### Google OAuth 2.0
1. 访问 https://console.cloud.google.com/
2. 创建新项目或选择现有项目
3. 启用Google+ API
4. 创建OAuth 2.0客户端ID
5. 配置授权域名和回调URL

## 本地开发环境搭建

### 1. 克隆项目

```bash
# 克隆仓库
git clone https://github.com/peyoba/Text2Image_audio.git
cd Text2Image_audio

# 安装依赖
npm install
```

### 2. 配置环境变量

创建 `wrangler.toml` 文件（如果不存在）：

```toml
name = "text2image-api"
main = "backend/index.js"
compatibility_date = "2024-05-01"

# KV Namespace 绑定 (用于存储用户数据)
[[kv_namespaces]]
binding = "USERS"
id = "your_users_kv_id"

# KV Namespace 绑定 (用于存储图片缓存)
[[kv_namespaces]]
binding = "IMAGES_CACHE"
id = "your_images_cache_kv_id"

[env.production.vars]
# API配置
POLLINATIONS_IMAGE_API_BASE = "https://image.pollinations.ai"
POLLINATIONS_TEXT_API_BASE = "https://text.pollinations.ai"
DEEPSEEK_API_KEY = "your-deepseek-api-key"
DEEPSEEK_API_URL = "https://api.siliconflow.cn/v1/chat/completions"
DEEPSEEK_MODEL = "deepseek-ai/DeepSeek-V2.5"

# 音频配置
DEFAULT_AUDIO_MODEL = "openai-audio"
DEFAULT_AUDIO_VOICE = "nova"

# 认证配置
JWT_SECRET = "your-super-secret-jwt-key-change-this-in-production"
GOOGLE_CLIENT_SECRET = "your-google-client-secret"

# 日志配置
LOG_LEVEL = "info"
```

### 3. 启动本地开发

#### 后端开发
```bash
# 启动Cloudflare Workers本地开发
npx wrangler dev

# 或者在后台运行
npx wrangler dev --port 8787
```

#### 前端开发
```bash
# 进入前端目录
cd frontend

# 启动HTTP服务器
python -m http.server 8000

# 或使用Node.js
npx http-server -p 8000

# 或使用Live Server（VS Code插件）
```

### 4. 验证本地环境

访问以下地址验证环境：
- 前端: http://localhost:8000
- 后端API: http://localhost:8787（或wrangler显示的地址）

测试API端点：
```bash
# 测试生成接口
curl -X POST http://localhost:8787/api/generate \
  -H "Content-Type: application/json" \
  -d '{"text": "test", "type": "image"}'
```

## 生产环境部署

### 1. Cloudflare Workers 后端部署

#### 1.1 创建KV Namespace

```bash
# 创建用户数据存储
npx wrangler kv:namespace create "USERS"

# 创建图片缓存存储
npx wrangler kv:namespace create "IMAGES_CACHE"
```

记录返回的namespace ID，更新到 `wrangler.toml` 中。

#### 1.2 设置环境变量

在Cloudflare Dashboard中设置secret变量：

```bash
# 设置API密钥
npx wrangler secret put DEEPSEEK_API_KEY
npx wrangler secret put JWT_SECRET
npx wrangler secret put GOOGLE_CLIENT_SECRET
```

#### 1.3 部署Worker

```bash
# 部署到生产环境
npx wrangler deploy

# 查看部署状态
npx wrangler status
```

#### 1.4 验证部署

```bash
# 测试生产API
curl -X POST https://your-worker.workers.dev/api/generate \
  -H "Content-Type: application/json" \
  -d '{"text": "一只可爱的小猫", "type": "image"}'
```

### 2. Cloudflare Pages 前端部署

#### 2.1 GitHub集成部署（推荐）

1. 登录Cloudflare Dashboard
2. 进入 "Pages" 选项
3. 点击 "Create a project"
4. 选择 "Connect to Git"
5. 选择GitHub仓库 `Text2Image_audio`
6. 配置构建设置：
   - **Framework preset**: None
   - **Build command**: （留空）
   - **Build output directory**: `frontend`
   - **Root directory**: `/`

#### 2.2 环境变量配置

在Pages设置中配置环境变量：
- `NODE_VERSION`: `18`
- `API_BASE_URL`: `https://your-worker.workers.dev`

#### 2.3 自定义域名

1. 在Pages项目设置中选择 "Custom domains"
2. 添加域名 `aistone.org`
3. 配置DNS记录（CNAME指向Cloudflare）

### 3. 域名和SSL配置

#### 3.1 DNS配置

在域名注册商处设置NS记录指向Cloudflare：
```
ns1.cloudflare.com
ns2.cloudflare.com
```

#### 3.2 SSL证书

Cloudflare自动提供免费SSL证书，确保以下设置：
- SSL/TLS模式: "Full (strict)"
- 自动HTTPS重写: 启用
- Always Use HTTPS: 启用

## 配置管理

### 1. 环境变量说明

| 变量名 | 必需 | 说明 | 示例值 |
|--------|------|------|--------|
| `DEEPSEEK_API_KEY` | 是 | DeepSeek API密钥 | `sk-xxxxx` |
| `JWT_SECRET` | 是 | JWT加密密钥 | `your-secret-key` |
| `GOOGLE_CLIENT_SECRET` | 否 | Google OAuth密钥 | `xxx-xxx` |
| `LOG_LEVEL` | 否 | 日志级别 | `info` |
| `DEFAULT_AUDIO_VOICE` | 否 | 默认语音音色 | `nova` |

### 2. KV存储配置

| Binding名 | 用途 | 数据类型 |
|-----------|------|----------|
| `USERS` | 用户数据存储 | JSON |
| `IMAGES_CACHE` | 图片缓存存储 | Base64 |

### 3. CORS配置

确保Worker中的CORS设置允许前端域名：

```javascript
const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://aistone.org',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
};
```

## 监控和维护

### 1. 日志查看

#### Worker日志
```bash
# 实时查看Worker日志
npx wrangler tail

# 查看特定时间段的日志
npx wrangler tail --format=pretty
```

#### Pages部署日志
在Cloudflare Dashboard的Pages项目中查看部署历史和日志。

### 2. 性能监控

#### 关键指标
- API响应时间
- 错误率
- 用户活跃度
- 资源使用量

#### Cloudflare Analytics
在Dashboard中查看：
- Workers Analytics
- Pages Analytics
- Security insights

### 3. 备份策略

#### KV数据备份
```bash
# 备份用户数据
npx wrangler kv:key list --binding=USERS > users_backup.json

# 备份图片缓存
npx wrangler kv:key list --binding=IMAGES_CACHE > images_backup.json
```

#### 代码备份
- GitHub自动备份
- 定期创建release版本
- 重要更新前创建分支

## 故障排除

### 1. 常见问题

#### 部署失败
```bash
# 检查wrangler配置
npx wrangler whoami
npx wrangler dev --compatibility-date=2024-05-01

# 清除缓存重新部署
npx wrangler deploy --compatibility-date=2024-05-01
```

#### API调用失败
1. 检查环境变量配置
2. 验证KV Namespace绑定
3. 查看Worker日志排查错误
4. 测试外部API连通性

#### 前端资源加载失败
1. 检查Pages部署状态
2. 验证构建输出目录
3. 确认CORS配置
4. 清除浏览器缓存

### 2. 调试技巧

#### 启用调试模式
```toml
[env.development.vars]
LOG_LEVEL = "debug"
```

#### 本地测试生产配置
```bash
# 使用生产环境变量进行本地测试
npx wrangler dev --env production
```

### 3. 回滚策略

#### Worker回滚
```bash
# 查看部署历史
npx wrangler deployments list

# 回滚到指定版本
npx wrangler rollback [deployment-id]
```

#### Pages回滚
在Cloudflare Dashboard的Pages项目中选择历史部署进行回滚。

## 成本控制

### 1. Cloudflare免费额度

#### Workers
- 100,000 请求/天
- 10ms CPU时间/请求
- 128MB 内存

#### Pages
- 500 构建/月
- 20,000 文件
- 无限流量

#### KV存储
- 100,000 读取操作/天
- 1,000 写入操作/天
- 1GB 存储空间

### 2. 使用优化

- 启用缓存减少API调用
- 压缩资源减少存储
- 监控使用量避免超额

## 安全考虑

### 1. API安全

- 使用HTTPS加密传输
- 设置请求频率限制
- 验证输入参数
- 记录安全日志

### 2. 数据保护

- 敏感数据加密存储
- 用户数据访问控制
- 定期安全审计
- 遵守GDPR等法规

### 3. 访问控制

- JWT token认证
- 会话超时设置
- IP白名单（如需要）
- API密钥轮换

---

**部署完成后，确保所有功能正常工作，定期监控系统状态和性能指标。**
