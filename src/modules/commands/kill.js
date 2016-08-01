module.exports = function (gameServer, split) {
  var id = parseInt(split[1]);
  if (isNaN(id)) {
    console.log("[Console] Please specify a valid player ID!");
    return;
  }

  var count = 0;
  for (var i in gameServer.clients) {
    if (gameServer.clients[i].playerTracker.pID == id) {
      var client = gameServer.clients[i].playerTracker;
      var len = client.cells.length;
      for (var j = 0; j < len; j++) {
        gameServer.removeNode(client.cells[0]);
        count++;
      }

      //console.log("[Console] Removed " + count + " cells");
      break;
    }
  }
};
