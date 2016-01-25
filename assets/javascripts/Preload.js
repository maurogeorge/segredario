var Segredario = Segredario || {};
Segredario.Preload = function() {};

Segredario.Preload.prototype = {

  preload: function() {
    this.logo = this.add.sprite(this.world.centerX,
                                this.world.centerY, 'logo');
    this.logo.anchor.setTo(0.5);

    this.preloadBar = this.add.sprite(this.game.world.centerX,
                                      this.game.world.centerY, 'preload-bar');
    this.preloadBar.anchor.setTo(0.5, -11);
    this.preloadBar.scale.setTo(7, 2);
    this.load.setPreloadSprite(this.preloadBar);
  },

  create: function() {

  }
};
