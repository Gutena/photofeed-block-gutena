/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { 
    InspectorControls, 
    ColorPaletteControl, 
    useBlockProps 
} from '@wordpress/block-editor';
import { 
    __experimentalUnitControl as UnitControl, 
    PanelBody, 
    TextControl, 
    RangeControl, 
    SelectControl,
    ToggleControl 
} from '@wordpress/components';

export default function edit( { attributes, setAttributes } ) {
    const { columns, count, gridGap, hoverColor, hoverEffect, instagramToken, opacity, linkType, linkTarget, showCaption, captionColor } = attributes

    const [ images, setImages ] = useState( [] )
    const [ imagesList, setImagesList ] = useState( [] )
    const [ notice, setNotice ] = useState( null )

    const blockProps = useBlockProps()

    useEffect( () => {
        const data = new FormData()
        data.append( 'action', 'gutena_get_instagram_images' )
        data.append( 'nonce', gutenaInstagramGalleryBlock.nonce )
        data.append( 'access_token', instagramToken )

        fetch( gutenaInstagramGalleryBlock.ajax_url, {
            method: "POST",
            credentials: 'same-origin',
            body: data
        } )
        .then( ( response ) => response.json() )
        .then( ( data ) => {
            if ( data?.status == 'success' ) {
                setImages( data.images )
                setNotice( null )
            } else if ( data?.status == 'error' ) {
                setImages( [] )
                setNotice( data.message )
            } else {
                setImages( [] )
                setNotice( null )
            }
        } )
        .catch( ( error ) => {
            setNotice( error )
        } );
    }, [ instagramToken ] )

    useEffect( () => {
        setImagesList( images.slice( 0, count ) )
    }, [ images, count ] )

    const wrapperClassName = classnames( {
        [ `photofeed-blocks-grid columns-${ columns }` ]: columns,
    } )

    const units = [
        { value: 'px', label: 'px', default: 0 },
        { value: '%', label: '%', default: 10 },
        { value: 'em', label: 'em', default: 0 },
        { value: 'rem', label: 'rem', default: 0 },
    ]

    const styles = {
        '--gutena--photofeed-block-gap': gridGap,
        '--gutena--photofeed-image-hover-color': hoverColor,
        '--gutena--photofeed-image-hover-opacity': opacity,
        '--gutena--photofeed-caption-hover-color': captionColor,
    }

    const helpText = (
        <a href="https://developers.facebook.com/docs/instagram-basic-display-api/guides/getting-access-tokens-and-permissions/" target="_blank">{ __( 'How to get Access Token', 'photofeed-block-gutena' ) }</a>
    )

	return (
        <>
            <InspectorControls key="settings">
                <PanelBody title={ __( 'Instagram Settings', 'photofeed-block-gutena' ) }>
                    <TextControl
                        label={ __( 'Instagram Access Token', 'photofeed-block-gutena' ) }
                        value={ instagramToken }
                        onChange={ ( value ) => setAttributes( { instagramToken: value } ) }
                        help={ helpText }
                    />
                </PanelBody>
                <PanelBody title={ __( 'Feed Settings', 'photofeed-block-gutena' ) } initialOpen={ false }>
                    <RangeControl
                        label={ __( 'Number of Posts', 'photofeed-block-gutena' ) }
                        value={ count }
                        onChange={ ( value ) => setAttributes( { count: value } ) }
                        min={ 1 }
                        max={ 100 }
                    />
                    <SelectControl
                        label={ __( 'Link to', 'photofeed-block-gutena' ) }
                        value={ linkType }
                        options={ [
                            { label: __( 'Instagram Feed', 'photofeed-block-gutena' ), value: 'instagram' },
                            { label: __( 'Media URL', 'photofeed-block-gutena' ), value: 'media' },
                            { label: __( 'None', 'photofeed-block-gutena' ), value: 'none' },
                        ] }
                        onChange={ ( value ) => setAttributes( { linkType: value } ) }
                    />
                    { linkType !== 'none' && 
                        <SelectControl
                            label={ __( 'Link Target', 'photofeed-block-gutena' ) }
                            value={ linkTarget }
                            options={ [
                                { label: __( 'New Window', 'photofeed-block-gutena' ), value: '_blank' },
                                { label: __( 'Current Window', 'photofeed-block-gutena' ), value: '_self' },
                            ] }
                            onChange={ ( value ) => setAttributes( { linkTarget: value } ) }
                        />
                    }
                    <ToggleControl
                        label={ __( 'Show Caption on Hover', 'photofeed-block-gutena' ) }
                        checked={ showCaption }
                        onChange={ () => setAttributes( { showCaption: ! showCaption } ) }
                    />
                </PanelBody>
                <PanelBody title={ __( 'Layout Settings', 'photofeed-block-gutena' ) } initialOpen={ false }>
                    <RangeControl
                        label={ __( 'Columns', 'photofeed-block-gutena' ) }
                        value={ columns }
                        onChange={ ( value ) => setAttributes( { columns: value } ) }
                        min={ 1 }
                        max={ 6 }
                    />
                    <UnitControl
                        label={ __( 'Block Grid Spacing', 'photofeed-block-gutena' ) }
                        units={ units }
                        value={ gridGap }
                        onChange={ ( value ) => setAttributes( { gridGap: value } ) }
                        labelPosition="side"
                    />
                </PanelBody>
                <PanelBody title={ __( 'Styles', 'photofeed-block-gutena' ) } initialOpen={ false }>
                    <SelectControl
                        label={ __( 'Overlay Hover Effect', 'photofeed-block-gutena' ) }
                        value={ hoverEffect }
                        options={ [
                            { label: __( 'Zoom In', 'photofeed-block-gutena' ), value: 'zoom-in' },
                            { label: __( 'Zoom Out', 'photofeed-block-gutena' ), value: 'zoom-out' },
                            { label: __( 'Rotate In', 'photofeed-block-gutena' ), value: 'rotate-in' },
                            { label: __( 'Rotate Out', 'photofeed-block-gutena' ), value: 'rotate-out' },
                            { label: __( 'None', 'photofeed-block-gutena' ), value: 'none' },
                        ] }
                        onChange={ ( value ) => setAttributes( { hoverEffect: value } ) }
                    />
                    <ColorPaletteControl
                        label={ __( 'Overlay Hover Color', 'photofeed-block-gutena' ) }
                        value={ hoverColor }
                        onChange={ ( value ) => setAttributes( { hoverColor: value } ) }
                        enableAlpha={ true }
                    />
                    <RangeControl
                        label={ __( 'Overlay Hover Opacity', 'photofeed-block-gutena' ) }
                        value={ opacity }
                        onChange={ ( value ) => setAttributes( { opacity: value } ) }
                        min={ 0.1 }
                        max={ 1 }
                        step={ 0.1 }
                    />
                    { showCaption && 
                        <ColorPaletteControl
                            label={ __( 'Caption Text Color', 'photofeed-block-gutena' ) }
                            value={ captionColor }
                            onChange={ ( value ) => setAttributes( { captionColor: value } ) }
                        />
                    }
                </PanelBody>
            </InspectorControls>

            <div { ...blockProps }>
                { notice ??
                    <div className={ wrapperClassName } style={ styles }>
                        { imagesList?.map( image => (
                            <div key={ image?.id } className="photofeed-block-item">
                                <figure class={ `photofeed-block-item-inner ${ hoverEffect }` }>
                                    <img
                                        src={ image?.media_url }
                                        alt={ image?.caption }
                                        data-id={ image?.id }
                                        data-full-url={ image?.media_url }
                                        data-link={ image?.permalink }
                                        className={ `instagram-image wp-image-${ image?.id }` }
                                    />
                                    <figcaption class="overlay" title={ image?.caption }>
                                        { showCaption && <div class="text">{ image?.caption }</div> }
                                    </figcaption>
                                </figure>
                            </div>
                        ) ) }
                    </div>
                }
            </div>
        </>
	);
}
