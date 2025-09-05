/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */

import { useBlockProps, InspectorControls, useInnerBlocksProps } from '@wordpress/block-editor';
import apiFetch from '@wordpress/api-fetch';
import { useDispatch } from '@wordpress/data';

/**
 * WordPress components
 */
import { 
	PanelBody, 
	TextControl, 
	SelectControl, 
	RangeControl, 
	ToggleControl, 
	Button, 
	Spinner, 
	Notice, 
	Placeholder
} from '@wordpress/components';

/**
 * React hooks
 */
import { useState, useEffect } from '@wordpress/element';

/**
 * Block editor utilities
 */
import { createBlock } from '@wordpress/blocks';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object} props Block props.
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes, clientId }) {
	const { 
		channelUrl, 
		playlistUrl, 
		apiKey, 
		maxResults, 
		order, 
		isLoading, 
		error, 
		lastUpdated, 
		autoUpdate, 
		updateFrequency,
		layout,
		columns,
		carouselVisible,
		carouselAutoplay,
		carouselInterval,
		showTitles,
		titlePosition,
		mediaPlayerSidebarVideos,
		align 
	} = attributes;

	const [localSourceUrl, setLocalSourceUrl] = useState(channelUrl || playlistUrl);
	const [localApiKey, setLocalApiKey] = useState(apiKey);

	// Function to detect URL type and return appropriate channel/playlist URLs
	const parseSourceUrl = (url) => {
		if (!url) return { channelUrl: '', playlistUrl: '' };
		
		// Check if it's a playlist URL
		if (url.includes('playlist?list=') || url.includes('/playlist/')) {
			return { channelUrl: '', playlistUrl: url };
		}
		
		// Check if it's a channel URL (various formats)
		if (url.includes('youtube.com/@') || 
			url.includes('youtube.com/c/') || 
			url.includes('youtube.com/channel/') ||
			url.includes('youtube.com/user/')) {
			return { channelUrl: url, playlistUrl: '' };
		}
		
		// If we can't determine, assume it's a channel URL
		return { channelUrl: url, playlistUrl: '' };
	};

	// Auto-fetch function that uses the source URL
	const autoFetchVideos = async (sourceUrl) => {
		if (!localApiKey || !sourceUrl) {
			return;
		}

		const { channelUrl, playlistUrl } = parseSourceUrl(sourceUrl);

		setAttributes({ isLoading: true, error: '' });

		try {
			const data = await apiFetch({
				path: '/youtube-channel-block/v1/fetch-videos',
				method: 'POST',
				data: {
					channel_url: channelUrl,
					playlist_url: playlistUrl,
					api_key: localApiKey,
					max_results: maxResults,
					order: order,
					force_refresh: false, // Use cache for auto-fetch
				},
			});

			const embedBlocks = data.videos.map(video => 
				createBlock('core/embed', {
					url: video.video_url,
					providerNameSlug: 'youtube',
					responsive: true
				})
			);

			replaceInnerBlocks(clientId, embedBlocks);

			setAttributes({
				isLoading: false,
				error: '',
				lastUpdated: new Date().toISOString(),
				channelUrl: channelUrl,
				playlistUrl: playlistUrl,
				apiKey: localApiKey,
			});
			setSourceChangeNotice(''); // Clear any source change notice
			
			// Show cache status
			if (data.cached) {
				setSourceChangeNotice(__('Data loaded from cache. Use "Clear Cache" to force fresh data.', 'youtube-channel-block'));
				setTimeout(() => setSourceChangeNotice(''), 5000);
			}

		} catch (err) {
			console.error('YouTube Block Error:', err);
			let errorMessage = err.message;
			
			// Provide more helpful error messages for common issues
			if (err.message.includes('Could not resolve channel URL')) {
				errorMessage = 'Could not find the YouTube channel. Please check that the URL is correct and the channel exists. Try using a direct channel URL (youtube.com/channel/UC...) if the @handle URL doesn\'t work.';
			} else if (err.message.includes('Channel not found')) {
				errorMessage = 'Channel not found or has no uploaded videos. Please verify the channel URL and ensure it has public videos.';
			} else if (err.message.includes('YouTube API error')) {
				errorMessage = `${err.message} Please check your API key and ensure it has YouTube Data API v3 access enabled.`;
			} else {
				errorMessage = `${err.message} Please check your API key and URLs, and ensure the plugin is properly activated.`;
			}
			
			setAttributes({
				isLoading: false,
				error: errorMessage,
			});
		}
	};

	// Handle source URL changes with auto-refresh
	const handleSourceUrlChange = (newUrl) => {
		setLocalSourceUrl(newUrl);
		// Auto-refresh if we have a valid URL and API key
		if (newUrl && localApiKey) {
			// Small delay to ensure state updates are processed
			setTimeout(() => {
				autoFetchVideos(newUrl);
			}, 100);
		}
	};

	const { replaceInnerBlocks } = useDispatch('core/block-editor');

	// Track previous source URL to detect changes
	const [previousSourceUrl, setPreviousSourceUrl] = useState(localSourceUrl);
	const [sourceChangeNotice, setSourceChangeNotice] = useState('');

	// Clear videos when source changes
	useEffect(() => {
		if (previousSourceUrl !== localSourceUrl && localSourceUrl) {
			// Clear existing videos when source changes
			replaceInnerBlocks(clientId, []);
			
			const { channelUrl, playlistUrl } = parseSourceUrl(localSourceUrl);
			setAttributes({
				error: '',
				lastUpdated: '',
				channelUrl: channelUrl,
				playlistUrl: playlistUrl,
			});
			
			// Show notice about source change
			setSourceChangeNotice(__('Source changed - videos cleared. Click "Refresh Videos" to fetch new content.', 'youtube-channel-block'));
			
			// Clear notice after 5 seconds
			setTimeout(() => setSourceChangeNotice(''), 5000);
		}

		setPreviousSourceUrl(localSourceUrl);
	}, [localSourceUrl, clientId, replaceInnerBlocks, setAttributes, previousSourceUrl]);
	
	// Auto-enable titles for media player layout
	useEffect(() => {
		if (layout === 'media-player' && !showTitles) {
			setAttributes({ showTitles: true });
		}
	}, [layout, showTitles, setAttributes]);

	const wrapperProps = useBlockProps({
		className: [
			'wp-block-youtube-channel-block',
			align ? `align${align}` : '',
			layout === 'list' ? 'is-layout-list' : '',
			layout === 'grid' ? 'is-layout-grid' : '',
			layout === 'carousel' ? 'is-layout-carousel' : '',
			layout === 'media-player' ? 'is-layout-media-player' : '',
			showTitles ? 'has-titles' : '',
			showTitles ? `title-position-${titlePosition}` : ''
		].filter(Boolean).join(' '),
		'data-carousel-visible': layout === 'carousel' ? String(carouselVisible) : undefined,
		'data-carousel-autoplay': layout === 'carousel' ? String(carouselAutoplay) : undefined,
		'data-carousel-interval': layout === 'carousel' ? String(carouselInterval) : undefined,
		'data-show-titles': String(showTitles),
		'data-title-position': titlePosition,
	});

	// Different inner blocks handling based on layout
	let innerBlocksProps;
	
	if (layout === 'carousel') {
		// Carousel uses Splide but shows as grid in editor
		innerBlocksProps = useInnerBlocksProps(
			{ className: 'youtube-channel-block-inner-blocks splide__list has-columns-3' },
			{
				templateLock: false,
				allowedBlocks: ['core/embed', 'core/paragraph', 'core/heading'],
			}
		);
	} else if (layout === 'media-player') {
		// Media player shows as grid in editor
		innerBlocksProps = useInnerBlocksProps(
			{ className: 'youtube-channel-block-inner-blocks has-columns-3' },
			{
				templateLock: false,
				allowedBlocks: ['core/embed', 'core/paragraph', 'core/heading'],
			}
		);
	} else {
		// Default behavior for list and grid layouts
		innerBlocksProps = useInnerBlocksProps(
			{ className: ['youtube-channel-block-inner-blocks', layout === 'grid' ? `has-columns-${columns}` : ''].filter(Boolean).join(' ') },
			{
				templateLock: false,
				allowedBlocks: ['core/embed', 'core/paragraph', 'core/heading'],
			}
		);
	}

	const orderOptions = [
		{ label: __('Date (newest first)', 'youtube-channel-block'), value: 'date' },
		{ label: __('Date (oldest first)', 'youtube-channel-block'), value: 'dateAsc' },
		{ label: __('Title (A-Z)', 'youtube-channel-block'), value: 'title' },
		{ label: __('Title (Z-A)', 'youtube-channel-block'), value: 'titleDesc' },
		{ label: __('Video count', 'youtube-channel-block'), value: 'videoCount' },
		{ label: __('View count', 'youtube-channel-block'), value: 'viewCount' },
	];

	const layoutOptions = [
		{ label: __('List (vertical)', 'youtube-channel-block'), value: 'list' },
		{ label: __('Grid', 'youtube-channel-block'), value: 'grid' },
		{ label: __('Carousel', 'youtube-channel-block'), value: 'carousel' },
		{ label: __('Media Player', 'youtube-channel-block'), value: 'media-player' },
	];

	const frequencyOptions = [
		{ label: __('Hourly', 'youtube-channel-block'), value: 'hourly' },
		{ label: __('Daily', 'youtube-channel-block'), value: 'daily' },
		{ label: __('Weekly', 'youtube-channel-block'), value: 'weekly' },
	];

	const titlePositionOptions = [
		{ label: __('Above video', 'youtube-channel-block'), value: 'above' },
		{ label: __('Left of video', 'youtube-channel-block'), value: 'left' },
		{ label: __('Right of video', 'youtube-channel-block'), value: 'right' },
	];

	const fetchVideos = async () => {
		if (!localApiKey) {
			setAttributes({ error: __('YouTube API key is required.', 'youtube-channel-block') });
			return;
		}

		if (!localSourceUrl) {
			setAttributes({ error: __('Please provide a YouTube channel or playlist URL.', 'youtube-channel-block') });
			return;
		}

		const { channelUrl, playlistUrl } = parseSourceUrl(localSourceUrl);

		setAttributes({ isLoading: true, error: '' });

		try {
			const data = await apiFetch({
				path: '/youtube-channel-block/v1/fetch-videos',
				method: 'POST',
				data: {
					channel_url: channelUrl,
					playlist_url: playlistUrl,
					api_key: localApiKey,
					max_results: maxResults,
					order: order,
					force_refresh: true, // Force fresh data on manual refresh
				},
			});

			const embedBlocks = data.videos.map(video => 
				createBlock('core/embed', {
					url: video.video_url,
					providerNameSlug: 'youtube',
					responsive: true
				})
			);

			replaceInnerBlocks(clientId, embedBlocks);

			setAttributes({
				isLoading: false,
				error: '',
				lastUpdated: new Date().toISOString(),
				channelUrl: channelUrl,
				playlistUrl: playlistUrl,
				apiKey: localApiKey,
			});
			setSourceChangeNotice(''); // Clear any source change notice
			
			// Show cache status
			if (data.cached) {
				setSourceChangeNotice(__('Data loaded from cache. Use "Clear Cache" to force fresh data.', 'youtube-channel-block'));
				setTimeout(() => setSourceChangeNotice(''), 5000);
			}

		} catch (err) {
			console.error('YouTube Block Error:', err);
			let errorMessage = err.message;
			
			// Provide more helpful error messages for common issues
			if (err.message.includes('Could not resolve channel URL')) {
				errorMessage = 'Could not find the YouTube channel. Please check that the URL is correct and the channel exists. Try using a direct channel URL (youtube.com/channel/UC...) if the @handle URL doesn\'t work.';
			} else if (err.message.includes('Channel not found')) {
				errorMessage = 'Channel not found or has no uploaded videos. Please verify the channel URL and ensure it has public videos.';
			} else if (err.message.includes('YouTube API error')) {
				errorMessage = `${err.message} Please check your API key and ensure it has YouTube Data API v3 access enabled.`;
			} else {
				errorMessage = `${err.message} Please check your API key and URLs, and ensure the plugin is properly activated.`;
			}
			
			setAttributes({
				isLoading: false,
				error: errorMessage,
			});
		}
	};

	const clearVideos = async () => {
		replaceInnerBlocks(clientId, []);
		setAttributes({
			error: '',
			lastUpdated: '',
		});
		setSourceChangeNotice(''); // Clear any source change notice
		
		// Also clear the cache when clearing videos
		try {
			await apiFetch({
				path: '/youtube-channel-block/v1/clear-cache',
				method: 'POST',
			});
		} catch (err) {
			console.log('Cache clear failed:', err);
		}
	};

	const clearCache = async () => {
		try {
			await apiFetch({
				path: '/youtube-channel-block/v1/clear-cache',
				method: 'POST',
			});
			setAttributes({ error: '' });
			// Show success message
			setSourceChangeNotice(__('Cache cleared successfully. Next fetch will get fresh data.', 'youtube-channel-block'));
			setTimeout(() => setSourceChangeNotice(''), 3000);
		} catch (err) {
			setAttributes({ error: `Cache clear failed: ${err.message}` });
		}
	};

	// Show placeholder if no source URL is provided
	if (!localSourceUrl) {
		return (
			<div {...wrapperProps}>
				<Placeholder
					icon="video-alt3"
					label={__('YouTube Videos Block', 'youtube-channel-block')}
					instructions={__('Enter a YouTube channel or playlist URL to fetch and display videos.', 'youtube-channel-block')}
				>
					<div className="youtube-channel-block-placeholder-controls">
						<TextControl
							label={__('YouTube API Key', 'youtube-channel-block')}
							value={localApiKey}
							onChange={setLocalApiKey}
							help={__('Get your API key from Google Cloud Console', 'youtube-channel-block')}
							placeholder="AIzaSy..."
						/>
						
						<TextControl
							label={__('Source URL', 'youtube-channel-block')}
							value={localSourceUrl}
							onChange={handleSourceUrlChange}
							placeholder="https://www.youtube.com/@channelname or https://www.youtube.com/playlist?list=..."
							help={__('Enter a YouTube channel URL or playlist URL', 'youtube-channel-block')}
						/>

						<RangeControl
							label={__('Number of videos', 'youtube-channel-block')}
							value={maxResults}
							onChange={(value) => setAttributes({ maxResults: value })}
							min={1}
							max={50}
						/>

						<SelectControl
							label={__('Sort order', 'youtube-channel-block')}
							value={order}
							options={orderOptions}
							onChange={(value) => setAttributes({ order: value })}
						/>

						<Button
							variant="primary"
							onClick={fetchVideos}
							disabled={isLoading || !localApiKey}
						>
							{isLoading ? __('Fetching...', 'youtube-channel-block') : __('Fetch Videos', 'youtube-channel-block')}
						</Button>
					</div>
				</Placeholder>
			</div>
		);
	}

	return (
		<div {...wrapperProps}>
			<InspectorControls>
				<PanelBody title={__('YouTube Settings', 'youtube-channel-block')}>
					<TextControl
						label={__('YouTube API Key', 'youtube-channel-block')}
						value={localApiKey}
						onChange={setLocalApiKey}
						help={__('Get your API key from Google Cloud Console', 'youtube-channel-block')}
					/>
					
					<TextControl
						label={__('Source URL', 'youtube-channel-block')}
						value={localSourceUrl}
						onChange={handleSourceUrlChange}
						placeholder="https://www.youtube.com/@channelname or https://www.youtube.com/playlist?list=..."
						help={__('Enter a YouTube channel URL or playlist URL', 'youtube-channel-block')}
					/>

					<RangeControl
						label={__('Number of videos', 'youtube-channel-block')}
						value={maxResults}
						onChange={(value) => setAttributes({ maxResults: value })}
						min={1}
						max={50}
					/>

					<SelectControl
						label={__('Sort order', 'youtube-channel-block')}
						value={order}
						options={orderOptions}
						onChange={(value) => setAttributes({ order: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Layout', 'youtube-channel-block')} initialOpen={false}>
					<SelectControl
						label={__('Layout Type', 'youtube-channel-block')}
						value={layout}
						options={layoutOptions}
						onChange={(value) => setAttributes({ layout: value })}
					/>
					{layout === 'grid' && (
						<RangeControl
							label={__('Columns', 'youtube-channel-block')}
							value={columns}
							onChange={(value) => setAttributes({ columns: value })}
							min={1}
							max={6}
						/>
					)}
					{layout === 'carousel' && (
						<>
							<RangeControl
								label={__('Visible videos', 'youtube-channel-block')}
								value={carouselVisible}
								onChange={(value) => setAttributes({ carouselVisible: value })}
								min={1}
								max={6}
							/>
							<ToggleControl
								label={__('Autoplay', 'youtube-channel-block')}
								checked={carouselAutoplay}
								onChange={(value) => setAttributes({ carouselAutoplay: value })}
							/>
							<RangeControl
								label={__('Interval (seconds)', 'youtube-channel-block')}
								value={carouselInterval}
								onChange={(value) => setAttributes({ carouselInterval: value })}
								min={1}
								max={12}
							/>
						</>
					)}
					{layout === 'list' && (
						<>
							<ToggleControl
								label={__('Show video titles', 'youtube-channel-block')}
								checked={showTitles}
								onChange={(value) => setAttributes({ showTitles: value })}
							/>
							{showTitles && (
								<SelectControl
									label={__('Title position', 'youtube-channel-block')}
									value={titlePosition}
									options={titlePositionOptions}
									onChange={(value) => setAttributes({ titlePosition: value })}
								/>
							)}
						</>
					)}
					{layout === 'media-player' && (
						<>
							<RangeControl
								label={__('Sidebar videos', 'youtube-channel-block')}
								value={mediaPlayerSidebarVideos}
								onChange={(value) => setAttributes({ mediaPlayerSidebarVideos: value })}
								min={3}
								max={10}
								help={__('Number of videos to show in the sidebar', 'youtube-channel-block')}
							/>
							<div className="components-base-control">
								<div className="components-base-control__label">{__('Video titles', 'youtube-channel-block')}</div>
								<div className="components-base-control__help">
									{__('Titles are always visible in media player layout and positioned to the right of thumbnails.', 'youtube-channel-block')}
								</div>
							</div>
						</>
					)}
				</PanelBody>

				<PanelBody title={__('Auto Update', 'youtube-channel-block')} initialOpen={false}>
					<ToggleControl
						label={__('Auto-update videos', 'youtube-channel-block')}
						checked={autoUpdate}
						onChange={(value) => setAttributes({ autoUpdate: value })}
					/>
					{autoUpdate && (
						<SelectControl
							label={__('Update frequency', 'youtube-channel-block')}
							value={updateFrequency}
							options={frequencyOptions}
							onChange={(value) => setAttributes({ updateFrequency: value })}
						/>
					)}
				</PanelBody>
			</InspectorControls>

			<div className="youtube-channel-block-container">
				<div className="youtube-channel-block-header">
					<div>
						<h3>{__('YouTube Videos', 'youtube-channel-block')}</h3>
						<div className="youtube-channel-block-meta">
							{lastUpdated && (
								<span className="last-updated">
									{__('Last updated:', 'youtube-channel-block')} {new Date(lastUpdated).toLocaleString()}
								</span>
							)}
							{sourceChangeNotice && sourceChangeNotice.includes('cache') && (
								<span className="cache-status">
									{__('📦 Cached', 'youtube-channel-block')}
								</span>
							)}
							{autoUpdate && (
								<span className="auto-update-badge">
									{__('Auto-update:', 'youtube-channel-block')} {updateFrequency}
								</span>
							)}
						</div>
					</div>
					<div className="youtube-channel-block-actions">
						<Button
							variant="primary"
							onClick={fetchVideos}
							disabled={isLoading || !localApiKey}
						>
							{isLoading ? __('Fetching...', 'youtube-channel-block') : __('Refresh Videos', 'youtube-channel-block')}
						</Button>
						
						<Button
							variant="secondary"
							onClick={clearVideos}
						>
							{__('Clear Videos', 'youtube-channel-block')}
						</Button>

						<Button
							variant="tertiary"
							onClick={clearCache}
							title={__('Clear cached data to force fresh API calls', 'youtube-channel-block')}
						>
							{__('Clear Cache', 'youtube-channel-block')}
						</Button>
					</div>
				</div>

				{error && (
					<Notice status="error" isDismissible={false}>
						{error}
					</Notice>
				)}

				{sourceChangeNotice && (
					<Notice status="info" isDismissible={false}>
						{sourceChangeNotice}
					</Notice>
				)}

				{isLoading && (
					<div className="youtube-channel-block-loading">
						<Spinner />
						<span>{__('Fetching videos...', 'youtube-channel-block')}</span>
					</div>
				)}



			
					<div {...innerBlocksProps} />
			</div>
		</div>
	);
}
