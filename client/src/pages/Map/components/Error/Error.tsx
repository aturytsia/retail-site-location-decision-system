/**
 * Represents the Error component displayed for 404 errors.
 * @module Error
 * @author Oleksandr Turytsia
 */

import React from 'react';
import Page404 from "../../../../assets/404.svg";

import classes from "./Error.module.css";

/**
 * Functional component representing the Error page.
 * @returns JSX for the Error page.
 */
const Error: React.FC = () => {
  return (
    <div className={classes.container} style={{ backgroundImage: `url(${Page404})` }} />
  );
}

export default Error;