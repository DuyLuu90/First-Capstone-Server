require('dotenv').config() // allow us to get access to variables inside the env file
const express= require('express')
const morgan= require('morgan') // midleware, used for logging request details
const cors = require('cors')
const helmet= require('helmet')
const {NODE_ENV,CLIENT_ORIGIN}= require('./config')

const MovieRouter= require('./endpoint-001-movies/movies-router')
const UserRouter= require('./endpoint-002-users/users-router')
const AuthRouter= require('./endpoint-003-auth/auth-router')
const ReviewRouter= require('./endpoint-004-reviews/review-router')
const ArtistRouter= require('./endpoint-005-artists/artists-router')

const app= express()
/*
const morganSetting=(NODE_ENV === 'production'? 'tiny': 'short')
app.use(morgan(morganSetting)) //combined vs common vs dev vs short vs tiny*/

//app.use(cors())
app.use(cors( {origin: CLIENT_ORIGIN} ))
app.use(helmet())

app.get('/',(req,res)=>res.send('abc'))
app.use('/api/movies',MovieRouter)
app.use('/api/users',UserRouter)
app.use('/api/auth',AuthRouter)
app.use('/api/reviews',ReviewRouter)
app.use('/api/artists',ArtistRouter)


//error handler middleware
app.use((error, req,res, next)=>{
    let response;
    if (NODE_ENV === 'production') {
        response= {error: {message: error.message}}
    }
    else response={message: error.message, error}
    res.status(500).json(response)
})



module.exports = app 