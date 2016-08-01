'use strict';
var Mode = require('./Mode');

function unlimitffa() {
  Mode.apply(this, Array.prototype.slice.call(arguments));

  this.ID = 6;
  this.name = "UnlimitFFA";
  this.specByLeaderboard = true;
}

module.exports = unlimitffa;
unlimitffa.prototype = new Mode();

// Gamemode Specific Functions
unlimitffa.prototype.onServerInit = function (gameServer) {

  gameServer.lleaderboard = true;
};

unlimitffa.prototype.leaderboardAddSort = function (player, leaderboard) {
  // Adds the player and sorts the leaderboard
  var len = leaderboard.length - 1;
  var loop = true;
  while ((len >= 0) && (loop)) {
    // Start from the bottom of the leaderboard
    if (player.getScore(false) <= leaderboard[len].getScore(false)) {
      leaderboard.splice(len + 1, 0, player);
      loop = false; // End the loop if a spot is found
    }
    len--;
  }
  if (loop) {
    // Add to top of the list because no spots were found
    leaderboard.splice(0, 0, player);
  }
};

// Override

unlimitffa.prototype.onPlayerSpawn = function (gameServer, player) {
  if (gameServer.nospawn[player.socket.remoteAddress] != true) {
    // Random color
    gameServer.config.playerMaxCells = 100;
    gameServer.config.playerRecombineTime = 0;
    player.color = gameServer.getRandomColor();

    // Set up variables
    var pos, startMass;

    // Check if there are ejected mass in the world.
    let nodesEjected = gameServer.getEjectedNodes();
    if (nodesEjected.length > 0) {
      var index = Math.floor(Math.random() * 100) + 1;
      if (index <= gameServer.config.ejectSpawnPlayer) {
        // Get ejected cell
        var index = Math.floor(Math.random() * nodesEjected.length);
        var e = nodesEjected[index];

        // Remove ejected mass
        gameServer.removeNode(e);

        // Inherit
        pos = {
          x: e.position.x,
          y: e.position.y
        };
        startMass = e.mass;

        var color = e.getColor();
        player.setColor({
          'r': color.r,
          'g': color.g,
          'b': color.b
        });
      }
    }

    // Spawn player
    gameServer.spawnPlayer(player, pos, startMass);
  }
};

unlimitffa.prototype.updateLB = function (gameServer) {
  var lb = gameServer.leaderboard;
  // Loop through all clients
  for (var i = 0; i < gameServer.clients.length; i++) {
    if (typeof gameServer.clients[i] == "undefined") {
      continue;
    }

    var player = gameServer.clients[i].playerTracker;
    var playerScore = player.getScore(true);
    if (player.cells.length <= 0) {
      continue;
    }

    if (lb.length == 0) {
      // Initial player
      lb.push(player);

    } else if (lb.length < 10) {
      this.leaderboardAddSort(player, lb);
    } else {
      // 10 in leaderboard already
      if (playerScore > lb[9].getScore(false)) {
        lb.pop();
        this.leaderboardAddSort(player, lb);
      }
    }
  }

  this.rankOne = lb[0];
};
