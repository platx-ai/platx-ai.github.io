import { useState, useEffect } from 'react';
import { Palette, Grid3X3, Sparkles, Layers } from 'lucide-react';

type BackgroundScheme = 'geometric' | 'natural' | 'gradient';

interface SchemeOption {
  id: BackgroundScheme;
  name: string;
  description: string;
  icon: React.ReactNode;
  preview: string;
}

export default function BackgroundSchemeSelector() {
  const [currentScheme, setCurrentScheme] = useState<BackgroundScheme>('geometric');
  const [isOpen, setIsOpen] = useState(false);

  const schemes: SchemeOption[] = [
    {
      id: 'geometric',
      name: '极简几何',
      description: '简洁的几何纹理，营造现代科技感',
      icon: <Grid3X3 className="h-4 w-4" />,
      preview: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
    },
    {
      id: 'natural',
      name: '自然光晕',
      description: '低饱和度的自然光效，温和舒适',
      icon: <Sparkles className="h-4 w-4" />,
      preview: 'radial-gradient(ellipse, rgba(251,191,36,0.1) 0%, rgba(255,255,255,0.95) 70%)'
    },
    {
      id: 'gradient',
      name: '微渐变材质',
      description: '精致的渐变效果，层次丰富',
      icon: <Layers className="h-4 w-4" />,
      preview: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.95) 100%)'
    }
  ];

  useEffect(() => {
    // Load saved scheme preference
    const savedScheme = localStorage.getItem('backgroundScheme') as BackgroundScheme;
    if (savedScheme && schemes.find(s => s.id === savedScheme)) {
      setCurrentScheme(savedScheme);
      applyScheme(savedScheme);
    } else {
      // Apply default scheme immediately
      setCurrentScheme('geometric');
      applyScheme('geometric');
    }
  }, []);

  const applyScheme = (scheme: BackgroundScheme) => {
    const body = document.body;
    
    // Remove existing scheme classes
    body.classList.remove('bg-scheme-geometric', 'bg-scheme-natural', 'bg-scheme-gradient');
    
    // Add new scheme class
    body.classList.add(`bg-scheme-${scheme}`);
    
    // Store preference
    localStorage.setItem('backgroundScheme', scheme);
  };

  const handleSchemeChange = (scheme: BackgroundScheme) => {
    setCurrentScheme(scheme);
    applyScheme(scheme);
    localStorage.setItem('backgroundScheme', scheme);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-secondary hover:bg-accent transition-colors duration-200 flex items-center gap-2"
        aria-label="选择背景方案"
      >
        <Palette className="h-5 w-5 text-foreground" />
        {/* <span className="hidden sm:inline text-sm text-foreground">背景</span> */}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50 p-4">
            <h3 className="text-sm font-medium text-foreground mb-3">选择背景方案</h3>
            <div className="space-y-3">
              {schemes.map((scheme) => (
                <button
                  key={scheme.id}
                  onClick={() => handleSchemeChange(scheme.id)}
                  className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
                    currentScheme === scheme.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 hover:bg-accent/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-8 h-8 rounded border border-border flex-shrink-0"
                      style={{ background: scheme.preview }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {scheme.icon}
                        <span className="font-medium text-foreground text-sm">
                          {scheme.name}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {scheme.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}