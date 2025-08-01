# V2.0 高清图片缓存系统部署指南

## 🚀 版本更新说明

V2.0版本新增了高清图片缓存功能，用户可以：
- 保存生成的高清图片（不压缩）
- 查看今日生成的图片列表
- 下载高清图片
- 管理个人图片库

## 📋 部署前准备

### 1. Cloudflare KV Namespace 配置

需要创建两个KV Namespace：

#### 用户数据存储
```bash
# 创建用户数据KV
wrangler kv:namespace create "USERS"
```

#### 图片缓存存储
```bash
# 创建图片缓存KV
wrangler kv:namespace create "IMAGES_CACHE"
```

### 2. 更新 wrangler.toml 配置

将生成的KV ID替换到配置文件中：

```toml
# KV Namespace 绑定 (用于存储用户数据)
[[kv_namespaces]]
binding = "USERS"
id = "你的USERS_KV_ID" # 替换为实际ID

# KV Namespace 绑定 (用于存储图片缓存)
[[kv_namespaces]]
binding = "IMAGES_CACHE"
id = "你的IMAGES_CACHE_KV_ID" # 替换为实际ID
```

### 3. 环境变量配置

确保以下环境变量已配置：

```bash
# JWT密钥（用于用户认证）
JWT_SECRET = "your-super-secret-jwt-key-change-this-in-production"

# 其他必需的环境变量
POLLINATIONS_IMAGE_API_BASE = "https://image.pollinations.ai"
POLLINATIONS_TEXT_API_BASE = "https://text.pollinations.ai"
DEEPSEEK_API_KEY = "your-deepseek-api-key"
DEEPSEEK_API_URL = "https://api.siliconflow.cn/v1/chat/completions"
DEEPSEEK_MODEL = "deepseek-ai/DeepSeek-V2.5"
DEFAULT_AUDIO_MODEL = "openai-audio"
DEFAULT_AUDIO_VOICE = "nova"
LOG_LEVEL = "info"
```

## 🔧 部署步骤

### 1. 本地测试

```bash
# 安装依赖
npm install

# 本地开发
wrangler dev
```

### 2. 生产部署

```bash
# 部署到生产环境
wrangler deploy
```

### 3. 验证部署

访问以下端点验证功能：

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/images/save` - 保存图片
- `GET /api/images/daily` - 获取今日图片
- `GET /api/images/{id}` - 获取单张图片
- `GET /api/images/download/{id}` - 下载图片

## 📱 前端集成

### 1. 引入必要的文件

在HTML文件中添加：

```html
<!-- 认证模块 -->
<script src="js/auth.js"></script>

<!-- 高清图片管理模块 -->
<script src="js/hd_image_manager.js"></script>

<!-- 认证界面 -->
<div id="auth-modals"></div>
<script>
    fetch('auth-modals.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('auth-modals').innerHTML = html;
        });
</script>

<!-- 高清图片管理界面 -->
<div id="hd-images-ui"></div>
<script>
    fetch('hd-images-ui.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('hd-images-ui').innerHTML = html;
        });
</script>
```

### 2. 图片生成后自动保存

在图片生成成功后，调用保存接口：

```javascript
// 图片生成成功后保存
async function saveGeneratedImage(imageData) {
    try {
        const result = await hdImageManager.saveHDImage({
            prompt: imageData.prompt,
            data: imageData.data, // base64数据
            width: imageData.width,
            height: imageData.height,
            seed: imageData.seed,
            model: imageData.model,
            negative: imageData.negative
        });
        
        if (result.success) {
            console.log('图片保存成功:', result.id);
            // 刷新图片列表
            hdImageManager.loadDailyImages();
        }
    } catch (error) {
        console.error('保存图片失败:', error);
    }
}
```

## 💰 成本控制

### 免费额度使用情况

- **KV读取**: 100,000次/天
- **KV写入**: 100,000次/天
- **KV存储**: 1GB

### 使用限制

- 每天最多3张高清图片/用户
- 单张图片最大2MB
- 24小时后自动过期

### 成本估算（1000用户）

- 每天3张图片 × 1000用户 = 3,000张
- KV操作: 3,000读取 + 3,000写入 = 6,000次/天
- 存储: 约6GB（完全在免费额度内）

## 🔒 安全考虑

### 1. 用户认证

- 所有图片操作都需要JWT token验证
- 用户只能访问自己的图片
- Token 24小时过期

### 2. 数据安全

- 图片数据存储在Cloudflare KV中
- 自动过期机制防止数据积累
- 用户删除操作立即生效

### 3. 访问控制

- 图片下载需要认证
- 防止未授权访问
- 支持用户删除自己的图片

## 🐛 故障排除

### 常见问题

1. **KV Namespace未创建**
   ```
   错误: KV namespace not found
   解决: 使用 wrangler kv:namespace create 创建
   ```

2. **JWT密钥未配置**
   ```
   错误: JWT_SECRET not set
   解决: 在wrangler.toml中配置JWT_SECRET
   ```

3. **图片保存失败**
   ```
   错误: 图片太大
   解决: 检查图片大小是否超过2MB限制
   ```

4. **用户未登录**
   ```
   错误: 需要登录
   解决: 确保用户已登录并token有效
   ```

### 调试模式

启用调试日志：

```toml
[env.production.vars]
LOG_LEVEL = "debug"
```

## 📊 监控和统计

### 关键指标

- 用户注册数量
- 图片保存数量
- KV存储使用量
- API调用频率

### 日志查看

```bash
# 查看实时日志
wrangler tail

# 查看特定时间段的日志
wrangler tail --format=pretty
```

## 🔄 版本升级

### 从V1.0升级到V2.0

1. 备份当前版本
2. 更新代码文件
3. 创建新的KV Namespace
4. 更新配置文件
5. 重新部署

### 数据迁移

V1.0的用户数据可以保留，新功能会自动适配现有用户。

## 📞 技术支持

如遇到问题，请检查：

1. Cloudflare Workers日志
2. 浏览器控制台错误
3. 网络请求状态
4. KV存储配置

---

**V2.0版本特性总结：**
- ✅ 高清图片缓存（不压缩）
- ✅ 用户认证系统
- ✅ 图片管理界面
- ✅ 自动过期机制
- ✅ 完全免费使用
- ✅ 安全访问控制 