class RatBehaviour {
    constructor(){
        this.directionX = Math.random() * 2 - 1;
        this.directionY = Math.random() * 2 - 1;

        this.directionTimer = 0;
        this.directionChangeTime = 1 + Math.random() * 3; // byt riktning var random sekund
    }

    //deltaTime som andra parameter
    update(rat, deltaTime, canvas, poos) {
        if (rat.isHunted) {
            this.flee(rat, deltaTime, canvas);
        } 
        else if (rat.isEating) {
            this.eat(rat, deltaTime);
        } 
        else {
            this.findPoo(rat, poos);
            
            if (!rat.isEating) {
                this.move(rat, deltaTime, canvas);
            }
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
        this.handleEdges(rat, canvas);
    }

    flee(rat, deltaTime, canvas) {
        const cat = rat.huntedBy;
    
        if (!cat) {
            return;
        }
    
        let dx = rat.x - cat.x;
        let dy = rat.y - cat.y;
    
        const distance = Math.sqrt(dx * dx + dy * dy);
    
        if (distance > 0) {
            dx /= distance;
            dy /= distance;
    
            // Tvinga råttan bort från kanten
            if (rat.x <= 10 && dx < 0) {
                dx = 0;
            }
    
            if (rat.x >= canvas.width - 10 && dx > 0) {
                dx = 0;
            }
    
            if (rat.y <= 10 && dy < 0) {
                dy = 0;
            }
    
            if (rat.y >= canvas.height - 10 && dy > 0) {
                dy = 0;
            }
    
            rat.x += dx * rat.speed * 1.5 * deltaTime;
            rat.y += dy * rat.speed * 1.5 * deltaTime;
        }
    
        this.handleEdges(rat, canvas);
    }

    findPoo(rat, poos) {
        for (const poo of poos) {
    
            const dx = poo.x - rat.x;
            const dy = poo.y - rat.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
    
            if (distance < 20 && !rat.isEating) {
                rat.isEating = true;
                rat.eatingTimer.reset();
                return;
            }
        }
    }

    eat(rat, deltaTime) {
        rat.eatingTimer.update(deltaTime);
    
        if (rat.eatingTimer.isFinished()) {
            rat.isEating = false;
            rat.eatingTimer.reset();
        }
    }

    handleEdges(rat, canvas) {
        if (rat.x < 10) {
            rat.x = 10;
        }

        if (rat.x > canvas.width - 10) {
            rat.x = canvas.width - 10;
        }

        if (rat.y < 10) {
            rat.y = 10;
        }

        if (rat.y > canvas.height - 10) {
            rat.y = canvas.height - 10;
        }
    }
}

export default RatBehaviour;