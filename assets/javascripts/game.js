var Segredario = Segredario || {};
Segredario.Game = function() {};

Segredario.Game.prototype = {

  preload: function() {
    this.game.time.advancedTiming = true;
  },

  create: function() {
    this.createLevel();
    this.createPlayer();
    this.createCursors();
  },

  update: function(){
    this.game.physics.arcade.collide(this.player, this.blockedLayer, this.playerHit, null, this);

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
    var level = this.game.add.tilemap('level');
    level.addTilesetImage('super_mario_bros', 'tiles');

    var backgroundLayer = level.createLayer('backgroundLayer');
    this.blockedLayer = level.createLayer('blockedLayer');

    level.setCollisionBetween(1, 900, true, 'blockedLayer');
    backgroundLayer.resizeWorld();
  },

  createCursors: function() {
    this.cursors = this.game.input.keyboard.createCursorKeys();
  },
};
