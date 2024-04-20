/**
 * Provides a container component for wrapping child elements.
 * @module Container
 * @author Oleksandr Turytsia
 */
import React from 'react';
import classes from "./Container.module.css";

/**
 * Represents the properties for the Container component.
 */
type PropsType = {
    /** Optional test id for testing purposes. */
    "data-testid"?: string
}

/**
 * Renders a container component to wrap child elements.
 * @param props - The props for the Container component.
 * @returns JSX for the Container component.
 */
const Container: React.FC<React.PropsWithChildren<PropsType>> = ({ 
    children, 
    "data-testid": testid 
}) => {
    // Render the container div with children and testid
    return (
        <div data-testid={testid} className={classes.container}>{children}</div>
    );
}

export default Container;