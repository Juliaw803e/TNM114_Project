class Cat {
    constructor(id, x, y) {
        this.id = id;

        this.x = x;
        this.y = y;

        this.hunger = 0;
        this.speed = 2;

        this.isAffected = false;

        this.currentParasite = null;
        this.secondParasite = null;

        this.poopCount = 0;
        this.maxPoops = 4;
    }
}