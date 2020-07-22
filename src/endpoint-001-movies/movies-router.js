const express= require('express')
const {requireAuth}= require('../middleware/basic-auth')

const path= require('path')
const {isWebUrl}= require('valid-url')
const xss= require('xss')
const bodyParser= express.json()

const MovieService= require('./movies-service')
const { post } = require('../app')
const movieRouter= express.Router()

const sanitizedMovie= movie=>({
    id: movie.id,
    title: xss(movie.title),
    posterUrl: movie.posterUrl,
    trailerUrl: movie.trailerUrl,
    summary: xss(movie.summary),
    year: Number(movie.year),
    country: movie.country,
    genres: movie.genres
})

movieRouter.route('/')
    .all(requireAuth)
    .get((req,res,next)=>{
        MovieService.getAllMovies(req.app.get('db'))
            .then(movies=>{
                return res.status(200).json(movies)
            })
            .catch(next)
    })
    .post(bodyParser,(req,res,next)=>{
        const{title,posterUrl,trailerUrl,summary,year,country,genres}= req.body
        const newMovie= {title,posterUrl,trailerUrl,summary,year,country,genres}
        for (const field of ['title','year','country','genres']) {
            if (!req.body[field]) {
                return res.status(400).send(`${field} is required`)
            }
            if(!Number.isInteger(year)||year<1980) {
                return res.status(400).send('Movie must be newer than 1980')
            }
            MovieService.insertMovie(req.app.get('db'),newMovie)
                .then(movie=>{
                    res.status(201)
                    .location(path.poxis.join(req.originalUrl,`/${movie.id}`))
                    .json(sanitizedMovie(movie))
                })
        } 
    })
movieRouter.route('/:movieId')
    .all(requireAuth)
    .all((req,res,next)=>{
        const {id}= req.params
        MovieService.getMovieById(req.app.get('db'),id)
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

movieRouter.route('/:genres')
    .all(requireAuth)
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