const User = require('../models/user.model');
const jwt = require("jsonwebtoken");

module.exports = {
  generateToken: async (id, email) => {
    let expiry = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365)
    let token = jwt.sign({ exp: expiry, data: { id: id, email: email } }, process.env.SECRET);
    token = "Bearer " + token;
    return token
  },
  getUser: async(id, email) => {
    let query = {};
    if(id) query._id = id;
    if(email) query.email = email;
    let user = await User.findOne(query);
    return user;
  },
  signUp: async (data) => {
    let user = await User.create(data);
    return user;
  },
  updateUser: async (id, data) => {
    let user = await User.findByIdAndUpdate({_id: id}, data);
    return user;
  },
  resetPass: async (id) => {
    let user = await User.findOne({reset_password_hash: id});
    return user;
  }
}