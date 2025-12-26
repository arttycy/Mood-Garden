# 🌸 Mood Diary - AI 情绪花园

一个唯美、治愈的 AI 智能心情日记应用。它不只是记录文字，更能通过 DeepSeek AI 分析你的情绪，将其转化为独一无二的“心情之花”，并封存在梦幻的水晶球中进行月度总结。

![Mood Diary Preview](https://via.placeholder.com/800x400?text=Mood+Diary+Preview)

## ✨ 核心功能

### 1. 🤖 AI 情感分析
- **智能识别**：基于 **DeepSeek V3** 模型，精准理解日记中的复杂情绪（反讽、隐含意义等）。
- **自动映射**：将情绪自动转化为 8 种基础情感维度（开心、兴奋、难过、生气、平静、爱、累、中性）。
- **视觉化**：根据情绪生成专属的 **颜色** 和 **Emoji 图标**。

### 2. 🌺 每日心情之花
- **生成式艺术**：每天的所有心情记录会共同“浇灌”出一朵当日的专属花朵。
- **花语系统**：
  - 🌻 **向日葵** (Happy)
  - 🌹 **玫瑰** (Love)
  - 🌷 **郁金香** (Sad)
  - 🌺 **木槿** (Excited)
  - 🌿 **兰花** (Calm)
  - ...以及更多。
- **诗意命名**：每一朵花都会获得一个源自泰戈尔《飞鸟集》的诗意名字（如“生如夏花”、“星光之爱”）。

### 3. 🔮 梦幻心情罐子 (Crystal Ball)
- **3D 视觉**：一个带有珍珠光泽和流光效果的 **3D 水晶球**。
- **历史回溯**：过去所有的心情花朵都会被封存在球中，轻轻漂浮。
- **交互体验**：支持重力感应般的呼吸动画和碰撞检测布局，确保花朵分布自然。

### 4. 📅 可视化日历
- **情绪地图**：在日历视图中查看每个月的情绪分布点阵。
- **快速跳转**：点击任意日期即可“穿越”回那天，重温当时的记忆。

---

## 🚀 快速开始

### 1. 环境准备
确保你的电脑上安装了 [Python 3.x](https://www.python.org/)。

### 2. 启动项目
打开终端（Terminal）或 VS Code，运行以下命令：

```bash
# 进入项目目录
cd mood-diary

# 启动服务器
python server.py
```

服务器启动后，访问浏览器：👉 **http://localhost:8001**

### 3. 配置 AI (可选)
为了体验完整的 AI 分析功能，你需要配置 DeepSeek API Key：

1. 打开项目中的 `config.js` 文件。
2. 填入你的 API Key：
   ```javascript
   const MOOD_DIARY_CONFIG = {
       apiKey: "sk-你的Key...", 
       apiUrl: "/https://api.deepseek.com/chat/completions",
       model: "deepseek-chat"
   };
   ```
3. 或者在网页右上角的 **设置 (⚙️)** 中直接输入。

> **注意**：如果没有配置 API Key，项目会自动降级使用“关键词匹配模式”，依然可以正常运行！

---

## 📂 项目结构

```
mood-diary/
├── index.html      # 页面骨架 (Views: Today, Jar, Calendar)
├── style.css       # 视觉样式 (Glassmorphism, Animations)
├── script.js       # 核心逻辑 (Canvas绘图, AI调用, 交互)
├── config.js       # 配置文件 (API Key)
└── server.py       # Python后端 (API代理, 静态服务)
```

## 🎨 技术栈

- **前端**：原生 HTML5, CSS3 (Flexbox/Grid, Animations), JavaScript (ES6+)
- **绘图**：HTML5 Canvas API (纯代码绘制矢量花朵)
- **后端**：Python `http.server` (轻量级代理)
- **AI**：DeepSeek V3 API

## 📖 使用指南

1.  **记录心情**：在输入框写下你此刻的想法（如：“今天吃到好吃的蛋糕，开心！”），点击“记录”。
2.  **生成演示数据**：在设置中点击“生成演示数据”，瞬间填满你的水晶球。
3.  **查看历史**：点击底部的“心情罐子”或“日历”按钮，回顾过去。

## 后续待优化
1.**界面设计**：花朵样式应该根据情绪而进行选择，保持风格一致，对现有的花朵样式进行优化。
2.**情绪识别**：情绪识别应进一步细化。



