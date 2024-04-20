/**
 * Represents a section title component.
 * @module SectionTitle
 * @author Oleksandr Turytsia
 */

import React from 'react';
import classes from "./SectionTitle.module.css";

/**
 * Props for the SectionTitle component.
 */
type PropsType = {
    /** The text to be displayed as the title for the section. */
    text: string
}

/**
 * Functional component representing a section title.
 * @param props - The props for the SectionTitle component.
 * @returns JSX for the SectionTitle component.
 */
const SectionTitle: React.FC<PropsType> = ({
    text
}) => {
  return (
    <div className={classes.container}>
        <h3 className={classes.title}>{text}</h3>
        <div className={classes.line} />
    </div>
  );
}

export default SectionTitle;