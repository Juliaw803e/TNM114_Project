import Rat from "./Entities/rat.js";
import RatBehaviour from "./Behaviour/ratbehaviour.js";
import Cat from "./Entities/cat.js";
import { CatBehaviour } from "./Behaviour/catbehaviour.js";
import Parasite from "./Entities/parasite.js";
import Poo from "./Entities/poo.js";

import Evolution from "./Evolution/evolution.js";
import Fitness from "./Evolution/fitness.js";
import Selection from "./Evolution/selection.js";
import Timer from "../timer.js";

class Simulation {
    constructor(canvas, numberOfRats = 10, numberOfCats = 2, numberOfParasites = 3,  onEvolution) {
        this.isRunning = false;
        this.isPaused = false;
        this. onEvolution =  onEvolution; //För info om generationsrunda
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.generation = 1;
        this.reproductionTimer = new Timer(30); //Global timer for when selection happens

        this.canvas.width = 950;
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
            const { x, y } = this.getRatSpawnPosition();
            const rat = new Rat(
                i,
                x,
                y
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
    getRatSpawnPosition() {
        const x = Math.random() < 0.5 ? 10 : this.canvas.width - 10;
        return { x, y: this.canvas.height / 2 };
    }

    respawnRat(rat) {
        const ratIndex = this.rats.indexOf(rat);
        if (ratIndex === -1) {
            return;
        }

        const { x, y } = this.getRatSpawnPosition();

        rat.respawn(x, y);
        this.behaviourstore[ratIndex].resetAfterRespawn();
    }

    //Samla bara parasiter som katten ätit: 
    catEatsRat(cat, rat) {
        cat.hasEaten = true;
        cat.poopCount = 0;
    
        if (!rat.parasite) {
            return;
        }
    
        // Spara parasiten som katten har ätit
        if (!cat.eatenParasites) {
            cat.eatenParasites = [];
        }
    
        cat.eatenParasites.push(rat.parasite);
    
        console.log(
            `Cat ${cat.id} ate parasite ${rat.parasite.id}`
        );
    
        cat.isAffected = true;
    }

    //Evolution där alla katter testas samtidigt: 
    runEvolution() {
        console.log("EVOLUTION ROUND");
    
        const evolutionResults = [];
    
        // Gå igenom alla katter
        for (const cat of this.cats) {
    
            // Om katten inte har tillräckligt många parasiter
            if (!cat.eatenParasites || cat.eatenParasites.length < 2) {

                evolutionResults.push({
                    catId: cat.id,
                    reproduced: false
                });
            
                cat.eatenParasites = [];
            
                continue;
            }
    
            // 1. Beräkna fitness för alla parasiter katten har ätit
            const fitnessValues = Fitness.calculate(
                cat.eatenParasites
            );
    
            // 2. Välj de två bästa parasiterna
            const [parent1, parent2] = Selection.select(
                fitnessValues
            );

            //Spara fitness för valda föräldrar
            const parent1Fitness = fitnessValues.find(
                item => item.parasite.id === parent1.id
            ).fitness;
            
            const parent2Fitness = fitnessValues.find(
                item => item.parasite.id === parent2.id
            ).fitness;
    
            // 3. Skapa en ny parasit från de två föräldrarna
            const newParasite = Evolution.reproduce(
                parent1,
                parent2,
                this.nextParasiteId
            );

            cat.currentParasite = newParasite;//for the baby
    
            // 4. Spara resultatet från denna katt
            evolutionResults.push({
                catId: cat.id,
                reproduced: true,
                parasiteId: newParasite.id,
                parent1: parent1.id,
                parent1Fitness: parent1Fitness,
                parent2: parent2.id,
                parent2Fitness: parent2Fitness,
                mutations: newParasite.mutations
            });
    
            // Nästa parasit får ett nytt ID
            this.nextParasiteId++;
    
            // 5. Töm kattens lista inför nästa evolution
            cat.eatenParasites = [];
        }
    
        // 6. Öka den globala generationen
        this.generation++;
    
        // 7. Skicka hela evolutionens resultat till GUI
        if (this.onEvolution) {
            this.onEvolution({
                generation: this.generation,
                results: evolutionResults
            });
        }
    
        // 8. Starta om den globala evolutionstimern
        this.reproductionTimer.reset();
    }

    catDefecates(cat) {
        if (cat.poopCount >= cat.maxPoops) {
            return;
        }

        let parasiteInPoo = null;
        if (cat.currentParasite) {
            if (cat.parasiteInPoopCount < 4) {
                parasiteInPoo = cat.currentParasite;
                cat.parasiteInPoopCount++;
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

        //global reproduction timer: 
        this.reproductionTimer.update(deltaTime);
        if (this.reproductionTimer.isFinished()) {
            this.runEvolution();
        }
       
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
            const rat = this.rats[i];
            this.behaviourstore[i].update(rat, deltaTime, this.canvas, this.poos);

            if (rat.isDead || rat.isCaught) {
                if (rat.respawnTimeRemaining === null) {
                    rat.respawnTimeRemaining = 5;
                }

                rat.respawnTimeRemaining -= deltaTime;
                if (rat.respawnTimeRemaining <= 0) {
                    this.respawnRat(rat);
                }
            }
            
            if (!rat.isCaught && !rat.isDead) {
                rat.draw(this.ctx);
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