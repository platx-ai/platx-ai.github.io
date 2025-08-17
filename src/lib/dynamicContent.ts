import frontMatter from 'front-matter';

// 通用的frontmatter接口
export interface DynamicFrontmatter {
  title: string;
  heading: string;
  description?: string;
  background?: string;
  [key: string]: any; // 允许任意额外属性
}

// 通用的内容响应类型
export interface DynamicContentResponse {
  frontmatter: DynamicFrontmatter;
  content: string;
}

// 动态获取内容的函数
export async function getDynamicContent(section: string): Promise<DynamicContentResponse> {
  try {
    const response = await fetch(`/${section}/index.md`);
    if (!response.ok) {
      throw new Error(`Failed to fetch content for section ${section}`);
    }

    const rawContent = await response.text();
    const { attributes, body } = frontMatter(rawContent);

    return {
      frontmatter: attributes as DynamicFrontmatter,
      content: body
    };
  } catch (error) {
    console.error(`Error loading content for section ${section}:`, error);
    throw error;
  }
}

// 内容类型检测工具
export const contentUtils = {
  // 检测是否有features数组
  hasFeatures: (frontmatter: DynamicFrontmatter): boolean => {
    return frontmatter.features && Array.isArray(frontmatter.features);
  },

  // 检测是否有metrics数组
  hasMetrics: (frontmatter: DynamicFrontmatter): boolean => {
    return frontmatter.metrics && Array.isArray(frontmatter.metrics);
  },

  // 获取所有对象类型的内容键
  getObjectKeys: (frontmatter: DynamicFrontmatter): string[] => {
    return Object.keys(frontmatter).filter(
      key => !['title', 'heading', 'description', 'background'].includes(key) &&
             frontmatter[key] && 
             typeof frontmatter[key] === 'object' && 
             !Array.isArray(frontmatter[key])
    );
  },

  // 获取数组类型的内容键
  getArrayKeys: (frontmatter: DynamicFrontmatter): string[] => {
    return Object.keys(frontmatter).filter(
      key => !['title', 'heading', 'description', 'background'].includes(key) &&
             frontmatter[key] && 
             Array.isArray(frontmatter[key])
    );
  },

  // 检测对象是否有特定的数组属性
  hasArrayProperty: (obj: any, ...props: string[]): boolean => {
    return props.some(prop => obj[prop] && Array.isArray(obj[prop]));
  }
};