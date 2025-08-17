# 动态内容编辑指南

## 🚀 系统概述

这个动态内容系统允许内容编辑者通过修改 Markdown 文件来自由定制网站内容，无需修改代码。

**✅ 所有sections已完全转换为动态系统！**

现在所有的网站sections都使用统一的动态内容系统：
- **HeroSection**: 使用动态加载，支持CTA按钮
- **AboutSection**: 完全动态化
- **TechnologySection**: 完全动态化  
- **InvestmentSection**: 完全动态化
- **PerformanceSection**: 完全动态化
- **ResearchSection**: 完全动态化

## 📝 如何使用

### 1. 编辑内容
修改 `content/` 目录下对应section的 `index.md` 文件：

```yaml
---
title: "小标题"
heading: "主标题"
description: "描述文字"
background: "/_shared/backgrounds/image.jpg"
# 添加您的自定义内容...
---
```

### 2. 支持的内容类型

#### Features 类型 - 功能展示
```yaml
features:
  - title: "功能1"
    description: "功能描述"
```

#### Metrics 类型 - 数据指标
```yaml
metrics:
  - title: "指标名"
    value: "数值"
    description: "说明"
```

#### 自定义对象 - 灵活结构
```yaml
customSection:
  title: "标题"
  requirements:  # 或 steps, pillars, components
    - "项目1"
    - "项目2"
```

## 📁 现有Sections

- **about**: `content/about/index.md`
- **hero**: `content/hero/index.md`
- **investment**: `content/investment/index.md`
- **performance**: `content/performance/index.md`
- **research**: `content/research/index.md`
- **technology**: `content/technology/index.md`

## 💡 优势

1. **无需编程**: 只需编辑Markdown文件
2. **自动适应**: 组件会自动适应内容结构
3. **灵活布局**: 支持多种内容类型和布局
4. **实时预览**: 修改后立即看到效果

## 🔧 技术实现

- **DynamicSection组件**: 自动解析和渲染任意结构的内容
- **智能布局**: 根据内容类型自动选择最佳布局
- **类型安全**: TypeScript支持确保数据结构正确

## 🎯 实际示例

### Investment Section 当前结构
```yaml
---
title: "Investment"
heading: "Scientific Investment Approach"
background: "/_shared/backgrounds/investment-tech.jpg"
description: "Combining advanced AI technology with traditional investment wisdom..."
qualifiedInvestors:
  title: "Qualified Investors"
  requirements:
    - "Minimum investment: 1 million RMB"
    - "Net financial assets ≥ 3 million RMB"
methodology:
  title: "Investment Methodology"
  pillars:
    - "Generation of decision signals from predictive models"
    - "Systematic risk assessment and portfolio optimization"
---
```

现在您可以自由编辑 `content/` 目录下的文件，系统会自动适应您的内容结构！