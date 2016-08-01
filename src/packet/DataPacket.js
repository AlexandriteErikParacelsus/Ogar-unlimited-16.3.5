
function DataPacket(gameServer) {
  this.gameServer = gameServer;
}

module.exports = DataPacket;

DataPacket.prototype.build = function() {
var result = "";
for (var i in this.gameServer.multiverse) {
var info = this.gameServer.multiverse[i];
var s = info.id + ":" + info.title + ":" + info.port
result = result + s + "|";
}

var b = result.length + 2;
 var buf = new ArrayBuffer(b);
  var view = new DataView(buf);
view.setUint8(0, 45);
var offset = 1;

    if (result) {
      for (var j = 0; j < result.length; j++) {
        var c = result.charCodeAt(j);
        if (c) {
         view.setUint8(offset, c, true);
        }
        offset ++;
    }
    }
    view.setUint8(offset, 0, true); // End of string
    offset ++;

return buf;
}
