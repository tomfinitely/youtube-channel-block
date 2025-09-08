/**
 * Use this file for JavaScript code that you want to run in the front-end
 * on posts/pages that contain this block.
 *
 * When this file is defined as the value of the `viewScript` property
 * in `block.json` it will be enqueued on the front end of the site.
 *
 * Example:
 *
 * ```js
 * {
 *   "viewScript": "file:./view.js"
 * }
 * ```
 *
 * If you're not making any changes to this file because your project doesn't need any
 * JavaScript running in the front-end, then you should delete this file and remove
 * the `viewScript` property from `block.json`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#view-script
 */

/* eslint-disable no-console */
import Splide from '@splidejs/splide';

// This should only be output on the frontend of the site - NOT the editor
console.log("hello from the frontend.")

document.addEventListener( 'DOMContentLoaded', () => {

  // Handle YouTube blocks with titles and media player layout
  const youtubeBlocks = document.querySelectorAll('.wp-block-youtube-channel-block');
  
  youtubeBlocks.forEach(block => {
    const showTitles = block.dataset.showTitles === 'true';
    const titlePosition = block.dataset.titlePosition || 'above';
    const isMediaPlayer = block.classList.contains('is-layout-media-player');
    const isCarousel = block.classList.contains('is-layout-carousel');
    const isListLayout = block.classList.contains('is-layout-list');
    const sidebarVideos = parseInt(block.dataset.mediaPlayerSidebarVideos) || 5;
    const enableDeepLinking = block.dataset.enableDeepLinking === 'true';
    
    if (isMediaPlayer) {
      // Handle Media Player layout - titles are always shown
      initializeMediaPlayer(block, true, sidebarVideos, enableDeepLinking);
    } else if (isCarousel) {
      // Handle Carousel layout with deep linking
      initializeCarousel(block, enableDeepLinking);
    } else if (isListLayout && showTitles && titlePosition) {
      // Handle regular title display only for list layout
      handleTitleDisplay(block, showTitles, titlePosition);
    }
  });

  // Initialize deep linking for all YouTube blocks
  initializeDeepLinking();
})

// Helper function to extract video ID from embed URL
function extractVideoIdFromEmbed(src) {
  const match = src.match(/\/embed\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

// Helper function to handle title display for regular layouts
function handleTitleDisplay(block, showTitles, titlePosition) {
  if (!showTitles || !titlePosition) return;
  
  // Find all embed blocks within this YouTube block
  const embedBlocks = block.querySelectorAll('.wp-block-embed');
  
  embedBlocks.forEach((embed, index) => {
    // Get the video URL from the embed
    const iframe = embed.querySelector('iframe');
    if (iframe) {
      const src = iframe.src;
      const videoId = extractVideoIdFromEmbed(src);
      
      if (videoId) {
        // Create title element
        const titleElement = document.createElement('div');
        titleElement.className = `youtube-video-title title-position-${titlePosition}`;
        titleElement.setAttribute('data-video-id', videoId);
        
        // Fetch and display title
        fetchVideoTitle(videoId, titleElement);
        
        // Position the title based on the setting
        if (titlePosition === 'above') {
          embed.parentNode.insertBefore(titleElement, embed);
        } else if (titlePosition === 'left') {
          // Create a wrapper for left/right positioning
          const wrapper = document.createElement('div');
          wrapper.className = 'youtube-video-with-title youtube-video-left-title';
          embed.parentNode.insertBefore(wrapper, embed);
          wrapper.appendChild(titleElement);
          wrapper.appendChild(embed);
        } else if (titlePosition === 'right') {
          // Create a wrapper for right positioning
          const wrapper = document.createElement('div');
          wrapper.className = 'youtube-video-with-title youtube-video-right-title';
          embed.parentNode.insertBefore(wrapper, embed);
          wrapper.appendChild(embed);
          wrapper.appendChild(titleElement);
        }
      }
    }
  });
}

// Helper function to initialize Media Player layout
function initializeMediaPlayer(block, showTitles, sidebarVideos, enableDeepLinking = false) {
  const embedBlocks = block.querySelectorAll('.wp-block-embed');
  
  if (embedBlocks.length === 0) return;
  
  // Create Media Player structure
  const mediaPlayerContainer = document.createElement('div');
  mediaPlayerContainer.className = 'youtube-media-player';
  
  // Main video area (first video)
  const mainVideoArea = document.createElement('div');
  mainVideoArea.className = 'youtube-main-video';
  
  // Sidebar area
  const sidebarArea = document.createElement('div');
  sidebarArea.className = 'youtube-sidebar';
  
  // Get the first video (main video)
  const mainVideo = embedBlocks[0];
  const mainVideoId = extractVideoIdFromEmbed(mainVideo.querySelector('iframe')?.src);
  
  // Create main video container
  const mainVideoContainer = document.createElement('div');
  mainVideoContainer.className = 'youtube-main-video-container';
  
  // Note: Main video title is intentionally hidden in media player layout
  // Only sidebar titles are shown for better UX
  // if (showTitles && mainVideoId) {
  //   const mainTitle = document.createElement('h3');
  //   mainTitle.className = 'youtube-main-video-title';
  //   mainTitle.setAttribute('data-video-id', mainVideoId);
  //   fetchVideoTitle(mainVideoId, mainTitle);
  //   mainVideoContainer.appendChild(mainTitle);
  // }
  
  mainVideoContainer.appendChild(mainVideo.cloneNode(true));
  mainVideoArea.appendChild(mainVideoContainer);
  
  // Create sidebar videos (remaining videos)
  const remainingVideos = Array.from(embedBlocks).slice(1, sidebarVideos + 1);
  
  remainingVideos.forEach((embed, index) => {
    const iframe = embed.querySelector('iframe');
    if (iframe) {
      const videoId = extractVideoIdFromEmbed(iframe.src);
      
      const sidebarItem = document.createElement('div');
      sidebarItem.className = 'youtube-sidebar-item';
      sidebarItem.setAttribute('data-video-id', videoId);
      
      // Create thumbnail (we'll use the embed's iframe as thumbnail for now)
      const thumbnail = document.createElement('div');
      thumbnail.className = 'youtube-sidebar-thumbnail';
      
      // Create a smaller iframe for thumbnail
      const thumbnailIframe = iframe.cloneNode(true);
      thumbnailIframe.style.width = '100%';
      thumbnailIframe.style.height = '100px';
      thumbnail.appendChild(thumbnailIframe);
      
      sidebarItem.appendChild(thumbnail);
      
      if (showTitles && videoId) {
        const title = document.createElement('div');
        title.className = 'youtube-sidebar-title';
        title.setAttribute('data-video-id', videoId);
        fetchVideoTitle(videoId, title);
        sidebarItem.appendChild(title);
      }
      
      // Add click handler to switch videos
      sidebarItem.addEventListener('click', () => {
        switchToVideo(block, videoId, embed, showTitles);
        // Update URL hash for deep linking if enabled
        if (enableDeepLinking) {
          // Get title from the data attribute or text content
          const title = sidebarItem.getAttribute('data-video-title') || 
                       sidebarItem.querySelector('.youtube-sidebar-title')?.textContent ||
                       `Video ${videoId}`;
          
          if (title && title !== `Video ${videoId}`) {
            updateUrlHashWithTitle(title);
          }
        }
      });
      
      sidebarArea.appendChild(sidebarItem);
    }
  });
  
  // Assemble the media player
  mediaPlayerContainer.appendChild(mainVideoArea);
  mediaPlayerContainer.appendChild(sidebarArea);
  
  // Replace the original inner blocks with the media player
  const innerBlocks = block.querySelector('.youtube-channel-block-inner-blocks');
  if (innerBlocks) {
    innerBlocks.innerHTML = '';
    innerBlocks.appendChild(mediaPlayerContainer);
  }
  
  // Check for initial hash and switch to target video if needed
  if (enableDeepLinking) {
    const initialSlug = getVideoTitleFromUrl();
    if (initialSlug) {
      // Find video by slug (we'll need to wait for titles to load)
      const checkForInitialVideo = () => {
        const sidebarItem = block.querySelector(`[data-video-slug="${initialSlug}"]`);
        if (sidebarItem) {
          sidebarItem.click();
        } else {
          // Try again in a bit if slug hasn't been set yet
          setTimeout(checkForInitialVideo, 200);
        }
      };
      
      setTimeout(checkForInitialVideo, 100);
    }
  }
}

// Helper function to switch videos in Media Player
function switchToVideo(block, videoId, newEmbed, showTitles) {
  const mainVideoContainer = block.querySelector('.youtube-main-video-container');
  if (!mainVideoContainer) return;
  
  // Update main video
  const mainEmbed = mainVideoContainer.querySelector('.wp-block-embed');
  if (mainEmbed) {
    const newIframe = newEmbed.querySelector('iframe');
    if (newIframe) {
      const mainIframe = mainEmbed.querySelector('iframe');
      if (mainIframe) {
        mainIframe.src = newIframe.src;
      }
    }
  }
  
  // Note: Main video title is not shown in media player layout
  // Only sidebar titles are displayed
  // if (showTitles) {
  //   const mainTitle = mainVideoContainer.querySelector('.youtube-main-video-title');
  //   if (mainTitle) {
  //     mainTitle.setAttribute('data-video-id', videoId);
  //     fetchVideoTitle(videoId, mainTitle);
  //   }
  // }
  
  // Update active state in sidebar
  const sidebarItems = block.querySelectorAll('.youtube-sidebar-item');
  sidebarItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-video-id') === videoId) {
      item.classList.add('active');
    }
  });
}

// Helper function to fetch video title
async function fetchVideoTitle(videoId, titleElement) {
  try {
    // First try to get from WordPress REST API if available
    const response = await fetch(`/wp-json/youtube-channel-block/v1/video-title/${videoId}`);
    if (response.ok) {
      const data = await response.json();
      if (data.title) {
        const title = data.title;
        const slug = createSlug(title);
        
        titleElement.textContent = title;
        titleElement.setAttribute('data-video-title', title);
        titleElement.setAttribute('data-video-slug', slug);
        
        // Also set on parent sidebar item if this is a sidebar title
        const sidebarItem = titleElement.closest('.youtube-sidebar-item');
        if (sidebarItem) {
          sidebarItem.setAttribute('data-video-title', title);
          sidebarItem.setAttribute('data-video-slug', slug);
        }
        
        // Also set on parent embed if this is a regular title
        const embedBlock = titleElement.closest('.wp-block-embed');
        if (embedBlock) {
          embedBlock.setAttribute('data-video-title', title);
          embedBlock.setAttribute('data-video-slug', slug);
        }
        
        // Dispatch custom event for deep linking
        const event = new CustomEvent('title-loaded', {
          detail: { title: title, slug: slug, videoId: videoId }
        });
        titleElement.dispatchEvent(event);
        return;
      }
    }
  } catch (error) {
    console.log('Could not fetch title from WordPress API, trying alternative method');
  }
  
  // Fallback: try to extract from page title or use a placeholder
  const fallbackTitle = `Video ${videoId}`;
  const slug = createSlug(fallbackTitle);
  
  titleElement.textContent = fallbackTitle;
  titleElement.setAttribute('data-video-title', fallbackTitle);
  titleElement.setAttribute('data-video-slug', slug);
  
  // Also set on parent sidebar item if this is a sidebar title
  const sidebarItem = titleElement.closest('.youtube-sidebar-item');
  if (sidebarItem) {
    sidebarItem.setAttribute('data-video-title', fallbackTitle);
    sidebarItem.setAttribute('data-video-slug', slug);
  }
  
  // Also set on parent embed if this is a regular title
  const embedBlock = titleElement.closest('.wp-block-embed');
  if (embedBlock) {
    embedBlock.setAttribute('data-video-title', fallbackTitle);
    embedBlock.setAttribute('data-video-slug', slug);
  }
  
  // Dispatch custom event for deep linking
  const event = new CustomEvent('title-loaded', {
    detail: { title: fallbackTitle, slug: slug, videoId: videoId }
  });
  titleElement.dispatchEvent(event);
}

// Store Splide instances globally for deep linking access
window.youtubeBlockSplideInstances = window.youtubeBlockSplideInstances || new Map();

// Helper function to initialize Carousel layout with deep linking
function initializeCarousel(block, enableDeepLinking = false) {
  const splide = block.querySelector('.splide');
  if (!splide) return;
  
  // Get carousel settings from data attributes
  const visible = parseInt(splide.dataset.carouselVisible) || 1;
  const autoplay = splide.dataset.carouselAutoplay === 'true';
  const interval = parseInt(splide.dataset.carouselInterval) || 3;
  
  // Add splide__slide class to each embed block
  const embedBlocks = splide.querySelectorAll('.wp-block-embed');
  embedBlocks.forEach(embed => {
    embed.classList.add('splide__slide');
  });
  
  // Fetch video titles for deep linking if enabled
  if (enableDeepLinking) {
    embedBlocks.forEach((embed, index) => {
      const iframe = embed.querySelector('iframe');
      if (iframe) {
        const videoId = extractVideoIdFromEmbed(iframe.src);
        if (videoId) {
          // Create a temporary title element to fetch the title
          const tempTitleElement = document.createElement('div');
          tempTitleElement.setAttribute('data-video-id', videoId);
          
          // Listen for the title-loaded event
          tempTitleElement.addEventListener('title-loaded', (event) => {
            const title = event.detail.title;
            const slug = event.detail.slug;
            
            if (title && slug) {
              embed.setAttribute('data-video-title', title);
              embed.setAttribute('data-video-slug', slug);
            }
          });
          
          // Fetch title
          fetchVideoTitle(videoId, tempTitleElement);
        }
      }
    });
  }
  
  // Configure Splide options
  const options = {
    type: 'loop',
    perPage: visible,
    perMove: 1,
    gap: '1rem',
    padding: '1rem',
    breakpoints: {
      768: {
        perPage: Math.min(visible, 2),
      },
      480: {
        perPage: 1,
      },
    },
  };

  // Add autoplay if enabled
  if (autoplay) {
    options.autoplay = true;
    options.interval = interval * 1000; // Convert to milliseconds
    options.pauseOnHover = true;
  }

  // Initialize Splide
  const splideInstance = new Splide(splide, options);
  
  // Store the instance for deep linking access
  if (enableDeepLinking) {
    window.youtubeBlockSplideInstances.set(block, { instance: splideInstance, embedBlocks });
  }
  
  // Add deep linking support if enabled
  if (enableDeepLinking) {
    splideInstance.on('mounted', () => {
      // Check for initial hash
      const initialSlug = getVideoTitleFromUrl();
      if (initialSlug) {
        // Find video by slug (we'll need to wait for slugs to be set)
        const checkForInitialVideo = () => {
          const targetIndex = findVideoIndexBySlug(embedBlocks, initialSlug);
          if (targetIndex !== -1) {
            splideInstance.go(targetIndex);
          } else {
            // Try again in a bit if slug hasn't been set yet
            setTimeout(checkForInitialVideo, 200);
          }
        };
        
        setTimeout(checkForInitialVideo, 100);
      }
      
      // Update hash when slide changes
      splideInstance.on('moved', (newIndex) => {
        const embed = embedBlocks[newIndex];
        if (embed) {
          // Try to get title from embed data or title elements
          const title = embed.getAttribute('data-video-title') ||
                       embed.querySelector('.youtube-video-title, .youtube-sidebar-title')?.textContent;
          
          if (title) {
            updateUrlHashWithTitle(title);
          } else {
            // Fallback: try to extract from iframe if title not yet loaded
            const iframe = embed.querySelector('iframe');
            if (iframe) {
              const videoId = extractVideoIdFromEmbed(iframe.src);
              if (videoId) {
                updateUrlHashWithTitle(`Video ${videoId}`);
              }
            }
          }
        }
      });
    });
  }
  
  splideInstance.mount();
}

// Helper function to initialize deep linking for all YouTube blocks
function initializeDeepLinking() {
  // Listen for hash changes
  window.addEventListener('hashchange', handleHashChange);
  
  // Handle initial hash on page load
  const initialTitle = getVideoTitleFromUrl();
  if (initialTitle) {
    // Small delay to ensure all blocks are initialized
    setTimeout(() => {
      handleHashChange();
    }, 100);
  }
}

// Helper function to handle hash changes
function handleHashChange() {
  const videoSlug = getVideoTitleFromUrl();
  console.log('handleHashChange called, videoSlug:', videoSlug);
  if (!videoSlug) return;
  
  // Find all YouTube blocks with deep linking enabled
  const youtubeBlocks = document.querySelectorAll('.wp-block-youtube-channel-block');
  console.log('Found YouTube blocks:', youtubeBlocks.length);
  
  youtubeBlocks.forEach(block => {
    // Check if deep linking is enabled for this block
    const enableDeepLinking = block.dataset.enableDeepLinking === 'true';
    console.log('Block deep linking enabled:', enableDeepLinking, 'data attribute:', block.dataset.enableDeepLinking);
    if (!enableDeepLinking) return;
    
    const isMediaPlayer = block.classList.contains('is-layout-media-player');
    const isCarousel = block.classList.contains('is-layout-carousel');
    console.log('Block type - isMediaPlayer:', isMediaPlayer, 'isCarousel:', isCarousel);
    
    if (isMediaPlayer) {
      // Handle media player deep linking
      const sidebarItem = block.querySelector(`[data-video-slug="${videoSlug}"]`);
      console.log('Looking for media player item with slug:', videoSlug, 'found:', !!sidebarItem);
      if (sidebarItem) {
        console.log('Clicking sidebar item for slug:', videoSlug);
        sidebarItem.click();
      }
    } else if (isCarousel) {
      // Handle carousel deep linking using stored instance
      const splideData = window.youtubeBlockSplideInstances.get(block);
      console.log('Carousel splide data:', !!splideData);
      if (splideData) {
        const targetIndex = findVideoIndexBySlug(splideData.embedBlocks, videoSlug);
        console.log('Target index for carousel:', targetIndex);
        if (targetIndex !== -1) {
          splideData.instance.go(targetIndex);
        } else {
          // If not found immediately, try again after a short delay
          // This handles cases where titles are still being fetched
          setTimeout(() => {
            const retryIndex = findVideoIndexBySlug(splideData.embedBlocks, videoSlug);
            console.log('Retry target index for carousel:', retryIndex);
            if (retryIndex !== -1) {
              splideData.instance.go(retryIndex);
            }
          }, 500);
        }
      }
    }
  });
}

// Helper function to create WordPress-style slugs
function createSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Replace spaces and multiple whitespace with hyphens
    .replace(/\s+/g, '-')
    // Replace special characters with hyphens
    .replace(/[^a-z0-9-]/g, '-')
    // Replace multiple hyphens with single hyphen
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
}

// Helper function to get video title from URL
function getVideoTitleFromUrl() {
  const hash = window.location.hash;
  if (hash && hash.startsWith('#')) {
    return hash.substring(1); // Remove '#' prefix
  }
  return null;
}

// Helper function to update URL hash with title
function updateUrlHashWithTitle(title) {
  const slug = createSlug(title);
  const newHash = `#${slug}`;
  console.log('Updating URL hash:', newHash, 'from title:', title);
  if (window.location.hash !== newHash) {
    // Use history.replaceState to avoid adding to browser history
    window.history.replaceState(null, null, newHash);
  }
}

// Helper function to find video index by title
function findVideoIndexByTitle(embedBlocks, title) {
  for (let i = 0; i < embedBlocks.length; i++) {
    const titleElement = embedBlocks[i].querySelector('.youtube-video-title, .youtube-sidebar-title');
    if (titleElement && titleElement.textContent === title) {
      return i;
    }
  }
  return -1;
}

// Helper function to find video index by slug
function findVideoIndexBySlug(embedBlocks, slug) {
  for (let i = 0; i < embedBlocks.length; i++) {
    const embedBlock = embedBlocks[i];
    if (embedBlock.getAttribute('data-video-slug') === slug) {
      return i;
    }
    // Also check title elements within the embed block
    const titleElement = embedBlock.querySelector('.youtube-video-title, .youtube-sidebar-title');
    if (titleElement && titleElement.getAttribute('data-video-slug') === slug) {
      return i;
    }
  }
  return -1;
}


/* eslint-enable no-console */
