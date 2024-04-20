__author__ = "Oleksandr Turytsia"
__maintainer__ = "Oleksandr Turytsia"
__email__ = "xturyt00@stud.fit.vutbr.cz"

from fastapi.testclient import TestClient
from main import app
import json
import pytest
import os

from pytest import (
    approx
)

from utils import (
    get_coordinates,
    get_squares_list,
    read_dataset
)

from scripts.ahp import (
    ahp_evaluate
)

from scripts.geocompetition import (
    get_geocompetition
)

from settings import (
    read_config,
    Urls
)

from main import (
    FinalBody
)

GEOCOMPETITION_TEST_PATH = "./tests/test.csv"
CONFIG_PATH = "./tests/init.yaml"

config = read_config(CONFIG_PATH)

client = TestClient(app)

def test_endpoint(monkeypatch: pytest.MonkeyPatch):
    
    monkeypatch.setenv("TESTING", "True")
    
    expected = { "message": True }

    response = client.get(Urls.Test.value)
    assert response.status_code == 200
    assert response.json() == json.loads(json.dumps(expected))

def test_get_config(monkeypatch):
    
    monkeypatch.setenv("TESTING", "True")
    
    datasets = config.competitors.keys()

    expect = {
        "center": get_coordinates(config.area),
        "datasets": list(datasets),
        "grid": get_squares_list()
    }

    response = client.get(Urls.Config.value)
    assert response.status_code == 200
    assert response.json() == json.loads(json.dumps(expect))

def test_get_customers(monkeypatch):
    
    monkeypatch.setenv("TESTING", "True")
    
    customers = read_dataset(config.customers, True)
    
    expect = { "customers": customers }

    response = client.get(Urls.Customers.value)
    assert response.status_code == 200
    assert response.json() == json.loads(json.dumps(expect))

def test_get_competitors(monkeypatch):
    
    monkeypatch.setenv("TESTING", "True")

    body = {
        "dataset": "test"
    }

    competitor = config.competitors["test"]

    competitors = read_dataset(competitor.path, True)
    
    expect = { "competitors": competitors }

    response = client.post(Urls.Competitors.value, json=body)
    assert response.status_code == 200
    assert response.json() == json.loads(json.dumps(expect))

def test_get_competitors_error(monkeypatch):
    
    monkeypatch.setenv("TESTING", "True")

    body = {
        "dataset": "error"
    }
    
    expect = { "competitors": {} }

    response = client.post(Urls.Competitors.value, json=body)
    assert response.status_code == 200
    assert response.json() == json.loads(json.dumps(expect))

def test_area(monkeypatch):
    
    monkeypatch.setenv("TESTING", "True")

    body = {
        "dataset": "test"
    }

    competitor = config.competitors["test"]

    customers = read_dataset(config.customers, True)
    competitors = read_dataset(competitor.path, True)
    

    response = client.post(Urls.Area.value, json=body)
    expected_area = get_geocompetition(customers, competitors, GEOCOMPETITION_TEST_PATH, False, competitor.distanceDecay) 

    assert response.status_code == 200
    for response_coord, expected_coord in zip(response.json()["area"], expected_area):
        assert response_coord == approx(expected_coord)

def test_area_cached(monkeypatch):
    
    monkeypatch.setenv("TESTING", "True")

    body = {
        "dataset": "test"
    }

    competitor = config.competitors["test"]

    customers = read_dataset(config.customers, True)
    competitors = read_dataset(competitor.path, True)
    
    expect = { "area": get_geocompetition(customers, competitors, GEOCOMPETITION_TEST_PATH, True, competitor.distanceDecay) }

    file_path = os.path.abspath(GEOCOMPETITION_TEST_PATH)

    response = client.post(Urls.Area.value, json=body)
    assert response.status_code == 200
    assert response.json() == json.loads(json.dumps(expect))

    if os.path.exists(file_path):
        os.remove(file_path)

def test_result(monkeypatch):
    
    monkeypatch.setenv("TESTING", "True")

    body_mock = {
        "locations": [
            {
                "name": "Place 1",
                "attributes": {
                    "key1": 0.045,
                    "key2": 0.034,
                    "key3": 0.055
                }
            },
            {
                "name": "Place 2",
                "attributes": {
                    "key1": 0.012,
                    "key2": 0.003,
                    "key3": 0.005
                }
            }
        ],
        "score": {
            "key1": {
                "key2": 6,
                "key3": 4
            },
            "key2": {
                "key3": 7
            }
        }
    }

    body = FinalBody(**body_mock)

    consistency_ratio, weights = ahp_evaluate(body.score, body.locations)
    expect = {"results": weights, "consistencyRatio": consistency_ratio}

    response = client.post(Urls.Result.value, json=body_mock)

    assert response.status_code == 200
    assert response.json() == json.loads(json.dumps(expect))