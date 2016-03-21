"use strict";

var Segredario = Segredario || {};

Segredario.game = new Phaser.Game(256, 240, Phaser.AUTO, 'game');

Segredario.game.state.add('Boot', Segredario.Boot);
Segredario.game.state.add('Preload', Segredario.Preload);
Segredario.game.state.add('Game', Segredario.Game);
Segredario.game.state.add('Finale', Segredario.Finale);
Segredario.game.state.add('Credits', Segredario.Credits);
Segredario.game.state.start('Boot');
