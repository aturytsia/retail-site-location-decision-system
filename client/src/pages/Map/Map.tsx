/**
 * Represents the main component for the map functionality.
 * @module Map
 * @author Oleksandr Turytsia
 */
import React, { useCallback, useEffect, useState } from 'react'

import classes from "./Map.module.css"
import { ConfigType, fetchAHPResults } from '../../utils/axios'
import MapInfo from './components/MapInfo/MapInfo'
import L from 'leaflet'
import { zip } from '../../utils/utils'
import { AttributeMapType, IAttribute, LocationType, ScoreMapType } from '../../utils/types'

import { Map as BaseMap, Marker } from '../../utils/Map'
import useMap, { buildMap, initialConfig } from '../../hooks/useMap/useMap'
import { Outlet } from 'react-router-dom'
import Loading from './components/Loading/Loading'
import Error from './components/Error/Error'

export type PossibleLocationAddType = (latlng: L.LatLng, map: L.Map) => void
export type PossibleLocationDeleteType = (index: number) => void

export enum SystemStatus {
    setlectPossibleLocations = 0,
    defineLocationAttributes,
    compareLocationAttributes,
    resultLocations
}

export type SaveSelectLocationsResultFuncType = (unsavedMarkers: Marker[]) => void
export type SaveDefineAttributesResultFuncType = (unsavedAttributes: IAttribute[][]) => void
export type SaveScoreAttributesResultFuncType = (unsavedScore: ScoreMapType) => Promise<void>
export type GetNextSystemStatusFuncType = () => void
export type GetPrevSystemStatusFuncType = () => void
export type ResetSystemFuncType = () => void

export type DeleteMarkerFuncType = (index: number) => void

export type MapContextType = {
    consistency: number,
    config: ConfigType,
    markers: Marker[],
    systemStatus: SystemStatus,
    map: BaseMap,
    dataset: string | null
    score: ScoreMapType,
    results: Record<string, number>
    resetSystem: () => void
    deleteMarker: DeleteMarkerFuncType,
    saveScoreAttributesResult: SaveScoreAttributesResultFuncType
    getNextSystemStatus: GetNextSystemStatusFuncType
    getPrevSystemStatus: GetPrevSystemStatusFuncType
    toggleCustomersLayer: () => void
    toggleCompetitorsLayer: () => void
    toggleGridLayer: () => void, 
    toggleHeatLayer: () => void,
    changeDataset: (dataset: string) => Promise<void>
}

export const initialMapContext = {
    consistency: 0,
    config: initialConfig,
    markers: [],
    systemStatus: SystemStatus.setlectPossibleLocations,
    map: buildMap({}),
    dataset: null,
    score: {},
    results: {},
    resetSystem: (): void => { /* Default */ },
    deleteMarker: (): void => { /* Default */ },
    getNextSystemStatus: (): void => { /* Default */ },
    saveScoreAttributesResult: (): Promise<void> => { return Promise.resolve(); },
    getPrevSystemStatus: (): void => { /* Default */ },
    toggleCustomersLayer: (): void => { /* Default */ },
    toggleCompetitorsLayer: (): void => { /* Default */ },
    toggleGridLayer: (): void => { /* Default */ }, 
    toggleHeatLayer: (): void => { /* Default */ },
    changeDataset: (): Promise<void> => { return Promise.resolve() }
}

export const MapContext = React.createContext<MapContextType>(initialMapContext)

const systemStatusTransitions = {
    [SystemStatus.setlectPossibleLocations]: SystemStatus.defineLocationAttributes,
    [SystemStatus.defineLocationAttributes]: SystemStatus.compareLocationAttributes,
    [SystemStatus.compareLocationAttributes]: SystemStatus.resultLocations,
    [SystemStatus.resultLocations]: SystemStatus.resultLocations
}

const systemStatusReverseTransitions = {
    [SystemStatus.resultLocations]: SystemStatus.compareLocationAttributes,
    [SystemStatus.compareLocationAttributes]: SystemStatus.defineLocationAttributes,
    [SystemStatus.defineLocationAttributes]: SystemStatus.setlectPossibleLocations,
    [SystemStatus.setlectPossibleLocations]: SystemStatus.setlectPossibleLocations
}

const getLocations = (markers: Marker[], attributes: AttributeMapType[]): LocationType[] => (
    zip(markers, attributes).map(([marker, attributes]) => ({ 
        name: marker.getName(), 
        marker, 
        attributes
    }))
)

/**
 * 
 * REVIEW Normalization is here
 * @param attributes 
 * @returns 
 */
const attributesToMap = (attributes: IAttribute[]): AttributeMapType => {
    return attributes.reduce((acc, { key, value, maxValue }) => ({ ...acc, [key]: Number(value) / Number(maxValue) }), {})
}

const markersAttributesToMap = (markersAttributes: IAttribute[][]): AttributeMapType[] => {
    return markersAttributes.map(attributes => attributesToMap(attributes))
}

/**
 * 
 * @returns 
 */
const Map: React.FC = () => {

    // TODO make better state
    // const [locations, setLocations] = useState<LocationType[]>([])
    // const { config, customers, competitors, areaOfHighDemand } = useContext(DataContext)

    const { 
        isFetching,
        isError,
        config,
        map, 
        dataset,
        toggleCustomersLayer, 
        toggleCompetitorsLayer, 
        toggleGridLayer, 
        toggleHeatLayer,
        changeDataset
    } = useMap()

    // I need this state here because I need to reflect marker changes when selecting locations
    const [markers, setMarkers] = useState<Marker[]>([])
    const [score, setScore] = useState<ScoreMapType>({})
    const [results, setResults] = useState<Record<string, number>>({})
    const [consistency, setConsistency] = useState<number>(0)

    const [currentStep, setCurrentStep] = useState<SystemStatus>(SystemStatus.setlectPossibleLocations)

    const resetSystem: ResetSystemFuncType = () => {
        map.reset()
        setMarkers([])
        setScore({})
        setResults({})
        setConsistency(0)
        setCurrentStep(SystemStatus.setlectPossibleLocations)
    }

    const deleteMarker: DeleteMarkerFuncType = useCallback(
        (index: number) => {
            if (currentStep !== SystemStatus.setlectPossibleLocations) return
            setMarkers(prev =>
                prev.filter((marker, i) => {
                    if (i === index) marker.remove()

                    return i !== index
                })
            )
        },
        [currentStep]
    )

    const onMapClick: L.LeafletMouseEventHandlerFn = useCallback(
        (e) => {
            if(currentStep !== SystemStatus.setlectPossibleLocations) return
    
            setMarkers(prev => prev.length === 5 ? prev : [...prev, new Marker(e.latlng, map)])
        },
        [currentStep, map]
    )

    useEffect(
        () => {
            map.on('click', onMapClick);

            return () => {
                map.off("click", onMapClick)
            }
        },
        [map, onMapClick]
    )

    /**
     * 
     */
    const getNextSystemStatus: GetNextSystemStatusFuncType = useCallback(
        () => {
            setCurrentStep(prev => (systemStatusTransitions[prev]))
        },
        []
    )

    const getPrevSystemStatus: GetPrevSystemStatusFuncType = useCallback(
        () => {
            setCurrentStep(prev => (systemStatusReverseTransitions[prev]))
        },
        []
    )

    // TODO too many dependencies
    const saveScoreAttributesResult: SaveScoreAttributesResultFuncType = useCallback(
        async (unsavedScore: ScoreMapType) => {
            if (currentStep !== SystemStatus.compareLocationAttributes) return

            setScore(unsavedScore)
            try {
                const markersAttributesMap = markersAttributesToMap(map.getMarkers().map(marker => marker.getAttrbutes()))
                const locations = getLocations(map.getMarkers(), markersAttributesMap)

                const response = await fetchAHPResults(locations, unsavedScore)

                map.setMarkersScore(response.results)

                setConsistency(response.consistencyRatio)
                setResults(response.results)
            } catch (error) {
                console.error(error)
                // TODO handle error if fetch was not successful
            }
        },
        [currentStep, map]
    )


    const contextValue: MapContextType = {
        consistency,
        config,
        markers,
        map,
        dataset,
        score,
        results,
        systemStatus: currentStep,
        resetSystem,
        deleteMarker,
        saveScoreAttributesResult,
        getNextSystemStatus,
        getPrevSystemStatus,
        toggleCustomersLayer,
        toggleCompetitorsLayer,
        toggleGridLayer, 
        toggleHeatLayer,
        changeDataset
    }
    
    return (
        <MapContext.Provider value={contextValue}>
            <div className={classes.container}>
                {isFetching && <Loading />}
                {isError && <Error />}
                <MapInfo>
                    <Outlet />
                </MapInfo>
            </div>
        </MapContext.Provider>
    )
}

export default Map