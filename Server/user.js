var mongoose = require('mongoose');

var topicSchema = {
	profile: {
	    username: {
	      	type: String,
	      	required: true,
	      	lowercase: true
	    },
	    picture: {
	      	type: String,
	      	required: true,
	      	match: /^http:\/\//i
	    },
	    specialization: [{ type: String, required: true }],
	    rating: { type: Number, required: true }
	},
	data: {
		oauth: { type: String, required: true },
		topic_box: {
			created: {
				id: { type: String },
				date: { type: Date }
			},
			edited: {
				id: { type: String },
				date: { type: Date }
			}
		}
	}
}