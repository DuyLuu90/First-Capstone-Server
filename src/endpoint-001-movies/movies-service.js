const xss= require('xss')
const Treeize = require('treeize')
const Knex = require('knex')


const MovieService = {
    getAllMovies(db) {
        return db('movies').select('*')  
    },
    getMovieById(db,id){
        return db('movies').where({id}).first()
    },
    getMovieByGenres(db,genres){
        return db('movies').where(genres in {genres})
    },
    insertMovie(db,newMovie){
        return db.insert(newMovie).into('movies')
            .returing('*').then(rows=>rows[0])
    },
    deleteMovie(db,id){
        return db('movies').where({id}).delete()
    },
    updateMovie(db,id,fieldsToUpdate){
        return db('movies').where({id}).update(fieldsToUpdate)
    }
}

module.exports= MovieService