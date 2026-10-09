import Timer from "../timer.js";
export class CatBehaviour {
    constructor(cat, rats, onRatCaught, onPoop) {
        this.cat = cat;
        this.rats = rats;
        this.targetRat = null;
        this.onRatCaught = onRatCaught;
        this.onPoop = onPoop;

        this.detectionRadius = 100;
        this.catchDistance = 30;

        this.eatingTimer = new Timer(1); // stannar i 1.5 sekunder

        this.directionX = Math.random() * 2 - 1;
        this.directionY = Math.random() * 2 - 1;
    }

    update(deltaTime, canvas) {
        //Stanna när den fångat råtta och äta
        if (this.cat.isEating) {
            this.eatingTimer.update(deltaTime);
    
            if (this.eatingTimer.isFinished()) {
                this.cat.isEating = false;
                this.eatingTimer.reset();
    
                // Nu räknas råttan som uppäten
                this.onRatCaught(this.cat, this.cat.eatingRat);
                this.cat.eatingRat = null;
            }
    
            return;
        }

        this.cat.spriteFlipTimer += deltaTime;
        if (this.cat.spriteFlipTimer >= 1) {
            this.cat.spriteFlipTimer %= 1;
            this.cat.spriteFlipped = !this.cat.spriteFlipped;
        }

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
            this.cat.hasEaten &&
            this.cat.poopTimer.isFinished() &&
            this.cat.poopCount < this.cat.maxPoops
        ) {
            this.onPoop(this.cat);
            this.cat.poopTimer.reset();
        }
    }

    findTarget() {
        for (const rat of this.rats) {

            const dx = rat.x - this.cat.x;
            const dy = rat.y - this.cat.y;

            const distance = Math.sqrt(dx * dx + dy * dy);

            if (!rat.isCaught && !rat.isDead && distance < this.detectionRadius) {
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

        if (rat.isDead || rat.isCaught) {
            this.loseTarget();
            return;
        }

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
            this.cat.spriteAngle = Math.atan2(dy, dx) + Math.PI / 2;
            this.cat.x += (dx / distance) * this.cat.speed * deltaTime;
            this.cat.y += (dy / distance) * this.cat.speed * deltaTime;
        }

        this.keepInsideCanvas(canvas);
    }

    catchRat() {
        const rat = this.targetRat;
    
        rat.isCaught = true;
        rat.isHunted = false;
        rat.huntedBy = null;
    
        // Katten stannar och "äter"
        this.cat.isEating = true;
        this.cat.eatingRat = rat;
    
        // Starta ät-timern
        this.eatingTimer.reset();
    
        this.targetRat = null;
    }

    loseTarget() {
        this.targetRat.isHunted = false;
        this.targetRat.huntedBy = null;
    
        this.targetRat = null;
    }

    move(deltaTime, canvas) {
        if (this.directionX !== 0 || this.directionY !== 0) {
            this.cat.spriteAngle = Math.atan2(this.directionY, this.directionX) + Math.PI / 2;
        }
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
}