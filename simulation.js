import Rat from "./Entities/rat.js";
import RatBehaviour from "./Behaviour/ratbehaviour.js";

class Simulation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.canvas.width = 800;
        this.canvas.height = 600;

        this.rats = [];
        this.cats = [];
        this.parasites = [];

        this.ratBehaviour = new RatBehaviour();

        // Create rats ska komma från input istället för 10!!
        for (let i = 0; i < 10; i++) {
            const rat = new Rat(
                i,
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height
            );

            this.rats.push(rat);
        }
    }

    start() {
        this.lastTime = performance.now();
        requestAnimationFrame((time) => this.update(time));
    }
    
    update(time) {
    
        const deltaTime = (time - this.lastTime) / 1000;
        this.lastTime = time;
    
        this.ctx.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
    
        for (const rat of this.rats) {
            this.ratBehaviour.update(rat, deltaTime);
            rat.draw(this.ctx);
        }
    
        requestAnimationFrame((time) => this.update(time));
    }
}

export default Simulation;