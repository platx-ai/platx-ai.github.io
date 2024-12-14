import React from 'react';

const InvestmentSection: React.FC = () => {
  return (
    <section id="investment" className="relative min-h-screen bg-black text-white py-24">
      <div className="absolute inset-0 z-0">
        <img
          src="/images/backgrounds/investment-tech.jpg"
          alt="Global Technology Network"
          className="object-cover w-full h-full opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/50 z-10" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm sm:text-base uppercase tracking-widest text-gray-400 mb-6">
            Investment Strategy
          </h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8">
            Scientific Investment Approach
          </h3>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Combining advanced AI technology with traditional investment wisdom to create a new paradigm in asset management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-gray-900 p-8 rounded-lg">
            <h4 className="text-2xl font-semibold mb-6">Qualified Investors</h4>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start">
                <span className="text-white mr-2">•</span>
                Minimum investment: 1 million RMB
              </li>
              <li className="flex items-start">
                <span className="text-white mr-2">•</span>
                Net financial assets ≥ 3 million RMB
              </li>
              <li className="flex items-start">
                <span className="text-white mr-2">•</span>
                Average annual income ≥ 500,000 RMB
              </li>
            </ul>
          </div>

          <div className="bg-gray-900 p-8 rounded-lg">
            <h4 className="text-2xl font-semibold mb-6">Investment Process</h4>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start">
                <span className="text-white mr-2">•</span>
                AI-driven market analysis
              </li>
              <li className="flex items-start">
                <span className="text-white mr-2">•</span>
                Risk assessment and optimization
              </li>
              <li className="flex items-start">
                <span className="text-white mr-2">•</span>
                Real-time portfolio adjustment
              </li>
              <li className="flex items-start">
                <span className="text-white mr-2">•</span>
                Continuous performance monitoring
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvestmentSection;
