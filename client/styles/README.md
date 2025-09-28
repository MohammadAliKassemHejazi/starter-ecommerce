# Nexus Admin - Theme System

This directory contains the complete theming system for the Nexus Admin application. The system is designed to be easily customizable and maintainable.

## 🎨 Quick Theme Changes

To change the entire application theme, simply edit the values in `theme-config.css`:

```css
/* Change these values to instantly change the entire app theme */
--theme-primary: #8b5cf6;        /* Main brand color (purple) */
--theme-secondary: #6366f1;      /* Secondary brand color (indigo) */
--theme-accent: #06b6d4;         /* Accent color (cyan) */
--theme-success: #10b981;        /* Success color (green) */
--theme-warning: #f59e0b;        /* Warning color (amber) */
--theme-error: #ef4444;          /* Error color (red) */
```

## 📁 File Structure

```
styles/
├── README.md              # This file
├── globals.css           # Main CSS file with all styles
├── theme.css             # Main theme file that imports everything
├── theme-config.css      # Easy theme configuration
└── variables.css         # Complete CSS variables and utilities
```

## 🚀 Usage

### 1. Basic Theme Change

Edit `theme-config.css` and change the main colors:

```css
/* Blue Theme */
--theme-primary: #3b82f6;
--theme-secondary: #1d4ed8;
--theme-accent: #0ea5e9;

/* Green Theme */
--theme-primary: #10b981;
--theme-secondary: #059669;
--theme-accent: #14b8a6;

/* Red Theme */
--theme-primary: #ef4444;
--theme-secondary: #dc2626;
--theme-accent: #f87171;
```

### 2. Advanced Customization

For more control, edit `variables.css` to customize:

- **Colors**: All color variables
- **Spacing**: Spacing scale
- **Typography**: Font families and sizes
- **Shadows**: Shadow definitions
- **Border Radius**: Border radius scale
- **Transitions**: Animation timings

### 3. CSS Variables

The system automatically generates CSS variables that you can use in your components:

```css
/* Primary Colors */
--theme-primary: #8b5cf6;
--theme-secondary: #6366f1;
--theme-accent: #06b6d4;

/* Background Colors */
--theme-bg-primary: #ffffff;
--theme-bg-secondary: #f8fafc;
--theme-bg-dark: #0f0f23;

/* Text Colors */
--theme-text-primary: #1e293b;
--theme-text-secondary: #64748b;
--theme-text-white: #ffffff;
```

## 🎯 Theme Presets

The system includes several preset themes:

### Blue Theme
```css
[data-theme="blue"] {
  --theme-primary: #3b82f6;
  --theme-secondary: #1d4ed8;
  --theme-accent: #0ea5e9;
}
```

### Green Theme
```css
[data-theme="green"] {
  --theme-primary: #10b981;
  --theme-secondary: #059669;
  --theme-accent: #14b8a6;
}
```

### Red Theme
```css
[data-theme="red"] {
  --theme-primary: #ef4444;
  --theme-secondary: #dc2626;
  --theme-accent: #f87171;
}
```

## 🔧 Components

### Sidebar
- Uses `--theme-bg-dark` and `--theme-bg-dark-secondary`
- Border color: `--sidebar-border`
- Shadow: `--sidebar-shadow`

### Toggle Button
- Background: `--theme-primary` to `--theme-secondary` gradient
- Text: `--theme-text-white`

### Footer
- Background: `--theme-bg-dark-secondary` to `--theme-bg-dark` gradient
- Text: `--theme-text-white`
- Links: `--theme-primary` on hover

### Page Headers
- Background: `--theme-bg-primary`
- Text: `--theme-text-primary`
- Subtext: `--theme-text-secondary`

## 📱 Responsive Design

The theme system includes responsive breakpoints:

```scss
$breakpoint-xs: 480px;
$breakpoint-sm: 640px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;
$breakpoint-2xl: 1536px;
```

## 🎨 Dark Mode

Dark mode is supported through CSS variables:

```css
[data-theme="dark"] {
  --theme-bg-primary: #0f0f23;
  --theme-bg-secondary: #1a1a2e;
  --theme-text-primary: #ffffff;
  --theme-text-secondary: #d1d5db;
}
```

## 🛠️ Mixins

Useful SCSS mixins are available:

```scss
@include flex-center;           // Flex center alignment
@include flex-between;          // Flex space-between
@include gradient-bg($start, $end); // Gradient background
@include shadow($level);        // Box shadow
@include transition($property); // Smooth transitions
@include hover-lift;            // Hover lift effect
@include glass-effect;          // Glass morphism effect
@include button-style($bg);     // Button styling
```

## 🔄 How It Works

1. **theme-config.scss**: Defines the main theme colors
2. **variables.scss**: Contains all SCSS variables and mixins
3. **theme.scss**: Imports both files and generates CSS variables
4. **globals.css**: Imports theme.scss and applies styles

The system automatically:
- Generates CSS variables from SCSS variables
- Applies consistent theming across all components
- Maintains responsive design
- Supports dark mode
- Provides easy customization

## 🚀 Getting Started

1. Edit `theme-config.css` to change main colors
2. Run your development server
3. See changes instantly across the entire application

For more advanced customization, edit `variables.css` to modify spacing, typography, shadows, and more.

## 📝 Notes

- All colors are defined in CSS variables for easy maintenance
- CSS variables are used for runtime theming
- The system is designed to be easily extensible
- All components use the same color system for consistency
- Responsive design is built into the theme system
