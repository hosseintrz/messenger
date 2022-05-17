require('dotenv').config()

let getConfig = (name) => {
    return process.env[name]
}

module.exports = {
    getConfig
}