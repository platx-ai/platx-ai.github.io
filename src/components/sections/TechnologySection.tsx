import React from 'react';

const TechnologySection: React.FC = () => {
  return (
    <section id="technology" className="relative min-h-screen bg-black text-white py-24">
      <div className="absolute inset-0 z-0">
        <img
          src="/images/backgrounds/mission-control.jpg"
          alt="SpaceX Rocket Launch"
          className="object-cover w-full h-full opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/50 z-10" />
      </div>
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm sm:text-base uppercase tracking-widest text-gray-400 mb-6">
            AI Technology
          </h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8">
            Advanced Investment Intelligence
          </h3>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Leveraging cutting-edge artificial intelligence and machine learning to revolutionize asset management and deliver superior returns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Machine Learning',
              description: 'Advanced algorithms analyzing market patterns and trends',
            },
            {
              title: 'Big Data Analytics',
              description: 'Processing vast amounts of financial data in real-time',
            },
            {
              title: 'Predictive Models',
              description: 'AI-driven forecasting for strategic investment decisions',
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-gray-900 p-8 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <h4 className="text-xl font-semibold mb-4">{feature.title}</h4>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechnologySection;
