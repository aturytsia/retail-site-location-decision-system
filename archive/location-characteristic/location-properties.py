#!/usr/bin/env python

__author__ = "Oleksandr Turytsia"
__copyright__ = ""
__license__ = ""
__version__ = "0.0.1"
__maintainer__ = "Oleksandr Turytsia"
__email__ = "xturyt00@stud.fit.vutbr.cz"
__status__ = "Development"

import json
import getopt
import sys
import requests
import googlemaps
from datetime import datetime
import osmnx as ox
import networkx as nx
import matplotlib.pyplot as plt
from statistics import mean

RETAIL_RESEARCH_BRNO = "https://gis.brno.cz/ags1/rest/services/Hosted/KAM_Pruzkum_Maloobchodu_2021/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json"
NUMBER_OF_PEOPLE_AT_ADDRESSES = "https://services6.arcgis.com/fUWVlHWZNxUvTUh8/arcgis/rest/services/adresni_body_pocet_obyvatel/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json"
GOOGLE_API_KEY = "AIzaSyCeN3QNZoqdVxjvYKY_qEcBjoHCEsKZ_aY"

AVERAGE_WALKING_SPEED = 6

def error(m: str) -> None:
    """Exits program with error code 1 and error message m

    Args:
        m (str): Error message
    """
    print(f"Error: {m}", file=sys.stderr)
    exit(1)

def get_size_of_competition(location: dict) -> int:
    print(location)
    attributes: dict = location.get("attributes")
    area: str = attributes.get("plocha")

    if area == "do 50":
        return 25
    elif area == "51 - 200":
        return 100
    elif area == "201 - 400":
        return 300
    elif area == "401 - 1 000":
        return 700
    elif area == "1 001 - 3 000":
        return 2000
    else:
        return 0


def method(graph, dest_location: dict, people_at_addresses_dict: dict, retail_site_locations_dict: dict) -> dict:
    coordinates = dest_location.get("coordinates")
    sales_floor_area = dest_location.get("salesFloorArea")

    # get lat, long
    dest_long = coordinates[0]
    dest_lat = coordinates[1]

    # find nearest node
    dest_node = ox.distance.nearest_nodes(graph, dest_long, dest_lat)

    people_at_addresses: list[dict] = people_at_addresses_dict.get("features")[:10] # O ^ 2

    retail_site_locations: list[dict] = retail_site_locations_dict.get("features")[:10]

    people_with_travel_time: list[dict] = []

    for address in people_at_addresses:

        geometry: dict = address.get("geometry")
        attributes: dict = address.get("attributes")

        long = geometry.get("x")
        lat = geometry.get("y")

        current_node = ox.distance.nearest_nodes(graph, long, lat)

        try:
            distance_meters = nx.shortest_path_length(graph, dest_node, current_node, weight="length")
        except nx.exception.NetworkXNoPath:
            continue

        people_with_travel_time.append({ **attributes, "timeToTarget": distance_meters / AVERAGE_WALKING_SPEED })

    # Huff formula

    s = sum(sales_floor_area / (o.get("timeToTarget") ** 2.5) for o in people_with_travel_time)
            
    p = [ {"count": o.get("počet"), "probabilityToTarget": (sales_floor_area / (o.get("timeToTarget") ** 2.5)) / s} for o in people_with_travel_time ]

    expected_number_of_consumers = sum(o.get("count") * o.get("probabilityToTarget") for o in p)

    retail_site_locations_with_distance = []

    for location in retail_site_locations:
        geometry: dict = location.get("geometry")
        attributes: dict = location.get("attributes")

        long = geometry.get("x")
        lat = geometry.get("y")

        current_node = ox.distance.nearest_nodes(graph, long, lat)

        try:
            distance_meters = nx.shortest_path_length(graph, dest_node, current_node, weight="length")
        except nx.exception.NetworkXNoPath:
            continue

        retail_site_locations_with_distance.append(distance_meters)

    average_distance_to_competition = mean(retail_site_locations_with_distance)
    
    average_size_of_competition = mean(get_size_of_competition(location) for location in retail_site_locations)

    return {
        **dest_location,
        "potentialMarket": expected_number_of_consumers,
        "averageDistanceToCompetition": average_distance_to_competition,
        "averageSizeOfCompetition": average_size_of_competition
    }

def main():
    try:
        opts, args = getopt.getopt(sys.argv[1:], "h", ["help"])
    except getopt.GetoptError as e:
        error(e)

    for o, a in opts:
        if o in ("-h", "--help"):
            sys.exit()
        else:
            error(f"Unhandled option {o}")

    with sys.stdin as file:
        input = file.read().rstrip()

    try:
        input_dict: dict = json.loads(input)
    except json.decoder.JSONDecodeError as e:
        error(e)

    locations = input_dict.get("locations")

    response = requests.get(RETAIL_RESEARCH_BRNO)
    if response.status_code != 200:
        raise ValueError("RETAIL_RESEARCH_BRNO error")
    
    try:
        retail_site_locations: dict = json.loads(response.text)
    except json.decoder.JSONDecodeError as e:
        error(e)

    response = requests.get(NUMBER_OF_PEOPLE_AT_ADDRESSES)
    if response.status_code != 200:
        raise ValueError("NUMBER_OF_PEOPLE_AT_ADDRESSES error")

    try:
        people_at_addresses: dict = json.loads(response.text)
    except json.decoder.JSONDecodeError as e:
        error(e)

    # TODO this takes a lot of time to load
    graph = ox.graph_from_place("Brno, Czech Republic", network_type="walk")

    # print(1)
    #pos = nx.spring_layout(graph)  # Define a layout for the nodes (e.g., spring_layout)
    #print(2)
    #nx.draw(graph, pos, with_labels=True, node_color='skyblue', node_size=50, font_size=3)
    #print(3)
    #plt.title("Road Network Visualization (Brno, Czech Republic)")
    #plt.savefig("road_network.png")

    result = [ method(graph, location, people_at_addresses, retail_site_locations) for location in locations ]

    print(result)

if __name__ == "__main__":
    main()