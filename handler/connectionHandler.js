const connectionService = require('../service/connectionService');

const requestConnection = (req,res) => {
    let {groupId} = req.body
    let userId = req.user.userId
    connectionService.requestConnection(groupId, userId).then(() => {
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

const getConnRequests = (req,res) => {
    connectionService.getConnRequests(req.user.userId).then(requests => {
        res.status(200).json({
            requests: requests
        })
    }).catch(err => {
        console.log(err)
        res.status(400).json({
            message: "Bad request!"
        })
    })
}

const acceptConnRequests = (req,res) => {
    let {groupId} = req.body
    connectionService.acceptConnRequests(groupId, req.user.userId).then(() => {
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
    requestConnection,
    getConnRequests,
    acceptConnRequests
}