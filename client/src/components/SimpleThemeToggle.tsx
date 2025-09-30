import React, { useState, useEffect } from 'react';

const SimpleThemeToggle: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<string>('normal');

  const themes = ['normal', 'black-friday', 'christmas'];
  const themeNames = {
    'normal': 'Normal',
    'black-friday': 'Black Friday', 
    'christmas': 'Christmas'
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('selected-theme') || 'normal';
    setCurrentTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const cycleTheme = () => {
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    
    setCurrentTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('selected-theme', nextTheme);
  };

  return (
    <button 
      className="btn btn-outline-primary btn-sm"
      onClick={cycleTheme}
      title={`Current: ${themeNames[currentTheme as keyof typeof themeNames]}. Click to cycle themes.`}
    >
      <i className="fas fa-palette me-1"></i>
      {themeNames[currentTheme as keyof typeof themeNames]}
    </button>
  );
};

export default SimpleThemeToggle;

