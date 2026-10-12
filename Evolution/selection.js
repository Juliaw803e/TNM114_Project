//Roulette wheel: 
export default class Selection {

    static select(fitnessValues) {

        function roulettePick(candidates = fitnessValues) {
            const candidateFitness = candidates.reduce(
                (sum, item) => sum + item.fitness,
                0
            );

            if (candidateFitness === 0) {
                const randomIndex = Math.floor(Math.random() * candidates.length);
                return candidates[randomIndex].parasite;
            }

            let random = Math.random() * candidateFitness;

            for (const item of candidates) {
                random -= item.fitness;

                if (random <= 0) {
                    return item.parasite;
                }
            }

            return candidates[candidates.length - 1].parasite;
        }

        const parent1 = roulettePick();
        const differentParents = fitnessValues.filter(
            item => item.parasite.id !== parent1.id
        );
        const parent2 = differentParents.length > 0
            ? roulettePick(differentParents)
            : parent1;

        return [parent1, parent2];
    }
}
