"use strict";

var Segredario = Segredario || {};
Segredario.Finale = function() {};

Segredario.Finale.prototype = {

  create: function() {
    this.createLevel();
    this.createJessica();
    this.createMauro();
  },

  createLevel: function() {
    this.level = this.game.add.tilemap('finale');
    this.level.addTilesetImage('super_mario_bros', 'tiles');

    var backgroundLayer = this.level.createLayer('backgroundLayer');
    this.blockedLayer = this.level.createLayer('blockedLayer');

    this.level.setCollisionBetween(1, 900, true, 'blockedLayer');
    backgroundLayer.resizeWorld();
  },

  createJessica: function() {
    this.jessica = this.game.add.sprite(10, 176, 'player');
  },

  createMauro: function() {
    this.mauro = this.game.add.sprite(180, 184, 'mauro');
  }
};
