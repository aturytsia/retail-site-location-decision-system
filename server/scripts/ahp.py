__author__ = "Oleksandr Turytsia"
__maintainer__ = "Oleksandr Turytsia"
__email__ = "xturyt00@stud.fit.vutbr.cz"

import ahpy

def get_comparisons(scores: dict[str, dict[str, int]]) -> dict[tuple[str, str], int]:
    """Generates necessary dict with all comparisons 
    out of scores from the file.

    Args:
        score (Dict[str, Dict[str, str]]): Scores

    Returns:
        dict[tuple[str, str], str]: Dict with all comparisons
    """
    return {(current_key, other_key): score for current_key, comparisons in scores.items() for other_key, score in comparisons.items()}


def get_weighted_evaluation(weights: dict[str, int], locations: list[dict[str, int]]) -> dict[int, str]:
    """
    Get the weighted evaluation of locations.

    This function calculates the weighted evaluation of a list of locations 
    based on the provided weights. Each location is represented by a dictionary 
    containing attributes and their corresponding values. The function returns 
    a dictionary where each location name is mapped to its weighted evaluation.

    Args:
        weights (dict[str, int]): A dictionary containing attribute names as keys 
            and their corresponding weights as values.
        locations (list[dict[str, int]]): A list of dictionaries representing locations. 
            Each dictionary contains attribute names as keys and their corresponding 
            values for the location.

    Returns:
        dict[int, str]: A dictionary where each location name is mapped to its 
            weighted evaluation.

    Example:
        >>> weights = {"price": 2, "rating": 1}
        >>> locations = [{"name": "Location1", "price": 10, "rating": 4}, 
                         {"name": "Location2", "price": 15, "rating": 3}]
        >>> get_weighted_evaluation(weights, locations)
        {"Location1": "18.000", "Location2": "21.000"}
    """
    return {location.name: "{:.3f}".format(sum(location.attributes[k] * v for k, v in weights.items())) for location in locations}

def ahp_evaluate(scores: dict[str, dict[str, int]], locations: list[dict[str, int]]) -> tuple[float, dict]:
    """
    Evaluate locations using the Analytic Hierarchy Process (AHP).

    This function evaluates locations based on pairwise comparisons of criteria 
    provided in the scores dictionary. It then calculates the weights of the 
    locations using the AHP method and returns the consistency ratio along with 
    the weighted evaluation of the locations.

    Args:
        scores (dict[str, dict[str, int]]): A dictionary containing pairwise 
            comparison scores for each criterion.
        locations (list[dict[str, int]]): A list of dictionaries representing 
            locations. Each dictionary contains attribute names as keys and 
            their corresponding values for the location.

    Returns:
        tuple[float, dict]: A tuple containing the consistency ratio and the 
            weighted evaluation of the locations.

    Example:
        >>> scores = {
                "price": {"price": 1, "rating": 3},
                "rating": {"price": 1/3, "rating": 1}
            }
        >>> locations = [{"name": "Location1", "price": 10, "rating": 4}, 
                         {"name": "Location2", "price": 15, "rating": 3}]
        >>> ahp_evaluate(scores, locations)
        {"Location1": "0.488", "Location2": "0.512"}
    """
    comparisons = get_comparisons(scores)

    ahp_locations = ahpy.Compare(
        name='Locations', comparisons=comparisons, precision=3, random_index='saaty')

    weights: dict[str, int] = ahp_locations.target_weights or {}

    consistency_ratio: float = ahp_locations.consistency_ratio if ahp_locations.consistency_ratio else 0
    
    return consistency_ratio, get_weighted_evaluation(weights, locations)
