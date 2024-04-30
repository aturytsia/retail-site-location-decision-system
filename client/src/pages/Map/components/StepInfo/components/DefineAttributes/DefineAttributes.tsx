/**
 * Represents a component for defining attributes.
 * @module DefineAttributes
 * @author Oleksandr Turytsia
 */

import React, { useContext, useEffect, useState } from 'react';
import Locations from '../Locations/Locations';
import { Icon } from '@iconify/react';
import icons from '../../../../../../utils/icons';

import classes from "./DefineAttributes.module.css";
import DefineAttributesModal from './modals/DefineAttributesModal/DefineAttributesModal';
import { MapContext } from '../../../../Map';
import ButtonIconOnly from '../../../../../../components/ButtonIconOnly/ButtonIconOnly';
import classNames from 'classnames';
import { IAttribute } from '../../../../../../utils/types';
import StepContent from '../StepContent/StepContent';
import Popover from '../../../../../../components/Popover/Popover';

/** Initial attribute state. */
const initialAttribute: IAttribute = { key: "", value: "", maxValue: "" };

/**
 * Represents the DefineAttributes component.
 * @returns JSX for the DefineAttributes component.
 */
const DefineAttributes: React.FC = () => {

    const { markers, getNextSystemStatus, getPrevSystemStatus } = useContext(MapContext);

    const attributes = markers.map(marker => marker.getAttrbutes());

    const [markersAttributes, setMarkersAttributes] = useState<IAttribute[][]>(attributes);

    const [activeMarkerIndex, setActiveMarkerIndex] = useState<number | null>(null);

    const [error, setError] = useState<string>("");

    const [isBeginner, setIsBeginner] = useState<boolean>(true)

    const enableBeginnerHandler = () => {
        setIsBeginner(true)
    }

    const disableBeginnerHandler = () => {
        setIsBeginner(false)
    }

    /** Checks if any attribute for a marker is empty. */
    const isMarkerAttributesEmpty = (markerIndex: number): boolean => {
        return !(
            markersAttributes[markerIndex].every(({ key, value, maxValue }) => key && value && maxValue ) &&
            markersAttributes[markerIndex].length
        );
    };

    /** Checks if any attribute is empty. */
    const isAnyAttributeEmpty = markersAttributes.some((_, i) => isMarkerAttributesEmpty(i));

    /** Moves to the next active marker index. */
    const nextActiveMarkerIndex = (): void => {
        if(activeMarkerIndex === null) return;

        setActiveMarkerIndex(prev => {
            if(prev === null) return null

            return (prev + 1) % markersAttributes.length
        });
    };

    /** Moves to the previous active marker index. */
    const prevActiveMarkerIndex = (): void => {
        if (activeMarkerIndex === null) return;

        setActiveMarkerIndex(prev => {
            if(prev === null) return null

            return (prev - 1 + markersAttributes.length) % markersAttributes.length
        });
    };

    /** Creates a new attribute. */
    const createAttribute = (attributeName?: string): void => {
        if (activeMarkerIndex === null) return;

        if (markersAttributes[activeMarkerIndex].length >= 6) return;

        setMarkersAttributes(prev => prev.map(markerAttributes => {
            return [...markerAttributes, {...initialAttribute, key: attributeName ?? ""}];
        }));
    };

    /** Deletes an attribute. */
    const deleteAttribute = (attributeIndex: number): void => {
        if (activeMarkerIndex === null) return;

        // if (markersAttributes[0].length <= 3) return;

        setMarkersAttributes(prev => prev.map(markerAttributes => markerAttributes.filter((_, i) => i !== attributeIndex)));
    };

    /** Handles attribute change. */
    const changeAttribute = (attributeIndex: number, key: string, value: string, maxValue: string, isQualitative: boolean = false): void => {
        if (activeMarkerIndex === null) return;

        setMarkersAttributes(prev => prev.map((markerAttributes, i) => {

            return markerAttributes.map((attribute, j) => {
                if (attributeIndex !== j) {
                    return attribute;
                }

                return { 
                    key, 
                    value: activeMarkerIndex === i ? value : markerAttributes[j].value ?? "",
                    maxValue,
                    isQualitative
                };
            });
        }));
    };

    const resetAttributes = () => {
        setMarkersAttributes(prev => prev.map((markerAttributes, i) => {

            return markerAttributes.map((attribute, j) => {

                return { 
                    ...attribute,
                    value: "",
                    maxValue: "",
                };
            });
        }));
    }

    const resetAttributesRow = (key: string) => {
        const rowIndex = markersAttributes[0].findIndex(({key: k}) => k === key)

        setMarkersAttributes(prev => prev.map(markerAttributes => {

            return markerAttributes.map((attributes, i) => {

                if (rowIndex === i){
                    return {
                        ...attributes,
                        value: "",
                        maxValue: ""
                    }
                }

                return attributes
            })
        }))
    }

    /** Handles the next step. */
    const getNextStepHandler = (): void => {
        markers.map((marker, i) => marker.setAttributes(markersAttributes[i]));
        getNextSystemStatus();
    };

    /** Handles the previous system status. */
    const getPrevSystemStatusHandler = (): void => {
        markers.map((marker, i) => marker.setAttributes(markersAttributes[i]));
        getPrevSystemStatus();
    };

    useEffect(
        () => {
            const maxValueLowerThanValue = markersAttributes.some(markerAttributes => markerAttributes.some(({ maxValue, value}) => (maxValue && value) ? +maxValue < +value : false));
            const theSameKeysEncountered = markersAttributes.some(markerAttributes => {
                const keys = markerAttributes.map(({ key }) => key);
                const keysSet = new Set(keys);
                const hasKeys = markerAttributes.every(({ key }) => key);

                return hasKeys && keys.length !== keysSet.size;
            });

            if(maxValueLowerThanValue){
                setError("Max. value should be greater than the value");
            } else if(theSameKeysEncountered){
                setError("The same keys for the attributes are encountered");
            } else {
                setError("");
            }
        },
        [markersAttributes]
    );

    return (
        <StepContent
            getNextSystemStatus={getNextStepHandler}
            getPrevSystemStatus={getPrevSystemStatusHandler}
            nextSystemStatusDisabled={isAnyAttributeEmpty || !!error || markersAttributes[0].length < 3} 
        >
            <Locations
                renderLocationActions={
                    i => (
                        <Popover
                            element={(
                                <span>
                                <ButtonIconOnly 
                                    icon={icons.open}
                                    onClick={() => setActiveMarkerIndex(i)}
                                />
                                <Icon 
                                    className={classNames(classes.statusIcon, isMarkerAttributesEmpty(i) || !!error ? classes.statusError : classes.statusOk)} 
                                    icon={isMarkerAttributesEmpty(i) || !!error ? icons.warning : icons.check} 
                                />
                            </span>
                            )}
                        >
                            Define location attributes for {markers[i].getName()}
                        </Popover>
                    )
                }
            />
            {activeMarkerIndex !== null && (
                <DefineAttributesModal
                    isBeginner={isBeginner}
                    enableBeginner={enableBeginnerHandler}
                    disableBeginner={disableBeginnerHandler}
                    error={error}
                    markersAttributes={markersAttributes}
                    activeMarkerIndex={activeMarkerIndex}
                    changeAttribute={changeAttribute}
                    createAttribute={createAttribute}
                    deleteAttribute={deleteAttribute}
                    nextActiveMarkerIndex={nextActiveMarkerIndex}
                    prevActiveMarkerIndex={prevActiveMarkerIndex}
                    onClose={() => setActiveMarkerIndex(null)}
                    resetAttributes={resetAttributes}
                    resetAttributesRow={resetAttributesRow}
                />
            )}
        </StepContent>
    );
};

export default DefineAttributes;