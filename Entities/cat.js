import Timer from "../timer.js";

const catSprite = new Image();
catSprite.src = new URL("../img/cat.png", import.meta.url).href;
const infectedCatSprite = new Image();
infectedCatSprite.src = new URL("../img/cat_p.png", import.meta.url).href;

export default class Cat {
    constructor(id, x, y) {
        this.id = id;

        this.x = x;
        this.y = y;

        this.hunger = 0;
        this.speed = 100;
        this.isEating = false; 
        this.spriteAngle = 0;
        this.spriteFlipTimer = 0;
        this.spriteFlipped = false;

        this.isAffected = false;

        this.currentParasite = null;
        this.secondParasite = null; //behövs inte...

        this.poopCount = 0;
        this.maxPoops = 4;
        this.parasiteInPoopCount = 0;
        this.poopTimer = new Timer(6); 
    }

    draw(ctx) {
        const sprite = this.isAffected ? infectedCatSprite : catSprite;
        if (!sprite.complete || sprite.naturalWidth === 0) {
            return;
        }

        const height = 42;
        const width = height * sprite.naturalWidth / sprite.naturalHeight;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.spriteAngle);
        ctx.scale(this.spriteFlipped ? -1 : 1, 1);
        ctx.drawImage(sprite, -width / 2, -height / 2, width, height);
        ctx.restore();
    }
}