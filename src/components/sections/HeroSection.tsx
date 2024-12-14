import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <img
          src="/images/backgrounds/space-satellite.jpg"
          alt="SpaceX-style Satellite in Orbit"
          className="object-cover w-full h-full opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/50 z-10" />
      </div>

      <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-sm sm:text-base uppercase tracking-widest text-gray-400 mb-6">
          AI-Powered Investment
        </h2>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8">
          The Future of Asset Management
        </h1>
        <a
          href="#technology"
          className="inline-block bg-white text-black px-8 py-3 text-sm uppercase tracking-wider font-medium hover:bg-gray-200 transition-colors"
        >
          Learn More
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
