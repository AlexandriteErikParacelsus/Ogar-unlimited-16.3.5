'use strict';
// todo this needs review
module.exports = function (gameServer, split) {
  let nodes = gameServer._nodes;
  for (var j = 0; j < nodes.length; j++) {
      gameServer.removeNode(nodes[j]);
    
  }
  console.log("[Console] Reset the game");
};
