# SCSS Theme System

This directory contains a comprehensive SCSS-based theme system for the Nexus Admin application. The system allows you to easily switch between different themes and customize all Bootstrap colors and variables from a single file.

## 🎨 Available Themes

### 1. Normal Theme (Default)
- **Colors**: Purple (#8b5cf6), Indigo (#6366f1), Green (#10b981)
- **Style**: Clean, professional, and modern
- **Best for**: General use, business applications

### 2. Black Friday Theme
- **Colors**: Orange (#ff6b35), Red (#d32f2f), Black (#000000)
- **Style**: Dark, bold, and dramatic
- **Best for**: Sales events, promotions, e-commerce

### 3. Christmas Theme
- **Colors**: Red (#d32f2f), Green (#2e7d32), Gold (#ffc107)
- **Style**: Festive and joyful with winter elements
- **Best for**: Holiday seasons, special events

## 📁 File Structure

```
styles/scss/
├── README.md                    # This file
├── main-theme.scss             # Main theme file (imports selected theme)
├── _base-theme.scss            # Base theme system and variables
├── _theme-switcher.scss        # Theme switcher component styles
└── themes/
    ├── _normal.scss            # Normal theme
    ├── _black-friday.scss      # Black Friday theme
    └── _christmas.scss         # Christmas theme
```

## 🚀 Quick Start

### 1. Switch Themes

Edit `main-theme.scss` and uncomment the theme you want:

```scss
// Default theme (Normal)
@import 'themes/normal';

// Uncomment one of these to switch themes:
@import 'themes/black-friday';
// @import 'themes/christmas';
```

### 2. Customize Colors

Edit the theme files in the `themes/` directory to customize colors:

```scss
// In themes/_normal.scss
$theme-primary: #8b5cf6;           // Main brand color
$theme-secondary: #6366f1;         // Secondary brand color
$theme-success: #10b981;           // Success color
$theme-warning: #f59e0b;           // Warning color
$theme-danger: #ef4444;            // Danger color
$theme-info: #06b6d4;              // Info color
```

### 3. Use Theme Switcher Component

```tsx
import ThemeSwitcher from '@/components/ThemeSwitcher';

// In your component
<ThemeSwitcher />
```

## 🎯 Theme Customization

### Primary Colors
```scss
$theme-primary: #your-color;       // Main brand color
$theme-secondary: #your-color;     // Secondary brand color
$theme-success: #your-color;       // Success color
$theme-warning: #your-color;       // Warning color
$theme-danger: #your-color;        // Danger color
$theme-info: #your-color;          // Info color
```

### Background Colors
```scss
$theme-bg-primary: #your-color;    // Main background
$theme-bg-secondary: #your-color;  // Secondary background
$theme-bg-dark: #your-color;       // Dark background
$theme-bg-dark-secondary: #your-color; // Dark secondary background
```

### Text Colors
```scss
$theme-text-primary: #your-color;   // Primary text
$theme-text-secondary: #your-color; // Secondary text
$theme-text-tertiary: #your-color;  // Tertiary text
$theme-text-white: #your-color;     // White text
```

### Sidebar Colors
```scss
$theme-sidebar-bg: linear-gradient(145deg, #color1 0%, #color2 100%);
$theme-sidebar-border: rgba(your-color, 0.3);
$theme-sidebar-text: #your-color;
$theme-sidebar-text-hover: #your-color;
$theme-sidebar-text-active: #your-color;
```

## 🔧 Advanced Customization

### Create a New Theme

1. Create a new file in `themes/` directory (e.g., `_my-theme.scss`)
2. Import the base theme: `@import '../base-theme';`
3. Override the variables you want to change
4. Add the theme to `main-theme.scss`

```scss
// themes/_my-theme.scss
@import '../base-theme';

// Override colors
$theme-primary: #your-color;
$theme-secondary: #your-color;
// ... other overrides
```

### Custom Components

Add theme-specific components in your theme file:

```scss
// In your theme file
.my-special-component {
  background: $theme-primary;
  color: $theme-text-white;
  border: 1px solid $theme-border-light;
  
  &:hover {
    background: darken($theme-primary, 10%);
  }
}
```

## 🎨 Theme Switcher

The theme switcher component allows users to switch themes dynamically:

### Basic Usage
```tsx
import ThemeSwitcher from '@/components/ThemeSwitcher';

function App() {
  return (
    <div>
      <ThemeSwitcher />
    </div>
  );
}
```

### Advanced Usage
```tsx
import ThemeSwitcher from '@/components/ThemeSwitcher';

function App() {
  return (
    <div>
      {/* Modal version */}
      <ThemeSwitcher className="theme-switcher-modal" />
      
      {/* Dropdown version */}
      <ThemeSwitcher className="theme-switcher-dropdown" />
      
      {/* Floating version */}
      <ThemeSwitcher className="theme-switcher-floating" />
    </div>
  );
}
```

## 📱 Responsive Design

All themes are fully responsive and work on all screen sizes:

- **Mobile**: Optimized for touch interfaces
- **Tablet**: Balanced layout for medium screens
- **Desktop**: Full feature set for large screens

## 🎭 Special Effects

### Black Friday Theme
- Animated background gradients
- Pulsing discount badges
- Shimmer effects on sale items

### Christmas Theme
- Falling snow animation
- Christmas lights effect
- Gift box styling
- Festive color schemes

### Normal Theme
- Clean hover effects
- Professional gradients
- Subtle animations

## 🔄 Theme Switching

Themes can be switched in several ways:

1. **Build-time**: Edit `main-theme.scss` and rebuild
2. **Runtime**: Use the ThemeSwitcher component
3. **Programmatically**: Use the theme switching functions

```tsx
// Programmatic theme switching
const switchTheme = (themeId: string) => {
  document.documentElement.setAttribute('data-theme', themeId);
  localStorage.setItem('selected-theme', themeId);
};
```

## 🚀 Performance

- **CSS Variables**: All themes use CSS variables for optimal performance
- **SCSS Compilation**: Themes are compiled at build time
- **Minimal Overhead**: Only active theme styles are loaded
- **Caching**: Theme preferences are cached in localStorage

## 📝 Best Practices

1. **Consistent Naming**: Use the established naming convention
2. **Color Accessibility**: Ensure sufficient contrast ratios
3. **Testing**: Test themes on all screen sizes
4. **Documentation**: Document custom theme variables
5. **Performance**: Keep theme files lightweight

## 🐛 Troubleshooting

### Common Issues

1. **SCSS Not Compiling**: Ensure `sass` is installed
2. **Theme Not Switching**: Check data-theme attribute
3. **Colors Not Updating**: Verify variable names
4. **Build Errors**: Check SCSS syntax

### Solutions

1. **Install Dependencies**: `npm install sass`
2. **Check Configuration**: Verify `next.config.js`
3. **Clear Cache**: Delete `.next` folder and rebuild
4. **Check Console**: Look for SCSS compilation errors

## 📚 Resources

- [SCSS Documentation](https://sass-lang.com/documentation)
- [CSS Variables Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Bootstrap Theming](https://getbootstrap.com/docs/5.3/customize/)
- [Next.js SCSS Support](https://nextjs.org/docs/basic-features/built-in-css-support#sass-support)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your theme or improvements
4. Test thoroughly
5. Submit a pull request

## 📄 License

This theme system is part of the Nexus Admin project and follows the same license terms.





