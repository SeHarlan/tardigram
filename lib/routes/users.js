const { Router } = require('express');
const User = require('../models/User');

module.exports = Router()
  .get('/popular', (req, res, next) => {
    User
      .getPopular()
      .then(result => res.send(result))
      .catch(next);
  })
  .get('/prolific', (req, res, next) => {
    User
      .getProlific()
      .then(result => res.send(result))
      .catch(next);
  })
  .get('/leader', (req, res, next) => {
    User
      .getLeader()
      .then(result => res.send(result))
      .catch(next);
  })
  .get('/impact', (req, res, next) => {
    User
      .getImpact()
      .then(result => res.send(result))
      .catch(next);
  });
  
