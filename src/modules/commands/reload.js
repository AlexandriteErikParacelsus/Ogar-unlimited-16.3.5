var fs = require("fs");

module.exports = function (gameServer) {
  gameServer.configService.load();
  console.log("[Console] Reloaded the config files successfully");
};
