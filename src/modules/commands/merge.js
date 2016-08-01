module.exports = function (gameServer, split) {
  // Validation checks
  var id = parseInt(split[1]);
  if (isNaN(id)) {
    console.log("[Console] Please specify a valid player ID!");
    return;
  }

  // Sets merge time
  for (var i in gameServer.clients) {
    if (gameServer.clients[i].playerTracker.pID == id) {
      var client = gameServer.clients[i].playerTracker;
      client.norecombine = false;
      client.recombineinstant = true;

      console.log("[Console] Forced " + client.name + " to merge cells");
      break;
    }
  }
};
