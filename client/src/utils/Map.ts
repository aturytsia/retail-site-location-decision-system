/**
 * Provides custom classes for enhanced functionality in Leaflet maps.
 * @module Map
 * @author Oleksandr Turytsia
 */
import L, { Layer, LayerGroup } from "leaflet";
import { DataPointType, IAttribute, IAttributeBase, PolygonType } from "./types";
import { avg, reverseGeocode } from "./utils";
import locationIcon from "../assets/location.svg"

import 'leaflet.heat/dist/leaflet-heat.js';

const initialAttribute: IAttribute = { key: "", value: "", maxValue: "" }

const urlTemplate = "https://tile.openstreetmap.org/{z}/{x}/{y}.png"

const zoomOptions: L.Control.ZoomOptions = {
    position: 'bottomright',  // Set position of zoom buttons
}

const heatLayerOptions: L.HeatMapOptions = {
    max: 1,
    minOpacity: 0,
    maxZoom: 20,
    blur: 20,
    gradient: {
        0.2: 'blue',
        0.4: 'cyan',
        0.6: 'lime',
        0.8: 'yellow',
        1.0: 'red'
    }
}

const polylineOptions: L.PolylineOptions = {
    color: "gray",
    weight: 0.1,
    opacity: 1
}

/**
 * Represents a custom map class that extends Leaflet's Map class and provides additional functionality.
 * @extends L.Map
 * @class
 */
export class Map extends L.Map {
    /** Array of base attributes */
    private baseAttributes: IAttributeBase[] = [];
    /** Layer for displaying heat map */
    private heatLayer: Layer = L.layerGroup();
    /** Layer group for displaying grid */
    private readonly gridLayer: LayerGroup = L.layerGroup();
    /** Layer for displaying customers */
    private customersLayer: Layer = L.layerGroup();
    /** Layer for displaying competitors */
    private competitorsLayer: Layer = L.layerGroup();

    /**
     * Constructs a new Map object.
     * @constructor
     * @param id - ID of the HTML element to initialize the map.
     * @param - Options for configuring the map.
     */
    constructor(id: string, options?: L.MapOptions) {
        super(id, {...options, maxZoom: 15});

        // Set up extra configurations on map creation
        this.configure();
    }

    /**
     * Configures the map by adding tile layer and zoom controls.
     * @private
     */
    private configure(): void {
        // Add tile layer to the map
        this.addLayer(L.tileLayer(urlTemplate));

        // Add zoom buttons to the bottom right corner
        L.control.zoom(zoomOptions).addTo(this);
        const layer: L.HeatLayer = L.heatLayer([], { ...heatLayerOptions });
        // For some reason if user switches off all the layers, map becomes disbaled. This line fixes it
        this.toggleLayer(layer, true)
        
    }

    /**
     * Sets base attributes for the map.
     * @param {IAttributeBase[]} baseAttributes - Array of base attributes to be set.
     */
    public setBaseAttributes(baseAttributes: IAttributeBase[]): void {
        this.baseAttributes = baseAttributes;
    }

    /**
     * Retrieves base attributes of the map.
     * @returns {IAttributeBase[]} Array of base attributes associated with the map.
     */
    public getBaseAttributes(): IAttributeBase[] {
        return this.baseAttributes;
    }

    /**
     * Toggles the visibility of a layer based on its active status.
     * @param {Layer} layer - The layer to toggle.
     * @param {boolean} active - The active status of the layer.
     * @private
     */
    private toggleLayer(layer: Layer, active: boolean): void {
        if (this.hasLayer(layer)) {
            if (!active) layer.remove();
        } else {
            if (active) layer.addTo(this);
        }
    }

    /**
    * Toggles the visibility of the heat layer on the map.
    * @param {boolean} active - Determines whether to activate or deactivate the heat layer.
    */
    public toggleHeatLayer(active: boolean): void {
        this.toggleLayer(this.heatLayer, active);
    }

    /**
    * Toggles the visibility of the grid layer on the map.
    * @param {boolean} active - Determines whether to activate or deactivate the grid layer.
    */
    public toggleGridLayer(active: boolean): void {
        this.toggleLayer(this.gridLayer, active);
    }

    /**
    * Toggles the visibility of the customers layer on the map.
    * @param {boolean} active - Determines whether to activate or deactivate the customers layer.
    */
    public toggleCustomersLayer(active: boolean): void {
        this.toggleLayer(this.customersLayer, active);
    }

    /**
    * Toggles the visibility of the competitors layer on the map.
    * @param {boolean} active - Determines whether to activate or deactivate the competitors layer.
    */
    public toggleCompetitorsLayer(active: boolean): void {
        this.toggleLayer(this.competitorsLayer, active);
    }

    private readonly createLayerWithPoints = (dataPoints: DataPointType[], color: string): L.Layer => (
        new (
            L.Layer.extend({
                onAdd(map: L.Map) {
                    // Create a canvas element and add it to the map's overlay pane
                    this._canvas = L.DomUtil.create('canvas', 'leaflet-layer');
                    this._canvas.width = map.getSize().x;
                    this._canvas.height = map.getSize().y;
                    map.getPanes().overlayPane.appendChild(this._canvas);

                    // Store the map instance
                    this._map = map;

                    // Call the render function whenever the map is moved or zoomed
                    map.on('moveend', this._render, this);
                    // Initially render markers
                    this._render();
                },
                onRemove(map: L.Map) {
                    // Remove canvas element and event listeners when the layer is removed from the map
                    map.getPanes().overlayPane.removeChild(this._canvas);
                    map.off('moveend', this._render, this);
                },

                _updateCanvasPosition() {
                    const topLeft = this._map.containerPointToLayerPoint([0, 0]);
                    L.DomUtil.setPosition(this._canvas, topLeft);
                },

                _render(_e: unknown) {
                    const ctx = this._canvas.getContext('2d');
                    // console.log(1)
                    // Clear canvas
                    ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
                    this._updateCanvasPosition()

                    // Loop through your marker data and draw each marker on the canvas
                    dataPoints.forEach(([lat, lng, _]) => {
                        const point = this._map.latLngToContainerPoint([lat, lng]);
                        // Example: Draw a circle at the marker position
                        ctx.beginPath();
                        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
                        ctx.fillStyle = color;
                        ctx.fill();
                    });
                }
            })
        )() as L.Layer
    )
    
    /**
    * Sets the heat layer on the map with the provided data points.
    * @param {DataPointType[]} dataPoints - Array of data points for the heat layer.
    */
    public setHeatLayer(dataPoints: DataPointType[]): void {
        const prevActive = this.hasHeatLayer();
        this.toggleHeatLayer(false);

        const average = avg(dataPoints.map(([, , value]) => value));
        this.heatLayer = L.heatLayer(dataPoints, { ...heatLayerOptions, max: average });

        this.toggleHeatLayer(prevActive);
    }

    /**
    * Sets the grid layer on the map with the provided polygons.
    * @param {PolygonType[]} polygons - Array of polygons for the grid layer.
    */
    public setGridLayer(polygons: PolygonType[]): void {
        // Remove previous rectangles
        this.gridLayer.getLayers().forEach(layer => {
            layer.remove();
        });

        const layers = polygons.map(polygon => L.rectangle(polygon, polylineOptions));

        // Add new rectangles
        layers.forEach(layer => {
            layer.addTo(this.gridLayer);
        });
    }

    /**
    * Sets the competitors layer on the map with the provided data points.
    * @param {DataPointType[]} dataPoints - Array of data points for the competitors layer.
    */
    public setCompetitorsLayer(dataPoints: DataPointType[]): void {
        const prevActive = this.hasCompetitorsLayer();
        this.toggleCompetitorsLayer(false);

        this.competitorsLayer = this.createLayerWithPoints(dataPoints, "black");
        this.toggleCompetitorsLayer(prevActive);
    }

    /**
    * Sets the customers layer on the map with the provided data points.
    * @param {DataPointType[]} dataPoints - Array of data points for the customers layer.
    */
    public setCustomersLayer(dataPoints: DataPointType[]): void {
        const prevActive = this.hasCustomersLayer();
        this.toggleCustomersLayer(false);

        this.customersLayer = this.createLayerWithPoints(dataPoints, "#6C63FF");
        this.toggleCustomersLayer(prevActive);
    }

    /**
    * Checks if the heat layer is currently displayed on the map.
    * @returns {boolean} True if the heat layer is displayed, otherwise false.
    */
    public hasHeatLayer(): boolean {
        return this.hasLayer(this.heatLayer);
    }

    /**
    * Checks if the grid layer is currently displayed on the map.
    * @returns {boolean} True if the grid layer is displayed, otherwise false.
    */
    public hasGridLayer(): boolean {
        return this.hasLayer(this.gridLayer);
    }

    /**
    * Checks if the customers layer is currently displayed on the map.
    * @returns {boolean} True if the customers layer is displayed, otherwise false.
    */
    public hasCustomersLayer(): boolean {
        return this.hasLayer(this.customersLayer);
    }

    /**
    * Checks if the competitors layer is currently displayed on the map.
    * @returns {boolean} True if the competitors layer is displayed, otherwise false.
    */
    public hasCompetitorsLayer(): boolean {
        return this.hasLayer(this.competitorsLayer);
    }

    /**
    * Retrieves all the markers currently present on the map.
    * @returns {Marker[]} Array of Marker objects representing markers on the map.
    */
    public getMarkers(): Marker[] {
        const markers: Marker[] = [];

        this.eachLayer(function (layer) {
            if (layer instanceof Marker) {
                markers.push(layer);
            }
        });

        return markers;
    }

    /**
    * Removes all markers from the map.
    */
    public reset(): void {
        this.getMarkers().forEach(marker => {
            marker.removeFrom(this);
        });
    }

    /**
    * Sets the scores for all markers on the map based on the provided score mapping.
    * @param {Record<string, number>} score - Mapping of marker names to their respective scores.
    */
    public setMarkersScore(score: Record<string, number>): void {
        this.getMarkers().forEach(marker => {
            marker.setScore(score[marker.getName()]);
        });
    }
}

/**
 * Represents a custom marker class that extends Leaflet's Marker class and provides additional functionality.
 * @extends L.Marker
 * @class
 */
export class Marker extends L.Marker {
    /** Name of the marker */
    private name: string;
    /** Attributes associated with the marker */
    private attributes: IAttribute[];
    /** Score associated with the marker */
    private score: number;
    /** Reference to the map the marker belongs to */
    private readonly map?: Map;

    /**
     * Constructs a new Marker object.
     * @constructor
     * @param latlng - Latitude and longitude coordinates of the marker.
     * @param map - Map instance the marker belongs to.
     * @param options - Options for configuring the marker.
     */
    constructor(latlng: L.LatLngExpression, map?: Map, options?: L.MarkerOptions) {
        super(latlng, options);

        // Set marker icon
        this.setIcon(L.icon({
            iconUrl: locationIcon as string,
            iconSize: [40, 40], // Size of the icon
            iconAnchor: [19, 38], // Point of the icon which corresponds to marker's location
            popupAnchor: [0, -38] // Point from which the popup should open relative to the iconAnchor
        }));

        // Initialize properties
        this.name = "";
        this.score = 0;
        this.attributes = this.getPrefilledAttributes();

        // Set name and add marker to map if provided
        void this.setName();
        if (map) {
            this.map = map;
            this.addTo(map);
        }
    }

    /**
     * Retrieves prefilled attributes for the marker.
     * @private
     * @returns {IAttribute[]} Array of prefilled attributes.
     */
    private getPrefilledAttributes(): IAttribute[] {
        if (!this.map) return [];

        const markers = this.map.getMarkers();

        if (markers.length === 0) return [];

        return markers[0].getAttrbutes().map(attribute => ({ ...attribute, value: "" }));
    }

    /**
     * Sets attributes for the marker.
     * @param {IAttribute[]} attributes - Array of attributes to be set.
     */
    public setAttributes(attributes: IAttribute[]): void {
        this.attributes = attributes;
    }

    /**
     * Retrieves attributes of the marker.
     * @returns {IAttribute[]} Array of attributes associated with the marker.
     */
    public getAttrbutes(): IAttribute[] {
        return this.attributes;
    }

    /**
     * Sets score for the marker.
     * @param {number} score - Score to be set.
     */
    public setScore(score: number): void {
        this.score = score;
    }

    /**
     * Retrieves score of the marker.
     * @returns {number} Score associated with the marker.
     */
    public getScore(): number {
        return this.score;
    }

    /**
     * Retrieves the name of the marker.
     * @returns {string} Name of the marker.
     */
    public getName(): string {
        return this.name;
    }

    /**
     * Updates and retrieves the name of the marker asynchronously.
     * @returns {Promise<string>} A promise that resolves to the name of the marker.
     */
    public async updateAndGetName(): Promise<string> {
        this.name = await reverseGeocode(this.getLatLng());
        return this.name;
    }

    /**
     * Sets the name of the marker asynchronously.
     */
    public async setName(): Promise<void> {
        this.name = await reverseGeocode(this.getLatLng());
    }
}