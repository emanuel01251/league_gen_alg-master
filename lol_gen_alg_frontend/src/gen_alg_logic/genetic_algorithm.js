import TeamComp from './team_comp.js';
import cloneDeep from 'lodash/cloneDeep';


export default class GeneticAlgorithm {
  constructor(
    population, crossover_rate,
    mutation_rate, enemy_team_comp, champ_info, meta=true
  ){
    this.champ_info = champ_info;
    this.crossover_rate = crossover_rate;
    this.enemy_team_comp = enemy_team_comp;
    this.best_individuals = [];
    this.iteration_data = [];
    this.average_fitness = 0;

    this.population = [];
    for (let i = 0; i < population; i ++) {
      this.population.push(new TeamComp(champ_info, null, mutation_rate, meta));
    }
  }

  crossover() {
    /*
    Apply crossover as per the crossover ratio.
    Crossover will be to swap to champions at a random
    index for two individuals in the population
    */
    for (let i = 0; i < this.population.length; i ++) {
      // Check if we perform crossover
      if (Math.random() <= this.crossover_rate){
        let temp_index = getRandomInt(this.population);
        while(temp_index === i){
          temp_index = getRandomInt(this.population);
        }

        // Temp assignment for givien individual
        let curr_individual = this.population[i];
        let temp_individual = this.population[temp_index];

        // Try crossover
        let valid_crossover = false;
        let tries = 0;

        // Only attempting for the size of the curr_individual champions (should be 5)
        while(!valid_crossover && tries < curr_individual) {
          let champ_index = getRandomInt(5);

          // Check that this swap can be complete for both teams
          let is_on_curr = curr_individual.is_on_team(temp_individual.champions[champ_index].id);
          let is_on_temp = temp_individual.is_on_team(curr_individual.champions[champ_index].id);

          if (!(is_on_curr || is_on_temp)){
            // Then we can swap
            let temp = curr_individual.champions[champ_index];
            curr_individual.champions[champ_index] = temp_individual.champions[champ_index];
            temp_individual.champions[champ_index] = temp;
            valid_crossover = true;
          }
          else {
            tries++;
          }
        }
      }
    }
  }

  mutate(){
    for (let i = 0; i < this.population.length; i++){
      this.population[i].mutate(this.champ_info);
    }
  }

  selection_tournament(){
    // Calculate fitness first
    for (let i = 0; i < this.population.length; i++){
      this.population[i].calculate_fitness(this.enemy_team_comp.champions);
    }

    let new_generation = [];
    // 1v1 Selection after calculating the fitness
    for (let i = 0; i < this.population.length; i++){
      let temp_index = getRandomInt(this.population.length);

      while (temp_index === i) {
        temp_index = getRandomInt(this.population.length);
      }

      if (this.population[i].fitness >= this.population[temp_index].fitness){
        new_generation.push(cloneDeep(this.population[i]));
      }
      else {
        new_generation.push(cloneDeep(this.population[temp_index]));
      }
    }

    this.population = new_generation;
  }

  calculate_best(n_generation){
    // Calculate average fitness
    var avg_fitness = 0
    for (let i = 0; i < this.population.length; i++){
      avg_fitness = avg_fitness + this.population[i].fitness;
    }
    this.average_fitness = avg_fitness/this.population.length;
    this.iteration_data.push({
      generations: n_generation,
      fitness: this.average_fitness
    });
    // Keep list of 10 best individuals.
    this.best_individuals = this.best_individuals.concat(this.population);
    this.best_individuals = this.best_individuals.sort((a,b) => (a.fitness > b.fitness) ? -1 : 1);
    this.best_individuals = this.best_individuals.slice(0,10);
  }

  iterate_population(n_generation){
    this.crossover();
    this.mutate();
    this.selection_tournament();
    this.calculate_best(n_generation);
  }

}

function getRandomInt(max) {
 	return Math.floor(Math.random() * Math.floor(max));
}
