/**
 * Provides functionality to manage map-related operations and state.
 * @module useMap
 * @returns Returns an object containing map-related state and functions.
 * @author Oleksandr Turytsia
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Map } from '../../utils/Map';
import axios, { AreaOfHighDemandLayerType, ConfigType } from '../../utils/axios';
import { DataPointType, Nullable, PointType, PolygonType } from '../../utils/types';
import { MapOptions } from 'leaflet';
import { inversePoints } from '../../utils/utils';

/**
 * Fetches configuration data from the server.
 * @returns A promise resolving to the fetched configuration data.
 */
const fetchConfig = async (): Promise<ConfigType>  => {
    const { data } = await axios.get<ConfigType>("/config");
    return data;
}

/**
 * Fetches areas of high demand based on the dataset.
 * @param dataset - The dataset for which to fetch the areas of high demand.
 * @returns A promise resolving to the fetched areas of high demand.
 */
const fetchAreasOfHighDemandByDataset = async (dataset: string): Promise<AreaOfHighDemandLayerType> => {
    const { data } = await axios.post<{area: AreaOfHighDemandLayerType}>("/area", { dataset });
    return data.area;
}

/**
 * Fetches customer data from the server.
 * @returns A promise resolving to the fetched customer data.
 */
const fetchCustomers = async (): Promise<DataPointType[]> => {
    const { data } = await axios.get<{customers: DataPointType[]}>("/customers");
    return data.customers;
}

/**
 * Fetches competitor data based on the dataset.
 * @param dataset - The dataset for which to fetch competitor data.
 * @returns A promise resolving to the fetched competitor data.
 */
const fetchCompetitorsByDataset = async (dataset: string): Promise<DataPointType[]> => {
    const { data } = await axios.post<{competitors: DataPointType[]}>("/competitors", { dataset });
    return data.competitors;
}

/**
 * Initial configuration data.
 */
export const initialConfig: ConfigType = {
    center: null,
    grid: [],
    datasets: []
}

/**
 * Builds a Leaflet map instance.
 * @param options - Options for configuring the map.
 * @returns The initialized Leaflet map instance.
 */
export const buildMap = (options: MapOptions): Map => {
    const container = document.getElementById('map-container')
    // REVIEW will return error, map does not exist
    if(!container) return new Map('map', options);
    container.innerHTML = "<div id='map' style='width: 100%; height: 100%;'></div>";
    return new Map('map', options);
}

/**
 * Enum representing the loading status of the map data.
 */
export enum LoadingStatus {
    Fetching,
    Loading,
    None,
    Error
}

/**
 * Provides hooks and state management for map-related operations.
 * @returns An object containing map-related state and functions.
 */

const useMap = () => {

    const [isHeatLayerActive, setIsHeatLayerActive] = useState(false)
    const [isGridLayerActive, setIsGridLayerActive] = useState(false)
    const [isCustomersLayerActive, setIsCustomersLayerActive] = useState(false)
    const [isCompetitorsLayerActive, setIsCompetitorsLayerActive] = useState(false)

    const [config, setConfig] = useState<ConfigType>(initialConfig)
    const [areaOfHighDemand, setAreaOfHighDemand] = useState<AreaOfHighDemandLayerType>([])
    const [competitors, setCompetitors] = useState<[...PointType, number][]>([])
    const [customers, setCustomers] = useState<[...PointType, number][]>([])
    const [dataset, setDataset] = useState<Nullable<string>>(null)

    const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>(LoadingStatus.Fetching)

    const options: MapOptions = useMemo(
        () => ({
            center: config.center ?? [49.1922443, 16.6113382],
            zoom: 13,
            zoomControl: false,
        }),
        [config]
    )

    const map = useMemo(
        () => buildMap(options),
        []
    )

    const toggleHeatLayer = useCallback(
        () => {
            setIsHeatLayerActive(prev => {
                map.toggleHeatLayer(!prev)
                return !prev
            })
        },
        [map]
    )

    const toggleGridLayer = useCallback(
        () => {
            setIsGridLayerActive(prev => {
                map.toggleGridLayer(!prev)
                return !prev
            })
        },
        [map]
    )

    const toggleCustomersLayer = useCallback(
        () => {
            setIsCustomersLayerActive(prev => {
                map.toggleCustomersLayer(!prev)
                return !prev
            })
        },
        [map]
    )

    const toggleCompetitorsLayer = useCallback(
        () => {
            setIsCompetitorsLayerActive(prev => {
                map.toggleCompetitorsLayer(!prev)
                return !prev
            })
        },
        [map]
    )

    const fetchConfigHandler = useCallback(
        async () => {
            try {
                setConfig(await fetchConfig())
            } catch (error) {
                console.error(error)
                setLoadingStatus(LoadingStatus.Error)
            }
        },
        []
    )

    const fetchLayerData = useCallback(
        async () => {
            try {
                const dataset = config.datasets[0]

                if(!dataset) return

                const grid = config.grid.map(polygon => inversePoints(polygon) as PolygonType)

                map.setGridLayer(grid)
                // setDataset(dataset)
    
                const customers = await fetchCustomers()
    
                map.setCustomersLayer(customers)
                setCustomers(customers)
    
                // const competitors = await fetchCompetitorsByDataset(dataset)
    
                // map.setCompetitorsLayer(competitors)
                // setCompetitors(competitors)
    
                // const area = await fetchAreasOfHighDemandByDataset(dataset)
    
                // map.setHeatLayer(area)
                // setAreaOfHighDemand(area)

                toggleHeatLayer()

                toggleGridLayer()
    
            } catch (error) {
                console.error(error)
                setLoadingStatus(LoadingStatus.Error)
            }
        },
        [config, map, toggleHeatLayer, toggleGridLayer]
    )

    

    const changeDataset = useCallback(
        async (dataset: string) => {

            if(!dataset) return

            try {
                setLoadingStatus(LoadingStatus.Fetching)
                const area = await fetchAreasOfHighDemandByDataset(dataset)

                map.setHeatLayer(area)
                setAreaOfHighDemand(area)

                const competitors = await fetchCompetitorsByDataset(dataset)

                map.setCompetitorsLayer(competitors)
                setCompetitors(competitors)
                
                setDataset(dataset)
            } catch (error) {
                console.error(error)
                setLoadingStatus(LoadingStatus.Error)
            } finally {
                setLoadingStatus(LoadingStatus.None)
            }
        },
        [map]
    )

    const isLoading = useMemo(
        () => loadingStatus === LoadingStatus.Loading,
        [loadingStatus]
    )

    const isFetching = useMemo(
        () => loadingStatus === LoadingStatus.Fetching,
        [loadingStatus]
    )

    const isReady = useMemo(
        () => loadingStatus === LoadingStatus.None,
        [loadingStatus]
    )

    const isError = useMemo(
        () => loadingStatus === LoadingStatus.Error,
        [loadingStatus]
    )

    useEffect(
        () => {
            fetchConfigHandler()
        },
        [fetchConfigHandler]
    )

    useEffect(
        () => {
            fetchLayerData()
        },
        [fetchLayerData]
    )

    useEffect(
        () => {
            return (): void => {
                map.remove()
            }
        },
        [map]
    )

    useEffect(
        () => {
            if(config.datasets.length === 0) return

            setLoadingStatus(LoadingStatus.None)
        },
        [config.datasets]
    )


    return {
        isLoading,
        isFetching,
        isReady,
        isError,
        config,
        map,
        dataset,
        isHeatLayerActive,
        isGridLayerActive,
        isCustomersLayerActive,
        isCompetitorsLayerActive,
        toggleHeatLayer,
        toggleGridLayer,
        toggleCustomersLayer,
        toggleCompetitorsLayer,
        changeDataset
    }
}

export default useMap