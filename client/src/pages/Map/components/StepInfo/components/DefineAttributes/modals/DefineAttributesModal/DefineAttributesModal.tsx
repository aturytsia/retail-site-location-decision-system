/**
 * Represents a modal component for defining attributes associated with markers.
 * @module DefineAttributesModal
 * @author Oleksandr Turytsia
 */

import React, { useContext } from 'react';
import Modal from '../../../../../../../../components/Modal/Modal';
import { MapContext } from '../../../../../../Map';
import Input from './components/Input/Input';
import classes from "./DefineAttributesModel.module.css";
import { Icon } from '@iconify/react';
import icons from '../../../../../../../../utils/icons';
import classNames from 'classnames';
import { IAttribute } from '../../../../../../../../utils/types';

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
    createAttribute: () => void,
    /** Callback function to change an attribute. */
    changeAttribute: (attributeIndex: number, key: string, value: string, maxValue: string, isQualitative?: boolean) => void,
    /** Callback function to move to the next active marker. */
    nextActiveMarkerIndex: () => void,
    /** Callback function to move to the previous active marker. */
    prevActiveMarkerIndex: () => void,
    /** Callback function to delete an attribute. */
    deleteAttribute: (attributeIndex: number) => void
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
    onClose
}) => {
    const { map } = useContext(MapContext);

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
        >
            <div className={classes.container}>
                <div className={classes.arrows}>
                    <button className={classes.arrowBtn} onClick={prevActiveMarkerIndex}>
                        <Icon icon={icons.arrowLeft} />
                    </button>
                    <span className={classes.addressName}>{map.getMarkers()[activeMarkerIndex].getName()}</span>
                    <button className={classes.arrowBtn} onClick={nextActiveMarkerIndex}>
                        <Icon icon={icons.arrowRight} />
                    </button>
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
                            disableDelete={markersAttributes[activeMarkerIndex].length <= 2}
                        />
                    ))}
                    {attributeLength < 6 && (
                        <div className={classes.actions}>
                            <button onClick={createAttribute} className={classes.btnAdd}>
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