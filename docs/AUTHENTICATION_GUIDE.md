# 用户认证系统完整指南

## 概述

本文档介绍Text2Image_audio项目的用户认证系统，包括部署指南、OAuth配置、问题解决方案等。

## 功能特性

- ✅ 用户注册和登录
- ✅ JWT token认证
- ✅ 密码加密存储
- ✅ 邮箱格式验证
- ✅ 密码强度验证
- ✅ 响应式UI设计
- ✅ 本地存储token管理
- ✅ Google OAuth 2.0集成

## 部署指南

### 1. 前端集成

#### 1.1 引入认证模块

在您的主HTML文件中添加以下代码：

```html
<!-- 在head部分引入认证模块 -->
<script src="js/auth.js"></script>

<!-- 在body部分引入认证模态框 -->
<div id="authContainer"></div>
<script>
    // 动态加载认证模态框
    fetch('auth-modals.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('authContainer').innerHTML = html;
        });
</script>
```

#### 1.2 在导航栏添加登录按钮

在您的导航栏中添加认证按钮：

```html
<div class="nav-auth">
    <!-- 认证按钮区域 -->
    <div class="auth-buttons">
        <button class="btn btn-primary" onclick="showModal('loginModal')">登录</button>
        <button class="btn btn-outline" onclick="showModal('registerModal')">注册</button>
    </div>
    
    <!-- 用户信息显示区域 -->
    <div class="user-info" style="display: none;">
        <div class="user-avatar">
            <img src="assets/default-avatar.svg" alt="用户头像" id="userAvatar">
        </div>
        <div class="user-details">
            <span class="username">用户名</span>
            <div class="user-actions">
                <button class="btn btn-small" onclick="showUserProfile()">个人中心</button>
                <button class="btn btn-small btn-outline" onclick="authManager.logout()">登出</button>
            </div>
        </div>
    </div>
</div>
```

### 2. 后端配置

#### 2.1 创建KV Namespace

在Cloudflare Dashboard中创建KV Namespace：

1. 登录Cloudflare Dashboard
2. 进入Workers & Pages
3. 选择您的Worker
4. 点击"Settings" → "Variables"
5. 在"KV Namespace Bindings"部分点击"Add binding"
6. 创建新的KV Namespace：
   - **Variable name**: `USERS`
   - **KV namespace**: 创建新的namespace
   - **Namespace name**: `users-storage`

#### 2.2 更新环境变量

在Cloudflare Dashboard中设置以下环境变量：

```bash
# 必需的环境变量
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Google OAuth配置
GOOGLE_CLIENT_SECRET=你的客户端密钥

# 可选的环境变量
LOG_LEVEL=info
```

#### 2.3 更新wrangler.toml

将KV Namespace ID添加到`wrangler.toml`：

```toml
[[kv_namespaces]]
binding = "USERS"
id = "your_actual_kv_namespace_id" # 替换为实际的ID
```

## Google OAuth 2.0 配置

### 问题描述
当前遇到的错误：
```
错误 401: invalid_client
The OAuth client was not found.
```

### 解决方案

#### 1. Google Cloud Console 配置

1. **访问 Google Cloud Console**
   - 前往 https://console.cloud.google.com/
   - 选择或创建项目

2. **启用 Google+ API**
   - 在左侧菜单选择 "APIs & Services" > "Library"
   - 搜索 "Google+ API" 或 "People API"
   - 点击启用

3. **创建 OAuth 2.0 客户端 ID**
   - 在左侧菜单选择 "APIs & Services" > "Credentials"
   - 点击 "Create Credentials" > "OAuth client ID"
   - 应用类型选择 "Web application"
   - 名称填写：AISTONE Web Client

4. **配置授权域名**
   - **授权的 JavaScript 来源**：
     ```
     https://aistone.org
     http://localhost:3000  (开发环境)
     ```
   
   - **授权的重定向 URI**：
     ```
     https://aistone.org/auth/google/callback
     http://localhost:3000/auth/google/callback  (开发环境)
     ```

#### 2. 获取新的客户端 ID

配置完成后，你会得到：
- **Client ID**: `xxx-xxx.apps.googleusercontent.com`
- **Client Secret**: `xxx-xxx` (需要设置到后端环境变量)

#### 3. 更新代码

需要将新的 Client ID 更新到以下位置：
- `frontend/js/auth_modals.js` 第260行
- `backend/auth.js` 第758行

#### 4. 当前使用的配置

**当前 Client ID**: `894036062262-8h0btc9vnrp4tj9v1gm8ljvj6b6d2m7i.apps.googleusercontent.com`

如果这个 Client ID 是正确的，请检查：
1. 是否在 Google Cloud Console 中添加了正确的回调URL
2. 是否启用了必要的 API
3. OAuth 同意屏幕是否正确配置

## API文档

### 用户注册

**POST** `/api/auth/register`

**请求体：**
```json
{
  "username": "用户名",
  "email": "邮箱地址",
  "password": "密码"
}
```

**响应：**
```json
{
  "success": true,
  "message": "注册成功",
  "token": "JWT_TOKEN",
  "user": {
    "id": "用户ID",
    "username": "用户名",
    "email": "邮箱",
    "createdAt": "创建时间"
  }
}
```

### 用户登录

**POST** `/api/auth/login`

**请求体：**
```json
{
  "email": "邮箱地址",
  "password": "密码"
}
```

**响应：**
```json
{
  "success": true,
  "message": "登录成功",
  "token": "JWT_TOKEN",
  "user": {
    "id": "用户ID",
    "username": "用户名",
    "email": "邮箱",
    "createdAt": "创建时间",
    "lastLoginAt": "最后登录时间"
  }
}
```

### Token验证

**GET** `/api/auth/validate`

**请求头：**
```
Authorization: Bearer JWT_TOKEN
```

**响应：**
```json
{
  "success": true,
  "user": {
    "id": "用户ID",
    "username": "用户名",
    "email": "邮箱",
    "createdAt": "创建时间",
    "lastLoginAt": "最后登录时间"
  }
}
```

## 部署步骤

### 1. 本地测试

```bash
# 安装依赖
npm install

# 本地开发
npx wrangler dev

# 部署到Cloudflare
npx wrangler deploy
```

### 2. 验证部署

测试以下API端点：

```bash
# 用户注册
curl -X POST https://your-worker.your-subdomain.workers.dev/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"Test123!"}'

# 用户登录
curl -X POST https://your-worker.your-subdomain.workers.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# Token验证
curl -X GET https://your-worker.your-subdomain.workers.dev/api/auth/validate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 安全考虑

### 1. JWT Secret

- 使用强随机字符串作为JWT_SECRET
- 在生产环境中定期轮换密钥
- 不要在代码中硬编码密钥

### 2. 密码安全

- 密码使用SHA256+盐值哈希
- 强制密码复杂度要求
- 考虑添加密码重置功能

### 3. 数据保护

- 用户敏感信息不返回给前端
- 使用HTTPS传输
- 考虑添加速率限制

## 故障排除

### 常见问题

1. **KV Namespace绑定失败**
   - 检查namespace ID是否正确
   - 确认Worker有访问权限

2. **JWT验证失败**
   - 检查JWT_SECRET是否正确设置
   - 确认token格式正确

3. **CORS错误**
   - 检查前端域名是否在CORS配置中
   - 确认请求头设置正确

4. **Google OAuth错误**
   - 检查Client ID配置
   - 确认回调URL设置正确
   - 验证OAuth同意屏幕配置

### 测试步骤

1. 保存配置后等待几分钟生效
2. 清除浏览器缓存
3. 重新尝试 Google 登录
4. 检查控制台输出的配置信息

## 扩展功能

### 1. 第三方登录

可以集成以下OAuth提供商：
- Google登录
- GitHub登录
- 微信登录

### 2. 用户管理

- 用户资料编辑
- 密码重置
- 邮箱验证
- 账户删除

### 3. 权限控制

- 用户角色管理
- API访问限制
- 使用量统计

---

**注意：** 这是一个基础的用户认证系统，建议在生产环境中添加更多安全措施，如速率限制、IP白名单、审计日志等。
