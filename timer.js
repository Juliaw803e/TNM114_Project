class Timer {
    constructor(duration) {
        this.duration = duration;
        this.elapsed = 0;
        this.finished = false;
    }

    update(deltaTime) {
        if (this.finished) return;

        this.elapsed += deltaTime;

        if (this.elapsed >= this.duration) {
            this.finished = true;
        }
    }

    reset() {
        this.elapsed = 0;
        this.finished = false;
    }

    isFinished() {
        return this.finished;
    }

    //For countdown: 
    getTimeLeft() {
        return Math.max(0, this.duration - this.elapsed);
    }
}

export default Timer;