const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');
const { getConfig } = require('./config/config');
const authRouter = require('./routes/authRouter')
const groupRouter = require('./routes/groupRouter')
const joinRequestRouter = require('./routes/joinRequestRouter')

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

router.get('/test', (req,res) => {
    if(req.user){
        res.json(req.user)
    }else{
        res.send('test fail')
    }
})

router.use('/auth',authRouter)
router.use('/groups',groupRouter)
router.use('/join_requests',joinRequestRouter)



app.all('*',(req, res) => {
    res.status(404).send('<h1>error</h1>')
})

const port = 8080
app.listen(port , () => {
    console.log('server is running...')
})