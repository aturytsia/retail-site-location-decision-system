/**
 * Represents a navigation panel component.
 * @module NavPanel
 * @author Oleksandr Turytsia
 */

import React from 'react';
import classes from "./NavPanel.module.css";
import icons from '../../utils/icons';
import NavButton from './components/NavButton/NavButton';

/**
 * NavPanel functional component.
 * @returns The navigation panel component.
 */
const NavPanel: React.FC = () => {
    return (
        <nav className={classes.container}>
            {/* Button for navigating to the location page */}
            <NavButton icon={icons.location} to="" />

            {/* Button for navigating to the layers page */}
            <NavButton icon={icons.layers} to="layers" />
        </nav>
    );
}

export default NavPanel;