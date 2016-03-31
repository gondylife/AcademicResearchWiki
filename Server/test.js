var assert = require('assert');
var express = require('express');
var superagent = require('superagent');
var wagner = require('wagner-core');

var URL_ROOT = 'http://localhost:3000';

describe('Topic API', function() {
  var server;
  var Category;
  var Topic;

  before(function() {
    var app = express();

    // Bootstrap server
    models = require('./models')(wagner);
    app.use(require('./api')(wagner));

    server = app.listen(3000);

    // Make models available in tests
    Category = models.Category;
    Topic = models.Topic;
  });

  after(function() {
    // Shut the server down when we're done
    server.close();
  });

  beforeEach(function(done) {
    // Make sure categories are empty before each test
    Category.remove({}, function(error) {
      assert.ifError(error);
      Topic.remove({}, function(error) {
        assert.ifError(error);
        done();
      });
    });
  });

  it('can load a topic by id', function(done) {
    // Create a single topic
    var TOPIC_ID = '000000000000000000000001';
    var topic = {
      _id: TOPIC_ID,
      name: 'QuickTime Player',
      intro: 'QuickTime Player is used for watching media files',
      content: [{
        title: 'History',
        body: 'This was bulit in 2010',
        number: '1',
        parent: '1'
      }],
      meta: {
        creation: {
          by: 'Godswill Okwara',
          date: '2014-12-08'
        },
        votes: {
          upvotes: 0,
          downvotes: 0
        }
      },
      bibliography: ['Hacquard, Valentine. 2006. Aspects of Modality. Ph.D. Dissertation, MIT, available online.']
    };
    Topic.create(topic, function(error, doc) {
      assert.ifError(error);
      var url = URL_ROOT + '/topic/id/' + TOPIC_ID;
      // Make an HTTP request to
      // "localhost:3000/topic/id/000000000000000000000001"
      superagent.get(url, function(error, res) {
        assert.ifError(error);
        var result;
        // And make sure we got the QuickTime Player back
        assert.doesNotThrow(function() {
          result = JSON.parse(res.text);
        });
        assert.ok(result.topic);
        assert.equal(result.topic._id, TOPIC_ID);
        assert.equal(result.topic.name, 'QuickTime Player');
        done();
      });
    });
  });

  it('can load all topicss in a category with sub-categories', function(done) {
    var categories = [
      { _id: 'Softwares' },
      { _id: 'System Softwares', parent: 'Softwares' },
      { _id: 'Application Softwares', parent: 'Softwares' },
      { _id: 'Bacon' }
    ];

    var topics = [
      {
        name: 'QuickTime Player',
        category: { _id: 'Application Softwares', ancestors: ['Softwares', 'Application Softwares'] },
        intro: 'QuickTime Player is used for watching media files',
        content: [{
          title: 'History',
          body: 'This was bulit in 2010',
          number: '1',
          parent: '1'
        }],
        meta: {
          creation: {
            by: 'Godswill Okwara',
            date: '2014-12-08'
          },
          votes: {
            upvotes: 0,
            downvotes: 0
          }
        },
        bibliography: ['Hacquard, Valentine. 2006. Aspects of Modality. Ph.D. Dissertation, MIT, available online.']
      },
      {
        name: 'Kernel',
        category: { _id: 'System Softwares', ancestors: ['Softwares', 'System Softwares'] },
        intro: 'Kernel is core',
        content: [{
          title: 'History',
          body: 'This was bulit in 2013',
          number: '1',
          parent: '1'
        }],
        meta: {
          creation: {
            by: 'Godswill Okwara',
            date: '2014-11-08'
          },
          votes: {
            upvotes: 0,
            downvotes: 0
          }
        },
        bibliography: ['Hacquard, Valentine. 2006. Aspects of Modality. Ph.D. Dissertation, UNN']
      }
    ];

    // Create 4 categories
    Category.create(categories, function(error, categories) {
      assert.ifError(error);
      // And 2 topics
      Topic.create(topics, function(error, topics) {
        assert.ifError(error);
        var url = URL_ROOT + '/topic/category/Softwares';
        // Make an HTTP request to localhost:3000/topic/category/Softwares
        superagent.get(url, function(error, res) {
          assert.ifError(error);
          var result;
          assert.doesNotThrow(function() {
            result = JSON.parse(res.text);
          });
          assert.equal(result.topics.length, 2);
          // Should be in ascending order by name
          assert.equal(result.topics[0].name, 'QuickTime Player');
          assert.equal(result.topics[1].name, 'Kernel');
          done();
        });
      });
    });
  });
});