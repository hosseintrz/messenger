const chatService = require('../service/chatService')

let sendMessage = (req,res) => {
    let {user_id} = req.params
    let sender_id = req.user.userId
    let {message} = req.body
    chatService.sendMessage(sender_id, user_id,message).then(() => {
        res.status(200).json({
            message: "successful"
        })
    }).catch(err => {
        console.log(err)
        res.status(400).json({
            message: "Bad request!"
        })
    })
}

let getMessages = (req,res) => {
    let {user_id} = req.params
    let sender_id = req.user.userId
    chatService.getChatDetails(sender_id, user_id).then(messages => {
        res.status(200).json({
            messages: messages
        })
    }).catch(err => {
        console.log(err)
        res.status(400).json({
            message: "Bad request!"
        })
    })
}

let getChatList = (req, res) => {
    let userId = req.user.userId
    chatService.getChatList(userId).then(chatList => {
        res.status(200).json({
            chats: chatList
        })
    }).catch(err => {
        console.log(err)
        res.status(400).json({
            message: "Bad request!"
        })
    })
}

module.exports = {
    sendMessage,
    getMessages,
    getChatList
}