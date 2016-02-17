"use strict";

var Segredario = Segredario || {};
Segredario.Preload = function() {};

Segredario.Preload.prototype = {

  preload: function() {
    this.logo();
    this.preloadBar();
    this.loadGameAssets();
    this.loadSpeechBubble();
    this.loadFinaleAssets();
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
    this.load.spritesheet('coin', 'assets/tilemaps/tiles/super_mario_bros.png', 16, 16);
    this.load.spritesheet('transparent', 'assets/tilemaps/tiles/super_mario_bros.png', 16, 16);
    this.load.spritesheet('goomba', 'assets/sprites/goomba.png', 16, 16);
    this.load.spritesheet('cayo', 'assets/sprites/cayo.png', 15, 24);
    this.load.spritesheet('mauro', 'assets/sprites/mauro.png', 15, 24);
    this.load.spritesheet('matheus', 'assets/sprites/matheus.png', 16, 24);
    this.load.audio('coin', 'assets/audios/sound_effects/coin.wav');
    this.load.audio('level', 'assets/audios/sound_effects/coin.wav');
  },

  loadSpeechBubble: function() {
    this.game.load.spritesheet('bubble-border', 'vendor/assets/sprites/bubble-border.png', 6, 6);
    this.game.load.image('bubble-tail', 'vendor/assets/images/bubble-tail.png');
    this.game.load.bitmapFont('8bitoperator', 'vendor/assets/fonts/bitmaps/8bitoperator.png',
                                              'vendor/assets/fonts/bitmaps/8bitoperator.xml');
  },

  loadFinaleAssets: function() {
    this.load.tilemap('finale', 'assets/tilemaps/maps/finale.json',
                                null, Phaser.Tilemap.TILED_JSON);
  },
};
