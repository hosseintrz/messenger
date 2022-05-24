const {MongoClient} = require('mongodb');
const { getConfig } = require('../config/config');

const
    MESSENGER = "messenger",
    USERS = "users",
    GROUPS = "groups",
    REQUESTS = "requests",
    CONN_REQUESTS = "conn_requests",
    CHATS = "chats"


const url = getConfig('MONGO_URL');

async function getMongoClient(){
    var mongoClient = new MongoClient(url, {useNewUrlParser: true});
    try{
        return await mongoClient.connect()
    }catch(err){
        throw new Error(err)
    }
}

const getCollection = (client, collectionName) => {
    return client.db(MESSENGER).collection(collectionName)
}

module.exports = {
    getMongoClient,
    MESSENGER,
    USERS,
    GROUPS,
    REQUESTS,
    CONN_REQUESTS,
    CHATS,
    getCollection
}