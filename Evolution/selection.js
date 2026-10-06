class Selection {

    static select(fitnessValues) {
        const sorted = [...fitnessValues].sort(
            (a, b) => b.fitness - a.fitness
        );

        return [
            sorted[0].parasite,
            sorted[1].parasite
        ];
    }
}

export default Selection;

//Roulette wheel: 
/*export default class Selection {

    static select(fitnessValues) {

        const totalFitness = fitnessValues.reduce(
            (sum, item) => sum + item.fitness,
            0
        );

        function roulettePick() {

            let random = Math.random() * totalFitness;

            for (const item of fitnessValues) {
                random -= item.fitness;

                if (random <= 0) {
                    return item.parasite;
                }
            }

            return fitnessValues[fitnessValues.length - 1].parasite;
        }

        // Välj första föräldern
        const parent1 = roulettePick();

        // Välj andra föräldern
        let parent2 = roulettePick();

        // Om samma valdes, försök igen
        while (parent2.id === parent1.id && fitnessValues.length > 1) {
            parent2 = roulettePick();
        }

        return [parent1, parent2];
    }
}*/
