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

  // Handle YouTube blocks with titles
  const youtubeBlocks = document.querySelectorAll('.wp-block-youtube-channel-block');
  
  youtubeBlocks.forEach(block => {
    const showTitles = block.dataset.showTitles === 'true';
    const titlePosition = block.dataset.titlePosition || 'above';
    
    if (showTitles && titlePosition) {
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
