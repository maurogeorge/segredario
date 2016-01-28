var Segredario = Segredario || {};
Segredario.Preload = function() {};

Segredario.Preload.prototype = {

  preload: function() {
    this.logo();
    this.preloadBar();
    this.loadGameAssets();
  },

  create: function() {
    this.state.start('Game');
  },

  logo: function() {
    var logo = this.add.sprite(this.game.world.centerX,
                               this.game.world.centerY, 'logo');
    logo.anchor.setTo(0.5);
  },

  preloadBar: function() {
    var preloadBar = this.add.sprite(this.game.world.centerX,
                                     this.game.world.centerY, 'preload-bar');
    preloadBar.anchor.setTo(0.5, -8);
    preloadBar.scale.setTo(2, 1);
    this.load.setPreloadSprite(preloadBar);
  },

  loadGameAssets: function() {
    this.game.load.spritesheet('player', 'assets/sprites/player.png', 16, 32);
    this.load.tilemap('level', 'assets/tilemaps/maps/super_mario_bros.json',
                                null, Phaser.Tilemap.TILED_JSON);
    this.load.image('tiles', 'assets/tilemaps/tiles/super_mario_bros.png');
  }
};
