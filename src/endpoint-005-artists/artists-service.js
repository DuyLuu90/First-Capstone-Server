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
        return db.into('artists').insert(item)
        .returning('*').then(rows=>{
            db.raw(
                `SELECT setval('artists_id_seq',?)`,
                [rows[rows.length-1].id])
            return rows[0]
        })
       
    }
    
}

module.exports= ArtistService