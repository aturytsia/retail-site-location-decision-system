/**
 * Represents a loading spinner component.
 * @module Loading
 * @author Oleksandr Turytsia
 */

import React from 'react';
import classes from "./Loading.module.css";

/**
 * Functional component representing a loading spinner.
 * @returns JSX for the Loading component.
 */
const Loading: React.FC = () => {
  return (
    <div className={classes.container}>
        <div className={classes.loading}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </div>
  );
}

export default Loading;