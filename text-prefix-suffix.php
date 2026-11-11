<?php
/**
 * Plugin Name:       Text Prefix & Suffix
 * Description:       Add virtual text before or after a paragraph or heading block.
 * Version:           1.0.0
 * Requires at least: 6.8
 * Requires PHP:      7.4
 * Author:            SLICK Design
 * Author URI:        https://slickdesign.com.au
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       text-prefix-suffix
 *
 * @package TextPrefixSuffix
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Enqueue block editor extensions.
 */
function text_prefix_suffix_enqueue_block_editor_assets() {
	$asset_file = __DIR__ . '/build/index.asset.php';

	if ( ! file_exists( $asset_file ) ) {
		return;
	}

	$asset = include $asset_file;

	wp_enqueue_script(
		'text-prefix-suffix-editor',
		plugins_url( 'build/index.js', __FILE__ ),
		$asset['dependencies'],
		$asset['version'],
		true
	);
	wp_set_script_translations( 'text-prefix-suffix-editor', 'text-prefix-suffix' );
}
add_action( 'enqueue_block_editor_assets', 'text_prefix_suffix_enqueue_block_editor_assets' );

/**
 * Get block names supported by this plugin.
 *
 * @return string[] Supported block names.
 */
function text_prefix_suffix_get_supported_blocks() {
	return array( 'core/paragraph', 'core/heading' );
}

/**
 * Enqueue block content styles on the front end and inside the editor iframe.
 */
function text_prefix_suffix_enqueue_block_styles() {
	$stylesheet = __DIR__ . '/public/text-prefix-suffix.css';

	if ( ! file_exists( $stylesheet ) ) {
		return;
	}

	wp_enqueue_style(
		'text-prefix-suffix',
		plugins_url( 'public/text-prefix-suffix.css', __FILE__ ),
		array(),
		filemtime( $stylesheet )
	);
}
add_action( 'enqueue_block_assets', 'text_prefix_suffix_enqueue_block_styles' );

/**
 * Add prefix and suffix data attributes to supported text blocks.
 *
 * @param string $block_content Rendered block HTML.
 * @param array  $block         Parsed block data.
 *
 * @return string Filtered block HTML.
 */
function text_prefix_suffix_render_block( $block_content, $block ) {
	$block_name = isset( $block['blockName'] ) ? $block['blockName'] : '';

	if ( ! in_array( $block_name, text_prefix_suffix_get_supported_blocks(), true ) ) {
		return $block_content;
	}

	$prefix = $block['attrs']['textPrefix'] ?? '';
	$suffix = $block['attrs']['textSuffix'] ?? '';

	$prefix = is_string( $prefix ) ? $prefix : '';
	$suffix = is_string( $suffix ) ? $suffix : '';

	if ( '' === $prefix && '' === $suffix ) {
		return $block_content;
	}

	$processor = new WP_HTML_Tag_Processor( $block_content );

	if ( ! $processor->next_tag() ) {
		return $block_content;
	}

	if ( '' !== $prefix ) {
		$processor->set_attribute( 'data-block-text-prefix', $prefix );
	}

	if ( '' !== $suffix ) {
		$processor->set_attribute( 'data-block-text-suffix', $suffix );
	}

	return $processor->get_updated_html();
}
add_filter( 'render_block', 'text_prefix_suffix_render_block', 10, 2 );
