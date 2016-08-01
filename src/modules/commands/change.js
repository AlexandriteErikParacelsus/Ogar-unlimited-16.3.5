module.exports = function (gameServer, split) {
  var key = split[1];
  var value = split[2];

  // Check if int/float
  if (value.indexOf('.') != -1) {
    value = parseFloat(value);
  } else {
    value = parseInt(value);
  }

  if (typeof gameServer.config[key] != 'undefined') {
    gameServer.config[key] = value;
    console.log("[Console] Set " + key + " to " + value);
  } else {
    console.log("[Console] Invalid config value");
  }
};
