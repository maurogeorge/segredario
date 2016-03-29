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
    this.createNPCs();
    this.createScenes();
  },

  createLevel: function() {
    this.level = this.game.add.tilemap('finale');
    this.level.addTilesetImage('super_mario_bros', 'tiles');

    var backgroundLayer = this.level.createLayer('backgroundLayer');
    this.blockedLayer = this.level.createLayer('blockedLayer');

    this.level.setCollisionBetween(1, 900, true, 'blockedLayer');
    backgroundLayer.resizeWorld();

    this.createBMG();
  },

  createBMG: function() {
    this.bmg = this.game.add.audio('finale', 1, true);
    this.bmg.play();
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
    this.jessica.frame = 9;
  },

  createMauroAnimations: function(){
    this.mauro.animations.add('left', [2, 1, 0], 10, true);
    this.mauro.animations.add('right', [5, 6, 7], 10, true);
  },

  mauroText: [
              'Que bom que passou dessa fase.',
              'Você sabe que é muito importante para mim, e sei que sou para você também.',
              'Não gostaria de te ver perdendo, de qualquer modo estou aqui e sempre estarei para te apoiar.',
              'Agora que passou dessa fase, se inicia mais uma em nossas vidas, uma bem importante.',
              'Onde iremos compartilhar ainda mais nossas vidas em nosso co-op que começou há muito tempo.',
              'E então quer iniciar a nova fase?',
              'Jéssica Monteiro quer se casar comigo?'
             ],
  textIndex: 0,
  textSpeed: 10,

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
  },

  npcs: [
    { gid: 672, name: 'mario' },
    { gid: 673, name: 'yoshi' },
    { gid: 674, name: 'luigi' },
    { gid: 675, name: 'toad' },
    { gid: 676, name: 'dk' },
    { gid: 677, name: 'diddy' },
    { gid: 678, name: 'fox' },
    { gid: 679, name: 'pikachu' },
    { gid: 680, name: 'link' },
  ],

  createNPCs: function() {
    for (let npc of this.npcs) {
      var name = npc['name']
      var gid = npc['gid']

      this[name] = this.game.add.group();
      this[name].enableBody = true;
      this.level.createFromObjects('objectsLayer', gid, name, 0, true, false, this[name]);
    }
  },

  npcsAction: function() {
    for (let npc of this.npcs) {
      var name = npc['name'];
      this[name].children[0].frame = 1;
    }
  },

  sceneOne: function() {
  },

  sceneTwo: function() {
    this.jessica.animations.play('right');
    this.mauro.animations.play('left');

    this.game.add.tween(this.jessica).to({
      x: 100,
    },
    1000, Phaser.Easing.Linear.None, true).onComplete.add(function() {
      this.jessica.animations.stop();
      this.jessica.frame = 9;
    }.bind(this));

    this.game.add.tween(this.mauro).to({
      x: 130,
    },
    1000, Phaser.Easing.Linear.None, true).onComplete.add(function() {
      this.mauro.animations.stop();
      this.mauro.frame = 3;
    }.bind(this));
  },

  sceneThree: function() {
    this.createSpeechBubble(this.mauro, this.mauroText);
  },

  sceneFour: function() {
    var ring = this.game.add.sprite(142, 166, 'ring');

    this.game.time.events.add(Phaser.Timer.SECOND * 1, function() {
      this.game.add.tween(ring).to({
        x: 106,
      },
      2000, Phaser.Easing.Linear.None, true).onComplete.add(function() {
        this.game.add.tween(ring).to({
          y: 175,
        },
        1000, Phaser.Easing.Linear.None, true).onComplete.add(function() {
          var powerupSound = this.game.add.audio('powerup');
          powerupSound.play();

          ring.kill();

          this.npcsAction();
        }.bind(this));
      }.bind(this));
    }.bind(this));
  },

  sceneFive: function() {
    this.jessica.animations.play('right', 5);
    this.mauro.animations.play('left', 5);

    this.game.add.tween(this.jessica).to({
      x: 114,
    },
    1000, Phaser.Easing.Linear.None, true).onComplete.add(function() {
      this.jessica.animations.stop();
      this.jessica.frame = 9;
    }.bind(this));

    this.game.add.tween(this.mauro).to({
      x: 124,
    },
    1000, Phaser.Easing.Linear.None, true).onComplete.add(function() {
      this.mauro.animations.stop();
      this.mauro.frame = 3;

      var flagpoleSound = this.game.add.audio('flagpole');
      flagpoleSound.play();

      var heart = this.game.add.sprite(126, 190, 'heart');
      this.game.add.tween(heart).to( { x: -100, y: -100 }, 3000, Phaser.Easing.Linear.None, true).onComplete.add(function() {
        this.bmg.stop();
        this.state.start('Credits');
      }.bind(this));
      this.game.add.tween(heart.scale).to( { x: 256, y: 240 }, 12000, Phaser.Easing.Linear.None, true);
    }.bind(this));
  },

  sceneIndex: 0,
  totalOfScenes: 5,

  getScenes: function(index) {
    var scenes = [[this.sceneOne, 3], [this.sceneTwo, 2],
                      [this.sceneThree, (this.mauroText.length * this.textSpeed)],
                      [this.sceneFour, 7], [this.sceneFive, 2]]
    return scenes[index];
  },

  createScenes: function() {
    var currentScene = this.getScenes(this.sceneIndex);
    currentScene[0].call(this);
    this.game.time.events.add(Phaser.Timer.SECOND * currentScene[1], function() {
      this.sceneIndex++;
      if(this.sceneIndex === this.totalOfScenes) {
        return;
      }
      this.createScenes();
    }, this);
  }
};
