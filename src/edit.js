/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { InspectorControls, ColorPaletteControl, useBlockProps } from '@wordpress/block-editor';
import { __experimentalUnitControl as UnitControl, PanelBody, TextControl, RangeControl, SelectControl } from '@wordpress/components';

export default function edit( { attributes, setAttributes } ) {
    const { columns, count, gridGap, hoverColor, instagramToken, opacity, linkType } = attributes

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
    }

    const helpText = (
        <a href="https://developers.facebook.com/docs/instagram-basic-display-api/guides/getting-access-tokens-and-permissions/" target="_blank">{ __( 'How to get Access Token', 'photofeed-block-gutena' ) }</a>
    )

	return (
        <>
            <InspectorControls key="settings">
                <PanelBody title={ __( 'Settings', 'photofeed-block-gutena' ) }>
                    <TextControl
                        label={ __( 'Instagram Access Token', 'photofeed-block-gutena' ) }
                        value={ instagramToken }
                        onChange={ ( value ) => setAttributes( { instagramToken: value } ) }
                        help={ helpText }
                    />
                    <RangeControl
                        label={ __( 'Columns', 'photofeed-block-gutena' ) }
                        value={ columns }
                        onChange={ ( value ) => setAttributes( { columns: value } ) }
                        min={ 1 }
                        max={ 6 }
                    />
                    <RangeControl
                        label={ __( 'Number of Posts', 'photofeed-block-gutena' ) }
                        value={ count }
                        onChange={ ( value ) => setAttributes( { count: value } ) }
                        min={ 1 }
                        max={ 50 }
                    />
                    <UnitControl
                        label={ __( 'Block Spacing', 'photofeed-block-gutena' ) }
                        units={ units }
                        value={ gridGap }
                        onChange={ ( value ) => setAttributes( { gridGap: value } ) }
                        labelPosition="side"
                        style={ { 'margin-bottom': '24px' } }
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
                </PanelBody>
                <PanelBody title={ __( 'Styles', 'photofeed-block-gutena' ) }>
                     <ColorPaletteControl
                        label={ __( 'Overlay Hover Color', 'photofeed-block-gutena' ) }
                        value={ hoverColor }
                        onChange={ ( value ) => setAttributes( { hoverColor: value } ) }
                    />
                    <RangeControl
                        label={ __( 'Overlay Hover Opacity', 'photofeed-block-gutena' ) }
                        value={ opacity }
                        onChange={ ( value ) => setAttributes( { opacity: value } ) }
                        min={ 0.1 }
                        max={ 1 }
                        step={ 0.1 }
                    />
                </PanelBody>
            </InspectorControls>

            <div { ...blockProps }>
                { notice ??
                    <ul className={ wrapperClassName } style={ styles }>
                        { imagesList?.map( ( image ) => {
                            return (
                                <li key={ image?.id } className="photofeed-block-item">
                                    <img
                                        src={ image?.media_url }
                                        alt={ image?.caption }
                                        data-id={ image?.id }
                                        data-full-url={ image?.media_url }
                                        data-link={ image?.permalink }
                                        className={ `instagram-image wp-image-${ image?.id }` }
                                    />
                                    <div class="overlay" title={ image?.caption }><div class="text"></div></div>
                                </li>
                            );
                        } ) }
                    </ul>
                }
            </div>
        </>
	);
}
