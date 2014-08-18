var Article = require('../models/article');
var _ = require('lodash');
var Q = require('q');
var ImageService = require('./ImageService');



var ArticleService = function() {};

ArticleService.get = function(slug) {

    var deferred = Q.defer();
    
    Article.findOne({slug: slug}, function(err, article) {
      deferred.resolve(article);
    });

    return deferred.promise;
};

ArticleService.getRandom = function(numArticles, tag) {
  var deferred = Q.defer();
  var ret = [];
  function parseArticles(err, articles) {
    console.log('articles.length:', articles.length);
    if(err) {
      throw(err);
    }
    ret = ret.concat(articles);
    if(ret.length < numArticles) {
      console.log('too short');
      Article.find({})
      .where({tags:'general'})
      .limit(numArticles-ret.length)
      .exec(parseArticles);
    } else {
      ret.forEach(function(article) {
       if(!article.image) {
        article.image = ImageService.dummy;
       } 
      });
      deferred.resolve(_.shuffle(ret));
    }
  }
  console.log('looking for:', tag);
  Article.count({tags: tag}, function(err, count) {
    if(err) {
      throw(err);
    }
    console.log('count:', count);
    var rand = Math.floor(Math.random() * count);
    if(rand + numArticles > count) {
      rand = count - numArticles - rand;
    }
    if(rand < 0) {
      rand = 0;
    }
    console.log('rand:', rand, numArticles, count);
    Article.find({})
    .where({tags:tag})
    .limit(numArticles)
    .skip(rand)
    .exec(parseArticles);
  });
  
  
  return deferred.promise;
};

module.exports = ArticleService;