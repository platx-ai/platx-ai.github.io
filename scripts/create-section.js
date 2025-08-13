#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Get section name from command line arguments
const sectionName = process.argv[2];

if (!sectionName) {
  console.error('❌ Error: Please provide a section name');
  console.log('Usage: npm run create-section <section-name>');
  console.log('Example: npm run create-section research');
  process.exit(1);
}

// Validate section name
if (!/^[a-z][a-z0-9-]*$/.test(sectionName)) {
  console.error('❌ Error: Section name must start with a lowercase letter and contain only lowercase letters, numbers, and hyphens');
  process.exit(1);
}

// Convert section name to different cases
const pascalCase = sectionName.split('-').map(word => 
  word.charAt(0).toUpperCase() + word.slice(1)
).join('');
const titleCase = sectionName.split('-').map(word => 
  word.charAt(0).toUpperCase() + word.slice(1)
).join(' ');

console.log(`🚀 Creating section: ${titleCase}`);

// Define file paths
const componentPath = `src/components/sections/${pascalCase}Section.tsx`;
const contentDir = `content/${sectionName}`;
const contentPath = `${contentDir}/index.md`;

// Check if section already exists
if (fs.existsSync(componentPath)) {
  console.error(`❌ Error: Section "${sectionName}" already exists at ${componentPath}`);
  process.exit(1);
}

// Create React component template
const componentTemplate = `import { useEffect, useState } from 'react';
import { getContent, ${pascalCase}Frontmatter, ContentResponse } from '../../lib/content';

const ${pascalCase}Section: React.FC = () => {
  const [content, setContent] = useState<ContentResponse | null>(null);

  useEffect(() => {
    getContent('${sectionName}').then((data) => setContent(data));
  }, []);

  if (!content) return null;

  const { frontmatter } = content as { frontmatter: ${pascalCase}Frontmatter };

  return (
    <section id="${sectionName}" className="relative min-h-screen py-24">
      <div className="absolute inset-0 z-0">
        <img
          src={frontmatter.background}
          alt="${titleCase} Background"
          className="object-cover w-full h-full opacity-15 dark:opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 to-background/60 dark:from-black/20 dark:to-black/50 z-10" />
      </div>
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm sm:text-base uppercase tracking-widest text-muted-foreground mb-6">
            {frontmatter.title}
          </h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 text-foreground">
            {frontmatter.heading}
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {frontmatter.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {frontmatter.features.map((feature) => (
            <div
              key={feature.title}
              className="theme-card p-8"
            >
              <h4 className="text-xl font-semibold mb-4">{feature.title}</h4>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ${pascalCase}Section;
`;

// Create content template
const contentTemplate = `---
title: "${titleCase}"
heading: "${titleCase} Overview"
background: "/_shared/backgrounds/default-bg.jpg"
description: "Welcome to the ${titleCase} section. This section provides comprehensive information about our ${sectionName} capabilities."
features:
  - title: "Feature 1"
    description: "Add your first feature description here"
  - title: "Feature 2"
    description: "Add your second feature description here"
  - title: "Feature 3"
    description: "Add your third feature description here"
---

# ${titleCase}

This is the ${titleCase} section content. You can customize this markdown content as needed.

## Overview

This section provides detailed information about ${titleCase}. Edit this content in \`content/${sectionName}/index.md\`.

## Key Features

The features are defined in the frontmatter above and will be automatically rendered by the React component.

## Customization

1. Edit the frontmatter to update the title, heading, background image, and features
2. Modify the React component at \`src/components/sections/${pascalCase}Section.tsx\`
3. Update the background image path in the frontmatter
4. Customize the feature descriptions and add more features as needed
`;

try {
  // Create component file
  const componentDir = path.dirname(componentPath);
  if (!fs.existsSync(componentDir)) {
    fs.mkdirSync(componentDir, { recursive: true });
  }
  fs.writeFileSync(componentPath, componentTemplate);
  console.log(`✅ Created component: ${componentPath}`);

  // Create content directory and file
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }
  fs.writeFileSync(contentPath, contentTemplate);
  console.log(`✅ Created content: ${contentPath}`);

  // Success message
  console.log(`\n🎉 Section "${titleCase}" created successfully!`);
  console.log('\n📝 Next steps:');
  console.log(`1. Import the component: import { ${pascalCase}Section } from '@/components/sections/${pascalCase}Section';`);
  console.log(`2. Add to your App.tsx: <${pascalCase}Section />`);
  console.log(`3. Update navigation links if needed`);
  console.log(`4. Customize the content in: ${contentPath}`);

} catch (error) {
  console.error('❌ Error creating section:', error.message);
  process.exit(1);
}