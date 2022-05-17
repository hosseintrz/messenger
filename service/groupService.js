const { getMongoClient } = require("../db/mongo")

async function createGroup(user, name, description){
    if (!(user && name && description)){
        throw new Error("missing parameters")
    }
    mongoClient = await getMongoClient()
    let dbUser = await mongoClient.db("messenger").collection("users").findOne({email:user.email})
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
            rule: "owner"
        }]
    }
    try{
        await mongoClient.db("messenger").collection("groups").insertOne(group)
        await mongoClient.db("messenger").collection("users").updateOne({email:user.email}, {$push:{groups:group._id}})
        return group
    }catch(err){
        throw new Error(err)
    }finally{
        mongoClient.close()
    }
}

async function getAllGroups(){
    mongoClient = await getMongoClient()
    let pipeline = [
      //  {$sort: {$natural:1}}
    ]
    let groups = await mongoClient.db("messenger").collection("groups")
        .aggregate(pipeline).toArray()
    return groups    
    //let groups = await mongoClient.db("messenger").collection("groups").find().toArray()
}

async function getMyGroups(user){
    mongoClient = await getMongoClient()
    let res = await mongoClient.db("messenger").collection("users").findOne({email:user.email})
    let groupIds = res.groups
    console.log(groupIds)
    let pipeline = [
        {$match:{_id:{$in:groupIds}}},
        //{$unwind: "$groups"},
        //{$unwind: "$members"},  
       // {$sort : {$natural: 1}}
    ]
    let groups = await mongoClient.db("messenger").collection("groups").aggregate(pipeline).toArray()
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