/**
 * Represents a component for displaying consistency ratio.
 * @module ConsistencyRatio
 * @author Oleksandr Turytsia
 */

import React, { useContext } from 'react';
import { MapContext } from '../../../../../../Map';
import classes from './ConsistencyRatio.module.css';

/**
 * Renders a component for displaying consistency ratio.
 * @returns JSX for the ConsistencyRatio component.
 */
const ConsistencyRatio: React.FC = () => {
    const { consistency } = useContext(MapContext);

    return (
        <div className={classes.container}>
            <span className={classes.label}>Consistency:</span>
            <span className={classes.value}>{consistency}</span>
        </div>
    );
}

export default ConsistencyRatio;