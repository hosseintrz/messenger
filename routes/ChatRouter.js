const router = require('express').Router();

const {sendMessage, getMessages, getChatList} = require('../handler/chatHandler')

router.route('/:user_id').post(sendMessage)
router.route('/:user_id').get(getMessages)
router.route('').get(getChatList)


module.exports = router