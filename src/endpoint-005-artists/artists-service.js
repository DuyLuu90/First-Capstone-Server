const ArtistService = {
    getMovieByArtist(db,artistId){
        return db.from(`movie_cast AS cast`)
        .select('cast.movieid','movies.title','movies.year')
        .where('cast.director',artistId)
        .orWhere('cast.actor_one',artistId)
        .orWhere('cast.actor_two',artistId)
        .join('movies','cast.movieid','movies.id')
        .orderBy('movies.year','desc')
    },
    
    insertArtist(db,item){
        return db.select('*')
        .then(artists=>{
            let nextid=Number(artists[artists.length-1].id)+1
            item.id= nextid
            return db('artists').insert(item)
        })
        .then(ar=>ar)
    }
    
}

module.exports= ArtistService