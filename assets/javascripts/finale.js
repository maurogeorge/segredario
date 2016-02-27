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
    this.jessica = this.game.add.sprite(10, 182, 'player');
  },

  createMauro: function() {
    this.mauro = this.game.add.sprite(220, 180, 'mauro');
    this.mauro.frame = 3;
  },

  createJessicaAnimations: function(){
    this.jessica.animations.add('right', [10, 11, 12], 10, true);
  },

  createMauroAnimations: function(){
    this.mauro.animations.add('left', [2, 1, 0], 10, true);
    this.mauro.animations.add('right', [5, 6, 7], 10, true);
  },

  createAnimations: function() {
    this.jessica.animations.play('right');
    this.mauro.animations.play('left');


    this.game.add.tween(this.jessica).to({
      x: 100,
    },
    1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
      this.jessica.animations.stop();
      this.jessica.frame = 9;
      this.createSpeechBubble(this.mauro, this.mauroText);
    }.bind(this));

    this.game.add.tween(this.mauro).to({
      x: 130,
    },
    1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
      this.mauro.animations.stop();
      this.mauro.frame = 3;

      var goodBye = function() {

        this.jessica.animations.play('right');

        this.game.add.tween(this.jessica).to({
          x: 120,
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
            1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
              this.state.start('Credits');
            }.bind(this));


        }.bind(this));
      }.bind(this);

      this.game.time.events.add(Phaser.Timer.SECOND * (this.mauroText.length * this.textSpeed), goodBye, this);

    }.bind(this));
  },

  mauroText: [
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
              'Phasellus finibus metus eget gravida imperdiet. Praesent ac leo velit',
              'Donec ultrices efficitur lectus tempus posuere. Proin sit amet varius libero, eu rhoncus quam.',
              'Suspendisse dignissim venenatis ex, nec mollis nunc pellentesque sed.'
             ],
  textIndex: 0,
  textSpeed: 5,

  createSpeechBubble: function(character, text) {
    var currentSpeechBubble = this.game.world.add(new SpeechBubble(this.game, character.x + 20, character.y + 8, 114, text[this.textIndex]));
    this.game.time.events.add(Phaser.Timer.SECOND * this.textSpeed, function() {
      this.game.world.remove(currentSpeechBubble);
      this.textIndex++;
      if(this.textIndex === text.length) {
        this.textIndex = 0;
        return;
      }
      this.createSpeechBubble(character, text);
    }, this);
  }
};
