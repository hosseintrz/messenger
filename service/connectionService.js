const {USERS, getCollection, REQUESTS, CONN_REQUESTS, GROUPS } = require("../db/mongo");
var ObjectId = require('mongodb').ObjectId;

async function requestConnection(groupId, userId){
    let user = await getCollection(USERS).findOne({_id: new ObjectId(userId)})
    if (!user.groups || user.groups.length == 0){
        throw new Error("user has no groups")
    }
    let group = await getCollection(GROUPS).findOne({_id: user.groups[0]})
    if (!group.members || group.members.length == 0){
        throw new Error("group has no members")
    }
    if(group.members.filter(member => member.role == "owner")[0].id != userId){
        throw new Error("user is not the group owner")
    }
    let connRequest = {
        userGroupId: group._id,
        groupId: groupId,
        sent: new Date().getTime(),
    }
    await getCollection(CONN_REQUESTS).insertOne(connRequest)
}

async function getConnRequests(userId){
    let user = await getCollection(USERS).findOne({_id: new ObjectId(userId)})
    if (!user.groups || user.groups.length == 0){
        throw new Error("user has no groups")
    }
    let groupId = user.groups[0]
    let requests = await getCollection(CONN_REQUESTS).find({userGroupId: groupId}).toArray()
    return requests
}

async function acceptConnRequests(connReqId, userId) {
    let conn_request = await getCollection(CONN_REQUESTS).findOne({_id:new ObjectId(connReqId)})
    let user = await getCollection(USERS).findOne({_id: new ObjectId(userId)})
    if (!user.groups || user.groups.length == 0){
        throw new Error("user has no groups")
    }
    if(user.groups[0] != conn_request.userGroupId){
        throw new Error("user doesn't have right permissions")
    }
    await getCollection(GROUPS).findOne({_id: conn_request.userGroupId}).updateOne({$addToSet: {connections: conn_request.groupId}})
    await getCollection(GROUPS).findOne({_id: conn_request.groupId}).updateOne({$addToSet: {connections: conn_request.userGroupId}})
}

module.exports = {
    requestConnection,
    getConnRequests,
    acceptConnRequests
}