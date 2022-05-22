const router = require('express').Router();

const {sendRequest, getSentRequests, getGroupRequests, acceptRequest} = require('../handler/joinRequestHandler.js')

router.route('').post(sendRequest)
router.route('').get(getSentRequests)
router.route('/group').get(getGroupRequests)
router.route('/accept').post(acceptRequest)

module.exports = router