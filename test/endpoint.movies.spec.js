const knex= require('knex')
const helpers= require('./test-helpers')
const app= require('../src/app')
//const supertest = require('supertest')

describe('MOVIE ENDPOINT',()=>{
    //const {testMovies,testUsers,testReviews} = helpers.makeTestData()
    const testMovies= helpers.makeMoviesArray()
    let db;
    before('makeAuthHeader knex instance', () => {
        db = knex({
          client: 'pg',
          connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
      })
    
      after('disconnect from db', () => db.destroy())
      before('cleanup', () => helpers.cleanTables(db))
      afterEach('cleanup', () => helpers.cleanTables(db))

    describe('ENDPOINT /api/movies',()=>{
        context('Given no movies',()=>{
            it('respond 200 with an empty list',()=>{
                return supertest(app).get('/api/movies')
                .set('Authorization',`Basic ${process.env.API_TOKEN}`)
                .expect(200,[])
            })
        })
        context('GET all movies',()=>{
            beforeEach('Insert movies',()=>
                db('movies').insert(testMovies))
                //helpers.seedMoviesTables(db,testUsers,testMovies,testReviews))
            it('respond 200 with all movies',()=>{
                return supertest(app).get('/api/movies')
                .set('Authorization',`Basic ${process.env.API_TOKEN}`)
                .expect(200,testMovies)
            })
        })
        context.skip('POST a movie',()=>{

        })
    })
    describe('ENDPOINT /api/movies/:movieId',()=>{
        beforeEach('Insert movies',()=>
                db('movies').insert(testMovies))
        const path='/api/movies'
        const validId= 2
        const invalidId= 123456
        const expectedMovie= testMovies.find(movie=>movie.id===validId)
        const movieMethods=[
            {name:`GET movieId ${invalidId}`,http:supertest(app).get},
            {name:`DELETE movieId ${invalidId}`,http:supertest(app).delete},
            {name:`PATCH movieId ${invalidId}`,http:supertest(app).patch},
        ]
        context('Given movie does not exist',()=>{
            movieMethods.forEach(method=>{
                it(method.name,()=>{
                    return method.http(`${path}/${invalidId}`)
                    .set('Authorization',`Basic ${process.env.API_TOKEN}`)
                    .expect(404,{error:{
                        message: `Requested item doesn't exist`
                    }})
                })
            })
        })
        context('Given movie does exist',()=>{
            it('GET movie',()=>{
                return supertest(app).get(`/api/movies/${validId}`)
                .set('Authorization',`Basic ${process.env.API_TOKEN}`)
                .expect(200,expectedMovie)
            })
            it.skip('DELETE movie',()=>{
                const expectedMovie= testMovies.filter(movie=>movie.id!==validId)
                return supertest(app).delete(`/api/movies/${validId}`)
                .set('Authorization',`Basic ${process.env.API_TOKEN}`)
                .expect(204)
                .then(()=>{
                    return supertest(app).get(`/api/movies`)
                    .set('Authorization',`Basic ${process.env.API_TOKEN}`)
                    .expect(expectedMovie)
                })
            })
            describe.skip('PATCH movie',()=>{
                //const updatedMovie= {title,posterUrl,trailerUrl,summary,year,country,genres}
                it('respond 400 when no required field supplied',()=>{

                })
                it('respond 204 and update only a subset',()=>[

                ])
                it('respond 204 and update the movie',()=>{

                })
            })
        })
    })
    describe('ENDPOINT /api/movies/genres/:genres',()=>{
        beforeEach('Insert movies',()=>
                db('movies').insert(testMovies))
        const path='/api/movies/genres'
        const validGenres= 'Film'
        const invalidGenres= 'Invalid'
        const MovieList= testMovies.filter(movie=>movie.genres.includes(validGenres))
        it(`Given genres is invalid or not found`,()=>{
            return supertest(app).get(`${path}/${invalidGenres}`)
            .set('Authorization',`Basic ${process.env.API_TOKEN}`)
            .expect(404,{error:{
                message:`Movie not found`
            }})
        })
        it(`Given genres is valid and movies found`,()=>{
            return supertest(app).get(`${path}/${validGenres}`)
            .set('Authorization',`Basic ${process.env.API_TOKEN}`)
            .expect(200,MovieList)
        })
    })
})