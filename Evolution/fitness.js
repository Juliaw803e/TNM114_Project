class Fitness {
    static calculate(parasites) {
        return parasites.map(parasite => {

            const fitness =
                0.20 * parasite.aggressiveness +
                0.20 * parasite.manipulation +
                0.25 * parasite.hostSurvivalTime +
                0.15 * parasite.pooSurvivalTime +
                0.20 * parasite.nutritientStealing;

            return {
                parasite: parasite,
                fitness: fitness
            };
        });
    }
}

export default Fitness;