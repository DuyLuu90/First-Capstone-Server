const express = require('express')

const path= require('path')
const xss= require('xss')
const bodyParser= express.json()

const ReviewRouter= express.Router()
const ReviewService = require('./review-service')

//middleware

ReviewRouter
    .post('/',bodyParser,(req,res,next)=>{
        const {movieId,comment,userId,rating}= req.body
        const newReview= {movieId,comment,userId,rating}

        ReviewService.insertReview(req.app.get('db'),newReview)
            .then(review=>{
                res.status(201)
                .location(path.posix.join(req.originalUrl,`/${review.id}`))
                .json(review) 
            })

    })

ReviewRouter
    .post('/:reviewId',bodyParser,(req,res,next)=>{
        const {upvote,downvote,reply,report}= req.body
        const reviewAction= {upvote,downvote,comment,report}
    })

module.exports= ReviewRouter