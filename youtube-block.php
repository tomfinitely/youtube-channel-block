<?php
/**
 * Plugin Name:       YouTube Channel Block
 * Plugin URI:        https://github.com/tomfinitely/youtube-channel-block
 * Description:       A WordPress block that fetches and displays YouTube videos from channels or playlists using the YouTube Data API with automatic updates via cron jobs.
 * Version:           0.2.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            Tom Finley
 * Author URI:        https://github.com/tomfinitely
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       youtube-channel-block
 * Domain Path:       /languages
 * Network:           false
 *
 * @package YoutubeChannelBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

// Define plugin constants
define( 'YOUTUBE_BLOCK_VERSION', '0.2.0' );
define( 'YOUTUBE_BLOCK_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'YOUTUBE_BLOCK_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
/**
 * Registers the block using a `blocks-manifest.php` file, which improves the performance of block type registration.
 * Behind the scenes, it also registers all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://make.wordpress.org/core/2025/03/13/more-efficient-block-type-registration-in-6-8/
 * @see https://make.wordpress.org/core/2024/10/17/new-block-type-registration-apis-to-improve-performance-in-wordpress-6-7/
 */
function youtube_block_youtube_block_block_init() {
	/**
	 * Registers the block(s) metadata from the `blocks-manifest.php` and registers the block type(s)
	 * based on the registered block metadata.
	 * Added in WordPress 6.8 to simplify the block metadata registration process added in WordPress 6.7.
	 *
	 * @see https://make.wordpress.org/core/2025/03/13/more-efficient-block-type-registration-in-6-8/
	 */
	if ( function_exists( 'wp_register_block_types_from_metadata_collection' ) ) {
		wp_register_block_types_from_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
		return;
	}

	/**
	 * Registers the block(s) metadata from the `blocks-manifest.php` file.
	 * Added to WordPress 6.7 to improve the performance of block type registration.
	 *
	 * @see https://make.wordpress.org/core/2024/10/17/new-block-type-registration-apis-to-improve-performance-in-wordpress-6-7/
	 */
	if ( function_exists( 'wp_register_block_metadata_collection' ) ) {
		wp_register_block_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
	}
	/**
	 * Registers the block type(s) in the `blocks-manifest.php` file.
	 *
	 * @see https://developer.wordpress.org/reference/functions/register_block_type/
	 */
	$manifest_data = require __DIR__ . '/build/blocks-manifest.php';
	foreach ( array_keys( $manifest_data ) as $block_type ) {
		register_block_type( __DIR__ . "/build/{$block_type}" );
	}
}
add_action( 'init', 'youtube_block_youtube_block_block_init' );

/**
 * Register REST API routes for YouTube block
 */
add_action( 'rest_api_init', 'youtube_block_register_rest_routes' );

/**
 * Register cron jobs for automatic updates
 */
add_action( 'init', 'youtube_block_register_cron_jobs' );

/**
 * Add admin menu for cron job management
 */
add_action( 'admin_menu', 'youtube_block_add_admin_menu' );

function youtube_block_add_admin_menu() {
	add_options_page(
		__( 'YouTube Block Cron Jobs', 'youtube-channel-block' ),
		__( 'YouTube Block Cron', 'youtube-channel-block' ),
		'manage_options',
		'youtube-block-cron',
		'youtube_block_admin_page'
	);
}

/**
 * Admin page for cron job management
 */
function youtube_block_admin_page() {
	?>
	<div class="wrap">
		<h1><?php _e( 'YouTube Block Cron Jobs', 'youtube-channel-block' ); ?></h1>
		
		<div class="card">
			<h2><?php _e( 'Cron Job Status', 'youtube-channel-block' ); ?></h2>
			<p><?php _e( 'Check the current status of YouTube block auto-update cron jobs.', 'youtube-channel-block' ); ?></p>
			
			<table class="widefat">
				<thead>
					<tr>
						<th><?php _e( 'Frequency', 'youtube-channel-block' ); ?></th>
						<th><?php _e( 'Next Run', 'youtube-channel-block' ); ?></th>
						<th><?php _e( 'Status', 'youtube-channel-block' ); ?></th>
					</tr>
				</thead>
				<tbody>
					<?php
					$cron_jobs = array(
						'hourly' => wp_next_scheduled( 'youtube_block_hourly_update' ),
						'daily' => wp_next_scheduled( 'youtube_block_daily_update' ),
						'weekly' => wp_next_scheduled( 'youtube_block_weekly_update' ),
					);
					
					foreach ( $cron_jobs as $frequency => $timestamp ) :
						$next_run = $timestamp ? gmdate( 'Y-m-d H:i:s', $timestamp ) . ' UTC' : __( 'Not scheduled', 'youtube-channel-block' );
						$status = $timestamp ? '<span style="color: green;">' . __( 'Scheduled', 'youtube-channel-block' ) . '</span>' : '<span style="color: red;">' . __( 'Not scheduled', 'youtube-channel-block' ) . '</span>';
					?>
					<tr>
						<td><?php echo esc_html( ucfirst( $frequency ) ); ?></td>
						<td><?php echo esc_html( $next_run ); ?></td>
						<td><?php echo $status; ?></td>
					</tr>
					<?php endforeach; ?>
				</tbody>
			</table>
		</div>
		
		<div class="card">
			<h2><?php _e( 'Posts with Auto-Update', 'youtube-channel-block' ); ?></h2>
			<?php
			$auto_update_posts = get_posts( array(
				'post_type' => 'any',
				'post_status' => 'publish',
				'numberposts' => -1,
				'meta_query' => array(
					array(
						'key' => '_youtube_block_auto_update',
						'value' => '1',
						'compare' => '='
					)
				)
			) );
			?>
			
			<p><?php printf( __( 'Found %d posts with auto-update enabled.', 'youtube-channel-block' ), count( $auto_update_posts ) ); ?></p>
			
			<?php if ( ! empty( $auto_update_posts ) ) : ?>
				<ul>
					<?php foreach ( $auto_update_posts as $post ) : ?>
						<li>
							<strong><?php echo esc_html( $post->post_title ); ?></strong> 
							(<?php echo esc_html( $post->post_type ); ?>, ID: <?php echo $post->ID; ?>)
							- <a href="<?php echo esc_url( get_edit_post_link( $post->ID ) ); ?>"><?php _e( 'Edit', 'youtube-channel-block' ); ?></a>
						</li>
					<?php endforeach; ?>
				</ul>
			<?php endif; ?>
		</div>
		
		<div class="card">
			<h2><?php _e( 'Manual Test', 'youtube-channel-block' ); ?></h2>
			<p><?php _e( 'Test the cron job functionality manually. This will attempt to update all posts with auto-update enabled YouTube blocks.', 'youtube-channel-block' ); ?></p>
			
			<button type="button" class="button button-primary" onclick="testCronUpdate()"><?php _e( 'Run Test Update', 'youtube-channel-block' ); ?></button>
			<div id="test-results" style="margin-top: 15px;"></div>
		</div>
		
		<div class="card">
			<h2><?php _e( 'Scan for Existing YouTube Blocks', 'youtube-channel-block' ); ?></h2>
			<p><?php _e( 'Scan all existing posts for YouTube blocks with auto-update enabled and update the metadata. Use this if you have existing blocks that were created before the cron system was implemented.', 'youtube-channel-block' ); ?></p>
			
			<button type="button" class="button button-secondary" onclick="scanExistingPosts()"><?php _e( 'Scan Existing Posts', 'youtube-channel-block' ); ?></button>
			<div id="scan-results" style="margin-top: 15px;"></div>
		</div>
	</div>
	
	<script>
	function testCronUpdate() {
		const button = event.target;
		const results = document.getElementById('test-results');
		
		button.disabled = true;
		button.textContent = '<?php _e( 'Testing...', 'youtube-channel-block' ); ?>';
		results.innerHTML = '<p><?php _e( 'Running cron job test...', 'youtube-channel-block' ); ?></p>';
		
		fetch('<?php echo rest_url( 'youtube-channel-block/v1/test-cron' ); ?>', {
			method: 'POST',
			headers: {
				'X-WP-Nonce': '<?php echo wp_create_nonce( 'wp_rest' ); ?>'
			}
		})
		.then(response => response.json())
		.then(data => {
			if (data.success) {
				results.innerHTML = `<div class="notice notice-success"><p>${data.message}</p><p><strong><?php _e( 'Timestamp:', 'youtube-channel-block' ); ?></strong> ${data.timestamp}</p></div>`;
			} else {
				results.innerHTML = `<div class="notice notice-error"><p><?php _e( 'Test failed:', 'youtube-channel-block' ); ?> ${data.message || data.code}</p></div>`;
			}
		})
		.catch(error => {
			results.innerHTML = `<div class="notice notice-error"><p><?php _e( 'Test failed:', 'youtube-channel-block' ); ?> ${error.message}</p></div>`;
		})
		.finally(() => {
			button.disabled = false;
			button.textContent = '<?php _e( 'Run Test Update', 'youtube-channel-block' ); ?>';
		});
	}
	
	function scanExistingPosts() {
		const button = event.target;
		const results = document.getElementById('scan-results');
		
		button.disabled = true;
		button.textContent = '<?php _e( 'Scanning...', 'youtube-channel-block' ); ?>';
		results.innerHTML = '<p><?php _e( 'Scanning all posts for YouTube blocks...', 'youtube-channel-block' ); ?></p>';
		
		fetch('<?php echo rest_url( 'youtube-channel-block/v1/scan-posts' ); ?>', {
			method: 'POST',
			headers: {
				'X-WP-Nonce': '<?php echo wp_create_nonce( 'wp_rest' ); ?>'
			}
		})
		.then(response => response.json())
		.then(data => {
			if (data.success) {
				results.innerHTML = `<div class="notice notice-success"><p>${data.message}</p><p><strong><?php _e( 'Posts scanned:', 'youtube-channel-block' ); ?></strong> ${data.posts_scanned}</p><p><strong><?php _e( 'Auto-update posts found:', 'youtube-channel-block' ); ?></strong> ${data.auto_update_posts}</p></div>`;
				// Reload the page to update the counts
				setTimeout(() => location.reload(), 2000);
			} else {
				results.innerHTML = `<div class="notice notice-error"><p><?php _e( 'Scan failed:', 'youtube-channel-block' ); ?> ${data.message || data.code}</p></div>`;
			}
		})
		.catch(error => {
			results.innerHTML = `<div class="notice notice-error"><p><?php _e( 'Scan failed:', 'youtube-channel-block' ); ?> ${error.message}</p></div>`;
		})
		.finally(() => {
			button.disabled = false;
			button.textContent = '<?php _e( 'Scan Existing Posts', 'youtube-channel-block' ); ?>';
		});
	}
	</script>
	<?php
}

/**
 * Register REST API routes
 */
function youtube_block_register_rest_routes() {
	register_rest_route( 'youtube-channel-block/v1', '/fetch-videos', array(
		'methods' => 'POST',
		'callback' => 'youtube_block_fetch_videos',
		'permission_callback' => function() {
			return current_user_can( 'edit_posts' );
		},
		'args' => array(
			'channel_url' => array(
				'required' => false,
				'type' => 'string',
				'sanitize_callback' => 'sanitize_url',
			),
			'playlist_url' => array(
				'required' => false,
				'type' => 'string',
				'sanitize_callback' => 'sanitize_url',
			),
			'api_key' => array(
				'required' => true,
				'type' => 'string',
				'sanitize_callback' => 'sanitize_text_field',
			),
			'max_results' => array(
				'required' => false,
				'type' => 'integer',
				'default' => 10,
			),
			'order' => array(
				'required' => false,
				'type' => 'string',
				'default' => 'date',
			),
			'force_refresh' => array(
				'required' => false,
				'type' => 'boolean',
				'default' => false,
			),
		),
	) );

	register_rest_route( 'youtube-channel-block/v1', '/update-block/(?P<block_id>\d+)', array(
		'methods' => 'POST',
		'callback' => 'youtube_block_update_block_videos',
		'permission_callback' => function() {
			return current_user_can( 'edit_posts' );
		},
		'args' => array(
			'block_id' => array(
				'required' => true,
				'type' => 'integer',
			),
		),
	) );

	register_rest_route( 'youtube-channel-block/v1', '/clear-cache', array(
		'methods' => 'POST',
		'callback' => 'youtube_block_clear_cache',
		'permission_callback' => function() {
			return current_user_can( 'edit_posts' );
		},
	) );

	register_rest_route( 'youtube-channel-block/v1', '/video-title/(?P<video_id>[a-zA-Z0-9_-]+)', array(
		'methods' => 'GET',
		'callback' => 'youtube_block_get_video_title',
		'permission_callback' => '__return_true', // Public endpoint for frontend use
		'args' => array(
			'video_id' => array(
				'required' => true,
				'type' => 'string',
				'sanitize_callback' => 'sanitize_text_field',
			),
		),
	) );
	
	register_rest_route( 'youtube-channel-block/v1', '/cron-status', array(
		'methods' => 'GET',
		'callback' => 'youtube_block_get_cron_status',
		'permission_callback' => function() {
			return current_user_can( 'manage_options' );
		},
	) );
	
	register_rest_route( 'youtube-channel-block/v1', '/test-cron', array(
		'methods' => 'POST',
		'callback' => 'youtube_block_test_cron_update',
		'permission_callback' => function() {
			return current_user_can( 'manage_options' );
		},
	) );
	
	register_rest_route( 'youtube-channel-block/v1', '/scan-posts', array(
		'methods' => 'POST',
		'callback' => 'youtube_block_scan_existing_posts',
		'permission_callback' => function() {
			return current_user_can( 'manage_options' );
		},
	) );
}

/**
 * Fetch YouTube videos from channel or playlist
 */
function youtube_block_fetch_videos( $request ) {
	$channel_url = $request->get_param( 'channel_url' );
	$playlist_url = $request->get_param( 'playlist_url' );
	$api_key = $request->get_param( 'api_key' );
	$max_results = $request->get_param( 'max_results' );
	$order = $request->get_param( 'order' );
	$force_refresh = $request->get_param( 'force_refresh' );

	if ( empty( $api_key ) ) {
		return new WP_Error( 'missing_api_key', __( 'YouTube API key is required.', 'youtube-channel-block' ), array( 'status' => 400 ) );
	}

	if ( empty( $channel_url ) && empty( $playlist_url ) ) {
		return new WP_Error( 'missing_url', __( 'Either channel URL or playlist URL is required.', 'youtube-channel-block' ), array( 'status' => 400 ) );
	}

	// Create cache key based on parameters
	$cache_key = 'youtube_block_' . md5( $channel_url . $playlist_url . $api_key . $max_results . $order );
	
	// Try to get cached data first (unless force refresh is requested)
	$cached_data = false;
	if ( ! $force_refresh ) {
		$cached_data = get_transient( $cache_key );
		if ( $cached_data !== false ) {
			return rest_ensure_response( array(
				'success' => true,
				'videos' => $cached_data['videos'],
				'count' => count( $cached_data['videos'] ),
				'cached' => true,
				'cache_expires' => $cached_data['expires'],
			) );
		}
	}

	try {
		$videos = array();

		if ( ! empty( $channel_url ) ) {
			$videos = youtube_block_fetch_channel_videos( $channel_url, $api_key, $max_results );
		} elseif ( ! empty( $playlist_url ) ) {
			$videos = youtube_block_fetch_playlist_videos( $playlist_url, $api_key, $max_results );
		}
		
		// Apply client-side sorting since YouTube API doesn't support ordering for playlistItems
		$videos = youtube_block_sort_videos( $videos, $order );

		// Cache the results for 1 hour (3600 seconds)
		// Use longer cache for better performance
		$cache_duration = 3600; // 1 hour
		$cache_data = array(
			'videos' => $videos,
			'expires' => time() + $cache_duration,
		);
		set_transient( $cache_key, $cache_data, $cache_duration );

		return rest_ensure_response( array(
			'success' => true,
			'videos' => $videos,
			'count' => count( $videos ),
			'cached' => false,
		) );

	} catch ( Exception $e ) {
		return new WP_Error( 'fetch_error', $e->getMessage(), array( 'status' => 500 ) );
	}
}

/**
 * Fetch videos from YouTube channel
 */
function youtube_block_fetch_channel_videos( $channel_url, $api_key, $max_results = 10 ) {
	// Extract channel ID from URL
	$channel_data = youtube_block_extract_channel_id( $channel_url );
	
	if ( ! $channel_data ) {
		throw new Exception( __( 'Invalid channel URL. Please provide a valid YouTube channel URL.', 'youtube-channel-block' ) );
	}
	
	// If it's a direct channel ID, use it as-is
	if ( is_string( $channel_data ) ) {
		$channel_id = $channel_data;
	} else {
		// Resolve username/handle to channel ID
		$channel_id = youtube_block_resolve_username_to_channel_id( $channel_data['identifier'], $api_key, $channel_data['type'] );
		
		if ( ! $channel_id ) {
			throw new Exception( __( 'Could not resolve channel URL to a valid channel ID. Please check the URL or try using a direct channel URL.', 'youtube-channel-block' ) );
		}
	}

	// First, get the uploads playlist ID
	$uploads_url = "https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id={$channel_id}&key={$api_key}";
	$uploads_response = wp_remote_get( $uploads_url, array( 'timeout' => 15 ) );

	if ( is_wp_error( $uploads_response ) ) {
		throw new Exception( __( 'Failed to fetch channel information.', 'youtube-channel-block' ) );
	}

	$uploads_data = json_decode( wp_remote_retrieve_body( $uploads_response ), true );
	
	// Surface YouTube API errors
	if ( isset( $uploads_data['error'] ) ) {
		$message = $uploads_data['error']['message'] ?? 'Unknown YouTube API error.';
		throw new Exception( sprintf( __( 'YouTube API error: %s', 'youtube-channel-block' ), $message ) );
	}

	if ( ! isset( $uploads_data['items'][0]['contentDetails']['relatedPlaylists']['uploads'] ) ) {
		throw new Exception( __( 'Channel not found or has no uploads.', 'youtube-channel-block' ) );
	}

	$uploads_playlist_id = $uploads_data['items'][0]['contentDetails']['relatedPlaylists']['uploads'];

	// Now fetch videos from the uploads playlist
	return youtube_block_fetch_playlist_videos_by_id( $uploads_playlist_id, $api_key, $max_results );
}

/**
 * Fetch videos from YouTube playlist
 */
function youtube_block_fetch_playlist_videos( $playlist_url, $api_key, $max_results = 10 ) {
	$playlist_id = youtube_block_extract_playlist_id( $playlist_url );
	
	if ( ! $playlist_id ) {
		throw new Exception( __( 'Invalid playlist URL. Please provide a valid YouTube playlist URL.', 'youtube-channel-block' ) );
	}

	return youtube_block_fetch_playlist_videos_by_id( $playlist_id, $api_key, $max_results );
}

/**
 * Fetch videos from playlist by ID
 */
function youtube_block_fetch_playlist_videos_by_id( $playlist_id, $api_key, $max_results = 10 ) {
	// Clamp per API limits (1..50)
	$max_results = max( 1, min( 50, intval( $max_results ) ) );

	$videos_url = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId={$playlist_id}&maxResults={$max_results}&key={$api_key}";
	
	$videos_response = wp_remote_get( $videos_url, array( 'timeout' => 20 ) );

	if ( is_wp_error( $videos_response ) ) {
		throw new Exception( __( 'Failed to fetch playlist videos.', 'youtube-channel-block' ) );
	}

	$videos_data = json_decode( wp_remote_retrieve_body( $videos_response ), true );

	// Surface YouTube API errors to the client
	if ( isset( $videos_data['error'] ) ) {
		$message = $videos_data['error']['message'] ?? 'Unknown YouTube API error.';
		throw new Exception( sprintf( __( 'YouTube API error: %s', 'youtube-channel-block' ), $message ) );
	}

	if ( ! isset( $videos_data['items'] ) || empty( $videos_data['items'] ) ) {
		throw new Exception( __( 'No videos found in playlist.', 'youtube-channel-block' ) );
	}

	$videos = array();
	foreach ( $videos_data['items'] as $item ) {
		$video_id = $item['snippet']['resourceId']['videoId'];
		$video_url = "https://www.youtube.com/watch?v={$video_id}";
		
		$videos[] = array(
			'video_id' => $video_id,
			'title' => $item['snippet']['title'],
			'description' => $item['snippet']['description'],
			'thumbnail' => $item['snippet']['thumbnails']['high']['url'] ?? $item['snippet']['thumbnails']['default']['url'],
			'video_url' => $video_url,
			'embed_url' => "https://www.youtube.com/embed/{$video_id}",
			'published_at' => $item['snippet']['publishedAt'],
			'channel_title' => $item['snippet']['channelTitle'],
		);
	}

	return $videos;
}

/**
 * Extract channel ID from YouTube channel URL
 */
function youtube_block_extract_channel_id( $url ) {
	// Handle various YouTube channel URL formats
	// Added optional /videos, /playlists, /community, /channels, /about suffixes
	$patterns = array(
		'/youtube\.com\/channel\/([a-zA-Z0-9_-]+)(?:\/(?:videos|playlists|community|channels|about))?/' => 'direct',
		'/youtube\.com\/c\/([a-zA-Z0-9_-]+)(?:\/(?:videos|playlists|community|channels|about))?/' => 'custom',
		'/youtube\.com\/user\/([a-zA-Z0-9_-]+)(?:\/(?:videos|playlists|community|channels|about))?/' => 'username',
		'/youtube\.com\/@([a-zA-Z0-9_-]+)(?:\/(?:videos|playlists|community|channels|about))?/' => 'handle',
	);

	foreach ( $patterns as $pattern => $type ) {
		if ( preg_match( $pattern, $url, $matches ) ) {
			$identifier = $matches[1];
			
			// Direct channel ID - return as-is
			if ( $type === 'direct' ) {
				return $identifier;
			}
			
			// For all other formats, we need to resolve to channel ID
			// Store the type information for the resolver
			return array(
				'identifier' => $identifier,
				'type' => $type
			);
		}
	}

	return false;
}

/**
 * Extract playlist ID from YouTube playlist URL
 */
function youtube_block_extract_playlist_id( $url ) {
	if ( preg_match( '/[?&]list=([a-zA-Z0-9_-]+)/', $url, $matches ) ) {
		return $matches[1];
	}
	return false;
}

/**
 * Resolve username/handle to channel ID using YouTube API
 */
function youtube_block_resolve_username_to_channel_id( $identifier, $api_key, $type ) {
	if ( empty( $api_key ) || empty( $identifier ) ) {
		return false;
	}
	
	// Cache key for resolved channel IDs
	$cache_key = 'youtube_channel_id_' . md5( $identifier . $type );
	$cached_id = get_transient( $cache_key );
	
	if ( $cached_id !== false ) {
		return $cached_id;
	}
	
	$api_url = null;
	
	switch ( $type ) {
		case 'handle':
			// For @handles (newer format), use forHandle parameter
			$api_url = "https://www.googleapis.com/youtube/v3/channels?part=id&forHandle={$identifier}&key={$api_key}";
			break;
			
		case 'username':
			// For legacy usernames, use forUsername parameter
			$api_url = "https://www.googleapis.com/youtube/v3/channels?part=id&forUsername={$identifier}&key={$api_key}";
			break;
			
		case 'custom':
			// Custom channel names (/c/) don't have a direct API parameter
			// Try as username first, then as handle
			$username_url = "https://www.googleapis.com/youtube/v3/channels?part=id&forUsername={$identifier}&key={$api_key}";
			$handle_url = "https://www.googleapis.com/youtube/v3/channels?part=id&forHandle={$identifier}&key={$api_key}";
			
			// Try username first
			$channel_id = youtube_block_try_resolve_channel( $username_url );
			if ( $channel_id ) {
				// Cache for 24 hours
				set_transient( $cache_key, $channel_id, 24 * HOUR_IN_SECONDS );
				return $channel_id;
			}
			
			// Try handle if username didn't work
			$api_url = $handle_url;
			break;
			
		default:
			return false;
	}
	
	if ( ! $api_url ) {
		return false;
	}
	
	$channel_id = youtube_block_try_resolve_channel( $api_url );
	
	if ( $channel_id ) {
		// Cache for 24 hours
		set_transient( $cache_key, $channel_id, 24 * HOUR_IN_SECONDS );
	}
	
	return $channel_id;
}

/**
 * Helper function to try resolving a channel ID from an API URL
 */
function youtube_block_try_resolve_channel( $api_url ) {
	$response = wp_remote_get( $api_url, array( 'timeout' => 15 ) );
	
	if ( is_wp_error( $response ) ) {
		return false;
	}
	
	$data = json_decode( wp_remote_retrieve_body( $response ), true );
	
	if ( isset( $data['error'] ) || ! isset( $data['items'][0]['id'] ) ) {
		return false;
	}
	
	return $data['items'][0]['id'];
}

/**
 * Register cron jobs for automatic updates
 */
function youtube_block_register_cron_jobs() {
	// Schedule daily updates for all YouTube blocks
	if ( ! wp_next_scheduled( 'youtube_block_daily_update' ) ) {
		wp_schedule_event( time(), 'daily', 'youtube_block_daily_update' );
	}

	// Schedule weekly updates
	if ( ! wp_next_scheduled( 'youtube_block_weekly_update' ) ) {
		wp_schedule_event( time(), 'weekly', 'youtube_block_weekly_update' );
	}

	// Schedule hourly updates
	if ( ! wp_next_scheduled( 'youtube_block_hourly_update' ) ) {
		wp_schedule_event( time(), 'hourly', 'youtube_block_hourly_update' );
	}
}

/**
 * Daily cron job to update YouTube blocks
 */
add_action( 'youtube_block_daily_update', 'youtube_block_cron_update_blocks' );
add_action( 'youtube_block_weekly_update', 'youtube_block_cron_update_blocks' );
add_action( 'youtube_block_hourly_update', 'youtube_block_cron_update_blocks' );

/**
 * Cron job to update all YouTube blocks
 */
function youtube_block_cron_update_blocks() {
	// Get all posts with YouTube blocks
	$posts = get_posts( array(
		'post_type' => 'any',
		'post_status' => 'publish',
		'numberposts' => -1,
		'meta_query' => array(
			array(
				'key' => '_youtube_block_auto_update',
				'value' => '1',
				'compare' => '='
			)
		)
	) );

	foreach ( $posts as $post ) {
		$blocks = parse_blocks( $post->post_content );
		youtube_block_update_blocks_in_content( $blocks, $post->ID );
	}
}

/**
 * Update YouTube blocks in post content
 */
function youtube_block_update_blocks_in_content( $blocks, $post_id ) {
	$updated = false;
	
	foreach ( $blocks as $block ) {
		if ( $block['blockName'] === 'youtube-channel-block/youtube-channel-block' ) {
			$attributes = $block['attrs'] ?? array();
			
			if ( ! empty( $attributes['autoUpdate'] ) && ! empty( $attributes['apiKey'] ) ) {
				if ( youtube_block_update_single_block( $attributes, $post_id ) ) {
					$updated = true;
				}
			}
		}
		
		// Recursively check inner blocks
		if ( ! empty( $block['innerBlocks'] ) ) {
			if ( youtube_block_update_blocks_in_content( $block['innerBlocks'], $post_id ) ) {
				$updated = true;
			}
		}
	}
	
	return $updated;
}

/**
 * Save block metadata when post is saved
 */
add_action( 'save_post', 'youtube_block_save_post_meta' );

function youtube_block_save_post_meta( $post_id ) {
	// Avoid auto-saves and revisions
	if ( wp_is_post_autosave( $post_id ) || wp_is_post_revision( $post_id ) ) {
		return;
	}
	
	// Get the post content and parse blocks
	$post = get_post( $post_id );
	if ( ! $post ) {
		return;
	}
	
	$blocks = parse_blocks( $post->post_content );
	$has_auto_update_blocks = youtube_block_find_auto_update_blocks( $blocks );
	
	if ( $has_auto_update_blocks ) {
		update_post_meta( $post_id, '_youtube_block_auto_update', '1' );
		update_post_meta( $post_id, '_youtube_block_content', $post->post_content );
	} else {
		delete_post_meta( $post_id, '_youtube_block_auto_update' );
		delete_post_meta( $post_id, '_youtube_block_content' );
	}
}

/**
 * Find blocks with auto-update enabled
 */
function youtube_block_find_auto_update_blocks( $blocks ) {
	foreach ( $blocks as $block ) {
		if ( $block['blockName'] === 'youtube-channel-block/youtube-channel-block' ) {
			$attributes = $block['attrs'] ?? array();
			if ( ! empty( $attributes['autoUpdate'] ) && ! empty( $attributes['apiKey'] ) ) {
				return true;
			}
		}
		
		// Check inner blocks recursively
		if ( ! empty( $block['innerBlocks'] ) ) {
			if ( youtube_block_find_auto_update_blocks( $block['innerBlocks'] ) ) {
				return true;
			}
		}
	}
	
	return false;
}

/**
 * Update a single YouTube block
 */
function youtube_block_update_single_block( $attributes, $post_id ) {
	// Extract block configuration
	$channel_url = $attributes['channelUrl'] ?? '';
	$playlist_url = $attributes['playlistUrl'] ?? '';
	$api_key = $attributes['apiKey'] ?? '';
	$max_results = $attributes['maxResults'] ?? 10;
	$order = $attributes['order'] ?? 'date';
	
	if ( empty( $api_key ) || ( empty( $channel_url ) && empty( $playlist_url ) ) ) {
		error_log( 'YouTube Block: Missing API key or URL for post ' . $post_id );
		return false;
	}
	
	try {
		// Fetch new videos using the same logic as the REST endpoint
		$videos = array();
		
		if ( ! empty( $channel_url ) ) {
			$videos = youtube_block_fetch_channel_videos( $channel_url, $api_key, $max_results );
		} elseif ( ! empty( $playlist_url ) ) {
			$videos = youtube_block_fetch_playlist_videos( $playlist_url, $api_key, $max_results );
		}
		
		// Apply sorting
		$videos = youtube_block_sort_videos( $videos, $order );
		
		if ( empty( $videos ) ) {
			error_log( 'YouTube Block: No videos found for post ' . $post_id );
			return false;
		}
		
		// Update the post content with new videos
		$updated = youtube_block_update_post_content_with_videos( $post_id, $videos );
		
		if ( $updated ) {
			error_log( 'YouTube Block: Successfully updated ' . count( $videos ) . ' videos for post ' . $post_id );
			return true;
		}
		
	} catch ( Exception $e ) {
		error_log( 'YouTube Block: Update failed for post ' . $post_id . ': ' . $e->getMessage() );
	}
	
	return false;
}

/**
 * Update post content with new videos for YouTube blocks
 */
function youtube_block_update_post_content_with_videos( $post_id, $videos ) {
	$post = get_post( $post_id );
	if ( ! $post ) {
		return false;
	}
	
	$blocks = parse_blocks( $post->post_content );
	$updated_blocks = youtube_block_replace_videos_in_blocks( $blocks, $videos );
	
	if ( $updated_blocks !== $blocks ) {
		// Serialize the updated blocks back to content
		$new_content = serialize_blocks( $updated_blocks );
		
		// Update the post content
		$result = wp_update_post( array(
			'ID' => $post_id,
			'post_content' => $new_content,
		) );
		
		return ! is_wp_error( $result );
	}
	
	return false;
}

/**
 * Replace videos in blocks with new video data
 */
function youtube_block_replace_videos_in_blocks( $blocks, $videos ) {
	foreach ( $blocks as &$block ) {
		if ( $block['blockName'] === 'youtube-channel-block/youtube-channel-block' ) {
			$attributes = $block['attrs'] ?? array();
			
			if ( ! empty( $attributes['autoUpdate'] ) && ! empty( $attributes['apiKey'] ) ) {
				// Create new embed blocks for the videos
				$embed_blocks = array();
				foreach ( $videos as $video ) {
					$embed_blocks[] = array(
						'blockName' => 'core/embed',
						'attrs' => array(
							'url' => $video['video_url'],
							'type' => 'video',
							'providerNameSlug' => 'youtube',
							'responsive' => true,
							'className' => 'wp-embed-aspect-16-9 wp-has-aspect-ratio',
						),
						'innerBlocks' => array(),
						'innerHTML' => '',
						'innerContent' => array(),
					);
				}
				
				// Update the block's inner blocks
				$block['innerBlocks'] = $embed_blocks;
				
				// Update lastUpdated attribute
				if ( ! isset( $block['attrs'] ) ) {
					$block['attrs'] = array();
				}
				$block['attrs']['lastUpdated'] = gmdate( 'c' ); // ISO 8601 format
			}
		}
		
		// Recursively update inner blocks
		if ( ! empty( $block['innerBlocks'] ) ) {
			$block['innerBlocks'] = youtube_block_replace_videos_in_blocks( $block['innerBlocks'], $videos );
		}
	}
	
	return $blocks;
}

/**
 * Update block videos via REST API
 */
function youtube_block_update_block_videos( $request ) {
	$block_id = $request->get_param( 'block_id' );
	
	// This would handle updating a specific block's videos
	// Implementation depends on your specific needs
	
	// This endpoint can be used to manually trigger block updates
	try {
		// Get all posts with YouTube blocks that have auto-update enabled
		$posts = get_posts( array(
			'post_type' => 'any',
			'post_status' => 'publish',
			'numberposts' => -1,
			'meta_query' => array(
				array(
					'key' => '_youtube_block_auto_update',
					'value' => '1',
					'compare' => '='
				)
			)
		) );
		
		$updated_count = 0;
		foreach ( $posts as $post ) {
			$blocks = parse_blocks( $post->post_content );
			if ( youtube_block_update_blocks_in_content( $blocks, $post->ID ) ) {
				$updated_count++;
			}
		}
		
		return rest_ensure_response( array(
			'success' => true,
			'message' => sprintf( __( 'Updated %d posts with YouTube blocks.', 'youtube-channel-block' ), $updated_count ),
			'posts_found' => count( $posts ),
			'posts_updated' => $updated_count,
		) );
		
	} catch ( Exception $e ) {
		return new WP_Error( 'update_failed', $e->getMessage(), array( 'status' => 500 ) );
	}
}

/**
 * Get cron job status and information
 */
function youtube_block_get_cron_status( $request ) {
	$cron_jobs = array(
		'hourly' => wp_next_scheduled( 'youtube_block_hourly_update' ),
		'daily' => wp_next_scheduled( 'youtube_block_daily_update' ),
		'weekly' => wp_next_scheduled( 'youtube_block_weekly_update' ),
	);
	
	// Get posts with auto-update enabled
	$auto_update_posts = get_posts( array(
		'post_type' => 'any',
		'post_status' => 'publish',
		'numberposts' => -1,
		'meta_query' => array(
			array(
				'key' => '_youtube_block_auto_update',
				'value' => '1',
				'compare' => '='
			)
		),
		'fields' => 'ids'
	) );
	
	$status = array(
		'cron_enabled' => ! ( defined( 'DISABLE_WP_CRON' ) && DISABLE_WP_CRON ),
		'scheduled_jobs' => array(),
		'posts_with_auto_update' => count( $auto_update_posts ),
		'auto_update_post_ids' => $auto_update_posts,
	);
	
	foreach ( $cron_jobs as $frequency => $timestamp ) {
		$status['scheduled_jobs'][$frequency] = array(
			'next_run' => $timestamp ? gmdate( 'Y-m-d H:i:s', $timestamp ) . ' UTC' : 'Not scheduled',
			'next_run_timestamp' => $timestamp ?: 0,
			'scheduled' => (bool) $timestamp,
		);
	}
	
	return rest_ensure_response( $status );
}

/**
 * Test cron update functionality
 */
function youtube_block_test_cron_update( $request ) {
	try {
		// Manually trigger the cron function
		youtube_block_cron_update_blocks();
		
		return rest_ensure_response( array(
			'success' => true,
			'message' => __( 'Cron update test completed. Check error logs for detailed results.', 'youtube-channel-block' ),
			'timestamp' => gmdate( 'Y-m-d H:i:s' ) . ' UTC',
		) );
		
	} catch ( Exception $e ) {
		return new WP_Error( 'test_failed', $e->getMessage(), array( 'status' => 500 ) );
	}
}

/**
 * Scan existing posts for YouTube blocks and update metadata
 */
function youtube_block_scan_existing_posts( $request ) {
	try {
		// Get all published posts (all post types)
		$all_posts = get_posts( array(
			'post_type' => 'any',
			'post_status' => 'publish',
			'numberposts' => -1,
			'fields' => 'ids'
		) );
		
		$posts_scanned = 0;
		$auto_update_posts = 0;
		
		foreach ( $all_posts as $post_id ) {
			$post = get_post( $post_id );
			if ( ! $post ) {
				continue;
			}
			
			$posts_scanned++;
			
			// Parse blocks and check for YouTube blocks with auto-update
			$blocks = parse_blocks( $post->post_content );
			$has_auto_update = youtube_block_find_auto_update_blocks( $blocks );
			
			if ( $has_auto_update ) {
				// Update meta data
				update_post_meta( $post_id, '_youtube_block_auto_update', '1' );
				update_post_meta( $post_id, '_youtube_block_content', $post->post_content );
				$auto_update_posts++;
				
				error_log( 'YouTube Block: Found auto-update block in post ' . $post_id . ' (' . $post->post_title . ')' );
			} else {
				// Clean up any existing meta data if no auto-update blocks found
				delete_post_meta( $post_id, '_youtube_block_auto_update' );
				delete_post_meta( $post_id, '_youtube_block_content' );
			}
		}
		
		return rest_ensure_response( array(
			'success' => true,
			'message' => sprintf( 
				__( 'Scan completed. Found %d posts with auto-update enabled YouTube blocks out of %d posts scanned.', 'youtube-channel-block' ),
				$auto_update_posts,
				$posts_scanned
			),
			'posts_scanned' => $posts_scanned,
			'auto_update_posts' => $auto_update_posts,
		) );
		
	} catch ( Exception $e ) {
		return new WP_Error( 'scan_failed', $e->getMessage(), array( 'status' => 500 ) );
	}
}

/**
 * Clear YouTube block cache
 */
function youtube_block_clear_cache( $request ) {
	global $wpdb;
	
	// Clear all YouTube block transients
	$wpdb->query( 
		$wpdb->prepare( 
			"DELETE FROM {$wpdb->options} WHERE option_name LIKE %s",
			'_transient_youtube_block_%'
		)
	);
	
	// Also clear transient timeout entries
	$wpdb->query( 
		$wpdb->prepare( 
			"DELETE FROM {$wpdb->options} WHERE option_name LIKE %s",
			'_transient_timeout_youtube_block_%'
		)
	);
	
	return rest_ensure_response( array(
		'success' => true,
		'message' => __( 'Cache cleared successfully.', 'youtube-channel-block' ),
	) );
}

/**
 * Get individual video title
 */
function youtube_block_get_video_title( $request ) {
	$video_id = $request->get_param( 'video_id' );
	
	if ( empty( $video_id ) ) {
		return new WP_Error( 'missing_video_id', __( 'Video ID is required.', 'youtube-channel-block' ), array( 'status' => 400 ) );
	}

	// Check cache first
	$cache_key = 'youtube_block_video_title_' . $video_id;
	$cached_title = get_transient( $cache_key );
	
	if ( $cached_title !== false ) {
		return rest_ensure_response( array(
			'success' => true,
			'title' => $cached_title,
			'cached' => true,
		) );
	}

	// Try to get API key from any existing YouTube block
	$api_key = youtube_block_get_any_api_key();
	
	if ( empty( $api_key ) ) {
		return new WP_Error( 'no_api_key', __( 'No YouTube API key found. Please configure a YouTube block first.', 'youtube-channel-block' ), array( 'status' => 400 ) );
	}

	try {
		$video_url = "https://www.googleapis.com/youtube/v3/videos?part=snippet&id={$video_id}&key={$api_key}";
		$response = wp_remote_get( $video_url, array( 'timeout' => 15 ) );

		if ( is_wp_error( $response ) ) {
			throw new Exception( __( 'Failed to fetch video information.', 'youtube-channel-block' ) );
		}

		$data = json_decode( wp_remote_retrieve_body( $response ), true );

		if ( isset( $data['error'] ) ) {
			$message = $data['error']['message'] ?? 'Unknown YouTube API error.';
			throw new Exception( sprintf( __( 'YouTube API error: %s', 'youtube-channel-block' ), $message ) );
		}

		if ( ! isset( $data['items'][0]['snippet']['title'] ) ) {
			throw new Exception( __( 'Video not found.', 'youtube-channel-block' ) );
		}

		$title = $data['items'][0]['snippet']['title'];
		
		// Cache the title for 24 hours
		set_transient( $cache_key, $title, 24 * HOUR_IN_SECONDS );

		return rest_ensure_response( array(
			'success' => true,
			'title' => $title,
			'cached' => false,
		) );

	} catch ( Exception $e ) {
		return new WP_Error( 'fetch_error', $e->getMessage(), array( 'status' => 500 ) );
	}
}

/**
 * Get any available API key from existing YouTube blocks
 */
function youtube_block_get_any_api_key() {
	// Try to get from any post with a YouTube block
	$posts = get_posts( array(
		'post_type' => 'any',
		'post_status' => 'publish',
		'numberposts' => 10, // Limit to avoid performance issues
		'meta_query' => array(
			array(
				'key' => '_youtube_block_api_key',
				'compare' => 'EXISTS'
			)
		)
	) );

	foreach ( $posts as $post ) {
		$api_key = get_post_meta( $post->ID, '_youtube_block_api_key', true );
		if ( ! empty( $api_key ) ) {
			return $api_key;
		}
	}

	// Fallback: try to get from block content
	$posts = get_posts( array(
		'post_type' => 'any',
		'post_status' => 'publish',
		'numberposts' => 10,
	) );

	foreach ( $posts as $post ) {
		$blocks = parse_blocks( $post->post_content );
		$api_key = youtube_block_extract_api_key_from_blocks( $blocks );
		if ( ! empty( $api_key ) ) {
			return $api_key;
		}
	}

	return '';
}

/**
 * Extract API key from parsed blocks
 */
function youtube_block_extract_api_key_from_blocks( $blocks ) {
	foreach ( $blocks as $block ) {
		if ( $block['blockName'] === 'youtube-channel-block/youtube-channel-block' ) {
			$attributes = $block['attrs'];
			if ( ! empty( $attributes['apiKey'] ) ) {
				return $attributes['apiKey'];
			}
		}
		
		// Recursively check inner blocks
		if ( ! empty( $block['innerBlocks'] ) ) {
			$api_key = youtube_block_extract_api_key_from_blocks( $block['innerBlocks'] );
			if ( ! empty( $api_key ) ) {
				return $api_key;
			}
		}
	}
	
	return '';
}

/**
 * Optimize YouTube embeds for better performance
 */
add_filter( 'embed_oembed_html', 'youtube_block_optimize_embeds', 10, 4 );

function youtube_block_optimize_embeds( $html, $url, $attr, $post_id ) {
	// Only optimize YouTube embeds
	if ( strpos( $url, 'youtube.com' ) === false && strpos( $url, 'youtu.be' ) === false ) {
		return $html;
	}

	// Add lazy loading and performance optimizations
	$html = str_replace( 'src=', 'loading="lazy" src=', $html );
	
	// Add YouTube-specific optimizations
	$html = str_replace( '?feature=oembed', '?feature=oembed&rel=0&modestbranding=1', $html );
	
	return $html;
}

/**
 * Sort videos based on the specified order
 */
function youtube_block_sort_videos( $videos, $order ) {
	if ( empty( $videos ) || empty( $order ) ) {
		return $videos;
	}
	
	switch ( $order ) {
		case 'date':
			// Sort by date (newest first) - this is usually the default from API
			usort( $videos, function( $a, $b ) {
				return strtotime( $b['published_at'] ) - strtotime( $a['published_at'] );
			});
			break;
			
		case 'dateAsc':
			// Sort by date (oldest first)
			usort( $videos, function( $a, $b ) {
				return strtotime( $a['published_at'] ) - strtotime( $b['published_at'] );
			});
			break;
			
		case 'title':
			// Sort by title (A-Z)
			usort( $videos, function( $a, $b ) {
				return strcasecmp( $a['title'], $b['title'] );
			});
			break;
			
		case 'titleDesc':
			// Sort by title (Z-A)
			usort( $videos, function( $a, $b ) {
				return strcasecmp( $b['title'], $a['title'] );
			});
			break;
			
		case 'videoCount':
		case 'viewCount':
			// These would require additional API calls to get video statistics
			// For now, fall back to date sorting
			usort( $videos, function( $a, $b ) {
				return strtotime( $b['published_at'] ) - strtotime( $a['published_at'] );
			});
			break;
			
		default:
			// Default to date sorting (newest first)
			usort( $videos, function( $a, $b ) {
				return strtotime( $b['published_at'] ) - strtotime( $a['published_at'] );
			});
			break;
	}
	
	return $videos;
}

/**
 * Clean up cron jobs on deactivation
 */
register_deactivation_hook( __FILE__, 'youtube_block_deactivate' );

function youtube_block_deactivate() {
	wp_clear_scheduled_hook( 'youtube_block_daily_update' );
	wp_clear_scheduled_hook( 'youtube_block_weekly_update' );
	wp_clear_scheduled_hook( 'youtube_block_hourly_update' );
}
