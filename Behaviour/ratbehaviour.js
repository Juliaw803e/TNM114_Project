class RatBehaviour {
    //OBS här ska vi oxå implementera att de vänder när d når kanten

    //deltaTime som andra parameter
    update(rat, deltaTime) {
        rat.hungerTimer.update(deltaTime);
        if (rat.hungerTimer.isFinished()) {
            rat.hunger = 1;
        }

        if (rat.isHunted) {
            this.flee(rat);
        } else if (rat.isEating) {
            this.eat(rat);
        } else {
            this.move(rat);
        }
    }

    move(rat) {   
        rat.x += rat.speed;
    }

    flee(rat) {
        rat.x -= rat.speed * 2;
    }

    eat(rat) {
        // Eating behaviour will be implemented later
    }
}

export default RatBehaviour;