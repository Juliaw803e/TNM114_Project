class RatBehaviour {
    constructor(onPooEaten = () => {}) {
        this.onPooEaten = onPooEaten;
        this.targetPoo = null;
        this.directionX = Math.random() * 2 - 1;
        this.directionY = Math.random() * 2 - 1;

        this.directionTimer = 0;
        this.directionChangeTime = 1 + Math.random() * 3; // byt riktning var random sekund
    }

    //deltaTime som andra parameter
    update(rat, deltaTime, canvas, poos) {
        //stanna om den fångats av katten
        if (rat.isCaught) {
            return;
        }

        if (rat.isDead || rat.isCaught) {
            return;
        }

        rat.spriteFlipTimer += deltaTime;
        if (rat.spriteFlipTimer >= 1) {
            rat.spriteFlipTimer %= 1;
            rat.spriteFlipped = !rat.spriteFlipped;
        }

        if (rat.deathTime !== null) {
            rat.infectionTime += deltaTime;
        }

        if (rat.parasite) {
            rat.parasiteAge += deltaTime;
            if (rat.parasiteAge >= rat.parasiteLifetime) {
                rat.clearParasite();
            }
        }

        if (rat.deathTime !== null && rat.infectionTime >= rat.deathTime) {
            rat.isDead = true;
            rat.isHunted = false;
            rat.huntedBy = null;
            rat.isEating = false;
            return;
        }

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
        if (this.directionX !== 0 || this.directionY !== 0) {
            rat.spriteAngle = Math.atan2(this.directionY, this.directionX) + Math.PI / 2;
        }
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
        const manipulation = rat.parasite?.manipulation ?? 0;
        // Ju högre manipulation, desto lägre flykthastighet (vid 1.0 är flykthastigheten 0)
        const fleeSpeed = rat.speed * (1 - manipulation);
    
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

            if (dx !== 0 || dy !== 0) {
                rat.spriteAngle = Math.atan2(dy, dx) + Math.PI / 2;
            }
    
            rat.x += dx * fleeSpeed * deltaTime;
            rat.y += dy * fleeSpeed * deltaTime;
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
                this.targetPoo = poo;
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
            if (this.targetPoo) {
                this.onPooEaten(rat, this.targetPoo);
                this.targetPoo = null;
            }

            if (rat.parasite) {
                rat.infectionTime = 0;
            }
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