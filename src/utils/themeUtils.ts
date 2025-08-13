// 集中的主题管理工具

export type BackgroundScheme = 'geometric' | 'natural' | 'gradient';

export const applyBackgroundScheme = (scheme: BackgroundScheme) => {
  const body = document.body;
  
  // Remove existing scheme classes
  body.classList.remove('bg-scheme-geometric', 'bg-scheme-natural', 'bg-scheme-gradient');
  
  // Add new scheme class
  body.classList.add(`bg-scheme-${scheme}`);
  
  // Store preference
  localStorage.setItem('backgroundScheme', scheme);
};

export const getCurrentScheme = (): BackgroundScheme => {
  const saved = localStorage.getItem('backgroundScheme') as BackgroundScheme;
  return saved && ['geometric', 'natural', 'gradient'].includes(saved) ? saved : 'geometric';
};

export const initializeTheme = () => {
  const scheme = getCurrentScheme();
  applyBackgroundScheme(scheme);
  return scheme;
};

// 主题切换工具
export const toggleDarkMode = () => {
  const html = document.documentElement;
  const isDark = html.classList.contains('dark');
  
  if (isDark) {
    html.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    html.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
  
  return !isDark;
};

export const initializeDarkMode = () => {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
    return true;
  } else {
    document.documentElement.classList.remove('dark');
    return false;
  }
};
