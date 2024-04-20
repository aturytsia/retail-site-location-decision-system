/**
 * Represents a component for displaying results.
 * @module Results
 * @author Oleksandr Turytsia
 */

import React, { useContext } from 'react';
import Locations from '../Locations/Locations';
import { MapContext } from '../../../../Map';
import StepContent from '../StepContent/StepContent';
import ConsistencyRatio from './components/ConsistencyRatio/ConsistencyRatio';

/**
 * Renders a component for displaying results.
 * @returns JSX for the Results component.
 */
const Results: React.FC = () => {
    const {resetSystem } = useContext(MapContext);

    return (
        <StepContent 
            getNextSystemStatus={resetSystem}>
            <ConsistencyRatio />
            <Locations
                renderLocationActions={
                    (_, marker) => marker.getScore()
                }
            />
        </StepContent>
    );
}

export default Results;