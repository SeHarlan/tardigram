const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  commentBy: {
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  post: {
    ref: 'Post',
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  comment: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Comment', schema);
