const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');
const { getConfig } = require('./config/config');
const authRouter = require('./routes/authRouter')
const groupRouter = require('./routes/groupRouter')
const joinRequestRouter = require('./routes/joinRequestRouter')
const connRouter = require('./routes/connRouter');
const chatRouter = require('./routes/chatRouter');
const { MongoErrorLabel } = require('mongodb');
const { connectDB } = require('./db/mongo');


let userValidation = (req,res,next) => {
    nonSecurePaths = ['/auth/signup','/auth/login']
    if (nonSecurePaths.includes(req.path)) return next()
    if (req.user){
        next()
    }else{
        res.status(401).json({
            message: 'Unauthorized'
        })
    }
}


app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use((req,res,next) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === "JWT"){
        jwt.verify(req.headers.authorization.split(' ')[1],getConfig('JWT_SECRET'),
            {algorithms:['HS256']},(err,decoded) =>{
                if (err){
                    req.user = undefined
                }else{
                    req.user = decoded
                }
        })
    }else{
        req.user = undefined
    }
    next()
})

const router = express.Router()
app.use('/api/v1',router)

router.all("*",userValidation)

router.get('/test', (req,res) => {
    // if(req.user){
    //     res.json(req.user)
    // }else{
    //     res.send('test fail')
    // }
    res.json(req.user)
})

router.use('/auth',authRouter)
router.use('/groups',groupRouter)
router.use('/join_requests',joinRequestRouter)
router.use('/connection_requests',connRouter)
router.use('/chats',chatRouter)

app.all('*',(req, res) => {
    res.status(404).send('<h1>error</h1>')
})

const port = 8080

connectDB().then(() => {
    app.listen(port , () => {
        console.log('server is running...')
    })
})