import Genetic from "./genetic";
import { setResult } from "./helpers"

const log = console.log;

class Boot {
    constructor() {
        this.boot()
    }

    error() {
        log("input is invalid !");
    }

    is_empty(input: number | string) {
        if (input == null || undefined || input == "") {
            return true;
        } else {
            return false
        }
    }

    config_chr_length() {
        return 10;
    }

    config_population_size() {
        return 10;
    }

    config_permutation() {
        let permutation: GLfloat | null;
        while (true) {
            permutation = parseFloat(prompt("Enter permutation (between 0 and 1): ")!);
            if (
                isNaN(permutation) ||
                this.is_empty(permutation) ||
                permutation < 0 || permutation > 1
            ) {
                alert("input is invalid");
            } else {
                alert('input is accepted with value : ' + permutation)
                break;
            }
        }
        return permutation;
    }

    config_maxiter() {
        let maxiter: number | null;
        while (true) {
            maxiter = parseInt(prompt("Enter maxiter (between 1 and 5000): ")!);
            if (
                isNaN(maxiter) ||
                this.is_empty(maxiter) ||
                maxiter < 1 || maxiter > 5000
            ) {
                alert("input is invalid");
            } else {
                alert('input is accepted with value : ' + maxiter)
                break;
            }
        }
        return maxiter;
    }

    config_crossover_type() : number {
        let crossover_type: number | null;
        while (true) {
            crossover_type = parseInt(prompt("Enter crossover type: \n(1) => one point\n(2) => two point\n(3) => uniform")!);
            if (
                isNaN(crossover_type) ||
                this.is_empty(crossover_type) ||
                crossover_type < 1 || crossover_type > 3
            ) {
                alert("input is invalid");
            } else {
                alert('input is accepted with value : ' + crossover_type)
                break;
            }
        }
        return crossover_type;
    }


    boot() {
        let permutation = this.config_permutation();
        let maxiter = this.config_maxiter();
        let crossover_type = this.config_crossover_type();

        let genetic = new Genetic(10, 10, permutation, maxiter, crossover_type);
        let bestCh = genetic.start();
        setResult(`final chromosome: [${bestCh.gens()}]\nintersects: ${bestCh.intersects()}`);
    }
}

export default Boot;