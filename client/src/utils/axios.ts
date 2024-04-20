/**
 * Provides functions for interacting with the backend server and fetching AHP results.
 * @module axios
 * @author Oleksandr Turytsia
 */

import axios from "axios";
import { LocationType, PointType, PolygonType, ScoreMapType } from "./types";

/**
 * Represents the result of the Analytic Hierarchy Process (AHP) calculation.
 */
export type AHPResultType = {
    results: Record<string, number>; // Mapping of location names to scores
    consistencyRatio: number; // Consistency ratio of the AHP calculation
};

/**
 * Represents a layer containing points of high demand areas.
 */
export type AreaOfHighDemandLayerType = [...PointType, number][]; // Array of points with associated scores

/**
 * Represents a mapping of different layers.
 */
export type LayersMapType = {
    areaOfHighDemand: AreaOfHighDemandLayerType; // Layer containing points of high demand areas
};

/**
 * Represents the configuration settings for the system.
 */
export type ConfigType = {
    center: PointType | null; // Center point of the map
    grid: PolygonType[]; // Grid representing the map area
    datasets: string[]; // List of dataset names
};

// Axios instance for making HTTP requests to the server
const instance = axios.create({
    baseURL: "http://127.0.0.1:8000", // Base URL of the backend server
});

/**
 * Fetches AHP results from the backend server.
 * @param {LocationType[]} locations - List of locations with their attributes
 * @param {ScoreMapType} score - Map containing scores for attributes
 * @returns {Promise<AHPResultType>} A promise that resolves to the AHP results
 */
export const fetchAHPResults = async (
    locations: LocationType[],
    score: ScoreMapType
): Promise<AHPResultType> => {
    // Send POST request to endpoint "/result" with location data and attribute scores
    const resultResponse = await instance.post<AHPResultType>("/result", {
        locations: locations.map(({ name, attributes }) => ({ name, attributes })), // Extract relevant data for AHP calculation
        score,
    });

    return resultResponse.data; // Return the fetched AHP results
};

export default instance; // Export the Axios instance for reuse