const { getCollection, USERS, CHATS, getMongoClient } = require("../db/mongo")
var ObjectId = require('mongodb').ObjectId;

async function getChatId(user1, user2){
    let mongoClient = await getMongoClient()
    try{
        if (!user1.groups || user1.groups.length == 0){
            throw new Error("user has no groups")
        }
        let connections = user1.connections ? user1.connections : []
        if (![...user1.groups,...connections].includes(user2.groups[0])){
            throw new Error('user1 is not connected to user2')
        }
        let chats = user1.chats?.filter(chat => chat.userId == user2._id.toString())
        if (chats && chats.length > 0){
            return chats[0].chatId
        }
        let chat = {
            user1_id: user1._id.toString(),
            user2_id: user2._id.toString(),
            messages:[]
        }
        let res = await getCollection(mongoClient,CHATS).insertOne(chat)
        await getCollection(mongoClient, USERS).updateOne({_id: user1._id}, {$addToSet: {chats: {chatId: res.insertedId, userId: user2._id.toString(), name:user2.name}}})
        await getCollection(mongoClient, USERS).updateOne({_id: user2._id}, {$addToSet: {chats: {chatId: res.insertedId, userId: user1._id.toString(), name:user1.name}}})
        return res.insertedId
    }finally{
        mongoClient.close()
    }
}

async function sendMessage(user1_id, user2_id, message){
    let mongoClient = await getMongoClient()
    try{
        let user1 = await getCollection(mongoClient,USERS).findOne({_id: new ObjectId(user1_id)})
        let user2 = await getCollection(mongoClient,USERS).findOne({_id: new ObjectId(user2_id)})
        let chatId = await getChatId(user1,user2)
        await getCollection(mongoClient,CHATS).updateOne({_id: new ObjectId(chatId)}, 
            {$addToSet: { messages: 
                {
                    message: message,  
                    date: new Date().getTime(),
                    sentby: user1.name,
                }
            }})
    }finally{
        mongoClient.close()
    }
}

async function getChatDetails(user1_id, user2_id){
    let mongoClient = await getMongoClient()
    try{
        let user1 = await getCollection(mongoClient,USERS).findOne({_id: new ObjectId(user1_id)})
        let user2 = await getCollection(mongoClient,USERS).findOne({_id: new ObjectId(user2_id)})
        let chatId = await (user1,user2)
        // let options = {
        //     projection:{messages: 1, _id:0},
        // }
        //let chat = await getCollection(mongoClient,CHATS).findOne({_id: new ObjectId(chatId)},options)
        console.log("chatid: ",chatId)
        let pipeline = [
            {'$match': {_id: chatId}},
            {'$unwind': '$messages' },
            {'$sort': {'messages.date': -1}},
        ]
        let aggCur = await getCollection(mongoClient,CHATS).aggregate(pipeline)
        let chat;
        aggCur.next().then(docs => {
            chat = docs
            console.log(docs)
        }).catch(err => {
            console.log(err)
        })
        //console.log(chat)
        return chat
    }finally{
        mongoClient.close()
    }
}

async function getChatList(userId){
    let mongoClient = await getMongoClient()
    try{
        let user = await getCollection(mongoClient,USERS)
            .findOne({_id: new ObjectId(userId)},{chats:1,_id:0})
        console.log(user)
        if (!user.chats){
            return []
        }
        let chats = user.chats.map(chat => {
            return {
                userId: chat.userId,
                name: chat.name,
            }
        })
        return Arrays.sort(chats,(a,b) => {
            return a.date > b.date
        })
    }finally{
        mongoClient.close()
    }
}

module.exports = {
    getChatId,
    sendMessage,
    getChatDetails,
    getChatList
}
