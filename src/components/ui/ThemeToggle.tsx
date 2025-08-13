import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { toggleDarkMode, initializeDarkMode } from '../../utils/themeUtils';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Initialize dark mode using centralized utility
    const darkModeEnabled = initializeDarkMode();
    setIsDark(darkModeEnabled);
  }, []);

  const handleToggle = () => {
    const newDarkMode = toggleDarkMode();
    setIsDark(newDarkMode);
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-lg bg-secondary hover:bg-accent transition-colors duration-200"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-foreground" />
      ) : (
        <Moon className="h-5 w-5 text-foreground" />
      )}
    </button>
  );
}
