import json
import copy

import matplotlib.pyplot as plt

from tqdm import tqdm
from genetic_algorithm import logger
from genetic_algorithm.champion import Champion
from genetic_algorithm.team_comp import TeamComp
from genetic_algorithm.genetic_algorithm import GeneticAlgorithm

"""
PUT ENEMY CHAMPION IDS(KEYS) HERE. FOR A DETAILED LIST LOOK AT CHAMPION_DATA.JSON
"""
ENEMY_TEAM = [ "266", "103", "84", "12", "63" ]

# Change these as you wish :)
POPULATION = 100
CROSSOVER_RATE = 0.40
MUTATION_RATE = 0.80
NUM_GENERATIONS = 100
META = True


def get_champion_information(path):
    with open(path, 'rb') as f:
        return json.load(f)


def filter_champion_information(
        champion_ids: list, champion_information: dict):
    """
    Given a list of champion ids, remove those from the
    champion information dict. This makes sure the Gen Alg
    cant pick champions from the enemy team comp
    :param champion_ids: List of champions from enemy team
    :param champion_information: All champion information
    :return: champion information without enemy champions
    """
    filtered_info = copy.deepcopy(champion_information)
    for champion_id in champion_ids:
        filtered_info.pop(champion_id, None)
    # Only get winrate information for the enemy champions
    for champion_id, all_info in filtered_info.items():
        win_rates = all_info.get("win_rates")
        filtered_winrates = {}
        for enemy_champion in champion_ids:
            enemy_winrate = win_rates.get(enemy_champion)
            if enemy_winrate:
                filtered_winrates[enemy_champion] = enemy_winrate
        all_info['win_rates'] = filtered_winrates

    return filtered_info


def create_enemy_team_comp(champion_ids: list, champion_information: dict):
    """
    Given a list of champion_ids, let me the base enemy team comp
    :param champion_ids:
    :param champion_information:
    :return:
    """
    champions = []
    for champion_id in champion_ids:
        # Create a new champion, get their info from dict
        champion_details = champion_information.get(champion_id)
        champions.append(Champion(
            champion_id, champion_details.get("name"),
            champion_details.get("win_rates")
        ))
    return TeamComp(champion_information, champions=champions)


def run_gen_alg(gen_alg: GeneticAlgorithm, generations: int):
    for gen in tqdm(range(generations)):
        gen_alg.iterate_population()


if __name__ == "__main__":

    log_file = "./logs/gen_alg.log"
    logger.create_rotating_log(log_file)
    log = logger.logger
    log.info("----- Starting Genetic Algorithm -----")

    champ_info = get_champion_information("genetic_algorithm/full_champion_data.json")
    enemy_team = create_enemy_team_comp(ENEMY_TEAM, champ_info)
    filtered_champ_info = filter_champion_information(ENEMY_TEAM, champ_info)
    genetic_algorithm = GeneticAlgorithm(
        population=POPULATION,
        crossover_rate=CROSSOVER_RATE,
        mutation_rate=MUTATION_RATE,
        base_team_composition=enemy_team,
        champion_information=filtered_champ_info,
        meta=META
    )
    run_gen_alg(genetic_algorithm, NUM_GENERATIONS)

    print("enemy team")
    for champion in enemy_team.champions:
        print(f"{champion.id}: {champion.name}")
        print("----------------------------------------")

    print("\nyour team")
    for champion in genetic_algorithm.best_individuals[0].champions:
        print(champion.name)
        print(champion.matchups)
        print("----------------------------------------")

    plt.plot(range(NUM_GENERATIONS), genetic_algorithm.average_fitness, marker='', color='black', linewidth=2)
    plt.title(f"Population: {POPULATION} Crossover: {CROSSOVER_RATE} Mutation: {MUTATION_RATE}")
    plt.ylabel("Average Fitness")
    plt.xlabel("Generation")
    plt.show(block=True)
