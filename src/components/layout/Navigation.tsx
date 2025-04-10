import React, { useState, MouseEvent } from 'react';
import { Menu } from 'lucide-react';

interface NavigationItem {
  label: string;
  href: string;
}

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems: NavigationItem[] = [
    { label: 'AI Technology', href: '#technology' },
    { label: 'Investment', href: '#investment' },
    { label: 'Performance', href: '#performance' },
    { label: 'Research', href: '#research' },
    { label: 'About', href: '#about' },
    { label: '全球税收分析', href: '#report' },
  ];

  return (
    <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <a href="/" className="text-white text-xl font-bold">
              RENAISSANCE ERA
            </a>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                  onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                    const element = document.querySelector(item.href);
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-sm">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium"
                onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  const element = document.querySelector(item.href);
                  element?.scrollIntoView({ behavior: 'smooth' });
                  setIsOpen(false);
                }}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
