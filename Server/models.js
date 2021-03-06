var mongoose = require('mongoose');
var _ = require('underscore');

module.exports = function(wagner) {
  	mongoose.connect('mongodb://localhost:27017/test');

  	var Category =
    	mongoose.model('Category', require('./category'), 'categories');
  	var Topic =
    	mongoose.model('Topic', require('./topic'), 'topics');

  	var models = {
    	Category: Category,
    	Topic: Topic
  	};

  	// To ensure DRY-ness, register factories in a loop
  	_.each(models, function(value, key) {
    	wagner.factory(key, function() {
      		return value;
    	});
  	});

  	return models;
};