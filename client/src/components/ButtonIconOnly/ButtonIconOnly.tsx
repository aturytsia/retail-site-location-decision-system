/**
 * Represents a button component displaying an icon.
 * @module ButtonIconOnly
 * @author Oleksandr Turytsia
 */
import React, { MouseEventHandler } from 'react';
import classes from "./ButtonIconOnly.module.css";
import { IconType } from '../../utils/icons';
import { Icon } from '@iconify/react';

/**
 * Props for the ButtonIconOnly component.
 */
type PropsType = {
    /** The icon to be displayed on the button. */
    icon: IconType,
    /** The function to be called when the button is clicked. */
    onClick?: MouseEventHandler<HTMLButtonElement>,
    /** Specifies whether the button is disabled. */
    disabled?: boolean
}

/**
 * ButtonIconOnly functional component.
 * @param props - The props for the ButtonIconOnly component.
 * @returns Returns JSX for the ButtonIconOnly component.
 */
const ButtonIconOnly: React.FC<PropsType> = ({
    icon,
    onClick,
    disabled
}) => {

  return (
    <button className={classes.container} onClick={onClick} disabled={disabled}>
      <Icon 
        className={classes.icon}
        icon={icon} 
    />
    </button>
  );
};

export default ButtonIconOnly;