const bcrypt= require('bcryptjs')

const makeTables= {
    movies(){
        return [
            {   id: 1,
                title: 'First test movie!',
                posterurl: 'http://placehold.it/500x500',
                trailerurl: 'http://placehold.it/500x500',
                country: 'United States',genres: ['Action'], year: 2020,
                last_modified: '2029-01-22T16:28:32.615Z',
                summary: 'test movie summary'  },
    
            {   id: 2,
                title: 'Second test movie!',
                posterurl: 'http://placehold.it/500x500',
                trailerurl: 'http://placehold.it/500x500',
                country: 'United States',genres: ['TV Series'],year: 2020,
                last_modified: '2029-01-22T16:28:32.615Z',
                summary: 'test movie summary'  },
    
            {   id: 3,
                title: 'Third test movie!',
                posterurl: 'http://placehold.it/500x500',
                trailerurl: 'http://placehold.it/500x500',
                country: 'Japan',genres: ['Film'], year: 2020,
                last_modified: '2029-01-22T16:28:32.615Z',
                summary: 'test movie summary' },
              
            {   id: 4,
                title: 'Fourth test movie!',
                posterurl: 'http://placehold.it/500x500',
                trailerurl: 'http://placehold.it/500x500',
                country: 'China',genres: ['Action'],year: 2020,
                last_modified: '2029-01-22T16:28:32.615Z',
                summary: 'test movie summary'   },
        ]
    },
    users(){
        return [
            {   id: 1,
                first_name:'firstName',last_name:'lastName' ,
                username:'testusername1',password: 'testPassword1' ,
                age: 18 ,country:'US',gender: 'Male' ,
                block_list: false,
                last_modified: '2029-01-22T16:28:32.615Z'    },
    
            {   id: 2,
                first_name:'firstName',last_name:'lastName' ,
                username:'userName2' ,password: 'testPassword2' ,
                age: 18 ,country:'JP' ,gender: 'Female' ,
                block_list: false,
                last_modified: '2029-01-22T16:28:32.615Z'  },
    
            {   id: 3,
                first_name:'firstName' ,last_name:'lastName' ,
                username:'userName3' ,password: 'testPassword3' ,
                age: 18 ,country:'VN' ,gender: 'Male' ,
                block_list: false,
                last_modified: '2029-01-22T16:28:32.615Z'   },
        ]
    },
    artists(){
        return [
            {   id: 1,  full_name: "Zen Gesner",
                "title": "Actor","avatar": "http://placehold.it/500x500",
                "birth_year": 1970,"country": "US"},
    
            {   id: 2,  full_name: "Jacqueline Collen",
                "title": "Actress","avatar": "http://placehold.it/500x500",
                "birth_year": 1968,"country": "US"},
    
            {   id: 3,  full_name: "Wolfgang Petersen",
                "title": "Director","avatar": "http://placehold.it/500x500",
                "birth_year": 1941,"country": "US" },
        ]
    },
    reviews(movies,users){
        return [
            {   id:1,
                movieid: movies[0].id,
                userid: users[0].id,
                comment: 'test comment',
                rating:3,upvote:3,downvote:3,
                date_submitted: '2029-01-22T16:28:32.615Z', },
    
            {   id:2,
                movieid: movies[1].id,
                userid: users[1].id,
                comment: 'test comment',
                rating:3,upvote:3,downvote:3,
                date_submitted: '2029-01-22T16:28:32.615Z', },
    
            {   id:3,
                movieid: movies[2].id,
                userid: users[2].id,
                comment: 'test comment',
                rating:3,upvote:3,downvote:3,
                date_submitted: '2029-01-22T16:28:32.615Z',  }
        ]
    },
    movie_cast(movies,ar){
        return [
            {id:1,movieid:movies[0].id,director:ar[0].id,actor_one:ar[1].id,actor_two:ar[2].id},
            {id:2,movieid:movies[1].id,director:ar[1].id,actor_one:ar[2].id,actor_two:ar[0].id},
            {id:3,movieid:movies[2].id,director:ar[2].id,actor_one:ar[0].id,actor_two:ar[1].id},
        ]
    }
}
const prepareTest={
    getData(){
        const testMovies= makeTables.movies()
        const testUsers= makeTables.users()
        const testArtists=makeTables.artists()
        const testReviews= makeTables.reviews(testMovies,testUsers)
        const testCasts= makeTables.movie_cast(testMovies,testArtists)

        return {testMovies,testUsers,testArtists,testReviews,testCasts}
    },
    seedTables(db,data){
        const {testMovies,testUsers,testArtists,testReviews,testCasts}= data
        return db('users').insert(testUsers)
        .then(()=>db('artists').insert(testArtists))
        .then(()=>db('movies').insert(testMovies))
        .then(()=>db('movie_cast').insert(testCasts))
        .then(()=>testReviews.length && db('reviews').insert(testReviews))
    },
    seedUsers(db,users){
        const preppedUsers= users.map(user=>({
            ...user,
            password: bcrypt.hashSync(user.password,1)
        }))
        return db.into('users').insert(preppedUsers)
            .then(()=>db.raw(
                `SELECT setval('users_seq',?)`,
                [users[users.length-1].id], //update the auto sequence to stay in sync
            ))
    },
    cleanTables(db){
        return db.raw(
            `TRUNCATE
                reports,
                movie_cast,
                reviews,
                artists,
                movies,
                users
            RESTART idENTITY CASCADE`
        )
    }
}
const expected= {
    movieReviews(users,reviews,movieid){
        const expectedREviews= reviews.filter(review=>review.movieid===movieid)
        return expectedREviews.map(review=>{
            const reviewUser= users.find(user=>user.id===review.userid)
            return {
                id: review.id,
                rating: review.rating,
                comment: review.comment,
                date_submitted: review.date_submitted,
                'user:id' : reviewUser.id,
                'user:username': reviewUser.username,
                'user:first_name': reviewUser.first_name,
                'user:last_name': reviewUser.last_name,
            }
        })
    },
    movieCast(artists,movie_cast=[],movieid){
        const cast=movie_cast.find(cast=>cast.movieid===movieid)
        let array= [cast.actor_two,cast.actor_one]
        
        const results= array.map(id=>{
            const artist= artists.find(ar=>ar.id===id)
            return {"id": movieid,"artist:id": id,"full_name": artist.full_name}
        })
        return results   
    },
    movieDirector(artists,movie_cast=[],movieid){
        const cast=movie_cast.find(cast=>cast.movieid===movieid)
        let array= [cast.director]
        
        const results= array.map(id=>{
            const artist= artists.find(ar=>ar.id===id)
            return {"id": movieid,"artist:id": id,"full_name": artist.full_name}
        })
        return results   
    },
    
}
const tools={
    calculateAvgReviewRating(reviews){
        if(!reviews.length) return 0
        const sum= reviews.map(review=>review.rating).reduce((a,b)=>a+b)
        return Math.round(sum/reviews.length)
    },
    makeAuthHeader(user){
        const token = Buffer.from(`${user.user_name}:${user.password}`).toString(`base64`)
        return `Bearer ${token}`
    }
}
/*
function makeMoviesArray(){   
}
function makeUsersArray(){   
}
function makeArtistsArray(){  
}
function makeReviewsArray(movies=[],users=[]){  
}
function makeMovieCastArray(movies=[],ar=[]){
}
function makeExpectedMovieReviews(users,reviews,movieid,){
}
function makeExpectedMovieCast(artists,movieid,movie_cast=[]){ 
}
function makeTestData(){
}
function seedUsers(db,users) {
}
function seedMoviesTables(db,users=[],movies=[],reviews=[]){   
}
function cleanTables(db) { 
}
function calculateAvgReviewRating(reviews){   
}
*/

module.exports= {makeTables,prepareTest,expected,tools}