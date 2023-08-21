const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/AuthController')

router.route('/signup').post(AuthController.signup);
router.route('/login').post(AuthController.login);

module.exports = router