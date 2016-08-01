'use strict';
// This is our shared data type. It contains all of the data about the state of the would that needs to be shared
// among our processes.
const Cell = require('../entity/Cell.js');
const SortedMap = require("collections/sorted-map");

'use strict';
module.exports = class WorldModel {
  constructor(borderRight, borderLeft, borderBottom, borderTop) {
    this.borderRight = borderRight;
    this.borderLeft = borderLeft;
    this.borderBottom = borderBottom;
    this.borderTop = borderTop;

    this.lastNodeId = 2;    // todo why 2?
    this.nodes = new SortedMap();
    this.movingNodes = new SortedMap();
    this.playerNodes = SortedMap();
    this.virusNodes = SortedMap();
  }

  setNode(id, node, type) {
    this.nodes.set(id, node);
    switch (type) {
      case "player":
        this.playerNodes.set(id, node);
        break;
      case "moving":
        this.setNodeAsMoving(id, node);
        break;
    }
  }

  addNode(node, type) {
    let id = this.getNewNodeId();
    this.setNode(id, node, type);
    return id;
  }

  getNode(id) {
    return this.nodes.get(id);
  }

  getNodes(type) {
    let nodes = undefined;
    switch (type) {
      case 'node':
        nodes = this.nodes;
        break;
      case 'moving':
        nodes = this.movingNodes;
        break;
      case 'player':
        nodes = this.playerNodes;
        break;
      case 'virus':
        nodes = this.virusNodes;
        break;
      default:
        nodes = this.nodes;
    }
    return nodes;
  }

  getNearestNodeToNode(node, type, radius) {
    let nodes = this.getNodes(type);

    // More like getNearbyVirus
    let foundNode = undefined;
    let r = (radius) ? radius : 100; // Checking radius

    let topY = node.position.y - r;
    let bottomY = node.position.y + r;

    let leftX = node.position.x - r;
    let rightX = node.position.x + r;

    // Loop through all nodes on the map. There is probably a more efficient way of doing this
    nodes.some((check)=> {
      //if (typeof check === 'undefined') return false;
      if (!check || !check.collisionCheck(bottomY, topY, rightX, leftX)) return false;

      // Add to list of cells nearby
      foundNode = check;
      return true; // stop checking when a virus found
    });
    return foundNode;

  }

  removeNode(id) {
    this.nodes.delete(id);
    this.movingNodes.delete(id);
    this.playerNodes.delete(id);
  }

  removeMovingNode(node) {
    this.movingNodes.delete(id);
  }

  getNewNodeId() {
    // Resets integer
    if (this.lastNodeId > 2147483647) {
      this.lastNodeId = 1;
    }
    return this.lastNodeId++;
  }

  getNextNodeId() {
    return this.getNewNodeId();
  }

  setNodeAsMoving(id, node) {
    this.movingNodes.set(id, node);
  }

  removeMovingNode(id) {
    this.movingNodes.delete(id);
  }

  getMovingNodes() {
    return this.movingNodes;
  }

  getPlayerNodes() {
    return this.playerNodes;
  }

  getRandomPosition() {
    return {
      x: Math.floor(Math.random() * (this.borderRight - this.borderLeft)) + this.borderLeft,
      y: Math.floor(Math.random() * (this.borderBottom - this.borderTop)) + this.borderTop
    }
  }


};

