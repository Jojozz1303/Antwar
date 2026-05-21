/* eslint-disable no-unused-vars */

const BlockType = require('../../extension-support/block-type');
const ColorPalette = require('../../extension-support/color-palette');
const ArgumentType = require('../../extension-support/argument-type');
const TargetType = require('../../types/target-type');

/**
 * Class for Antwar extension
 */
class AntwarExtension {
    /**
     * @param {Runtime} runtime - the Scratch 3.0 runtime
     */
    constructor(runtime) {
        this.runtime = runtime;
        this.ants = [];
        this.food = [];
        this.simulationSpeed = 1;
        this.isRunning = false;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: 'antwar',
            name: 'Antwar',
            blockIconURI: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHJ4PSI4IiBmaWxsPSIjNjY3ZWVhIi8+PHBhdGggZD0iTTIwIDEwQzE2IDEwIDE0IDE0IDE0IDE4QzE0IDE5IDE0IDIwIDE0IDIwQzE0IDI0IDE2IDI4IDE4IDMwTDIyIDMwTDIyIDI4TDIwIDI4QzE4IDI4IDE3IDI1IDE3IDIwQzE3IDE5IDE3IDE4IDE3IDE4QzE3IDE1IDE4IDEyIDIwIDEyQzIyIDEyIDIzIDE1IDIzIDE4QzIzIDE5IDIzIDIwIDIzIDIwQzIzIDI1IDIyIDI4IDIwIDI4TDIwIDMwTDI0IDMwQzI2IDI4IDI4IDI0IDI4IDIwQzI4IDIwIDI4IDE5IDI4IDE4QzI4IDE0IDI2IDEwIDIwIDEwWiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=',
            blocks: [
                {
                    opcode: 'createAnt',
                    blockType: BlockType.COMMAND,
                    text: 'créer une fourmi à x:[X] y:[Y] énergie:[ENERGY]',
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        },
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        },
                        ENERGY: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        }
                    }
                },
                {
                    opcode: 'addFood',
                    blockType: BlockType.COMMAND,
                    text: 'ajouter nourriture à x:[X] y:[Y]',
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 200
                        },
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 200
                        }
                    }
                },
                {
                    opcode: 'moveAnts',
                    blockType: BlockType.COMMAND,
                    text: 'déplacer toutes les fourmis'
                },
                {
                    opcode: 'getAntCount',
                    blockType: BlockType.REPORTER,
                    text: 'nombre de fourmis'
                },
                {
                    opcode: 'getFoodCount',
                    blockType: BlockType.REPORTER,
                    text: 'quantité de nourriture'
                },
                {
                    opcode: 'setSimulationSpeed',
                    blockType: BlockType.COMMAND,
                    text: 'vitesse simulation [SPEED]',
                    arguments: {
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'resetSimulation',
                    blockType: BlockType.COMMAND,
                    text: 'réinitialiser la simulation'
                }
            ],
            menus: {
            }
        };
    }

    /**
     * Create an ant at specified coordinates
     */
    createAnt(args) {
        this.ants.push({
            id: this.ants.length,
            x: parseFloat(args.X),
            y: parseFloat(args.Y),
            energy: parseFloat(args.ENERGY),
            maxEnergy: parseFloat(args.ENERGY),
            direction: Math.random() * 360,
            carryingFood: false,
            speed: 2
        });
    }

    /**
     * Add food at specified coordinates
     */
    addFood(args) {
        this.food.push({
            id: this.food.length,
            x: parseFloat(args.X),
            y: parseFloat(args.Y),
            amount: 10
        });
    }

    /**
     * Move all ants in the simulation
     */
    moveAnts() {
        for (let i = 0; i < this.simulationSpeed; i++) {
            this.ants.forEach(ant => {
                // Random walk
                ant.direction += (Math.random() - 0.5) * 30;
                ant.direction = ant.direction % 360;

                const angle = ant.direction * Math.PI / 180;
                ant.x += Math.cos(angle) * ant.speed;
                ant.y += Math.sin(angle) * ant.speed;

                // Energy consumption
                ant.energy -= 0.5;

                // Find closest food
                let closestFood = null;
                let closestDistance = Infinity;

                this.food.forEach(food => {
                    const dx = food.x - ant.x;
                    const dy = food.y - ant.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestFood = food;
                    }
                });

                // Move towards food if close
                if (closestFood && closestDistance < 100) {
                    const dx = closestFood.x - ant.x;
                    const dy = closestFood.y - ant.y;
                    ant.direction = Math.atan2(dy, dx) * 180 / Math.PI;

                    // Eat food if very close
                    if (closestDistance < 10 && closestFood.amount > 0) {
                        ant.carryingFood = true;
                        closestFood.amount--;
                        ant.energy = Math.min(ant.energy + 20, ant.maxEnergy);
                    }
                }

                // Boundaries
                if (ant.x < 0 || ant.x > 480) ant.direction = 180 - ant.direction;
                if (ant.y < 0 || ant.y > 360) ant.direction = -ant.direction;

                ant.x = Math.max(0, Math.min(480, ant.x));
                ant.y = Math.max(0, Math.min(360, ant.y));
            });

            // Remove dead ants and empty food
            this.ants = this.ants.filter(ant => ant.energy > 0);
            this.food = this.food.filter(food => food.amount > 0);
        }
    }

    /**
     * Get ant count
     */
    getAntCount() {
        return this.ants.length;
    }

    /**
     * Get total food amount
     */
    getFoodCount() {
        let total = 0;
        this.food.forEach(f => {
            total += f.amount;
        });
        return total;
    }

    /**
     * Set simulation speed
     */
    setSimulationSpeed(args) {
        this.simulationSpeed = Math.max(1, Math.min(10, parseFloat(args.SPEED)));
    }

    /**
     * Reset simulation
     */
    resetSimulation() {
        this.ants = [];
        this.food = [];
        this.simulationSpeed = 1;
    }
}

module.exports = AntwarExtension;
