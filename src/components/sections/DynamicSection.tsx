import { useEffect, useState, ReactNode } from 'react';
import { getDynamicContent, DynamicContentResponse, contentUtils } from '../../lib/dynamicContent';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { slugify } from '@/lib/slug';
import AITierCard from './AITierCard';

interface DynamicSectionProps {
  sectionId: string;
  className?: string;
}

// Utilities
function childrenToText(children: ReactNode): string {
  if (children === null || children === undefined) return '';
  if (typeof children === 'string' || typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(childrenToText).join('');
  if (typeof children === 'object' && 'props' in (children as any)) {
    return childrenToText((children as any).props?.children);
  }
  return '';
}

const DynamicSection: React.FC<DynamicSectionProps> = ({ sectionId, className = '' }) => {
  const [content, setContent] = useState<DynamicContentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDynamicContent(sectionId)
      .then((data) => {
        setContent(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [sectionId]);

  // Custom preprocessor to handle AITierCard syntax
  const preprocessMarkdown = (markdown: string) => {
    // Replace <AITierCard> blocks with a special marker that we'll handle in rendering
    return markdown.replace(
      /<AITierCard\s*(?:tier="([^"]*)")?\s*(?:title="([^"]*)")?\s*(?:description="([^"]*)")?\s*(?:formula="([^"]*)")?\s*(?:delay="([^"]*)")?\s*\/?>[\s\S]*?(?:<\/AITierCard>)?/gi,
      (_, tier, title, description, formula, delay) => {
        return `__AITIERCARD__${JSON.stringify({
          tier: tier || '1',
          title: title || '',
          description: description || '',
          formula: formula || '',
          delay: delay || '0'
        })}__AITIERCARD__`;
      }
    );
  };

  const md = preprocessMarkdown(content?.content ?? '');

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;
  if (!content) return null;

  const { frontmatter } = content;

  const renderList = (items: string[]) => {
    if (!Array.isArray(items)) return null;
    return items.map((item: string, index: number) => (
      <li key={index} className="flex items-start">
        <span className="text-foreground mr-2">•</span>
        {item}
      </li>
    ));
  };

  const renderFeatures = (features: Array<{ title: string; description: string; formula?: string }>) => {
    return features.map((feature, index) => {
      // Check if this is an AI tier feature with formula
      if (feature.formula) {
        const tierMatch = feature.title.match(/Tier (\d+)/);
        const tier = tierMatch ? parseInt(tierMatch[1]) : index + 1;
        
        return (
          <AITierCard
            key={feature.title}
            tier={tier}
            title={feature.title}
            description={feature.description}
            formula={feature.formula}
            delay={index * 200}
          />
        );
      }
      
      // Default feature card with enhanced styling
      return (
        <Card key={feature.title} className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative p-8">
            <h4 className="text-xl font-semibold mb-4 text-foreground group-hover:text-primary transition-colors duration-300">{feature.title}</h4>
            <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
          </div>
        </Card>
      );
    });
  };

  const renderMetrics = (metrics: Array<{ title: string; value: string; description: string }>) => {
    return metrics.map((metric) => (
      <div key={metric.title} className="theme-card p-8 text-center">
        <h4 className="text-lg font-medium text-muted-foreground mb-2">{metric.title}</h4>
        <p className="text-4xl font-bold mb-2">{metric.value}</p>
        <p className="text-muted-foreground">{metric.description}</p>
      </div>
    ));
  };

  const renderObjectCard = (obj: any, title: string) => {
    if (!obj || typeof obj !== 'object') return null;

    return (
      <div key={title} className="theme-card p-8">
        <h4 className="text-2xl font-semibold mb-6">{obj.title || title}</h4>
        <div className="space-y-4 text-muted-foreground">
          {obj.requirements && <ul className="space-y-4">{renderList(obj.requirements)}</ul>}
          {obj.steps && <ul className="space-y-4">{renderList(obj.steps)}</ul>}
          {obj.pillars && <ul className="space-y-4">{renderList(obj.pillars)}</ul>}
          {obj.components && <ul className="space-y-4">{renderList(obj.components)}</ul>}
          {obj.capabilities && (
            <div className="mt-4">
              <h5 className="text-foreground font-medium mb-2">Capabilities:</h5>
              <ul className="space-y-2">{renderList(obj.capabilities)}</ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Custom renderer for handling AITierCard markers with proper grid layout
  const renderMarkdownWithAITierCards = (markdown: string) => {
    const parts = markdown.split(/(__AITIERCARD__.*?__AITIERCARD__)/);
    const result: React.ReactNode[] = [];
    let currentCardGroup: any[] = [];
    
    parts.forEach((part, index) => {
      if (part.startsWith('__AITIERCARD__') && part.endsWith('__AITIERCARD__')) {
        try {
          const jsonStr = part.replace(/^__AITIERCARD__/, '').replace(/__AITIERCARD__$/, '');
          const props = JSON.parse(jsonStr);
          currentCardGroup.push({
            ...props,
            tier: parseInt(props.tier) || 1,
            delay: parseInt(props.delay) || 0,
            key: index
          });
        } catch (e) {
          console.error('Failed to parse AITierCard props:', e);
        }
      } else if (part.trim()) {
        // If we have accumulated cards, render them as a grid first
        if (currentCardGroup.length > 0) {
          result.push(
            <div key={`card-group-${result.length}`} className="grid grid-cols-1 md:grid-cols-3 gap-8 my-8">
              {currentCardGroup.map((cardProps) => (
                <AITierCard
                  key={cardProps.key}
                  tier={cardProps.tier}
                  title={cardProps.title}
                  description={cardProps.description}
                  formula={cardProps.formula}
                  delay={cardProps.delay}
                />
              ))}
            </div>
          );
          currentCardGroup = [];
        }
        
        // Regular markdown content
        result.push(
          <ReactMarkdown
            key={index}
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              h1: ({ children }) => {
                const text = childrenToText(children);
                const id = slugify(text);
                return <h1 id={id} className="text-3xl md:text-4xl font-bold tracking-tight mt-8 mb-4">{children}</h1>;
              },
              h2: ({ children }) => {
                const text = childrenToText(children);
                const id = slugify(text);
                return <h2 id={id} className="text-2xl md:text-3xl font-semibold mt-8 mb-4">{children}</h2>;
              },
              h3: ({ children }) => {
                const text = childrenToText(children);
                const id = slugify(text);
                return <h3 id={id} className="text-xl md:text-2xl font-semibold mt-6 mb-3">{children}</h3>;
              },
              p: ({ children }) => <p className="leading-7 text-muted-foreground mb-4">{children}</p>,
              ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
              li: ({ children }) => <li className="leading-7">{children}</li>,
              strong: ({ children }) => <strong className="text-foreground font-semibold">{children}</strong>,
              em: ({ children }) => <em className="italic">{children}</em>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-border pl-4 py-2 my-4 text-muted-foreground">{children}</blockquote>
              ),
              code: ({ className, children, ...props }: any) => {
                const text = String(children).replace(/\n$/, '');
                const inline = !className?.includes('language-');
                if (inline) {
                  return (
                    <code className="rounded bg-muted px-1.5 py-0.5 text-sm text-foreground" {...props}>
                      {text}
                    </code>
                  );
                }
                return (
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                    <code className={className} {...props}>
                      {text}
                    </code>
                  </pre>
                );
              },
              a: ({ href, children }) => (
                <a href={href} className="text-foreground underline underline-offset-4 hover:opacity-80">
                  {children}
                </a>
              ),
              hr: () => <hr className="my-8 border-border/70" />,
              img: ({ src, alt }) => (
                <img src={src || ''} alt={alt || ''} className="rounded-md border border-border my-4" />
              ),
              table: ({ children }) => (
                <div className="my-4 overflow-x-auto rounded-md border border-border">
                  <table className="w-full text-sm">{children}</table>
                </div>
              ),
              thead: ({ children }) => <thead className="bg-muted/40">{children}</thead>,
              th: ({ children }) => <th className="px-3 py-2 text-left font-medium">{children}</th>,
              td: ({ children }) => <td className="px-3 py-2 border-t border-border/60">{children}</td>,
            }}
          >
            {part}
          </ReactMarkdown>
        );
      }
    });
    
    // Handle any remaining cards at the end
    if (currentCardGroup.length > 0) {
      result.push(
        <div key={`card-group-${result.length}`} className="grid grid-cols-1 md:grid-cols-3 gap-8 my-8">
          {currentCardGroup.map((cardProps) => (
            <AITierCard
              key={cardProps.key}
              tier={cardProps.tier}
              title={cardProps.title}
              description={cardProps.description}
              formula={cardProps.formula}
              delay={cardProps.delay}
            />
          ))}
        </div>
      );
    }
    
    return result;
  };

  const MarkdownBody = <div>{renderMarkdownWithAITierCards(md)}</div>;

  const renderContentArea = () => {
    // 1) Panda Story layout - special layout for about page
    if (frontmatter.layout === 'panda-story' && frontmatter.pandaImage) {
      // Split markdown content by sections
      const sections = md.split(/^---$/gm);
      const pandaStorySection = sections[0] || '';
      const remainingContent = sections.slice(1).join('---');

      return (
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Row 1: Panda image + Panda Story */}
          <div className="flex flex-col lg:grid lg:grid-cols-5 gap-6 lg:gap-8 items-start">
            {/* Panda image - responsive sizing */}
            <div className="w-full lg:col-span-2">
              <div className="max-w-sm mx-auto lg:max-w-md lg:mx-0">
                <AspectRatio 
                  ratio={3 / 2} 
                  className="overflow-hidden rounded-md border border-border/30 bg-muted cursor-pointer group relative"
                  onClick={() => {
                    const fullImageUrl = frontmatter.pandaImageFull || frontmatter.pandaImage;
                    if (fullImageUrl) {
                      window.open(fullImageUrl, '_blank');
                    }
                  }}
                >
                  <img
                    src={frontmatter.pandaImage}
                    alt="Panda mascot representing Renaissance Era - Click to view full size"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 text-white px-3 py-1 rounded-md text-sm">
                      Click to view full size
                    </div>
                  </div>
                </AspectRatio>
              </div>
            </div>
            
            {/* Panda Story Content - full width on mobile, takes more space on desktop */}
            <div className="w-full lg:col-span-3">
              <div>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={{
                    h1: ({ children }) => {
                      const text = childrenToText(children);
                      const id = slugify(text);
                      return <h1 id={id} className="text-3xl md:text-4xl font-bold tracking-tight mb-6">{children}</h1>;
                    },
                    p: ({ children }) => <p className="leading-7 text-muted-foreground mb-4">{children}</p>,
                    strong: ({ children }) => <strong className="text-foreground font-semibold">{children}</strong>,
                    em: ({ children }) => <em className="italic">{children}</em>,
                  }}
                >
                  {pandaStorySection}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          {/* Row 2: Remaining content (Join Our Team + Contact Information) */}
          {remainingContent && (
            <div className="w-full">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  h1: ({ children }) => {
                    const text = childrenToText(children);
                    const id = slugify(text);
                    return <h1 id={id} className="text-3xl md:text-4xl font-bold tracking-tight mt-12 mb-6">{children}</h1>;
                  },
                  h2: ({ children }) => {
                    const text = childrenToText(children);
                    const id = slugify(text);
                    return <h2 id={id} className="text-2xl md:text-3xl font-semibold mt-8 mb-4">{children}</h2>;
                  },
                  p: ({ children }) => <p className="leading-7 text-muted-foreground mb-4">{children}</p>,
                  strong: ({ children }) => <strong className="text-foreground font-semibold">{children}</strong>,
                  em: ({ children }) => <em className="italic">{children}</em>,
                  a: ({ href, children }) => (
                    <a href={href} className="text-foreground underline underline-offset-4 hover:opacity-80">
                      {children}
                    </a>
                  ),
                }}
              >
                {remainingContent}
              </ReactMarkdown>
            </div>
          )}
        </div>
      );
    }

    // 2) Featured Report layout (kept for compatibility)
    if (frontmatter.featuredReport) {
      const fr = frontmatter.featuredReport as {
        pdfUrl: string;
        coverImage?: string;
        coverAlt?: string;
        title?: string;
        summary?: string;
      };

      return (
        <div className="max-w-6xl mx-auto">
          {frontmatter.intro && Array.isArray(frontmatter.intro) && (
            <div className="mt-4 space-y-3 text-muted-foreground max-w-5xl mx-auto lg:mx-0">
              {frontmatter.intro.slice(0, 2).map((p: string, idx: number) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          )}

          <Card role="region" aria-label="Featured report" className="mt-8 border-border/60">
            <div className="grid gap-6 p-6 sm:grid-cols-5 sm:gap-8 lg:grid-cols-12 lg:gap-10">
              <div className="sm:col-span-2 lg:col-span-3">
                <a href={fr.pdfUrl} aria-label="Open PDF">
                  <AspectRatio ratio={3 / 4} className="overflow-hidden rounded-md border bg-muted">
                    <img
                      src={fr.coverImage}
                      alt={fr.coverAlt || 'Report cover thumbnail'}
                      className="h-full w-full object-cover"
                    />
                  </AspectRatio>
                </a>
              </div>

              <div className="sm:col-span-3 lg:col-span-6 flex flex-col justify-center">
                <div>
                  <h3 className="text-lg font-semibold text-foreground sm:text-xl">
                    {fr.title || 'Latest Report'}
                  </h3>
                  {fr.summary && <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{fr.summary}</p>}
                </div>
              </div>

              <div className="lg:col-span-3 flex items-center justify-start sm:justify-end">
                <div className="flex flex-col items-center gap-3">
                  <a href={fr.pdfUrl} aria-label="Open PDF">
                    <Button
                      size="icon"
                      className="h-14 w-14 rounded-full bg-foreground text-background hover:bg-foreground/90"
                    >
                      <ArrowRight className="h-6 w-6" />
                      <span className="sr-only">View PDF</span>
                    </Button>
                  </a>
                  <a href={fr.pdfUrl} className="text-sm font-medium text-foreground hover:underline">
                    View PDF
                  </a>
                </div>
              </div>
            </div>
          </Card>

          {frontmatter.helperNote && <p className="mt-4 text-sm text-muted-foreground">{frontmatter.helperNote}</p>}
        </div>
      );
    }

    // 2) When markdown body exists, render it (with KaTeX) in full width
    if (md && md.trim().length > 0) {
      return (
        <div className="max-w-6xl mx-auto">
          {MarkdownBody}
        </div>
      );
    }

    // 3) Feature / Metric grids
    if (contentUtils.hasFeatures(frontmatter)) {
      return <div className="grid grid-cols-1 md:grid-cols-3 gap-8">{renderFeatures(frontmatter.features)}</div>;
    }

    if (contentUtils.hasMetrics(frontmatter)) {
      return <div className="grid grid-cols-1 md:grid-cols-3 gap-8">{renderMetrics(frontmatter.metrics)}</div>;
    }

    // 4) Generic object cards
    const objectKeys = contentUtils.getObjectKeys(frontmatter);
    if (objectKeys.length > 0) {
      const gridCols =
        objectKeys.length === 1
          ? 'grid-cols-1'
          : objectKeys.length === 2
          ? 'grid-cols-1 md:grid-cols-2'
          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

      return <div className={`grid ${gridCols} gap-12`}>{objectKeys.map((key) => renderObjectCard(frontmatter[key], key))}</div>;
    }

    return null;
  };

  const hasBackground = frontmatter.background;

  return (
    <section id={sectionId} className={`relative min-h-screen py-24 ${className}`}>
      {hasBackground && (
        <>
          <div className="absolute inset-0 z-0">
            <img
              src={frontmatter.background}
              alt={`${frontmatter.title} Background`}
              className="object-cover w-full h-full opacity-15 dark:opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/30 to-background/60 dark:from-black/20 dark:to-black/50 z-10" />
          </div>
        </>
      )}

      <div className={`${hasBackground ? 'relative z-20' : ''} max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`}>
        <div className="text-center mb-16">
          {frontmatter.title && (
            <h2 className="text-sm sm:text-base uppercase tracking-widest text-muted-foreground mb-6">
              {frontmatter.title}
            </h2>
          )}
          {frontmatter.heading && (
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 text-foreground">{frontmatter.heading}</h3>
          )}
          {frontmatter.description && <p className="text-muted-foreground max-w-2xl mx-auto">{frontmatter.description}</p>}
        </div>

        {renderContentArea()}

        {/* If markdown body exists and features/metrics also exist, show them after body */}
        {md && md.trim().length > 0 && (contentUtils.hasFeatures(frontmatter) || contentUtils.hasMetrics(frontmatter)) && (
          <div className="mt-16 space-y-10">
            {contentUtils.hasFeatures(frontmatter) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">{renderFeatures(frontmatter.features)}</div>
            )}
            {contentUtils.hasMetrics(frontmatter) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">{renderMetrics(frontmatter.metrics)}</div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default DynamicSection;