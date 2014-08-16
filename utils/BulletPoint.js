var _ = require('lodash');
var cards = require('./CardsDB');
var imageSearch = require('./ImageSearch');

var BulletPoint = function(question, answer, image) {
  this.question = question;
  this.answers = [answer];
  this.image = image;
  this.text = null;
  this.init();
};


BulletPoint.prototype = {
  print: function() {
    console.log(this.question.text, _.pluck(this.answers, 'text'), this.image, this.text);
  },
  init: function() {
    // get more answers if we need them
    if(this.question.numAnswers > this.answers.length) {
      this.answers = this.answers.concat(cards.getAnswers(this.question.numAnswers -1));
    }
    // generate our topic
    var display = this.question.text;

    // fill in the blanks
    if(_.contains(display, '_')) {
      this.answers.forEach(function(answer) {
        display = display.replace(/_/,answer.text.replace('.',''));
      });
    } else {
      // add answers after question
      display = this.answers.reduce(function(result, answer) { 
        return result + ' ' + answer.text; 
      }, display);
    }
    this.text = display;
  }
};
module.exports = BulletPoint;