const knex= require('knex')
const {prepareTest,expected} = require('./test-helpers')
const app= require('../src/app')

describe('MOVIE ENDPOINT',()=>{
    const {testMovies,testUsers,testArtists,testReviews,testCasts}= prepareTest.getData()
    const data= {testMovies,testUsers,testArtists,testReviews,testCasts}
    
    let db;
    before('makeAuthHeader knex instance', () => {
        db = knex({
          client: 'pg',
          connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })
    
    after('disconnect from db', () => db.destroy())
    before('cleanup', () => prepareTest.cleanTables(db))
    afterEach('cleanup', () => prepareTest.cleanTables(db))

    describe('ENDPOINT /api/movies',()=>{
        context('Given no movies',()=>{
            it('respond 200 with an empty list',()=>{
                return supertest(app).get('/api/movies')
                .set('Authorization',`Basic ${process.env.API_TOKEN}`)
                .expect(200,[])
            })
        })
        context('GET all movies',()=>{
            beforeEach('Insert movies',()=>prepareTest.seedTables(db,data))
            it('respond 200 with all movies',()=>{
                return supertest(app).get('/api/movies')
                .set('Authorization',`Basic ${process.env.API_TOKEN}`)
                .expect(200,testMovies)
            })
        })
        context.skip('POST a movie',()=>{
            beforeEach('Insert movies',()=>prepareTest.seedTables(db,data))
        })
    })
    describe('ENDPOINT /api/movies/:movieId',()=>{
        beforeEach('Insert movies',()=>prepareTest.seedTables(db,data))
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
            it('GET movie details',()=>{
                return supertest(app).get(`/api/movies/${validId}`)
                .set('Authorization',`Basic ${process.env.API_TOKEN}`)
                .expect(200,expectedMovie)
            })
            it('GET movie review',()=>{
                const expectedReviews= expected.movieReviews(testUsers,testReviews,validId)
                return supertest(app).get(`/api/movies/${validId}/reviews`)
                .set('Authorization',`Basic ${process.env.API_TOKEN}`)
                .expect(200,expectedReviews)
            })
            it('GET movie cast',()=>{
                const expectedCast=expected.movieCast(testArtists,testCasts,validId)
                return supertest(app).get(`/api/movies/${validId}/cast`)
                .set('Authorization',`Basic ${process.env.API_TOKEN}`)
                .expect(200,expectedCast)
            })
            it('GET movie director',()=>{
                const expectedCast=expected.movieDirector(testArtists,testCasts,validId)
                return supertest(app).get(`/api/movies/${validId}/director`)
                .set('Authorization',`Basic ${process.env.API_TOKEN}`)
                .expect(200,expectedCast)
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
    describe('SORT MOVIES',()=>{
        beforeEach('Insert movies',()=>prepareTest.seedTables(db,data))
        const genres= {path:'/api/movies/genres',name:'Sort by invalid genres'}
        const country={path:'/api/movies/country',name:'Sort by invalid country'}
        
        context('Given sort is invalid',()=>{
            [genres,country].forEach(sort=>{
                it(sort.name,()=>{
                    return supertest(app).get(`${sort.path}/invalid`)
                    .set('Authorization',`Basic ${process.env.API_TOKEN}`)
                    .expect(404,{error:{
                        message:`Movie not found`
                    }})
                })
            })
        })
        context('Given sort is valid',()=>{
            it('Sort by genres',()=>{
                const validGenres= 'Film'
                const MovieList= testMovies.filter(movie=>movie.genres.includes(validGenres))
                return supertest(app).get(`${genres.path}/${validGenres}`)
                    .set('Authorization',`Basic ${process.env.API_TOKEN}`)
                    .expect(200,MovieList)
            })
            it('Sort by country',()=>{
                const validCountry= 'United States'
                const MovieList= testMovies.filter(movie=>movie.country===validCountry)
                return supertest(app).get(`${country.path}/${validCountry}`)
                    .set('Authorization',`Basic ${process.env.API_TOKEN}`)
                    .expect(200,MovieList)
            })
        })
        
        
    })
    
})