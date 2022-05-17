const jwt = require('jsonwebtoken')
const { getConfig } = require('../../config/config')

const secretKey = getConfig('JWT_SECRET')

let getUserWithoutPass = (user) => {
    const { password, ...userWithoutPassword} = user
    return userWithoutPassword
}

function generateToken(user){
    safeUser = getUserWithoutPass(user)
    safeUser.userId = user._id
    return jwt.sign(safeUser,secretKey,{expiresIn:'30s', algorithm:'HS256'})
}

module.exports = {
    generateToken
}