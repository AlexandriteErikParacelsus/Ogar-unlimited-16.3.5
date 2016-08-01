'use strict';
let Physics = require('./Physics.js');
module.exports = {
  getRandomColor: function () {
    var colorRGB = [0xFF, 0x07, (Math.random() * 256) >> 0];
    colorRGB.sort(function () {
      return 0.5 - Math.random();
    });

    return {
      r: colorRGB[0],
      b: colorRGB[1],
      g: colorRGB[2]
    };
  },
  getRandomPosition: function (borderRight, borderLeft, borderBottom, borderTop) {
    return {
      x: Math.floor(Math.random() * (borderRight - borderLeft)) + borderLeft,
      y: Math.floor(Math.random() * (borderBottom - borderTop)) + borderTop
    }
  },
  getDist: function (x1, y1, x2, y2) { // Use Pythagoras theorem
    let from = {'x': x1, 'y': y1 };
    let to = {'x': x2, 'y': y2};
    return Physics.getDist(from, to);
  },
  getAngleFromClientToCell: function (client, cell) {
    return Physics.getAngleFromTo(client.mouse, cell.position);
  },
  log10: function (x) {
    return Math.log(x) / Math.LN10;
  }
};
