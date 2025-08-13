import { useEffect } from 'react';
import Navigation from './components/layout/Navigation';
import HeroSection from './components/sections/HeroSection';
import TechnologySection from './components/sections/TechnologySection';
import InvestmentSection from './components/sections/InvestmentSection';
import PerformanceSection from './components/sections/PerformanceSection';
import { initializeTheme, initializeDarkMode } from './utils/themeUtils';

function App() {
  useEffect(() => {
    // Initialize both dark mode and background scheme
    initializeDarkMode();
    initializeTheme();
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />
      <HeroSection />
      <TechnologySection />
      <InvestmentSection />
      <PerformanceSection />
    </main>
  );
}

export default App;
