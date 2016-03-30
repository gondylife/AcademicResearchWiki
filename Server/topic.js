var mongoose = require('mongoose');
var Category = require('/category');

var topicSchema = {
	id: { type: String, required: true },
	name: { type: String, required: true },
	intro: { type: String, required: true },
	content: [{
		title: { type: String, required: true },
		body: { type: String, required: true },
		number: { type: Number, required: true },
		parent: { type: Number, required: true }
	}],
	images: [{
		link: { type: String, match: /^http:\/\//i },
		content: { type: Number }
	}],
	meta: {
		creation: {
			by: { type: String, required: true },
			date: { type: Date, required: true }
		},
		last_edited: {
			by: { type: String, required: true },
			date: { type: Date, required: true }
		},
		votes: {
			upvotes: { type: Number, required: true },
			downvotes: { type: Number, required: true }
		}
	},
	bibliography: [{ type: String, required: true }],
	category: Category.categorySchema
};

module.exports = new mongoose.Schema(topicSchema);
module.exports.topicSchema = topicSchema;