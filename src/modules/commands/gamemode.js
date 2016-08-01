var GameMode = require('../../gamemodes');

module.exports = function (gameServer, split) {
  try {
    var n = parseInt(split[1]);
    var gm = GameMode.get(n); // If there is an invalid gamemode, the function will exit
    gameServer.gameMode.onChange(gameServer); // Reverts the changes of the old gamemode
    gameServer.gameMode = gm; // Apply new gamemode
    gameServer.gameMode.onServerInit(gameServer); // Resets the server
    console.log("[Game] Changed game mode to " + gameServer.gameMode.name);
  } catch (e) {
    console.log("[Console] Invalid game mode selected");
  }
};
