const { Router } = require('express');

const Post = require('../models/Post');
const ensureAuth = require('../middleware/ensure-auth');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    Post
      .create(req.body)
      .then(post => res.send(post))
      .catch(next);
  })
  .get('/', ensureAuth, (req, res, next) => {
    Post
      .find({ user: req.user._id })
      .then(posts => res.send(posts))
      .catch(next);
  });
