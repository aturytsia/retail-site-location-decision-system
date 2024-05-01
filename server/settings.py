__author__ = "Oleksandr Turytsia"
__maintainer__ = "Oleksandr Turytsia"
__email__ = "xturyt00@stud.fit.vutbr.cz"

import yaml
from pydantic import BaseModel
import osmnx as ox
import networkx as nx
from enum import Enum

class Urls(Enum):
    Test = "/test"
    Config = "/config"
    Customers = "/customers"
    Competitors = "/competitors"
    Area = "/area"
    Result = "/result"

class CompetitorsConfig(BaseModel):
    path: str
    distanceDecay: float

class Config(BaseModel):
    area: str
    customers: str
    competitors: dict[str, CompetitorsConfig]

def read_config(path: str = 'init.yaml') -> Config:
    # Read and process your custom YAML file
    try:
        with open(path, 'r', encoding='utf-8') as yaml_file:
            config = yaml.safe_load(yaml_file)
    except FileNotFoundError as e:
        exit(1)
    return Config(**config)

CONFIG: Config = read_config()

GRAPH: nx.MultiDiGraph = ox.graph_from_place(CONFIG.area, network_type="drive")
