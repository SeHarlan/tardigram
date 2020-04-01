const { getPosts, getPost, getAgent, getUser, getUsers, getComments } = require('../db/data-helpers');

const request = require('supertest');
const app = require('../lib/app');

const User = require('../lib/models/User');

describe('post routes', () => {

  it('gets popular users, 10 users with most total comments on thier posts', () => {
    return request(app)
      .get('/api/v1/users/popular')
      .then(res => {
        expect(res.body.length).toEqual(10);
        expect(res.body).toContainEqual({
          _id: expect.any(String),
          totalCommentsOnPosts: expect.any(Number)
        });
      });
  });
  it('gets prolific users, respond with the 10 users with the most posts', () => {
    return request(app)
      .get('/api/v1/users/prolific')
      .then(res => {
        expect(res.body.length).toEqual(10);
        expect(res.body).toContainEqual({
          _id: expect.any(String),
          totalPosts: expect.any(Number)
        });
      });
  });
  it('GET /users/leader, respond with the 10 users with the most comments', () => {
    return request(app)
      .get('/api/v1/users/leader')
      .then(res => {
        expect(res.body.length).toEqual(10);
        expect(res.body).toContainEqual({
          _id: expect.any(String),
          totalComments: expect.any(Number)
        });
      });
  });
  it('GET /users/impact, respond with the 10 users with the highest `$avg` comments per post', () => {
    return request(app)
      .get('/api/v1/users/impact')
      .then(res => {
        expect(res.body.length).toEqual(10);
        expect(res.body).toContainEqual({
          _id: expect.any(String),
          avgCommentsPerPost: expect.any(Number)
        });
      });
  });
});
