const createGroup = (req,res) => {
    res.send("create group")
}

const getAllGroups = (req,res) => {
    res.send("get all groups")
}

const getMyGroups = (req,res) => {
    res.send("get my groups")
}

module.exports = {
    createGroup,
    getAllGroups,
    getMyGroups
}