const { getPosts, getPost, getAgent, getUser } = require('../db/data-helpers');

const request = require('supertest');
const app = require('../lib/app');

describe('auth routes', () => {
  it('posts a post, post-haste', async() => {
    const user = await getUser({ username: 'testUser100' });
    return getAgent()
      .post('/api/v1/posts')
      .send({
        photoUrl: 'testPhoto',
        caption: 'testCap',
        tags: ['test1, test2'],
        user: user._id
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          photoUrl: 'testPhoto',
          caption: 'testCap',
          tags: ['test1, test2'],
          user: expect.any(String),
          __v: 0
        });
      });
  });
  it('gets a list of posts', async() => {
    const user = await getUser({ username: 'testUser100' });
    const posts = await getPosts({ user: user._id });
    return getAgent()
      .get('/api/v1/posts')
      .then(res => {
        expect(res.body).toEqual(posts);
      });
  });
  it('gets with id', async() => {
    const user = await getUser({ username: 'testUser100' });
    const post = await getPost({ user: user._id });
    return getAgent()
      .get(`/api/v1/posts/${post._id}`)
      .then(res => {
        expect(res.body).toEqual({
          ...post,
          user
        });
      });
  });
  it('ppatches a post', async() => {
    const user = await getUser({ username: 'testUser100' });
    const post = await getPost({ user: user._id });
    return getAgent()
      .patch(`/api/v1/posts/${post._id}`)
      .send({ caption: 'new caption' })
      .then(res => {
        expect(res.body).toEqual({
          ...post,
          caption: 'new caption'
        });
      });
  });
  it('deletes a post wqith id', async() => {
    const user = await getUser({ username: 'testUser100' });
    const post = await getPost({ user: user._id });
    return getAgent()
      .delete(`/api/v1/posts/${post._id}`)
      .then(res => {
        expect(res.body).toEqual(post);
      });

  });
});
