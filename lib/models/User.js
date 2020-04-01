const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  profilePhotoUrl: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    transform: (doc, ret) => {
      delete ret.passwordHash;
    }
  }
});

schema.virtual('password').set(function(password) {
 
  const hash = bcrypt.hashSync(password, 5);
 
  this.passwordHash = hash;
});
schema.statics.getPopular = function() {
  return this.model('Comment')
    .aggregate([
      {
        '$group': {
          '_id': '$post', 
          'totalCommentsOnPosts': {
            '$sum': 1
          }
        }
      }, {
        '$sort': {
          'totalCommentsOnPosts': -1
        }
      }, {
        '$limit': 10
      }
    ]);
};
schema.statics.getProlific = function() {
  return this.model('Post')
    .aggregate([
      {
        '$group': {
          '_id': '$user', 
          'totalPosts': {
            '$sum': 1
          }
        }
      }, {
        '$sort': {
          'totalPosts': -1
        }
      }, {
        '$limit': 10
      }
    ]);
};
schema.statics.getLeader = function() {
  return this.model('Comment')
    .aggregate([
      {
        '$group': {
          '_id': '$commentBy', 
          'totalComments': {
            '$sum': 1
          }
        }
      }, {
        '$sort': {
          'totalComments': -1
        }
      }, {
        '$limit': 10
      }
    ]);
};
schema.statics.getImpact = function() {
  return this.model('Comment')
    .aggregate([
      {
        '$group': {
          '_id': '$post', 
          'commentCount': {
            '$sum': 1
          }
        }
      }, {
        '$lookup': {
          'from': 'posts', 
          'localField': '_id', 
          'foreignField': '_id', 
          'as': 'post'
        }
      }, {
        '$unwind': {
          'path': '$post'
        }
      }, {
        '$group': {
          '_id': '$post.user', 
          'avgCommentsPerPost': {
            '$avg': '$commentCount'
          }
        }
      }, {
        '$sort': {
          'avgCommentsPerPost': -1
        }
      }, {
        '$limit': 10
      }
    ]);
};

schema.statics.authorize = async function({ username, password }) {
 
  const user = await this.findOne({ username });
  if(!user) {
    const error = new Error('Invalid username/password');
    error.status = 401;
    throw error;
  }

  const matchingPasswords = await bcrypt.compare(password, user.passwordHash);
  if(!matchingPasswords) {
    const error = new Error('Invalid username/password');
    error.status = 401;
    throw error;
  }

  return user;
};
schema.statics.findByToken = function(token) {
  try {
    const { payload } = jwt.verify(token, process.env.APP_SECRET);

    return Promise.resolve(this.hydrate(payload));
  } catch(e) {
    return Promise.reject(e);
  }
};
schema.methods.authToken = function() {

  const token = jwt.sign({ payload: this.toJSON() }, process.env.APP_SECRET, {
    expiresIn: '24h'
  });

  return token;
};
module.exports = mongoose.model('User', schema);
