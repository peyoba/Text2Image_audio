# 用户认证系统部署指南

## 概述

本文档介绍如何为您的AI图像生成平台添加用户认证功能。系统包含用户注册、登录、JWT token验证等功能。

## 功能特性

- ✅ 用户注册和登录
- ✅ JWT token认证
- ✅ 密码加密存储
- ✅ 邮箱格式验证
- ✅ 密码强度验证
- ✅ 响应式UI设计
- ✅ 本地存储token管理

## 部署步骤

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

### 3. 部署

#### 3.1 本地测试

```bash
# 安装依赖
npm install

# 本地开发
npx wrangler dev

# 部署到Cloudflare
npx wrangler deploy
```

#### 3.2 验证部署

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

### 调试模式

启用调试日志：

```bash
# 设置环境变量
LOG_LEVEL=debug

# 查看Worker日志
npx wrangler tail
```

## 联系支持

如果您在部署过程中遇到问题，请：

1. 检查Cloudflare Worker日志
2. 验证环境变量配置
3. 确认KV Namespace权限
4. 查看浏览器控制台错误

---

**注意：** 这是一个基础的用户认证系统，建议在生产环境中添加更多安全措施，如速率限制、IP白名单、审计日志等。 