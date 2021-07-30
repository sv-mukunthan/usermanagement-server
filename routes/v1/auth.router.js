const express = require('express');
const router = express.Router();
const verifyToken = require('../../helper/verifytoken');
const authController = require('../../controllers/auth.controller');
const validator = require('express-joi-validation').createValidator({});
const { signUp, login } = require('../../helper/validation.helper');

router.post('/sign_up', validator.body(signUp), authController.signUp);

router.post('/login', validator.body(login), authController.login);

router.post('/forget_password', authController.forgetPassword);

router.post("/reset_password", authController.resetPassword);

router.put("/update", verifyToken, authController.updateUser);

router.post("/user_list", verifyToken, authController.userList);

router.get("/get_user/:id", verifyToken, authController.getUserById);

router.post("/get_user", verifyToken, authController.getUserByToken);

router.post("/logout", verifyToken, authController.logout);

module.exports = router;