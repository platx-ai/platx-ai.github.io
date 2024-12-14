# Content Editing Guide

## Directory Structure
- `/content/hero/` - Hero section content
- `/content/technology/` - Technology section content
- `/content/investment/` - Investment section content
- `/content/performance/` - Performance section content

## How to Edit Content
1. Navigate to the appropriate section folder
2. Edit the `index.md` file
3. Content is written in Markdown format
4. Metadata is stored in YAML frontmatter

### Frontmatter Format
Each section has specific frontmatter fields that must be included:

#### Hero Section
```yaml
---
title: "Page Title"
heading: "Main Heading"
background: "/_shared/backgrounds/image.jpg"
cta:
  text: "Button Text"
  link: "#section-id"
---
```

#### Technology Section
```yaml
---
title: "Section Title"
heading: "Main Heading"
description: "Section Description"
background: "/_shared/backgrounds/image.jpg"
features:
  - title: "Feature Title"
    description: "Feature Description"
---
```

#### Investment Section
```yaml
---
title: "Section Title"
heading: "Main Heading"
description: "Section Description"
background: "/_shared/backgrounds/image.jpg"
qualifiedInvestors:
  requirements:
    - "Requirement 1"
    - "Requirement 2"
process:
  steps:
    - "Step 1"
    - "Step 2"
---
```

#### Performance Section
```yaml
---
title: "Section Title"
heading: "Main Heading"
description: "Section Description"
metrics:
  - title: "Metric Title"
    value: "Metric Value"
    description: "Metric Description"
---
```

## Image Management
- Place shared images in `content/_shared/backgrounds/`
- Reference images using relative paths: `/_shared/backgrounds/image.jpg`
- Supported formats: jpg, png, webp
- Recommended image dimensions:
  - Hero background: 1920x1080px
  - Section backgrounds: 1920x1080px

## Best Practices
1. Always preview changes locally before committing
2. Use descriptive image filenames
3. Optimize images for web use
4. Keep frontmatter fields in the specified order
5. Validate YAML syntax before saving

## Content Guidelines
1. Keep headings concise and clear
2. Use descriptive alt text for images
3. Maintain consistent tone across sections
4. Follow proper markdown formatting
5. Keep descriptions focused and engaging

## Need Help?
If you encounter any issues or need assistance:
1. Check this documentation first
2. Verify your markdown syntax
3. Ensure all required frontmatter fields are present
4. Contact the development team if issues persist
