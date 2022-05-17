const router = require('express').Router();

const {sendRequest, getAllRequests, getGroupRequests} = require('../handler/joinRequestHandler.js')

router.route('').post(sendRequest)
router.route('').get(getAllRequests)
router.route('/group').get(getGroupRequests)

module.exports = router