const express= require('express')

const xss= require('xss')
const bodyParser= express.json()
const path= require('path')
const {isWebUrl}= require('valid-url')


const MovieService= require('./movies-service')
const movieRouter= express.Router()

//MIDDLEWARE:
const {requireBasicAuth}= require('../middleware/require-auth')
const {movieValidation}= require('../middleware/form-validation')

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

movieRouter.route('/')
    .all(requireBasicAuth)
    .get((req,res,next)=>{
        MovieService.getAllMovies(req.app.get('db'))
            .then(movies=>{
                return res.status(200).json(movies)
            })
            .catch(next)
    })
    .post(bodyParser,(req,res,next)=>{
        movieValidation(req,res,next)
        const newMovie= {title,posterUrl,trailerUrl,summary,year,country,genres}
        MovieService.insertMovie(req.app.get('db'),newMovie)
            .then(movie=>{
                res.status(201)
                .location(path.poxis.join(req.originalUrl,`/${movie.id}`))
                .json(sanitizedMovie(movie))
            })
        
    })
movieRouter.route('/:movieId')
    .all(requireBasicAuth)
    .all((req,res,next)=>{
        const {movieId}= req.params
        MovieService.getMovieById(req.app.get('db'),movieId)
            .then(movie=>{
                if(!movie) {
                    return res.status(404).json({error:{
                        message: `Movie not found`
                    }})
                }
                res.movie=movie
                next()
            })
            .catch(next)
    })
    .get((req,res)=>{
        res.json(sanitizedMovie(res.movie))
    })
    .delete((req,res,next)=>{
        const {id}=req.params
        MovieService.deleteMovie(req.app.get('db'),id)
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
        MovieService.updateMovie(knex, req.params.id, movieToUpdate)
        .then(()=>res.status(204).end())
        .catch(next)
    })

movieRouter.route('/genres/:genres')
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


module.exports= movieRouter