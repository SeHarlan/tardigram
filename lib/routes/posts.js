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
  })
  .get('/:id', ensureAuth, (req, res, next) => {
    Post
      .findOne({ _id: req.params.id, user: req.user._id })
      .populate('comments')
      .populate('user')
      .then(post => res.send(post))
      .catch(next);
  })
  .patch('/:id', ensureAuth, (req, res, next) => {
    Post
      .findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { caption: req.body.caption }, { new: true })
      .then(post => res.send(post))
      .catch(next);
  })
  .delete('/:id', ensureAuth, (req, res, next) => {
    Post
      .findOneAndDelete({ _id: req.params.id, user: req.user._id })
      .then(post => res.send(post))
      .catch(next);
  });
