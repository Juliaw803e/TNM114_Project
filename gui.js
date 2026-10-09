import Simulation from "./simulation.js";

export default class GUI {
    constructor(canvas) {
        this.canvas = canvas;

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
            if (!this.simulation) {
                 // Reset evolution info
                this.evolutionInfo.innerHTML = `
                    <h3>Latest Evolution</h3>
                    <p>Waiting for first evolution...</p>
                `;
                const numberOfCats = Number(catInput.value);
                const numberOfRats = Number(ratInput.value);
                const numberOfParasites = Number(parasiteInput.value);

        
                this.simulation = new Simulation(
                    this.canvas,
                    numberOfRats,
                    numberOfCats,
                    numberOfParasites,
                    (evolutionInfo) => this.showEvolution(evolutionInfo)//callback till GUI
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

    //Anpassad för den globala: 
    showEvolution(evolutionInfo) {
        let evolutionText = "";
    
        for (const result of evolutionInfo.results) {
    
            evolutionText += `
                <div>
                    <h3><strong>Cat ${result.catId}</strong></h3>
            `;
    
            if (!result.reproduced) {
    
                evolutionText += `
                    <p>Not enough parasites for reproduction</p>
                `;
    
            } else {
    
                evolutionText += `
                    <p>New parasite: #${result.parasiteId}</p>
                    <p> Parent 1: #${result.parent1} — Fitness: ${result.parent1Fitness.toFixed(2)}</p>
                    <p> Parent 2: #${result.parent2} — Fitness: ${result.parent2Fitness.toFixed(2)}</p>
    
                    <h2><strong>Mutations:</strong></h2>
                `;
    
                if (result.mutations.length === 0) {
    
                    evolutionText += `
                        <p>No mutation occurred</p>
                    `;
    
                } else {
    
                    for (const mutation of result.mutations) {
                        evolutionText += `
                            <p>
                                ${mutation.gene}:
                                ${mutation.oldValue.toFixed(2)}
                                →
                                ${mutation.newValue.toFixed(2)}
                            </p>
                        `;
                    }
                }
            }
    
            evolutionText += `
                </div>
                <hr>
            `;
        }
    
        this.evolutionInfo.innerHTML = `
            <h3>Latest Evolution</h3>
            ${evolutionText}
        `;
    }
}