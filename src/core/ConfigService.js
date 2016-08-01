'use strict';
const fs = require("fs");
const ini = require('../modules/ini.js');
const glob = require('glob');
const request = require('request');
const path = require("path");

module.exports = class ConfigService {
  constructor() {
    this.config = { // Border - Right: X increases, Down: Y increases (as of 2015-05-20)
      consoleUpdateTime: 100,
      autoban: 0, // Auto bans a player if they are cheating
      randomEjectMassColor: 0, // 0 = off 1 = on
      ffaTimeLimit: 60, // TFFA time
      ffaMaxLB: 10, // Max leaderboard slots
      showtopscore: 0, // Shows top score (1 to enable)
      anounceDelay: 70, // Announce delay
      anounceDuration: 8, // How long the announce lasts
      foodMinAmount: 150, // Minimum amount of food 
      vps: 0,
      randomBotSmartness: 0,
      dev: 0,
      ejectantispeed: 120, // Speed of ejected anti matter
      maxopvirus: 60, // Maximum amount of OP viruses
      skins: 1,
      virusmass: 15,
      virusmassloss: 18,
      ejectvirus: 0,
      playerminviruseject: 34,
      minionupdate: 10,
      splitversion: 1,
      sizeMult: 1.25,
      VsizeMult: 1.33,
      verify: 0,
      autobanrecord: 0,
      serverScrambleMinimaps: 1,
      vchance: 5,
      viruscolorintense: 255,
      SpikedCells: 0, // Amount of spiked cells
      autopause: 1, // Auto pauses the game when there are no players (0 to turn off)
      smartbthome: 1, // Automatically sends you back to normal mode after pressing Q proceding an action (default) 2 = off (you need to press Q a lot)
      restartmin: 0, // minutes to restart
      showopactions: 0, // Notifys you of an OP using his power, (0 = Off [default]) 1 = on
      cRestoreTicks: 10, // Amount of time until the collision retores
      showbmessage: 0, // Notifys you if a banned player tried to join (0 = off [default]) 1 = on
      splitSpeed: 130, // Splitting speed
      showjlinfo: 0, // Notifys you if a player has left or joined (0 = off [default]) 1 = on
      ejectvspeed: 120, // How far an ejected virus (from w) shoots
      playerSafeSpawn: 1, // Makes sure players dont spawn near, inside, or on top of one another
      serverMaxConnectionsPerIp: 5, // Maximum amount of IPs per player connection
      serverMaxConnections: 64, // Maximum amount of connections to the server.
      serverPort: 443, // Server port
      botrespawn: 1,
      rainbow: 1,
      fps: 20,
      highscore: 1,
      rainbowspeed: 1,
      botupdate: 10,
      notifyupdate: 1,
      botrealnames: 0,
      smartbotspawn: 0,
      smartbspawnbase: 20,
      autoupdate: 0,
      minionavoid: 1,
      mousefilter: 1,
      borderDec: 200,
      kickspectate: 0,
      ejectbiggest: 0,
      porportional: 0,
      customskins: 1,
      botmaxsplit: 4,
      serverGamemode: 0, // Gamemode, 0 = FFA, 1 = Teams
      serverBots: 0, // Amount of player bots to spawn
      serverViewBaseX: 1024, // Base view distance of players. Warning: high values may cause lag
      serverViewBaseY: 592, // Same thing as line 77
      serverStatsPort: 88, // Port for stats server. Having a negative number will disable the stats server.
      serverStatsUpdate: 60, // Amount of seconds per update for the server stats
      serverLogLevel: 1, // Logging level of the server. 0 = No logs, 1 = Logs the console, 2 = Logs console and ip connections
      serverScrambleCoords: 1, // Toggles scrambling of coordinates. 0 = No scrambling, 1 = scrambling. Default is 1.
      borderLeft: 0, // Left border of map (Vanilla value: 0)
      borderRight: 6000, // Right border of map (Vanilla value: 11180.3398875)
      borderTop: 0, // Top border of map (Vanilla value: 0)
      borderBottom: 6000, // Bottom border of map (Vanilla value: 11180.3398875)
      liveConsole: 0, // Easiest way to get stats (1 to enable)
      anounceHighScore: 0, // Announces highscore (1 to enable)
      foodSpawnAmount: 200, // The amount of food to spawn per minute
      foodStartAmount: 100, // The starting amount of food in the map
      foodMaxAmount: 500, // Maximum food cells on the map
      foodMass: 1, // Starting food size (In mass)
      teaming: 1, // teaming or anti teaming
      foodMassGrow: 0, // Enable food mass grow ?
      playerFastDecay: 0,
      fastdecayrequire: 5000,
      FDmultiplyer: 5,
      antimatter: 1,
      merge: 1,
      mbchance: 5,
      virus: 1,
      vtime: 20,
      clientclone: 0,
      mass: 1,
      killvirus: 1,
      kickvirus: 1,
      randomnames: 0,
      trollvirus: 1,
      explodevirus: 1,
      foodMassGrowPossiblity: 50, // Chance for a food to has the ability to be self growing
      foodMassLimit: 5, // Maximum mass for a food can grow
      foodMassTimeout: 120, // The amount of interval for a food to grow its mass (in seconds)
      virusMinAmount: 10, // Minimum amount of viruses on the map.
      virusMaxAmount: 50, // Maximum amount of viruses on the map. If this amount is reached, then ejected cells will pass through viruses.
      virusStartMass: 100, // Starting virus size (In mass)
      virusFeedAmount: 7, // Amount of times you need to feed a virus to shoot it
      motherCellMassProtection: 1, // Stopping mothercells from being too big (0 to disable)
      motherCellMaxMass: 10000, // Max mass of a mothercell
      ejectMass: 132, // Mass of ejected cells
      ejectMassCooldown: 200, // Time until a player can eject mass again
      ejectMassLoss: 132, // Mass lost when ejecting cells
      ejectSpeed: 160, // Base speed of ejected cells
      massAbsorbedPercent: 100, // Fraction of player cell's mass gained upon eating
      ejectSpawnPlayer: 50, // Chance for a player to spawn from ejected mass
      playerStartMass: 132, // Starting mass of the player cell.
      playerMaxMass: 22500, // Maximum mass a player can have
      playerMinMassEject: 36, // Mass required to eject a cell
      playerMinMassSplit: 36, // Mass required to split
      playerMaxCells: 50, // Max cells the player is allowed to have
      playerRecombineTime: 30, // Base amount of seconds before a cell is allowed to recombine
      playerMassDecayRate: .002, // Amount of mass lost per second
      playerMinMassDecay: 9, // Minimum mass for decay to occur
      playerMaxNickLength: 15, // Maximum nick length
      playerSpeed: 30, // Player base speed
      playerDisconnectTime: 60, // The amount of seconds it takes for a player cell to be removed after disconnection (If set to -1, cells are never removed)
      tourneyMaxPlayers: 12, // Maximum amount of participants for tournament style game modes
      tourneyPrepTime: 10, // Amount of ticks to wait after all players are ready (1 tick = 1000 ms)
      tourneyEndTime: 30, // Amount of ticks to wait after a player wins (1 tick = 1000 ms)
      tourneyTimeLimit: 20, // Time limit of the game, in minutes.
      tourneyAutoFill: 0, // If set to a value higher than 0, the tournament match will automatically fill up with bots after this amount of seconds
      tourneyAutoFillPlayers: 1, // The timer for filling the server with bots will not count down unless there is this amount of real players
      playerBotGrowEnabled: 1, // If 0, eating a cell with less than 17 mass while cell has over 625 wont gain any mass
    }; // end of this.config
    this.banned = [];
    this.opByIp = [];
    this.highScores = '';
    this.botNames = [];
    this.skinNames = [];
    this.skinShortCuts = [];
    this.skins = [];
  }

  load() {
    this.loadConfig();
    this.loadBanned();
    this.loadOpByIp();
    this.loadHighScores();
    this.loadRandomSkin();
    this.loadBotNames();
    this.loadCustomSkin();
  }
  getRSkins() {
    return this.skinNames

  }

  getConfig() {
    return this.config;
  }

  getBanned() {
    return this.banned;
  }


  getOpByIp() {
    return this.opByIp;
  }

  getHighScores() {
    return this.highScores;
  }

  getBotNames() {
    return this.botNames;
  }

  getSkinShortCuts() {
    return this.skinShortCuts;
  }

  getSkins() {
    return this.skins;
  }

  loadConfig() {


    try {
      var test = fs.readFileSync('./files.json', 'utf-8');

    } catch (err) {
      console.log("[Game] files.json not found... Generating new files.json");
      // todo we need a real generator function for this, it shouldn't be an empty file
      fs.writeFileSync('./files.json', '');
    }
    console.log('Loading Config Files...');
    let configFiles = glob.sync("./settings/*.ini");
    if (configFiles === []) {
      console.log("[Game] No config files found, generating: src/settings/config.ini");

      // Create a new config
      fs.writeFileSync('./settings/config.ini', ini.stringify(this.config));
    }

    configFiles.forEach((file)=> {
      try {
        console.log('Loading ' + file);
        // Load the contents of the config file
        let load = ini.parse(fs.readFileSync(file, 'utf-8'));
        // Replace all the default config's values with the loaded config's values
        for (let obj in load) {
          this.config[obj] = load[obj];
        }
      } catch (err) {
        console.warn("[Game] Error while loading: " + file + " error: " + err);
      }
    });

    try {
      var override = ini.parse(fs.readFileSync('./settings/override.ini', 'utf-8'));
      for (var o in override) {
        this.config[o] = override[o];
      }
    } catch (err) {
      console.log("[Game] Override not found... Generating new override");
      fs.writeFileSync('./settings/override.ini', "// Copy and paste configs from gameserver.ini that you dont want to be overwritten");

    }
  }

  loadBanned() {
    try {
      this.banned = fs.readFileSync("./banned.txt", "utf8").split(/[\r\n]+/).filter(function (x) {
        return x != ''; // filter empty names
      });

    } catch (err) {
      console.log("[Game] Banned.txt not found... Generating new banned.txt");
      fs.writeFileSync('./banned.txt', '');
    }
  }

  loadOpByIp() {
    try {
      this.opByIp = fs.readFileSync("./opbyip.txt", "utf8").split(/[\r\n]+/).filter(function (x) {
        return x != ''; // filter empty names
      });
    } catch (err) {
      console.log("[Game] opbyip.txt not found... Generating new opbyip.txt");
      fs.writeFileSync('./opbyip.txt', '');
    }
  }

  loadHighScores() {
    try {
      this.highScores = fs.readFileSync('./highscores.txt', 'utf-8');
      this.highScores = "\n------------------------------\n\n" + fs.readFileSync('./highscores.txt', 'utf-8');
      fs.writeFileSync('./highscores.txt', this.highscores);
    } catch (err) {
      console.log("[Game] highscores.txt not found... Generating new highscores.txt");
      fs.writeFileSync('./highscores.txt', '');
    }
  }

  loadBotNames() {
    try {
      // Read and parse the names - filter out whitespace-only names
      this.botNames = fs.readFileSync(path.join(__dirname, '../', 'botnames.txt'), "utf8").split(/[\r\n]+/).filter(function (x) {
      return x != ''; // filter empty names
    });
    } catch (e) {
      // Nothing, use the default names
      fs.writeFileSync('./botnames.txt', '');
    }
  }
loadRandomSkin() {

   try {
      // Read and parse the names - filter out whitespace-only names
      this.skinNames = fs.readFileSync(path.join(__dirname, '../', 'randomSkins.txt'), "utf8").split(/[\r\n]+/).filter(function (x) {
      return x != ''; // filter empty names
    });
    } catch (e) {
      // Nothing, use the default names
      fs.writeFileSync('./randomSkins.txt', '');
    }
  }


  // todo this needs maintenance
  loadCustomSkin() {
    try {
      if (!fs.existsSync('customskins.txt')) {
        console.log("[Console] Generating customskin.txt...");
        request('https://raw.githubusercontent.com/AJS-development/Ogar-unlimited/master/src/customskins.txt', function (error, response, body) {
          if (!error && response.statusCode == 200) {

            fs.writeFileSync('customskins.txt', body);

          } else {
            console.log("[Update] Could not fetch data from servers... will generate empty file");
            fs.writeFileSync('customskins.txt', "");
          }
        });

      }
      var loadskins = fs.readFileSync("customskins.txt", "utf8").split(/[\r\n]+/).filter(function (x) {
        return x != ''; // filter empty names
      });
      if (this.config.customskins == 1) {
        for (var i in loadskins) {
          var custom = loadskins[i].split(" ");
          this.skinShortCuts[i] = custom[0];
          this.skins[i] = custom[1];
        }
      }
    } catch (e) {
      console.warn("[Console] Failed to load/download customskins.txt")
    }

  }
};
