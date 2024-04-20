/**
 * Represents a switch component.
 * @module Switch
 * @author Oleksandr Turytsia
 */

import React, { useCallback } from 'react';
import { Switch as MUISwitch } from '@mui/material';

/**
 * Props for the Switch component.
 */
type PropsType = {
    /** Additional CSS class name for styling. */
    className?: string
    /** The current state of the switch. */
    value?: boolean
    /** Function called when the state of the switch changes. */
    onChange?: (checked: boolean) => void
}

/**
 * Functional component representing a switch.
 * @param props - The props for the Switch component.
 * @returns JSX for the Switch component.
 */
const Switch: React.FC<PropsType> = ({
    className,
    value,
    onChange,
}) => {

    /**
     * Handles the change event of the switch.
     * @param _ - The event object (not used).
     * @param checked - The new state of the switch.
     */
    const onChangeHandler = useCallback(
        (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
            if(!onChange) return
    
            onChange(checked)
        },
        [onChange]
    )

  return (
    <div className={className}>
        <MUISwitch 
            sx={{
                '& .MuiSwitch-thumb': {
                  backgroundColor: 'var(--white)'
                },
                '& .Mui-checked .MuiSwitch-thumb': {
                    backgroundColor: 'var(--violet)', // Change this to your desired color
                },
                '& .MuiSwitch-track': {
                    backgroundColor: 'var(--subtitle)'
                },
                '& .Mui-checked+.MuiSwitch-track': {
                    backgroundColor: 'var(--violet) !important'
                }
              }}
            checked={value}
            value={value}
            onChange={onChangeHandler}
        />
    </div>
  );
}

export default Switch;