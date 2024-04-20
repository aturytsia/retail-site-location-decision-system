/**
 * Represents a container component that displays the steps of the process.
 * @module StepsContainer
 * @author Oleksandr Turytsia
 */

import React, { PropsWithChildren, useContext } from 'react';
import classes from "./StepsContainer.module.css";
import icons from '../../../../utils/icons';
import Step from './components/Step/Step';
import { MapContext } from '../../Map';
import Container from '../StepInfo/components/Container/Container';
import { StepInfoTest } from '../../../../utils/definitions';

/**
 * Array containing information about each step, including text and icon.
 */
const steps = [
    {
        text: <>Select<br/>Locations</>,
        icon: icons.location
    },
    {
        text: <>Define<br />Attributes</>,
        icon: icons.attributes
    },
    {
        text: <>Define<br />Priorities</>,
        icon: icons.compare
    },
    {
        text: <>Result</>,
        icon: icons.done
    }
];

/**
 * Functional component that displays the steps of the process.
 * @param {PropsWithChildren} props - The props for the StepsContainer component.
 * @returns JSX for the StepsContainer component.
 */
const StepsContainer: React.FC<PropsWithChildren> = ({
    children
}) => {
    // Access systemStatus from the MapContext
    const { systemStatus } = useContext(MapContext);

    return (
        <Container data-testid={StepInfoTest.stepContainer}>
            <div className={classes.steps}>
                {steps.map(({ text, icon }, i) => (
                    <Step
                        key={icon}
                        text={text}
                        icon={icon}
                        isCurrent={systemStatus === i}
                        isDone={systemStatus > i}
                    />
                ))}
            </div>
            {children}
        </Container>
    );
};

export default StepsContainer;