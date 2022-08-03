/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import './style.scss';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import edit from "./edit";
import save from "./save";

/**
 * Register Block
 */
registerBlockType( metadata, {
	edit,
    //save
} );