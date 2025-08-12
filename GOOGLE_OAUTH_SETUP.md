# Google OAuth 2.0 配置指南

## 问题描述
当前遇到的错误：
```
错误 401: invalid_client
The OAuth client was not found.
```

## 解决方案

### 1. Google Cloud Console 配置

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

### 2. 获取新的客户端 ID

配置完成后，你会得到：
- **Client ID**: `xxx-xxx.apps.googleusercontent.com`
- **Client Secret**: `xxx-xxx` (需要设置到后端环境变量)

### 3. 更新代码

需要将新的 Client ID 更新到以下位置：
- `frontend/js/auth_modals.js` 第260行
- `backend/auth.js` 第758行

### 4. 设置环境变量

在 Cloudflare Workers 环境中设置：
```
GOOGLE_CLIENT_SECRET=你的客户端密钥
```

### 5. 当前使用的配置

**当前 Client ID**: `894036062262-8h0btc9vnrp4tj9v1gm8ljvj6b6d2m7i.apps.googleusercontent.com`

如果这个 Client ID 是正确的，请检查：
1. 是否在 Google Cloud Console 中添加了正确的回调URL
2. 是否启用了必要的 API
3. OAuth 同意屏幕是否正确配置

### 6. 测试步骤

1. 保存配置后等待几分钟生效
2. 清除浏览器缓存
3. 重新尝试 Google 登录
4. 检查控制台输出的配置信息

## 临时解决方案

如果暂时无法配置 Google 登录，用户可以：
1. 使用邮箱注册/登录
2. 使用忘记密码功能重置密码
3. 等待 Google 登录配置完成
