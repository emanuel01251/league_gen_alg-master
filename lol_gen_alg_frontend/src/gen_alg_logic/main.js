import Champion from './champion.js';
import TeamComp from './team_comp.js';
import GeneticAlgorithm from './genetic_algorithm.js';
import cloneDeep from 'lodash/cloneDeep';

let champion_information = require('../data/full_champion_data.json'); //with path


function filter_champion_information(champion_ids, champ_info) {
  /*
  Given a list of champion ids, remove those from the
  champion information dict. This makes sure the Gen Alg
  cant pick champions from the enemy team comp
  :param champion_ids: List of champions from enemy team
  :param champion_information: All champion information
  :return: champion information without enemy champions
  */

  // Remove unavailable champions
  let filtered_info = cloneDeep(champion_information);
  champion_ids.forEach(function(id, index){
    delete filtered_info[id];
  });

  // Only get winrates information for the enemy team
  for (var key in filtered_info) {
    let win_rates = filtered_info[key].win_rates;
    let filtered_winrates = {}
    champion_ids.forEach(function(id, index){
      let enemy_winrate = win_rates[id];
      if (enemy_winrate !== undefined) {
        filtered_winrates[id] = enemy_winrate;
      }
    });
    filtered_info[key].win_rates = filtered_winrates;
  }
  return filtered_info;
}

function create_enemy_team_comp(champion_ids, champ_info){
  // Given a list of champion_ids, let me the base enemy team comp
  let champions = []
  champion_ids.forEach(function(id, index){
    let champion_details = champ_info[id];
    champions.push(new Champion(
      id, champion_details.name,
      champion_details.win_rates,
      champion_details.overall_win_rate,
      champion_details.total_games));
  });
  return new TeamComp(champ_info, champions);
}

function run_gen_alg(gen_alg, generations){
  for (let i = 0; i < generations; i++){
    gen_alg.iterate_population()
  }
}

export function full_gen_alg(enemy_ids, params){
  console.log(enemy_ids)
  let enemy_team = create_enemy_team_comp(enemy_ids, champion_information);
  let filtered_champ_info = filter_champion_information(enemy_ids, champion_information);
  let gen_alg = new GeneticAlgorithm(params.population, params.crossover_rate, params.mutation_rate, enemy_team, filtered_champ_info, params.meta);
  run_gen_alg(gen_alg, params.generations);


  return {
    champions: gen_alg.best_individuals[0].champions,
    fitness: gen_alg.best_individuals[0].fitness,
    
    graph_average_fitness: gen_alg.average_fitness,
    graph_num_generations: params.generations,
  }}
