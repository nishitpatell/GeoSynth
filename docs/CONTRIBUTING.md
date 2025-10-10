# Contributing to Geosynth

Thank you for your interest in contributing to Geosynth! This guide will help you get started.

## 🌟 Ways to Contribute

- 🐛 Report bugs
- 💡 Suggest new features
- 📝 Improve documentation
- 🔧 Submit pull requests
- 🎨 Improve UI/UX

## 🚀 Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/GeoSynth.git
cd GeoSynth
```

### 2. Set Up Development Environment

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your credentials

# Start development server
npm run dev
```

### 3. Create a Branch

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Or a bugfix branch
git checkout -b fix/bug-description
```

## 📋 Development Guidelines

### Code Style

- **JavaScript/React**: Follow existing patterns
- **Components**: Use functional components with hooks
- **Styling**: Use Tailwind CSS classes
- **File naming**: 
  - Components: `PascalCase.jsx`
  - Utilities: `camelCase.js`
  - Constants: `UPPER_SNAKE_CASE.js`

### Project Structure

```
src/
├── app/              # App configuration
├── features/         # Feature modules (self-contained)
│   ├── auth/
│   ├── globe/
│   └── wishlist/
├── shared/           # Shared resources
│   ├── components/
│   ├── hooks/
│   └── utils/
└── core/             # Core infrastructure
    ├── api/
    └── repositories/
```

### SOLID Principles

We follow SOLID principles:
- **S**ingle Responsibility: One component, one purpose
- **O**pen/Closed: Open for extension, closed for modification
- **L**iskov Substitution: Interchangeable implementations
- **I**nterface Segregation: Small, focused interfaces
- **D**ependency Inversion: Depend on abstractions

### Component Guidelines

```jsx
// ✅ Good: Functional component with clear purpose
export const CountryCard = ({ country, onSelect }) => {
  return (
    <Card onClick={() => onSelect(country)}>
      <h3>{country.name}</h3>
    </Card>
  );
};

// ❌ Avoid: Mixed concerns
export const CountryCard = ({ country }) => {
  const [data, setData] = useState(null);
  // Fetching data in UI component - should be in a hook
  useEffect(() => {
    fetch(`/api/countries/${country.id}`).then(...)
  }, []);
  // ...
};
```

### Hook Guidelines

```javascript
// ✅ Good: Custom hook with single responsibility
export const useCountryData = (countryId) => {
  const { data, loading, error } = useQuery({
    queryKey: ['country', countryId],
    queryFn: () => countryService.getCountry(countryId),
  });
  
  return { country: data, loading, error };
};
```

## 🧪 Testing

```bash
# Run linter
npm run lint

# Build to check for errors
npm run build
```

## 📝 Commit Guidelines

### Commit Message Format

```
type(scope): subject

body (optional)

footer (optional)
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(globe): add country search functionality

fix(auth): resolve Google OAuth redirect issue

docs(readme): update installation instructions

refactor(api): extract country service to repository pattern
```

## 🔄 Pull Request Process

### 1. Before Submitting

- ✅ Code follows style guidelines
- ✅ No console errors or warnings
- ✅ Tested locally
- ✅ Documentation updated (if needed)
- ✅ Commits are clean and descriptive

### 2. Submit PR

1. Push your branch to your fork
2. Open a Pull Request on GitHub
3. Fill out the PR template
4. Link related issues

### 3. PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How to test these changes

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
```

## 🐛 Reporting Bugs

### Bug Report Template

```markdown
**Describe the bug**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment:**
- OS: [e.g. Windows 11]
- Browser: [e.g. Chrome 120]
- Version: [e.g. 1.0.0]
```

## 💡 Feature Requests

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Description of the problem

**Describe the solution**
How you'd like it to work

**Describe alternatives**
Other solutions you've considered

**Additional context**
Any other context or screenshots
```

## 📚 Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)

## 🤝 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## ❓ Questions?

- Open an issue for discussion
- Check existing documentation
- Review closed PRs for examples

---

Thank you for contributing to Geosynth! 🌍✨
