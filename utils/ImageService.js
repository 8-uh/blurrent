var google = require('googleapis');
var Q = require('q');
var _ = require('lodash');
var slang = require('slang');

var dirty = require('dirty');
var images = dirty('images.json');

var ImageService = function() {
  this.customSearch = google.customsearch('v1');
  this.cseID = '013109986887887045181:ej5w9mhynls';
  this.API_KEY = process.env.GOOGLE_API_KEY;
};

ImageService.prototype = {
  dummyImages: function(query, numberOfImages) {
    var deferred = Q.defer();
    var key = slang.dasherize(query.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,""));
    var imageList = images.get(key);
    if(imageList) {
      console.log('image list exists');
      deferred.resolve(_.first(_.shuffle(imageList), numberOfImages + 1));
    } else {
      console.log('image list does not exist');
      imageList = _.map(_.range(0, 31), function() {
        return this.dummy;
      }, this);
      console.log('setting image list to:', key);
      deferred.resolve(_.first(imageList, numberOfImages + 1));  
    }
    return deferred.promise;
  },
  getImages: function(query, numberOfImages) {
    query = query || 'puppies';
    var key = slang.dasherize(query.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,""));
    numberOfImages = numberOfImages || 10;
    var deferred = Q.defer();
    var imageList = images.get(key);
    if(imageList) {
      deferred.resolve(_.first(_.shuffle(imageList), numberOfImages + 1));
    } else {
      var que = [];
      for(var i = 0; i < 3; i++) {
        que.push(this.$get(query, (i * 10) + 1));
      }
      Q.all(que).then(function(imgs) {
        images.set(key, _.flatten(imgs));
        deferred.resolve(_.first(_.flatten(imgs), numberOfImages + 1));
      });
    }
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

Object.defineProperty(ImageService.prototype, 'dummy', {
  get: function() {
    return {link: 'http://lorempixel.com/1280/1024/?cachebuster=' + Date.now() + Math.random() * 10, image:{ width: 1280, height: 1024 }};
  }
});

module.exports = new ImageService();
