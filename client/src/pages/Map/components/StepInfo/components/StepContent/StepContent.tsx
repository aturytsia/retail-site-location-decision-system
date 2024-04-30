/**
 * Represents a component for step content.
 * @module StepContent
 * @author Oleksandr Turytsia
 */

import React, { useContext } from 'react';
import { MapContext, SystemStatus } from '../../../../Map';
import StepHeader from './components/StepHeader/StepHeader';
import StepFooter from './components/StepFooter/StepFooter';
import Emph from '../../../../../../components/Emph/Emph';
import Popover from '../../../../../../components/Popover/Popover';

/**
 * Represents the types for step content.
 */
type StepContentType = {
    title: any;
    subtitle?: any;
}

/**
 * Represents the properties for the StepContent component.
 */
type PropsType = {
    /** Indicates whether the next system status button should be disabled. */
    nextSystemStatusDisabled?: boolean;
    /** Function to handle getting the next system status. */
    getNextSystemStatus?: () => void;
    /** Function to handle getting the previous system status. */
    getPrevSystemStatus?: () => void;
}

/**
 * Renders a component for step content.
 * @param props - The props for the StepContent component.
 * @returns JSX for the StepContent component.
 */
const StepContent: React.FC<React.PropsWithChildren<PropsType>> = ({
    children,
    nextSystemStatusDisabled,
    getNextSystemStatus,
    getPrevSystemStatus
}) => {

    const {
        markers,
        systemStatus,
        getNextSystemStatus: defaultGetNextSystemStatus,
        getPrevSystemStatus: defaultGetPrevSystemStatus
    } = useContext(MapContext);

    const stepContentConfig: Record<SystemStatus, StepContentType> = {
        [SystemStatus.setlectPossibleLocations]: {
            title: <>Select possible locations {markers.length}/5</>,
            subtitle: (
                <div>
                    <p>
                    Please choose a minimum of two potential sites by clicking on desired locations using <Popover element={<span><Emph>heatmap</Emph></span>}>
                    The heatmap highlights areas in red if there competition for the customers is very high. You should consider colder areas.</Popover>
                    </p>
                </div>
            )
        },
        [SystemStatus.defineLocationAttributes]: {
            title: "Define attributes",
            subtitle: "For each location define a minimum of 3 attributes."
        },
        [SystemStatus.compareLocationAttributes]: {
            title: "Define priorities",
            subtitle: "Establish the relative significance of each attribute in comparison to the rest."
        },
        [SystemStatus.resultLocations]: {
            title: "Results"
        }
    }

    const stepContent = stepContentConfig[systemStatus];

    return (
        <>
            <StepHeader title={stepContent.title} subtitle={stepContent.subtitle} />
            {children}
            <StepFooter
                nextSystemStatusDisabled={nextSystemStatusDisabled}
                getNextSystemStatus={getNextSystemStatus ?? defaultGetNextSystemStatus}
                getPrevSystemStatus={getPrevSystemStatus ?? defaultGetPrevSystemStatus}
            />
        </>
    );
}

export default StepContent;