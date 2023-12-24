import Chromosome from "./chromosome.js";
import {getRandomInt} from "./helpers.js";

class Genetic {
    chromosome_length: number
    population: Chromosome[]
    population_size: number
    per_mutation: number
    maxiter: number
    crossover_type: number
    constructor(
        chromosome_length: number,
        population_size: number,
        per_mutation: number,
        maxiter: number,
        crossover_type: number
    ) {
        this.chromosome_length = chromosome_length;
        this.population = [];
        this.population_size = population_size;
        this.per_mutation = per_mutation;
        this.maxiter = maxiter;
        this.crossover_type = crossover_type;

        this.init_population();
    }

    random_chromosome(): Chromosome {
        let rn_gens: number[] = [];
        for (let i = 0; i < this.chromosome_length; i++) {
            let rn = getRandomInt(0, 26);
            rn_gens.push(rn);
        }
        return new Chromosome(rn_gens.join(","));
    }

    init_population() {
        let dataset = [
            [5, 5, 15, 15, 2, 2, 7, 7, 17, 17],
            [1, 15, 15, 25, 25, 25, 12, 17, 22, 3],
            [10, 10, 10, 20, 20, 7, 2, 12, 12, 3],
            [1,10,15,15,2,2,7,7,12,22],
            [5,5,20,25,20,25,12,12,17,3],
            [10,10,20,15,25,25,2,7,22,22],
            [5,5,15,20,20,7,7,7,12,22],
            [10,15,15,25,20,2,2,12,17,17],
            [10,10,20,25,25,2,7,12,12,17],
            [5,15,20,20,2,2,2,22,22,17],
        ];

        for (const item of dataset) {
            this.population.push(new Chromosome(item.join(",")))
        }
        console.log('initiated')
    }

    fitness_summation() {
        let summation = 0;
        for (const chromo of this.population) {
            summation += chromo.fitness();
        }
        for (const chromo of this.population) {
            chromo.set_summation(summation);
            chromo.fitness_ratio()
        }

        return summation;
    }

    init_probability_range() {
        let temp = 0.0;
        for (const chromo of this.population) {
            let temp_ = temp + chromo.fitness_ratio();
            chromo.set_probability_range(temp, temp_);
            temp = temp_;
        }
    }

    parent_selection(parents: Chromosome[]): Chromosome[] {
        this.fitness_summation();
        this.init_probability_range();
        let new_parents: Chromosome[] = [];
        let indexes: number[] = [];
        while (indexes.length != this.population_size) {
            for (let i = 0; i < parents.length; i++) {
                let rn = getRandomInt(0, 100) / 100;
                if (parents[i].is_chosen(rn)) {
                    indexes.push(i);
                    break;
                }
            }
        }

        for (let i = 0; i < indexes.length; i++) {
            new_parents.push(parents[indexes[i]])
        }
        return new_parents;
    }

    one_point_crossover(parent_1: Chromosome, parent_2: Chromosome): [Chromosome, Chromosome] {
        let p1: number[] = parent_1.gens();
        let p2: number[] = parent_2.gens();

        let crossover_point = getRandomInt(0, 100) % this.chromosome_length;

        let ch1: number[] = p1.slice(0, crossover_point).concat(p2.slice(crossover_point));
        let ch2: number[] = p2.slice(0, crossover_point).concat(p1.slice(crossover_point));
        let ch1_: Chromosome = new Chromosome(ch1.join(","));
        let ch2_: Chromosome = new Chromosome(ch2.join(","));

        return [ch1_, ch2_];
    }

    two_point_crossover(parent_1: Chromosome, parent_2: Chromosome): [Chromosome, Chromosome] {
        let p1: number[] = parent_1.gens();
        let p2: number[] = parent_2.gens();
        
        let i1 = getRandomInt(0, 100) % this.chromosome_length;
        let i2 = getRandomInt(0, 100) % this.chromosome_length;
        if (i2 < i1) {
            let t = i1;i1 = i2;i2 = t;
        }

        let ch1 = p1.slice(0, i1).concat(p2.slice(i1, i2).concat(p1.slice(i2)));
        let ch2 = p2.slice(0, i1).concat(p1.slice(i1, i2).concat(p2.slice(i2)));

        return [new Chromosome(ch1.join(",")), new Chromosome(ch2.join(","))];
    }

    crossover(p1: Chromosome, p2: Chromosome) : [Chromosome, Chromosome] {
        if (this.crossover_type == 1) {
            return this.one_point_crossover(p1, p2);
        } else if (this.crossover_type == 2) {
            return this.two_point_crossover(p1, p2);
        } else if (this.crossover_type == 3) {
            return this.two_point_crossover(p1, p2);
        } else {
            console.error('invalid crossover number !!! (chromosome crossover method !!!)');
            return [this.random_chromosome(), this.random_chromosome()];
        }
    }

    recombination(parents: Chromosome[]) {
        let offsprings = [];
        for (let i = 0; i < parents.length - 1; i += 2) {
            let [ch1, ch2] = this.crossover(parents[i], parents[i + 1]);
            offsprings.push(ch1, ch2);
        }

        return offsprings;
    }

    swap_mutation(chromosome: Chromosome) {
        let gens = chromosome.gens();
        let rn = getRandomInt(0, 100) / 100;
        if (rn <= this.per_mutation) {
            let i = getRandomInt(0, 100) % this.chromosome_length;
            let j = getRandomInt(0, 100) % this.chromosome_length;
            let t = gens[i];
            gens[i] = gens[j];
            gens[j] = t;
        }

        return new Chromosome(gens.join(","));
    }

    mutation(offsprings: Chromosome[]) {
        for (let i = 0; i < offsprings.length; i++) {
            offsprings[i] = this.swap_mutation(offsprings[i]);
        }
        return offsprings;
    }

    maximum_fitness() {
        let best = this.population[0];
        for (const chromo of this.population) {
            if (best.fitness() < chromo.fitness()) {
                best = chromo;
            }
        }

        return best;
    }

    start() {
        let bests = [];
        let best = this.random_chromosome();
        for (let i = 1; i <= this.maxiter; i++) {
            let parents = this.parent_selection(this.population);
            let offsprings = this.recombination(parents);
            offsprings = this.mutation(offsprings);
            this.population = [];
            this.population = [...offsprings];
            let this_gen_best = this.maximum_fitness();
            bests.push(this_gen_best);
            if (best.fitness() < this_gen_best.fitness()) {
                best = this_gen_best;
            }
        }

        return best;
    }
}

export default Genetic;