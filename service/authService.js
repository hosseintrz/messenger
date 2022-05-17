const { getMongoClient } = require("../db/mongo")
const { generateToken } = require('./jwt/jwtService')
const bcrypt = require('bcrypt')


async function signup(name , email, password){
    if (!(name && email && password)){
        throw new Error("Bad request!")
    }
    var user = {
        name:name,
        email:email,
        password:bcrypt.hashSync(password,10)
    }
    mongoClient = await getMongoClient()
    return new Promise((resolve, reject) => {
        mongoClient.db("messenger").collection("users").insertOne(user)
        .then(() => {
            resolve(generateToken(user))
        }).catch(err => {
            reject(err)
        }).finally(() => {
            mongoClient.close()
        })
    })

}

async function login(email, password){
    if (!(email && password)){
        throw new Error("Bad request!")
    }
    mongoClient = await getMongoClient()
    return new Promise((resolve,reject) => {
        mongoClient.db("messenger").collection("users").findOne({email:email})
            .then(user => {
                if (bcrypt.compareSync(password, user.password)){
                    resolve(generateToken(user))
                }else{
                    reject("Wrong password")
                }
            }).catch(err => {
                console.log(err)
                reject("user not found")  
            }).finally(() => {
                mongoClient.close()
            })
    })
}

module.exports = {
    signup,
    login
}