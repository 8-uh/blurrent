var google = require('googleapis');
var Q = require('q');
var _ = require('lodash');

var ImageSearch = function() {
  this.customSearch = google.customsearch('v1');
  this.cseID = '013109986887887045181:ej5w9mhynls';
  this.API_KEY = process.env.GOOGLE_API_KEY;
};

ImageSearch.prototype = {
  dummyImages: function(query, numberOfPages) {
    var deferred = Q.defer();
    var images = _.map(_.range(0, numberOfPages * 10), function() {
      return this.dummy;
    }, this);
    console.log('dummy images:', images);
    deferred.resolve(images);
    return deferred.promise;
  },
  getImages: function(query, numberOfPages) {
    query = query || 'puppies';
    numberOfPages = numberOfPages || 1;

    console.log('getting images:',query, numberOfPages);
    
    var deferred = Q.defer();
    var que = [];
    var images = [];
    for(var i = 0; i < numberOfPages; i++) {
      que.push(this.$get(query, (i * 10) + 1));
    }
    Q.all(que).then(function(images) {
      deferred.resolve(_.flatten(images));
    });
    return deferred.promise;
  },
  $get: function(query, startItem) {
    var deferred = Q.defer();
    this.customSearch.cse.list({
      q: query,
      cx: this.cseID,
      auth: this.API_KEY,
      searchType: 'image',
      start: startItem
    }, function(err, resp) {
        if (err) {
          console.log('An error occured', err);
          deferred.reject(new Error(err));
        } else {
          console.log('query ran:', startItem);
          deferred.resolve(resp.items);
        }
    });
    return deferred.promise;
  },  
};

Object.defineProperty(ImageSearch.prototype, 'dummy', {
  get: function() {
    return {link: 'http://lorempixel.com/1280/1024/?cachebuster=' + Date.now() + Math.random() * 10, image:{ width: 1280, height: 1024 }};
  }
});

module.exports = new ImageSearch();
