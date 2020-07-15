require('dotenv').config() // allow us to get access to variables inside the env file
const express= require('express')
const morgan= require('morgan') // midleware, used for logging request details
const cors = require('cors')
const helmet= require('helmet')
const {NODE_ENV}= require('./config')

const app= express()

const morganSetting=(NODE_ENV === 'production'? 'tiny': 'common')
app.use(morgan(morganSetting)) //combined vs common vs dev vs short vs tiny
app.use(cors())
app.use(helmet())

app.get('/', (req,res)=>{
    res.send("Hello, boilerplate")
})
//error handler middleware
app.use((error, req,res, next)=>{
    let response;
    if (NODE_ENV === 'production') {
        response= {error: {message: 'server error'}}
    }
    else response={message: error.message, error}
    res.status(500).json(response)
})



module.exports = app 