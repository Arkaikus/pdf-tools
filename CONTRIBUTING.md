# Contributing to PDF Tools

Thank you for your interest in contributing to PDF Tools! This document provides guidelines and instructions for contributing.

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.1 or higher
- Node.js 18+ (for compatibility checks)
- Docker & Docker Compose (for containerized development)
- Git

### Setup Development Environment

1. Clone the repository
```bash
git clone <repository-url>
cd pdf-tools
```

2. Install dependencies
```bash
bun install
```

3. Copy environment variables
```bash
cp .env.example .env
```

4. Start development server
```bash
bun dev
# or
make dev
```

## 📋 Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `build`: Build system changes
- `ci`: CI/CD changes

**Examples:**
```
feat(jpg-to-pdf): add image rotation support
fix(merge): handle PDFs with different page sizes
docs(readme): update installation instructions
perf(pdf-render): optimize thumbnail generation
```

### Code Style

- Use TypeScript for all new code
- Follow existing code formatting (Prettier config)
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused

### Testing

```bash
# Run tests
bun test

# Run tests in watch mode
bun test --watch

# Run tests with coverage
bun test --coverage
```

## 🏗️ Project Architecture

### Folder Structure

```
src/
├── components/       # Reusable React components
│   ├── common/      # Generic UI components
│   └── pdf/         # PDF-specific components
├── features/        # Feature modules (self-contained)
│   ├── jpg-to-pdf/
│   │   ├── JpgToPdf.tsx
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── types.ts
│   ├── merge-pdf/
│   └── organize-pdf/
├── hooks/           # Shared React hooks
├── utils/           # Utility functions
│   ├── pdf/        # PDF manipulation utilities
│   └── storage/    # IndexedDB/LocalStorage helpers
├── types/           # TypeScript type definitions
└── styles/          # Global styles
```

### Component Guidelines

1. **Keep components small** - Single responsibility principle
2. **Use TypeScript** - Properly type all props and state
3. **Avoid prop drilling** - Use Context or state management when needed
4. **Memoize expensive operations** - Use `useMemo` and `useCallback`
5. **Handle errors gracefully** - Always show user-friendly messages

### Example Component

```tsx
import { FC, useState } from 'react';
import type { PDFDocument } from 'pdf-lib';

interface PdfMergerProps {
  onComplete: (pdf: PDFDocument) => void;
  onError: (error: Error) => void;
}

export const PdfMerger: FC<PdfMergerProps> = ({ onComplete, onError }) => {
  const [files, setFiles] = useState<File[]>([]);
  
  // Component implementation
  
  return (
    <div>
      {/* UI implementation */}
    </div>
  );
};
```

## 🔧 Adding a New Feature

### 1. Plan the Feature

- Check [TODO.md](TODO.md) for planned features
- Open an issue to discuss the feature
- Get approval before starting major features

### 2. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 3. Implement the Feature

Create a feature module:

```
src/features/your-feature/
├── YourFeature.tsx        # Main component
├── hooks/
│   └── useYourFeature.ts  # Custom hooks
├── utils/
│   └── yourFeatureUtils.ts
├── types.ts               # Type definitions
└── index.ts               # Public exports
```

### 4. Add Tests

```typescript
import { describe, test, expect } from 'bun:test';
import { yourFunction } from './yourFeatureUtils';

describe('yourFunction', () => {
  test('should handle basic case', () => {
    const result = yourFunction(input);
    expect(result).toBe(expected);
  });
  
  test('should handle edge case', () => {
    // Test edge cases
  });
});
```

### 5. Update Documentation

- Update README.md if needed
- Add JSDoc comments
- Update TODO.md to mark feature as complete

### 6. Submit Pull Request

- Push your branch
- Create PR with clear description
- Link related issues
- Wait for review

## 🐛 Reporting Bugs

### Before Reporting

1. Check existing issues
2. Try the latest version
3. Verify it's reproducible

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- Browser: [e.g. Chrome 120]
- OS: [e.g. Windows 11]
- PDF Tools Version: [e.g. 1.0.0]

**Additional context**
Any other relevant information.
```

## 🎯 Feature Requests

We welcome feature requests! Please:

1. Check if the feature is already planned in [TODO.md](TODO.md)
2. Open an issue with the `feature-request` label
3. Describe the use case and expected behavior
4. Be open to discussion and feedback

## 📚 Key Technologies

### PDF Manipulation

- **pdf-lib** - Creating and modifying PDFs
  - [Documentation](https://pdf-lib.js.org/)
  - Used for: merge, split, organize, create

- **pdfjs-dist** - Rendering PDFs
  - [Documentation](https://mozilla.github.io/pdf.js/)
  - Used for: previews, thumbnails, rendering

### Storage

- **IndexedDB** - Client-side file storage
  - Use `idb` library for easier API
  - Auto-cleanup after 24 hours

- **LocalStorage** - User preferences
  - Limit to small data (< 10KB)
  - JSON-serializable only

### Performance

- Use **Web Workers** for heavy PDF processing
- Implement **lazy loading** for large PDFs
- Use **virtual scrolling** for long page lists
- Optimize with **React.memo** and **useMemo**

## 🔒 Security Guidelines

1. **No Server Communication** - All processing must be client-side
2. **Sanitize Inputs** - Validate all file uploads
3. **Memory Management** - Clean up large objects
4. **CSP Headers** - Keep Content Security Policy strict
5. **No Eval** - Never use `eval()` or `Function()` constructor

## ✅ Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Code follows project style guidelines
- [ ] All tests pass (`bun test`)
- [ ] New features have tests
- [ ] Documentation is updated
- [ ] No console.log statements left in code
- [ ] Type errors resolved (`bun run type-check`)
- [ ] PR description is clear and complete
- [ ] Commits follow conventional commit format
- [ ] No unnecessary dependencies added

## 🎨 UI/UX Guidelines

- **Mobile First** - Design for mobile, then desktop
- **Accessibility** - WCAG 2.1 Level AA compliance
- **Loading States** - Always show progress for operations
- **Error Messages** - User-friendly, actionable messages
- **Responsive** - Test on various screen sizes
- **Performance** - Maintain 60fps for interactions

## 🤝 Code Review Process

1. **Automated Checks** - CI must pass
2. **Peer Review** - At least one approval required
3. **Testing** - Reviewer tests functionality
4. **Feedback** - Constructive and respectful
5. **Iteration** - Address feedback promptly

## 📞 Getting Help

- **Issues** - [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions** - [GitHub Discussions](https://github.com/your-repo/discussions)
- **Documentation** - [README.md](README.md), [TODO.md](TODO.md)

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to PDF Tools! 🎉
