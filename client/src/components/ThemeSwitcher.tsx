import React, { useState, useEffect } from 'react';

interface ThemeSwitcherProps {
  className?: string;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ className = '' }) => {
  const [currentTheme, setCurrentTheme] = useState<string>('normal');

  const themes = [
    {
      id: 'normal',
      name: 'Normal',
      description: 'Clean and professional',
      colors: ['#8b5cf6', '#6366f1', '#10b981'],
      icon: '🎨'
    },
    {
      id: 'black-friday',
      name: 'Black Friday',
      description: 'Dark and dramatic',
      colors: ['#ff6b35', '#d32f2f', '#000000'],
      icon: '🛍️'
    },
    {
      id: 'christmas',
      name: 'Christmas',
      description: 'Festive and joyful',
      colors: ['#d32f2f', '#2e7d32', '#ffc107'],
      icon: '🎄'
    }
  ];

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('selected-theme');
    if (savedTheme && themes.find(t => t.id === savedTheme)) {
      setCurrentTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (themeId: string) => {
    // Remove existing theme classes
    document.documentElement.removeAttribute('data-theme');
    
    // Apply new theme
    document.documentElement.setAttribute('data-theme', themeId);
    
    // Save to localStorage
    localStorage.setItem('selected-theme', themeId);
  };

  const handleThemeChange = (themeId: string) => {
    setCurrentTheme(themeId);
    applyTheme(themeId);
  };

  const currentThemeData = themes.find(t => t.id === currentTheme);

  return (
    <div className={`theme-switcher ${className}`}>
      <div className="theme-switcher-header">
        <h4>Theme Switcher</h4>
        <p>Choose your preferred theme</p>
      </div>
      
      <div className="theme-options">
        {themes.map((theme) => (
          <div
            key={theme.id}
            className={`theme-option ${currentTheme === theme.id ? 'active' : ''}`}
            onClick={() => handleThemeChange(theme.id)}
          >
            <div className="theme-preview">
              <div className="theme-colors">
                {theme.colors.map((color, index) => (
                  <div
                    key={index}
                    className="color-swatch"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="theme-icon">{theme.icon}</div>
            </div>
            <div className="theme-info">
              <h5>{theme.name}</h5>
              <p>{theme.description}</p>
            </div>
            {currentTheme === theme.id && (
              <div className="theme-check">
                <i className="fas fa-check"></i>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="theme-actions">
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => window.location.reload()}
        >
          <i className="fas fa-sync-alt"></i> Apply Theme
        </button>
      </div>
    </div>
  );
};

export default ThemeSwitcher;

