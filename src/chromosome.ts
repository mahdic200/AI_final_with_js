class Chromosome {
    epsilon = 0.0000001;
    _gens: string
    _fitness: number | null
    _summation: number | null
    _fitness_ratio: number | null
    _probability_range: [number, number] | null

    constructor(gens: string) {
        this._gens = gens;
        this._fitness = null;
        this._summation = null;
        this._fitness_ratio = null;
        this._probability_range = null;
    }

    gens() {
        return this._gens.split(",").map(item => parseInt(item)).filter((item) => !isNaN(item))
    }

    intersects() {
        let intersects = 0;
        for (let i = 0; i < this.gens().length - 1; i++) {
            for (let j = i + 1; j < this.gens().length; j++) {
                if (this.gens()[i] == this.gens()[j]) {
                    intersects += 1;
                }
            }
        }
        return intersects;
    }

    set_summation(summation: number) {
        this._summation = summation;
    }

    fitness() {
        if (this._fitness !== null && this._fitness !== undefined) {
            return this._fitness;
        } else {
            let result;
            result = 1.0 / (this.intersects() + this.epsilon);
            this._fitness = result;
            return result;
        }
    }

    fitness_ratio() {
        if (this._summation == null || this._summation == undefined) {console.error("summation is not set !!!! (chromosome fitness_ratio method)")}
        if (this._fitness_ratio !== null && this._fitness_ratio !== undefined) {
            return this._fitness_ratio;
        } else {
            let result;
            result = this.fitness() / this._summation!;
            this._fitness_ratio = result;
            return result;
        }
    }

    set_probability_range(down: number, up: number) {
        this._probability_range = [down, up];
    }

    is_chosen(number: number) {
        if (this._probability_range == null ||this._probability_range == undefined) {
            console.error('probability range is not set !!!! (chromosome is chosen method)');
        }
        if (number >= this._probability_range![0] && number < this._probability_range![1]) {
            return true;
        } else {
            return false;
        }
    }

    
}

export default Chromosome;