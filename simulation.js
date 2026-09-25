import Rat from "./Entities/rat.js";
import RatBehaviour from "./Behaviour/ratbehaviour.js";
import Cat from "./Entities/cat.js";
import { CatBehaviour } from "./Behaviour/catbehaviour.js";
import Parasite from "./Entities/parasite.js";


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

        //Add initila parasites to random rats: 
        // Create initial parasites
        const parasite1 = new Parasite(1);
        const parasite2 = new Parasite(2);
        const parasite3 = new Parasite(3);

        this.rats[0].addParasite(parasite1);
        this.rats[1].addParasite(parasite2);
        this.rats[2].addParasite(parasite3);

        this.catBehaviours = [];
        //Create cats
        for (let i = 0; i < 2; i++) {
            const cat = new Cat(
                i, 
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height
            );
        
            this.cats.push(cat);
            const behaviour = new CatBehaviour(cat, this.rats);
            this.catBehaviours.push(behaviour);
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

           // Update and draw cats
        for (const behaviour of this.catBehaviours) {
            behaviour.update(deltaTime);
        }
        for (const cat of this.cats) {
            cat.draw(this.ctx);
        }
    
        requestAnimationFrame((time) => this.update(time));
    }
}

export default Simulation;