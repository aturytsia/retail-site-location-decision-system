/**
 * Represents a button component.
 * @module Button
 * @author Oleksandr Turytsia
 */

import React from 'react';
import classNames from 'classnames';
import classes from './Button.module.css';

/**
 * Represents the properties for the Button component.
 */
type PropsType = {
    /** Test id for testing purposes. */
    "data-testid"?: string;
    /** Additional CSS class for styling. */
    className?: string;
    /** Indicates whether the button is disabled. */
    disabled?: boolean;
    /** Click event handler for the button. */
    onClick?: () => void;
    /** Style of the button. */
    style?: "primary" | "default";
    /** Button is active */
    active?: boolean
}

/**
 * Renders a button component.
 * @param props - The props for the Button component.
 * @returns JSX for the Button component.
 */
const Button: React.FC<React.PropsWithChildren<PropsType>> = ({
    "data-testid": testid,
    className,
    disabled,
    active,
    onClick,
    children,
    style = "default"
}) => {

    const buttonStyles = classNames(className, classes.btn, {
        [classes.primary]: style === "primary",
        [classes.default]: style === "default",
        [classes.active]: active
    });

    return (
        <button
            data-testid={testid}
            className={buttonStyles}
            disabled={disabled}
            onClick={onClick}>
            {children}
        </button>
    );
}

export default Button;