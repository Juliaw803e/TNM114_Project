import Timer from "../timer.js";

class Rat {
    constructor(id, x, y) {
        this.id = id;

        this.x = x;
        this.y = y;

        this.hunger = 0;
        this.hungerTimer = new Timer(5);

        this.speed = 1;
        this.fear = 0.5;

        this.isAffected = false;
        this.parasiteId = null;

        this.isHunted = false;
        this.isEating = false;
    }

    addParasite(parasite) {
        this.isAffected = true;
        this.parasiteId = parasite.id;
    }

    //Rita en cirkel med råttans x och y.
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
        if (this.isAffected) {
            ctx.fillStyle = "red";
        } else {
            ctx.fillStyle = "gray";
        }
        ctx.fill();
    }
}

export default Rat;