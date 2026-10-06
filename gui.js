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
        catLabel.textContent = "Antal katter: ";
    
        const catInput = document.createElement("input");
        catInput.type = "number";
        catInput.min = "1";
        catInput.value = "2";
    
        catLabel.appendChild(catInput);
        gui.appendChild(catLabel);
    
        //Antal råttor: 
        const ratLabel = document.createElement("label");
        ratLabel.textContent = "Antal råttor: ";
    
        const ratInput = document.createElement("input");
        ratInput.type = "number";
        ratInput.min = "3";
        ratInput.value = "10";
    
        ratLabel.appendChild(ratInput);
        gui.appendChild(ratLabel);

        //Antal parasiter: 
        const parasiteInput = document.createElement("input");
        parasiteInput.type = "number";
        parasiteInput.min = "1";
        parasiteInput.value = "3";

        // Sätt max från början
        parasiteInput.max = ratInput.value;

        // Uppdatera max om antal råttor ändras
        ratInput.addEventListener("input", () => {
            parasiteInput.max = ratInput.value;

            if (Number(parasiteInput.value) > Number(ratInput.value)) {
                parasiteInput.value = ratInput.value;
            }
        });

        const parasiteLabel = document.createElement("label");
        parasiteLabel.textContent = "Number of parasites:";

        gui.appendChild(parasiteLabel);
        gui.appendChild(parasiteInput);

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
            <h3>Evolution</h3>
            <p>Next evolution: --</p>
            <p>Generation: 0</p>
        `;

        this.evolutionStatus = evolutionStatus;
        gui.appendChild(evolutionStatus);

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
            <h3>Evolution</h3>
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
                    <p><strong>Cat ${result.catId}</strong></p>
            `;
    
            if (!result.reproduced) {
    
                evolutionText += `
                    <p>Not enough parasites for reproduction</p>
                `;
    
            } else {
    
                evolutionText += `
                    <p>New parasite: #${result.parasiteId}</p>
                    <p>
                        Parents:
                        #${result.parent1} + #${result.parent2}
                    </p>
    
                    <strong>Mutations:</strong>
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
            <p>Generation: ${evolutionInfo.generation}</p>
            ${evolutionText}
        `;
    }

    //Visa indivudella gammal!: 
    /*showMutation(mutationInfo) {
        let mutationText = "";
    
        if (mutationInfo.mutations.length === 0) {
            mutationText = "No mutation occurred";
        } else {
            for (const mutation of mutationInfo.mutations) {
                mutationText += `
                    <p>
                        ${mutation.gene}:
                        ${mutation.oldValue.toFixed(2)}
                        →
                        ${mutation.newValue.toFixed(2)}
                    </p>
                `;
            }
        }
    
        this.evolutionInfo.innerHTML = `
            <h3>Latest Evolution</h3>
            <p>New parasite: #${mutationInfo.id}</p>
            <p>Parents: #${mutationInfo.parent1} + #${mutationInfo.parent2}</p>
            <strong>Mutations:</strong>
            ${mutationText}
        `;
    }*/
}