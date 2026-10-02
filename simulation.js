import Rat from "./Entities/rat.js";
import RatBehaviour from "./Behaviour/ratbehaviour.js";
import Cat from "./Entities/cat.js";
import { CatBehaviour } from "./Behaviour/catbehaviour.js";
import Parasite from "./Entities/parasite.js";
import Poo from "./Entities/poo.js";
import Evolution from "./Evolution/evolution.js";


class Simulation {
    constructor(canvas, numberOfRats = 10, numberOfCats = 2, numberOfParasites = 3, onMutation) {
        this.isRunning = false;
        this.isPaused = false;
        this.onMutation = onMutation; //För info mutation
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.canvas.width = 800;
        this.canvas.height = 600;

        this.rats = [];
        this.cats = [];
        this.parasites = [];
        this.poos = []; 
        this.nextParasiteId = numberOfParasites + 1;

        this.behaviourstore = []; //array för att alla ska ha eget betende
        this.catBehaviours = []; //array katter 

        // Create rats ska komma från input istället för 10!!
        for (let i = 0; i < numberOfRats; i++) {
            const rat = new Rat(
                i,
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height
            );

            this.rats.push(rat);
            const behaviour = new RatBehaviour(
                (eatingRat, poo) => this.ratEatsPoo(eatingRat, poo)
            );
            this.behaviourstore.push(behaviour);
        }

        //Add initila parasites to random rats: 
        for (let i = 0; i < numberOfParasites; i++) {
            const parasite = new Parasite(i + 1);
        
            this.parasites.push(parasite);
        
            this.rats[i].addParasite(parasite);
        }

        
        //Create cats: 
        for (let i = 0; i < numberOfCats; i++) {
            const cat = new Cat(
                i, 
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height
            );
        
            this.cats.push(cat);
            const behaviour = new CatBehaviour(
                cat,
                this.rats,
                (eatingCat, rat) => this.catEatsRat(eatingCat, rat),
                eatingCat => this.catDefecates(eatingCat)
            );
            this.catBehaviours.push(behaviour);
        }
  
    }

     //GUI funktioner: ------- 
    stop() {
        this.isRunning = false;
        this.isPaused = false;
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
        this.lastTime = performance.now();
    }
   
   start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.isPaused = false; 
    this.lastTime = performance.now();

    requestAnimationFrame((time) => this.update(time));
    }

    //Evolutionsfunktioner: -------
    //Test för att visa mutation i GUI: 
    catEatsRat(cat, rat) {
        cat.hasEaten = true;
        cat.poopCount = 0;
    
        if (rat.parasite) {
    
            if (!cat.currentParasite) {
    
                cat.currentParasite = rat.parasite;
                cat.parasiteInPoopCount = 0;
    
            } else if (cat.currentParasite.id !== rat.parasite.id) {
                console.log("SECOND PARASITE EATEN");
                console.log("Parent 1:", cat.currentParasite.id);
                console.log("Parent 2:", rat.parasite.id);

                cat.parasiteInPoopCount = 0;
            
                const parent1 = cat.currentParasite;
                const parent2 = rat.parasite;
            
                const newParasite = Evolution.reproduce(
                    parent1,
                    parent2,
                    this.nextParasiteId
                );

                console.log("NEW PARASITE:", newParasite);
                console.log("MUTATIONS:", newParasite.mutations);
            
                cat.currentParasite = newParasite;
            
                if (this.onMutation) {
                    console.log("SENDING TO GUI");
                    this.onMutation({
                        id: newParasite.id,
                        parent1: parent1.id,
                        parent2: parent2.id,
                        generation: newParasite.generation,
                        mutations: newParasite.mutations
                    });
                }
            
                this.nextParasiteId++;
            }
        }
    
        cat.isAffected = Boolean(cat.currentParasite);
    }
    //Här slutar test av catseatrat


    catDefecates(cat) {
        if (cat.poopCount >= cat.maxPoops) {
            return;
        }

        let parasiteInPoo = null;
        if (cat.currentParasite) {
            if (cat.parasiteInPoopCount < 4) {
                parasiteInPoo = cat.currentParasite;
                cat.parasiteInPoopCount++;

                if (cat.parasiteInPoopCount === 4) {
                    cat.currentParasite = null;
                    cat.isAffected = false;
                }
            } else {
                cat.currentParasite = null;
                cat.isAffected = false;
            }
        }

        const poo = new Poo(cat.x, cat.y, parasiteInPoo);
        this.poos.push(poo);
        cat.poopCount++;

        return poo;
    }

    ratEatsPoo(rat, poo) {
        const pooIndex = this.poos.indexOf(poo);
        if (pooIndex === -1) {
            return;
        }

        if (
            !rat.parasite &&
            poo.parasite &&
            Math.random() < poo.parasite.transmission //transmission probability check 
        ) {
            rat.addParasite(poo.parasite);
            poo.parasite.successfulTransmissions++;
        }

        this.poos.splice(pooIndex, 1);
    }
    
    update(time) {
        if (!this.isRunning) return;

        //Pause nuvarande simulation: 
        if (this.isPaused) {
            this.lastTime = time;
            requestAnimationFrame((time) => this.update(time));
            return;
        }

        const deltaTime = (time - this.lastTime) / 1000;
        this.lastTime = time;
    
        this.ctx.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );

        for (let i = this.poos.length - 1; i >= 0; i--) {
            if (!this.poos[i].update(deltaTime)) {
                this.poos.splice(i, 1);
            }
        }
        
        //Update and draw rats
        for (let i = 0; i < this.rats.length; i++) {
            this.behaviourstore[i].update(this.rats[i], deltaTime, this.canvas, this.poos);
            
            if (!this.rats[i].isCaught && !this.rats[i].isDead) {
                this.rats[i].draw(this.ctx);
            }
        }

           // Update and draw cats
        for (const behaviour of this.catBehaviours) {
            behaviour.update(deltaTime, this.canvas);
        }
        for (const cat of this.cats) {
            cat.draw(this.ctx);
        }

        //test rita ut poo: 
        for (const poo of this.poos) {
            poo.draw(this.ctx);
        }
    
        requestAnimationFrame((time) => this.update(time));
    }
}

export default Simulation;