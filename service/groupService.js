const {getCollection, USERS, GROUPS } = require("../db/mongo")

async function createGroup(user, name, description){
    if (!(user && name && description)){
        throw new Error("missing parameters")
    }
    let dbUser = await getCollection(USERS).findOne({email:user.email})
    if (dbUser.groups && dbUser.groups.length > 0){
        throw new Error("user already has a group")
    }
    var group = {
        name:name,
        description:description,
        members : [{
            id: user.userId,
            name: user.name,
            email: user.email,
            role: "owner"
        }]
    }
    await getCollection(GROUPS).insertOne(group)
    await getCollection(USERS).updateOne({email:user.email}, {$push:{groups:group._id}})
    return group
}

async function getAllGroups(){
    let pipeline = [
      //  {$sort: {$natural:1}}
    ]
    let groups = await getCollection(GROUPS).aggregate(pipeline).toArray()
    return groups    
}

async function getMyGroups(user){
    let res = await getCollection(USERS).findOne({email:user.email})
    let groupIds = res.groups 
    if(!groupIds){
        throw new Error("user has no groups")
    }
    let pipeline = [
        {$match:{_id:{$in:groupIds}}},
        //{$unwind: "$groups"},
        //{$unwind: "$members"},  
       // {$sort : {$natural: 1}}
    ]
    let groups = await getCollection(GROUPS).aggregate(pipeline).toArray()
    if (!groups){
        throw new Error("user has no groups")
    }
    return groups[0]
}

module.exports={
    createGroup,
    getAllGroups,
    getMyGroups
}