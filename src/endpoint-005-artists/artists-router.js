const express= require('express')

const xss= require('xss')
const bodyParser= express.json()
const path= require('path')
const {isWebUrl}= require('valid-url')

const {GeneralService}= require('../service/api-service')
const ArtistRouter= express.Router()
const ArtistService= require('./artists-service')

//MIDDLEWARE:
const {requireBasicAuth}= require('../middleware/require-auth')
const {checkItemExists}= require('../middleware/general-validation')

ArtistRouter.route('/')
.all(requireBasicAuth)
.get((req,res,next)=>{
    GeneralService.getAllItems(req.app.get('db'),'artists')
        .then(artists=>{
            return res.status(200).json(artists)
        })
        .catch(next)
})

ArtistRouter.route('/:id')
.all(requireBasicAuth)
.all((req,res,next)=>checkItemExists(req,res,next,'artists'))
.get((req,res)=>{
    res.json(res.item)
})

ArtistRouter.route('/:id/movies')
.all(requireBasicAuth)
.all((req,res,next)=>checkItemExists(req,res,next,'artists'))
.get((req,res,next)=>{
    ArtistService.getMovieByArtist(req.app.get('db'),req.params.id)
    .then(movies=>res.json(movies))
    .catch(next)
})

module.exports= ArtistRouter