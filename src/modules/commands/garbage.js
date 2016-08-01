var GameMode = require('../../gamemodes');

module.exports = function (gameServer, split) {
if (!global.gc) {
console.log("garbage collection is disabled. start the server with the --expose-gc tag")
return;
}

  var time = split[1];
  var gco = function() {
  if (isNaN(time) || time < 1) {

    console.log("\x1b[0m[Console] Garbage Collecting...");
    gameServer.running = false;
    global.gc();
    gameServer.running = true;
  } else {
    console.log("Garbage collecting in " + time + " minutes!");
    setTimeout(function () {
      var newLB = [];
      newLB[0] = "Garbage Collecting";
      newLB[1] = "In 1 Minute";
    gameServer.lleaderboard = false;

      // Clears the update leaderboard function and replaces it with our own
      gameServer.gameMode.packetLB = 48;
      gameServer.gameMode.specByLeaderboard = false;
      gameServer.gameMode.updateLB = function (gameServer) {
        gameServer.leaderboard = newLB
      };
      console.log("Garbage Collecting in 1 Minute");
      setTimeout(function () {
        var gm = GameMode.get(gameServer.gameMode.ID);

        // Replace functions
        gameServer.gameMode.packetLB = gm.packetLB;
        gameServer.gameMode.updateLB = gm.updateLB;
        setTimeout(function () {
          gameServer.lleaderboard = true;
        }, 2000);
      }, 14000);

      setTimeout(function () {
        console.log("\x1b[0m[Console] Garbage Collecting...");
        gameServer.running = false;
        global.gc();
        gameServer.running = true;
        if (split[2]) {
        console.log("[Console] Next garbage collection scheduled");
        gco()
        }
      }, 60000);
    }, (time * 60000) - 60000);

  }
  }
  gco()
};
