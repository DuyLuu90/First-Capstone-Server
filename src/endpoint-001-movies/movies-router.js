const express= require('express')

const xss= require('xss')
const bodyParser= express.json()
const path= require('path')
const {isWebUrl}= require('valid-url')

const {GeneralService}= require('../service/api-service')
const MovieService= require('./movies-service')
const MovieRouter= express.Router()

//MIDDLEWARE:
const {requireBasicAuth}= require('../middleware/require-auth')
const {movieValidation}= require('../middleware/form-validation')
const {checkItemExists}= require('../middleware/general-validation')

const sanitizedMovie= movie=>({
    id: movie.id,
    title: xss(movie.title),
    posterurl: movie.posterurl,
    trailerurl: movie.trailerurl,
    summary: xss(movie.summary),
    year: Number(movie.year),
    country: movie.country,
    genres: movie.genres,
    last_modified: movie.last_modified,
})

MovieRouter.route('/')
    .all(requireBasicAuth)
    .get((req,res,next)=>{
        GeneralService.getAllItems(req.app.get('db'),'movies')
            .then(movies=>{
                return res.status(200).json(movies)
            })
            .catch(next)
    })
    .post(bodyParser,(req,res,next)=>{
        movieValidation(req,res,next)
        const newMovie= {title,posterUrl,trailerUrl,summary,year,country,genres}
        GeneralService.insertItem(req.app.get('db'),'movies',newMovie)
            .then(movie=>{
                res.status(201)
                .location(path.poxis.join(req.originalUrl,`/${movie.id}`))
                .json(sanitizedMovie(movie))
            })
        
    })
MovieRouter.route('/:id')
    .all(requireBasicAuth)
    .all((req,res,next)=>checkItemExists(req,res,next,'movies'))
    .get((req,res)=>{
        res.json(sanitizedMovie(res.item))
    })
    .delete((req,res,next)=>{
        const {id}=req.params
        GeneralService.deleteItem(req.app.get('db'),'movies',id)
        .then(()=>res.status(204).end())
        .catch(next)
    })
    .patch(bodyParser,(req,res,next)=>{
        const{title,posterUrl,trailerUrl,summary,year,country,genres}= req.body
        const movieToUpdate= {title,posterUrl,trailerUrl,summary,year,country,genres}
        const knex= req.app.get('db')

        const numberofValues= Object.values(movieToUpdate).filter(Boolean).length
        if(numberofValues===0) {
            return res.status(400).json({error:{
                message: `Req body does not contain any field to update`
            }})
        }
        GeneralService.updateItem(knex,'movies',req.params.id, movieToUpdate)
        .then(()=>res.status(204).end())
        .catch(next)
    })

MovieRouter.route('/:id/cast')
    .all(requireBasicAuth)
    .all((req,res,next)=>checkItemExists(req,res,next,'movies'))
    .get((req,res,next)=>{
        MovieService.getMovieCast(req.app.get('db'),req.params.id)
        .then(cast=>res.status(200).json(cast))
        .catch(next)
    })
MovieRouter.route('/:id/director')
    .all(requireBasicAuth)
    .all((req,res,next)=>checkItemExists(req,res,next,'movies'))
    .get((req,res,next)=>{
        MovieService.getMovieDirector(req.app.get('db'),req.params.id)
        .then(director=>res.status(200).json(director))
        .catch(next)
})

MovieRouter.route('/:id/reviews')
    .all(requireBasicAuth)
    .all((req,res,next)=>checkItemExists(req,res,next,'movies'))
    .get((req,res,next)=>{
        MovieService.getReviewsForMovie(req.app.get('db'),req.params.id)
        .then(reviews=>res.status(200).json(reviews))
        .catch(next)
    })

MovieRouter.route('/genres/:genres')
    .all(requireBasicAuth)
    .get((req,res,next)=>{
        const {genres}= req.params
        MovieService.getMovieByGenres(req.app.get('db'),genres)
            .then(movies=>{
                if(movies.length===0) {
                    return res.status(404).json({error:{
                        message:`Movie not found`
                    }})
                }
                res.status(200).json(movies)
                next()
            })
            .catch(next)
    })
    MovieRouter.route('/country/:country')
    .all(requireBasicAuth)
    .get((req,res,next)=>{
        const {country}= req.params
        MovieService.getMovieByCountry(req.app.get('db'),country)
            .then(movies=>{
                if(movies.length===0) {
                    return res.status(404).json({error:{
                        message:`Movie not found`
                    }})
                }
                res.status(200).json(movies)
                next()
            })
            .catch(next)
    })

MovieRouter.route('/test')
    .get((req,res,next)=>{
        res.json('this is a test')
    })

module.exports= MovieRouter