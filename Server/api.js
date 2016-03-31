var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');
var _ = require('underscore');

module.exports = function(wagner) {
  	var api = express.Router();

  	api.use(bodyparser.json());

  	/* Category API */
  	api.get('/category/id/:id', wagner.invoke(function(Category) {
    	return function(req, res) {
	      	Category.findOne({ _id: req.params.id }, function(error, category) {
	        	if (error) {
	          		return res.
	            		status(status.INTERNAL_SERVER_ERROR).
	            		json({ error: error.toString() });
	        	}
		        if (!category) {
		          	return res.
		            	status(status.NOT_FOUND).
		            	json({ error: 'Not found' });
		        }
	        	res.json({ category: category });
	      	});
    	};
  	}));

	api.get('/category/parent/:id', wagner.invoke(function(Category) {
		return function(req, res) {
			Category.
			    find({ parent: req.params.id }).
			    	sort({ _id: 1 }).
			    	exec(function(error, categories) {
			      		if (error) {
			        		return res.
			          		status(status.INTERNAL_SERVER_ERROR).
			          		json({ error: error.toString() });
			      		}
			      		res.json({ categories: categories });
					});
		};
	}));

	/* Topic API */
	api.get('/topic/id/:id', wagner.invoke(function(Topic) {
		return function(req, res) {
	      	Topic.findOne({ _id: req.params.id },
	        handleOne.bind(null, 'topic', res));
	    };
	}));

  	api.get('/topic/category/:id', wagner.invoke(function(Topic) {
	    return function(req, res) {
	      	Topic.
	        	find({ 'category.ancestors': req.params.id }).
	        	sort(sort).
	        	exec(handleMany.bind(null, 'topics', res));
	    	};
  	}));

	return api;
};

function handleOne(property, res, error, result) {
  	if (error) {
    	return res.
      		status(status.INTERNAL_SERVER_ERROR).
      		json({ error: error.toString() });
  	}
  	if (!result) {
    	return res.
      		status(status.NOT_FOUND).
      		json({ error: 'Not found' });
  	}

	var json = {};
  	json[property] = result;
  	res.json(json);
}

function handleMany(property, res, error, result) {
  	if (error) {
    	return res.
      		status(status.INTERNAL_SERVER_ERROR).
      	json({ error: error.toString() });
  	}

  	var json = {};
  	json[property] = result;
  	res.json(json);
}