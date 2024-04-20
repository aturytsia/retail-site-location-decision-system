/**
 * Represents a container for input components with a label.
 * @module InputContainer
 * @author Oleksandr Turytsia
 */

import React, { PropsWithChildren } from 'react';
import classes from "./InputContainer.module.css";

/**
 * Props for the InputContainer component.
 */
type PropsType = PropsWithChildren<{
    /** The text to be displayed as the label for the input container. */
    labelText: string
}>

/**
 * Functional component representing a container for input components with a label.
 * @param props - The props for the InputContainer component.
 * @returns JSX for the InputContainer component.
 */
const InputContainer: React.FC<React.PropsWithChildren<PropsType>> = ({
    labelText,
    children
}) => {
  return (
    <div className={classes.container}>
        <span className={classes.label}>{labelText}</span>
        <div className={classes.input}>{children}</div>
    </div>
  );
}

export default InputContainer;