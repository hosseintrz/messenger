const groupService = require('../service/groupService')

const createGroup = (req,res) => {
    let {name, description} = req.body
    groupService.createGroup(req.user, name, description).then(group => {
        res.status(200).json({
            group:{
                id:group._id
            },
            message : "successful"
        })
    }).catch((err) => {
        console.log(err)
        res.status(400).json({
            message: "Bad request!"
        })
    })
}

const getAllGroups = (req,res) => {
    groupService.getAllGroups().then(groups => {
        res.status(200).json({
            groups: groups.map(group => {
                return {
                    id: group._id,
                    name: group.name,
                    description: group.description
                }
            }),
        })
    })
}

const getMyGroups = (req,res) => {
    groupService.getMyGroups(req.user).then(group => {
        let {_id,...groupDto} = group
        res.status(200).json({
            group: groupDto
        })
    }).catch(err => {
        console.log(err)
        res.status(400).json({
            message: "Bad request!"
        })
    })
}

module.exports = {
    createGroup,
    getAllGroups,
    getMyGroups
}