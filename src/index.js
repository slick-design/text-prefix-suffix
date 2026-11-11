import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

const SUPPORTED_BLOCKS = [ 'core/paragraph', 'core/heading' ];

const textPrefixSuffixAttributes = {
	textPrefix: {
		type: 'string',
		default: '',
	},
	textSuffix: {
		type: 'string',
		default: '',
	},
};

const isSupportedBlock = ( blockName ) =>
	SUPPORTED_BLOCKS.includes( blockName );

function addTextPrefixSuffixAttributes( settings, blockName ) {
	if ( ! isSupportedBlock( blockName ) ) {
		return settings;
	}

	return {
		...settings,
		attributes: {
			...settings.attributes,
			...textPrefixSuffixAttributes,
		},
	};
}

function preserveTextPrefixSuffixAttributes( transformedBlock, blocks, index ) {
	const sourceBlocks = Array.isArray( blocks ) ? blocks : [ blocks ];
	const sourceBlock = sourceBlocks[ index ];

	if (
		! sourceBlock ||
		! isSupportedBlock( sourceBlock.name ) ||
		! isSupportedBlock( transformedBlock.name )
	) {
		return transformedBlock;
	}

	const { textPrefix = '', textSuffix = '' } = sourceBlock.attributes;

	return {
		...transformedBlock,
		attributes: {
			...transformedBlock.attributes,
			textPrefix,
			textSuffix,
		},
	};
}

const withTextPrefixSuffixControls = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const { attributes, name, setAttributes } = props;

		if ( ! isSupportedBlock( name ) ) {
			return <BlockEdit { ...props } />;
		}

		const { textPrefix = '', textSuffix = '' } = attributes;
		const hasPrefixOrSuffix = '' !== textPrefix || '' !== textSuffix;

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls group="styles">
					<PanelBody
						title={ __( 'Prefix & Suffix', 'text-prefix-suffix' ) }
						initialOpen={ hasPrefixOrSuffix }
					>
						<TextControl
							label={ __( 'Prefix', 'text-prefix-suffix' ) }
							value={ textPrefix }
							onChange={ ( value ) =>
								setAttributes( { textPrefix: value } )
							}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
						<TextControl
							label={ __( 'Suffix', 'text-prefix-suffix' ) }
							value={ textSuffix }
							onChange={ ( value ) =>
								setAttributes( { textSuffix: value } )
							}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
					</PanelBody>
				</InspectorControls>
			</>
		);
	},
	'withTextPrefixSuffixControls'
);

const withTextPrefixSuffixDataAttributes = createHigherOrderComponent(
	( BlockListBlock ) => ( props ) => {
		const { attributes = {}, name, wrapperProps = {} } = props;

		if ( ! isSupportedBlock( name ) ) {
			return <BlockListBlock { ...props } />;
		}

		const { textPrefix = '', textSuffix = '' } = attributes;
		const textAttributes = {};

		if ( textPrefix ) {
			textAttributes[ 'data-block-text-prefix' ] = textPrefix;
		}

		if ( textSuffix ) {
			textAttributes[ 'data-block-text-suffix' ] = textSuffix;
		}

		return (
			<BlockListBlock
				{ ...props }
				wrapperProps={ {
					...wrapperProps,
					...textAttributes,
				} }
			/>
		);
	},
	'withTextPrefixSuffixDataAttributes'
);

addFilter(
	'blocks.registerBlockType',
	'text-prefix-suffix/add-attributes',
	addTextPrefixSuffixAttributes
);

addFilter(
	'blocks.switchToBlockType.transformedBlock',
	'text-prefix-suffix/preserve-attributes',
	preserveTextPrefixSuffixAttributes
);

addFilter(
	'editor.BlockEdit',
	'text-prefix-suffix/add-controls',
	withTextPrefixSuffixControls
);

addFilter(
	'editor.BlockListBlock',
	'text-prefix-suffix/add-data-attributes',
	withTextPrefixSuffixDataAttributes
);
