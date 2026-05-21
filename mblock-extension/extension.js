const Scratch = require('scratch-vm');

class AntwarExtension {
  constructor(runtime) {
    this.runtime = runtime;
    this.ants = [];
    this.food = [];
    this.pheromones = [];
    this.simulationSpeed = 1;
  }

  getInfo() {
    return {
      id: 'antwar',
      name: 'Antwar',
      blocks: [
        {
          opcode: 'createAnt',
          text: 'créer une fourmi à [X] [Y] avec énergie [ENERGY]',
          blockType: Scratch.BlockType.COMMAND,
          arguments: {
            X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 },
            Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 },
            ENERGY: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 }
          }
        },
        {
          opcode: 'addFood',
          text: 'ajouter nourriture à [X] [Y]',
          blockType: Scratch.BlockType.COMMAND,
          arguments: {
            X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 200 },
            Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 200 }
          }
        },
        {
          opcode: 'getAntCount',
          text: 'nombre de fourmis',
          blockType: Scratch.BlockType.REPORTER
        },
        {
          opcode: 'getFoodCount',
          text: 'quantité de nourriture',
          blockType: Scratch.BlockType.REPORTER
        },
        {
          opcode: 'moveAnts',
          text: 'déplacer toutes les fourmis',
          blockType: Scratch.BlockType.COMMAND
        },
        {
          opcode: 'setSimulationSpeed',
          text: 'vitesse simulation [SPEED]',
          blockType: Scratch.BlockType.COMMAND,
          arguments: {
            SPEED: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
          }
        },
        {
          opcode: 'resetSimulation',
          text: 'réinitialiser la simulation',
          blockType: Scratch.BlockType.COMMAND
        },
        {
          opcode: 'getAntEnergy',
          text: 'énergie de la fourmi [ID]',
          blockType: Scratch.BlockType.REPORTER,
          arguments: {
            ID: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
          }
        },
        {
          opcode: 'getAntX',
          text: 'position X de la fourmi [ID]',
          blockType: Scratch.BlockType.REPORTER,
          arguments: {
            ID: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
          }
        },
        {
          opcode: 'getAntY',
          text: 'position Y de la fourmi [ID]',
          blockType: Scratch.BlockType.REPORTER,
          arguments: {
            ID: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
          }
        }
      ]
    };
  }

  createAnt(args) {
    this.ants.push({
      id: this.ants.length,
      x: args.X,
      y: args.Y,
      energy: args.ENERGY,
      maxEnergy: args.ENERGY,
      direction: Math.random() * 360,
      carryingFood: false,
      speed: 2
    });
  }

  addFood(args) {
    this.food.push({
      id: this.food.length,
      x: args.X,
      y: args.Y,
      amount: 10
    });
  }

  getAntCount() {
    return this.ants.length;
  }

  getFoodCount() {
    let total = 0;
    this.food.forEach(f => {
      total += f.amount;
    });
    return total;
  }

  moveAnts() {
    // Appliquer la vitesse de simulation
    for (let i = 0; i < this.simulationSpeed; i++) {
      this.ants.forEach(ant => {
        // Mouvement aléatoire
        ant.direction += (Math.random() - 0.5) * 30;
        ant.direction = ant.direction % 360;

        const angle = ant.direction * Math.PI / 180;
        ant.x += Math.cos(angle) * ant.speed;
        ant.y += Math.sin(angle) * ant.speed;

        // Consommation d'énergie
        ant.energy -= 0.5;

        // Chercher de la nourriture
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

        // Se diriger vers la nourriture si proche
        if (closestFood && closestDistance < 100) {
          const dx = closestFood.x - ant.x;
          const dy = closestFood.y - ant.y;
          ant.direction = Math.atan2(dy, dx) * 180 / Math.PI;

          // Manger si très proche
          if (closestDistance < 10 && closestFood.amount > 0) {
            ant.carryingFood = true;
            closestFood.amount--;
            ant.energy = Math.min(ant.energy + 20, ant.maxEnergy);
          }
        }

        // Boundaries (rebondissement)
        if (ant.x < 0 || ant.x > 480) ant.direction = 180 - ant.direction;
        if (ant.y < 0 || ant.y > 360) ant.direction = -ant.direction;

        ant.x = Math.max(0, Math.min(480, ant.x));
        ant.y = Math.max(0, Math.min(360, ant.y));
      });

      // Supprimer les fourmis mortes et la nourriture vide
      this.ants = this.ants.filter(ant => ant.energy > 0);
      this.food = this.food.filter(food => food.amount > 0);
    }
  }

  setSimulationSpeed(args) {
    this.simulationSpeed = Math.max(1, Math.min(10, args.SPEED));
  }

  resetSimulation() {
    this.ants = [];
    this.food = [];
    this.pheromones = [];
    this.simulationSpeed = 1;
  }

  getAntEnergy(args) {
    const antId = Math.floor(args.ID);
    if (antId >= 0 && antId < this.ants.length) {
      return Math.round(this.ants[antId].energy);
    }
    return 0;
  }

  getAntX(args) {
    const antId = Math.floor(args.ID);
    if (antId >= 0 && antId < this.ants.length) {
      return Math.round(this.ants[antId].x);
    }
    return 0;
  }

  getAntY(args) {
    const antId = Math.floor(args.ID);
    if (antId >= 0 && antId < this.ants.length) {
      return Math.round(this.ants[antId].y);
    }
    return 0;
  }
}

module.exports = AntwarExtension;
