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
    this.player.body.gravity.y = 300;
    this.game.camera.follow(this.player);
  },

  playerResetVelocity: function() {
    this.player.body.velocity.x = 0;
  },

  playerStand: function() {
    this.player.frame = 0;
  },

  playerMoveLeft: function() {
    this.player.body.velocity.x = -80;
  },

  playerMoveRight: function() {
    this.player.body.velocity.x = 80;
  },

  playerJump: function() {
    if(this.player.body.blocked.down) {
      this.player.body.velocity.y = -200;
    }
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
    }
  },

  playerHit: function(player, blockedLayer) {
  },

  createLevel: function() {
    var level = this.game.add.tilemap('level');
    level.addTilesetImage('super_mario_bros', 'tiles');

    var backgroundLayer = level.createLayer('backgroundLayer');
    this.blockedLayer = level.createLayer('blockedLayer');

    level.setCollisionBetween(1, 100, true, 'blockedLayer');
    backgroundLayer.resizeWorld();
  },

  createCursors: function() {
    this.cursors = this.game.input.keyboard.createCursorKeys();
  },
};
