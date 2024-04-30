/**
 * Represents a modal component for defining attributes associated with markers.
 * @module DefineAttributesModal
 * @author Oleksandr Turytsia
 */

import React, { useContext, useEffect, useState } from 'react';
import Modal from '../../../../../../../../components/Modal/Modal';
import { MapContext } from '../../../../../../Map';
import Input from './components/Input/Input';
import classes from "./DefineAttributesModel.module.css";
import { Icon } from '@iconify/react';
import icons from '../../../../../../../../utils/icons';
import classNames from 'classnames';
import { IAttribute } from '../../../../../../../../utils/types';
import Button from '../../../../../../../../components/Button/Button';
import ButtonIconOnly from '../../../../../../../../components/ButtonIconOnly/ButtonIconOnly';

const SUGGESTED_ATTRIBUTES = [
    "Sales floor area",
    "Parking",
    "Accessibility by car",
    "Brand recognition",
    "Number of departments",
    "Number of checkouts",
    "Accessibility by foot",
    "Visibility",
    "Volume of passing trade",
    "Potential market",
    "Growth in the area",
    "Seasonality",
    "Distance to competition",
    "Size of competition"
]

/**
 * Represents the properties for the DefineAttributesModal component.
 */
type PropsType = {
    /** Error message to display. */
    error: string,
    /** Attributes associated with markers. */
    markersAttributes: IAttribute[][],
    /** Index of the active marker. */
    activeMarkerIndex: number,
    /** Callback function to close the modal. */
    onClose: () => void,
    /** Callback function to create an attribute. */
    createAttribute: (attributeName?: string) => void,
    /** Callback function to change an attribute. */
    changeAttribute: (attributeIndex: number, key: string, value: string, maxValue: string, isQualitative?: boolean) => void,
    /** Callback function to move to the next active marker. */
    nextActiveMarkerIndex: () => void,
    /** Callback function to move to the previous active marker. */
    prevActiveMarkerIndex: () => void,
    /** Callback function to delete an attribute. */
    deleteAttribute: (attributeIndex: number) => void

    isBeginner: boolean

    enableBeginner: () => void

    disableBeginner: () => void

    resetAttributes: () => void

    resetAttributesRow: (key: string) => void
}

/** Keys that are disabled. */
const disabledKeys: string[] = [];

/**
 * DefineAttributesModal component.
 * @param props - The props for the DefineAttributesModal component.
 * @returns JSX for the DefineAttributesModal component.
 */
const DefineAttributesModal: React.FC<PropsType> = ({
    error,
    markersAttributes,
    changeAttribute,
    createAttribute,
    nextActiveMarkerIndex,
    prevActiveMarkerIndex,
    activeMarkerIndex,
    deleteAttribute,
    onClose,
    enableBeginner,
    disableBeginner,
    isBeginner,
    resetAttributes,
    resetAttributesRow
}) => {
    const { map } = useContext(MapContext);

    const enableBeginnerHandler = () => {
        enableBeginner()
        resetAttributes()
    }

    const disableBeginnerHandler = () => {
        disableBeginner()
        resetAttributes()
    }

    /** Number of attributes associated with the active marker. */
    const attributeLength = markersAttributes[activeMarkerIndex].length;

    return (
        <Modal 
            title={`Define attributes ${attributeLength}/6`} 
            textProceed={'Save'} 
            textCancel={'Cancel'} 
            onClose={onClose}
            onSubmit={onClose} 
            icon={icons.attributes}
            error={error}
            headerActions={
                <>
                    <Button active={isBeginner} onClick={enableBeginnerHandler}>
                        Beginner
                    </Button>
                    <Button active={!isBeginner} onClick={disableBeginnerHandler}>
                        Advanced
                    </Button>
                </>
            }
        >
            <div className={classes.container}>
                <p className={classes.hint}>
                    To optimize results, aim to define at least three attributes for each site. You can include both subjective values like visibility, as well as specific, objective data sourced from reputable online resources. The more objective information you provide, the more accurate and insightful your analysis will be.
                </p>
                <div className={classes.arrows}>
                    <ButtonIconOnly icon={icons.arrowLeft} className={classes.arrowBtn} onClick={prevActiveMarkerIndex} />
                    <span className={classes.addressName}>{map.getMarkers()[activeMarkerIndex].getName()}</span>
                    <ButtonIconOnly icon={icons.arrowRight} className={classes.arrowBtn} onClick={nextActiveMarkerIndex} />
                </div>
                <div className={classes.suggestedAttributesContainer}>
                    <span>Suggested attributes:</span>
                    {SUGGESTED_ATTRIBUTES.filter(attributeName => !markersAttributes[activeMarkerIndex].find(({ key }) => key === attributeName)).map(attributeName => (
                           <button key={attributeName} onClick={() => createAttribute(attributeName)}>{attributeName}</button>
                        ))}
                </div>
                <div className={classes.inputs}>
                    {markersAttributes[activeMarkerIndex].map((attribute, i) => (
                        <Input
                            key={i}
                            keyValue={attribute.key}
                            value={attribute.value}
                            maxValue={attribute.maxValue}
                            isQualitative={attribute.isQualitative}
                            onChange={(key, value, maxValue, isQualitative = false) => changeAttribute(i, key, value, maxValue, isQualitative)}
                            onDelete={() => deleteAttribute(i)}
                            isDeletable={disabledKeys.includes(attribute.key)}
                            disableKey={disabledKeys.includes(attribute.key)}
                            disableDelete={markersAttributes[activeMarkerIndex].length <= 3}
                            isBeginner={isBeginner}
                            resetInputs={resetAttributesRow}
                        />
                    ))}
                    {attributeLength < 6 && (
                        <div className={classes.actions}>
                            <button onClick={() => createAttribute()} className={classes.btnAdd}>
                                <Icon icon={icons.plus} />Create attribute
                            </button>
                        </div>
                    )}
                </div>
                <div className={classes.pagination}>
                    {markersAttributes.map((_, i) => <span key={i} className={classNames(classes.paginationCircle, { [classes.paginationCircleActive]: i === activeMarkerIndex })} />)}
                </div>
            </div>
        </Modal>
    );
}

export default DefineAttributesModal;