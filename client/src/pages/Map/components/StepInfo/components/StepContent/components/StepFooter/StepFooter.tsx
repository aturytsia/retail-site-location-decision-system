/**
 * Represents a component for step footer.
 * @module StepFooter
 * @author Oleksandr Turytsia
 */

import React, { useContext } from 'react';
import classes from './StepFooter.module.css';
import { MapContext, SystemStatus } from '../../../../../../Map';
import { Icon } from '@iconify/react';
import icons from '../../../../../../../../utils/icons';
import { StepInfoTest } from '../../../../../../../../utils/definitions';
import Button from '../../../../../../../../components/Button/Button';

/**
 * Represents the properties for the StepFooter component.
 */
type PropsType = {
    /** Indicates whether the next system status button should be disabled. */
    nextSystemStatusDisabled?: boolean;
    /** Function to handle getting the next system status. */
    getNextSystemStatus: () => void;
    /** Function to handle getting the previous system status. */
    getPrevSystemStatus: () => void;
}

/**
 * Renders a component for step footer.
 * @param props - The props for the StepFooter component.
 * @returns JSX for the StepFooter component.
 */
const StepFooter: React.FC<PropsType> = ({
    nextSystemStatusDisabled,
    getNextSystemStatus,
    getPrevSystemStatus
}) => {
    const { systemStatus } = useContext(MapContext);

    return (
        <div className={classes.container}>
            {systemStatus !== SystemStatus.setlectPossibleLocations && (
                <button
                    className={classes.btnBack}
                    onClick={getPrevSystemStatus}
                >
                    <Icon icon={icons.back} />
                </button>
            )}
            <Button
                style="primary"
                data-testid={StepInfoTest.buttonSaveChanges}
                className={classes.btn}
                disabled={nextSystemStatusDisabled}
                onClick={getNextSystemStatus}>
                {systemStatus === SystemStatus.resultLocations ? <><Icon icon={icons.restart} /> Restart</> : <>Save changes</>}
            </Button>
        </div>
    );
}

export default StepFooter;