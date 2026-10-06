const pooSprite = new Image();
pooSprite.src = new URL("../img/poo.png", import.meta.url).href;
const pooInfectedSprite = new Image();
pooInfectedSprite.src = new URL("../img/poo_p.png", import.meta.url).href;


class Poo {
    constructor(x, y, parasite = null) {
        this.x = x;
        this.y = y;

        this.parasite = parasite;
        this.isAffected = parasite !== null;
        this.age = 0;
        this.lifetime = parasite
            ? 5 + parasite.pooSurvivalTime * 25
            : Infinity;
    }

    update(deltaTime) {
        if (this.parasite) {
            this.age += deltaTime;
            if (this.age >= this.lifetime) {
                this.parasite = null;
                this.isAffected = false;
            }
        }

        return true;
    }

     //Rita en cirkel med råttans x och y.
      draw(ctx) {
        const sprite = this.isAffected ? pooInfectedSprite : pooSprite;
        if (!sprite.complete || sprite.naturalWidth === 0) {
            return;
        }

        const size = 24;
        ctx.drawImage(
            sprite,
            this.x - size / 2,
            this.y - size / 2,
            size,
            size
        );
    }
}
export default Poo;