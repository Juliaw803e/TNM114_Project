import Poo from "../Entities/poo.js";

export class CatBehaviour {
    constructor(cat, rats, poos) {
        this.cat = cat;
        this.rats = rats;
        this.targetRat = null;
        this.poos = poos;

        this.detectionRadius = 40; 
        this.catchDistance = 30;

        this.directionX = Math.random() * 2 - 1;
        this.directionY = Math.random() * 2 - 1;
    }

    update(deltaTime, canvas) {
        //Har en råtta den jagar?
        if (this.targetRat) {
            this.chase(deltaTime, canvas);
        } else {
            this.findTarget();

            if (this.targetRat) {
                this.startHunt();
            }
            else{
                this.move(deltaTime, canvas);
            }
        }

         // Hantera poop: 
        this.cat.poopTimer.update(deltaTime);

        if (
            this.cat.poopTimer.isFinished() &&
            this.cat.poopCount < this.cat.maxPoops
        ) {
            this.poop();
            this.cat.poopTimer.reset();
        }
    }

    findTarget() {
        for (const rat of this.rats) {

            const dx = rat.x - this.cat.x;
            const dy = rat.y - this.cat.y;

            const distance = Math.sqrt(dx * dx + dy * dy);

            if (!rat.isCaught && distance < this.detectionRadius) {
                this.targetRat = rat;
                return;
            }
        }
    }

    startHunt() {
        this.targetRat.isHunted = true;
        this.targetRat.huntedBy = this.cat;
    }

    chase(deltaTime, canvas) {
        const rat = this.targetRat;

        const dx = rat.x - this.cat.x;
        const dy = rat.y - this.cat.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        // Katten fångar råttan
        if (distance < this.catchDistance) {
            this.catchRat();
            return;
        }
        //Råttan kommer undan
        if (distance > 200) {
            this.loseTarget();
            return;
        }

        if (distance > 0) {
            this.cat.x += (dx / distance) * this.cat.speed * deltaTime;
            this.cat.y += (dy / distance) * this.cat.speed * deltaTime;
        }

        this.keepInsideCanvas(canvas);
    }

    catchRat() {
         // Vad som händer med råttan efter att katten fångat den
        // kan vi bestämma senare.
        this.targetRat.isCaught = true;

        this.targetRat.isHunted = false;
        this.targetRat.huntedBy = null;
    
        this.targetRat = null;
        this.cat.poopTimer.reset(); //När den fångat börjar timern

    }
    loseTarget() {
        this.targetRat.isHunted = false;
        this.targetRat.huntedBy = null;
    
        this.targetRat = null;
    }

    move(deltaTime, canvas) {
        this.cat.x += this.directionX * this.cat.speed * deltaTime;
        this.cat.y += this.directionY * this.cat.speed * deltaTime;

        this.keepInsideCanvas(canvas);
    }

    keepInsideCanvas(canvas) {
        if (this.cat.x < 10) {
            this.cat.x = 10;
            this.directionX *= -1;
        }

        if (this.cat.x > canvas.width - 10) {
            this.cat.x = canvas.width - 10;
            this.directionX *= -1;
        }

        if (this.cat.y < 10) {
            this.cat.y = 10;
            this.directionY *= -1;
        }

        if (this.cat.y > canvas.height - 10) {
            this.cat.y = canvas.height - 10;
            this.directionY *= -1;
        }
    }

    //Nu poopar den alltid efter 6 sekunder, om den måste ätit inann så ska vi lägga in en flagga
    poop() {
        if (this.cat.poopCount < this.cat.maxPoops) {
            const poo = new Poo(this.cat.x, this.cat.y);
    
            this.poos.push(poo);
    
            this.cat.poopCount++;
        }
    }
}