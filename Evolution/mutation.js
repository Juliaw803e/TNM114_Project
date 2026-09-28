export default class Mutation {
    //5% mutation rate and 10% mutation amount by default
    static mutate(parasite, mutationRate = 0.05, mutationAmount = 0.1) {

        if (Math.random() < mutationRate) {
            parasite.aggressiveness += Mutation.randomChange(mutationAmount);
        }

        if (Math.random() < mutationRate) {
            parasite.transmission += Mutation.randomChange(mutationAmount);
        }

        if (Math.random() < mutationRate) {
            parasite.manipulation += Mutation.randomChange(mutationAmount);
        }

        if (Math.random() < mutationRate) {
            parasite.survivalTime += Mutation.randomChange(mutationAmount);
        }

        Mutation.keepGenesInRange(parasite);

        return parasite;
    }

    static randomChange(amount) {
        return (Math.random() * 2 - 1) * amount;
    }

    static keepGenesInRange(parasite) {

        parasite.aggressiveness =
            Math.max(0, Math.min(1, parasite.aggressiveness));

        parasite.transmission =
            Math.max(0, Math.min(1, parasite.transmission));

        parasite.manipulation =
            Math.max(0, Math.min(1, parasite.manipulation));

        parasite.survivalTime =
            Math.max(0, Math.min(1, parasite.survivalTime));
    }
}