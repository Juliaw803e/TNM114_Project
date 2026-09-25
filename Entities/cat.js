export default class Cat {
    constructor(id, x, y) {
        this.id = id;

        this.x = x;
        this.y = y;

        this.hunger = 0;
        this.speed = 100;

        this.isAffected = false;

        this.currentParasite = null;
        this.secondParasite = null;

        this.poopCount = 0;
        this.maxPoops = 4;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 12, 0, Math.PI * 2);
        ctx.fillStyle = "orange";
        ctx.fill();
    }
}