import Parasite from "../Entities/parasite.js";

export default class Crossover {

    static createChild(parentA, parentB, id) {
        const child = new Parasite(id);
        
        //choose traints from parents randomly
        child.aggressiveness =
            Math.random() < 0.5
                ? parentA.aggressiveness
                : parentB.aggressiveness;

        child.transmission =
            Math.random() < 0.5
                ? parentA.transmission
                : parentB.transmission;

        child.manipulation =
            Math.random() < 0.5
                ? parentA.manipulation
                : parentB.manipulation;

        child.survivalTime =
            Math.random() < 0.5
                ? parentA.survivalTime
                : parentB.survivalTime;

        return child;
    }
}