from genetic_algorithm.team_comp import TeamComp
import random
import logging
import copy

logger = logging.getLogger()


class GeneticAlgorithm:
    def __init__(self, population, crossover_rate, mutation_rate,
                 base_team_composition: TeamComp, champion_information: dict, meta=True):
        """
        Genetic Algorithm to calculate best team composition to counter given team
        :param population: Size of Population
        :param crossover_rate: Crossover Rate
        :param mutation_rate: Mutation Rate
        :param base_team_composition: Team Composition we are optimizing against
        :param champion_information: Available champion_information
        :param meta: make a meta team comp
        """
        logger.info(f"Population: {population} Crossover: {crossover_rate} Mutation Rate: {mutation_rate}")
        self.champion_information = champion_information

        self.crossover_rate = crossover_rate
        self.base_team_composition = base_team_composition
        self.best_individuals = []
        self.average_fitness = []

        self.population = []
        for i in range(population):
            self.population.append(TeamComp(champion_information, champions=None, meta=meta))

    def crossover(self):
        """
        Apply crossover as per the crossover ratio.
        Crossover will be to swap to champions at a random
        index for two individuals in the population
        """
        for curr_index in range(len(self.population)):
            # Check if we perform crossover
            if random.uniform(0, 1) <= self.crossover_rate:
                # Make sure that we don't select current individual
                temp_index = random.randint(0, len(self.population)-1)
                while temp_index == curr_index:
                    temp_index = random.randint(0, len(self.population)-1)

                # Temp assignment for given individual
                curr_individual = self.population[curr_index]
                temp_individual = self.population[temp_index]

                # Try to crossover
                valid_crossover = False
                tries = 0

                # Only attempting for the size of the curr_individual champions (should be 5)
                while not valid_crossover and tries < len(curr_individual.champions):
                    champ_index = random.randint(0, 4)
                    # Check that this swap can be complete for both teams
                    is_on_curr = curr_individual.is_on_team(temp_individual.champions[champ_index].id)
                    is_on_temp = temp_individual.is_on_team(curr_individual.champions[champ_index].id)

                    if not (is_on_curr or is_on_temp):
                        # Then we can swap
                        temp = curr_individual.champions[champ_index]
                        curr_individual.champions[champ_index] = temp_individual.champions[champ_index]
                        temp_individual.champions[champ_index] = temp
                        logger.debug(f"Swapped {curr_individual.champions[champ_index].name} to {curr_index} "
                                     f"and {temp_individual.champions[champ_index].name} to {temp_index}")
                        valid_crossover = True
                    else:
                        tries += 1

    def mutate(self):
        """
        We mutate each individual in the population
        :return:
        """
        for i in range(len(self.population)):
            self.population[i].mutate(
                available_champions=self.champion_information,
                individual=i)

    def selection_tournament(self):
        """
        Selection Tournament with Replacement
        :return:
        """
        for i in range(len(self.population)):
            self.population[i].calculate_fitness(self.base_team_composition.champions)
        fitness_vals = ",".join([str(i.fitness) for i in self.population])
        logger.info(f"New fitness values: {fitness_vals}")

        new_generation = []
        # Currently only 1v1 selection
        for i in range(len(self.population)):
            # Make sure that we don't select current individual
            individual1 = random.randint(0, len(self.population)-1)
            while individual1 == i:
                individual1 = random.randint(0, len(self.population)-1)

            if self.population[i].fitness >= self.population[individual1].fitness:
                new_generation.append(copy.deepcopy(self.population[i]))

            else:
                new_generation.append(copy.deepcopy(self.population[individual1]))

        self.population = new_generation

    def calculate_best(self):
        avg_fitness = 0
        for i in self.population:
            avg_fitness += i.fitness
        self.average_fitness.append(avg_fitness/len(self.population))
        logger.info(f"Average Fitness: {self.average_fitness[-1]}")

        self.best_individuals += self.population
        self.best_individuals.sort(key=lambda x: x.fitness, reverse=True)
        self.best_individuals = self.best_individuals[:10]
        fitness_vals = ",".join([str(i.fitness) for i in self.best_individuals])
        logger.info(f"Best Fitness: {fitness_vals}")


    def iterate_population(self):
        self.crossover()
        self.mutate()
        self.selection_tournament()
        self.calculate_best()
