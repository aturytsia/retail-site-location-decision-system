/**
 * Represents a component for displaying consistency ratio.
 * @module ConsistencyRatio
 * @author Oleksandr Turytsia
 */

import React, { useContext } from 'react';
import { MapContext } from '../../../../../../Map';
import classes from './ConsistencyRatio.module.css';
import Popover from '../../../../../../../../components/Popover/Popover';
import classNames from 'classnames';

/**
 * Renders a component for displaying consistency ratio.
 * @returns JSX for the ConsistencyRatio component.
 */
const ConsistencyRatio: React.FC = () => {
    const { consistency } = useContext(MapContext);

    const valueStyles = classNames(classes.value, {
        [classes.danger]: consistency <= 0.1
    })

    return (

        <div className={classes.container}>
            <span className={classes.label}>Consistency:</span>
            <Popover
                element={
                    <span className={valueStyles}>{consistency}</span>
                }
            >
            If value is less than 0.1 then result below is inconsistent. You should modify your input and try again.
        </Popover>
        </div>
    );
}

export default ConsistencyRatio;