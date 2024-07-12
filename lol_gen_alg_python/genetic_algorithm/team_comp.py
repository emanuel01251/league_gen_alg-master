import random
import logging
import math
from genetic_algorithm.champion import Champion
logger = logging.getLogger()


class TeamComp:
    def __init__(self, champion_information: dict, champions: [Champion], meta=True,
                 mutation_rate=0.9):
        """
        Create a new team comp. Champions either supplied or list of avilable
        champions is provided
        :param champion_information: information for available champions
        :param champions: Given champion list for the team Comp
        :param mutation_rate: rate to mutate. 9% by default
        """
        if champions:
            self.champions = champions
        else:
            self.champions = TeamComp.generate_team_comp(champion_information, meta)
        self.meta = meta
        self.fitness = -1
        self.mutation_rate = mutation_rate

    def mutate(self, available_champions: dict, individual=-1):
        """
        We mutate one of the champions. This means replacing a current champion.
        The list of available champions is all champions minus base team comp
        and this current team comp If our mutation rate is .9,
        and the random is less or equal then we mutate, thus simulating a
        90% mutation rate.
        :return:
        """
        if random.uniform(0, 1) <= self.mutation_rate:

            # Then we mutate one of the champions!
            index = random.randint(0, 4)
            current_champion_ids = [x.id for x in self.champions]
            temp_index = index if self.meta else -1
            new_champion = TeamComp.make_new_champion(
                available_champions, current_champion_ids, index=temp_index)

            logger.debug(f"Replacing individual {individual}'s "
                         f"{self.champions[index].name} with {new_champion.name}")
            self.champions[index] = new_champion

    def calculate_fitness(self, base_team_composition: [Champion]):
        avg_winrate = 0
        total_calculated = 0

        for your_champion in self.champions:
            for enemy_champion in base_team_composition:
                win_rate = your_champion.check_winrate(enemy_champion.id)
                if win_rate:
                    avg_winrate += win_rate
                    total_calculated += 1

        avg_winrate = avg_winrate/total_calculated
        # Log base 10 calculation supports teams with more available winrates
        fitness = avg_winrate * math.log(total_calculated, 10)
        self.fitness = fitness

    def is_on_team(self, champion_id) -> bool:
        """
        Given a champion_id, check if it is on current team
        :param champion_id: ID to check for
        :return: true if on team, else false
        """
        for champion in self.champions:
            if champion.id == champion_id:
                return True
        return False

    @staticmethod
    def generate_team_comp(champion_details: dict, meta=False) -> [Champion]:
        """
        Given all matchup information. Create a random team comp
        :param champion_details: Dict containing all matchup information for all champions
        :param meta: flag if we should create meta team comp. false by default
        :return: list of Champions
        """
        champions = []
        ids_chosen = []
        for i in range(5):
            temp_index = i if meta else -1
            new_champion = TeamComp.make_new_champion(champion_details, ids_chosen, index=temp_index)
            champions.append(new_champion)
            ids_chosen.append(new_champion.id)
        return champions

    @staticmethod
    def make_new_champion(champion_details: dict, current_ids: list, index=-1) -> Champion:
        """
        Make a new RANDOM champion
        :param current_ids: Current IDs
        :param champion_details: Dict containing all mactchup information for all champions
        :param index: Optional param when making meta team comp. random champion must have
        that associated role
        :return: A new champion
        """
        # Make sure champion selected isn't in the list of current champions
        champion_id = random.choice(list(champion_details))
        if index == -1:
            while champion_id in current_ids and len(current_ids) > 0:
                champion_id = random.choice(list(champion_details))
        else:
            while champion_id in current_ids and len(current_ids) > 0 or \
                    not _valid_role(champion_details, champion_id, index):
                champion_id = random.choice(list(champion_details))
        champion_details = champion_details.get(champion_id)
        return Champion(
            champion_id, champion_details.get("name"),
            champion_details.get("win_rates"),
        )


def _valid_role(champion_details: dict, champion_id, role_index):
    """
    :param champion_details: Dict containing all mactchup information for all champions
    :param champion_id: ID of champion we are checking
    :param role_index: maps to meta roles in league
    0: top
    1: jungle
    2: mid
    3: adc
    4: support
    returns true if the champion has that role, else false
    """
    role_dict = {
        0: "top",
        1: "jungle",
        2: "mid",
        3: "adc",
        4: "support"
    }
    role_name = role_dict[role_index]
    champion_details = champion_details.get(champion_id)
    champion_roles = champion_details['roles']
    return True if role_name in champion_roles else False

