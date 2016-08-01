'use strict';
const Commands = require('../modules/CommandList');
const EOL = require('os').EOL;

module.exports = class ConsoleService {
  constructor(version) {
    this.gameServer = undefined;
    this.version = version;
    this.updateInterveral = 100;
    this.isLiveConsole = false;
    this.interveral = undefined;
    this.hasTitleBeenWriten = false;

    // commands
    this.commands = Commands.list;

  }

  start() {
    console.log('Starting ConsoleService');
    if (this.gameServer === undefined) {
      throw "[ConsoleService] GameSever has not been set, cannot start!"
    }
    if (!this.hasTitleBeenWriten) {
      this.writeTitle();
      this.hasTitleBeenWriten = true;
    }
    this.interveral = setInterval(this.update.bind(this), this.updateInterveral);
  }

  stop() {
    if (this.interveral) {
      clearInterval(this.interveral);
    }

  }

  update() {
    if (this.isLiveConsole) {
      this.liveConsole();
    }
  }

  // todo this needs a lot of work
  liveConsole() {
    if (this.gameServer.livestage == 0) {
      if (this.gameServer.liveticks > 80) {
        this.gameServer.livestage = 1;
        this.gameServer.firstl = true;
        this.gameServer.liveticks = 0;
      }
      var players = 0;
      this.gameServer.clients.forEach(function (client) {
        if (client.playerTracker && client.playerTracker.cells.length > 0)
          players++
      });
      var line1 = "               Status                            ";
      var line2 = "       Players:      " + this.gameServer.clients.length + "                           ";
      var line3 = "       Spectators:   " + (this.gameServer.clients.length - players) + "                            ";
      var line4 = "       Alive:        " + players + "                          ";
      var line5 = "       Max Players:  " + this.gameServer.config.serverMaxConnections + "                        ";
      var line6 = "       Start Time:   " + this.gameServer.startTime + "                ";
    } else if (this.gameServer.livestage == 1) {
      if (this.gameServer.liveticks > 80) {
        this.gameServer.liveticks = 0;
        this.gameServer.firstl = true;
        this.gameServer.livestage = 2;
      }
      var players = 0;
      this.gameServer.clients.forEach(function (client) {
        if (client.playerTracker && client.playerTracker.cells.length > 0)
          players++
      });
      if (!this.gameServer.gameMode.haveTeams && this.gameServer.lleaderboard) {
        if (this.gameServer.leaderboard.length <= 0) {
          var l1 = "No Players";
          var l2 = "Are Playing";
          var l3 = "";
          var l4 = "";
          var l5 = "";
        } else {
          if (typeof this.gameServer.leaderboard[0] != "undefined") {
            var l1 = this.gameServer.leaderboard[0].name;
          } else {
            var l1 = "None"
          }
          if (typeof this.gameServer.leaderboard[1] != "undefined") {
            var l2 = this.gameServer.leaderboard[1].name;
          } else {
            var l2 = "None"
          }
          if (typeof this.gameServer.leaderboard[2] != "undefined") {
            var l3 = this.gameServer.leaderboard[2].name;
          } else {
            var l3 = "None"
          }
          if (typeof this.gameServer.leaderboard[3] != "undefined") {
            var l4 = this.gameServer.leaderboard[3].name;
          } else {
            var l4 = "None"
          }
          if (typeof this.gameServer.leaderboard[4] != "undefined") {
            var l5 = this.gameServer.leaderboard[4].name;
          } else {
            var l5 = "None"
          }
        }
      } else {
        var l1 = "Sorry, No leader";
        var l2 = "Board in Teams!";
        var l3 = "Or in MSG Mode";
        var l4 = "";
        var l5 = "";
      }
      var line1 = "              Leaderboard                   ";
      var line2 = "               1." + l1 + "                    ";
      var line3 = "               2." + l2 + "                    ";
      var line4 = "               3." + l3 + "                    ";
      var line5 = "               4." + l4 + "                    ";
      var line6 = "               5." + l5 + "                    ";
    } else if (this.gameServer.livestage == 2) {
      if (this.gameServer.liveticks > 80) {
        this.gameServer.livestage = 0;
        this.gameServer.liveticks = 0;
        this.gameServer.firstl = true;
      }
      var line1 = "               Status                            ";
      var line2 = "       Uptime:      " + process.uptime() + "                    ";
      var line3 = "       Memory:      " + process.memoryUsage().heapUsed / 1000 + "/" + process.memoryUsage().heapTotal / 1000 + " kb";
      var line4 = "       Banned:      " + this.gameServer.banned.length + "        ";
      var line5 = "       Highscore:   " + this.gameServer.topscore + " By " + this.gameServer.topusername + "      ";
      var line6 = "                                                ";
    }
    if (this.gameServer.firstl) {
      process.stdout.write("\x1b[0m\u001B[s\u001B[H\u001B[6r");
      process.stdout.write("\u001B[8;36;44m   ___                                                                        " + EOL);
      process.stdout.write("  / _ \\ __ _ __ _ _ _                                                         " + EOL);
      process.stdout.write(" | (_) / _` / _` | '_|                                                        " + EOL);
      process.stdout.write("  \\___/\\__, \\__,_|_|                                                          " + EOL);
      process.stdout.write("\u001B[4m       |___/                                                                  " + EOL);
      process.stdout.write("   u n l i m i t e d                                                          " + EOL);
      process.stdout.write("\x1b[0m\u001B[0m\u001B[u");
      this.gameServer.firstl = false;
    }

    if (this.gameServer.resticks > 29) {
      this.gameServer.firstl = true;
      this.gameServer.resticks = 0;
    } else {
      this.gameServer.resticks++;
    }

    process.stdout.write("\x1b[0m\u001B[s\u001B[H\u001B[6r");
    process.stdout.write("\u001B[8;36;44m   ___                  " + line1 + EOL);
    process.stdout.write("  / _ \\ __ _ __ _ _ _   " + line2 + EOL);
    process.stdout.write(" | (_) / _` / _` | '_|  " + line3 + EOL);
    process.stdout.write("  \\___/\\__, \\__,_|_|    " + line4 + EOL);
    process.stdout.write("\u001B[4m       |___/            " + line5 + EOL);
    process.stdout.write("   u n l i m i t e d    " + line6 + EOL);
    process.stdout.write("\x1b[0m\u001B[0m\u001B[u");

   
    this.gameServer.liveticks++;
  }

  execCommand(command, args) {
    try {
      var execute = this.commands[command];
      if (typeof execute !== 'undefined') {
      execute(this.gameServer, split);
    } else {
      var execute = this.gameServer.pluginCommands[first];
      if (typeof execute !== 'undefined') {
        execute(this.gameServer, split);

      } else {
        console.warn('[ConsoleService] Failed to run command: ' + command + " args: " + args);
      }
    }
      execute(this, args);
    } catch (e) {
      console.warn('[ConsoleService] Failed to run command: ' + command + " args: " + args);
    }

  };

  setGameServer(gameServer) {
    this.gameServer = gameServer;
  }


  writeTitle() {
    // Start msg
    console.log("\u001B[33m                                        _ _       _              _ ");
    console.log("                                       | (_)     (_)_           | |");
    console.log("  ___   ____  ____  ____    _   _ ____ | |_ ____  _| |_  ____ _ | |");
    console.log(" / _ \\ / _  |/ _  |/ ___)  | | | |  _ \\| | |    \\| |  _)/ _  ) || |");
    console.log("| |_| ( ( | ( ( | | |      | |_| | | | | | | | | | | |_( (/ ( (_| |");
    console.log(" \\___/ \\_|| |\\_||_|_|       \\____|_| |_|_|_|_|_|_|_|\\___)____)____|");
    console.log("      (_____|                                                      \u001B[0m");

    console.log("\x1b[32m[Game] Ogar Unlimited - An open source Agar.io server implementation");
    console.log("[Game] By The AJS development team\x1b[0m");
    console.log("[Game] Server version is " + this.version);
  }

  prompt(in_) {
    let self = this;
    return function () {
      var col = '';
      if (self.gameServer.red) {
      process.stdout.write("\x1b[31m\r");
    }
    if (self.gameServer.green) {
      process.stdout.write("\x1b[32m\r");
    }
    if (self.gameServer.blue) {
      process.stdout.write("\x1b[34m\r");
    }
    if (self.gameServer.white) {
      process.stdout.write("\x1b[37m\r");
    }
    if (self.gameServer.yellow) {
      process.stdout.write("\x1b[33m\r");
    }
    if (self.gameServer.bold) {
      process.stdout.write("\x1b[1m\r");
    }
    if (self.gameServer.dim) {
      process.stdout.write("\x1b[2m\r");
    }
      
      
      in_.question(">", function (str) {
        if (self.gameServer.config.dev != 1) {
          try {
            self.parseCommands(str);
          } catch (err) {
            console.log("[ERROR] Oh my, there seems to be an error with the command " + str);
            console.log("[ERROR] Please alert AJS dev with this message:\n" + err);
          }
        } else {
          self.parseCommands(str); // dev mode, throw full error
        }
        // todo fix this
        return self.prompt(in_)(); // Too lazy to learn async
      });
    };
  }

  parseCommands(str) {
    // Log the string
    this.gameServer.log.onCommand(str);

    // Don't process ENTER
    if (str === '')
      return;

    // Splits the string
    var split = str.split(" ");

    // Process the first string value
    var first = split[0].toLowerCase();

    // Get command function
    var execute = this.commands[first];
    if (typeof execute !== 'undefined') {
      execute(this.gameServer, split);
    } else {
      var execute = this.gameServer.pluginCommands[first];
      if (typeof execute !== 'undefined') {
        execute(this.gameServer, split);

      } else {
         
        console.log("[Console] Invalid Command, try \u001B[33mhelp\u001B[0m for a list of commands.");
      }
    }
  }

};
