import Champion from './champion.js';

export default class TeamComp {

  constructor(champ_info, champions = null, mutation_rate = 0.9, meta=false) {

    if (champions) {
      this.champions = champions;
    } else {
      this.champions = TeamComp.generate_team_comp(champ_info, meta);
    }
		this.meta = meta
    this.fitness = -1;
    this.mutation_rate = mutation_rate;
  }

  mutate(available_champs) {
    if (Math.random() <= this.mutation_rate) {
			// get random champion on team
      let index = getRandomInt(5);
      let current_ids = [];
      this.champions.forEach(function(champ, i) {
        current_ids.push(champ.id);
      })

			// meta checker
			let temp_index = -1;
			if (this.meta){
				temp_index = index;
			}

			// get new champion
      let new_champion = TeamComp.make_new_champion(
        available_champs, current_ids, temp_index)
      this.champions[index] = new_champion;
    }
  }

  calculate_fitness(enemy_team_comp) {
    /*
    For all champions on your team, check their winrates
    against the given enemy team's champions. Take average of all
    available win rates (some might not have information)
    multiply that by the log base 10 of all with information.
    This will make teams with more information have a better fitness.
		*/
    var avg_winrate = 0;
    var total_calculated = 0;
    this.champions.forEach(function(your_champion) {
      enemy_team_comp.forEach(function(enemy_champion) {
        let win_rate = your_champion.check_winrate(enemy_champion.id);
        //win_rate is the confidence score
        if (win_rate) {
          avg_winrate += win_rate;
          total_calculated++;
        }
      })
    })
    //fitness function
    let fitness = avg_winrate / total_calculated * Math.log10(total_calculated);
    this.fitness = fitness;
  }

  is_on_team(champion_id) {
    /*
    Given a champion_id, check if it is on current team
		*/
    this.champions.forEach(function(item, index) {
      if (champion_id === item.id) {
        return true;
      }
    })
    return false;
  }

  static generate_team_comp(champ_info, meta=false) {
    /*
    Given all matchup information. Create a random team comp
		*/
    let champions = [];
    let ids_chosen = [];
    for (let i = 0; i < 5; i++) {
			let temp_index = -1;
			if (meta){
				temp_index = i;
			}
      let new_champion = TeamComp.make_new_champion(champ_info, ids_chosen, temp_index);
      champions.push(new_champion);
      ids_chosen.push(new_champion.id);
    }
    return champions;
  }

  static make_new_champion(champ_info, current_ids, index=-1) {
    /*
    Make a new RANDOM champion
		*/
    var champion_id = get_random_key(champ_info);
    // Get a unique champion not in current team_comp
		if (index === -1) {
			while (current_ids.includes(champion_id) && current_ids.length > 0) {
				champion_id = get_random_key(champ_info);
			}
		}
		else {
			while ((current_ids.includes(champion_id) && current_ids.length) > 0 ||
			 !(valid_role(champ_info, champion_id, index))) {
				 champion_id = get_random_key(champ_info);
			 }
		}
    let champion_details = champ_info[champion_id];
    return new Champion(
      champion_id, champion_details.name,
      champion_details.win_rates,
      champion_details.overall_win_rate,
      champion_details.total_games
    )

  }
}

function get_random_key(dict) {
  var keys = Object.keys(dict);
  return keys[keys.length * Math.random() << 0];
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function valid_role(champion_details, champion_id, role_index) {
  let role_dict = {
    0: "top",
    1: "jungle",
    2: "mid",
    3: "adc",
    4: "support"
  };
	let role_name = role_dict[role_index];
	let roles = champion_details[champion_id].roles;
	if (roles.includes(role_name)) {
		return true;
	}
	else {
		return false;
	}
}
