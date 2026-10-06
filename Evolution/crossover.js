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

        child.pooSurvivalTime =
            Math.random() < 0.5
                ? parentA.pooSurvivalTime
                : parentB.pooSurvivalTime;

        child.hostSurvivalTime =
            Math.random() < 0.5
                ? parentA.hostSurvivalTime
                : parentB.hostSurvivalTime;
                
         // Child belongs to the next generation
         child.generation =
         Math.max(parentA.generation, parentB.generation) + 1;

        return child;
    }
}