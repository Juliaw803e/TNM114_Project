class Parasite {
    constructor(id) {
        this.id = id;

        this.aggressiveness = Math.random();
        this.transmission = Math.random();
        this.manipulation = Math.random();
        this.survivalTime = Math.random();

        this.age = 0;
    }
}