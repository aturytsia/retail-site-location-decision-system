/**
 * Represents a component for rendering locations on a map.
 * @module Locations
 * @author Oleksandr Turytsia
 */

import React, { useContext } from 'react';
import classes from './Locations.module.css';
import { MapContext } from '../../../../Map';
import Location from './components/Location/Location';
import { Marker } from '../../../../../../utils/Map';
import { StepInfoTest } from '../../../../../../utils/definitions';

/**
 * Represents the properties for the Locations component.
 */
type PropsType = {
    /** A function to render location actions based on index and marker. */
    renderLocationActions?: (index: number, marker: Marker) => React.ReactNode;
    /** React node to render if locations are empty. */
    renderIfLocationsEmpty?: React.ReactNode;
}

/**
 * Renders a component for rendering locations on a map.
 * @param props - The props for the Locations component.
 * @returns JSX for the Locations component.
 */
const Locations: React.FC<PropsType> = ({
    renderLocationActions,
    renderIfLocationsEmpty
}) => {
    const { markers } = useContext(MapContext);

    return (
        <div data-testid={StepInfoTest.locationsContainer} className={classes.container}>
            {markers.sort((a, b) => b.getScore() - a.getScore()).map((marker, i) => (
                <Location key={i} index={i} location={marker}>{renderLocationActions?.(i, marker)}</Location>
            ))}
            {markers.length === 0 && renderIfLocationsEmpty}
        </div>
    );
}

export default Locations;