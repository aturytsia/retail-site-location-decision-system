#!/usr/bin/env python

__author__ = "Oleksandr Turytsia"
__copyright__ = ""
__license__ = ""
__version__ = "0.0.1"
__maintainer__ = "Oleksandr Turytsia"
__email__ = "xturyt00@stud.fit.vutbr.cz"
__status__ = "Development"

import ahpy
import json
import sys
import getopt
from typing import Dict, Tuple

CONSISTENCY_RATIO = 0.1

def error(m: str) -> None:
    """Exits program with error code 1 and error message m

    Args:
        m (str): Error message
    """
    print(f"Error: {m}", file=sys.stderr)
    exit(1)


def get_comparisons(score: Dict[str, Dict[str, str]]) -> dict[tuple[str, str], str]:
    """Generates necessary dict with all comparisons 
    out of scores from the file.

    Args:
        score (Dict[str, Dict[str, str]]): Scores

    Returns:
        dict[tuple[str, str], str]: Dict with all comparisons
    """
    return { (k1,k2): s for k1, c in score.items() for k2, s in c.items() }

def get_weighted_evaluation(weights: Dict[str, int], data: Dict[str, Dict[str, int]]):
    return { location["name"]: sum(location[k] * v for k, v in weights.items()) for location in data }

def main():

    try:
        opts, args = getopt.getopt(sys.argv[1:], "hf:i:", ["help", "file="])
    except getopt.GetoptError as e:
        error(e)

    scoreFile = None
    file_input = None

    for o, a in opts:
        if o in ("-f", "--file"):
            scoreFile = a
        elif o in ("-i"):
            file_input = a
        elif o in ("-h", "--help"):
            sys.exit()
        else:
            error(f"Unhandled option {o}")
    
    try:
        with open(scoreFile, "r") as file:
            scoreInput = file.read().rstrip()
    except FileNotFoundError as e:
        error(e)
        
    try:
        with open(file_input, "r") as file:
            jsonInput = file.read().rstrip()
    except FileNotFoundError as e:
        error(e)

    try:
        data: dict = json.loads(jsonInput)
        score: dict = json.loads(scoreInput)
    except json.decoder.JSONDecodeError as e:
        error(e)

    comparisons = get_comparisons(score)
    print(comparisons)

    ahp_locations = ahpy.Compare(name='Locations', comparisons=comparisons, precision=3, random_index='saaty')

    if ahp_locations.consistency_ratio > CONSISTENCY_RATIO:
        error(f"Enstimation untrustworthy (Consistency ratio exceeded {CONSISTENCY_RATIO * 100}%)")
    
    weights = ahp_locations.target_weights

    print(weights)

    results = get_weighted_evaluation(weights, data)

    print(results)

if __name__ == "__main__":
    main()
