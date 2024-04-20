/**
 * Represents an input component for defining attributes.
 * @module Input
 * @author Oleksandr Turytsia
 */

import React from 'react';
import classes from "./Input.module.css";
import icons from '../../../../../../../../../../utils/icons';
import ButtonIconOnly from '../../../../../../../../../../components/ButtonIconOnly/ButtonIconOnly';
import Dropdown, { DropdownItemType, SelectOptionFuncType } from '../../../../../../../../../../components/Dropdown/Dropdown';
import { reverseObject } from '../../../../../../../../../../utils/utils';

/**
 * Represents the properties for the Input component.
 */
type PropsType = {
    /** The key value of the attribute. */
    keyValue: string,
    /** The value of the attribute. */
    value: string,
    /** The maximum value of the attribute. */
    maxValue: string,
    /** Callback function to handle changes in the attribute. */
    onChange: (key: string, value: string, maxValue: string, isQualitative?: boolean) => void,
    /** Callback function to delete the attribute. */
    onDelete: () => void,
    /** Boolean indicating whether the attribute is deletable. */
    isDeletable?: boolean,
    /** Boolean indicating whether to disable delete action. */
    disableDelete?: boolean,
    /** Boolean indicating whether to disable key input. */
    disableKey?: boolean,
    /** Boolean indicating whether to disable value input. */
    disableValue?: boolean,
    /** Boolean indicating whether the attribute is qualitative. */
    isQualitative?: boolean
}

/** Represents the options for attribute values. */
type OptionsType = {
    [key: string]: string
}

/** Options for attribute values. */
const optionsValue: OptionsType = {
    "Very low": "1",
    "Low": "2",
    "Medium": "3",
    "High": "4",
    "Very High": "5"
}

/** Converts options to dropdown items. */
const convertOptionsToItems = (options: OptionsType): DropdownItemType[] => {
    return Object.keys(options).map(key => ({ id: key, value: key }));
}

/**
 * Input component for defining attributes.
 * @param props - The props for the Input component.
 * @returns JSX for the Input component.
 */
const Input: React.FC<PropsType> = ({
    keyValue,
    value,
    maxValue,
    onChange,
    onDelete,
    isDeletable,
    disableDelete,
    disableKey,
    disableValue,
    isQualitative = false
}) => {

    /** Handles key change event. */
    const changeKey: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        onChange(e.target.value, value, maxValue, isQualitative);
    }

    /** Handles value change event. */
    const changeValue: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        onChange(keyValue, e.target.value, maxValue, isQualitative);
    }

    /** Handles max value change event. */
    const changeMaxValue: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        onChange(keyValue, value, e.target.value, isQualitative);
    }

    /** Handles dropdown value change event. */
    const changeDropdownValue: SelectOptionFuncType = (value) => {
        onChange(keyValue, value ? optionsValue[value] : "", "5", isQualitative);
    }

    /** Handles qualitative attribute change. */
    const changeIsQualitative = (): void => {
        onChange(keyValue, "", "", !isQualitative);
    }

    return (
        <div className={classes.container}>
            <input 
                className={classes.key} 
                value={keyValue} 
                onChange={changeKey} 
                disabled={disableKey} 
                placeholder='Name'
            />
            {!isQualitative ? (
                <>
                    <input 
                        className={classes.value} 
                        value={value} 
                        onChange={changeValue} 
                        disabled={disableValue} 
                        placeholder='Value' 
                        type='number' 
                    />
                    <input 
                        className={classes.maxValue} 
                        value={maxValue} 
                        onChange={changeMaxValue} 
                        // disabled={disableValue} 
                        placeholder='Max. value' 
                        type='number' 
                    />
                </>
            ): (
                <Dropdown 
                    value={reverseObject(optionsValue)[value] ?? ""} 
                    items={convertOptionsToItems(optionsValue)}
                    className={classes.dropdown}
                    onChange={changeDropdownValue}                
                />
            )}
            {!isDeletable && (
                <div className={classes.actions}>
                    <ButtonIconOnly 
                        icon={isQualitative ? icons.abcOff : icons.numbersOff}
                        onClick={changeIsQualitative} 
                    />
                    <ButtonIconOnly 
                        disabled={disableDelete}
                        icon={icons.delete}
                        onClick={onDelete} 
                    />
                </div>
            )}
        </div>
    );
}

export default Input;