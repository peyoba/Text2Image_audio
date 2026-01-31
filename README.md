# AISTONE - 智能 AI 内容创作平台

<p align="center">
  <img src="frontend/assets/logo.svg" alt="AISTONE Logo" width="120">
</p>

<p align="center">
  <strong>免费的 AI 图片生成与语音合成平台</strong>
</p>

<p align="center">
  <a href="https://aistone.org">官方网站</a> •
  <a href="#功能特色">功能特色</a> •
  <a href="#使用指南">使用指南</a> •
  <a href="#技术架构">技术架构</a>
</p>

---

## 🌟 关于 AISTONE

**AISTONE** 是一个革命性的 AI 驱动内容创作平台，专注于为用户提供高质量、免费的 AI 图片生成与语音合成服务。我们的使命是让 AI 内容创作对每个人都触手可及。

### 为什么选择 AISTONE？

| 特性 | 说明 |
|------|------|
| **完全免费** | 核心功能永久免费，无需注册即可使用 |
| **专业品质** | 采用最新 AI 模型，生成效果媲美专业工具 |
| **简单易用** | 直观界面设计，一键生成高质量内容 |
| **全球加速** | 基于 Cloudflare CDN，全球低延迟访问 |
| **隐私优先** | 零数据留存，所有内容实时处理不存储 |

---

## ✨ 功能特色

### 🎨 AI 图片生成

支持多种专业级 AI 模型：

| 模型 | 特点 | 费用 |
|------|------|------|
| FLUX Schnell | 高质量艺术创作 | 免费 |
| SDXL Turbo | 单步快速生成 | 免费 |
| Z-Image Turbo | 快速 2 倍放大 | 免费 |
| FLUX Kontext | 图像编辑处理 | 付费 |
| GPT Image | OpenAI 图像生成 | 付费 |
| Seedream | 字节跳动高质量 | 付费 |

**功能亮点：**
- 支持多种尺寸比例（1:1、16:9、9:16 等）
- 自定义分辨率（最高 2048×2048）
- 批量生成（1/2/4 张）
- 可选去除水印

### 🎵 AI 语音合成

- 11 种专业音色可选
- 支持中英文文本
- 在线播放与下载
- 高质量 MP3 输出

### 🧠 智能提示词优化

- 集成 DeepSeek AI
- 自动优化中文描述
- 生成高质量英文提示词
- 提升生成效果

### 📚 提示词模板库

- 6 大类别精选模板
- 24+ 专业提示词
- 一键应用
- 持续更新

---

## 📖 使用指南

### 图片生成

1. 访问 [https://aistone.org](https://aistone.org)
2. 在文本框输入图片描述（支持中文）
3. 选择 AI 模型和图片参数
4. 点击「开始生成」
5. 等待生成完成，下载或分享

### 语音合成

1. 访问 [语音生成页面](https://aistone.org/voice.html)
2. 输入要朗读的文字
3. 选择音色
4. 点击「生成语音」
5. 在线播放或下载音频

---

## 🏗️ 技术架构

```
┌─────────────────────────────────────────────────┐
│                   用户浏览器                      │
└─────────────────────┬───────────────────────────┘
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│ Cloudflare Pages│     │Cloudflare Workers│
│    (前端)        │     │    (后端 API)    │
└─────────────────┘     └────────┬────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              ▼                  ▼                  ▼
     ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
     │ Pollinations │    │  DeepSeek   │    │ Cloudflare  │
     │   AI API     │    │    API      │    │     KV      │
     └─────────────┘    └─────────────┘    └─────────────┘
```

### 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | HTML5 + CSS3 + JavaScript (ES6+) |
| 后端 | Cloudflare Workers (Serverless) |
| 存储 | Cloudflare KV |
| CDN | Cloudflare Global Network |
| AI | Pollinations AI, DeepSeek |

---

## 🌍 多语言支持

- 🇺🇸 English
- 🇨🇳 简体中文

支持一键切换，所有界面和提示完整翻译。

---

## 📊 项目状态

| 指标 | 状态 |
|------|------|
| 版本 | v2.1 |
| 状态 | ✅ 生产环境运行中 |
| 功能完成度 | 98% |

---

## 🔗 相关链接

- **官方网站**：[https://aistone.org](https://aistone.org)
- **GitHub**：[https://github.com/peyoba/Text2Image_audio](https://github.com/peyoba/Text2Image_audio)
- **问题反馈**：[GitHub Issues](https://github.com/peyoba/Text2Image_audio/issues)

---

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)。

---

<p align="center">
  Made with ❤️ by AISTONE Team
</p>
