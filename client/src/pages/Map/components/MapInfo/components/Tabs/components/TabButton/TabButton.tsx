/**
 * Represents a button component for rendering a tab with an icon.
 * @module TabButton
 * @author Oleksandr Turytsia
 */

import React from 'react';
import { IconType } from '../../../../../../../../utils/icons';
import { Icon } from '@iconify/react';
import classes from "./TabButton.module.css";
import classNames from 'classnames';

type PropsType = {
    /** The icon to be displayed on the tab button. */
    icon: IconType,
    /** Specifies whether the tab button is active. */
    isActive?: boolean
}

/**
 * Functional component for rendering a tab button.
 * @param props - The props for the TabButton component.
 * @returns JSX for the TabButton component.
 */
const TabButton: React.FC<PropsType> = ({
    icon,
    isActive = false
}) => {
    // Determine button styles based on the isActive prop
    const buttonStyles = classNames(classes.container, {
        [classes.active]: isActive
    });

    return (
        <button className={buttonStyles}>
            {/* Render an Icon component with the specified icon */}
            <Icon icon={icon} />
        </button>
    );
}

export default TabButton;