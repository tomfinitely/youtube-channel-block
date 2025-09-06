=== YouTube Channel Block ===
Contributors:      tomfinitely
Donate link:       https://github.com/sponsors/tomfinitely
Tags:              block, youtube, videos, channel, playlist, gutenberg, media, api
Requires at least: 6.7
Tested up to:      6.7
Requires PHP:      7.4
Stable tag:        0.3.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

A WordPress block that fetches and displays YouTube videos from channels or playlists using the YouTube Data API with automatic updates.

== Description ==

The YouTube Channel Block is a powerful WordPress block that integrates with the YouTube Data API v3 to display videos from any YouTube channel or playlist directly in your posts and pages.

**Key Features:**

* **YouTube API Integration**: Fetches videos using the official YouTube Data API v3
* **Flexible Sources**: Support for both YouTube channels and playlists
* **Automatic Updates**: Configurable cron jobs (hourly, daily, weekly) to keep content fresh
* **Responsive Design**: Mobile-friendly grid layout that adapts to any screen size
* **InnerBlocks Support**: Uses WordPress core embed blocks for optimal performance
* **Multiple Layout Options**: List, grid, carousel, and media player display modes
* **Deep Linking Support**: Direct video URLs for sharing and navigation
* **Sorting Options**: Sort by date, title, or view count
* **Customizable Quantity**: Display 1-50 videos per block

**Supported URL Formats:**

* Channel URLs: @username, /c/channelname, /user/username, /channel/UC...
* Playlist URLs: /playlist?list=PL...

Perfect for content creators, businesses, and websites that want to showcase their YouTube content automatically.

== Installation ==

**Prerequisites:**
1. Get a YouTube Data API v3 key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the YouTube Data API v3 for your project

**Installation:**
1. Upload the plugin files to the `/wp-content/plugins/youtube-channel-block` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress
3. In the block editor, add the "YouTube Channel Block" from the Media category
4. Configure with your API key and YouTube channel/playlist URL

== Frequently Asked Questions ==

= How do I get a YouTube API key? =

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the YouTube Data API v3
4. Create credentials (API Key)
5. Copy your API key and paste it into the block settings

= What YouTube URL formats are supported? =

**Channel URLs:**
* https://www.youtube.com/@username
* https://www.youtube.com/c/channelname
* https://www.youtube.com/user/username
* https://www.youtube.com/channel/UC...

**Playlist URLs:**
* https://www.youtube.com/playlist?list=PL...

= How often does the content update automatically? =

You can choose from three update frequencies:
* Hourly: Updates every hour
* Daily: Updates once per day (default)
* Weekly: Updates once per week

= Are there any API limits I should know about? =

Yes, YouTube API has daily quota limits. The plugin respects these limits and caches results. Consider using weekly updates if you hit quota limits.

= Can I display videos from multiple channels? =

Currently, each block supports one channel or playlist. To display videos from multiple sources, add multiple YouTube Channel Blocks to your page.

== Screenshots ==

1. This screen shot description corresponds to screenshot-1.(png|jpg|jpeg|gif). Note that the screenshot is taken from
the /assets directory or the directory that contains the stable readme.txt (tags or trunk). Screenshots in the /assets
directory take precedence. For example, `/assets/screenshot-1.png` would win over `/tags/4.3/screenshot-1.png`
(or jpg, jpeg, gif).
2. This is the second screen shot

== Changelog ==

= 0.3.0 =
* Added deep linking support for carousel and media player layouts
* Added URL hash parameters for direct video navigation
* Added browser history integration
* Enhanced media player with clickable sidebar thumbnails
* Improved mobile touch interactions

= 0.2.0 =
* Added Media Player layout with featured video and sidebar thumbnails
* Added enhanced carousel layout with Splide.js integration
* Added comprehensive YouTube URL support including @handles
* Added smart multi-layered caching system
* Added functional client-side sorting by date and title
* Fixed channel URL resolution for all YouTube formats
* Fixed cron job implementation with proper auto-updates

= 0.1.0 =
* Initial release

== Arbitrary section ==

You may provide arbitrary sections, in the same format as the ones above. This may be of use for extremely complicated
plugins where more information needs to be conveyed that doesn't fit into the categories of "description" or
"installation." Arbitrary sections will be shown below the built-in sections outlined above.
