/**
 * Represents a component for displaying information on the map.
 * @module MapInfo
 * @author Oleksandr Turytsia
 */

import React from 'react';
import classes from "./MapInfo.module.css";

/**
 * Functional component representing information displayed on the map.
 * @param props - The props for the MapInfo component.
 * @returns JSX for the MapInfo component.
 */
const MapInfo: React.FC<React.PropsWithChildren> = ({
    children
}) => {
    return (
        <div className={classes.container}>
            {children}
        </div>
    );
}

export default MapInfo;