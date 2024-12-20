import Navigation from './components/layout/Navigation';
import HeroSection from './components/sections/HeroSection';
import TechnologySection from './components/sections/TechnologySection';
import InvestmentSection from './components/sections/InvestmentSection';
import PerformanceSection from './components/sections/PerformanceSection';

function App() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navigation />
      <HeroSection />
      <TechnologySection />
      <InvestmentSection />
      <PerformanceSection />
    </main>
  );
}

export default App;
