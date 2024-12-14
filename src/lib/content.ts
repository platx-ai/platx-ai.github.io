import frontMatter from 'front-matter';

// Common frontmatter properties
interface BaseFrontmatter {
  title: string;
  heading: string;
  description?: string;
}

// Hero section frontmatter
interface HeroFrontmatter extends BaseFrontmatter {
  background: string;
  cta: {
    text: string;
    link: string;
  };
}

// Technology section frontmatter
interface TechnologyFrontmatter extends BaseFrontmatter {
  background: string;
  features: Array<{
    title: string;
    description: string;
  }>;
}

// Investment section frontmatter
interface InvestmentFrontmatter extends BaseFrontmatter {
  background: string;
  qualifiedInvestors: {
    title: string;
    requirements: string[];
  };
  process: {
    title: string;
    steps: string[];
  };
}

// Performance section frontmatter
interface PerformanceFrontmatter extends BaseFrontmatter {
  metrics: Array<{
    title: string;
    value: string;
    description: string;
  }>;
}

// Union type for all possible frontmatter types
type SectionFrontmatter =
  | HeroFrontmatter
  | TechnologyFrontmatter
  | InvestmentFrontmatter
  | PerformanceFrontmatter;

// Content response type
interface ContentResponse {
  frontmatter: SectionFrontmatter;
  content: string;
}

export async function getContent(section: string): Promise<ContentResponse> {
  try {
    // Fetch markdown content using fetch API without 'content' prefix
    const response = await fetch(`/${section}/index.md`);
    if (!response.ok) {
      throw new Error(`Failed to fetch content for section ${section}`);
    }

    const rawContent = await response.text();
    const { attributes, body } = frontMatter(rawContent);

    return {
      frontmatter: attributes as SectionFrontmatter,
      content: body
    };
  } catch (error) {
    console.error(`Error loading content for section ${section}:`, error);
    throw error;
  }
}

export type {
  HeroFrontmatter,
  TechnologyFrontmatter,
  InvestmentFrontmatter,
  PerformanceFrontmatter,
  SectionFrontmatter,
  ContentResponse
};
