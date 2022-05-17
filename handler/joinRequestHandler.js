const sendRequest = (req,res) => {
    res.send("send request")
}

const getAllRequests = (req,res) => {
    res.send("get all requests")
}

const getGroupRequests = (req,res) => {
    res.send("get group requests")
}

module.exports = {
    sendRequest,
    getAllRequests,
    getGroupRequests
}