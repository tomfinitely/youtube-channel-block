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


/* eslint-enable no-console */
