var Segredario = Segredario || {};

Segredario.game = new Phaser.Game(800, 600, Phaser.AUTO, '');

Segredario.game.state.add('Boot', Segredario.Boot);
Segredario.game.state.add('Preload', Segredario.Preload);
Segredario.game.state.start('Boot');
