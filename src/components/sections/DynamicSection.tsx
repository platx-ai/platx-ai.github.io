import { useEffect, useState } from 'react';
import { getDynamicContent, DynamicContentResponse, contentUtils } from '../../lib/dynamicContent';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ArrowRight } from 'lucide-react';

interface DynamicSectionProps {
  sectionId: string;
  className?: string;
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

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;
  if (!content) return null;

  const { frontmatter } = content;

  // 渲染列表项
  const renderList = (items: string[]) => {
    if (!Array.isArray(items)) return null;
    return items.map((item: string, index: number) => (
      <li key={index} className="flex items-start">
        <span className="text-foreground mr-2">•</span>
        {item}
      </li>
    ));
  };

  // 渲染特性卡片
  const renderFeatures = (features: Array<{title: string, description: string}>) => {
    return features.map((feature) => (
      <div key={feature.title} className="theme-card p-8">
        <h4 className="text-xl font-semibold mb-4">{feature.title}</h4>
        <p className="text-muted-foreground">{feature.description}</p>
      </div>
    ));
  };

  // 渲染指标卡片
  const renderMetrics = (metrics: Array<{title: string, value: string, description: string}>) => {
    return metrics.map((metric) => (
      <div key={metric.title} className="theme-card p-8 text-center">
        <h4 className="text-lg font-medium text-muted-foreground mb-2">{metric.title}</h4>
        <p className="text-4xl font-bold mb-2">{metric.value}</p>
        <p className="text-muted-foreground">{metric.description}</p>
      </div>
    ));
  };

  // 渲染对象卡片
  const renderObjectCard = (obj: any, title: string) => {
    if (!obj || typeof obj !== 'object') return null;
    
    return (
      <div key={title} className="theme-card p-8">
        <h4 className="text-2xl font-semibold mb-6">{obj.title || title}</h4>
        <div className="space-y-4 text-muted-foreground">
          {obj.requirements && (
            <ul className="space-y-4">
              {renderList(obj.requirements)}
            </ul>
          )}
          {obj.steps && (
            <ul className="space-y-4">
              {renderList(obj.steps)}
            </ul>
          )}
          {obj.pillars && (
            <ul className="space-y-4">
              {renderList(obj.pillars)}
            </ul>
          )}
          {obj.components && (
            <ul className="space-y-4">
              {renderList(obj.components)}
            </ul>
          )}
          {obj.capabilities && (
            <div className="mt-4">
              <h5 className="text-foreground font-medium mb-2">Capabilities:</h5>
              <ul className="space-y-2">
                {renderList(obj.capabilities)}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 动态渲染内容区域
  const renderContentArea = () => {
    // Research: Featured Report layout driven by frontmatter
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
          {/* Intro paragraphs */}
          {(frontmatter.intro && Array.isArray(frontmatter.intro)) && (
            <div className="mt-4 space-y-3 text-muted-foreground max-w-5xl mx-auto lg:mx-0">
              {frontmatter.intro.slice(0, 2).map((p: string, idx: number) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          )}

          {/* 4. Featured Report */}
          <Card role="region" aria-label="Featured REALM Weekly report" className="mt-8 border-border/60">
            <div className="grid gap-6 p-6 sm:grid-cols-5 sm:gap-8 lg:grid-cols-12 lg:gap-10">
              {/* 4a. Cover */}
              <div className="sm:col-span-2 lg:col-span-3">
                <a href={fr.pdfUrl} aria-label="Open REALM Weekly PDF">
                  <AspectRatio ratio={3/4} className="overflow-hidden rounded-md border bg-muted">
                    <img
                      src={fr.coverImage || '/images/backgrounds/mission-control.jpg'}
                      alt={fr.coverAlt || 'REALM Weekly cover thumbnail'}
                      className="h-full w-full object-cover"
                    />
                  </AspectRatio>
                </a>
              </div>

              {/* 4b. Info */}
              <div className="sm:col-span-3 lg:col-span-6 flex flex-col justify-center">
                <div>
                  <h3 className="text-lg font-semibold text-foreground sm:text-xl">
                    {fr.title || 'REALM Weekly — Latest Issue'}
                  </h3>
                  {fr.summary && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {fr.summary}
                    </p>
                  )}
                </div>
              </div>

              {/* 4c. Primary Action */}
              <div className="lg:col-span-3 flex items-center justify-start sm:justify-end">
                <div className="flex flex-col items-center gap-3">
                  <a href={fr.pdfUrl} aria-label="Open REALM Weekly PDF">
                    <Button size="icon" className="h-14 w-14 rounded-full bg-foreground text-background hover:bg-foreground/90">
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

          {/* Helper note */}
          {frontmatter.helperNote && (
            <p className="mt-4 text-sm text-muted-foreground">
              {frontmatter.helperNote}
            </p>
          )}
        </div>
      );
    }

    // 如果有features数组，渲染为特性网格
    if (contentUtils.hasFeatures(frontmatter)) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {renderFeatures(frontmatter.features)}
        </div>
      );
    }

    // 如果有metrics数组，渲染为指标网格
    if (contentUtils.hasMetrics(frontmatter)) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {renderMetrics(frontmatter.metrics)}
        </div>
      );
    }

    // 渲染其他对象为卡片
    const objectKeys = contentUtils.getObjectKeys(frontmatter);
    if (objectKeys.length > 0) {
      const gridCols = objectKeys.length === 1 ? 'grid-cols-1' : 
                      objectKeys.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 
                      'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      
      return (
        <div className={`grid ${gridCols} gap-12`}>
          {objectKeys.map(key => renderObjectCard(frontmatter[key], key))}
        </div>
      );
    }

    return null;
  };

  // 确定是否有背景图片
  const hasBackground = frontmatter.background;

  return (
    <section 
      id={sectionId} 
      className={`relative min-h-screen py-24 ${className}`}
    >
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
        {/* 标题区域 */}
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

        {/* 动态内容区域 */}
        {renderContentArea()}
      </div>
    </section>
  );
};

export default DynamicSection;
