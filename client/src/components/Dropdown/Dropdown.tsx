/**
 * Represents a dropdown component with customizable options.
 * @module Dropdown
 * @author Oleksandr Turytsia
 */
import DismissWindow from "../DismissWindow/DismissWindow";
import { placements } from '../../utils/utils';
import { Icon } from '@iconify/react';
import icons from '../../utils/icons';
import classes from "./Dropdown.module.css";
import classNames from 'classnames';
import React, { useMemo } from "react";

/** Type definition for an item in the dropdown. */
export type DropdownItemType = {
    /** Unique identifier for the dropdown item. */
    id: string,
    /** Value of the dropdown item. */
    value: string
}

export type SelectOptionFuncType = (value: string | null, name: string) => void

/** Props for the Dropdown component. */
type PropsType = {
    /** Current selected value. */
    value: string | null,
    /** Array of dropdown items. */
    items: DropdownItemType[],
    /** Name of the dropdown. */
    name?: string,
    /** Label text for the dropdown. */
    label?: string,
    /** Function called when the dropdown value changes. */
    onChange: (value: string | null, name: string) => void,
    /** Classname for additional styling. */
    className?: string
}

/**
 * Dropdown functional component.
 * @param props - The props for the Dropdown component.
 * @returns Dropdown component.
 */
const Dropdown: React.FC<PropsType> = ({
    label = "",
    value,
    items,
    name = "",
    onChange,
    className = ""
}) => {

    const currentValue = useMemo(
        () => items.find(({ id }) => id === value)?.value,
        [items, value]
    );

    const dropdownStyles = classNames(classes.dropdown, className);

    return (
        <DismissWindow
            align
            offset={0}
            placement={placements.BOTTOM}
            element={(isActive) =>
                <button className={classNames(dropdownStyles, {
                    [classes.active]: isActive
                })}>
                    {label && (
                        <span className={classes.label}>
                            {label}
                        </span>
                    )}
                    {currentValue ?? "--"}
                    <Icon icon={isActive ? icons.arrowUp : icons.arrowDown} height={19} width={20} />
                </button>}>
            {setIsActive => {

                const selectOption: SelectOptionFuncType = (value, name) => {
                    setIsActive(false);
                    onChange(value, name);
                }

                return (
                    <div className={classes.container}>
                        {items.map(({ id, value }) => (
                            <button key={id} className={classes.item} onClick={() => selectOption(id, name)}>
                                {value}
                            </button>
                        ))}
                    </div>
                );
            }}
        </DismissWindow>
    );
}

export default Dropdown;