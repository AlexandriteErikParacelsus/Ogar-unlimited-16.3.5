'use strict';
var utilities = require('./utilities.js');
var Entity = require('../entity');

module.exports = class GeneratorService {
  constructor(gameServer) {
    this.gameServer = gameServer;
    this.config = gameServer.config;
    this.interval = undefined;

    // food to spawn per second
    this.foodSpawnRate = this.config.foodSpawnAmount / 60;

    // the amount of food we have spawned
    this.foodSpawned = 0;
  }

  init() {
    for (var i = 0; i < this.config.foodStartAmount; i++) {
      this.spawnFood();
    }
    // set it to 0 so we don't mess up the initial food spawn rate
    this.foodSpawned = 0;
  }

  start() {
    this.startTime = new Date();
    this.foodSpawned = 0;
    this.interval = setInterval(this.update.bind(this), 1);
  }

  stop() {
    clearInterval(this.interval);
  }

  update() {
    
    if (this.gameServer.getWorld().getNodes('food').length < this.config.foodMaxAmount) {
      if (this.gameServer.getWorld().getNodes('food').length < this.config.foodMinAmount) {
        let le = this.config.foodMinAmount - this.gameServer.getWorld().getNodes('food').length
        if (le && le > 5) {
          for (var i = 0; i < le; i++)this.spawnFood();
          
          
        }
        
      }
      
      
      let currentFoodSpawnRate = this.foodSpawned / (new Date() - this.startTime) * 1000;
      let toSpawn = this.foodSpawnRate - currentFoodSpawnRate;
      toSpawn = (toSpawn > this.foodSpawnRate) ? 0 : toSpawn;
      for (let i = 0; i < toSpawn; i++) {
        this.spawnFood();
      }
    }
    this.virusCheck();
  }

  spawnFood() {
    this.foodSpawned++;
    let f = new Entity.Food(this.gameServer.getWorld().getNextNodeId(), null, utilities.getRandomPosition(this.config.borderRight, this.config.borderLeft, this.config.borderBottom, this.config.borderTop), this.config.foodMass, this.gameServer);
    f.setColor(utilities.getRandomColor());

    this.gameServer.addNode(f);
    this.gameServer.currentFood++;
  };

  virusCheck() {
    // Checks if there are enough viruses on the map
    if (this.gameServer.spawnv == 1) {
      let virusNodes = this.gameServer.getVirusNodes();
      if (virusNodes.length < this.config.virusMinAmount) {
        // Spawns a virus
        let pos = utilities.getRandomPosition(this.config.borderRight, this.config.borderLeft, this.config.borderBottom, this.config.borderTop);
        let virusSquareSize = (this.config.virusStartMass * 100) >> 0;

        // Check for players
        let result = this.gameServer.getNodesPlayer().some((check)=> {
          if (check.mass < this.config.virusStartMass) return false;

          var squareR = check.getSquareSize(); // squared Radius of checking player cell

          var dx = check.position.x - pos.x;
          var dy = check.position.y - pos.y;

          if (dx * dx + dy * dy + virusSquareSize <= squareR)
            return true; // Collided
        });
        if (result) return;

        // Spawn if no cells are colliding
        let v = new Entity.Virus(this.gameServer.getWorld().getNextNodeId(), null, pos, this.config.virusStartMass);
        this.gameServer.addNode(v);
      }
    }
  };


};
