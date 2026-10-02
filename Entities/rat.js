import Timer from "../timer.js";

const ratSprite = new Image();
ratSprite.src = new URL("../img/rat.png", import.meta.url).href;
const infectedRatSprite = new Image();
infectedRatSprite.src = new URL("../img/rat_p.png", import.meta.url).href;
const dyingRatSprite = new Image();
dyingRatSprite.src = new URL("../img/rat_p2.png", import.meta.url).href;


class Rat {
    constructor(id, x, y) {
        this.id = id;

        this.x = x;
        this.y = y;

        //this.hunger = 0;
        //this.hungerTimer = new Timer(5);

        this.speed = 70;
        this.fear = 0.5;
        this.spriteAngle = 0;
        this.spriteFlipTimer = 0;
        this.spriteFlipped = false;

        this.isAffected = false;
        this.parasiteId = null;
        this.parasite = null;
        this.infectionTime = 0;
        this.deathTime = null;
        this.isDead = false;

        this.isHunted = false;
        this.huntedBy = null; 
        this.isCaught = false;

        this.isEating = false;
        this.eatingTimer = new Timer(3); // äter i 2 sekunder
    }

    addParasite(parasite) {
        this.isAffected = true;
        this.parasiteId = parasite.id;
        this.parasite = parasite;
        this.infectionTime = 0;
    }

    //Rita en cirkel med råttans x och y.
    draw(ctx) {
        let sprite = this.isAffected ? infectedRatSprite : ratSprite;
        const timeUntilDeath = this.deathTime - this.infectionTime;
        const shouldShowDyingSprite =
            this.isAffected &&
            this.deathTime !== null &&
            timeUntilDeath > 0 &&
            timeUntilDeath <= 2 &&
            Math.floor(this.infectionTime / 0.25) % 2 === 0;

        if (shouldShowDyingSprite) {
            sprite = dyingRatSprite;
        }

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