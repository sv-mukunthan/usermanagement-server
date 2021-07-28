const authService = require('../services/auth.service');
const bcrypt = require('bcryptjs');
const path = require('path');
const mongoose = require("mongoose");
const { getUser } = require('../services/auth.service');
const { uploadFile } = require('../helper/function.helper');
const sendMail = require('../helper/mail.helper');
const saltRound = 10;

module.exports = {

  signUp: async(req, res, next) => {
    try {
      let user = await authService.getUser(undefined, req.body.email);
      if(user) {
        res.send({status: "success", message: "User already exits"});
      } else {
        let hash = await bcrypt.hash(req.body.password, saltRound);
        req.body.password = hash;
        let user = await authService.signUp(req.body);
        res.send({status: "success", message: "User created successfully"})
      }
    } catch(err) {
      err.desc = "Failed to sign up";
      next(err);
    }
  },

  login: async(req, res, next) => {
    try {
      let user = await getUser(undefined, req.body.email);
      if(user && user.password) {
        let isTrue = await bcrypt.compare(req.body.password, user.password);
        if(isTrue) {
          let token = await authService.generateToken(user._id, user.email);
          res.send({status: "success", message: "Login successfully", token, data: user})
        } else {
          res.status(422).send({status: "failed", message: "Incorrect password"});
        }
      } else {
        res.status(422).send({status: "failed", message: "User does't exists"});
      }
    } catch(err) {
      err.desc = "Failed to login";
      next(err);
    }
  },

  forgetPassword: async (req, res, next) => {
    try {
      let user = await authService.getUser(undefined, req.body.email);
      if(user) {
        let reset_password_hash = mongoose.Types.ObjectId();
        let url = process.env.SERVER_URL + '/user/reset_password'+reset_password_hash;
        let html = `<p>Hi ${user.name} here is your reset password <a href=${url}>hash</a></p>`;
        await sendMail(user.email, "Reset Password","", html);
        await authService.updateUser(user._id, {reset_password_hash: reset_password_hash});
        res.send({status: "success", message: "Reset password hash send your email"});
      } else {
        res.status(422).send({status: "failed", message: "User not found"});
      }
    } catch(err) {
      err.desc = "Failed to forget password";
      next(err);
    }
  },

  resetPassword: async (req, res, next) => {
    try {
      let user = await authService.resetPass(req.body.reset_password_hash);
      if(user) {
        let hash = await bcrypt.hash(req.body.password, saltRound);
        console.log("hash", hash);
        await authService.updateUser(user._id, {password: hash});
        res.send({status: "success", message: "Password reset successfully"});
      } else {
        res.status(422).send({status: "failed", message: "Incorrect hash"});
      }
    } catch(err) {
      err.desc = "Password reset successfully";
      next(err);
    }
  },

  updateUser: async(req, res, next) => {
    try {
      await authService.updateUser(req.body.user_id, req.body);
      let user = await authService.getUser(req.body.user_id, undefined);
      res.send({status: "success", message: "User updated", data: user});
    } catch (err) {
      err.desc = "Failed to get user";
      next(err);
    }
  }

}