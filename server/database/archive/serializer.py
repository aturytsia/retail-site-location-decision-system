import json
from typing import TypedDict, Optional, TypeVar, Type, Union

CUSTOMERS = "/Users/oleksandr.turytsia/Desktop/bachelor/server/database/archive/customers.geojson"
COMPETITORS = "/Users/oleksandr.turytsia/Desktop/bachelor/server/database/archive/competitors.geojson"

class CustomerProperties(TypedDict):
    agregace: Optional[str]
    cislo_dom: Optional[int]
    cislo_ori_zn: Optional[int]
    mest_cast: Optional[str]
    objectid: Optional[int]
    pocet: Optional[int]
    ulice: Optional[str]

class CustomersGeometry(TypedDict):
    coordinates: tuple[float, float]
    type: str

class CustomersFeature(TypedDict):
    geometry: CustomersGeometry
    properties: CustomerProperties
    type: str

class Customers(TypedDict):
    crs: dict
    name: str
    features: list[CustomersFeature]
    type: str


class CompetitorProperties(TypedDict):
    objectid: Optional[int]
    sortiment: Optional[str]
    zbozi_typ: Optional[str]
    sluzba_typ: Optional[str]
    objekt: Optional[str]
    plocha: Optional[str]
    od_vd: Optional[str]
    do_vd: Optional[str]
    prer1_vd: Optional[str]
    prer2_vd: Optional[str]
    od_so: Optional[str]
    do_so: Optional[str]
    prer1_so: Optional[str]
    prer2_so: Optional[str]
    od_ne: Optional[str]
    do_ne: Optional[str]
    prer1_ne: Optional[str]
    vdotevreno: Optional[int]
    objednani: Optional[str]
    bazar: Optional[str]
    e_shop_vyd: Optional[str]
    automat: Optional[str]
    kod_obec: Optional[int]
    nazev_obec: Optional[str]
    id: Optional[int]
    globalid: Optional[str]


class CompetitorsGeometry(TypedDict):
    coordinates: tuple[float, float]
    type: str


class CompetitorsFeature(TypedDict):
    geometry: CompetitorsGeometry
    properties: CompetitorProperties
    type: str
    
class Competitors(TypedDict):
    crs: dict
    name: str
    features: list[CompetitorsFeature]
    type: str


T = TypeVar('T')


def read_json_file(path_to_file: str, cls: Type[T]) -> T:
    try:
        with open(path_to_file, "r", encoding="utf-8") as file:
            return cls(**json.load(file))
    except FileNotFoundError as e:
        print(e)
        exit(1)
        
def write_json_file(path_to_file: str, data: dict | list) -> None:
    try:
        with open(path_to_file, "w", encoding="utf-8") as file:
            json.dump(data, file)
    except Exception as e:
        exit(1)

def serialize_customers():
    customers = read_json_file(CUSTOMERS, Customers)
    
    features = []
    for feature in customers.get("features"):
        count = feature.get("properties").get("pocet")
        lng = feature.get("geometry").get("coordinates")[0]
        lat = feature.get("geometry").get("coordinates")[1]
        features.append((lat, lng, count))
        
    write_json_file("customers-formatted.json", features)
    

def serialize_competitors():
    competitors = read_json_file(COMPETITORS, Competitors)
    
    area_format = {
        "do 50": 25,
        "51 - 200": 100,
        "201 - 400": 300,
        "401 - 1 000": 700,
        "1 001 - 3 000": 2000
    }
    print(1)
    features = []
    for feature in competitors.get("features"):
        area = feature.get("properties").get("plocha")
        feature_type = feature.get("properties").get("zbozi_typ")
        
        if feature_type != "POTR - alkoholické nápoje":
            continue
        if area not in area_format:
            continue
        
        lng = feature.get("geometry").get("coordinates")[0]
        lat = feature.get("geometry").get("coordinates")[1]
        features.append((lat, lng, area_format[area]))
    write_json_file("alcohol.json", features)
    
    
def main() -> None:
    serialize_customers()
    serialize_competitors()

if __name__ == "__main__":
    main()