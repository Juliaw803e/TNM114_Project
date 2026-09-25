export class CatBehaviour {
    constructor(cat, rats) {
        this.cat = cat;
        this.rats = rats;

        this.detectionRadius = 80;
        this.directionX = Math.random() * 2 - 1;
        this.directionY = Math.random() * 2 - 1;
    }

    update(deltaTime) {
        let closestRat = null;
        let closestDistance = this.detectionRadius;

        // Look for a rat nearby
        for (const rat of this.rats) {
            const dx = rat.x - this.cat.x;
            const dy = rat.y - this.cat.y;

            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestRat = rat;
            }
        }

        // If a rat is nearby, move towards it
        if (closestRat) {
            const dx = closestRat.x - this.cat.x;
            const dy = closestRat.y - this.cat.y;

            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0) {
                this.cat.x += (dx / distance) * this.cat.speed * deltaTime;
                this.cat.y += (dy / distance) * this.cat.speed * deltaTime;
            }
        }

        // Otherwise, wander around
        else {
            this.cat.x += this.directionX * this.cat.speed * deltaTime;
            this.cat.y += this.directionY * this.cat.speed * deltaTime;
        }

        // Keep cat inside canvas
        if (this.cat.x < 0 || this.cat.x > 800) {
            this.directionX *= -1;
        }

        if (this.cat.y < 0 || this.cat.y > 600) {
            this.directionY *= -1;
        }
    }
}