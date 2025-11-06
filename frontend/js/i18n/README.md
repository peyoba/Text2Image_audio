# i18n 多语言系统使用文档

## 📋 概述

本项目使用自定义的多语言（i18n）系统，支持中文（zh）和英文（en）两种语言。

## 📁 文件结构

```
frontend/js/
├── i18n.js              # 主翻译文件（3855行，包含所有翻译）
├── i18n.js.backup       # 备份文件
└── i18n/                # 模块化目录（未来扩展）
    ├── README.md        # 本文档
    ├── utils.js         # 工具函数
    └── common/          # 通用翻译模块（示例）
        ├── en.js
        └── zh.js
```

## 🎯 核心功能

### 1. 翻译键结构

i18n.js 包含两个主要对象：

```javascript
const i18n = {
  en: {
    // 英文翻译键
    title: "AISTONE",
    subtitle: "Images · Voice · Unlimited Free Generation",
    // ...更多键
  },
  zh: {
    // 中文翻译键（键名与英文相同）
    title: "AISTONE",
    subtitle: "图片 · 语音 · 无限免费生成",
    // ...更多键
  }
};
```

### 2. 翻译键分类

文件已按功能域组织，主要分类包括：

| 分类 | 行号范围（英文） | 说明 |
|------|----------------|------|
| 🏠 首页与通用 | 122-220行 | 标题、按钮、状态消息等 |
| 🎨 图片生成 | 145-173行 | AI模型、尺寸、比例等 |
| 🎵 语音生成 | 174-187行 | 音频选项、声音选择等 |
| 📝 博客页面 | 359-586行 | AI指南、教程、提示词工程 |
| 📄 关于页面 | 594-779行 | 关于AISTONE、技术架构 |
| ❓ FAQ页面 | 780-836行 | 常见问题解答 |
| 🔐 认证登录 | 1017-1065行 | 登录、注册、密码管理 |
| 👤 用户中心 | 1372-1380行 | 个人信息、设置 |
| 💬 反馈系统 | 1381-1425行 | 用户反馈、留言 |

*中文翻译从第2030行开始，结构与英文对应*

## 🔧 核心API

### 函数列表

#### `normalizeLang(lang)`
规范化语言代码

```javascript
normalizeLang('zh-CN')  // 返回 'zh'
normalizeLang('en-US')  // 返回 'en'
normalizeLang(null)     // 返回 'en' (默认)
```

#### `getCurrentLang()`
获取当前语言设置（从localStorage读取）

```javascript
const lang = getCurrentLang();  // 返回 'zh' 或 'en'
```

#### `setLanguage(lang)`
设置当前语言并更新页面

```javascript
setLanguage('zh');  // 切换到中文
setLanguage('en');  // 切换到英文
```

#### `t(key)`
翻译函数，根据当前语言返回对应文本

```javascript
t('title')           // 返回 "AISTONE"
t('generateButton')  // 根据当前语言返回 "开始生成" 或 "Start Generation"
```

支持嵌套键（用点分隔）：

```javascript
t('feedbackCategories.bug')  // 返回 "问题反馈" 或 "Bug Report"
```

#### `updatePageText()`
更新页面所有带 `data-i18n` 属性的元素

```javascript
updatePageText();  // 自动更新所有翻译文本
```

#### `initI18n()`
初始化i18n系统（页面加载时自动调用）

```javascript
initI18n();  // 设置默认语言并更新页面
```

## 📝 使用方法

### 方法1：HTML属性（推荐）

在HTML元素上添加 `data-i18n` 属性：

```html
<h1 data-i18n="title">AISTONE</h1>
<button data-i18n="generateButton">开始生成</button>
<p data-i18n="smartOptimizeTip"></p>
```

### 方法2：JavaScript调用

在JS代码中直接调用翻译函数：

```javascript
// 获取翻译文本
const buttonText = t('generateButton');
document.getElementById('myButton').textContent = buttonText;

// 或使用模板字符串
element.innerHTML = `<h2>${t('welcomeToAistone')}</h2>`;
```

### 方法3：动态内容

对于动态生成的内容：

```javascript
// 生成HTML后调用updatePageText()
const html = `<div data-i18n="loading"></div>`;
container.innerHTML = html;
updatePageText();  // 更新翻译
```

## ➕ 添加新翻译

### 步骤：

1. **在英文部分添加键**（约第118-2025行）

```javascript
en: {
  // 在合适的section添加
  myNewKey: "My New Text",
}
```

2. **在中文部分添加对应键**（约第2030-3487行）

```javascript
zh: {
  // 在对应位置添加
  myNewKey: "我的新文本",
}
```

3. **在HTML中使用**

```html
<span data-i18n="myNewKey"></span>
```

### 注意事项：

- ✅ 保持英文和中文键名完全一致
- ✅ 在对应的section添加，便于维护
- ✅ 添加注释说明用途
- ✅ 测试两种语言都能正常显示

## 🔍 查找翻译键

### 方法1：使用编辑器搜索
- 按 `Ctrl+F` 或 `Cmd+F`
- 搜索键名，如 `generateButton`

### 方法2：查看顶部索引
- 打开 `i18n.js`
- 查看第12-87行的详细索引
- 根据功能域快速定位

### 方法3：查看section分隔符
- 文件中已添加醒目的分隔注释
- 例如：`// ========== 🎨 图片生成 (Image Generation) ==========`

## 🐛 常见问题

### Q1: 翻译不生效？
**A:** 检查以下几点：
1. 键名是否正确（区分大小写）
2. 是否在英文和中文部分都添加了
3. 是否调用了 `updatePageText()`
4. 浏览器缓存是否清除

### Q2: 如何调试翻译？
**A:** 在浏览器控制台：

```javascript
// 查看当前语言
console.log(getCurrentLang());

// 查看特定键的翻译
console.log(t('yourKey'));

// 查看整个i18n对象
console.log(i18n);
```

### Q3: 支持嵌套对象吗？
**A:** 支持！例如：

```javascript
feedbackCategories: {
  bug: "问题反馈",
  feature: "功能建议",
}
```

使用时：`t('feedbackCategories.bug')`

### Q4: 如何切换语言？
**A:** 调用 `setLanguage()` 函数：

```javascript
// 切换到中文
setLanguage('zh');

// 切换到英文
setLanguage('en');
```

## 🚀 性能优化建议

1. **避免频繁调用 `updatePageText()`**
   - 只在语言切换或动态内容加载后调用

2. **使用 `data-i18n` 属性**
   - 比JavaScript手动更新更高效

3. **缓存翻译结果**
   - 如果同一个键多次使用，可以缓存结果

```javascript
const buttonText = t('generateButton');
// 多次使用 buttonText，而不是多次调用 t()
```

## 📦 未来扩展

### 模块化方案（可选）

`i18n/` 目录已创建，包含模块化示例：

```javascript
// i18n/common/en.js
window.i18nCommonEn = {
  title: "AISTONE",
  // ...
};

// 在主文件中合并
const i18n = {
  en: {
    ...window.i18nCommonEn,
    ...window.i18nImageEn,
    // ...
  }
};
```

### 按需加载

对于大型项目，可以实现按页面加载翻译：

```javascript
// 只加载当前页面需要的翻译模块
if (isImagePage) {
  loadTranslations('image');
}
```

## 📞 支持

如有问题或建议，请：
- 查看 `i18n.js` 顶部的详细注释
- 参考本文档的示例
- 在项目中搜索现有用法作为参考

---

**最后更新：** 2025-11-06  
**维护者：** AISTONE Team

