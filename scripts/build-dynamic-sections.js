#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const frontMatter = require('front-matter');

// 配置
const CONTENT_DIR = path.join(__dirname, '../content');
const SECTIONS_DIR = path.join(__dirname, '../src/components/sections');
const DOCS_DIR = path.join(__dirname, '../docs');

// 获取所有内容目录
function getContentSections() {
  return fs.readdirSync(CONTENT_DIR)
    .filter(item => {
      const itemPath = path.join(CONTENT_DIR, item);
      return fs.statSync(itemPath).isDirectory() && !item.startsWith('_');
    });
}

// 分析markdown文件结构
function analyzeMarkdownStructure(sectionName) {
  const markdownPath = path.join(CONTENT_DIR, sectionName, 'index.md');
  
  if (!fs.existsSync(markdownPath)) {
    console.warn(`Warning: ${markdownPath} does not exist`);
    return null;
  }

  const content = fs.readFileSync(markdownPath, 'utf8');
  const { attributes } = frontMatter(content);
  
  return {
    sectionName,
    frontmatter: attributes,
    structure: analyzeStructure(attributes)
  };
}

// 分析frontmatter结构
function analyzeStructure(frontmatter) {
  const structure = {
    hasBackground: !!frontmatter.background,
    hasFeatures: frontmatter.features && Array.isArray(frontmatter.features),
    hasMetrics: frontmatter.metrics && Array.isArray(frontmatter.metrics),
    objectKeys: [],
    arrayKeys: []
  };

  Object.keys(frontmatter).forEach(key => {
    if (['title', 'heading', 'description', 'background'].includes(key)) return;
    
    if (Array.isArray(frontmatter[key])) {
      structure.arrayKeys.push(key);
    } else if (typeof frontmatter[key] === 'object' && frontmatter[key] !== null) {
      structure.objectKeys.push(key);
    }
  });

  return structure;
}

// 生成优化的组件代码
function generateOptimizedComponent(analysis) {
  const { sectionName, structure } = analysis;
  const componentName = sectionName.charAt(0).toUpperCase() + sectionName.slice(1) + 'Section';
  
  // 如果结构简单，使用DynamicSection
  if (structure.objectKeys.length <= 2 && structure.arrayKeys.length <= 1) {
    return `import DynamicSection from './DynamicSection';

const ${componentName}: React.FC = () => {
  return <DynamicSection sectionId="${sectionName}" />;
};

export default ${componentName};
`;
  }

  // 对于复杂结构，生成定制化组件
  return generateCustomComponent(analysis);
}

// 生成定制化组件
function generateCustomComponent(analysis) {
  const { sectionName, frontmatter, structure } = analysis;
  const componentName = sectionName.charAt(0).toUpperCase() + sectionName.slice(1) + 'Section';
  
  let renderContent = '';
  
  if (structure.hasFeatures) {
    renderContent = `
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {frontmatter.features.map((feature: any) => (
            <div key={feature.title} className="theme-card p-8">
              <h4 className="text-xl font-semibold mb-4">{feature.title}</h4>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>`;
  } else if (structure.hasMetrics) {
    renderContent = `
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {frontmatter.metrics.map((metric: any) => (
            <div key={metric.title} className="theme-card p-8 text-center">
              <h4 className="text-lg font-medium text-muted-foreground mb-2">{metric.title}</h4>
              <p className="text-4xl font-bold mb-2">{metric.value}</p>
              <p className="text-muted-foreground">{metric.description}</p>
            </div>
          ))}
        </div>`;
  } else if (structure.objectKeys.length > 0) {
    const gridCols = structure.objectKeys.length === 1 ? 'grid-cols-1' : 
                    structure.objectKeys.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 
                    'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    
    renderContent = `
        <div className="grid ${gridCols} gap-12">
          ${structure.objectKeys.map(key => `
          <div className="theme-card p-8">
            <h4 className="text-2xl font-semibold mb-6">{frontmatter.${key}.title}</h4>
            <div className="space-y-4 text-muted-foreground">
              {frontmatter.${key}.requirements && (
                <ul className="space-y-4">
                  {frontmatter.${key}.requirements.map((item: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-foreground mr-2">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {frontmatter.${key}.steps && (
                <ul className="space-y-4">
                  {frontmatter.${key}.steps.map((item: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-foreground mr-2">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {frontmatter.${key}.pillars && (
                <ul className="space-y-4">
                  {frontmatter.${key}.pillars.map((item: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-foreground mr-2">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>`).join('')}
        </div>`;
  }

  return `import { useEffect, useState } from 'react';
import { getDynamicContent, DynamicContentResponse } from '../../lib/dynamicContent';

const ${componentName}: React.FC = () => {
  const [content, setContent] = useState<DynamicContentResponse | null>(null);

  useEffect(() => {
    getDynamicContent('${sectionName}').then((data) => setContent(data));
  }, []);

  if (!content) return null;

  const { frontmatter } = content;

  return (
    <section id="${sectionName}" className="relative min-h-screen py-24">
      ${structure.hasBackground ? `
      <div className="absolute inset-0 z-0">
        <img
          src={frontmatter.background}
          alt="${componentName} Background"
          className="object-cover w-full h-full opacity-15 dark:opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 to-background/60 dark:from-black/20 dark:to-black/50 z-10" />
      </div>` : ''}
      
      <div className="${structure.hasBackground ? 'relative z-20' : ''} max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm sm:text-base uppercase tracking-widest text-muted-foreground mb-6">
            {frontmatter.title}
          </h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 text-foreground">
            {frontmatter.heading}
          </h3>
          {frontmatter.description && (
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {frontmatter.description}
            </p>
          )}
        </div>
        ${renderContent}
      </div>
    </section>
  );
};

export default ${componentName};
`;
}

// 生成内容编辑文档
function generateContentEditingDocs(analyses) {
  let docs = `# 内容编辑指南

这个文档说明如何编辑网站内容。所有内容都存储在 \`content/\` 目录下的 Markdown 文件中。

## 支持的内容结构

### 基础字段
所有section都支持以下基础字段：
- \`title\`: 小标题（显示在顶部）
- \`heading\`: 主标题（大字体显示）
- \`description\`: 描述文字（可选）
- \`background\`: 背景图片路径（可选）

### 动态内容类型

#### 1. Features 类型
适用于展示功能特性：
\`\`\`yaml
features:
  - title: "功能1"
    description: "功能1的描述"
  - title: "功能2"
    description: "功能2的描述"
\`\`\`

#### 2. Metrics 类型
适用于展示数据指标：
\`\`\`yaml
metrics:
  - title: "指标名称"
    value: "数值"
    description: "指标描述"
\`\`\`

#### 3. 自定义对象类型
适用于复杂的结构化内容：
\`\`\`yaml
customSection:
  title: "自定义标题"
  requirements:  # 或 steps, pillars, components 等
    - "要求1"
    - "要求2"
\`\`\`

## 现有Section分析

`;

  analyses.forEach(analysis => {
    if (!analysis) return;
    
    docs += `### ${analysis.sectionName.toUpperCase()} Section
**文件位置**: \`content/${analysis.sectionName}/index.md\`

**当前结构**:
`;
    
    if (analysis.structure.hasBackground) {
      docs += `- ✅ 有背景图片\n`;
    }
    
    if (analysis.structure.hasFeatures) {
      docs += `- ✅ Features类型 (${analysis.frontmatter.features.length}个特性)\n`;
    }
    
    if (analysis.structure.hasMetrics) {
      docs += `- ✅ Metrics类型 (${analysis.frontmatter.metrics.length}个指标)\n`;
    }
    
    if (analysis.structure.objectKeys.length > 0) {
      docs += `- ✅ 自定义对象: ${analysis.structure.objectKeys.join(', ')}\n`;
    }
    
    if (analysis.structure.arrayKeys.length > 0) {
      docs += `- ✅ 数组字段: ${analysis.structure.arrayKeys.join(', ')}\n`;
    }
    
    docs += `
**示例内容结构**:
\`\`\`yaml
---
title: "${analysis.frontmatter.title}"
heading: "${analysis.frontmatter.heading}"
${analysis.frontmatter.description ? `description: "${analysis.frontmatter.description}"` : ''}
${analysis.frontmatter.background ? `background: "${analysis.frontmatter.background}"` : ''}
${Object.keys(analysis.frontmatter)
  .filter(key => !['title', 'heading', 'description', 'background'].includes(key))
  .map(key => `${key}: # 根据实际结构填写`)
  .join('\n')}
---
\`\`\`

`;
  });

  docs += `
## 添加新Section

1. 在 \`content/\` 目录下创建新文件夹
2. 在文件夹中创建 \`index.md\` 文件
3. 运行 \`npm run build:sections\` 自动生成组件
4. 在 \`src/App.tsx\` 中导入并使用新组件

## 最佳实践

1. **保持一致性**: 使用相同的字段名称和结构
2. **图片路径**: 背景图片建议放在 \`content/_shared/backgrounds/\` 目录
3. **内容长度**: 描述文字建议控制在合理长度内
4. **测试**: 修改内容后在浏览器中检查效果

## 自动化构建

运行以下命令可以自动分析内容结构并生成优化的组件：

\`\`\`bash
npm run build:sections
\`\`\`

这会：
- 分析所有markdown文件的结构
- 为简单结构使用通用DynamicSection组件
- 为复杂结构生成定制化组件
- 更新此文档
`;

  return docs;
}

// 主函数
function main() {
  console.log('🔍 分析内容结构...');
  
  const sections = getContentSections();
  const analyses = sections.map(analyzeMarkdownStructure).filter(Boolean);
  
  console.log(`📁 发现 ${analyses.length} 个section:`);
  analyses.forEach(analysis => {
    console.log(`  - ${analysis.sectionName}: ${analysis.structure.objectKeys.length} objects, ${analysis.structure.arrayKeys.length} arrays`);
  });

  // 生成组件
  console.log('\n🔨 生成组件...');
  analyses.forEach(analysis => {
    const componentCode = generateOptimizedComponent(analysis);
    const componentName = analysis.sectionName.charAt(0).toUpperCase() + analysis.sectionName.slice(1) + 'Section';
    const componentPath = path.join(SECTIONS_DIR, `${componentName}.tsx`);
    
    fs.writeFileSync(componentPath, componentCode);
    console.log(`  ✅ ${componentName}.tsx`);
  });

  // 生成文档
  console.log('\n📝 生成文档...');
  const docs = generateContentEditingDocs(analyses);
  const docsPath = path.join(DOCS_DIR, 'dynamic-content-editing.md');
  fs.writeFileSync(docsPath, docs);
  console.log(`  ✅ dynamic-content-editing.md`);

  console.log('\n✨ 构建完成！');
  console.log('\n💡 提示:');
  console.log('  - 内容编辑者现在可以自由修改 content/ 目录下的markdown文件');
  console.log('  - 组件会自动适应内容结构变化');
  console.log('  - 运行 npm run build:sections 重新生成优化的组件');
}

if (require.main === module) {
  main();
}

module.exports = { main, analyzeMarkdownStructure, generateOptimizedComponent };