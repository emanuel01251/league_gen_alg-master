import json
import operator as op

from math import floor
from itertools import combinations
from tqdm import tqdm
from functools import reduce


class Bins:
    def __init__(self, high, low, iterator):
        self.high = high
        self.low = low
        self.iterator = iterator
        self.bins = [0 for i in range(int((high-low)/iterator))]

    def add_to_bin(self, winrate: float):
        diff = winrate - self.low
        bin_index = floor(diff/self.iterator)
        self.bins[bin_index] += 1

    def output_winrates(self, path):
        """
        Outputs the winrate buckets as json to the path
        """
        data = []
        for i, bin in enumerate(self.bins):
            winrate = round(i * self.iterator + self.low, 2)
            data.append({
                'winrate': winrate,
                'total': bin
            })
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)


def get_champion_information(path):
    data = {}
    champ_list = []
    with open(path, 'rb') as f:
        data = json.load(f)
    for key, value in data.items():
        value['key'] = key
        champ_list.append(value)
    return champ_list


def ncr(n, r):
    # https://stackoverflow.com/questions/4941753/is-there-a-math-ncr-function-in-python
    # in python 3.8, this can be replaced with math.comb(n,r)
    r = min(r, n-r)
    numerator = reduce(op.mul, range(n, n-r, -1), 1)
    denominator = reduce(op.mul, range(1, r+1), 1)
    return numerator / denominator


if __name__ == "__main__":
    # init vars
    team_size = 5
    high_wr = 60
    low_wr = 40
    iterator = .1
    outfile = './data/winrate_data.json'
    winrate_bins = Bins(high_wr, low_wr, iterator)
    champ_info = get_champion_information("genetic_algorithm/full_champion_data.json")

    # grab out winrates
    winrates = [x['overall_win_rate'] for x in champ_info]
    all_winrates = combinations(winrates, team_size)

    # get size
    size = ncr(len(winrates), team_size)
    p_bar = tqdm(total=size)

    # bin the winrates
    for combination in all_winrates:
        avg_winrate = 0
        for wr in combination:
            avg_winrate += wr
        avg_winrate = avg_winrate/team_size
        winrate_bins.add_to_bin(avg_winrate)
        p_bar.update(1)

    # cleanup
    p_bar.close()
    print(winrate_bins.bins)

    # output bins
    winrate_bins.output_winrates(outfile)
