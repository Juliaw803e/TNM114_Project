class RatBehaviour {
    constructor(){
        this.directionX = Math.random() * 2 - 1;
        this.directionY = Math.random() * 2 - 1;

        this.directionTimer = 0;
        this.directionChangeTime = 1 + Math.random() * 3; // byt riktning var random sekund
    }

    //deltaTime som andra parameter
    update(rat, deltaTime, canvas) {
        rat.hungerTimer.update(deltaTime);
        if (rat.hungerTimer.isFinished()) {
            rat.hunger = 1;
        }

        if (rat.isHunted) {
            this.flee(rat);
        } else if (rat.isEating) {
            this.eat(rat);
        } else {
            this.move(rat, deltaTime, canvas);
        }
    }

    move(rat, deltaTime, canvas) {
        //rat.x += rat.speed;
        // Timer för att byta riktning
        this.directionTimer += deltaTime;

        if (this.directionTimer >= this.directionChangeTime) {
            this.directionX = Math.random() * 2 - 1;
            this.directionY = Math.random() * 2 - 1;

            this.directionTimer = 0;
            this.directionChangeTime = 1 + Math.random() * 3;
        }

        // Flytta råttan
        rat.x += this.directionX * rat.speed * deltaTime;
        rat.y += this.directionY * rat.speed * deltaTime;

        // Håll råttan inne i canvasen 
        if (rat.x < 10) {
            rat.x = 10;
            this.directionX *= -1;
        }
    
        if (rat.x > canvas.width - 10) {
            rat.x = canvas.width - 10;
            this.directionX *= -1;
        }
    
        if (rat.y < 10) {
            rat.y = 10;
            this.directionY *= -1;
        }
    
        if (rat.y > canvas.height - 10) {
            rat.y = canvas.height - 10;
            this.directionY *= -1;
        }
    }

    flee(rat) {
        rat.x -= rat.speed * 2;
    }

    eat(rat) {
        // Eating behaviour will be implemented later poo
    }
}

export default RatBehaviour;