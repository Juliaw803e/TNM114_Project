export default class Parasite {
    constructor(id) {
        this.id = id;

        this.aggressiveness = Math.random(); //hur snabbt den dör aka latency 
        this.manipulation = Math.random(); // påverkar beteende hos värden
        this.pooSurvivalTime = 0.6 + Math.random() * 0.4; //överlever i poo
        this.hostSurvivalTime = 0.6 + Math.random() * 0.4;
        // Evolution
        this.generation = 0;
        this.mutations = [];

        //variabler som inte är gener 
        this.age = 0;
        this.successfulTransmissions = 0;
        this.numberOfHosts = 0; //vet inte om det behövs
    }
}
