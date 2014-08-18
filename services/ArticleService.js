var Article = require('../models/article');
var _ = require('lodash');
var Q = require('q');



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
  function parseArticles(err, articles) {
    if(err) {
      throw(err);
    }
    console.log('got all articles:', articles.length);
    if(articles.length < numArticles) {
      console.log('too short');
      deferred.resolve(articles);
    } else {
      console.log('returning subset:', numArticles);
      deferred.resolve(_.first(_.shuffle(articles),numArticles));
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
    Article.find({})
    .where({tags:tag})
    .limit(numArticles)
    .skip(rand)
    .exec(parseArticles);
  });
  
  
  return deferred.promise;
};

module.exports = ArticleService;