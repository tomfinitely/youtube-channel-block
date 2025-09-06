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
    const isListLayout = block.classList.contains('is-layout-list');
    const sidebarVideos = parseInt(block.dataset.mediaPlayerSidebarVideos) || 5;
    
    if (isMediaPlayer) {
      // Handle Media Player layout - titles are always shown
      initializeMediaPlayer(block, true, sidebarVideos);
    } else if (isListLayout && showTitles && titlePosition) {
      // Handle regular title display only for list layout
      handleTitleDisplay(block, showTitles, titlePosition);
    }
  });

  // Splide
  const splides = document.querySelectorAll('.splide')

  if(!!splides && splides.length > 0){
    splides.forEach(splide => {
      // Get carousel settings from data attributes
      const visible = parseInt(splide.dataset.carouselVisible) || 1;
      const autoplay = splide.dataset.carouselAutoplay === 'true';
      const interval = parseInt(splide.dataset.carouselInterval) || 3;
      
      // Add splide__slide class to each embed block
      const embedBlocks = splide.querySelectorAll('.wp-block-embed');
      embedBlocks.forEach(embed => {
        embed.classList.add('splide__slide');
      });
      
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

      new Splide(splide, options).mount();
    })
  }
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
function initializeMediaPlayer(block, showTitles, sidebarVideos) {
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
        titleElement.textContent = data.title;
        return;
      }
    }
  } catch (error) {
    console.log('Could not fetch title from WordPress API, trying alternative method');
  }
  
  // Fallback: try to extract from page title or use a placeholder
  titleElement.textContent = `Video ${videoId}`;
}


/* eslint-enable no-console */
