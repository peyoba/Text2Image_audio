# AISTONE - 智能 AI 内容创作平台

<p align="center">
  <img src="frontend/assets/logo.svg" alt="AISTONE Logo" width="120">
</p>

<p align="center">
  <strong>基于 Pollinations.AI 的免费 AI 图片生成与语音合成平台</strong>
</p>

<p align="center">
  <a href="https://pollinations.ai">
    <img src="https://img.shields.io/badge/Made%20with-Pollinations.AI-blue?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0wIDE4Yy00LjQxIDAtOC0zLjU5LTgtOHMzLjU5LTggOC04IDggMy41OSA4IDgtMy41OSA4LTggOHoiLz48L3N2Zz4=" alt="Made with Pollinations.AI">
  </a>
  <a href="https://github.com/peyoba/Text2Image_audio">
    <img src="https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github" alt="GitHub">
  </a>
  <a href="https://aistone.org">
    <img src="https://img.shields.io/badge/Website-aistone.org-green?style=for-the-badge" alt="Website">
  </a>
</p>

<p align="center">
  <a href="https://aistone.org">官方网站</a> •
  <a href="#功能特色">功能特色</a> •
  <a href="#使用指南">使用指南</a> •
  <a href="#技术架构">技术架构</a> •
  <a href="#致谢">致谢</a>
</p>

---

## 🌟 关于 AISTONE

**AISTONE** 是基于 [Pollinations.AI](https://pollinations.ai) 开源 API 构建的 AI 内容创作平台，为全球用户提供免费、高质量的 AI 图片生成与语音合成服务。

我们整合了 Pollinations.AI 提供的多种先进 AI 模型（包括 FLUX、GPT Image、Seedream 等），并结合 DeepSeek 智能提示词优化技术，打造了一个简单易用的创作工具，让 AI 内容创作对每个人都触手可及。

### 核心技术

- **图片生成引擎**：[Pollinations.AI](https://pollinations.ai) - 开源的多模型 AI 图像生成平台
- **语音合成引擎**：Pollinations Audio API - 基于 OpenAI 音频模型
- **提示词优化**：[DeepSeek](https://deepseek.com) - 智能中英文提示词转换

### 为什么选择 AISTONE？

| 特性 | 说明 |
|------|------|
| **完全免费** | 基础模型永久免费，无需注册即可使用 |
| **多模型支持** | 集成 FLUX、GPT Image、Seedream 等多种 AI 模型 |
| **智能优化** | DeepSeek AI 自动优化中文提示词，提升生成效果 |
| **全球加速** | 基于 Cloudflare 边缘网络，全球低延迟访问 |
| **隐私优先** | 零数据留存，所有内容实时处理不存储 |
| **开源透明** | 基于开源技术栈，代码完全公开 |

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
     │ (图片/语音)   │    │ (提示词优化) │    │   (存储)    │
     └─────────────┘    └─────────────┘    └─────────────┘
```

### 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端 | HTML5 + CSS3 + JavaScript | 原生技术栈，轻量高效 |
| 后端 | Cloudflare Workers | Serverless 架构，全球边缘部署 |
| 存储 | Cloudflare KV | 分布式键值存储 |
| CDN | Cloudflare Network | 全球 300+ 节点加速 |
| 图片 AI | [Pollinations.AI](https://pollinations.ai) | 开源多模型图像生成 |
| 语音 AI | Pollinations Audio | OpenAI 兼容音频 API |
| 文本 AI | [DeepSeek](https://deepseek.com) | 智能提示词优化 |

### Pollinations.AI 集成

本项目深度集成 Pollinations.AI 的开源 API：

- **图片生成 API** (`image.pollinations.ai`) - 支持 FLUX、Turbo 等免费模型
- **高级图片 API** (`gen.pollinations.ai`) - 支持 GPT Image、Seedream 等付费模型
- **音频生成 API** - 支持多种 OpenAI 兼容音色

详细 API 文档请参考：[Pollinations API Docs](https://github.com/pollinations/pollinations/blob/master/APIDOCS.md)

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

## 🙏 致谢

AISTONE 的诞生离不开以下优秀的开源项目和服务：

- **[Pollinations.AI](https://pollinations.ai)** - 提供强大的开源 AI 图像和音频生成 API，是本项目的核心技术基础
- **[DeepSeek](https://deepseek.com)** - 提供智能提示词优化能力，大幅提升生成质量
- **[Cloudflare](https://cloudflare.com)** - 提供 Workers、Pages 和全球 CDN 基础设施

特别感谢 Pollinations.AI 团队开放免费的 API 接口，让更多开发者和用户能够体验 AI 创作的魅力。

---

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)。

---

<p align="center">
  <a href="https://pollinations.ai">
    <img src="https://img.shields.io/badge/Powered%20by-Pollinations.AI-blue?style=flat-square" alt="Powered by Pollinations.AI">
  </a>
</p>

<p align="center">
  Made with ❤️ by AISTONE Team
  <br>
  <a href="https://pollinations.ai">
    <img src="https://raw.githubusercontent.com/pollinations/pollinations/master/assets/logo-text.svg" alt="Pollinations.AI" width="200">
  </a>
</p>
