import { useEffect, useState } from 'react';
import { getContent, InvestmentFrontmatter, ContentResponse } from '../../lib/content';

const InvestmentSection: React.FC = () => {
  const [content, setContent] = useState<ContentResponse | null>(null);

  useEffect(() => {
    getContent('investment').then((data) => setContent(data));
  }, []);

  if (!content) return null;

  const { frontmatter } = content as { frontmatter: InvestmentFrontmatter };

  return (
    <section id="investment" className="relative min-h-screen py-24">
      <div className="absolute inset-0 z-0">
        <img
          src={frontmatter.background}
          alt="Global Technology Network"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="theme-card p-8">
            <h4 className="text-2xl font-semibold mb-6">{frontmatter.qualifiedInvestors.title}</h4>
            <ul className="space-y-4 text-muted-foreground">
              {frontmatter.qualifiedInvestors.requirements.map((requirement: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="text-foreground mr-2">•</span>
                  {requirement}
                </li>
              ))}
            </ul>
          </div>

          <div className="theme-card p-8">
            <h4 className="text-2xl font-semibold mb-6">{frontmatter.methodology.title}</h4>
            <ul className="space-y-4 text-muted-foreground">
              {frontmatter.methodology.pillars.map((pillar: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="text-foreground mr-2">•</span>
                  {pillar}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvestmentSection;
