const express = require('express')

const path= require('path')
const xss= require('xss')
const bodyParser= express.json()

const ReviewRouter= express.Router()
const ReviewService = require('./review-service')

//middleware
const {requireBasicAuth}= require('../middleware/require-auth')

ReviewRouter
    .all(requireBasicAuth)
    .post('/',bodyParser,(req,res,next)=>{
        const {movieid,comment,userid,rating}= req.body
        const newReview= {movieid,comment,userid,rating}

        ReviewService.insertReview(req.app.get('db'),newReview)
            .then(review=>{
                res.status(201)
                .location(path.posix.join(req.originalUrl,`/${review.id}`))
                .json(review) 
            })

    })

ReviewRouter
    .all(requireBasicAuth)
    .post('/:reviewId',bodyParser,(req,res,next)=>{
        const {upvote,downvote,reply,report}= req.body
        const reviewAction= {upvote,downvote,comment,report}
    })

module.exports= ReviewRouter