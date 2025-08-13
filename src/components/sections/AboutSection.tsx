import { useEffect, useState } from 'react';
import { getContent, AboutFrontmatter, ContentResponse } from '../../lib/content';

const AboutSection: React.FC = () => {
  const [content, setContent] = useState<ContentResponse | null>(null);

  useEffect(() => {
    getContent('about').then((data) => setContent(data));
  }, []);

  if (!content) return null;

  const { frontmatter } = content as { frontmatter: AboutFrontmatter };

  return (
    <section id="about" className="relative min-h-screen py-24">
      <div className="absolute inset-0 z-0">
        <img
          src={frontmatter.background}
          alt="About Background"
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

export default AboutSection;
