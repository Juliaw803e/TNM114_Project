class Fitness {
    static calculate(parasites) {
        return parasites.map(parasite => {

            const traitScore = (
                0.20 * parasite.aggressiveness +
                0.20 * parasite.manipulation +
                0.25 * parasite.hostSurvivalTime +
                0.15 * parasite.pooSurvivalTime
            ) / 0.80;

            const fitness = parasite.successfulTransmissions;

            return {
                parasite: parasite,
                fitness,
                traitScore,
                successfulTransmissions: parasite.successfulTransmissions
            };
        });
    }
}

export default Fitness;