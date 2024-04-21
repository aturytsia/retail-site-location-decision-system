#!/usr/bin/env python

__author__ = "Oleksandr Turytsia"
__maintainer__ = "Oleksandr Turytsia"
__email__ = "xturyt00@stud.fit.vutbr.cz"

import sys
import osmnx as ox
import networkx as nx
import pandas as pd
import geopandas as gpd
import numpy as np
from shapely.geometry import Point
import threading
import json

from settings import (
    CONFIG,
    Config
)

from settings import (
    GRAPH
)

from utils import (
    get_squares,
    read_dataset,
)

AVERAGE_WALKING_SPEED = 6

DEBUG = False

def error(message: str) -> None:
    """Exits script with error code 1 and error message m

    Args:
        message (str): Error message
    """
    print(f"Error: {message}", file=sys.stderr)
    exit(1)
    
def debug(message: str) -> None:
    global DEBUG
    
    if DEBUG:
        print(f"{message}")

def get_geodataframe(data: list[tuple[float, float, float]], key: str) -> gpd.GeoDataFrame:
    """
    Converts a list of tuples containing latitude, longitude, and a count into a GeoDataFrame.

    Args:
        data (list[tuple[float, float, float]]): A list of tuples containing latitude, longitude, and a count.
        key (str): The key name for the count data.

    Returns:
        gpd.GeoDataFrame: A GeoDataFrame containing the input data along with Point geometry.

    Raises:
        Exception: If an error occurs during the conversion process.
    """
    ids, x, y, k = ([], [], [], [])
    
    try:
        
        for id, (lat, lng, count) in enumerate(data, 1):
            ids.append(id)
            x.append(lng)
            y.append(lat)
            k.append(count)
            
        df = pd.DataFrame({
            "id": ids,
            "x": x,
            "y": y,
            key: k
        })
    
        geometry = [Point(x, y) for x, y in zip(df['x'], df['y'])]
        
    except Exception as e:
        error(f"Error occured in get_dataframe: {e}")
        
    return gpd.GeoDataFrame(df, geometry=geometry) # type: ignore


def fix_float(value):
    """
    Fix a floating-point value.

    This function rounds the floating-point value to 20 decimal places 
    if it is not NaN. If the value is NaN, it returns 0.

    Args:
        value (float): The floating-point value to fix.

    Returns:
        float: The fixed floating-point value.

    Examples:
        >>> fix_float(3.14159265358979323846)
        3.14159265358979323846

        >>> fix_float(float('nan'))
        0.0
    """
    if pd.isna(value):
        return 0
    
    return round(value, 20)

GRAPH_DISTANCE_TO_NODES = {}
def get_distance_to_node(dest_node: str, current_node: str) -> float | None:
    """
    Calculate the distance between two nodes in a graph.

    This function calculates the shortest path distance between the given destination node
    and the current node in a graph. If the distance is not already stored in the global
    GRAPH_DISTANCE_TO_NODES dictionary, it calculates the distance using the networkx library
    and stores it for future use.

    Args:
        dest_node (Any): The destination node.
        current_node (Any): The current node.

    Returns:
        Optional[float]: The distance between the destination node and the current node, 
        or None if there is no path between them.

    Raises:
        NetworkXNoPath: If there is no path between the destination node and the current node.

    Notes:
        This function assumes the existence of a global variable GRAPH_DISTANCE_TO_NODES, 
        which is a dictionary storing pre-calculated distances between node pairs in the graph.

    Example:
        >>> get_distance_to_node('a', 'b')
        5.0
    """
    global GRAPH_DISTANCE_TO_NODES

    node_pair = tuple(sorted([dest_node, current_node]))
            
    distance = GRAPH_DISTANCE_TO_NODES.get(node_pair)
    if distance is None:
        try:
            distance = nx.shortest_path_length(GRAPH, dest_node, current_node, weight="length")
            GRAPH_DISTANCE_TO_NODES[node_pair] = distance
            return distance
        except nx.exception.NetworkXNoPath:
            return None
    return distance

GRAPH_NEAREST_NODES_CACHE = {}
def get_nearest_node(key: str, x: float, y: float) -> str:
    """
    Get the nearest node to the given coordinates in the graph.

    This function retrieves the nearest node to the specified coordinates (x, y)
    in the graph. It first checks if the nearest node for the given key has been
    cached in the GRAPH_NEAREST_NODES_CACHE. If it has, it returns the cached node.
    Otherwise, it calculates the nearest node using the osmnx library and caches
    the result for future use.

    Args:
        key (str): The id identifying the nearest node.
        x (float): The x-coordinate of the point.
        y (float): The y-coordinate of the point.

    Returns:
        Any: The nearest node to the given coordinates (its id).

    Notes:
        This function assumes the existence of a global variable GRAPH_NEAREST_NODES_CACHE,
        which is a dictionary storing cached nearest nodes for different keys.

    Example:
        >>> get_nearest_node('node_id', 40.7128, -74.0060)
        'example_node'
    """
    global GRAPH_NEAREST_NODES_CACHE

    if key in GRAPH_NEAREST_NODES_CACHE:
        return GRAPH_NEAREST_NODES_CACHE[key]
    else:
        nearest_node = ox.distance.nearest_nodes(GRAPH, x, y) # type: ignore
        GRAPH_NEAREST_NODES_CACHE[key] = nearest_node
        return nearest_node
    
def get_probability(attractiveness: pd.Series, time: pd.Series, distance_decay: float = 1.5) -> pd.Series:
    """
    Calculate the probability based on attractiveness and time.

    This function calculates the probability of selection based on the attractiveness 
    and time required to access a location. The probability is calculated using a 
    distance decay function.

    Args:
        attractiveness (pd.Series): A pandas Series representing the attractiveness 
            of each location.
        time (pd.Series): A pandas Series representing the time required to access 
            each location.

    Returns:
        pd.Series: A pandas Series representing the probability of selection for each location.

    Notes:
        The probability is calculated using the formula: 
        probability = attractiveness / (time ** distance_decay)

    Example:
        >>> get_probability(pd.Series([10, 20, 30]), pd.Series([5, 10, 15]))
        0    0.08
        1    0.20
        2    0.24
        dtype: float64
    """
    return attractiveness / (time ** distance_decay)

def read_from_cache(path: str) -> pd.DataFrame | None:
    try:
        with open(path, "r") as file:
            return json.loads(file.read())
    except Exception as e:
        print(str(e))
        return None
    
def save_to_cache(df: pd.DataFrame, path: str) -> None:
    try:
        with open(path, 'w') as json_file:
            data = [(row['y'], row['x'], row['probability']) for _, row in df.iterrows()]
            json.dump(data, json_file)
    except OSError as e:
        print(str(e))

def get_geocompetition(
    customers: list[tuple[float, float, float]], 
    competitors: list[tuple[float, float, float]], 
    cache_path: str | None,
    use_cache: bool = True,
    distance_decay: float = 1.5
) -> list[tuple[float, float, float]]:

    debug("Checking if data was already evaluated...")
    
    # Use cached results if they exist
    if cache_path and use_cache:
        cached_data = read_from_cache(cache_path)

        if cached_data is not None:
            return cached_data

    debug("Creating dataframes...")

    # Convert datasets into GeoDataFrame
    gdf_competitors = get_geodataframe(competitors, "area")
    gdf_customers = get_geodataframe(customers, "count")

    debug("Generating grid squares...")
        
    # Generate grid squares from min point to max point
    gdf_grid = get_squares()
    
    # Assign grid to the points from dataset. For example if customer A is inside of grid B, then id of grid B is assigned to customer A
    gdf_competitors: gpd.GeoDataFrame = gpd.sjoin(gdf_competitors, gdf_grid, how="left", predicate="within")
    gdf_customers: gpd.GeoDataFrame = gpd.sjoin(gdf_customers, gdf_grid, how="left", predicate="within")
    
    # Filter dataframes
    
    # Drop rows with NaN values for specified columns
    gdf_competitors = gdf_competitors.dropna(subset=['center', 'area']) # type: ignore
    gdf_customers = gdf_customers.dropna(subset=['center', 'count']) # type: ignore

    # Group customers within the same grid and sum them
    gdf_customers_grouped = gdf_customers.groupby(['index_right']).agg({'count': 'sum'}).reset_index()

    # Concatenate data from grouped competitors and customers with associated grid
    gdf_customers_grouped = pd.concat([gdf_grid, gdf_customers_grouped.set_index('index_right')], axis=1, join='inner')
    
    # Reset index and cast index column to int
    gdf_customers_grouped.reset_index(inplace=True)
    gdf_customers_grouped['index'] = gdf_customers_grouped['index'].astype(int)
    
    debug("Estimating trading areas...")
    
    # Stores probabilities of customer going to all the competitors
    probabilities_list = []
    
    for competitor_index in gdf_competitors.index:

        competitor = gdf_competitors.loc[competitor_index]
        
        # Get grid center where competitor entry is located
        competitor_center: Point = competitor["center"]

        square_key = competitor["index_right"]
        area = competitor["area"]

        # Get nearest node in the graph for competitor
        dest_node = get_nearest_node(square_key, competitor_center.x, competitor_center.y)
        
        square_index = []
        square_travel_time = []
        for customer_index in gdf_customers_grouped.index:
            
            customer = gdf_customers_grouped.loc[customer_index]
            
            # Get grid center where customer entry is located
            customer_center: Point = customer["center"]

            square_key = customer["index"]

            # Get nearest node in the graph for customer
            current_node = get_nearest_node(square_key, customer_center.x, customer_center.y)
            
            # Get distance from competitor node to customer node
            distance = get_distance_to_node(dest_node, current_node)
            if distance is None:
                continue
            
            # Estimate linear travel time to walk from competitor to customer node
            travel_time = distance / AVERAGE_WALKING_SPEED
            
            square_index.append(square_key)
            square_travel_time.append(travel_time)
            
        df_travel_time = pd.DataFrame({
            "index": square_index,
            "time": square_travel_time
        })
        
        # Add travel time column to the competitor for each customer grid
        gdf_customers_merged = pd.merge(df_travel_time, gdf_customers, left_on='index', right_on='index_right', how='inner')
        
        # Sometimes time = 0 in gdf_competitors_merged. It can happen if customer and competitor are in the same grid
        gdf_customers_merged.loc[gdf_customers_merged["time"] == 0, "time"] = 1

        probabilities_sum = get_probability(area * gdf_customers_merged["count"], gdf_customers_merged["time"], distance_decay).sum()

        # List with probabilities of all customers going to the current competitor
        probabilities = []
        for customer_index in gdf_customers_merged.index:
            
            customer = gdf_customers_merged.loc[customer_index]
            
            time = customer["time"]
            count = customer["count"]
            
            probability = get_probability(area * count, time, distance_decay) / probabilities_sum

            probabilities.append(probability)
        
        # List with probabilities of all customers going to all the compatitors
        probabilities_list.append(np.array(probabilities))
    
    # Sometimes probabilities_list contains differently sized arrays, for this reason we add padding
    max_length = max(len(arr) for arr in probabilities_list)
    
    padded_probabilities_list = [np.pad(arr, (0, max_length - len(arr)), mode="constant") for arr in probabilities_list]
    
    # All the probabilites are averaged. It calculates average probability of the customers of visiting all the competitors
    overall_probability = np.sum(padded_probabilities_list, axis=0) / len(padded_probabilities_list)
    
    result = gdf_customers_merged
    
    # Add average probability of visiting all the competitors to the customers
    result["probability"] = overall_probability
    
    result.drop(columns=["geometry", "index_right", "center"], inplace=True)
    result = result.dropna()
    result = result.map(fix_float)
    
    if cache_path:
        save_to_cache(result, cache_path)
    
    return [(row['y'], row['x'], row['probability']) for _, row in result.iterrows()]


def estimate_geocompetition(config: Config, is_testing: bool = False):
    customers = read_dataset(config.customers)

    def estimate(dataset_key: str, path: str, distance_decay: float = 1.5) -> None:
        competitors = read_dataset(path)
        _ = get_geocompetition(customers, competitors, f"./{'tests' if is_testing else 'data'}/{dataset_key}.json", True, distance_decay)

    threads = []
    for dataset_key, competitor in config.competitors.items():
        thread = threading.Thread(target=estimate, args=(dataset_key, competitor.path, competitor.distanceDecay))
        threads.append(thread)
        thread.start()

    # Wait for all threads to complete
    for thread in threads:
        thread.join()