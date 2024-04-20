/**
 * Represents a component for step header.
 * @module StepHeader
 * @author Oleksandr Turytsia
 */

import React from 'react';
import classes from './StepHeader.module.css';

/**
 * Represents the properties for the StepHeader component.
 */
type PropsType = {
    /** The title for the step. */
    title: string;
    /** The subtitle for the step. */
    subtitle?: string | React.ReactNode;
}

/**
 * Renders a component for step header.
 * @param props - The props for the StepHeader component.
 * @returns JSX for the StepHeader component.
 */
const StepHeader: React.FC<PropsType> = ({
    title,
    subtitle
}) => {
    return (
        <div className={classes.container}>
            <h3 className={classes.title}>{title}</h3>
            {subtitle && <p className={classes.subtitle}>{subtitle}</p>}
        </div>
    );
}

export default StepHeader;