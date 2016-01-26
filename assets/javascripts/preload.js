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
    preloadBar.anchor.setTo(0.5, -11);
    preloadBar.scale.setTo(7, 2);
    this.load.setPreloadSprite(preloadBar);
  },

  loadGameAssets: function() {
    this.game.load.spritesheet('player', 'assets/sprites/player.png', 32, 48);
  }
};
