'use strict';
const utilities = require('./utilities.js');
const Entity = require('../entity');

/**
 * Static class with functions to handle physics.
 * @type {Physics}
 */
module.exports = class Physics {
  // all functions must be static

  // todo need to figure out how to use world and not gameServer
  // todo this will take some work/thinking
  static ejectMass(player, world, gameServer) {
    player.cells.forEach((cell)=> {
      if (!cell) return;
      let angle = Physics.getAngleFromTo(player.mouse, cell.position);

      // Get starting position
      let size = cell.getSize() + 5;
      let startPos = {
        x: cell.position.x + ((size + gameServer.config.ejectMass) * Math.sin(angle)),
        y: cell.position.y + ((size + gameServer.config.ejectMass) * Math.cos(angle))
      };

      // Randomize angle
      angle += (Math.random() * .4) - .2;

      // Create cell
      let ejected = new Entity.EjectedMass(world.getNextNodeId(), null, startPos, -100, gameServer);
      ejected.setAngle(angle);
      ejected.setMoveEngineData(gameServer.config.ejectantispeed, 20);
      ejected.setColor(cell.getColor());

      gameServer.addNode(ejected, "moving");

    });
  }

  // todo needs more work, should work on anything we might want to split, player/bots/anything
  static splitCells(player, world, gameServer) {
    
    if (player.frozen || (!player.verify && gameServer.config.verify === 1)) return;

    let splitCells = 0; // How many cells have been split
    player.cells.forEach((cell)=> {
      if (!cell) return;
      // Player cell limit
      if (player.cells.length >= gameServer.config.playerMaxCells) return;

      if (cell.mass < gameServer.config.playerMinMassSplit) return;

      // Get angle
      let angle = Physics.getAngleFromTo(player.mouse, cell.position);
      if (angle == 0) angle = Math.PI / 2;

      // Get starting position
      let startPos = {
        x: cell.position.x,
        y: cell.position.y
      };
      // Calculate mass and speed of splitting cell
      let newMass = cell.mass / 2;
      cell.mass = newMass;
      
      if (angle == 0) angle = Math.PI / 2;

      // Create cell
      let split = new Entity.PlayerCell(world.getNextNodeId(), player, startPos, newMass, gameServer);
      split.setAngle(angle);

      var splitSpeed = splitSpeed = 70 + (split.getSpeed() * 3 / 2); //70 * Math.max(Math.log10(newMass) - 2.2, 1); //for smaller cells use splitspeed 150, for bigger cells add some speed //splitSpeed = 70 + (split.getSpeed() + 10);
      //split.setMoveEngineData(splitSpeed, 32, 0.85); //vanilla agar.io = 130, 32, 0.85
      split.setMoveEngineData(splitSpeed, 40, 0.87); // set it to 45 if 40 is bad
      split.calcMergeTime(gameServer.config.playerRecombineTime);
      split.ignoreCollision = true;
      //split.restoreCollisionTicks = gameServer.config.cRestoreTicks; //vanilla agar.io = 10
      split.restoreCollisionTicks = 11; // If 11 is bad, set it to the above ^^

      // Add to moving cells list
      gameServer.addNode(split, "moving");
      splitCells++;
    });
    if (splitCells > 0) player.actionMult += 0.5; // Account anti-teaming

  }

  /**
   * Returns the angle from {from} to {to}
   * @param from object with an x and y
   * @param to object with an x and y
   * @returns {number} angle
   */
  static getAngleFromTo(from, to) {
    return Math.atan2((from.x - to.x), (from.y - to.y));
  }

  /**
   * Returns the distance from {from} to {to}
   * @param from object with an x and y
   * @param to object with an x and y
   * @returns {number} distance
   */
  static getDist(from, to) { // Use Pythagoras theorem
    let deltaX = Math.abs(from.x - to.x);
    let deltaY = Math.abs(from.y - to.y);
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  }
};
