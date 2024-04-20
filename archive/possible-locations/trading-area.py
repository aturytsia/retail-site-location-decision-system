#!/usr/bin/env python

__author__ = "Oleksandr Turytsia"
__copyright__ = ""
__license__ = ""
__version__ = "0.0.1"
__maintainer__ = "Oleksandr Turytsia"
__email__ = "xturyt00@stud.fit.vutbr.cz"
__status__ = "Development"

import contextily as ctx
import sys
import getopt
import requests
import json
import osmnx as ox
import networkx as nx
import pandas as pd
import geopandas as gpd
import matplotlib.pyplot as plt
import numpy as np
from shapely.geometry import Polygon, Point
from functools import reduce
import math
from typing import Optional
from time import time


COMPETITORS_URL = "https://gis.brno.cz/ags1/rest/services/Hosted/KAM_Pruzkum_Maloobchodu_2021/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json"
CUSTOMERS_URL = "https://gis.brno.cz/ags1/rest/services/_ROB2024_data_Brno/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json"

AVERAGE_WALKING_SPEED = 6

DEBUG = False

COMPETITORS_VALUES_FORMAT = {
    "area": {
        "do 50": 25,
        "51 - 200": 100,
        "201 - 400": 300,
        "401 - 1 000": 700,
        "1 001 - 3 000": 2000
    },
}

COMPETITORS_SCHEMA = {
    "id": "objectid",
    "area": "plocha",
}

CUSTOMER_SCHEMA = {
    "id": "objectid",
    "count": "pocet",
}

HELP = """
TODO
"""

def error(message: str) -> None:
    """Exits script with error code 1 and error message m

    Args:
        message (str): Error message
    """
    print(f"Error: {message}", file=sys.stderr)
    exit(1)
    
def debug(message: str) -> None:
    global DEBUG
    
    if not DEBUG:
        return
    
    print(f"{message}")
    
# TODO Document it
# TODO define CUSTOMERS_URL and CUSTOMERS_URL options or JSON input
# TODO define SCHEMA option to access json data
def read_arguments() -> None:
    global DEBUG
    
    try:
        opts, args = getopt.getopt(sys.argv[1:], "h", ["help", "debug"])
    except getopt.GetoptError as e:
        error(e)

    for o, a in opts:
        if o in ("-h", "--help"):
            print(HELP)
            exit(0)
        elif o in ("--debug"):
            DEBUG = True
        else:
            error(f"Unhandled option {o}")

def add_meters_to_latitude(latitude: float, meters: float) -> float:
    # Approximate scaling factor: 1 degree = 111 kilometers
    # meters = meters / 111000 degrees
    delta_lat = meters / 111000
    new_latitude = latitude + delta_lat
    return new_latitude


def add_meters_to_longitude(longitude: float, latitude: float, meters: float) -> float:
    # Approximate scaling factor for longitude at equator: 1 degree = 111 kilometers
    # Scaling factor varies with latitude
    # Calculate the scaling factor for longitude at the given latitude
    scaling_factor = math.cos(math.radians(latitude))

    # meters meters = meters / (scaling_factor * 111000) degrees
    delta_lon = meters / (scaling_factor * 111000)
    new_longitude = longitude + delta_lon
    return new_longitude

def get_geodataframe(data: dict, schema: dict[str, str], formatters: dict = {}) -> gpd.GeoDataFrame:
    
    df_data = {key: [] for key in schema.keys()}
    df_data.update({"x": [], "y": []})
    
    try:
        features: list[dict] = data["features"]
    
        for feature in features:
            attributes: dict = feature["attributes"]
            geometry: dict = feature["geometry"]
            
            # Retrieve necessary attributes
            for key, mapped_key in schema.items():
                formatter: Optional[dict] = formatters.get(key, None)
                value = attributes.get(mapped_key, None)
                df_data[key].append(formatter.get(value, None) if formatter else value)
            
            # Retrieve coordinates
            df_data["x"].append(geometry.get("x", None))
            df_data["y"].append(geometry.get("y", None))
    except KeyError as e:
        error(str(e))
    except Exception as e:
        error(f"Error occured in get_dataframe: {e}")
        
    df = pd.DataFrame(df_data)
    
    geometry = [Point(x, y) for x, y in zip(df['x'], df['y'])]
        
    return gpd.GeoDataFrame(df_data, geometry=geometry)

# TODO 
def get_squares(min_point: tuple[float, float], max_point: tuple[float, float], meters = 500) -> gpd.GeoDataFrame:
    
    squares = []
    center = []
    
    (minx, miny) = min_point
    (maxx, maxy) = max_point
    
    x1 = minx
    while x1 < maxx:
        
        y1 = miny
        x2 = add_meters_to_longitude(x1, miny, meters)

        while y1 < maxy:
            
            x2 = add_meters_to_longitude(x1, y1, meters)
            y2 = add_meters_to_latitude(y1, meters)
            
            center.append(Point(x2 - (x2 - x1) / 2, y2 - (y2 - y1) / 2))

            square = Polygon([(x1, y1), (x2, y1), (x2, y2), (x1, y2)])
            squares.append(square)
            
            y1 = y2
        x1 = x2
        
    df_center = pd.DataFrame({"center": center})
        
    return gpd.GeoDataFrame(df_center, geometry=squares)

def main():
    global time
    
    debug("Reading arguments...")
    
    # Parse arguments
    read_arguments()

    # Read data for geo-competition
    # TODO read data from the input or a file
    
    debug("Quering data for geo-competition...")
    
    response = requests.get(COMPETITORS_URL)
    if response.status_code != 200:
        raise ValueError("COMPETITORS_URL error")
    
    try:
        competitors_dataset: dict = json.loads(response.text)
    except json.decoder.JSONDecodeError as e:
        error(e)

    response = requests.get(CUSTOMERS_URL)
    if response.status_code != 200:
        raise ValueError("CUSTOMERS_URL error")

    try:
        people_dataset: dict = json.loads(response.text)
    except json.decoder.JSONDecodeError as e:
        error(e)

    debug("Installing graph...")
    
    # TODO checkout keyargs in graph_from_place
    graph = ox.graph_from_place("Brno, Czech Republic", network_type="drive")
    
    debug("Extracting boundary information from the graph...")
    
    # Extract the boundary information from the graph
    # Convert the graph to GeoDataFrame
    gdf_nodes, gdf_edges = ox.graph_to_gdfs(graph)

    debug("Extracting boundary coordinates...")

    # Get the bounding box coordinates
    minx, miny, maxx, maxy = gdf_nodes.geometry.total_bounds
    
    debug("Creating dataframes...")

    gdf_competitors = get_geodataframe(competitors_dataset, COMPETITORS_SCHEMA, COMPETITORS_VALUES_FORMAT)
    gdf_customers = get_geodataframe(people_dataset, CUSTOMER_SCHEMA)

    debug("Generating grid squares...")
        
    # Generate grid squares from min point to max point
    gdf_grid = get_squares((minx, miny), (maxx, maxy))
    
    gdf_competitors = gpd.sjoin(gdf_competitors, gdf_grid, how="left", predicate="within")
    gdf_customers = gpd.sjoin(gdf_customers, gdf_grid, how="left", predicate="within")
    
    # Filtering dataframes
    
    # Drop rows with NaN values for specified columns
    gdf_competitors = gdf_competitors.dropna(subset=['center', 'area'])
    gdf_customers = gdf_customers.dropna(subset=['center', 'count'])
    
    gdf_competitors_grouped = gdf_competitors.groupby(['index_right']).size().reset_index(name='row_count')
    gdf_customers = gdf_customers.groupby(['index_right']).agg({'count': 'sum'}).reset_index()
    
    gdf_competitors_grouped = pd.concat([gdf_grid, gdf_competitors_grouped.set_index('index_right')], axis=1, join='inner')
    gdf_customers = pd.concat([gdf_grid, gdf_customers.set_index('index_right')], axis=1, join='inner')
    
    gdf_competitors_grouped.reset_index(inplace=True)
    gdf_customers.reset_index(inplace=True)
    
    gdf_competitors_grouped['index'] = gdf_competitors_grouped['index'].astype(int)
    gdf_customers['index'] = gdf_customers['index'].astype(int)
    
    debug("Estimating trading areas...")
    
    probabilities = []
    nodes = {}
    distances = {}
    
    start_time = time()
    
    # 
    
    for customer_index in gdf_customers.index:
        # At this point we have a specific customer
        
        travel_time_data = {
            "index": [],
            "time": []
        }
        
        probabilities_data = {
            "id": [],
            "probability": []
        }
        
        customer = gdf_customers.loc[customer_index]
        
        # customer_id = customer["id"]
        customer_center = customer["center"]
        square_key = customer["index"]
        
        # Get customer's node
        if square_key in nodes:
            dest_node = nodes[square_key]
        else:
            dest_node = ox.distance.nearest_nodes(graph, customer_center.x, customer_center.y)
            nodes[square_key] = dest_node
        
        for competitor_index in gdf_competitors_grouped.index:
            
            competitor = gdf_competitors_grouped.loc[competitor_index]
            
            # competitor_id = competitor["id"]
            competitor_center = competitor["center"]
            square_key = competitor["index"]

            # Get competitor's node
            
            if square_key in nodes:
                current_node = nodes[square_key]
            else:
                current_node = ox.distance.nearest_nodes(graph, competitor_center.x, competitor_center.y)
                nodes[square_key] = current_node
                
            node_pair = tuple(sorted([dest_node, current_node]))
            
            distance = distances.get(node_pair)
            if distance is None:
                try:
                    distance = nx.shortest_path_length(graph, dest_node, current_node, weight="length")
                    distances[node_pair] = distance
                except nx.exception.NetworkXNoPath:
                    continue
            
            travel_time = distance / AVERAGE_WALKING_SPEED
            
            travel_time_data["index"].append(square_key)
            travel_time_data["time"].append(travel_time)
            
        df_travel_time = pd.DataFrame(travel_time_data)
        
        gdf_competitors_merged = pd.merge(df_travel_time, gdf_competitors, left_on='index', right_on='index_right', how='inner')
        
        # REVIEW sometimes time = 0 in gdf_competitors_merged
        gdf_competitors_merged = gdf_competitors_merged[gdf_competitors_merged["time"] != 0]
        
        sum_of_probabilities = (gdf_competitors_merged["area"] / gdf_competitors_merged["time"]).sum()
        
        for competitor_index in gdf_competitors_merged.index:
            
            competitor = gdf_competitors_merged.loc[competitor_index]
            
            competitor_id = competitor["id"]
            area = competitor["area"]
            travel_time = competitor["time"]
            
            probability = (area / travel_time) / sum_of_probabilities

            probabilities_data["id"].append(competitor_id)
            probabilities_data["probability"].append(probability)
        
        probabilities.append(pd.DataFrame(probabilities_data))
        
    # Concatenate the list of DataFrames into one DataFrame
    concatenated_df = pd.concat(probabilities, ignore_index=True)

    # TODO I'm not sure I need to average probabilites here. My guess is to sum it all
    # Group by 'id' and calculate the mean of 'probability' column
    averaged_df = concatenated_df.groupby('id').mean().reset_index()
    
    print(averaged_df)
            
    end_time = time()
    execution_time = end_time - start_time

    print("Execution time:", execution_time, "seconds")

if __name__ == "__main__":
    main()