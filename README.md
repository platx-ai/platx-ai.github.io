# Renaissance Era Group Website

A SpaceX-inspired static website for Renaissance Era Group, showcasing our AI-driven investment management capabilities.

## Technologies Used

- React + Vite
- TypeScript
- Tailwind CSS
- GitHub Pages

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   └── Navigation.tsx
│   └── sections/
│       ├── HeroSection.tsx
│       ├── TechnologySection.tsx
│       ├── InvestmentSection.tsx
│       └── PerformanceSection.tsx
├── App.tsx
└── App.css
```

## Development

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/platx-ai/platx-ai.github.io.git
cd platx-ai.github.io
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

### Building

To build the project for production:

```bash
npm run build
```

The build output will be in the `dist` directory.

## Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the main branch.

## Design

The website follows SpaceX's design principles:
- Dark theme with dramatic full-screen sections
- High-contrast typography
- Dynamic background images with overlay gradients
- Minimalist layout
- Responsive design for all devices

## 内容管理手册

### 非技术人员快速指引 (TLDR)

**5分钟学会编辑网站内容：**
1. 打开 https://github.com/platx-ai/platx-ai.github.io
2. 进入 `content/` 文件夹，选择要编辑的文件
3. 点击铅笔图标 ✏️ 编辑内容
4. 修改完成后点击 "Propose changes" 创建 PR
5. 等待技术团队审核合并，网站自动更新

---

### 详细操作指南：如何让不懂代码的队友通过GitHub在线编辑文本形成PR合并的流程

本网站采用简单的内容管理系统（CMS），所有内容存储在 `content/` 文件夹的 markdown 文件中。非技术团队成员可以通过 GitHub 的网页界面轻松编辑内容，无需安装任何软件或编写代码。

#### 内容结构

网站内容按以下文件夹组织：

```
content/
├── _shared/           # 共享资源（背景图片等）
├── hero/             # 首页主横幅内容
├── investment/       # 投资策略板块内容
├── performance/      # 业绩表现板块内容
└── technology/       # AI技术板块内容
```

#### 详细编辑步骤

##### 1. 访问代码仓库
- 打开：https://github.com/platx-ai/platx-ai.github.io
- 确保已登录 GitHub 账户
- 确保已被添加为仓库协作者

##### 2. 导航到内容文件
- 点击 `content/` 文件夹
- 选择要编辑的板块：
  - `hero/index.md` - 首页主横幅
  - `investment/index.md` - 投资策略内容
  - `technology/index.md` - AI技术特性
  - `performance/index.md` - 业绩数据

##### 3. 编辑文件
- 点击要编辑的文件（如 `hero/index.md`）
- 点击右上角的铅笔图标 ✏️（"Edit this file"）
- 在编辑器中进行修改

##### 4. 理解文件格式
每个内容文件包含两部分：

**前置信息（在 `---` 行之间）：**
```yaml
---
title: "页面标题"
heading: "主标题"
description: "描述文字"
---
```

**正文内容（在第二个 `---` 之后）：**
普通文本内容写在这里。

##### 5. 编辑示例

**修改首页主标题：**
```yaml
---
title: "AI-Powered Investment"
heading: "资产管理的未来"  # ← 编辑这一行
background: "/_shared/backgrounds/space-satellite.jpg"
---
```

**更新投资要求：**
```yaml
qualifiedInvestors:
  title: "合格投资者"
  requirements:
    - "最低投资金额：100万人民币"  # ← 编辑这些行
    - "净金融资产 ≥ 300万人民币"
    - "年均收入 ≥ 50万人民币"
```

**修改技术特性：**
```yaml
features:
  - title: "机器学习"  # ← 编辑标题
    description: "先进算法分析市场模式和趋势"  # ← 编辑描述
```

##### 6. 保存更改（创建拉取请求）
- 滚动到页面底部的 "Propose changes" 部分
- 在 "Commit changes" 框中简要描述你的更改
- 选择 "Create a new branch for this commit and start a pull request"
- 点击 "Propose changes"
- 在下一页点击 "Create pull request"
- 添加关于更改的额外说明
- 再次点击 "Create pull request"

##### 7. 审核和合并流程
- 你的更改将创建一个"拉取请求"（PR）
- 技术团队成员将审核你的更改
- 审核通过后，他们将合并你的更改
- 网站将在几分钟内自动更新

#### 内容编辑指南

##### 文本内容
- 保持标题简洁有力
- 使用适合投资客户的专业语言
- 与现有语调和风格保持一致

##### 图片和背景
- 背景图片存储在 `content/_shared/backgrounds/`
- 要更改背景，引用文件路径如：`/_shared/backgrounds/filename.jpg`
- 添加新图片请联系技术团队

##### 投资信息
- 确保所有财务数据准确
- 仔细检查合规要求
- 验证最低投资金额和资格要求

#### 常见编辑任务

##### 更新投资门槛
文件：`content/investment/index.md`
```yaml
qualifiedInvestors:
  requirements:
    - "最低投资金额：[新金额] 人民币"
```

##### 更改主标题
文件：`content/hero/index.md`
```yaml
heading: "你的新标题"
```

##### 添加新技术特性
文件：`content/technology/index.md`
```yaml
features:
  - title: "新特性名称"
    description: "新特性的描述"
```

##### 更新业绩指标
文件：`content/performance/index.md`
（编辑文件中的相关指标）

#### 故障排除

**问题：看不到编辑按钮**
- 解决方案：确保已登录 GitHub 并拥有协作者权限

**问题：更改未在网站上显示**
- 解决方案：等待 5-10 分钟自动部署，或联系技术团队

**问题：格式显示错误**
- 解决方案：检查是否保持了正确的 YAML 格式和缩进

**问题：拉取请求被拒绝**
- 解决方案：查看反馈意见并进行要求的修改

#### 获取帮助

如果遇到任何问题：
1. 首先查看本手册
2. 通过 Slack/邮件联系技术团队
3. 在 GitHub 仓库中创建问题描述

#### 最佳实践

- 提交前始终预览更改
- 每个拉取请求只做一个逻辑更改
- 使用清晰、描述性的提交信息
- 尽可能在不同设备上测试内容
- 保留重要内容更改的备份

---

*本手册旨在帮助非技术团队成员高效、安全地为网站内容做出贡献。*

## License

Copyright © 2024 Renaissance Era Group. All rights reserved.
