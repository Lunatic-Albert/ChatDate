const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 회원가입 /login/signup
router.post('/signup' , authController.signup);


// 로그인 /login
router.post('/', authController.login);

module.exports = router;