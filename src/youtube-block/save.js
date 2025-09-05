/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

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
export default function save({ attributes }) {
	const { lastUpdated, autoUpdate, updateFrequency, layout, columns, carouselVisible, carouselAutoplay, carouselInterval, showTitles, titlePosition, mediaPlayerSidebarVideos, align } = attributes;

	const wrapperProps = useBlockProps.save({
		className: [
			'wp-block-youtube-channel-block',
			align ? `align${align}` : '',
			layout === 'list' ? 'is-layout-list' : '',
			layout === 'grid' ? 'is-layout-grid' : '',
			layout === 'carousel' ? 'is-layout-carousel' : '',
			showTitles ? 'has-titles' : '',
			showTitles ? `title-position-${titlePosition}` : ''
		].filter(Boolean).join(' '),
		'data-show-titles': String(showTitles),
		'data-title-position': titlePosition,
	});

	// For carousel layout, inject Splide classes into inner blocks
	if (layout === 'carousel') {
		const innerBlocksProps = useInnerBlocksProps.save({
			className: 'youtube-channel-block-inner-blocks splide__list',
		});

		return (
			<div {...wrapperProps}>
				<div className="splide" data-carousel-visible={carouselVisible} data-carousel-autoplay={carouselAutoplay} data-carousel-interval={carouselInterval}>
					<div className="splide__track">
						<div {...innerBlocksProps} />
					</div>
				</div>
			</div>
		);
	}

	// For other layouts, use standard structure
	const innerBlocksProps = useInnerBlocksProps.save({
		className: ['youtube-channel-block-inner-blocks', layout === 'grid' ? `has-columns-${columns}` : ''].filter(Boolean).join(' '),
	});

	return (
		<div {...wrapperProps}>
			<div {...innerBlocksProps} />
		</div>
	);
}
