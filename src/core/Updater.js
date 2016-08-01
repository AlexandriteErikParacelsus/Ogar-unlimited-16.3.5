'use strict';
const fs = require('fs');
const path = require('path');
const request = require('request');
const async = require('async');
const md5File = require('md5-file');
const exec = require('child_process').exec;

module.exports = class Updater {
  constructor(gameServer) {
    this.url = "http://raw.githubusercontent.com/AJS-development/Ogar-unlimited/" + "master" + "/";
    this.gameServer = gameServer;
    this.files = require(path.resolve(process.cwd(), 'files.json'));
    this.newFiles = {};
    this.updatedFiles = [];
  }

  init() {
    this.hashFiles();
    this.downloadFile({src: 'src/files.json', dst: 'filesTemp.json'}, (err, res)=> {
      if (!err) {
        this.newFiles = JSON.parse(fs.readFileSync('filesTemp.json'));
        this.newFiles.forEach((ele)=> {
          let currentFile = this.getFileByName(ele.name);
          if (!currentFile || ele.hash !== currentFile.hash) {
            this.updatedFiles.push(ele);
          }
        });
        if (this.updatedFiles !== []) {
        }
      } else {
        console.warn("[Initialization] While initializing failed to download files.json");
        console.warn("[Initialization] Unable to check for updates.");
        console.warn(err);
      }
    });
  }

  getFileByName(name) {
    this.newFiles.find((ele)=> {
      return ele.name === name;
    });
  }

  hashFiles() {
    try {
      let files = JSON.parse(fs.readFileSync('files.json'));
      files.forEach((ele, i)=> {
        files[i].hash = md5File(ele.dst);
      });
      // write to file pretty because this file will be edited by humans :D
      fs.writeFileSync('files.json', JSON.stringify(files, null, 2));
    } catch (err) {
      console.error(err);
    }
  }

  downloadFile(file, callback) {
    let url = this.url + file.src;
    console.log('[Downloading] ' + url + ' to: ' + file.dst);
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200 && body != "") {
        fs.writeFile(file.dst, body, (err, res)=> {
          if (typeof callback === "function") {
            callback(err, res);
          }
        });
      } else {
        callback("[Update] Couldn't connect to servers. Failed to download: " + url);
      }
    });
  }

  downloadAllFiles() {
    this.newFiles = JSON.parse(fs.readFileSync('filesTemp.json'));
    async.each(this.newFiles, (file, cb)=> {
      this.downloadFile(file, cb);
    }, handleError(this.gameServer));


  }

  downloadUpdatedFiles() {
    async.each(this.updatedFiles, (file, cb)=> {
      this.downloadFile(file, cb);
    }, handleError(this.gameServer));
  }

  runNpmInstall() {
    // executes `pwd`
    console.log('[Update] Running npm install to install new node modules!');
    let child = exec("npm install", function (error, stdout, stderr) {
      if (error !== null) {
        console.error('[Execution Error] Failed to run npm install  Reason: ', error);
        console.error('[Execution Error] You should exit the server and run: npm install');
      }
    });
  }
};

// private functions
function handleError(gameServer) {
  return function (err) {
    if (err) {
      console.error("[Console] Error: failed to download some or all files. err msg: " + err);
      console.error("[Console] Error: server is likely not in a viable state. You should manually reinstall it!");
      console.error("[Console] Error: Shutting down!");
      gameServer.socketServer.close();
      process.exit(3);
    } else {
      gameServer.updater.runNpmInstall();
      console.log("[Update] Done! Now shuting down in 8 seconds for restart...");
      setTimeout(function () {
        gameServer.socketServer.close();
        process.exit(3);
      }, 8000);
    }
  }
}
