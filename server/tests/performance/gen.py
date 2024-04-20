import pandas as pd
import random
import json

def generate_data(num_points):
    data = []
    for _ in range(num_points):
        latitude = round(random.uniform(49.1235281, 49.29019476666661), 6)  # Random latitude between -90 and 90
        longitude = round(random.uniform(16.4492823, 16.718629275134628), 6)  # Random longitude between -180 and 180
        random_value = round(random.uniform(0, 99), 2)  # Random value between 0 and 99
        data.append((latitude, longitude, random_value))
    return data

def save_to_json(data, filename):
    with open(filename, 'w') as json_file:
        json.dump(data, json_file, indent=4)

def main():
    save_to_json(generate_data(10), "10-entries.json")
    save_to_json(generate_data(100), "100-entries.json")
    save_to_json(generate_data(1000), "1000-entries.json")
    # save_to_json(generate_data(10000), "10000-entries.json")


if __name__ == "__main__":
    main()