/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/youtube-block/block.json":
/*!**************************************!*\
  !*** ./src/youtube-block/block.json ***!
  \**************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"youtube-channel-block/youtube-channel-block","version":"0.1.0","title":"YouTube Channel Block","category":"media","icon":"video-alt3","description":"A block that fetches and displays YouTube videos from channels or playlists using the YouTube Data API.","example":{},"attributes":{"channelUrl":{"type":"string","default":""},"playlistUrl":{"type":"string","default":""},"apiKey":{"type":"string","default":""},"maxResults":{"type":"number","default":10},"order":{"type":"string","default":"date"},"isLoading":{"type":"boolean","default":false},"error":{"type":"string","default":""},"lastUpdated":{"type":"string","default":""},"autoUpdate":{"type":"boolean","default":true},"updateFrequency":{"type":"string","default":"daily"},"layout":{"type":"string","default":"list"},"columns":{"type":"number","default":3},"carouselVisible":{"type":"number","default":1},"carouselAutoplay":{"type":"boolean","default":true},"carouselInterval":{"type":"number","default":3},"showTitles":{"type":"boolean","default":false},"titlePosition":{"type":"string","default":"above"},"mediaPlayerSidebarVideos":{"type":"number","default":5}},"supports":{"html":false,"innerBlocks":true,"className":false,"align":["wide","full"],"spacing":{"margin":true,"padding":true,"blockGap":true}},"textdomain":"youtube-channel-block","editorScript":"file:./index.js","editorStyle":"file:./index.css","style":"file:./style-index.css","viewScript":"file:./view.js"}');

/***/ }),

/***/ "./src/youtube-block/edit.js":
/*!***********************************!*\
  !*** ./src/youtube-block/edit.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Edit)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./editor.scss */ "./src/youtube-block/editor.scss");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__);
/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */


/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */





/**
 * WordPress components
 */


/**
 * React hooks
 */


/**
 * Block editor utilities
 */


/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */


/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object} props Block props.
 * @return {Element} Element to render.
 */

function Edit({
  attributes,
  setAttributes,
  clientId
}) {
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
  const [localSourceUrl, setLocalSourceUrl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)(channelUrl || playlistUrl);
  const [localApiKey, setLocalApiKey] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)(apiKey);

  // Function to detect URL type and return appropriate channel/playlist URLs
  const parseSourceUrl = url => {
    if (!url) return {
      channelUrl: '',
      playlistUrl: ''
    };

    // Check if it's a playlist URL
    if (url.includes('playlist?list=') || url.includes('/playlist/')) {
      return {
        channelUrl: '',
        playlistUrl: url
      };
    }

    // Check if it's a channel URL (various formats)
    if (url.includes('youtube.com/@') || url.includes('youtube.com/c/') || url.includes('youtube.com/channel/') || url.includes('youtube.com/user/')) {
      return {
        channelUrl: url,
        playlistUrl: ''
      };
    }

    // If we can't determine, assume it's a channel URL
    return {
      channelUrl: url,
      playlistUrl: ''
    };
  };

  // Auto-fetch function that uses the source URL
  const autoFetchVideos = async sourceUrl => {
    if (!localApiKey || !sourceUrl) {
      return;
    }
    const {
      channelUrl,
      playlistUrl
    } = parseSourceUrl(sourceUrl);
    setAttributes({
      isLoading: true,
      error: ''
    });
    try {
      const data = await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default()({
        path: '/youtube-channel-block/v1/fetch-videos',
        method: 'POST',
        data: {
          channel_url: channelUrl,
          playlist_url: playlistUrl,
          api_key: localApiKey,
          max_results: maxResults,
          order: order,
          force_refresh: false // Use cache for auto-fetch
        }
      });
      const embedBlocks = data.videos.map(video => (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_6__.createBlock)('core/embed', {
        url: video.video_url,
        providerNameSlug: 'youtube',
        responsive: true
      }));
      replaceInnerBlocks(clientId, embedBlocks);
      setAttributes({
        isLoading: false,
        error: '',
        lastUpdated: new Date().toISOString(),
        channelUrl: channelUrl,
        playlistUrl: playlistUrl,
        apiKey: localApiKey
      });
      setSourceChangeNotice(''); // Clear any source change notice

      // Show cache status
      if (data.cached) {
        setSourceChangeNotice((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Data loaded from cache. Use "Clear Cache" to force fresh data.', 'youtube-channel-block'));
        setTimeout(() => setSourceChangeNotice(''), 5000);
      }
    } catch (err) {
      console.error('YouTube Block Error:', err);
      setAttributes({
        isLoading: false,
        error: `Error: ${err.message}. Please check your API key and URLs, and ensure the plugin is properly activated.`
      });
    }
  };

  // Handle source URL changes with auto-refresh
  const handleSourceUrlChange = newUrl => {
    setLocalSourceUrl(newUrl);
    // Auto-refresh if we have a valid URL and API key
    if (newUrl && localApiKey) {
      // Small delay to ensure state updates are processed
      setTimeout(() => {
        autoFetchVideos(newUrl);
      }, 100);
    }
  };
  const {
    replaceInnerBlocks
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useDispatch)('core/block-editor');

  // Track previous source URL to detect changes
  const [previousSourceUrl, setPreviousSourceUrl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)(localSourceUrl);
  const [sourceChangeNotice, setSourceChangeNotice] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)('');

  // Clear videos when source changes
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useEffect)(() => {
    if (previousSourceUrl !== localSourceUrl && localSourceUrl) {
      // Clear existing videos when source changes
      replaceInnerBlocks(clientId, []);
      const {
        channelUrl,
        playlistUrl
      } = parseSourceUrl(localSourceUrl);
      setAttributes({
        error: '',
        lastUpdated: '',
        channelUrl: channelUrl,
        playlistUrl: playlistUrl
      });

      // Show notice about source change
      setSourceChangeNotice((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Source changed - videos cleared. Click "Refresh Videos" to fetch new content.', 'youtube-channel-block'));

      // Clear notice after 5 seconds
      setTimeout(() => setSourceChangeNotice(''), 5000);
    }
    setPreviousSourceUrl(localSourceUrl);
  }, [localSourceUrl, clientId, replaceInnerBlocks, setAttributes, previousSourceUrl]);
  const wrapperProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
    className: ['wp-block-youtube-channel-block', align ? `align${align}` : '', layout === 'list' ? 'is-layout-list' : '', layout === 'grid' ? 'is-layout-grid' : '', layout === 'carousel' ? 'is-layout-carousel' : '', layout === 'media-player' ? 'is-layout-media-player' : '', showTitles ? 'has-titles' : '', showTitles ? `title-position-${titlePosition}` : ''].filter(Boolean).join(' '),
    'data-carousel-visible': layout === 'carousel' ? String(carouselVisible) : undefined,
    'data-carousel-autoplay': layout === 'carousel' ? String(carouselAutoplay) : undefined,
    'data-carousel-interval': layout === 'carousel' ? String(carouselInterval) : undefined,
    'data-show-titles': String(showTitles),
    'data-title-position': titlePosition
  });

  // For carousel layout, inject Splide classes into inner blocks
  const innerBlocksProps = layout === 'carousel' ? (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useInnerBlocksProps)({
    className: 'youtube-channel-block-inner-blocks splide__list'
  }, {
    templateLock: false,
    allowedBlocks: ['core/embed', 'core/paragraph', 'core/heading']
  }) : (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useInnerBlocksProps)({
    className: ['youtube-channel-block-inner-blocks', layout === 'grid' || 'carousel' ? `has-columns-${columns}` : 0].filter(Boolean).join(' ')
  }, {
    templateLock: false,
    allowedBlocks: ['core/embed', 'core/paragraph', 'core/heading']
  });
  const orderOptions = [{
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Date (newest first)', 'youtube-channel-block'),
    value: 'date'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Date (oldest first)', 'youtube-channel-block'),
    value: 'dateAsc'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Title (A-Z)', 'youtube-channel-block'),
    value: 'title'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Title (Z-A)', 'youtube-channel-block'),
    value: 'titleDesc'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Video count', 'youtube-channel-block'),
    value: 'videoCount'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('View count', 'youtube-channel-block'),
    value: 'viewCount'
  }];
  const layoutOptions = [{
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('List (vertical)', 'youtube-channel-block'),
    value: 'list'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Grid', 'youtube-channel-block'),
    value: 'grid'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Carousel', 'youtube-channel-block'),
    value: 'carousel'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Media Player', 'youtube-channel-block'),
    value: 'media-player'
  }];
  const frequencyOptions = [{
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Hourly', 'youtube-channel-block'),
    value: 'hourly'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Daily', 'youtube-channel-block'),
    value: 'daily'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Weekly', 'youtube-channel-block'),
    value: 'weekly'
  }];
  const titlePositionOptions = [{
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Above video', 'youtube-channel-block'),
    value: 'above'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Left of video', 'youtube-channel-block'),
    value: 'left'
  }, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Right of video', 'youtube-channel-block'),
    value: 'right'
  }];
  const fetchVideos = async () => {
    if (!localApiKey) {
      setAttributes({
        error: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('YouTube API key is required.', 'youtube-channel-block')
      });
      return;
    }
    if (!localSourceUrl) {
      setAttributes({
        error: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Please provide a YouTube channel or playlist URL.', 'youtube-channel-block')
      });
      return;
    }
    const {
      channelUrl,
      playlistUrl
    } = parseSourceUrl(localSourceUrl);
    setAttributes({
      isLoading: true,
      error: ''
    });
    try {
      const data = await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default()({
        path: '/youtube-channel-block/v1/fetch-videos',
        method: 'POST',
        data: {
          channel_url: channelUrl,
          playlist_url: playlistUrl,
          api_key: localApiKey,
          max_results: maxResults,
          order: order,
          force_refresh: true // Force fresh data on manual refresh
        }
      });
      const embedBlocks = data.videos.map(video => (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_6__.createBlock)('core/embed', {
        url: video.video_url,
        providerNameSlug: 'youtube',
        responsive: true
      }));
      replaceInnerBlocks(clientId, embedBlocks);
      setAttributes({
        isLoading: false,
        error: '',
        lastUpdated: new Date().toISOString(),
        channelUrl: channelUrl,
        playlistUrl: playlistUrl,
        apiKey: localApiKey
      });
      setSourceChangeNotice(''); // Clear any source change notice

      // Show cache status
      if (data.cached) {
        setSourceChangeNotice((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Data loaded from cache. Use "Clear Cache" to force fresh data.', 'youtube-channel-block'));
        setTimeout(() => setSourceChangeNotice(''), 5000);
      }
    } catch (err) {
      console.error('YouTube Block Error:', err);
      setAttributes({
        isLoading: false,
        error: `Error: ${err.message}. Please check your API key and URLs, and ensure the plugin is properly activated.`
      });
    }
  };
  const clearVideos = async () => {
    replaceInnerBlocks(clientId, []);
    setAttributes({
      error: '',
      lastUpdated: ''
    });
    setSourceChangeNotice(''); // Clear any source change notice

    // Also clear the cache when clearing videos
    try {
      await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default()({
        path: '/youtube-channel-block/v1/clear-cache',
        method: 'POST'
      });
    } catch (err) {
      console.log('Cache clear failed:', err);
    }
  };
  const clearCache = async () => {
    try {
      await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default()({
        path: '/youtube-channel-block/v1/clear-cache',
        method: 'POST'
      });
      setAttributes({
        error: ''
      });
      // Show success message
      setSourceChangeNotice((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Cache cleared successfully. Next fetch will get fresh data.', 'youtube-channel-block'));
      setTimeout(() => setSourceChangeNotice(''), 3000);
    } catch (err) {
      setAttributes({
        error: `Cache clear failed: ${err.message}`
      });
    }
  };

  // Show placeholder if no source URL is provided
  if (!localSourceUrl) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
      ...wrapperProps,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Placeholder, {
        icon: "video-alt3",
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('YouTube Videos Block', 'youtube-channel-block'),
        instructions: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Enter a YouTube channel or playlist URL to fetch and display videos.', 'youtube-channel-block'),
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
          className: "youtube-channel-block-placeholder-controls",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.TextControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('YouTube API Key', 'youtube-channel-block'),
            value: localApiKey,
            onChange: setLocalApiKey,
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Get your API key from Google Cloud Console', 'youtube-channel-block'),
            placeholder: "AIzaSy..."
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.TextControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Source URL', 'youtube-channel-block'),
            value: localSourceUrl,
            onChange: handleSourceUrlChange,
            placeholder: "https://www.youtube.com/@channelname or https://www.youtube.com/playlist?list=...",
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Enter a YouTube channel URL or playlist URL', 'youtube-channel-block')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.RangeControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Number of videos', 'youtube-channel-block'),
            value: maxResults,
            onChange: value => setAttributes({
              maxResults: value
            }),
            min: 1,
            max: 50
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Sort order', 'youtube-channel-block'),
            value: order,
            options: orderOptions,
            onChange: value => setAttributes({
              order: value
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
            variant: "primary",
            onClick: fetchVideos,
            disabled: isLoading || !localApiKey,
            children: isLoading ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Fetching...', 'youtube-channel-block') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Fetch Videos', 'youtube-channel-block')
          })]
        })
      })
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
    ...wrapperProps,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('YouTube Settings', 'youtube-channel-block'),
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('YouTube API Key', 'youtube-channel-block'),
          value: localApiKey,
          onChange: setLocalApiKey,
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Get your API key from Google Cloud Console', 'youtube-channel-block')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Source URL', 'youtube-channel-block'),
          value: localSourceUrl,
          onChange: handleSourceUrlChange,
          placeholder: "https://www.youtube.com/@channelname or https://www.youtube.com/playlist?list=...",
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Enter a YouTube channel URL or playlist URL', 'youtube-channel-block')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Number of videos', 'youtube-channel-block'),
          value: maxResults,
          onChange: value => setAttributes({
            maxResults: value
          }),
          min: 1,
          max: 50
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Sort order', 'youtube-channel-block'),
          value: order,
          options: orderOptions,
          onChange: value => setAttributes({
            order: value
          })
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Layout', 'youtube-channel-block'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Layout Type', 'youtube-channel-block'),
          value: layout,
          options: layoutOptions,
          onChange: value => setAttributes({
            layout: value
          })
        }), layout === 'grid' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Columns', 'youtube-channel-block'),
          value: columns,
          onChange: value => setAttributes({
            columns: value
          }),
          min: 1,
          max: 6
        }), layout === 'carousel' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.RangeControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Visible videos', 'youtube-channel-block'),
            value: carouselVisible,
            onChange: value => setAttributes({
              carouselVisible: value
            }),
            min: 1,
            max: 6
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Autoplay', 'youtube-channel-block'),
            checked: carouselAutoplay,
            onChange: value => setAttributes({
              carouselAutoplay: value
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.RangeControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Interval (seconds)', 'youtube-channel-block'),
            value: carouselInterval,
            onChange: value => setAttributes({
              carouselInterval: value
            }),
            min: 1,
            max: 12
          })]
        }), layout === 'list' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show video titles', 'youtube-channel-block'),
            checked: showTitles,
            onChange: value => setAttributes({
              showTitles: value
            })
          }), showTitles && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Title position', 'youtube-channel-block'),
            value: titlePosition,
            options: titlePositionOptions,
            onChange: value => setAttributes({
              titlePosition: value
            })
          })]
        }), layout === 'media-player' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.RangeControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Sidebar videos', 'youtube-channel-block'),
            value: mediaPlayerSidebarVideos,
            onChange: value => setAttributes({
              mediaPlayerSidebarVideos: value
            }),
            min: 3,
            max: 10,
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Number of videos to show in the sidebar', 'youtube-channel-block')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToggleControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show video titles', 'youtube-channel-block'),
            checked: showTitles,
            onChange: value => setAttributes({
              showTitles: value
            })
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Auto Update', 'youtube-channel-block'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Auto-update videos', 'youtube-channel-block'),
          checked: autoUpdate,
          onChange: value => setAttributes({
            autoUpdate: value
          })
        }), autoUpdate && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Update frequency', 'youtube-channel-block'),
          value: updateFrequency,
          options: frequencyOptions,
          onChange: value => setAttributes({
            updateFrequency: value
          })
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
      className: "youtube-channel-block-container",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
        className: "youtube-channel-block-header",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("h3", {
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('YouTube Videos', 'youtube-channel-block')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
            className: "youtube-channel-block-meta",
            children: [lastUpdated && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("span", {
              className: "last-updated",
              children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Last updated:', 'youtube-channel-block'), " ", new Date(lastUpdated).toLocaleString()]
            }), sourceChangeNotice && sourceChangeNotice.includes('cache') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("span", {
              className: "cache-status",
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('📦 Cached', 'youtube-channel-block')
            }), autoUpdate && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("span", {
              className: "auto-update-badge",
              children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Auto-update:', 'youtube-channel-block'), " ", updateFrequency]
            })]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
          className: "youtube-channel-block-actions",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
            variant: "primary",
            onClick: fetchVideos,
            disabled: isLoading || !localApiKey,
            children: isLoading ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Fetching...', 'youtube-channel-block') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Refresh Videos', 'youtube-channel-block')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
            variant: "secondary",
            onClick: clearVideos,
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Clear Videos', 'youtube-channel-block')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
            variant: "tertiary",
            onClick: clearCache,
            title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Clear cached data to force fresh API calls', 'youtube-channel-block'),
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Clear Cache', 'youtube-channel-block')
          })]
        })]
      }), error && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Notice, {
        status: "error",
        isDismissible: false,
        children: error
      }), sourceChangeNotice && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Notice, {
        status: "info",
        isDismissible: false,
        children: sourceChangeNotice
      }), isLoading && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
        className: "youtube-channel-block-loading",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Spinner, {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("span", {
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Fetching videos...', 'youtube-channel-block')
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
        ...innerBlocksProps
      })]
    })]
  });
}

/***/ }),

/***/ "./src/youtube-block/editor.scss":
/*!***************************************!*\
  !*** ./src/youtube-block/editor.scss ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/youtube-block/index.js":
/*!************************************!*\
  !*** ./src/youtube-block/index.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.scss */ "./src/youtube-block/style.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./src/youtube-block/edit.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./save */ "./src/youtube-block/save.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./block.json */ "./src/youtube-block/block.json");
/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */


/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */


/**
 * Internal dependencies
 */




/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_4__.name, {
  /**
   * @see ./edit.js
   */
  edit: _edit__WEBPACK_IMPORTED_MODULE_2__["default"],
  /**
   * @see ./save.js
   */
  save: _save__WEBPACK_IMPORTED_MODULE_3__["default"]
});

/***/ }),

/***/ "./src/youtube-block/save.js":
/*!***********************************!*\
  !*** ./src/youtube-block/save.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ save)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */


/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @param {Object} props Block props.
 * @return {Element} Element to render.
 */

function save({
  attributes
}) {
  const {
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
  const wrapperProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps.save({
    className: ['wp-block-youtube-channel-block', align ? `align${align}` : '', layout === 'list' ? 'is-layout-list' : '', layout === 'grid' ? 'is-layout-grid' : '', layout === 'carousel' ? 'is-layout-carousel' : '', layout === 'media-player' ? 'is-layout-media-player' : '', showTitles ? 'has-titles' : '', showTitles ? `title-position-${titlePosition}` : ''].filter(Boolean).join(' '),
    'data-show-titles': String(showTitles),
    'data-title-position': titlePosition,
    'data-media-player-sidebar-videos': layout === 'media-player' ? String(mediaPlayerSidebarVideos) : undefined
  });

  // For carousel layout, inject Splide classes into inner blocks
  if (layout === 'carousel') {
    const innerBlocksProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useInnerBlocksProps.save({
      className: 'youtube-channel-block-inner-blocks splide__list'
    });
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      ...wrapperProps,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
        className: "splide",
        "data-carousel-visible": carouselVisible,
        "data-carousel-autoplay": carouselAutoplay,
        "data-carousel-interval": carouselInterval,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
          className: "splide__track",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
            ...innerBlocksProps
          })
        })
      })
    });
  }

  // For other layouts, use standard structure
  const innerBlocksProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useInnerBlocksProps.save({
    className: ['youtube-channel-block-inner-blocks', layout === 'grid' ? `has-columns-${columns}` : ''].filter(Boolean).join(' ')
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
    ...wrapperProps,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      ...innerBlocksProps
    })
  });
}

/***/ }),

/***/ "./src/youtube-block/style.scss":
/*!**************************************!*\
  !*** ./src/youtube-block/style.scss ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "@wordpress/api-fetch":
/*!**********************************!*\
  !*** external ["wp","apiFetch"] ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["wp"]["apiFetch"];

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["data"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "react/jsx-runtime":
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["ReactJSXRuntime"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"youtube-block/index": 0,
/******/ 			"youtube-block/style-index": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = globalThis["webpackChunkyoutube_channel_block"] = globalThis["webpackChunkyoutube_channel_block"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["youtube-block/style-index"], () => (__webpack_require__("./src/youtube-block/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map