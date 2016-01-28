var Segredario = Segredario || {};
Segredario.Game = function() {};

Segredario.Game.prototype = {

  preload: function() {
    this.game.time.advancedTiming = true;
  },

  create: function() {
    this.createLevel();
    this.createPlayer();
  },

  render: function() {
    this.game.debug.text(this.game.time.fps || '--', 20, 40, "#00ff00", "16px Courier");
  },

  createPlayer: function() {
    var player = this.game.add.sprite(10, 176, 'player');
  },

  createLevel: function() {
    var level = this.game.add.tilemap('level');
    level.addTilesetImage('super_mario_bros', 'tiles');
    level.createLayer('backgroundLayer');
    level.createLayer('blockedLayer');
  }
};
