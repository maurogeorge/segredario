"use strict";

var Segredario = Segredario || {};
Segredario.Credits = function() {};

Segredario.Credits.prototype = {

  create: function() {
    this.createText();

    this.createTitle("- Segredário -");
    this.createTitle("Producer");
    this.createParagraph("Mauro George");
    this.createTitle("Brodagem");
    this.createParagraph("Yogodoshi");
    this.createParagraph("Matheus Brás");

    this.createTextAnimations();
  },

  createText: function() {
    this.text = this.game.add.group();
  },

  createTextAnimations: function() {
    this.game.add.tween(this.text).to({
      y: -(this.game.height + this.text.height),
    },
    4000, Phaser.Easing.Linear.None, true).onComplete.add(function() {
      this.state.start('Boot');
    }.bind(this));
  },

  titleCounter: 0,
  paragraphCounter: 0,

  createTitle: function(content){
    this.titleCounter += 1;

    var style = { font: "16px Arial", fill: "#868AEE", align: "center" };

    var text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, content, style);
    text.x = this.game.world.centerX - (text.width / 2);
    text.y = this.game.world.centerY + ((this.titleCounter * 32) + (this.paragraphCounter * 28));

    this.text.add(text);
  },

  createParagraph: function(content){
    this.paragraphCounter += 1;

    var style = { font: "14px Arial", fill: "#ffffff", align: "center" };

    var text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, content, style);
    text.x = this.game.world.centerX - (text.width / 2);
    text.y = this.game.world.centerY + ((this.titleCounter * 32) + (this.paragraphCounter * 28));

    this.text.add(text);
  }
};
