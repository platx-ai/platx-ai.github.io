import { useEffect, useState } from 'react';
import { getDynamicContent, DynamicContentResponse, contentUtils } from '../../lib/dynamicContent';

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
