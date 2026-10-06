export default class Parasite {
    constructor(id) {
        this.id = id;

        this.aggressiveness = Math.random(); //hur snabbt den dör aka latency 
        this.transmission = Math.random(); // används inte? 
        this.manipulation = Math.random(); // påverkar beteende hos värden
        this.pooSurvivalTime = Math.random(); //överlever i poo
        this.hostSurvivalTime = Math.random();
        this.nutrientStealing = Math.random(); // påverkar hur mycket maten påverkar survivaltime 
        // Evolution
        this.generation = 0;
        this.mutations = [];

        //variabler som inte är gener 
        this.age = 0;
        this.successfulTransmissions = 0;
        this.numberOfHosts = 0; //vet inte om det behövs
    }
}

