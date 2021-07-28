const express = require('express');
const router = express.Router();
const verifyToken = require('../../helper/verifytoken');
const authController = require('../../controllers/auth.controller');

router.post('/sign_up', authController.signUp);

router.post('/login', authController.login);

router.post('/forget_password', authController.forgetPassword);

router.post("/reset_password", authController.resetPassword);

router.put("/update", verifyToken, authController.updateUser);

module.exports = router;