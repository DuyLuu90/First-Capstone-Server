const express = require('express')
const MovieService = require('./movie-service')
//const {requireAuth}= require('../middleware/basic-auth')

const movieRouter= express.Router()

movieRouter.route('/')
    .get((req,res,next)=>{

    })

movieRouter.route('/:listName')
    .get((req,res,next)=>{
            
    })

movieRouter.route('/:movieId')
    .get((req,res,next)=>{
            
    })

async function checkMovieExists(req,res,next) {
    try {
        const movie= await MovieService.getMovieById(
            req.app.get('db'),
            req.params.movieId
        )
        if (!movie) return res.status(400).json({
            error: `Movie doesn't exist`
        })
        res.movie= movie
        next()
    }
    catch(error) {
        next(error)
    }
}

module.exports= movieRouter