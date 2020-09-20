/*movie-router.js

MovieRouter.route('/:id/director')
    .all(requireBasicAuth)
    .all((req,res,next)=>checkItemExists(req,res,next,'movies'))
    .get((req,res,next)=>{
        MovieService.getMovieDirector(req.app.get('db'),req.params.id)
        .then(director=>res.status(200).json(director))
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
*/

/*movies-service.js

const artistFields=[
    'ar.id AS artist:id',
    'ar.full_name AS full_name'
]

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
 
*/