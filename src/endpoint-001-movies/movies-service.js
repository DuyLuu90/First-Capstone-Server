const xss= require('xss')
const Treeize = require('treeize')
//const Knex = require('knex')


const MovieService = {
    getAllMovies(db) {
        return db('movies').select('*')
    },
    getMovieByGenres(db,genres){
        return db('movies').select('*').then(movies=>{
            return movies.filter(movie=>movie.genres.includes(genres))
        })   
    },
    getMovieById(db,id){
        return db('movies').where({id}).first()
    },
    getReviewsForMovie(db,movieid){
        return db
        .from('reviews AS rev')
        .select('rev.id','rev.rating','rev.comment','rev.date_submitted',
            ...userFields,
        )
        .where('rev.movieid',movieid)
        .leftJoin('users AS usr','rev.userid','usr.id',)
        .groupBy('rev.id', 'usr.id')
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

const userFields = [
    'usr.id AS user:id',
    'usr.username AS user:username',
    'usr.first_name AS user:first_name',
    'usr.last_name AS user:last_name',
]

module.exports= MovieService