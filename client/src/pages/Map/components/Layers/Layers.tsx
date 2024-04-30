/**
 * Represents the Layers component responsible for managing layers in the map.
 * @module Layers
 * @author Oleksandr Turytsia
 */

import React, { useContext } from 'react';
import Switch from './components/Switch/Switch';
import { MapContext } from '../../Map';
import InputContainer from './components/InputContainer/InputContainer';
import SectionTitle from './components/SectionTitle/SectionTitle';
import Emph from '../../../../components/Emph/Emph';
import classes from "./Layers.module.css"

/**
 * Functional component representing the Layers section.
 * @returns JSX for the Layers section.
 */
const Layers: React.FC = () => {
  const {
    map, 
    dataset,
    toggleCompetitorsLayer, 
    toggleCustomersLayer,
    toggleGridLayer,
    toggleHeatLayer,
  } = useContext(MapContext);

  return (
    <div>
      {/* Layers Section */}
      <SectionTitle text='Layers' />
      {dataset ? (
        <>
          <InputContainer labelText='Heat map'>
            <Switch
              value={map.hasHeatLayer()}
              onChange={toggleHeatLayer}
            />
          </InputContainer>
          <InputContainer labelText='Grid'>
            <Switch
              value={map.hasGridLayer()}
              onChange={toggleGridLayer}
            />
          </InputContainer>
          <InputContainer labelText='Customers'>
            <Switch
              value={map.hasCustomersLayer()}
              onChange={toggleCustomersLayer}
            />
          </InputContainer>
          <InputContainer labelText='Competitors'>
            <Switch
              value={map.hasCompetitorsLayer()}
              onChange={toggleCompetitorsLayer}
            />
          </InputContainer>
        </>
      ) : (
        <div className={classes.message}>Please, select <Emph>Business type</Emph> in order to see layers!</div>
      )}
      
    </div>
  );
}

export default Layers;