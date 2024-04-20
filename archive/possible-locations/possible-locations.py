#!/usr/bin/env python

BLUE = "#DAE8F6"
DARK_BLUE = "#6D8EBF"

__author__ = "Oleksandr Turytsia"
__copyright__ = ""
__license__ = ""
__version__ = "0.0.1"
__maintainer__ = "Oleksandr Turytsia"
__email__ = "xturyt00@stud.fit.vutbr.cz"
__status__ = "Development"

RETAIL_RESEARCH_BRNO = "https://gis.brno.cz/ags1/rest/services/Hosted/KAM_Pruzkum_Maloobchodu_2021/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json"
NUMBER_OF_PEOPLE_AT_ADDRESSES = "https://services6.arcgis.com/fUWVlHWZNxUvTUh8/arcgis/rest/services/adresni_body_pocet_obyvatel/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json"

import sys
import getopt
import requests
import json
import networkx as nx

def error(m: str) -> None:
    """Exits program with error code 1 and error message m

    Args:
        m (str): Error message
    """
    print(f"Error: {m}", file=sys.stderr)
    exit(1)

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

    

if __name__ == "__main__":
    main()