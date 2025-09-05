# Contributing to YouTube Channel Block

Thank you for your interest in contributing to the YouTube Channel Block! We welcome contributions from the community and appreciate your help in making this plugin better.

## 🤝 How to Contribute

### Reporting Issues

Before creating an issue, please:
1. **Search existing issues** to avoid duplicates
2. **Use the issue templates** when available
3. **Provide detailed information** including:
   - WordPress version
   - PHP version
   - Plugin version
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots/videos if applicable

### Suggesting Features

We love new ideas! When suggesting features:
1. **Check existing feature requests** first
2. **Explain the use case** and why it would be valuable
3. **Consider backward compatibility** implications
4. **Be open to discussion** and iteration

### Code Contributions

1. **Fork the repository** on GitHub
2. **Create a feature branch** from `main`
3. **Make your changes** following our coding standards
4. **Test your changes** thoroughly
5. **Submit a pull request**

## 🛠 Development Setup

### Prerequisites

- **Node.js 16+** and npm
- **WordPress development environment** (Local, XAMPP, etc.)
- **Git** for version control
- **Code editor** with EditorConfig support

### Getting Started

```bash
# Clone your fork
git clone https://github.com/yourusername/youtube-channel-block.git
cd youtube-channel-block

# Install dependencies
npm install

# Start development server
npm run start

# In another terminal, watch for changes
npm run build
```

### Development Workflow

1. **Create a branch** for your feature/fix:
   ```bash
   git checkout -b feature/amazing-new-feature
   ```

2. **Make your changes** in the `src/` directory

3. **Test your changes**:
   ```bash
   npm run build
   npm run lint:js
   npm run lint:css
   ```

4. **Commit with descriptive messages**:
   ```bash
   git commit -m "feat: add amazing new feature"
   ```

5. **Push and create a pull request**

## 📝 Coding Standards

### JavaScript/JSX

- Follow **WordPress JavaScript Coding Standards**
- Use **ESLint** configuration provided
- Prefer **functional components** and hooks
- Use **meaningful variable names**
- Add **JSDoc comments** for functions

```javascript
/**
 * Fetches videos from YouTube API
 * 
 * @param {string} channelUrl - The YouTube channel URL
 * @param {string} apiKey - YouTube Data API key
 * @param {number} maxResults - Maximum number of videos to fetch
 * @returns {Promise<Array>} Array of video objects
 */
const fetchVideos = async (channelUrl, apiKey, maxResults = 10) => {
    // Implementation here
};
```

### PHP

- Follow **WordPress PHP Coding Standards**
- Use **proper sanitization** and validation
- Add **inline documentation**
- Use **WordPress hooks** appropriately

```php
/**
 * Fetch YouTube videos from channel or playlist
 *
 * @param WP_REST_Request $request The REST API request object.
 * @return WP_REST_Response|WP_Error Response object or error.
 */
function youtube_block_fetch_videos( $request ) {
    // Implementation here
}
```

### CSS/SCSS

- Follow **WordPress CSS Coding Standards**
- Use **BEM methodology** for class names
- Write **mobile-first** responsive styles
- Use **CSS custom properties** for theming

```scss
.youtube-block {
    &__container {
        display: grid;
        gap: var(--youtube-block-gap, 1rem);
    }
    
    &__video {
        aspect-ratio: 16/9;
        
        @media (min-width: 768px) {
            aspect-ratio: auto;
        }
    }
}
```

## 🧪 Testing

### Manual Testing

1. **Test in different browsers** (Chrome, Firefox, Safari, Edge)
2. **Test responsive design** on various screen sizes
3. **Test with different WordPress themes**
4. **Test with different YouTube URLs**
5. **Test error scenarios** (invalid API key, private videos, etc.)

### Automated Testing

We're working on implementing automated tests. For now, please ensure:
- **ESLint passes**: `npm run lint:js`
- **StyleLint passes**: `npm run lint:css`
- **Build succeeds**: `npm run build`

## 🔄 Pull Request Process

### Before Submitting

- [ ] **Test your changes** thoroughly
- [ ] **Update documentation** if needed
- [ ] **Add/update CHANGELOG.md** entry
- [ ] **Ensure code follows standards**
- [ ] **Rebase on latest main** branch

### PR Description

Please include:
- **Clear description** of changes
- **Link to related issue** (if applicable)
- **Screenshots/videos** for UI changes
- **Testing instructions**
- **Breaking changes** (if any)

### Review Process

1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Testing** in development environment
4. **Merge** when approved

## 🏷 Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding/updating tests
- `chore:` Maintenance tasks

Examples:
```bash
feat: add carousel layout option
fix: resolve API quota exceeded error handling
docs: update installation instructions
style: format code according to standards
```

## 🌍 Internationalization

When adding user-facing strings:

```php
// PHP
__('Your translatable string', 'youtube-block');
_e('Another string', 'youtube-block');

// JavaScript
import { __ } from '@wordpress/i18n';
__('Translatable string', 'youtube-block');
```

## 🚀 Areas for Contribution

### High Priority
- 🌐 **Internationalization** - Add translations
- 🧪 **Testing** - Write automated tests
- ♿ **Accessibility** - Improve ARIA labels and keyboard navigation
- 📱 **Mobile UX** - Enhance mobile experience

### Medium Priority
- 🎨 **Design** - New layout options
- ⚡ **Performance** - Optimize API calls and rendering
- 📊 **Analytics** - Integration with Google Analytics
- 🔧 **Developer Tools** - Better debugging options

### Ideas Welcome
- 📹 **Video Features** - Playlist management, video filtering
- 🎭 **Customization** - Theme integration, custom styling
- 🔗 **Integration** - Other video platforms support
- 📈 **Analytics** - View tracking, engagement metrics

## 📞 Getting Help

### Community Support
- 💬 [GitHub Discussions](https://github.com/tomfinley/youtube-channel-block/discussions) - General questions
- 🐛 [GitHub Issues](https://github.com/tomfinley/youtube-channel-block/issues) - Bug reports
- 📖 [Wiki](https://github.com/tomfinley/youtube-channel-block/wiki) - Documentation

### Development Questions
- Comment on related issues/PRs
- Start a discussion in the Development category
- Reach out to maintainers for complex contributions

## 📋 Code of Conduct

### Our Standards

- **Be respectful** and inclusive
- **Welcome newcomers** and help them learn
- **Focus on what's best** for the community
- **Show empathy** towards other contributors
- **Accept constructive criticism** gracefully

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported to the project maintainers. All complaints will be reviewed and investigated promptly and fairly.

## 🏆 Recognition

Contributors are recognized in:
- **README.md** acknowledgments section
- **Release notes** for significant contributions
- **GitHub contributors** page

## 📄 Legal

By contributing, you agree that your contributions will be licensed under the GPL-2.0-or-later license that covers the project.

---

Thank you for contributing to YouTube Channel Block! 🎉
