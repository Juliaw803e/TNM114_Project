class Poo {
    constructor(x, y, parasite = null) {
        this.x = x;
        this.y = y;

        this.parasite = parasite;
        this.isAffected = parasite !== null;
    }

     //Rita en cirkel med råttans x och y.
     draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "brown";
        ctx.fill();
    }
}
export default Poo;