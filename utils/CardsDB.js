
var _ = require('lodash');
var _cards = require('./CardList');

/**
  The following expansions can be ignored:
  'CAHe1',
  'CAHe2',
  'CAHgrognards',
  'CAHweeaboo',
  'CAHxmas',
  'NEIndy',
  'NSFH',
  'CAHe3',
  'Image1',
  'GOT',
  'PAXP13',
  'PAXE13',
  'HACK',
  'CAHe4',
  'Box',
  'Gallifrey',
  'Alternia',
  'Ladies Against Humanity'
**/


var CardsDB = function() {
  this._ignoreList = ['CAHgrognards','CAHweeaboo','PAXP13','PAXE13','Box','Gallifrey','Alternia','GOT'];
  console.log('ignoring:', this._ignoreList);
	this.questions = null;
  this.answers = null;

  this.setup();
  console.log('questions:', this.questions.length);
  console.log('answers:', this.answers.length);
};

CardsDB.prototype = {
  setup: function() {
    this.questions = _.filter(_cards, function(card) {
      return card.cardType == 'Q' && !_.contains(this._ignoreList,card.expansion);
    }, this);
    this.answers = _.filter(_cards, function(card) {
      return card.cardType == 'A' && !_.contains(this._ignoreList,card.expansion);
    }, this);
    
  },
	getRandomQuestion: function() {
		return _.shuffle(this.questions)[0];
	},
	getQuestions: function(numQuestions) {
    console.log('getting questions:', numQuestions);
		return _.map(_.range(0,numQuestions), function(i) {
      var q = this.getRandomQuestion();
      console.log(i,q.text);
			return q;
		}.bind(this));
	},
	getRandomAnswer: function() {
		return _.shuffle(this.answers)[0];
	},
	getAnswers: function(numAnswers) {
		return _.map(_.range(0,numAnswers), function() {
			return this.getRandomAnswer();
		}.bind(this));
	}
};

Object.defineProperty(CardsDB.prototype, 'ignoreList', {
  get: function() {
    return this._ignoreList;
  },
  set: function(value) {
    this._ignoreList = value;
    this.setup();
  }
});

module.exports = new CardsDB();




