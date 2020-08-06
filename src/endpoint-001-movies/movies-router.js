const express= require('express')
const path= require('path')

const xss= require('xss')
const bodyParser= express.json()
const {isWebUrl}= require('valid-url')

const {GeneralService}= require('../service/api-service')
const MovieService= require('./movies-service')
const MovieRouter= express.Router()

//MIDDLEWARE:
const {requireBasicAuth}= require('../middleware/require-auth')
const {movieValidation}= require('../middleware/form-validation')
const {checkItemExists}= require('../middleware/general-validation')
const { json } = require('express')

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
        const errorMessage= movieValidation(req,res,next)
        if(errorMessage) {
            return res.status(400).json({error: errorMessage})
        }
        const {title,posterurl,trailerurl,summary,year,country,genres}= req.body
        const newMovie= {title,posterurl,trailerurl,summary,year,country,genres}
        GeneralService.insertItem(req.app.get('db'),'movies',newMovie)
            .then(movie=>{
                res.status(201).location(path.posix.join(req.originalUrl,`/${movie.id}`))
                .json(sanitizedMovie(movie))
            })
            .catch(next)
        
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
        .then(()=>res.status(200).json('Movie has been deleted'))
        .catch(next)
    })
    .patch(bodyParser,(req,res,next)=>{
        const{title,published,posterurl,trailerurl,summary,year,country,genres}= req.body
        const movieToUpdate= {title,published,posterurl,trailerurl,summary,year,country,genres}
        const knex= req.app.get('db')

        const numberofValues= Object.values(movieToUpdate).filter(Boolean).length
        if(numberofValues===0) {
            return res.status(400).json({error:{
                message: `Req body does not contain any field to update`
            }})
        }
        GeneralService.updateItem(knex,'movies',req.params.id, movieToUpdate)
        .then(()=>res.status(200).json('req sent successfully'))
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
    .post(bodyParser,(req,res,next)=>{
        const {movieid,director,actor_one,actor_two}= req.body
        const newCast= {movieid,director,actor_one,actor_two}
        GeneralService.insertItem(req.app.get('db'),'movie_cast',newCast)
            .then(cast=>json(cast))
            .catch(next)
    })
    .patch(bodyParser,(req,res,next)=>{
        const {director,actor_one,actor_two}= req.body
        const updatedCast= {director,actor_one,actor_two}
        MovieService.updateMovieCast(req.app.get('db'),req.params.id,updatedCast)
            .then(()=>res.status(200).json('req sent successfully'))
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

MovieRouter.route('/reviews/:id')
    .all(requireBasicAuth)
    .all((req,res,next)=>checkItemExists(req,res,next,'reviews'))
    .delete((req,res,next)=>{
        const {id}=req.params
        GeneralService.deleteItem(req.app.get('db'),'reviews',id)
        .then(()=>res.status(200).json('Review has been deleted'))
        .catch(next)
    })
    .patch(bodyParser,(req,res,next)=>{
        const {comment,rating,upvote,downvote}= req.body
        const updatedReview= {comment,rating,upvote,downvote}
        for (const key of ['comment','rating','upvote','downvote']){
            if (updatedReview[key]==='') delete updatedReview[key]
        }
        GeneralService.updateItem(req.app.get('db'),'reviews',req.params.id,updatedReview)
            .then(()=>res.status(200).json('req sent successfully'))
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

module.exports= MovieRouter