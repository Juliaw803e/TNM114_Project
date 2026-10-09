import Timer from "../timer.js";

const ratSprite = new Image();
ratSprite.src = new URL("../img/rat.png", import.meta.url).href;
const infectedRatSprite = new Image();
infectedRatSprite.src = new URL("../img/rat_p.png", import.meta.url).href;


class Rat {
    constructor(id, x, y) {
        this.id = id;

        this.x = x;
        this.y = y;

        this.hunger = 0;
        this.hungerTimer = new Timer(5);

        this.baseSpeed = 90;
        this.speed = this.baseSpeed;
        this.spriteAngle = 0;
        this.spriteFlipTimer = 0;
        this.spriteFlipped = false;

        this.isAffected = false;
        this.parasiteId = null;
        this.parasite = null;
        this.parasiteAge = 0;
        this.parasiteLifetime = null;
        this.isDead = false;
        this.respawnTimeRemaining = null;

        this.isHunted = false;
        this.huntedBy = null; 
        this.isCaught = false;

        this.isEating = false;
        this.eatingTimer = new Timer(3); // äter i 2 sekunder
    }

    addParasite(parasite) {
        const aggressiveness = Math.max(0, Math.min(1, parasite.aggressiveness));
        const hostSurvivalTime = Math.max(0, Math.min(1, parasite.hostSurvivalTime));

        this.isAffected = true;
        this.parasiteId = parasite.id;
        this.parasite = parasite;
        this.speed = this.baseSpeed * (1 - aggressiveness * 0.7);
        this.parasiteAge = 0;
        this.parasiteLifetime = 5 + hostSurvivalTime * 55;
    }

    clearParasite() {
        this.isAffected = false;
        this.parasiteId = null;
        this.parasite = null;
        this.speed = this.baseSpeed;
        this.parasiteAge = 0;
        this.parasiteLifetime = null;
    }

    respawn(x, y) {
        this.x = x;
        this.y = y;
        this.hunger = 0;
        this.hungerTimer.reset();
        this.clearParasite();
        this.isDead = false;
        this.respawnTimeRemaining = null;
        this.isHunted = false;
        this.huntedBy = null;
        this.isCaught = false;
        this.isEating = false;
        this.eatingTimer.reset();
        this.spriteAngle = 0;
        this.spriteFlipTimer = 0;
        this.spriteFlipped = false;
    }

    //bild på rat med råttans x och y.
    draw(ctx) {
        const sprite = this.isAffected ? infectedRatSprite : ratSprite;

        if (!sprite.complete || sprite.naturalWidth === 0) {
            return;
        }

        const height = 32;
        const width = height * sprite.naturalWidth / sprite.naturalHeight;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.spriteAngle);
        ctx.scale(this.spriteFlipped ? -1 : 1, 1);
        ctx.drawImage(sprite, -width / 2, -height / 2, width, height);
        ctx.restore();
    }
}

export default Rat;