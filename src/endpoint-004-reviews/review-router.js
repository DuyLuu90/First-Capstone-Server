const express = require('express')
const path= require('path')
const xss= require('xss')
const bodyParser= express.json()

const ReviewRouter= express.Router()
//const ReviewService = require('./review-service')
const {GeneralService}= require('../service/api-service')

//middleware
const {requireBasicAuth}= require('../middleware/require-auth')
const {checkItemExists}= require('../middleware/general-validation')

ReviewRouter
    .all(requireBasicAuth)
    .post('/',bodyParser,(req,res,next)=>{
        //res.set('Access-Control-Allow-Origin','*')
        const {movieid,comment,userid,rating}= req.body
        const newReview= {movieid,comment,userid,rating}

        GeneralService.insertItem(req.app.get('db'),'reviews',newReview)
            .then(review=>{
                res.status(201)
                .location(path.posix.join(req.originalUrl,`/${review.id}`))
                .json(review) 
            })

    })

ReviewRouter.route('/:id')
    .all(requireBasicAuth)
    .all((req,res,next)=>checkItemExists(req,res,next,'reviews'))
    .get((req,res,next)=>{
        res.json(res.item)
    })
    .delete((req,res,next)=>{
        GeneralService.deleteItem(req.app.get('db'),'reviews',req.params.id)
        .then(()=>res.status(204).end())
        .catch(next)
    })
    .patch(bodyParser,(req,res,next)=>{
        const {upvote,downvote,replies,report}= req.body
        const reviewUpdate= {upvote,downvote,replies,report}

        GeneralService.updateItem(req.app.get('db'),'reviews',req.params.id,reviewUpdate)
        .then(()=>res.status(204).end())
        .catch(next)
    })

module.exports= ReviewRouter