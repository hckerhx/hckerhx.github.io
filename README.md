# Tactical Drawdown Strategy Lab

一个用于展示“头部公司深跌买入”投资策略的静态网站。聚焦 Mag 7 科技龙头在深度回撤后的表现，并提供实时的下跌监控与邮件提醒功能。

## 📸 界面预览

![Stock Chart](file:///Users/hckerhx/.gemini/antigravity/brain/325487e6-f338-4714-a5ab-c7c3776e2f20/aapl_chart_final_1767825382174.png)
*实时股价走势监控 (Excalidraw 风格)*

![Theory Page](file:///Users/hckerhx/.gemini/antigravity/brain/325487e6-f338-4714-a5ab-c7c3776e2f20/theory_page_en_1767827206340.png)
*策略理论页 (英文模式)*

## 🌐 核心功能

### 1. 下跌监控与图表 (Drawdown Monitor)
- **手绘风格 UI**：采用 Excalidraw 风格的图表与界面设计，简洁直观。
- **实时数据接入**：集成 **Yahoo Finance API**，输入股票代码（如 AAPL, TSLA）即可获取实时价格与 1 年历史走势。
- **动态阈值线**：在图表中直观展示用户设定的“买入阈值”（如 -20%），辅助判断买入时机。

### 2. 邮件自动提醒 (Email Alerts)
- **自定义阈值**：用户可设定关注的下跌幅度（如 20%）和观测窗口期。
- **自动触发**：当监测股票的跌幅触发阈值时，系统自动发送邮件提醒。
- **模拟模式**：无需配置 API Key 也可体验提醒流程（在控制台与 UI 显示模拟通知）。
- **EmailJS 集成**：支持配置真实的服务 ID 与模板 ID，实现真正的邮件推送。

### 3. 双语无缝切换
- **中英支持**：一键切换语言，偏好自动保存至本地。
- **平滑过渡**：优化了加载逻辑，消除了语言切换时的“闪烁” (FOUC) 问题。

### 4. 策略理论 (Strategy Theory)
- **交互式推演**：输入投入金额，自动计算分批买入计划。
- **实时组合对比**：展示 Mag 7 等权组合与 SPY/QQQ 的实时净值差异。

## 🚀 快速开始

1. **克隆项目**
   ```bash
   git clone https://github.com/hckerhx/hckerhx.github.io.git
   ```
2. **本地运行**
   直接在浏览器打开 `index.html` 即可使用完整功能。
   *注意：由于 CORS 限制，本地通过 `file://` 访问 Yahoo API 时系统会自动使用代理或回退模式。*

## 🧱 项目结构

```
├── index.html          # 下跌监控主页 (Monitor)
├── theory.html         # 策略理论页 (Theory)
├── css/
│   └── style.css       # 全局样式 (Excalidraw 风格定义)
├── js/
│   ├── tracker.js      # 监控页逻辑 (API, Charts, Email Alerts)
│   └── theory.js       # 理论页逻辑 (Simulations, Translation)
└── README.md           # 项目说明
```

## 🛠️ 技术栈

- **Core**: 原生 HTML5 / CSS3 / JavaScript (ES6+)
- **Charts**: [Chart.js](https://www.chartjs.org/) + `chartjs-adapter-date-fns`
- **Email**: [EmailJS SDK](https://www.emailjs.com/)
- **Data**: Yahoo Finance API (via CORS Proxy)
- **Font**: "Virgil" (Excalidraw 手写字体)

> 本项目所含数据仅用于策略示意，不构成投资建议。
