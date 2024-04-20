/**
 * Represents a component for defining priorities.
 * @module DefinePriorities
 */

import React, { useContext, useState } from 'react';
import { MapContext } from '../../../../Map';

import classes from "./DefinePriorities.module.css";
import DefinePrioritiesModal from './modals/DefinePrioritiesModal/DefinePrioritiesModal';
import { IAttribute, ScoreMapType } from '../../../../../../utils/types';

import definePrioritySvg from "../../../../../../assets/prioritise.svg";
import ImageContent from '../ImageContent/ImageContent';
import StepContent from '../StepContent/StepContent';

/** Retrieves the initial priorities based on marker attributes. */
const getPriorities = (markersAttributes: IAttribute[][]): ScoreMapType => {

    return markersAttributes[0]
        .slice(0, -1)
        .reduce((acc, { key }, i) => ({ ...acc, [key]: markersAttributes[0].slice(i+1).reduce((acc, { key }) => ({ ...acc, [key]: 5 }),{}) }),{});
};

/** Updates the score map with new priorities. */
const updateScoreMap = (current: ScoreMapType, updated: ScoreMapType): ScoreMapType => {
    const currentKeys = Array.from(new Set([...Object.keys(current), ...Object.keys(current).flatMap(k => Object.keys(current[k]))]));
    const updatedKeys = Array.from(new Set([...Object.keys(updated), ...Object.keys(updated).flatMap(k => Object.keys(updated[k]))]));

    const oldKeys = updatedKeys.filter(currentKey => currentKeys.slice(0, -1).includes(currentKey));
    const newKeys = updatedKeys.filter(currentKey => !currentKeys.slice(0, -1).includes(currentKey));

    const isUpdate = currentKeys.length !== updatedKeys.length || newKeys.length;

    if(!isUpdate) return current;

    return updatedKeys
        .slice(0, -1)
        .reduce((a, key) => {
            if (newKeys.includes(key)) return { ...a, [key]: updated[key] };
            if (oldKeys.includes(key)) return { ...a, [key]: { ...(updated[key] ?? {}), ...current[key] } };
            return { ...a };
        }, {});
};

/**
 * Represents the DefinePriorities component.
 * @returns JSX for the DefinePriorities component.
 */
const DefinePriorities: React.FC = () => {

    const { map, score } = useContext(MapContext);

    const attributes = map.getMarkers().map(marker => marker.getAttrbutes());

    const [priorities, setPriorities] = useState<ScoreMapType>(updateScoreMap(score, getPriorities(attributes)));

    const [isModalActive, setIsModalActive] = useState<boolean>(false);

    const { getNextSystemStatus, saveScoreAttributesResult } = useContext(MapContext);

    /** Handles attribute change. */
    const onAttributeChange = (currentAttribute: string, otherAttribute: string) => {
        return (value: number) => {
            setPriorities(prev => {
                const priorities = { ...prev };
                const current = { ...priorities[currentAttribute] };
                current[otherAttribute] = value;
                priorities[currentAttribute] = current;
                return priorities;
            });
        };
    };

    /** Handles the next step. */
    const getNextStepHandler = (): void => {
        saveScoreAttributesResult(priorities);
        getNextSystemStatus();
    };

    return (
        <StepContent getNextSystemStatus={getNextStepHandler}>
            <div className={classes.container}>
                <ImageContent url={definePrioritySvg} />
                <button className={classes.priorityButton} onClick={() => setIsModalActive(true)}>
                    Compare attributes
                </button>
            </div>
            {isModalActive && (
                <DefinePrioritiesModal
                    priorities={priorities}
                    onClose={() => setIsModalActive(false)}
                    onAttributeChange={onAttributeChange}
                />
            )}
        </StepContent>
    );
}

export default DefinePriorities;