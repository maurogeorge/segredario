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
    this.createPlayer();
    this.createCursors();
  },

  update: function(){
    this.game.physics.arcade.collide(this.player, this.blockedLayer, this.playerHit, null, this);
    this.game.physics.arcade.overlap(this.player, this.coins, this.coinCollect, null, this);
    this.game.physics.arcade.collide(this.player, this.goombas, this.goombaHit, null, this);
    this.game.physics.arcade.collide(this.goombas, this.blockedLayer, null, null, this);

    for (let npc of this.npcs) {
      this.game.physics.arcade.overlap(this.player, this[npc['name']], this.npcAction, null, this);
    }

    this.movePlayer();
    this.holeCollide();
  },

  render: function() {
    this.game.debug.text(this.game.time.fps || '--', 20, 40, "#00ff00", "16px Courier");
  },

  createPlayer: function() {
    this.player = this.game.add.sprite(10, 176, 'player');
    this.game.physics.arcade.enable(this.player);
    this.game.camera.follow(this.player);

    this.createPlayerPhysics();
    this.createPlayerAnimations();
  },

  createPlayerPhysics: function() {
    this.player.body.bounce.y = 0.2;
    this.player.body.gravity.y = 300;
    this.player.body.collideWorldBounds = true;
  },

  createPlayerAnimations: function(){
    this.player.animations.add('right', [1, 2, 3], 10, true);
    this.player.animations.add('left', [1, 2, 3], 10, true);
  },

  playerResetVelocity: function() {
    this.player.body.velocity.x = 0;
  },

  playerStand: function() {
    this.player.animations.stop();
    this.player.frame = 0;
  },

  playerMoveLeft: function() {
    this.player.body.velocity.x = -80;
    this.player.scale.x = -1;
    this.player.animations.play('left');
  },

  playerMoveRight: function() {
    this.player.body.velocity.x = 80;
    this.player.scale.x = 1;
    this.player.animations.play('right');
  },

  playerJump: function() {
    this.player.frame = 5;
    if(this.player.body.blocked.down) {
      this.player.body.velocity.y = -200;
    }
  },

  playerDuck: function() {
    this.player.frame = 6;
  },

  movePlayer: function() {
    this.playerResetVelocity();
    if (this.cursors.left.isDown) {
      this.playerMoveLeft();
    } else if (this.cursors.right.isDown) {
      this.playerMoveRight();
    } else {
      this.playerStand();
    }

    if (this.cursors.up.isDown) {
      this.playerJump();
    } else if (this.cursors.down.isDown) {
      this.playerDuck();
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

    var bmg = this.game.add.audio('level', 1, true);
    // Stop bmg for now
    // bmg.play();
  },

  createCoins: function() {
    this.coins = this.game.add.group();
    this.coins.enableBody = true;
    this.level.createFromObjects('objectsLayer', 58, 'coin', 57, true, false, this.coins);
    this.coinSound = this.game.add.audio('coin');
  },

  coinCollect: function(player, coin) {
    this.coinSound.play();
    coin.kill();
  },

  createGoombas: function() {
    this.goombas = this.game.add.group();
    this.goombas.enableBody = true;
    this.level.createFromObjects('objectsLayer', 911, 'goomba', 0, true, false, this.goombas);

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
      player.frame = 4;
    }

    goomba.animations.play('kill', null, false, true);
  },

  npcs: [
    { gid: 698, name: 'cayo' },
    { gid: 672, name: 'matheus' }
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

  npcAction: function(player, npc) {
    npc.frame = 1;
  },

  holeCollide: function() {
    var holeY = 208;
    if(this.player.y === holeY) {
      this.game.input.keyboard.stop();

      this.game.add.tween(this.player).to({
          y: this.lastBlockedLayerPlayerCollide.y - this.player.height,
        },
        300, Phaser.Easing.Linear.None, true).onComplete.add(function() {
        this.game.add.tween(this.player).to({
            x: this.lastBlockedLayerPlayerCollide.x - this.player.width,
          },
          300, Phaser.Easing.Linear.None, true).onComplete.add(function() {
          this.game.input.keyboard.start();
        }.bind(this));
      }.bind(this));
    }
  },

  createCursors: function() {
    this.cursors = this.game.input.keyboard.createCursorKeys();
  },
};
