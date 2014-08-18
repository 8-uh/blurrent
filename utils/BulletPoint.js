var _ = require('lodash');

var BulletPoint = function(question, answers, image) {
  this.question = question;
  this.answers = answers;
  this.image = image;
  this.text = null;
  this.init();
};


BulletPoint.prototype = {
  print: function() {
    console.log(this.question.text, _.pluck(this.answers, 'text'), this.image, this.text);
  },
  init: function() {
    // generate our topic
    var display = this.question.text;

    // fill in the blanks
    if(_.contains(display, '_')) {
      this.answers.forEach(function(answer) {
        display = display.replace(/_/,answer.replace('.',''));
      });
    } else {
      // add answers after question
      display = this.answers.reduce(function(result, answer) { 
        return result + ' ' + answer; 
      }, display);
    }
    this.text = display;
  }
};
module.exports = BulletPoint;