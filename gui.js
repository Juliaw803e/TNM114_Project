import Simulation from "./simulation.js";

export default class GUI {
    constructor(canvas) {
        this.canvas = canvas;
        this.catActions = [];
        this.bestFitness = null;
        this.currentEvolutionRound = null;

        this.createGUI();
    }

    createGUI() {
        const gui = document.createElement("div");
        gui.id = "gui";
        
        //Antal katter: 
        const catLabel = document.createElement("label");

        const catHeading = document.createElement("h3");
        catHeading.textContent = "Number of cats:";

        const catInput = document.createElement("input");
        catInput.type = "number";
        catInput.min = "1";
        catInput.value = "2";

        catLabel.appendChild(catHeading);
        catLabel.appendChild(catInput);
        gui.appendChild(catLabel);
    
        //Antal råttor: 
        // Number of rats
        const ratLabel = document.createElement("label");

        const ratHeading = document.createElement("h3");
        ratHeading.textContent = "Number of rats:";

        const ratInput = document.createElement("input");
        ratInput.type = "number";
        ratInput.min = "3";
        ratInput.value = "10";

        ratLabel.appendChild(ratHeading);
        ratLabel.appendChild(ratInput);
        gui.appendChild(ratLabel);

        //Antal parasiter: 
        const parasiteLabel = document.createElement("label");

        const parasiteHeading = document.createElement("h3");
        parasiteHeading.textContent = "Number of parasites:";

        const parasiteInput = document.createElement("input");
        parasiteInput.type = "number";
        parasiteInput.min = "1";
        parasiteInput.value = "3";
        parasiteInput.max = ratInput.value;

        // Update the maximum number of parasites when the number of rats changes
        ratInput.addEventListener("input", () => {
            parasiteInput.max = ratInput.value;

            if (Number(parasiteInput.value) > Number(ratInput.value)) {
                parasiteInput.value = ratInput.value;
            }
        });

        parasiteLabel.appendChild(parasiteHeading);
        parasiteLabel.appendChild(parasiteInput);
        gui.appendChild(parasiteLabel);

        //Startstopknapp och pauseknapp: 
        const startStopButton = document.createElement("button");
        startStopButton.textContent = "Start";
        const pauseButton = document.createElement("button");
        pauseButton.textContent = "Paus";

        startStopButton.addEventListener("click", () => {
            if (!this.simulation || !this.simulation.isRunning) {
                 // Reset evolution info
                this.evolutionInfo.innerHTML = `
                    <h3>Cat actions and transmission fitness</h3>
                    <p>Waiting for first evolution...</p>
                `;
                this.catActions = [];
                this.bestFitness = null;
                this.currentEvolutionRound = null;
                const numberOfCats = Number(catInput.value);
                const numberOfRats = Number(ratInput.value);
                const numberOfParasites = Number(parasiteInput.value);

        
                this.simulation = new Simulation(
                    this.canvas,
                    numberOfRats,
                    numberOfCats,
                    numberOfParasites,
                    (evolutionInfo) => this.showEvolution(evolutionInfo), //callback till GUI
                    () => {
                        startStopButton.textContent = "Start";
                        pauseButton.textContent = "Paus";
                        this.updateEvolutionStatus();
                    },
                    action => this.showCatAction(action)
                );
        
                this.simulation.start();
                startStopButton.textContent = "Stop";
            } else if (this.simulation.isRunning) {
                this.simulation.stop();
                this.simulation = null;

                startStopButton.textContent = "Start";
                pauseButton.textContent = "Paus";
            }
        });

        pauseButton.addEventListener("click", () => {
            if (!this.simulation || !this.simulation.isRunning) {
                return;
            }
        
            if (this.simulation.isPaused) {
                this.simulation.resume();
                pauseButton.textContent = "Paus";
            } else {
                this.simulation.pause();
                pauseButton.textContent = "Resume";
            }
        });

        gui.appendChild(startStopButton);
        gui.appendChild(pauseButton);

        //Global timer och generation: -----------------------
        const evolutionStatus = document.createElement("div");
        evolutionStatus.id = "evolution-status";

        evolutionStatus.innerHTML = `
            <h3>Evolution timer</h3>
            <p>Next evolution: --</p>
            <p>Generation: 1</p>
        `;

        this.evolutionStatus = evolutionStatus;
        const canvasWrapper = document.getElementById("canvas-wrapper");
        canvasWrapper.appendChild(evolutionStatus);

        //Informationsruta om mutationer:---------------
        const evolutionInfo = document.createElement("div");
        evolutionInfo.id = "evolution-info";

        evolutionInfo.innerHTML = `
            <h3>Latest Evolution</h3>
            <p>Waiting for first evolution...</p>
        `;

        this.evolutionInfo = evolutionInfo; //spara denna så evolution kan uppdatera
        gui.appendChild(evolutionInfo);
    
       // document.body.appendChild(gui);
        document.getElementById("simulation-container").appendChild(gui);
        this.updateGUI();//for global timer
    }

    //Update global evolution status:
    updateEvolutionStatus() {
        if (!this.simulation) {
            return;
        }

        if (this.simulation.stopReason) {
            const message = this.simulation.stopReason === "parasite-extinction"
                ? "All parasites disappeared"
                : "Mean fitness was identical for 3 consecutive reproductive evolutions";

            this.evolutionStatus.innerHTML = `
                <h3>Simulation ended</h3>
                <p>${message}</p>
                <p>Generation: ${this.simulation.generation}</p>
            `;
            return;
        }
    
        const timeLeft = this.simulation.reproductionTimer.getTimeLeft();
    
        this.evolutionStatus.innerHTML = `
            <h3>Evolution timer</h3>
            <p>Next evolution: ${timeLeft.toFixed(1)} s</p>
            <p>Generation: ${this.simulation.generation}</p>
        `;
    }

    updateGUI() {
        if (this.simulation) {
            this.updateEvolutionStatus();
        }
    
        requestAnimationFrame(() => this.updateGUI());
    }

    showCatAction(action) {
        if (action.round !== this.currentEvolutionRound) {
            this.currentEvolutionRound = action.round;
            this.catActions = [];
        }

        this.catActions.push(action);
        this.renderEvolutionInfo();
    }

    showEvolution(evolutionInfo) {
        this.currentEvolutionRound = evolutionInfo.round;
        this.catActions = evolutionInfo.catActions;
        this.bestFitness = evolutionInfo.bestFitness;
        this.renderEvolutionInfo();
    }

    renderEvolutionInfo() {
        this.evolutionInfo.replaceChildren();

        const actionsHeading = document.createElement("h3");
        actionsHeading.textContent = `Actions in evolution round ${this.currentEvolutionRound ?? 1}`;
        this.evolutionInfo.appendChild(actionsHeading);

        const catIds = new Set([0, 1, ...this.catActions.map(action => action.catId)]);
        for (const catId of catIds) {
            const catHeading = document.createElement("h4");
            catHeading.textContent = `Cat ${catId}`;
            this.evolutionInfo.appendChild(catHeading);

            const catActions = this.catActions.filter(action => action.catId === catId);
            if (catActions.length === 0) {
                const emptyMessage = document.createElement("p");
                emptyMessage.textContent = "No parasite eaten this round.";
                this.evolutionInfo.appendChild(emptyMessage);
                continue;
            }

            const actionList = document.createElement("ul");
            for (const action of catActions) {
                const item = document.createElement("li");
                item.textContent = `Cat ${action.catId} ate parasite ${action.parasiteId}`;
                actionList.appendChild(item);
            }
            this.evolutionInfo.appendChild(actionList);
        }

        const fitnessHeading = document.createElement("h3");
        fitnessHeading.textContent = "Most successful parasite";
        this.evolutionInfo.appendChild(fitnessHeading);

        if (!this.bestFitness) {
            const emptyMessage = document.createElement("p");
            emptyMessage.textContent = "No fitness yet...";
            this.evolutionInfo.appendChild(emptyMessage);
            return;
        }

        const fitness = document.createElement("p");
        fitness.textContent =
            `Parasite ${this.bestFitness.parasiteId}: ` +
            `${this.bestFitness.successfulTransmissions} successful transmissions `;
        this.evolutionInfo.appendChild(fitness);

        const traitsHeading = document.createElement("h4");
        traitsHeading.textContent = "Traits";
        this.evolutionInfo.appendChild(traitsHeading);

        const traitsList = document.createElement("ul");
        for (const [trait, value] of Object.entries(this.bestFitness.traits)) {
            const item = document.createElement("li");
            item.textContent = `${trait}: ${value.toFixed(2)}`;
            traitsList.appendChild(item);
        }
        this.evolutionInfo.appendChild(traitsList);
    }
}