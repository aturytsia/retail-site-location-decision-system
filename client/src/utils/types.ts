/**
 * Contains type definitions and interfaces used across the project.
 * @module Types
 * @author Oleksandr Turytsia
 */

import { Marker } from "./Map";

/** Represents a point with latitude and longitude coordinates. */
export type PointType = [lat: number, lng: number];

/** Represents a data point with coordinates and additional data. */
export type DataPointType = [...rest: PointType, data: number];

/** Represents a polygon defined by an array of points. */
export type PolygonType = PointType[];

/** Represents a type that can be nullable. */
export type Nullable<T> = T | null;

/** Represents the base structure of an attribute. */
export interface IAttributeBase {
    key: string; // Attribute key
    maxValue: string; // Maximum value for the attribute
    isQualitative?: boolean; // Optional boolean flag indicating if the attribute is qualitative
}

/** Represents an attribute with a specific value. */
export interface IAttribute extends IAttributeBase {
    value: string; // Attribute value
}

/** Represents a mapping of attribute keys to their corresponding scores. */
export type AttributeMapType = {
    [key: string]: number;
};

/** Represents a mapping of location names to their attribute scores. */
export type ScoreMapType = {
    [key: string]: {
        [key: string]: number;
    };
};

/** Represents a location with a name, marker, and attributes. */
export type LocationType = {
    name: string; // Location name
    marker: Marker; // Marker associated with the location
    attributes: AttributeMapType; // Attributes associated with the location
};