const router = require('express').Router();


const {requestConnection, getConnRequests, acceptConnRequests} = require('../handler/connectionHandler.js')

router.route('').get(getConnRequests)
router.route('').post(requestConnection)
router.route('/accept').post(acceptConnRequests)

module.exports = router