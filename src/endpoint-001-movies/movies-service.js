const MovieService = {
    getMovieByGenres(db,genres){
        return db('movies').select('*').then(movies=>{
            return movies.filter(movie=>movie.genres.includes(genres))
        })   
    },
    getMovieByCountry(db,country){
        return db('movies').select('*').where('movies.country',country)
        .orderBy('movies.year','desc')
    },
    getMovieCast(db,movieid){
        return db.from(`movie_cast AS cast`)
        .select('cast.id',...artistFields)
        .where('cast.movieid',movieid)
        .innerJoin('artists AS ar',function(){
            this
                .on('cast.actor_one','ar.id')
                .orOn('cast.actor_two','ar.id')
        }) 
    },
    getMovieDirector(db,movieid){
        return db.from(`movie_cast AS cast`)
        .select('cast.id',...artistFields)
        .where('cast.movieid',movieid)
        .innerJoin('artists AS ar',function(){
            this.on('cast.director','ar.id')
        }) 
    },
    updateMovieCast(db,movieid,fieldsToUpdate){
        return db.from('movie_cast').where({movieid})
            .then(()=>db('movie_cast').where({movieid}).update(fieldsToUpdate))
            .catch(()=>{
                const data= {...fieldsToUpdate, movieid:movieid}
                return db.insert(data).into('movie_cast').returning('*').then(rows=>rows[0])
            })
    },
    /*
    getReviewsForMovie(db,movieid){
        return db
        .from('reviews AS rev')
        .select('rev.id','rev.rating','rev.comment','rev.date_submitted','rev.upvote','rev.downvote',
            ...userFields,
        )
        .where('rev.movieid',movieid)
        .leftJoin('users AS usr','rev.userid','usr.id',)
        .groupBy('rev.id', 'usr.id')
    },*/
}
const artistFields=[
    'ar.id AS artist:id',
    'ar.full_name AS full_name'
]

module.exports= MovieService