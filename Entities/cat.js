import Timer from "../timer.js";
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
        this.poopTimer = new Timer(6); 
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 18, 0, Math.PI * 2);
        ctx.fillStyle = "orange";
        ctx.fill();
        ctx.lineWidth = 1;                 // Border thickness
        ctx.strokeStyle = "black";          // Border color
        ctx.stroke();                      // Renders the border
        
    }
}