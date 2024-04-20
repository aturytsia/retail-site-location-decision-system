/**
 * Represents a component for a step in a process.
 * @module Step
 * @author Oleksandr Turytsia
 */

import React from 'react';
import classes from './Step.module.css';
import { IconType } from '../../../../../../utils/icons';
import { Icon } from '@iconify/react';
import classNames from 'classnames';

/**
 * Represents the properties for the Step component.
 */
type PropsType = {
    /** The icon for the step. */
    icon: IconType;
    /** The text or content for the step. */
    text: string | React.ReactNode;
    /** Indicates whether the step is currently active. */
    isCurrent: boolean;
    /** Indicates whether the step is completed. */
    isDone: boolean;
}

/**
 * Renders a component for a step in a process.
 * @param props - The props for the Step component.
 * @returns JSX for the Step component.
 */
const Step: React.FC<PropsType> = ({
    icon,
    text,
    isCurrent,
    isDone
}) => {

    const stepStyles = classNames(classes.step, {
        [classes.current]: isCurrent,
        [classes.done]: isDone
    });

    return (
        <div data-testid={icon} className={stepStyles}>
            <span className={classes.circle}>
                <Icon className={classes.circleIcon} icon={icon} />
            </span>
            <p className={classes.stepText}>{text}</p>
        </div>
    );
}

export default Step;