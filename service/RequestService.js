const { getMongoClient, MESSENGER, USERS, getCollection, REQUESTS, GROUPS } = require("../db/mongo");
var ObjectId = require('mongodb').ObjectId;

async function addRequest(groupId, userId){
    let mongoClient = await getMongoClient()
    let request = {
        groupId : groupId,
        userId: userId,
        date: new Date().getTime()
    }
    console.log(userId)
    
    try{
        let user = await getCollection(mongoClient,USERS).findOne({_id: new ObjectId(userId)})
        if (user.groups && user.groups.length > 0){
            throw new Error("user already has a group")
        }
        await getCollection(mongoClient,REQUESTS).insertOne(request)
    }catch(err){
        throw new Error(err)
    }finally {
        mongoClient.close()
    }   
}

async function getSentRequests(userId){
    let mongoClient = await getMongoClient()
    try{
        let requests = await getCollection(mongoClient,REQUESTS).find({userId: userId}).toArray()
        return requests
    }finally{
        mongoClient.close()
    }
}

async function getGroupRequests(userId){
    let mongoClient = await getMongoClient()
    try{
        let user = await getCollection(mongoClient,USERS).findOne({_id: new ObjectId(userId)})
        if (!user || user.groups.length == 0){
            throw new Error("user has no groups")
        }
        let requests = await getCollection(mongoClient,REQUESTS).find({groupId:{$in : user.groups.map(x => x.toString())}}).toArray()
        return requests
    }finally{
        mongoClient.close()
    }
}

async function acceptRequest(joinReqId, onwerId) {
    let mongoClient = await getMongoClient()
    try{
        let joinReq = await getCollection(mongoClient,REQUESTS).findOne({_id:new ObjectId(joinReqId),accepted:{$exists:false}})
        if (!joinReq){
            throw new Error("request not found")
        }
        let group = await getCollection(mongoClient,GROUPS).findOne({_id:new ObjectId(joinReq.groupId)})
        let owner = group.members.filter(member => member.role == "owner")[0]
        if (owner.id != onwerId){
            throw new Error("user is not the owner")
        }
        let user = await getCollection(mongoClient,USERS).findOne({_id: new ObjectId(joinReq.userId)})
        if (user.groups && user.groups.length > 0){
            throw new Error("user already has a group")
        }
        //add user to group
        await getCollection(mongoClient,GROUPS).updateOne({_id:new ObjectId(joinReq.groupId)}, {$addToSet:{members:
            {
                id: user._id,
                name:user.name,
                email:user.email,
                role:"normal",
            }
        }})
        //add group to user
        await getCollection(mongoClient,USERS).updateOne({_id: new ObjectId(user._id)}, 
            {$push:{groups:new ObjectId(joinReq.groupId)}})
        await getCollection(mongoClient,REQUESTS).updateOne({_id:new ObjectId(joinReqId)}, {$set:{accepted:true}})
    }finally{
        mongoClient.close()
    }
}

module.exports = {
    addRequest,
    getSentRequests,
    getGroupRequests,
    acceptRequest
}