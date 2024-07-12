import json
import requests
from requests.exceptions import HTTPError


def get_champion_details(path):
    with open(path, 'rb') as f:
        data = {}
        all_data = json.load(f)['data']
        for key, value in all_data.items():
            data.update({value['key']: {'name': key}})
        return data


def get_champion_winrates(id):
    patch = "10.3"
    tier = "gold"
    base_url = f"https://noxus.gg/api/champion-stats/v1/NA/{patch}/{tier}/by-id/{id}/all"
    try:
        response = requests.get(base_url)
        response.raise_for_status()
        return response.json()
    except HTTPError as e:
        print(f"Error on Champion id: {id}: {str(e)}")
    return None


if __name__ == "__main__":
    champion_information = get_champion_details('data/champion_data.json')
    for key, value in champion_information.items():
        data = get_champion_winrates(key)
        win_rates = data['stats']['matchups']['all']
        value['win_rates'] = win_rates
    with open("genetic_algorithm/full_champion_data.json", "w") as f:
        json.dump(champion_information, f)
