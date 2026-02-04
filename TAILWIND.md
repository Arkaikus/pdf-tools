# Tailwind CSS Setup

This project uses Tailwind CSS v4 with the Bun plugin for fast, utility-first styling.

## Installation

The required dependencies are already added to `package.json`. Install them with:

```bash
bun install
```

**Installed packages:**
- `bun-plugin-tailwind` - Bun plugin for Tailwind CSS
- `tailwindcss` - Tailwind CSS v4
- `postcss` - CSS transformation tool
- `autoprefixer` - Add vendor prefixes automatically
- `@tailwindcss/postcss` - PostCSS plugin for Tailwind v4

## Configuration Files

### `bunfig.toml`
```toml
[plugins]
preload = ["bun-plugin-tailwind"]
```

### `postcss.config.js`
```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};
```

### `tailwind.config.js`
Customized with:
- Custom color palette (primary/secondary)
- Extended font family (Inter)
- Custom shadows (soft, medium, large)
- Custom animations (fade-in, slide-up, slide-down)

## Usage in Components

### Basic Example
```tsx
export const Button = () => {
  return (
    <button className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
      Click me
    </button>
  );
};
```

### Using Custom Colors
```tsx
<div className="bg-primary-50 text-primary-900 dark:bg-primary-900 dark:text-primary-50">
  Custom themed content
</div>
```

### Using Custom Animations
```tsx
<div className="animate-fade-in">
  Fades in on mount
</div>

<div className="animate-slide-up">
  Slides up on mount
</div>
```

### Using Custom Shadows
```tsx
<div className="shadow-soft hover:shadow-medium transition-shadow">
  Card with custom shadow
</div>
```

### Responsive Design
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div className="bg-white p-4 rounded-lg">Card 1</div>
  <div className="bg-white p-4 rounded-lg">Card 2</div>
  <div className="bg-white p-4 rounded-lg">Card 3</div>
</div>
```

## Custom Utilities

### Text Gradient
```tsx
<h1 className="text-gradient text-4xl font-bold">
  Gradient Text
</h1>
```

## Theme Customization

### Adding Custom Colors

Edit `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      brand: {
        50: '#...',
        // ... more shades
        950: '#...',
      },
    },
  },
},
```

### Adding Custom Spacing

```js
theme: {
  extend: {
    spacing: {
      '128': '32rem',
      '144': '36rem',
    },
  },
},
```

### Adding Custom Fonts

```js
theme: {
  extend: {
    fontFamily: {
      display: ['Poppins', 'sans-serif'],
      body: ['Open Sans', 'sans-serif'],
    },
  },
},
```

## Layer System

Tailwind uses layers for organizing styles:

### `@layer base`
For base element styles:

```css
@layer base {
  h1 {
    @apply text-4xl font-bold;
  }
  
  h2 {
    @apply text-3xl font-semibold;
  }
}
```

### `@layer components`
For reusable component styles:

```css
@layer components {
  .btn-primary {
    @apply bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg transition-colors;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-soft p-6;
  }
}
```

### `@layer utilities`
For custom utility classes:

```css
@layer utilities {
  .text-gradient {
    @apply bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent;
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

## Common Patterns

### Card Component
```tsx
<div className="bg-white rounded-lg shadow-soft hover:shadow-medium transition-shadow p-6">
  <h3 className="text-xl font-bold mb-2">Card Title</h3>
  <p className="text-gray-600">Card content goes here.</p>
</div>
```

### Button Variants
```tsx
// Primary
<button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg">
  Primary
</button>

// Secondary
<button className="bg-secondary-200 hover:bg-secondary-300 text-secondary-900 px-4 py-2 rounded-lg">
  Secondary
</button>

// Outline
<button className="border-2 border-primary-500 text-primary-500 hover:bg-primary-50 px-4 py-2 rounded-lg">
  Outline
</button>
```

### Form Input
```tsx
<input
  type="text"
  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
  placeholder="Enter text..."
/>
```

### Modal Backdrop
```tsx
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 animate-fade-in">
  <div className="bg-white rounded-xl p-6 max-w-md w-full animate-slide-up">
    Modal content
  </div>
</div>
```

### Drag and Drop Zone
```tsx
<div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 hover:bg-primary-50 transition-colors cursor-pointer">
  <p className="text-gray-600">Drag & drop files here</p>
</div>
```

## Dark Mode

Tailwind supports dark mode out of the box:

```tsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  Content that adapts to dark mode
</div>
```

To enable dark mode, add to `tailwind.config.js`:

```js
export default {
  darkMode: 'class', // or 'media'
  // ...
};
```

Then toggle with:
```tsx
<html className="dark">
```

## Performance Tips

1. **Use JIT mode** (enabled by default in v4)
2. **Purge unused styles** - configured automatically via `content` in config
3. **Use arbitrary values sparingly**: `w-[137px]` generates new CSS
4. **Prefer standard values**: Use `w-32` instead of `w-[128px]`
5. **Component extraction**: Extract repeated patterns into components

## IDE Support

### VS Code

Install the Tailwind CSS IntelliSense extension:
```
Name: Tailwind CSS IntelliSense
Id: bradlc.vscode-tailwindcss
```

Features:
- Autocomplete
- Syntax highlighting
- Linting
- Hover previews

## Resources

- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [Tailwind UI Components](https://tailwindui.com/)
- [Headless UI](https://headlessui.com/) - Unstyled components
- [Heroicons](https://heroicons.com/) - Icon library

## Troubleshooting

### Styles not updating
1. Restart dev server: `bun dev`
2. Check `content` paths in `tailwind.config.js`
3. Ensure files have correct extensions (`.tsx`, `.ts`, `.jsx`)

### Build issues
1. Verify all packages installed: `bun install`
2. Check PostCSS config: `postcss.config.js`
3. Ensure Bun plugin loaded in `bunfig.toml`

### Classes not working
1. Check class name spelling
2. Verify Tailwind directives in `src/index.css`
3. Clear browser cache
4. Check if class requires additional config

---

**Version:** Tailwind CSS v4  
**Plugin:** bun-plugin-tailwind v0.5.0  
**Last Updated:** 2026-02-04
