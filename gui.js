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
                const numberOfCats = Number(catInput.value);
                const numberOfRats = Number(ratInput.value);
                const numberOfParasites = Number(parasiteInput.value);

        
                this.simulation = new Simulation(
                    this.canvas,
                    numberOfRats,
                    numberOfCats,
                    numberOfParasites,
                    (mutationInfo) => this.showMutation(mutationInfo) //callback till GUI
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

        //Informationsruta om mutationer:---------------
        const evolutionInfo = document.createElement("div");
        evolutionInfo.id = "evolution-info";

        evolutionInfo.innerHTML = `
            <h3>Latest Evolution</h3>
            <p>Waiting for first mutation...</p>
        `;

        this.evolutionInfo = evolutionInfo; //spara denna så evolution kan uppdatera
        gui.appendChild(evolutionInfo);
    
        document.body.appendChild(gui);
    }

    //Visa 
    showMutation(mutationInfo) {
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
            <p>Generation: ${mutationInfo.generation}</p>
            <strong>Mutations:</strong>
            ${mutationText}
        `;
    }
}