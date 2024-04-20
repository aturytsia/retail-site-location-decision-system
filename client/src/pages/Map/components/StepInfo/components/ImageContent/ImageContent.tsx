/**
 * Represents an image content component for displaying images.
 * @module ImageContent
 * @author Oleksandr Turytsia
 */

import React from 'react';
import classes from './ImageContent.module.css';

/**
 * Represents the properties for the ImageContent component.
 */
type PropsType = {
    /** The URL of the image to be displayed. */
    url: string;
}

/**
 * Renders an image content component to display images.
 * @param props - The props for the ImageContent component.
 * @returns JSX for the ImageContent component.
 */
const ImageContent: React.FC<PropsType> = ({ url }) => {
    return (
        <div className={classes.contentImage} style={{ backgroundImage: `url(${url})` }} />
    );
}

export default ImageContent;