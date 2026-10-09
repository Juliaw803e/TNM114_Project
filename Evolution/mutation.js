export default class Mutation {
    static mutate(parasite, mutationRate = 1.0, mutationAmount = 0.15) {
        const mutations = [];

        if (Math.random() < mutationRate) {
            const oldValue = parasite.aggressiveness;
            parasite.aggressiveness += Mutation.randomChange(mutationAmount);
            
            mutations.push({
                gene: "aggressiveness",
                oldValue: oldValue,
                newValue: parasite.aggressiveness
            });
        }

        if (Math.random() < mutationRate) {
            const oldValue = parasite.transmission;

            parasite.transmission += Mutation.randomChange(mutationAmount);

            mutations.push({
                gene: "transmission",
                oldValue: oldValue,
                newValue: parasite.transmission
            });
        }

        if (Math.random() < mutationRate) {
            const oldValue = parasite.manipulation;
            parasite.manipulation += Mutation.randomChange(mutationAmount);

            mutations.push({
                gene: "manipulation",
                oldValue: oldValue, 
                newValue: parasite.manipulation
            });
        }

        for (const gene of ["pooSurvivalTime", "hostSurvivalTime"]) {
            if (Math.random() < mutationRate) {
                const oldValue = parasite[gene];
                parasite[gene] += Mutation.randomChange(mutationAmount);

                mutations.push({
                    gene,
                    oldValue,
                    newValue: parasite[gene]
                });
            }
        }

        Mutation.keepGenesInRange(parasite);

         // Save actual final values
         for (const mutation of mutations) {
            mutation.newValue = parasite[mutation.gene];
        }
        parasite.mutations = mutations;

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

        parasite.pooSurvivalTime =
            Math.max(0, Math.min(1, parasite.pooSurvivalTime));

        parasite.hostSurvivalTime =
            Math.max(0, Math.min(1, parasite.hostSurvivalTime));
    }
}