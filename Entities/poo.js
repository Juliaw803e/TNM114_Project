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
            ? 5 + parasite.survivalTime * 25 //bajs ligger kvar i 5 sekunder + parasitens överlevnadstid * 25 sekunder
            : Infinity; // Om det inte finns någon parasit, kommer bajset att ligga kvar för alltid
    }

    update(deltaTime) {
        this.age += deltaTime;
        return this.age < this.lifetime;
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