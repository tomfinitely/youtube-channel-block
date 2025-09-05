# YouTube Videos Block

A WordPress block that fetches and displays YouTube videos from channels or playlists using the YouTube Data API v3, with automatic updates via cron jobs.

## Features

- **YouTube API Integration**: Fetches videos from YouTube channels or playlists using the official YouTube Data API v3
- **InnerBlocks Support**: Uses WordPress core embed blocks to display videos
- **Automatic Updates**: Cron jobs automatically refresh video content based on your chosen frequency
- **Flexible Configuration**: Support for both channel URLs and playlist URLs
- **Responsive Design**: Videos display in a responsive grid layout
- **Customizable Quantity**: Choose how many videos to display (1-50)

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

1. **API Key**: Enter your YouTube Data API v3 key
2. **Channel URL** (optional): Enter a YouTube channel URL like:
   - `https://www.youtube.com/@channelname`
   - `https://www.youtube.com/c/channelname`
   - `https://www.youtube.com/channel/UC...`
3. **Playlist URL** (optional): Enter a YouTube playlist URL like:
   - `https://www.youtube.com/playlist?list=PL...`
4. **Number of videos**: Choose how many videos to display (1-50)
5. **Sort order**: Choose how to sort the videos via drag-and-drop
6. **Auto-update**: Enable automatic updates via cron jobs
7. **Update frequency**: Choose how often to update (hourly, daily, weekly)

### Supported URL Formats

**Channel URLs:**
- `https://www.youtube.com/@username`
- `https://www.youtube.com/c/channelname`
- `https://www.youtube.com/user/username`
- `https://www.youtube.com/channel/UC...`

**Playlist URLs:**
- `https://www.youtube.com/playlist?list=PL...`

## Automatic Updates

The block includes WordPress cron jobs that automatically update video content:

- **Hourly**: Updates every hour
- **Daily**: Updates once per day
- **Weekly**: Updates once per week

Updates only occur for blocks that have auto-update enabled and a valid API key.

## API Endpoints

The plugin provides REST API endpoints for fetching videos:

- `POST /wp-json/youtube-channel-block/v1/fetch-videos` - Fetch videos from YouTube
- `POST /wp-json/youtube-channel-block/v1/update-block/{block_id}` - Update a specific block

## Styling

The block includes responsive CSS that:
- Displays videos in a responsive grid
- Maintains 16:9 aspect ratio for all videos
- Includes hover effects and smooth transitions
- Adapts to mobile devices

## Requirements

- WordPress 6.7+
- PHP 7.4+
- YouTube Data API v3 key
- Internet connection for API calls

## Troubleshooting

### Common Issues

1. **"YouTube API key is required"**: Make sure you've entered a valid API key
2. **"Invalid channel URL"**: Check that your channel URL is in a supported format
3. **"No videos found"**: The channel or playlist might be empty or private
4. **API quota exceeded**: YouTube API has daily quotas; consider reducing update frequency

### Debug Mode

Check your WordPress error logs for detailed error messages from the YouTube API.

## Support

For issues or feature requests, please check the plugin documentation or contact support.

## License

GPL-2.0-or-later
