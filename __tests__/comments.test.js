const { getUser, getPost, getComment, getAgent } = require('../db/data-helpers');

const request = require('supertest');
const app = require('../lib/app');

describe('comment tests', () => {
  it('posts a comment', async() => {
    const user = await getUser({ username: 'testUser100' });
    const post = await getPost({ user: user._id });
    return getAgent()
      .post('/api/v1/comments')
      .send({
        commentBy: user._id,
        post: post._id,
        comment: 'test Comment'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          commentBy: user._id,
          post: post._id,
          comment: 'test Comment',
          __v: 0
        });
      });
  });
  it('deletes a comment wqith id', async() => {
    const user = await getUser({ username: 'testUser100' });
    const comment = await getComment({ commentBy: user._id });
    return getAgent()
      .delete(`/api/v1/comments/${comment._id}`)
      .then(res => {
        expect(res.body).toEqual(comment);
      });

  });
});
