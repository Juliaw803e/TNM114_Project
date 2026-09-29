import Parasite from "../Entities/parasite.js";
import Crossover from "./crossover.js";
import Mutation from "./mutation.js";

export default class Evolution {

    static reproduce(parentA, parentB, childId) {
        let child = Crossover.createChild(
            parentA,
            parentB,
            childId
        );

        child = Mutation.mutate(child);

        return child;
    }
}