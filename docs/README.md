# Text2Image_audio 项目文档

## 文档概览

本目录包含Text2Image_audio项目的完整技术文档，按功能模块组织。

## 📚 文档结构

### 🔐 [认证系统指南](./AUTHENTICATION_GUIDE.md)

完整的用户认证系统文档，包括：

- 用户注册登录
- Google OAuth 2.0配置
- JWT认证机制
- 安全配置和故障排除

### 🚀 [功能特性指南](./FEATURES_GUIDE.md)

详细介绍所有功能特性：

- 自动滚动功能
- 图片缓存优化系统
- 高清图片管理
- 多语言支持(i18n)
- UI/UX增强功能

### 🛠️ [部署指南](./DEPLOYMENT_GUIDE.md)

完整的部署和配置说明：

- 开发环境搭建
- 生产环境部署
- Cloudflare Workers/Pages配置
- 环境变量管理
- 监控和维护

### 🔧 本地开发环境配置

#### 环境变量设置

在项目根目录创建 `api.env` 文件：

```env
# Cloudflare KV 存储配置
KV_NAMESPACE_ID=your_kv_namespace_id

# 日志级别控制
LOG_LEVEL=error

# API 基础 URL
API_BASE_URL=https://text2image-api.your-domain.workers.dev

# 认证系统配置（可选）
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

#### 本地调试流程

1. **环境准备**

   ```powershell
   # 安装项目依赖
   npm install

   # 安装 Cloudflare Wrangler CLI
   npm install -g wrangler
   ```

2. **启动开发服务器**

   ```powershell
   # 启动前端静态服务器
   npx http-server frontend -p 8080

   # 启动后端 Worker 开发服务器
   wrangler dev --env development
   ```

3. **访问地址**
   - 前端开发环境：http://localhost:8080
   - 后端 API 服务：http://localhost:8787
   - Worker 控制台：https://dash.cloudflare.com

4. **调试工具**
   - 浏览器开发者工具（网络面板）
   - Cloudflare Workers 控制台日志
   - `wrangler tail` 实时日志监控
   - `wrangler dev --inspect` 调试模式

### 📈 [开发进度与规划](./DEVELOPMENT_PROGRESS.md)

项目发展历程和规划：

- 开发迭代历程
- 功能完成度统计
- 技术架构演进
- 后续发展规划
- 问题复盘与解决方案（2025-09-03）
  - 近期实施计划（i18n 补齐 / 留言与建议 / 模板）

## 🔗 相关链接

### 项目资源

- **GitHub仓库**: https://github.com/peyoba/Text2Image_audio
- **线上地址**: https://aistone.org
- **API文档**: [../APIDOCS.md](../APIDOCS.md)
- **第三方API**: [../pollinations_README2.md](../pollinations_README2.md)

### 技术支持

- **项目README**: [../README.md](../README.md)
- **问题报告**: [GitHub Issues](https://github.com/peyoba/Text2Image_audio/issues)

## 📋 快速导航

### 新开发者入门

1. 阅读 [部署指南](./DEPLOYMENT_GUIDE.md) 搭建开发环境
2. 查看 [开发进度](./DEVELOPMENT_PROGRESS.md) 了解项目架构
3. 参考 [功能指南](./FEATURES_GUIDE.md) 了解现有功能

### 系统管理员

1. [部署指南](./DEPLOYMENT_GUIDE.md) - 生产环境配置
2. [认证指南](./AUTHENTICATION_GUIDE.md) - 安全配置
3. 监控和维护相关章节

### 功能开发

1. [功能指南](./FEATURES_GUIDE.md) - 现有功能参考
2. [开发进度](./DEVELOPMENT_PROGRESS.md) - 技术架构
3. 代码规范和最佳实践

## 📝 文档维护

### 更新原则

- 及时同步代码变更
- 保持文档结构清晰
- 添加充分的示例代码
- 包含故障排除信息

### 版本历史

- **v2.0** (2025-08-31): 文档重构，按模块分类整理
- **v1.x**: 分散的单独文档文件

### 贡献指南

1. 确保文档准确性
2. 保持格式一致性
3. 添加必要的代码示例
4. 更新相关的交叉引用

---

**文档最后更新**: 2025-08-31  
**适用版本**: v2.0+  
**维护者**: 彭大大
