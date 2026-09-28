class Poo {
    constructor(x, y, parasiteId) {
        this.x = x;
        this.y = y;

        this.isAffected = true;
        this.parasiteId = parasiteId;
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