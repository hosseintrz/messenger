const { getCollection, USERS, CHATS } = require("../db/mongo")
var ObjectId = require('mongodb').ObjectId;

async function getChatId(user1, user2){
    if (!user1.groups || user1.groups.length == 0){
        throw new Error("user has no groups")
    }
    if(user1._id.toString() == user2._id.toString()){
        throw new Error("user can't chat with himself")
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
        last_updated: new Date().getTime(),
        messages:[]
    }
    let res = await getCollection(CHATS).insertOne(chat)
    await getCollection(USERS).updateOne({_id: user1._id}, {$addToSet: {chats: {chatId: res.insertedId, userId: user2._id.toString(), name:user2.name}}})
    await getCollection(USERS).updateOne({_id: user2._id}, {$addToSet: {chats: {chatId: res.insertedId, userId: user1._id.toString(), name:user1.name}}})
    return res.insertedId
}

async function sendMessage(user1_id, user2_id, message){
    let user1 = await getCollection(USERS).findOne({_id: new ObjectId(user1_id)})
    let user2 = await getCollection(USERS).findOne({_id: new ObjectId(user2_id)})
    let chatId = await getChatId(user1,user2)
    let time = new Date().getTime()
    await getCollection(CHATS).updateOne({_id: new ObjectId(chatId)}, 
        {
            $set: {last_updated: time}, 
            $addToSet: { messages: {
                    message: message,  
                    date: time,
                    sentby: user1.name,
                }
            }
        })
}

async function getChatDetails(user1_id, user2_id){
    let user1 = await getCollection(USERS).findOne({_id: new ObjectId(user1_id)})
    let user2 = await getCollection(USERS).findOne({_id: new ObjectId(user2_id)})
    let chatId = await getChatId(user1,user2)
    let pipeline = [
        {'$match': {_id: chatId}},
        
        //starting in mongo 5.2 for sorting members
        // { $set: {
        //     messages:{
        //         $sortArray:{
        //             input: '$messages',
        //             sortBy: {date : -1}
        //         }
        //     }
        // }}      
    ]
  
    let aggCur = await getCollection(CHATS).aggregate(pipeline)
    let docs = await aggCur.next()

    return docs.messages.sort((a,b) => {
        return b.date - a.date
    })
}

async function getChatList(userId){
    let user = await getCollection(USERS).findOne({_id: new ObjectId(userId)},{chats:1,_id:0})
    if (!user.chats){
        return []
    }
    let cur = await getCollection(CHATS).find({_id: {$in: user.chats.map(chat => chat.chatId)}},
        { sort: {last_updated: -1}, }
    )
    let chats = await cur.toArray()
    return chats.map(chat => {
        return {
            userId : user.chats.find(ch => ch.chatId.toString() == chat._id.toString()).userId,
            name : user.chats.find(ch => ch.chatId.toString() == chat._id.toString()).name
        }
    })
}

module.exports = {
    getChatId,
    sendMessage,
    getChatDetails,
    getChatList
}
