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
    this.createNPCs();
    this.createPlayer();
    this.createCursors();
  },

  update: function(){
    this.game.physics.arcade.collide(this.player, this.blockedLayer, this.playerHit, null, this);
    this.game.physics.arcade.overlap(this.player, this.coins, this.coinCollect, null, this);

    for (let npc of this.npcs) {
      this.game.physics.arcade.overlap(this.player, this[npc['name']], this.npcAction, null, this);
    }

    this.movePlayer();

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

  playerHit: function(player, blockedLayer) {
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

  createCursors: function() {
    this.cursors = this.game.input.keyboard.createCursorKeys();
  },
};
