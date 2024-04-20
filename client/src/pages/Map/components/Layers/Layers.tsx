/**
 * Represents the Layers component responsible for managing layers in the map.
 * @module Layers
 * @author Oleksandr Turytsia
 */

import React, { useContext } from 'react';
import Dropdown from '../../../../components/Dropdown/Dropdown';

import classes from "./Layers.module.css";
import Switch from './components/Switch/Switch';
import { MapContext } from '../../Map';
import InputContainer from './components/InputContainer/InputContainer';
import SectionTitle from './components/SectionTitle/SectionTitle';

/**
 * Functional component representing the Layers section.
 * @returns JSX for the Layers section.
 */
const Layers: React.FC = () => {
  const {
    config,
    map, 
    dataset,
    toggleCompetitorsLayer, 
    toggleCustomersLayer,
    toggleGridLayer,
    toggleHeatLayer,
    changeDataset
  } = useContext(MapContext);

  /**
   * Handles the change event of the dataset dropdown.
   * @param value - The selected dataset value.
   */
  const changeDropdown = (value: string | null): void => {
    changeDataset(value as string);
  }

  return (
    <div>
      {/* Data Section */}
      <SectionTitle text='Data' />
      <InputContainer labelText='Dataset'>
        <Dropdown
            className={classes.dropdown}
            value={dataset as string}
            items={config.datasets.map(name => ({ id: name, value: name }))}
            onChange={changeDropdown}
          />
      </InputContainer>

      {/* Layers Section */}
      <SectionTitle text='Layers' />
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
    </div>
  );
}

export default Layers;