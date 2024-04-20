/**
 * Represents a component for rendering tabs.
 * @module Tabs
 * @author Oleksandr Turytsia
 */

import React from 'react';
import icons from '../../../../../../utils/icons';
import TabButton from './components/TabButton/TabButton';

/**
 * Functional component for rendering tabs.
 * @returns JSX for the Tabs component.
 */
const Tabs: React.FC = () => {
  return (
    <div>
        <TabButton icon={icons.layers} />
    </div>
  );
}

export default Tabs;