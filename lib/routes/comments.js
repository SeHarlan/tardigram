const { Router } = require('express');

const Comment = require('../models/Comment');
const ensureAuth = require('../middleware/ensure-auth');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    Comment
      .create(req.body)
      .then(comment => res.send(comment))
      .catch(next);
  })
  .delete('/:id', ensureAuth, (req, res, next) => {
    Comment
      .findOneAndDelete({ _id: req.params.id, commentBy: req.user._id })
      .then(comment => res.send(comment))
      .catch(next);
  });
  
