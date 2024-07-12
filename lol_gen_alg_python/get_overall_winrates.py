import json
import math

INPATH = './genetic_algorithm/full_champion_data.json'
OUTPATH = './genetic_algorithm/full_champion_data_full.json'

if __name__ == "__main__":

    with open(INPATH, 'r') as f:
        champion_data = json.loads(f.read())

    for key, champion in champion_data.items():
        games_won = 0
        total_games = 0
        for enemy, win_rate in champion.get("win_rates").items():
            games_won += win_rate.get("games") * win_rate.get("winrate") / 100
            total_games += win_rate.get("games")
        print(champion.get("name"), int(total_games), round(games_won/total_games*100, 2))
        champion_data[key]['total_games'] = total_games
        champion_data[key]['overall_win_rate'] = round(games_won/total_games*100, 2)

    with open(OUTPATH, 'w') as f:
        json.dump(champion_data, f)
