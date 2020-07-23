const bcrypt= require('bcryptjs')

function makeMoviesArray(){
    return [
        {
          id: 1,
          title: 'First test movie!',
          posterurl: 'http://placehold.it/500x500',
          trailerurl: 'http://placehold.it/500x500',
          country: 'United States',
          genres: ['Action'],
          year: 2020,
          last_modified: '2029-01-22T16:28:32.615Z',
          summary: 'test movie summary',
        },
        {
          id: 2,
          title: 'Second test movie!',
          posterurl: 'http://placehold.it/500x500',
          trailerurl: 'http://placehold.it/500x500',
          country: 'United States',
          genres: ['TV Series'],
          year: 2020,
          last_modified: '2029-01-22T16:28:32.615Z',
          summary: 'test movie summary',
        },
        {
          id: 3,
          title: 'Third test movie!',
          posterurl: 'http://placehold.it/500x500',
          trailerurl: 'http://placehold.it/500x500',
          country: 'United States',
          genres: ['Film'],
          year: 2020,
          last_modified: '2029-01-22T16:28:32.615Z',
          summary: 'test movie summary',
        },
        {
          id: 4,
          title: 'Fourth test movie!',
          posterurl: 'http://placehold.it/500x500',
          trailerurl: 'http://placehold.it/500x500',
          country: 'United States',
          genres: ['Action'],
          year: 2020,
          last_modified: '2029-01-22T16:28:32.615Z',
          summary: 'test movie summary',
        },
      ]
}

function makeUsersArray(){
    return [
        {
            id: 1,
            first_name:'test first name 1' ,
            last_name:'test last name 1' ,
            username:'test username 1' ,
            password: 'test password 1' ,
            age: 18 ,
            country:'United States' ,
            nickname: 'some nickname' ,
            gender: 'Male' ,
            block_list: false,
            last_modified: '2029-01-22T16:28:32.615Z'
        },
        {
            id: 2,
            first_name:'test first name 2' ,
            last_name:'test last name 2' ,
            username:'test username 2' ,
            password: 'test password 2' ,
            age: 18 ,
            country:'Japan' ,
            nickname: 'some nickname' ,
            gender: 'Female' ,
            block_list: false,
            last_modified: '2029-01-22T16:28:32.615Z'
        },
        {
            id: 3,
            first_name:'test first name 3' ,
            last_name:'test last name 3' ,
            username:'test username 3' ,
            password: 'test password 3' ,
            age: 18 ,
            country:'United States' ,
            nickname: 'some nickname' ,
            gender: 'Male' ,
            block_list: false,
            last_modified: '2029-01-22T16:28:32.615Z'
        },
    ]
}
/*
function makeReviewsArray(movies=[],users=[]){
    return [
        {
            id:1,
            movieId: movies[0].id,
            userId: users[0].id,
            comment: 'test comment',
            rating:3,upvote:3,downvote:3,
            date_submitted: '2029-01-22T16:28:32.615Z',
        },
        {
            id:2,
            movieId: movies[1].id,
            userId: users[1].id,
            comment: 'test comment',
            rating:3,upvote:3,downvote:3,
            date_submitted: '2029-01-22T16:28:32.615Z',
        },
        {
            id:3,
            movieId: movies[2].id,
            userId: users[2].id,
            comment: 'test comment',
            rating:3,upvote:3,downvote:3,
            date_submitted: '2029-01-22T16:28:32.615Z',
        }
    ]
}

function makeTestData(){
    const testMovies= makeMoviesArray()
    const testUsers= makeUsersArray()
    const testReviews= makeReviewsArray()
    return (testMovies,testUsers,testReviews)
}*/
/*
function seedUsers(db,users) {
    const preppedUsers= users.map(user=>({
        ...user,
        password: bcrypt.hashSync(user.password,1)
    }))
    return db.into('users').insert(preppedUsers)
        .then(()=>db.raw(
            `SELECT setval('users_id_seq',?)`,
            [users[users.length-1].id], //update the auto sequence to stay in sync
        ))
}*/

function seedMoviesTables(db,users=[],movies=[],reviews=[]){
    return db('users').insert(users)
        .then(()=>db('movies').insert(movies))
        .then(()=>reviews.length&& db('reviews').insert(reviews))
}

function cleanTables(db) {
    return db.raw(
        `TRUNCATE
            reports,
            movie_cast,
            artists,
            reviews,
            movies,
            users
        RESTART IDENTITY CASCADE`
    )
}



function makeAuthHeader(user) {
    const token = Buffer.from(`${user.user_name}:${user.password}`).toString(`base64`)
    return `Bearer ${token}`
}

module.exports= {
    makeMoviesArray,
    makeUsersArray,
    //makeTestData,
    seedMoviesTables,
    cleanTables,
    makeAuthHeader
}