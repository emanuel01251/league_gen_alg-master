import math
import logging
logger = logging.getLogger()


class Champion:
    def __init__(self, id, name, matchups):
        self.id = id
        self.name = name
        self.matchups = matchups

    def check_winrate(self, id_to_check):
        """
        Given a champion ID and the current champions matchups,
        get back their win rate against the given champion.
        If there is no data for this champion return None
        :param id_to_check: ID to check as a string
        :return: Win rate as a float or None
        """
        z = 1.96
        champion = self.matchups.get(id_to_check)
        if champion:
            p_initial = champion.get("winrate")/100
            champion_score = p_initial - z * math.sqrt((p_initial*(1-p_initial))/champion.get("games"))
            return champion_score
        else:
            return None