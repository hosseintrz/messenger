const router = require('express').Router();

const {signup, login} = require('../handler/authHandler.js')

//router.route('/signup').post(signup)
router.post('/signup', signup)
router.post('/login', login)
//router.route('/login').post(login)

module.exports = router