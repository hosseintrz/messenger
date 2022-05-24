const { getMongoClient, MESSENGER, USERS, getCollection, REQUESTS, CONN_REQUESTS, GROUPS } = require("../db/mongo");
var ObjectId = require('mongodb').ObjectId;

async function requestConnection(groupId, userId){
    let mongoClient = await getMongoClient()
    try{
        let user = await getCollection(mongoClient,USERS).findOne({_id: new ObjectId(userId)})
        if (!user.groups || user.groups.length == 0){
            throw new Error("user has no groups")
        }
        let group = await getCollection(mongoClient,GROUPS).findOne({_id: user.groups[0]})
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
        await getCollection(mongoClient,CONN_REQUESTS).insertOne(connRequest)
    }finally{
        mongoClient.close()
    }
}

async function getConnRequests(userId){
    let mongoClient = await getMongoClient()
    try{
        let user = await getCollection(mongoClient,USERS).findOne({_id: new ObjectId(userId)})
        console.log("hererere ",user)
        if (!user.groups || user.groups.length == 0){
            throw new Error("user has no groups")
        }
        let groupId = user.groups[0]
        let requests = await getCollection(mongoClient,CONN_REQUESTS).find({userGroupId: groupId}).toArray()
        return requests
    }finally{
        mongoClient.close()
    }
}

async function acceptConnRequests(connReqId, userId) {
    let mongoClient = await getMongoClient()
    try{
        let conn_request = await getCollection(mongoClient,CONN_REQUESTS).findOne({_id:new ObjectId(connReqId)})
        let user = await getCollection(mongoClient,USERS).findOne({_id: new ObjectId(userId)})
        if (!user.groups || user.groups.length == 0){
            throw new Error("user has no groups")
        }
        if(user.groups[0] != conn_request.userGroupId){
            throw new Error("user doesn't have right permissions")
        }
        await getCollection(mongoClient,GROUPS).findOne({_id: conn_request.userGroupId}).updateOne({$addToSet: {connections: conn_request.groupId}})
        await getCollection(mongoClient,GROUPS).findOne({_id: conn_request.groupId}).updateOne({$addToSet: {connections: conn_request.userGroupId}})
    }finally{
        mongoClient.close()
    }
}

module.exports = {
    requestConnection,
    getConnRequests,
    acceptConnRequests
}