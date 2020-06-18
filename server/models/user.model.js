var mongoose = require('./mongo.config');

if (!Object.keys(mongoose).length) return;

var UsersSchema = mongoose.Schema(
  {
    author_name: String,
    author_email: String,
    user_role: {type: String, default: 'user'}
  },
  { timestamps: { createdAt: 'submit_date' } }
);

var UsersModel = mongoose.model('Users', UsersSchema);
module.exports = UsersModel;
