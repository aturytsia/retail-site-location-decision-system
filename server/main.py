from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os

from scripts.ahp import (
    ahp_evaluate
)

from scripts.geocompetition import (
    estimate_geocompetition,
    get_geocompetition
)

from settings import (
    read_config,
    CONFIG,
    Config,
    Urls
)

from utils import (
    read_dataset,
    get_coordinates,
    get_squares_list
)

origins = [
    "http://localhost:3000",
]
    

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

def get_config() -> tuple[Config, bool]:
    
    is_testing = os.getenv("TESTING") == "True"

    config = read_config("./tests/init.yaml") if is_testing else CONFIG

    estimate_geocompetition(config, is_testing)

    return config, is_testing

class Location(BaseModel):
    name: str
    attributes: dict[str, float]

class DatasetRequired(BaseModel):
    dataset: str

class FinalBody(BaseModel):
    locations: list[Location]
    score: dict[str, dict[str, int]]

@app.get(Urls.Test.value, tags=["Test"])
def test():
    """
    Test endpoint to check if the application is in test mode.

    Returns:
    - message: Whether the application is in test mode or not.
    """
    _, is_testing = get_config()
    return { "message": is_testing }

@app.get(Urls.Config.value, tags=["Configuration"])
async def map():
    """
    Get the configuration details including datasets, center coordinates, and grid squares.

    Returns:
    - center: Center coordinates of the area.
    - datasets: List of available datasets.
    - grid: List of grid squares covering the area.
    """
    config, _ = get_config()
    return {
        "center": get_coordinates(config.area),
        "datasets": list(config.competitors.keys()),
        "grid": get_squares_list()
    }

@app.get(Urls.Customers.value, tags=["Customers"])
def customers():
    """
    Get the customer data.

    Returns:
    - customers: List of customer data.
    """
    config, is_testing = get_config()
    customers = read_dataset(config.customers, is_testing)
    return { "customers": customers }

@app.post(Urls.Competitors.value, tags=["Competitors"])
def competitors(body: DatasetRequired):
    """
    Get the competitor data for a given dataset.

    Args:
    - dataset: Name of the dataset.

    Returns:
    - competitors: List of competitor data for the specified dataset.
    """
    config, is_testing = get_config()
    competitor = config.competitors.get(body.dataset, None)
    if competitor is None:
        return {"competitors": {} }
    competitors = read_dataset(competitor.path, is_testing)
    return { "competitors": competitors }

@app.post(Urls.Area.value, tags=["Area"])
def area(body: DatasetRequired):
    """
    Get the geographical competition area for a given dataset.

    Args:
    - dataset: Name of the dataset.

    Returns:
    - area: Geographical competition area for the specified dataset.
    """
    config, is_testing = get_config()
    competitor = config.competitors.get(body.dataset, None)
    if competitor is None:
        return {"area": {} }
    customers = read_dataset(config.customers, is_testing)
    competitors = read_dataset(competitor.path, is_testing)
    area = get_geocompetition(customers, competitors, f"./{'tests' if is_testing else 'data'}/{body.dataset}.json", True, competitor.distanceDecay)
    return {"area": area}

@app.post(Urls.Result.value, tags=["Result"])
def final_locations(body: FinalBody):
    """
    Evaluate the final locations based on given scores.

    Args:
    - locations: List of locations with their attributes.
    - score: Pairwise comparison scores.

    Returns:
    - results: Weighted evaluation of the locations.
    - consistencyRatio: Consistency ratio of the evaluation process.
    """
    consistency_ratio, weights = ahp_evaluate(body.score, body.locations)
    return {"results": weights, "consistencyRatio": consistency_ratio}
