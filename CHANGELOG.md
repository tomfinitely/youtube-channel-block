# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Internationalization support preparation
- Additional layout options in development

### Changed
- Performance optimizations for API calls

### Fixed
- Minor CSS compatibility issues

## [0.1.0] - 2025-09-03

### Added
- Initial release of YouTube Channel Block
- YouTube Data API v3 integration for fetching channel and playlist videos
- Support for multiple YouTube URL formats:
  - Channel URLs: @username, /c/channelname, /user/username, /channel/UC...
  - Playlist URLs: /playlist?list=PL...
- Automatic content updates via WordPress cron jobs
  - Hourly updates
  - Daily updates (default)
  - Weekly updates
- Multiple display layouts:
  - List view for blog-style content
  - Grid view for responsive video galleries
  - Carousel view with navigation controls
- InnerBlocks support using WordPress core embed blocks
- Responsive design that adapts to all screen sizes
- Configurable video quantity (1-50 videos per block)
- Sort options by date, title, and view count
- REST API endpoints for video fetching and block updates
- Comprehensive error handling and API quota management
- WordPress 6.7+ compatibility with new block registration APIs
- PHP 7.4+ support

### Technical Features
- Built with @wordpress/scripts for modern development workflow
- Uses Splide.js for carousel functionality
- Follows WordPress coding standards and best practices
- Efficient block metadata registration for improved performance
- Proper sanitization and validation of all user inputs
- Automatic cleanup of cron jobs on plugin deactivation

### Documentation
- Comprehensive README with installation and usage instructions
- Inline code documentation following WordPress standards
- WordPress.org readme.txt for plugin repository
- Troubleshooting guide for common issues

---

## Release Notes

### Version 0.1.0 - Initial Release

This is the first public release of the YouTube Channel Block plugin. The plugin provides a comprehensive solution for displaying YouTube content in WordPress using the official YouTube Data API v3.

**Key highlights:**
- ✅ Full YouTube API integration
- ✅ Multiple layout options
- ✅ Automatic content updates
- ✅ Responsive design
- ✅ WordPress 6.7+ compatibility
- ✅ Comprehensive error handling

**Coming in future releases:**
- 🔄 Enhanced customization options
- 🌐 Full internationalization
- 📊 Analytics integration
- 🎨 Additional layout templates
- 🔧 Performance optimizations

---

## Support

For changelog questions or version-specific issues:
- 📋 [View all releases](https://github.com/tomfinley/youtube-channel-block/releases)
- 🐛 [Report version-specific bugs](https://github.com/tomfinley/youtube-channel-block/issues)
- 💬 [Discuss changes](https://github.com/tomfinley/youtube-channel-block/discussions)
