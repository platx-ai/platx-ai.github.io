import React, { useEffect, useState } from 'react';
import { getContent, ContentResponse, ReportFrontmatter } from '../../lib/content';

const ReportSection: React.FC = () => {
  const [content, setContent] = useState<ContentResponse | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    getContent('report').then((data) => setContent(data));
  }, []);

  if (!content) return null;

  const frontmatter = content.frontmatter as ReportFrontmatter;
  const markdownContent = content.content;

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  const createMarkup = () => {
    return { __html: markdownContent };
  };

  return (
    <section id="report" className="relative min-h-screen bg-black text-white py-24">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={frontmatter.background}
          alt="Global Tax Analysis Background"
          className="object-cover w-full h-full opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/50 z-10" />
      </div>

      {/* Content container */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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

        {/* Section navigation */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            {frontmatter.sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>

        {/* Report content */}
        <div className="bg-gray-900 bg-opacity-80 rounded-lg p-8 shadow-xl">
          <div 
            className="prose prose-invert prose-lg max-w-none"
            dangerouslySetInnerHTML={createMarkup()} 
          />
        </div>
      </div>
    </section>
  );
};

export default ReportSection;
