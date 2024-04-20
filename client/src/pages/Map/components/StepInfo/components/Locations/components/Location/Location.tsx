/**
 * Represents a component for rendering a location.
 * @module Location
 * @author Oleksandr Turytsia
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Marker } from '../../../../../../../../utils/Map';
import classes from './Location.module.css';

/**
 * Represents the properties for the Location component.
 */
type PropsType = {
    /** Click event handler for the location. */
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    /** Index of the location. */
    index: number;
    /** Marker object representing the location. */
    location: Marker;
} & ({ location: Marker } | { locationName: string });

/**
 * Renders a component for rendering a location.
 * @param props - The props for the Location component.
 * @returns JSX for the Location component.
 */
const Location: React.FC<React.PropsWithChildren<PropsType>> = ({
    location,
    children,
    onClick,
    index
}) => {
    const [_, setName] = useState("");

    const fetchName = useCallback(
        async () => {
            await location.setName();
            setName(location.getName());
        },
        [location]
    );

    useEffect(
        () => {
            fetchName();
        },
        [fetchName]
    );

    return (
        <div className={classes.container} onClick={onClick}>
            <span className={classes.index}>{index + 1}.</span>
            <span className={classes.name}>{location.getName()}</span>
            <div className={classes.actions}>
                {children}
            </div>
        </div>
    );
}

export default Location;