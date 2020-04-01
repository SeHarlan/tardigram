const { getPosts, getPost, getAgent, getUser, getUsers, getComments } = require('../db/data-helpers');

const request = require('supertest');
const app = require('../lib/app');

describe('post routes', () => {
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
    const comments = await getComments({ post: post._id });
    const users = await getUsers();
    return getAgent()
      .get(`/api/v1/posts/${post._id}`)
      .then(res => {
        expect(res.body).toEqual({
          ...post,
          user,
          comments: comments.map(comment => {
            const [commentBy] = users.filter(user => user._id === comment.commentBy);
            return {
              ...comment,
              commentBy : commentBy
            };
          })
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
  it('gets popular posts', async() => {
    return getAgent()
      .get('/api/v1/posts/popular')
      .then(res => {
        expect(res.body.length).toEqual(10);
        expect(res.body).toContainEqual({
          _id: expect.any(String),
          user: expect.any(String),  
          totalComments: expect.any(Number)
        });
      });
  });
});
