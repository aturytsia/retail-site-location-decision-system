/**
 * Represents a component for selecting locations.
 * @module SelectLocations
 * @author Oleksandr Turytsia
 */

import React, { useContext } from 'react';
import { MapContext } from '../../../../Map';
import Locations from '../Locations/Locations';
import icons from '../../../../../../utils/icons';
import SelectLocationSVG from "../../../../../../assets/select-location.svg";
import ButtonIconOnly from '../../../../../../components/ButtonIconOnly/ButtonIconOnly';
import ImageContent from '../ImageContent/ImageContent';
import StepContent from '../StepContent/StepContent';

/**
 * Renders a component for selecting locations.
 * @returns JSX for the SelectLocations component.
 */
const SelectLocations: React.FC = () => {
    const { markers, deleteMarker, getNextSystemStatus } = useContext(MapContext);

    const getNextSystemStatusHandler = (): void => {
        getNextSystemStatus();
    }

    return (
        <StepContent
            nextSystemStatusDisabled={markers.length < 2}
            getNextSystemStatus={getNextSystemStatusHandler}
        >
            <Locations
                renderLocationActions={i => <ButtonIconOnly onClick={() => deleteMarker(i)} icon={icons.delete} />}
                renderIfLocationsEmpty={<ImageContent url={SelectLocationSVG} />}
            />
        </StepContent>
    );
}

export default SelectLocations;