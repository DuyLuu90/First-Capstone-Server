const knex= require('knex')
const helpers= require('./test-helpers')
const app= require('../src/app')
const supertest = require('supertest')

describe('MOVIE ENDPOINT',()=>{
    //const {testMovies,testUsers,testReviews} = helpers.makeTestData()
    const testMovies= helpers.makeMoviesArray()
    let db;
    before('makeAuthHeader knex instance', () => {
        db = knex({
          client: 'pg',
          connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
      })
    
      after('disconnect from db', () => db.destroy())
      before('cleanup', () => helpers.cleanTables(db))
      afterEach('cleanup', () => helpers.cleanTables(db))

    describe('GET /api/movies',()=>{
        context('Given no movies',()=>{
            it('respond 200 with an empty list',()=>{
                return supertest(app).get('/api/movies')
                .set('Authorization',`Basic ${process.env.API_TOKEN}`)
                .expect(200,[])
            })
        })
        context('Given there are movies',()=>{
            beforeEach('Insert movies',()=>
                db('movies').insert(testMovies))
                //helpers.seedMoviesTables(db,testUsers,testMovies,testReviews))
            it('respond 200 with all movies',()=>{
                return supertest(app).get('/api/movies')
                .set('Authorization',`Basic ${process.env.API_TOKEN}`)
                .expect(200,testMovies)
            })
        })
    })
    describe.skip('GET /api/movies/:movieId',()=>{

    })
    describe.skip('GET /api/movies/:genres',()=>{

    })
})