# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Common Development Commands

### Building and Development
```bash
# Install dependencies
npm install

# Development server (watch mode with live reload)
npm run start

# Production build
npm run build

# Create plugin zip file for distribution
npm run plugin-zip
```

### Code Quality and Linting
```bash
# Lint JavaScript files
npm run lint:js

# Lint CSS/SCSS files
npm run lint:css

# Format code using WordPress standards
npm run format

# Update WordPress packages
npm run packages-update
```

### Testing Individual Components
```bash
# Test a single block build
npm run build -- --webpack-src-dir=src/youtube-block

# Test PHP functionality via WordPress REST API
curl -X POST http://localhost/wp-json/youtube-channel-block/v1/fetch-videos \
  -H "Content-Type: application/json" \
  -d '{"api_key":"YOUR_KEY","channel_url":"https://youtube.com/@channel"}'
```

### WordPress-Specific Commands
```bash
# Clear WordPress transient cache
wp transient delete --all

# Check cron jobs status
wp cron event list

# Test cron functionality
wp cron test
```

## High-Level Architecture

### Block Registration System
The plugin uses WordPress 6.7+ block registration APIs with a blocks-manifest.php system for performance optimization. The main registration happens in `youtube-block.php` with automatic fallbacks for older WordPress versions.

### Data Flow Architecture
1. **Frontend User Input** → Editor UI (`edit.js`) collects YouTube URLs and API keys
2. **API Processing** → WordPress REST endpoints (`youtube-block.php`) handle YouTube Data API v3 calls
3. **Content Generation** → Creates WordPress `core/embed` inner blocks dynamically
4. **Caching Layer** → Intelligent transient caching for API responses (1 hour) and channel ID resolution (24 hours)
5. **Auto-Update System** → WordPress cron jobs (`hourly`, `daily`, `weekly`) automatically refresh content

### Layout System Architecture
The block supports 4 distinct layout modes with different frontend behaviors:

- **List Layout**: Default vertical stacking with optional video titles
- **Grid Layout**: CSS Grid with responsive columns (1-6, auto-collapses to 1 on mobile)
- **Carousel Layout**: Splide.js integration with autoplay and touch/swipe support
- **Media Player Layout**: Featured video + sidebar thumbnails with click-to-switch functionality

Each layout uses the same inner blocks structure but applies different CSS classes and JavaScript behaviors in `view.js`.

### YouTube URL Resolution System
Complex URL parsing supports all YouTube formats:
- `@handle` format → API resolution via `forHandle` parameter
- `/c/custom` format → Tries both `forUsername` and `forHandle` API calls
- `/user/legacy` format → API resolution via `forUsername` parameter
- Direct channel IDs → Used directly without API resolution
- Playlist URLs → Extracted via regex and used with `playlistItems` endpoint

### Caching and Performance Strategy
Multi-layered caching system:
- **API Response Cache**: 1 hour transients for video data
- **Channel ID Cache**: 24 hour transients for resolved channel identifiers
- **Video Title Cache**: 24 hour transients for individual video metadata
- **Force Refresh**: Manual cache bypass for editor "Refresh Videos" button

### WordPress Integration Points
- **Post Meta Integration**: Tracks posts with auto-update blocks via `_youtube_block_auto_update` meta
- **Cron Integration**: Three frequencies (hourly/daily/weekly) with admin interface at Settings → YouTube Block Cron
- **REST API**: Custom endpoints under `/wp-json/youtube-channel-block/v1/`
- **Block Editor**: Uses `useInnerBlocksProps` for WordPress core embed block integration

### Frontend JavaScript Architecture
`view.js` handles:
- **Splide Carousel**: Initialization with responsive breakpoints and autoplay
- **Media Player**: Dynamic DOM manipulation for video switching
- **Title Fetching**: Async video title retrieval via REST API
- **Responsive Behavior**: Layout-specific mobile adaptations

### Build System Details
Uses `@wordpress/scripts` with:
- **Webpack Configuration**: Handles SCSS compilation and JavaScript bundling
- **Block Manifest**: Auto-generates `blocks-manifest.php` for optimized registration
- **Asset Dependencies**: Automatic WordPress dependency management
- **SCSS Processing**: Includes Splide CSS and custom responsive styles

### Error Handling Strategy
Comprehensive error handling with user-friendly messages:
- **API Errors**: Surfaces YouTube API error messages with context
- **URL Validation**: Provides specific guidance for different URL format failures  
- **Rate Limiting**: Graceful handling of YouTube API quota limits
- **Fallback Behavior**: Channel ID resolution falls back through multiple API methods

### Security Considerations
- **API Key Handling**: Stored in block attributes, never exposed in frontend HTML
- **URL Sanitization**: All URLs sanitized via WordPress `sanitize_url()`
- **REST API Permissions**: Edit posts capability required for most endpoints
- **Admin Interface**: Manage options capability required for cron management

This architecture enables the plugin to handle complex YouTube integrations while maintaining WordPress standards and providing multiple layout options with intelligent caching and automatic updates.
