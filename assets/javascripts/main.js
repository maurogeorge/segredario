var Segredario = Segredario || {};

Segredario.game = new Phaser.Game(800, 600, Phaser.AUTO, '',
                                  { preload: preload, create: create });

function preload () {
  Segredario.game.load.image('logo', 'assets/images/phaser.png');
}

function create () {
  var logo = Segredario.game.add.sprite(Segredario.game.world.centerX,
                                        Segredario.game.world.centerY, 'logo');
  logo.anchor.setTo(0.5, 0.5);
}
