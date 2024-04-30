/**
 * Contains utility functions and types related to geocoding and address manipulation.
 * @module utils
 * @author Oleksandr Turytsia
 */

import { PointType } from "./types";

/** Represents the structure of an address object obtained from reverse geocoding. */
export type AddressType = {
    "house_number": string | null;
    "road": string | null;
    "suburb": string | null;
    "city": string | null;
    "municipality": string | null;
    "ISO3166-2-lvl7": string | null;
    "county": string | null;
    "ISO3166-2-lvl6": string | null;
    "postcode": string | null;
    "country": string | null;
    "country_code": string | null;
}

/** 
 * Enumerates possible placements for floating elements.
 */
export enum placements {
    TOP = "top",
    RIGHT = "right",
    BOTTOM = "bottom",
    LEFT = "left",
}

/** Represents a function type to shorten an address. */
export type ShortenAddressFuncType = (address: AddressType) => string;

/** Represents a function type for reverse geocoding. */
export type ReverseGeocodeFuncType = (latlng: L.LatLng) => Promise<ReturnType<ShortenAddressFuncType>>;

/**
 * Shortens the address object by concatenating its properties.
 * @param {AddressType} address - The address object to be shortened.
 * @returns {string} The shortened address string.
 */
const shortenAddress: ShortenAddressFuncType = (address) => {
    let shortenedAddress = '';

    if(!address) return ""

    // Priority order: city > suburb > road > house_number > country
    if (address.city != null) {
        shortenedAddress += address.city + ', ';
    } else if (address.suburb != null) {
        shortenedAddress += address.suburb + ', ';
    }

    if (address.road != null) {
        shortenedAddress += address.road + ' ';
    }

    if (address.house_number != null) {
        shortenedAddress += address.house_number + ', ';
    }

    if (address.country != null) {
        shortenedAddress += address.country;
    }

    return shortenedAddress;
};

/**
 * Retrieves the address corresponding to the provided latitude and longitude coordinates.
 * @param {L.LatLng} latlng - The latitude and longitude coordinates.
 * @returns {Promise<string>} A promise that resolves to the shortened address string.
 */
export const reverseGeocode: ReverseGeocodeFuncType = async (latlng: L.LatLng) => {
    const { lat, lng } = latlng;
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`);
    const data = await response.json() as { address: AddressType };
    return shortenAddress(data.address);
};

/** 
 * Extracts fulfilled values from an array of promise settlement results.
 * @param {Array<PromiseSettledResult<T>>} promises - Array of promise settlement results.
 * @returns {T[]} Array of fulfilled values.
 */
export const extractValuesFromPromises = <T>(promises: Array<PromiseSettledResult<T>>): T[] => (
    promises
        .filter((r): r is PromiseFulfilledResult<T> => r.status === "fulfilled")
        .map(({ value }) => value)
        .filter((v) => v)
);

/** 
 * Fetches marker names by performing reverse geocoding on their coordinates.
 * @param {L.Marker[]} markers - Array of Leaflet markers.
 * @returns {Promise<string[]>} A promise that resolves to an array of marker names.
 */
export const fetchMarkerNames = async (markers: L.Marker[]): Promise<string[]> => {
    const addressPromises = await Promise.allSettled(markers.map(async marker => await reverseGeocode(marker.getLatLng())));
    return extractValuesFromPromises<string>(addressPromises);
};

/** 
 * Zips together arrays into an array of tuples.
 * @param {...Array} arrays - Arrays to be zipped together.
 * @returns {Array<T[]>} Array of tuples containing zipped values.
 */
export const zip = <T extends unknown[]>(...arrays: { [K in keyof T]: Array<T[K]> }): T[] => {
    const length = Math.min(...arrays.map(arr => arr.length));
    return Array.from({ length }, (_, i) => arrays.map(arr => arr[i])) as T[];
};

/** 
 * Calculates the average value of numbers in an array.
 * @param {number[]} array - Array of numbers.
 * @returns {number} The average value.
 */
export const avg = (array: number[]): number => {
    return array.reduce((a, n) => n + a, 0) / array.length;
};

/** 
 * Inverts the order of latitude and longitude coordinates in an array of points.
 * @param {PointType[]} points - Array of points.
 * @returns {PointType[]} Array of points with inverted coordinates.
 */
export const inversePoints = <T extends PointType>(points: T[]): T[] => {
    return points.map(([x, y]) => [y, x] as T);
};

/**
 * TODO remove it, it doesn't work
 * Reverses key & value in the given object
 * 
 * @param {T} obj - The object to be reversed.
 * @returns {T} The reversed object.
 */
export const reverseObject = <T extends object>(obj: T): T => {
    return Object.entries(obj).reduce((acc, [key, value]) => ({ ...acc, [value]: key }), {}) as T;
};