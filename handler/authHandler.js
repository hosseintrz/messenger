const authService = require('../service/authService')

async function signup(req, res){
    let {name,email,password} = req.body
    //console.log(req)
    authService.signup(name, email, password).then(jwt => {
        res.status(200).json({
            token: jwt,
            message : "successful"
        })
    }).catch(err => {
        res.status(400).json({
            message: err.message
        })
    })
}

async function login(req, res){
    let {email, password} = req.body
    authService.login(email, password)
        .then(jwt => {
            res.status(200).json({
                token : jwt,
                message : "successful"
            })
        }).catch(err => {
            res.status(400).json({
                message: err
            })
        })
}

module.exports = {
    signup, 
    login
}