# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- 🌍 Full internationalization support
- 📊 Analytics integration
- 🎨 Additional layout templates
- 🔗 Deep linking for carousel and media player

## [0.2.0] - 2025-01-05

### Added
- 🎬 **Media Player Layout**: New layout with featured video and clickable sidebar thumbnails
- 🎠 **Enhanced Carousel Layout**: Improved Splide.js integration with grid display in editor
- 🔄 **Functional Sort Orders**: Client-side sorting by date (newest/oldest) and title (A-Z/Z-A)
- 🔧 **Advanced URL Support**: Complete support for all YouTube channel formats including @handles
- 💾 **Smart Caching System**: Multi-layered caching for API responses, channel resolution, and video titles
- 🎨 **Grid Editor Display**: Carousel and Media Player layouts now show as grid in backend for easier editing
- ⚡ **Auto-Title Management**: Media Player layout automatically enables and positions titles
- 🚀 **Enhanced Error Messages**: Contextual error messages with troubleshooting guidance
- 📱 **Mobile Optimizations**: Horizontal scroll for media player on mobile, touch-friendly controls

### Changed
- 🔍 **YouTube URL Resolution**: Complete rewrite with proper API resolution for @handles, /c/, /user/ formats
- 🎯 **Layout Management**: Improved layout-specific controls and settings organization  
- 💪 **API Integration**: Enhanced error handling and API quota management
- 🎨 **CSS Architecture**: Comprehensive responsive design with hardware acceleration
- 🔄 **Sorting Implementation**: Moved from API-based to efficient client-side sorting
- 📋 **Editor Experience**: Better visual feedback and layout-specific controls

### Fixed
- ✅ **Channel URL Issues**: Now properly handles `https://www.youtube.com/@WordPress/videos` and similar URLs
- ✅ **Sort Order Functionality**: Sorting now works correctly for all supported orders
- ✅ **Media Player Titles**: Titles always visible and positioned correctly in media player layout
- ✅ **Backend Grid Display**: Carousel and media player layouts display as grid in editor
- ✅ **URL Pattern Matching**: Enhanced regex patterns support all URL variations with suffixes
- ✅ **Cache Management**: Proper cache invalidation and management
- ✅ **Error Recovery**: Better fallback mechanisms and user guidance
- ✅ **Cron Job Implementation**: Fixed non-functional cron jobs with proper post meta saving and content updates

### Technical Improvements
- 🚀 **YouTube API Resolution**: Implemented proper `forHandle` and `forUsername` API endpoint usage
- 📋 **Editor Architecture**: Enhanced InnerBlocks configuration for layout-specific display
- 🎯 **State Management**: Improved useEffect hooks for automatic title enabling and layout changes
- 💾 **Caching Strategy**: Multi-tiered caching with appropriate TTL values (1h API, 24h resolution)
- 🎨 **CSS Grid Systems**: Advanced grid layouts with responsive breakpoints and column management
- ⚡ **Performance**: Hardware-accelerated animations and lazy loading optimizations
- 🔍 **Regex Optimization**: Comprehensive URL pattern matching with optional suffix support
- 🎠 **Carousel Integration**: Proper Splide.js setup with responsive configurations
- 📡 **API Error Handling**: Structured error responses with actionable user feedback
- 📱 **Mobile-First Design**: Touch-optimized interfaces and horizontal scroll implementations
- 🕰️ **Cron Job System**: Complete implementation with post meta tracking, content updates, and admin interface
- 🗺️ **Admin Tools**: Added cron status dashboard and manual testing interface

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
