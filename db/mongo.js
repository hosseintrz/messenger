const {MongoClient} = require('mongodb');
const { getConfig } = require('../config/config');

const url = getConfig('MONGO_URL');

async function getMongoClient(){
    var mongoClient = new MongoClient(url, {useNewUrlParser: true});
    mongoClient.connect().catch((err) => {
        throw new Error(err)
    })
    return mongoClient

}

module.exports = {
    getMongoClient
}