class Fitness {
    static calculate(parasites) {
        return parasites.map(parasite => {

            const traitScore = (
                0.20 * parasite.aggressiveness +
                0.30 * parasite.manipulation +
                0.20 * parasite.hostSurvivalTime +
                0.15 * parasite.pooSurvivalTime
            ) / 0.85
            - 0.10 * parasite.aggressiveness; //trade off

            const fitness = 0.50 * parasite.successfulTransmissions + 0.50 * traitScore;

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