const { getCollection, USERS } = require("../db/mongo")
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
    let res = await getCollection(USERS).findOne({email:email})
    if (res){
        throw new Error("user with this email address already exists")
    }
    await getCollection(USERS).insertOne(user)
    return generateToken(user)
    
}

async function login(email, password){
    if (!(email && password)){
        throw new Error("Bad request!")
    }
    return new Promise((resolve,reject) => {
       getCollection(USERS).findOne({email:email})
            .then(user => {
                if (bcrypt.compareSync(password, user.password)){
                    resolve(generateToken(user))
                }else{
                    reject("Wrong password")
                }
            }).catch(err => {
                console.log(err)
                reject("user not found")  
            })
    })
}

module.exports = {
    signup,
    login
}