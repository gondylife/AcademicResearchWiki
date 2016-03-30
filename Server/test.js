var assert = require('assert');
var express = require('express');
var superagent = require('superagent');
var wagner = require('wagner-core');

var URL_ROOT = 'http://localhost:3000';

describe('Category API', function() {
  var server;
  var Category;

  before(function() {
    var app = express();

    // Bootstrap server
    models = require('./models')(wagner);
    app.use(require('./api')(wagner));

    server = app.listen(3000);

    // Make Category model available in tests
    Category = models.Category;
  });

  after(function() {
    // Shut the server down when we're done
    server.close();
  });

  beforeEach(function(done) {
    // Make sure categories are empty before each test
    Category.remove({}, function(error) {
      assert.ifError(error);
      done();
    });
  });

  it('can load a category by id', function(done) {
    // Create a single category
    Category.create({ _id: 'Softwares' }, function(error, doc) {
      assert.ifError(error);
      var url = URL_ROOT + '/category/id/Softwares';
      // Make an HTTP request to localhost:3000/category/id/Softwares
      superagent.get(url, function(error, res) {
        assert.ifError(error);
        var result;
        // And make sure we got { _id: 'Softwares' } back
        assert.doesNotThrow(function() {
          result = JSON.parse(res.text);
        });
        assert.ok(result.category);
        assert.equal(result.category._id, 'Softwares');
        done();
      });
    });
  });

  it('can load all categories that have a certain parent', function(done) {
    var categories = [
      { _id: 'Softwares' },
      { _id: 'Application softwares', parent: 'Softwares' },
      { _id: 'System softwares', parent: 'Softwares' },
      { _id: 'Bacon' }
    ];

    // Create 4 categories
    Category.create(categories, function(error, categories) {
      var url = URL_ROOT + '/category/parent/Softwares';
      // Make an HTTP request to localhost:3000/category/parent/Softwares
      superagent.get(url, function(error, res) {
        assert.ifError(error);
        var result;
        assert.doesNotThrow(function() {
          result = JSON.parse(res.text);
        });
        assert.equal(result.categories.length, 2);
        // Should be in ascending order by _id
        assert.equal(result.categories[0]._id, 'Application softwares');
        assert.equal(result.categories[1]._id, 'System softwares');
        done();
      });
    });
  });
});