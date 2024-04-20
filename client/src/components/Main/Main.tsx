/**
 * Represents the main container component of the application.
 * @module Main
 * @author Oleksandr Turytsia
 */

import React from 'react';

import classes from "./Main.module.css";

/**
 * Prevents clicking through the UI over the map.
 * @param e - The mouse event.
 */
const stopPropagationHandler: React.MouseEventHandler<HTMLElement> = (e) => {
    e.stopPropagation();
};

/**
 * Prevents the default drag behavior.
 * @param e - The mouse event.
 */
const preventDefaultHandler: React.MouseEventHandler<HTMLElement> = (e) => {
    e.preventDefault();
};

/**
 * Main functional component.
 * @param props - The props for the Main component.
 * @returns The main container component.
 */
const Main: React.FC<React.PropsWithChildren> = ({
    children
}) => {
    return (
        <main 
            className={classes.container}
            onClick={stopPropagationHandler}
            onDragStart={preventDefaultHandler}
            onDragEnd={preventDefaultHandler}>
            {children}
        </main>
    );
}

export default Main;