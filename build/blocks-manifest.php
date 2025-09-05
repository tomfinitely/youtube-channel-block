<?php
// This file is generated. Do not modify it manually.
return array(
	'youtube-block' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'youtube-channel-block/youtube-channel-block',
		'version' => '0.2.0',
		'title' => 'YouTube Channel Block',
		'category' => 'media',
		'icon' => 'video-alt3',
		'description' => 'A block that fetches and displays YouTube videos from channels or playlists using the YouTube Data API.',
		'example' => array(
			
		),
		'attributes' => array(
			'channelUrl' => array(
				'type' => 'string',
				'default' => ''
			),
			'playlistUrl' => array(
				'type' => 'string',
				'default' => ''
			),
			'apiKey' => array(
				'type' => 'string',
				'default' => ''
			),
			'maxResults' => array(
				'type' => 'number',
				'default' => 10
			),
			'order' => array(
				'type' => 'string',
				'default' => 'date'
			),
			'isLoading' => array(
				'type' => 'boolean',
				'default' => false
			),
			'error' => array(
				'type' => 'string',
				'default' => ''
			),
			'lastUpdated' => array(
				'type' => 'string',
				'default' => ''
			),
			'autoUpdate' => array(
				'type' => 'boolean',
				'default' => true
			),
			'updateFrequency' => array(
				'type' => 'string',
				'default' => 'daily'
			),
			'layout' => array(
				'type' => 'string',
				'default' => 'list'
			),
			'columns' => array(
				'type' => 'number',
				'default' => 3
			),
			'carouselVisible' => array(
				'type' => 'number',
				'default' => 1
			),
			'carouselAutoplay' => array(
				'type' => 'boolean',
				'default' => true
			),
			'carouselInterval' => array(
				'type' => 'number',
				'default' => 3
			),
			'showTitles' => array(
				'type' => 'boolean',
				'default' => false
			),
			'titlePosition' => array(
				'type' => 'string',
				'default' => 'above'
			),
			'mediaPlayerSidebarVideos' => array(
				'type' => 'number',
				'default' => 5
			)
		),
		'supports' => array(
			'html' => false,
			'innerBlocks' => true,
			'className' => false,
			'align' => array(
				'wide',
				'full'
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'blockGap' => true
			)
		),
		'textdomain' => 'youtube-channel-block',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js'
	)
);
