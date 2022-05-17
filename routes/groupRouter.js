const router = require('express').Router();

const{createGroup, getAllGroups, getMyGroups} = require('../handler/groupHandler.js')

router.route('').post(createGroup)
router.route('').get(getAllGroups)
router.route('/my').get(getMyGroups)

module.exports = router