const { USERS, getCollection, REQUESTS, GROUPS } = require("../db/mongo");
var ObjectId = require('mongodb').ObjectId;

async function addRequest(groupId, userId){
    let request = {
        groupId : groupId,
        userId: userId,
        date: new Date().getTime()
    }
    let user = await getCollection(USERS).findOne({_id: new ObjectId(userId)})
    if (user.groups && user.groups.length > 0){
        throw new Error("user already has a group")
    }
    await getCollection(REQUESTS).insertOne(request)   
}

async function getSentRequests(userId){
    let requests = await getCollection(REQUESTS).find(
        {userId: userId},
        { sort: {date: -1}, })
            .toArray()
    return requests
}

async function getGroupRequests(userId){
    let user = await getCollection(USERS).findOne({_id: new ObjectId(userId)})
    if (!user || user.groups.length == 0){
        throw new Error("user has no groups")
    }
    let requests = await getCollection(REQUESTS).find({groupId:{$in : user.groups.map(x => x.toString())}}).toArray()
    return requests
}

async function acceptRequest(joinReqId, onwerId) {
    let joinReq = await getCollection(REQUESTS).findOne({_id:new ObjectId(joinReqId),accepted:{$exists:false}})
    if (!joinReq){
        throw new Error("request not found")
    }
    let group = await getCollection(GROUPS).findOne({_id:new ObjectId(joinReq.groupId)})
    let owner = group.members.filter(member => member.role == "owner")[0]
    if (owner.id != onwerId){
        throw new Error("user is not the owner")
    }
    let user = await getCollection(USERS).findOne({_id: new ObjectId(joinReq.userId)})
    if (user.groups && user.groups.length > 0){
        throw new Error("user already has a group")
    }
    //add user to group
    await getCollection(GROUPS).updateOne({_id:new ObjectId(joinReq.groupId)}, {$addToSet:{members:
        {
            id: user._id,
            name:user.name,
            email:user.email,
            role:"normal",
        }
    }})
    //add group to user
    await getCollection(USERS).updateOne({_id: new ObjectId(user._id)}, 
        {$push:{groups: joinReq.groupId}})
    await getCollection(REQUESTS).updateOne({_id:new ObjectId(joinReqId)}, {$set:{accepted:true}})
}

module.exports = {
    addRequest,
    getSentRequests,
    getGroupRequests,
    acceptRequest
}