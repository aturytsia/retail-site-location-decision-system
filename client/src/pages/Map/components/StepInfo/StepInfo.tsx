/**
 * Represents a component that renders different step views based on the system status.
 * @module StepInfo
 * @author Oleksandr Turytsia
 */

import React, { useContext } from 'react';
import { MapContext, SystemStatus } from '../../Map';
import SelectLocations from './components/SelectLocations/SelectLocations';
import DefineAttributes from './components/DefineAttributes/DefineAttributes';
import DefinePriorities from './components/DefinePriorities/DefinePriorities';
import Results from './components/Results/Results';

/**
 * Object mapping system status to corresponding step views.
 */
const stepViews = {
    [SystemStatus.setlectPossibleLocations]: SelectLocations,
    [SystemStatus.defineLocationAttributes]: DefineAttributes,
    [SystemStatus.compareLocationAttributes]: DefinePriorities,
    [SystemStatus.resultLocations]: Results
};

/**
 * Functional component that renders different step views based on the system status.
 * @returns JSX for the StepInfo component.
 */
const StepInfo: React.FC = () => {
    // Access systemStatus from the MapContext
    const { systemStatus } = useContext(MapContext);

    // Get the corresponding component based on the system status
    const Component = stepViews[systemStatus];

    // Render the selected component
    return <Component />;
};

export default StepInfo;