import { useEffect, useState } from 'react';
import { getDynamicContent, DynamicContentResponse } from '../../lib/dynamicContent';

const HeroSection: React.FC = () => {
  const [content, setContent] = useState<DynamicContentResponse | null>(null);

  useEffect(() => {
    getDynamicContent('hero').then((data) => setContent(data));
  }, []);

  if (!content) return null;

  const { frontmatter } = content;

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={frontmatter.background}
          alt="Hero Background"
          className="object-cover w-full h-full opacity-20 dark:opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 to-background/50 dark:from-black/20 dark:to-black/50 z-10" />
      </div>
      <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-sm sm:text-base uppercase tracking-widest text-muted-foreground mb-6">
          {frontmatter.title}
        </h2>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8">
          {frontmatter.heading}
        </h1>
        {frontmatter.cta && (
          <a
            href={frontmatter.cta.link}
            className="inline-block bg-primary text-primary-foreground px-8 py-3 text-sm uppercase tracking-wider font-medium hover:bg-primary/90 transition-colors rounded-lg"
          >
            {frontmatter.cta.text}
          </a>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
