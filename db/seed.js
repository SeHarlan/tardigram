const chance = require('chance').Chance();
const User = require('../lib/models/User');
const Post = require('../lib/models/Post');
const Comment = require('../lib/models/Comment');

module.exports = async({ usersToCreate = 5 } = {}) => {
  const loggedInUser = await User.create({
    username: 'testUser100',
    password: 'password',
    profilePhotoUrl: chance.url()
  });

  const users = await User.create([...Array(usersToCreate)].slice(1).map(() => ({
    username: chance.name(),
    password: chance.animal(),
    profilePhotoUrl: chance.url()
  })));
  const posts = await Post.create([...Array(10)].map(() => ({
    user: chance.weighted([loggedInUser, ...users], [2, ...users.map(() => 1)])._id,
    photoUrl: chance.url(),
    caption: chance.sentence(),
    tags: [chance.animal(), chance.animal(), chance.animal()]
  })));

  await Comment.create([...Array(50)].map(() => ({
    commentBy: chance.weighted([loggedInUser, ...users], [2, ...users.map(() => 1)])._id,
    post: chance.pickone(posts)._id,
    comment: chance.sentence()
  })));
};
