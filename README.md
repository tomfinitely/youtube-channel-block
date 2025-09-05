# YouTube Channel Block

A powerful WordPress block that fetches and displays YouTube videos from channels or playlists using the YouTube Data API v3, with automatic updates, multiple layout options, and comprehensive URL support.

## Features

- **📺 YouTube API Integration**: Fetches videos from YouTube channels or playlists using the official YouTube Data API v3
- **🔧 Advanced URL Support**: Works with all YouTube channel formats including @handles, /c/, /user/, and direct channel IDs
- **📱 Multiple Layout Options**: List, Grid, Carousel, and Media Player layouts
- **🔄 Smart Sorting**: Sort videos by date (newest/oldest), title (A-Z/Z-A), with client-side implementation
- **⚡ InnerBlocks Support**: Uses WordPress core embed blocks for optimal performance
- **🤖 Automatic Updates**: Cron jobs automatically refresh video content based on your chosen frequency
- **🎨 Responsive Design**: All layouts are fully responsive and mobile-optimized
- **⚙️ Customizable Display**: Choose quantity (1-50), columns, carousel settings, and title display options
- **💾 Smart Caching**: Intelligent caching system reduces API calls and improves performance

## Setup

### 1. Get YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the YouTube Data API v3
4. Create credentials (API Key)
5. Copy your API key

### 2. Install and Activate

1. Upload the plugin to your WordPress site
2. Activate the "YouTube Videos Block" plugin

## Usage

### Adding the Block

1. In the WordPress editor, click the "+" button to add a new block
2. Search for "YouTube Videos Block" or find it in the Media category
3. Add the block to your post or page

### Configuring the Block

#### Basic Settings
1. **API Key**: Enter your YouTube Data API v3 key
2. **Source URL**: Enter either a YouTube channel or playlist URL (see supported formats below)
3. **Number of videos**: Choose how many videos to display (1-50)
4. **Sort order**: Choose from multiple sorting options:
   - **Date (newest first)** - Most recent videos first
   - **Date (oldest first)** - Oldest videos first  
   - **Title (A-Z)** - Alphabetical order
   - **Title (Z-A)** - Reverse alphabetical order

#### Layout Options
5. **Layout Type**: Choose from four layout options:
   - **List** - Vertical list layout (default)
   - **Grid** - Responsive grid layout with customizable columns (1-6)
   - **Carousel** - Horizontal carousel with Splide.js, customizable visible items and autoplay
   - **Media Player** - Featured video with sidebar thumbnails (perfect for playlists)

#### Layout-Specific Settings
- **Grid Layout**: Set number of columns (1-6)
- **Carousel Layout**: 
  - Visible videos (1-6)
  - Autoplay on/off
  - Interval timing (1-12 seconds)
- **Media Player Layout**: 
  - Sidebar videos count (3-10)
  - Titles are always visible and positioned right of thumbnails
- **List Layout**: 
  - Show/hide video titles
  - Title position (above, left, or right of video)

#### Auto-Update Settings
6. **Auto-update**: Enable automatic updates via cron jobs
7. **Update frequency**: Choose how often to update (hourly, daily, weekly)

### Quick Usage Examples

#### Basic Channel Display
```
URL: https://www.youtube.com/@WordPress/videos
Layout: Grid (3 columns)
Sort: Date (newest first)
```

#### Media Player Setup
```
URL: https://www.youtube.com/playlist?list=PLrAXtmRdnEQy...
Layout: Media Player
Sidebar Videos: 5
```

#### Carousel for Homepage
```
URL: https://www.youtube.com/@channelname
Layout: Carousel
Visible Videos: 3
Autoplay: Enabled (5 second intervals)
```

### Supported URL Formats

The plugin now supports **all major YouTube URL formats** with intelligent resolution:

#### Channel URLs ✅
- **@Handle Format** (Recommended): `https://www.youtube.com/@WordPress`
- **@Handle with Videos**: `https://www.youtube.com/@WordPress/videos`
- **Custom Channel**: `https://www.youtube.com/c/WordPress`  
- **Legacy Username**: `https://www.youtube.com/user/WordPress`
- **Direct Channel ID**: `https://www.youtube.com/channel/UCdKuBUdPdCGl_hMxPmNgfzQ`
- **With Sub-pages**: All formats work with `/videos`, `/playlists`, `/community`, `/about` suffixes

#### Playlist URLs ✅
- **Standard Playlist**: `https://www.youtube.com/playlist?list=PLrAXtmRdnEQy4Qccz-rnD-DgFKvt-JHPp`
- **Playlist from Watch**: `https://www.youtube.com/watch?v=VIDEO_ID&list=PLAYLIST_ID`

#### Smart URL Resolution
- **Automatic Detection**: The plugin automatically detects URL type and uses appropriate YouTube API endpoints
- **Intelligent Caching**: Resolved channel IDs are cached for 24 hours to reduce API calls
- **Fallback Support**: If @handle resolution fails, helpful error messages suggest using direct channel URLs
- **Multiple Attempts**: For `/c/` URLs, tries both username and handle resolution methods

## Layout Features

### 📝 List Layout
- Vertical list of videos with optional titles
- Title positioning: above, left, or right of videos
- Perfect for blog posts and articles
- Fully responsive design

### 🏗️ Grid Layout
- Responsive grid with 1-6 columns
- Automatically adjusts to screen size
- Consistent aspect ratios
- Great for showcasing multiple videos

### 🎠 Carousel Layout
- Horizontal sliding carousel powered by Splide.js
- Customizable visible videos (1-6)
- Optional autoplay with adjustable intervals
- Touch/swipe support on mobile
- Shows as grid in editor for easier management

### 🎬 Media Player Layout
- Featured main video with sidebar thumbnails
- Perfect for playlists and video series
- Click thumbnails to switch main video
- Titles always visible to the right of thumbnails
- Responsive: transforms to card layout on mobile
- Shows as grid in editor for easier management

## Sorting & Organization

### Available Sort Orders
- **Date (Newest First)**: Most recent uploads first
- **Date (Oldest First)**: Chronological order from oldest
- **Title (A-Z)**: Alphabetical by video title
- **Title (Z-A)**: Reverse alphabetical order

### Client-Side Implementation
- Sorting happens after API fetch for better performance
- No additional API quota usage for sorting
- Works with both channels and playlists
- Cached results maintain sort order

## Automatic Updates

The block includes WordPress cron jobs that automatically update video content:

- **Hourly**: Updates every hour (for frequently updated channels)
- **Daily**: Updates once per day (recommended for most use cases)
- **Weekly**: Updates once per week (for stable content)

Updates only occur for blocks that have auto-update enabled and a valid API key. The caching system ensures efficient API usage.

## Performance & Caching

### Smart Caching System
- **API Response Caching**: YouTube API responses cached for 1 hour to reduce quota usage
- **Channel ID Resolution**: Resolved channel IDs cached for 24 hours
- **Video Title Caching**: Individual video titles cached for 24 hours
- **Force Refresh**: Manual "Refresh Videos" button bypasses cache when needed
- **Cache Clearing**: "Clear Cache" button available for troubleshooting

### Optimization Features
- **Client-side Sorting**: No additional API calls required for different sort orders
- **Lazy Loading**: YouTube embeds include lazy loading for better page performance
- **Hardware Acceleration**: CSS transforms optimized for smooth animations
- **Responsive Images**: YouTube thumbnails automatically serve appropriate sizes

## API Endpoints

The plugin provides REST API endpoints for fetching videos:

- `POST /wp-json/youtube-channel-block/v1/fetch-videos` - Fetch videos from YouTube with sorting
- `POST /wp-json/youtube-channel-block/v1/update-block/{block_id}` - Update a specific block
- `POST /wp-json/youtube-channel-block/v1/clear-cache` - Clear all plugin caches
- `GET /wp-json/youtube-channel-block/v1/video-title/{video_id}` - Get individual video titles

## Styling & Design

The block includes comprehensive responsive CSS that:

### Layout-Specific Styling
- **List Layout**: Vertical stacking with optional title positioning
- **Grid Layout**: Responsive grid system with 1-6 columns that adapt to screen size
- **Carousel Layout**: Splide.js integration with custom controls and pagination
- **Media Player Layout**: Sidebar thumbnails with glass-morphism effects and active states

### Responsive Features
- Maintains 16:9 aspect ratio for all videos across all devices
- Smooth hover effects and transitions with hardware acceleration
- Mobile-first design with touch/swipe support for carousels
- Automatic column reduction on smaller screens
- Horizontal scroll on mobile for media player layout

### Visual Enhancements
- Subtle shadow effects and border radius for modern appearance
- Active state indicators for media player sidebar items
- Loading states with spinners and progress indicators
- Error states with helpful messaging and retry options

## Technical Requirements

- **WordPress**: 6.7+ (required for advanced block APIs)
- **PHP**: 7.4+ (for array functions and modern syntax)
- **YouTube Data API v3**: Valid API key with proper quotas
- **Internet Connection**: Required for API calls and embed loading
- **Modern Browser**: For advanced CSS features (carousel, media player)
- **JavaScript**: Enabled for interactive features (carousel, media player switching)

## Troubleshooting

### Common Issues & Solutions

#### API & Authentication
1. **"YouTube API key is required"**: Make sure you've entered a valid API key in the block settings
2. **"YouTube API error: Invalid credentials"**: Check that your API key is correct and has YouTube Data API v3 enabled
3. **API quota exceeded**: YouTube API has daily quotas; consider reducing update frequency or enable caching

#### URL & Channel Issues
4. **"Could not find the YouTube channel"**: 
   - Verify the channel URL is correct and the channel exists
   - Try using a direct channel URL (`youtube.com/channel/UC...`) if @handle doesn't work
   - Check if the channel is public (private channels won't work)

5. **"Invalid channel URL"**: Ensure your URL matches one of the supported formats (see Supported URL Formats section)

6. **"Channel not found or has no uploads"**: 
   - The channel might be empty, private, or have no public videos
   - Verify the channel has uploaded videos that are publicly available

#### Display & Layout Issues
7. **Videos not displaying in grid**: Check if you've selected the correct layout in block settings
8. **Carousel not working**: Ensure you've selected "Carousel" layout and the page has loaded completely
9. **Media player thumbnails not clickable**: This is normal in the editor; functionality works on the frontend

#### Performance Issues
10. **Slow loading**: Enable caching and consider reducing the number of videos displayed
11. **Too many API calls**: Use auto-update with daily or weekly frequency instead of hourly

### Debug Information

- Check your WordPress error logs for detailed error messages from the YouTube API
- Use browser developer tools to check for JavaScript errors
- Test with a simple channel URL first (like `@WordPress`) before trying complex URLs
- Verify your API key works by testing it directly in Google's API Explorer

### Getting Help

When reporting issues, please provide:
- WordPress version and PHP version
- The exact YouTube URL you're trying to use
- Any error messages from the browser console or WordPress logs
- Screenshot of your block configuration

## Support

For issues or feature requests, please check the plugin documentation or contact support.

## License

GPL-2.0-or-later
