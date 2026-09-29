export default class Parasite {
    constructor(id) {
        this.id = id;

        this.aggressiveness = Math.random();
        this.transmission = Math.random();
        this.manipulation = Math.random();
        this.survivalTime = Math.random();

        //variabler som inte är gener 
        this.age = 0;
        this.successfulTransmissions = 0;
        this.numberOfHosts = 0; //vet inte om det behövs
    }
}

