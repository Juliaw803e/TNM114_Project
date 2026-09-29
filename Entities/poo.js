class Poo {
    constructor(x, y, parasiteId) {
        this.x = x;
        this.y = y;

        this.isAffected = true;
        //this.parasiteId = parasiteId;
        //tydligen inte parasiteId som ska sparas utan själva parasiten, så vi kan kolla på dess egenskaper senare
        this.parasite = parasite; 
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