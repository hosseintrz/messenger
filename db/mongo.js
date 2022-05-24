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

var db;

async function connectDB(){
    try{
        var mongoClient = new MongoClient(url, {useNewUrlParser: true});
        let client = await mongoClient.connect()
        db = client.db(MESSENGER)
        console.log("connected to mongo")
    }catch(err){
        console.log("Error connecting to mongo", err)
    }

}

// async function getMongoClient(){
//     var mongoClient = new MongoClient(url, {useNewUrlParser: true});
//     try{
//         return await mongoClient.connect()
//     }catch(err){
//         throw new Error(err)
//     }
// }

const getCollection = (collection) => {
    return db.collection(collection)
}

module.exports = {
    connectDB,
    MESSENGER,
    USERS,
    GROUPS,
    REQUESTS,
    CONN_REQUESTS,
    CHATS,
    getCollection
}