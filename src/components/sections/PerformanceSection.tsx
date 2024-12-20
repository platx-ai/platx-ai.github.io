import { useEffect, useState } from 'react';
import { getContent, PerformanceFrontmatter, ContentResponse } from '../../lib/content';

const PerformanceSection: React.FC = () => {
  const [content, setContent] = useState<ContentResponse | null>(null);

  useEffect(() => {
    getContent('performance').then((data) => setContent(data));
  }, []);

  if (!content) return null;

  const { frontmatter } = content as { frontmatter: PerformanceFrontmatter };

  return (
    <section id="performance" className="min-h-screen bg-black text-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm sm:text-base uppercase tracking-widest text-gray-400 mb-6">
            {frontmatter.title}
          </h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8">
            {frontmatter.heading}
          </h3>
          <p className="text-gray-300 max-w-2xl mx-auto">
            {frontmatter.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {frontmatter.metrics.map((metric) => (
            <div
              key={metric.title}
              className="bg-gray-900 p-8 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <h4 className="text-lg font-medium text-gray-400 mb-2">{metric.title}</h4>
              <p className="text-4xl font-bold mb-2">{metric.value}</p>
              <p className="text-gray-400">{metric.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PerformanceSection;
