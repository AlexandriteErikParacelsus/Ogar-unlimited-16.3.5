var Commands = require('./modules/CommandList');
var ControlServer = require('./core/ControlServer');

var ControlServer = new ControlServer('1.0.0');

setTimeout(function () {
  process.exit(0);
}, 60000);

process.exit(0);
