const RequestService = require('../service/RequestService')

const sendRequest = (req,res) => {
    let {groupId} = req.body
    let userId = req.user.userId
    RequestService.addRequest(groupId, userId).then(() => {
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

const getSentRequests = (req,res) => {
    RequestService.getSentRequests(req.user.userId).then(requests => {
        res.status(200).json({
            joinRequests:requests
        })
    })
}

const getGroupRequests = (req,res) => {
    RequestService.getGroupRequests(req.user.userId).then(requests => {
        res.status(200).json({
            joinRequests:requests
        })
    }).catch(err => {
        console.log(err)
        res.status(400).json({
            message: "Bad request!"
        })
    })
}

const acceptRequest = (req,res) => {
    let {joinRequestId} = req.body
    RequestService.acceptRequest(joinRequestId, req.user.userId).then(() => {
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

module.exports = {
    sendRequest,
    getSentRequests,
    getGroupRequests,
    acceptRequest
}