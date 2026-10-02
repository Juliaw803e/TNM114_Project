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
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "brown";
        ctx.fill();
    }
}
export default Poo;