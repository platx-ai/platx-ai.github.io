import React from 'react';

const PerformanceSection: React.FC = () => {
  return (
    <section id="performance" className="min-h-screen bg-black text-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm sm:text-base uppercase tracking-widest text-gray-400 mb-6">
            Performance
          </h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8">
            Proven Track Record
          </h3>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Our AI-driven investment strategies have consistently delivered superior returns while maintaining robust risk management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            {
              metric: 'Risk-Adjusted Return',
              value: '15.8%',
              description: 'Average annual return',
            },
            {
              metric: 'Assets Under Management',
              value: '¥10B+',
              description: 'Total managed assets',
            },
            {
              metric: 'Client Satisfaction',
              value: '98%',
              description: 'Retention rate',
            },
          ].map((stat) => (
            <div
              key={stat.metric}
              className="bg-gray-900 p-8 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <h4 className="text-lg font-medium text-gray-400 mb-2">{stat.metric}</h4>
              <p className="text-4xl font-bold mb-2">{stat.value}</p>
              <p className="text-gray-400">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PerformanceSection;
