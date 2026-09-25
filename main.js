import Simulation from "./simulation.js";
//Hämta canvas → skapa simulation → starta simulationen.

const canvas = document.getElementById("simulationCanvas");

const simulation = new Simulation(canvas);

simulation.start();