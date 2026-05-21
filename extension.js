const { Block, BlockType, ArgumentType } = Scratch;

class AntwarExtension {
  constructor(runtime) {
    this.runtime = runtime;
    this.ants = [];
    this.food = [];
    this.simulationSpeed = 1;
    this.antSpeed = 1.5;
    this.width = 480;
    this.height = 360;
    this.isRunning = true;
    this.frameCounter = 0;
    
    // Pour CyberPi
    this.cyberpiConnected = false;
  }

  getInfo() {
    return {
      id: 'antwar',
      name: 'Antwar',
      color1: '#667eea',
      color2: '#764ba2',
      color3: '#5568d3',
      blocks: [
        {
          opcode: 'createAnt',
          blockType: BlockType.COMMAND,
          text: 'créer une fourmi à x: [X] y: [Y] énergie: [ENERGY]',
          arguments: {
            X: { type: ArgumentType.NUMBER, defaultValue: 100 },
            Y: { type: ArgumentType.NUMBER, defaultValue: 100 },
            ENERGY: { type: ArgumentType.NUMBER, defaultValue: 100 }
          }
        },
        {
          opcode: 'createMultipleAnts',
          blockType: BlockType.COMMAND,
          text: 'créer [COUNT] fourmis avec énergie [ENERGY]',
          arguments: {
            COUNT: { type: ArgumentType.NUMBER, defaultValue: 5 },
            ENERGY: { type: ArgumentType.NUMBER, defaultValue: 100 }
          }
        },
        {
          opcode: 'addFood',
          blockType: BlockType.COMMAND,
          text: 'ajouter nourriture à x: [X] y: [Y]',
          arguments: {
            X: { type: ArgumentType.NUMBER, defaultValue: 200 },
            Y: { type: ArgumentType.NUMBER, defaultValue: 200 }
          }
        },
        {
          opcode: 'addMultipleFood',
          blockType: BlockType.COMMAND,
          text: 'ajouter [AMOUNT] nourriture à x: [X] y: [Y]',
          arguments: {
            AMOUNT: { type: ArgumentType.NUMBER, defaultValue: 10 },
            X: { type: ArgumentType.NUMBER, defaultValue: 200 },
            Y: { type: ArgumentType.NUMBER, defaultValue: 200 }
          }
        },
        {
          opcode: 'moveAnts',
          blockType: BlockType.COMMAND,
          text: 'déplacer toutes les fourmis [ITERATIONS] fois',
          arguments: {
            ITERATIONS: { type: ArgumentType.NUMBER, defaultValue: 1 }
          }
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
          opcode: 'getAntEnergy',
          blockType: BlockType.REPORTER,
          text: 'énergie moyenne des fourmis'
        },
        {
          opcode: 'setSimulationSpeed',
          blockType: BlockType.COMMAND,
          text: 'vitesse simulation [SPEED]',
          arguments: {
            SPEED: { type: ArgumentType.NUMBER, defaultValue: 1 }
          }
        },
        {
          opcode: 'setAntSpeed',
          blockType: BlockType.COMMAND,
          text: 'vitesse fourmis [SPEED]',
          arguments: {
            SPEED: { type: ArgumentType.NUMBER, defaultValue: 1.5 }
          }
        },
        {
          opcode: 'addEnergyToAnts',
          blockType: BlockType.COMMAND,
          text: 'ajouter [ENERGY] énergie à toutes les fourmis',
          arguments: {
            ENERGY: { type: ArgumentType.NUMBER, defaultValue: 10 }
          }
        },
        {
          opcode: 'resetSimulation',
          blockType: BlockType.COMMAND,
          text: 'réinitialiser la simulation'
        },
        {
          opcode: 'compareAntCount',
          blockType: BlockType.BOOLEAN,
          text: 'nombre de fourmis [OP] [VALUE]',
          arguments: {
            OP: { type: ArgumentType.STRING, menu: 'operators', defaultValue: '=' },
            VALUE: { type: ArgumentType.NUMBER, defaultValue: 10 }
          }
        },
        {
          opcode: 'compareFoodCount',
          blockType: BlockType.BOOLEAN,
          text: 'quantité de nourriture [OP] [VALUE]',
          arguments: {
            OP: { type: ArgumentType.STRING, menu: 'operators', defaultValue: '=' },
            VALUE: { type: ArgumentType.NUMBER, defaultValue: 10 }
          }
        },
        {
          opcode: 'toggleSimulation',
          blockType: BlockType.COMMAND,
          text: 'simulatino [STATE]',
          arguments: {
            STATE: { type: ArgumentType.STRING, menu: 'states', defaultValue: 'on' }
          }
        },
        {
          opcode: 'sendToCyberPi',
          blockType: BlockType.COMMAND,
          text: 'envoyer à CyberPi: fourmis [ANTS] nourriture [FOOD]',
          arguments: {
            ANTS: { type: ArgumentType.NUMBER, defaultValue: 0 },
            FOOD: { type: ArgumentType.NUMBER, defaultValue: 0 }
          }
        }
      ],
      menus: {
        operators: {
          acceptReporters: true,
          items: ['=', '>', '<', '≥', '≤', '≠']
        },
        states: {
          acceptReporters: false,
          items: ['on', 'off']
        }
      }
    };
  }

  createAnt(args) {
    const x = parseFloat(args.X);
    const y = parseFloat(args.Y);
    const energy = parseFloat(args.ENERGY);

    this.ants.push({
      x: x,
      y: y,
      energy: energy,
      maxEnergy: energy,
      direction: Math.random() * 360,
      speed: this.antSpeed
    });
  }

  createMultipleAnts(args) {
    const count = Math.floor(parseFloat(args.COUNT));
    const energy = parseFloat(args.ENERGY);

    for (let i = 0; i < count; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;

      this.ants.push({
        x: x,
        y: y,
        energy: energy,
        maxEnergy: energy,
        direction: Math.random() * 360,
        speed: this.antSpeed
      });
    }
  }

  addFood(args) {
    const x = parseFloat(args.X);
    const y = parseFloat(args.Y);

    this.food.push({
      x: x,
      y: y,
      amount: 10
    });
  }

  addMultipleFood(args) {
    const amount = Math.floor(parseFloat(args.AMOUNT));
    const x = parseFloat(args.X);
    const y = parseFloat(args.Y);

    this.food.push({
      x: x,
      y: y,
      amount: amount
    });
  }

  moveAnts(args) {
    const iterations = Math.floor(parseFloat(args.ITERATIONS)) || 1;

    for (let step = 0; step < iterations; step++) {
      for (let i = 0; i < this.ants.length; i++) {
        const ant = this.ants[i];

        ant.direction += (Math.random() - 0.5) * 45;
        const angle = (ant.direction * Math.PI) / 180;
        ant.x += Math.cos(angle) * ant.speed;
        ant.y += Math.sin(angle) * ant.speed;

        ant.energy -= 0.2;

        let closestFood = null;
        let closestDistance = Infinity;

        for (let j = 0; j < this.food.length; j++) {
          const food = this.food[j];
          const dx = food.x - ant.x;
          const dy = food.y - ant.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestFood = food;
          }
        }

        if (closestFood && closestDistance < 120) {
          const dx = closestFood.x - ant.x;
          const dy = closestFood.y - ant.y;
          ant.direction = (Math.atan2(dy, dx) * 180) / Math.PI;

          if (closestDistance < 15 && closestFood.amount > 0) {
            closestFood.amount -= 1;
            ant.energy = Math.min(ant.energy + 15, ant.maxEnergy);
          }
        }

        if (ant.x < 0 || ant.x > this.width) ant.direction = 180 - ant.direction;
        if (ant.y < 0 || ant.y > this.height) ant.direction = -ant.direction;
        ant.x = Math.max(0, Math.min(this.width, ant.x));
        ant.y = Math.max(0, Math.min(this.height, ant.y));
      }

      this.ants = this.ants.filter(ant => ant.energy > 0);
      this.food = this.food.filter(food => food.amount > 0);
    }
  }

  getAntCount() {
    return this.ants.length;
  }

  getFoodCount() {
    let total = 0;
    for (let i = 0; i < this.food.length; i++) {
      total += this.food[i].amount;
    }
    return total;
  }

  getAntEnergy() {
    if (this.ants.length === 0) return 0;
    let total = 0;
    for (let i = 0; i < this.ants.length; i++) {
      total += this.ants[i].energy;
    }
    return Math.round((total / this.ants.length) * 10) / 10;
  }

  setSimulationSpeed(args) {
    this.simulationSpeed = Math.max(1, Math.min(10, parseFloat(args.SPEED)));
  }

  setAntSpeed(args) {
    this.antSpeed = parseFloat(args.SPEED);
    for (let i = 0; i < this.ants.length; i++) {
      this.ants[i].speed = this.antSpeed;
    }
  }

  addEnergyToAnts(args) {
    const energy = parseFloat(args.ENERGY);
    for (let i = 0; i < this.ants.length; i++) {
      this.ants[i].energy += energy;
    }
  }

  resetSimulation() {
    this.ants = [];
    this.food = [];
    this.simulationSpeed = 1;
  }

  compareAntCount(args) {
    const count = this.ants.length;
    const value = parseFloat(args.VALUE);
    const op = args.OP;

    switch (op) {
      case '=': return count === value;
      case '>': return count > value;
      case '<': return count < value;
      case '≥': return count >= value;
      case '≤': return count <= value;
      case '≠': return count !== value;
      default: return false;
    }
  }

  compareFoodCount(args) {
    let total = 0;
    for (let i = 0; i < this.food.length; i++) {
      total += this.food[i].amount;
    }

    const value = parseFloat(args.VALUE);
    const op = args.OP;

    switch (op) {
      case '=': return total === value;
      case '>': return total > value;
      case '<': return total < value;
      case '≥': return total >= value;
      case '≤': return total <= value;
      case '≠': return total !== value;
      default: return false;
    }
  }

  toggleSimulation(args) {
    this.isRunning = args.STATE === 'on';
  }

  sendToCyberPi(args) {
    const ants = parseFloat(args.ANTS);
    const food = parseFloat(args.FOOD);
    
    // Communication avec CyberPi via serial
    const message = `ANTWAR:${ants},${food}`;
    console.log('Sending to CyberPi:', message);
    
    // TODO: Implémenter la communication série avec CyberPi
    // Ceci serait fait via la WebSerial API
  }
}

Scratch.extensions.register(new AntwarExtension());
