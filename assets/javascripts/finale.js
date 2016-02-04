"use strict";

var Segredario = Segredario || {};
Segredario.Finale = function() {};

Segredario.Finale.prototype = {

  create: function() {
    this.createLevel();
    this.createJessica();
    this.createJessicaAnimations();
    this.createMauro();
    this.createMauroAnimations();
    this.createAnimations();
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
    this.mauro = this.game.add.sprite(220, 184, 'mauro');
  },

  createJessicaAnimations: function(){
    this.jessica.animations.add('right', [1, 2, 3], 10, true);
  },

  createMauroAnimations: function(){
    this.mauro.animations.add('left', [0, 1], 10, true);
    this.mauro.animations.add('right', [0, 1], 10, true);
  },

  createAnimations: function() {
    this.jessica.animations.play('right');
    this.mauro.animations.play('left');


    this.game.add.tween(this.jessica).to({
      x: 150,
    },
    1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
      this.jessica.animations.stop();
      this.jessica.frame = 0;
    }.bind(this));

    this.game.add.tween(this.mauro).to({
      x: 180,
    },
    1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
      this.mauro.animations.stop();
      this.mauro.frame = 0;

      var goodBye = function() {

        this.jessica.animations.play('right');

        this.game.add.tween(this.jessica).to({
          x: 170,
        },
        500, Phaser.Easing.Linear.None, true).onComplete.add(function(){

          this.mauro.animations.play('right');

          this.game.add.tween(this.jessica).to({
            x: 260,
          },
          1000, Phaser.Easing.Linear.None, true)

            this.game.add.tween(this.mauro).to({
              x: 260,
            },
            1000, Phaser.Easing.Linear.None, true)

        }.bind(this));
      }.bind(this);

      this.game.time.events.add(Phaser.Timer.SECOND * 2, goodBye, this);

    }.bind(this));
  },
};
