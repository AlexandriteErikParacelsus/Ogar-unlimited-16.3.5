module.exports = function (gameServer, split) {
  console.log("[Console] Current whitelisted IPs (" + gameServer.whlist.length + ")");
  for (var i in gameServer.whlist) {
    console.log(gameServer.whlist[i]);
  }
};
