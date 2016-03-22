"use strict";

var Segredario = Segredario || {};
Segredario.Game = function() {};

Segredario.Game.prototype = {

  preload: function() {
    this.game.time.advancedTiming = true;
  },

  create: function() {
    this.createLevel();
    this.createCoins();
    this.createGoombas();
    this.createNPCs();
    this.createDoor();
    this.createPlayer();
    this.createCursors();
    this.createSounds();
  },

  update: function(){
    this.game.physics.arcade.collide(this.player, this.blockedLayer, this.playerHit, null, this);
    this.game.physics.arcade.overlap(this.player, this.coins, this.coinCollect, null, this);
    this.game.physics.arcade.collide(this.player, this.goombas, this.goombaHit, null, this);
    this.game.physics.arcade.collide(this.goombas, this.blockedLayer, null, null, this);
    this.game.physics.arcade.overlap(this.player, this.door, this.doorAction, null, this);

    for (let npc of this.npcs) {
      this.game.physics.arcade.overlap(this.player, this[npc['name']], this.npcAction, null, this);
    }

    this.movePlayer();
    this.holeCollide();
  },

  createPlayer: function() {
    this.player = this.game.add.sprite(10, 183, 'player');
    this.game.physics.arcade.enable(this.player);
    this.game.camera.follow(this.player);
    this.player.frame = 9;

    this.createPlayerPhysics();
    this.createPlayerAnimations();
  },

  createPlayerPhysics: function() {
    this.player.body.gravity.y = 300;
    this.player.body.collideWorldBounds = true;
  },

  createPlayerAnimations: function(){
    this.player.animations.add('right', [10, 11, 12], 10, true);
    this.player.animations.add('left', [7, 6, 5], 10, true);
  },

  playerResetVelocity: function() {
    this.player.body.velocity.x = 0;
  },

  playerStand: function() {
    this.player.animations.stop();
    this.setMovementSprite(this.player, 8, 9);
  },

  playerMoveLeft: function() {
    if (this.cursors.down.isDown) {
      return;
    }

    this.currentPlayerDirection = 'left';
    this.player.body.velocity.x = -80;

    if (this.player.body.onFloor()) {
      this.player.animations.play('left');
    }
  },

  playerMoveRight: function() {
    if (this.cursors.down.isDown) {
      return;
    }

    this.currentPlayerDirection = 'right';
    this.player.body.velocity.x = 80;

    if (this.player.body.onFloor()) {
      this.player.animations.play('right');
    }
  },

  playerJump: function() {
    this.setMovementSprite(this.player, 3, 14);
    this.player.animations.stop('right');
    this.player.animations.stop('left');
    if(this.player.body.blocked.down) {
      this.player.body.velocity.y = -200;
      this.jumpSound.play();
    }
  },

  playerFall: function() {
    this.setMovementSprite(this.player, 2, 15);
  },

  playerDuck: function() {
    this.setMovementSprite(this.player, 4, 13);
  },

  movePlayer: function() {
    if(this.capturingKeyboard === false) {
      return;
    }
    this.playerResetVelocity();
    if (this.cursors.left.isDown) {
      this.playerMoveLeft();
    } else if (this.cursors.right.isDown) {
      this.playerMoveRight();
    } else if (this.player.body.onFloor()) {
      this.playerStand();
    }

    if (this.cursors.up.isDown) {
      this.playerJump();
    } else if (this.cursors.down.isDown) {
      this.playerDuck();
    } else if (!this.player.body.onFloor()) {
      this.playerFall();
    }
  },

  currentPlayerDirection: null,

  setMovementSprite(sprite, left, right){
    if(this.currentPlayerDirection === 'left'){
      sprite.frame = left;
    } else {
      sprite.frame = right;
    }
  },

  lastBlockedLayerPlayerCollide: {},

  playerHit: function(player, blockedLayer) {
    this.lastBlockedLayerPlayerCollide.x = this.player.x;
    this.lastBlockedLayerPlayerCollide.y = this.player.y;
  },

  createLevel: function() {
    this.level = this.game.add.tilemap('level');
    this.level.addTilesetImage('super_mario_bros', 'tiles');

    var backgroundLayer = this.level.createLayer('backgroundLayer');
    this.level.createLayer('backgroundElementsLayer');
    this.blockedLayer = this.level.createLayer('blockedLayer');

    this.level.setCollisionBetween(1, 900, true, 'blockedLayer');
    backgroundLayer.resizeWorld();

    this.createBMG();
  },

  createBMG: function() {
    this.bmg = this.game.add.audio('level', 1, true);
    this.bmgFinale = this.game.add.audio('level-complete', 1, true);

    this.bmg.play();
  },

  createCoins: function() {
    this.coins = this.game.add.group();
    this.coins.enableBody = true;
    this.level.createFromObjects('objectsLayer', 674, 'coin', 57, true, false, this.coins);
  },

  coinCollect: function(player, coin) {
    this.coinSound.play();
    coin.kill();
  },

  createGoombas: function() {
    this.goombas = this.game.add.group();
    this.goombas.enableBody = true;
    this.level.createFromObjects('objectsLayer', 672, 'goomba', 0, true, false, this.goombas);

    for (let goomba of this.goombas.children) {
      this.createGoombaPhysics(goomba);
      this.createGoombaAnimations(goomba);
    }
  },

  createGoombaPhysics: function(goomba) {
    this.game.physics.enable(goomba, Phaser.Physics.ARCADE);
    this.game.add.tween(goomba).to({x: '-64'},
                                   2000, Phaser.Easing.Linear.None, true, 0, -1, true);

    goomba.body.immovable = false;
    goomba.body.collideWorldBounds = true;
    goomba.body.bounce.setTo(1, 1);
    goomba.body.gravity.y = 300;
  },

  createGoombaAnimations: function(goomba) {
    goomba.animations.add('move', [0, 1], 5, true);
    goomba.animations.play('move');
  },

  goombaHit: function(player, goomba) {
    var hitY =  goomba.y - player.y;
    goomba.animations.add('kill', [2], 5);

    if(hitY <= goomba.height) {
      this.setMovementSprite(player, 0, 17);
      this.fireBallSound.play('', 0, 1, false, false);
    } else {
      this.squishSound.play('', 0, 1, false, false);
    }

    goomba.animations.play('kill', null, false, true);
  },

  npcs: [
    { gid: 675, name: 'mario', message: 'Alguém lhe aguarda no castelo.' },
    { gid: 676, name: 'yoshi', message: 'Bem vinda ao meu mundo!' },
    { gid: 677, name: 'luigi', message: 'Você não é meu irmão. Onde será que ele está?' },
    { gid: 678, name: 'toad', message: 'Feliz em te ver por aqui.' },
    { gid: 679, name: 'dk', message: 'Siga para o castelo.' },
    { gid: 680, name: 'diddy', message: 'Onde estão as bananas?' },
    { gid: 681, name: 'fox', message: 'Role feito um barril!' },
    { gid: 682, name: 'pikachu', message: 'Pika, pika, pikachu!' },
    { gid: 683, name: 'link', message: 'É perigoso ir sozinha. Entre no castelo!' },
  ],

  currentSpeechBubble: null,

  createNPCs: function() {
    for (let npc of this.npcs) {
      var name = npc['name']
      var gid = npc['gid']

      this[name] = this.game.add.group();
      this[name].enableBody = true;
      this.level.createFromObjects('objectsLayer', gid, name, 0, true, false, this[name]);
    }
  },

  npcAction: function(player, npc) {
    if (this.currentSpeechBubble === null){
      npc.frame = 1;
      this.createNPCSppechBubble(npc);
    }
  },

  createNPCSppechBubble: function(npc) {
    var message = this.npcs.find(function(data){ return data.name == npc.name }).message;
    this.currentSpeechBubble = this.game.world.addAt(new SpeechBubble(this.game, npc.x + 20, npc.y + 8, 120, message), 3);

    this.game.time.events.add(Phaser.Timer.SECOND * 2, function() {
      this.game.world.remove(this.currentSpeechBubble);
      npc.frame = 0;
      this.currentSpeechBubble = null;
    }, this);
  },

  createDoor: function() {
    this.door = this.game.add.group();
    this.door.enableBody = true;
    this.level.createFromObjects('objectsLayer', 685, 'transparent', 685, true, false, this.door);
  },

  doorAction: function(player, door) {
    this.bmg.stop();
    this.player.kill();

    this.bmgFinale.play('', 0, 1, false, false);

    this.game.time.events.add(Phaser.Timer.SECOND * 7, function() {
      this.state.start('Finale');
    }.bind(this));
  },


  holeCollide: function() {
    var holeY = this.game.height - this.player.height;
    if(this.player.y === holeY) {
      this.stopCaptureKeyboard();

      this.jumpSound.play();

      if(this.currentPlayerDirection === 'left'){
        var x = this.lastBlockedLayerPlayerCollide.x + this.player.width;
      } else {
        var x = this.lastBlockedLayerPlayerCollide.x - this.player.width;
      }

      this.setMovementSprite(this.player, 1, 16);

      this.game.add.tween(this.player).to({
          y: this.lastBlockedLayerPlayerCollide.y - this.player.height,
        },
        300, Phaser.Easing.Linear.None, true).onComplete.add(function() {
        this.game.add.tween(this.player).to({
            x: x,
          },
          300, Phaser.Easing.Linear.None, true).onComplete.add(function() {
          this.startCaptureKeyboard();
        }.bind(this));
      }.bind(this));
    }
  },

  createCursors: function() {
    this.cursors = this.game.input.keyboard.createCursorKeys();
  },

  capturingKeyboard: true,

  stopCaptureKeyboard: function() {
    this.game.input.keyboard.stop();
    this.capturingKeyboard = false;
  },

  startCaptureKeyboard: function() {
    this.game.input.keyboard.start();
    this.capturingKeyboard = true;
  },

  createSounds: function() {
    this.coinSound = this.game.add.audio('coin');
    this.jumpSound = this.game.add.audio('jump');
    this.squishSound = this.game.add.audio('squish');
    this.fireBallSound = this.game.add.audio('fire-ball');
  }
};
