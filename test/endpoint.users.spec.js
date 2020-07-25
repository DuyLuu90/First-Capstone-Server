const knex= require('knex')
const helpers= require('./test-helpers')
const app= require('../src/app')

//const supertest = require('supertest')

describe('USERS ENDPOINT',()=>{
    //const {testMovies,testUsers,testReviews} = helpers.makeTestData()
    const testUsers= helpers.makeUsersArray()
    const testUser= testUsers[0]
    let db;
    before('make knex instance', () => {
        db = knex({
          client: 'pg',
          connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
      })
    
    after('disconnect from db', () => db.destroy())
    before('cleanup', () => helpers.cleanTables(db))
    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`ENDPOINT /api/users`,()=>{
        context(`Given no user`,()=>{
            
        })
        context(`Given there are users`,()=>{
            beforeEach('Insert users',()=>{
                db('users').insert(testUsers)
            })
            it('GET all users',()=>{

            })
            it('POST a user',()=>{
                const newUser= {
                    first_name: "Alex", last_name: "Wang", 
                    username: "aw1990", password: "11AAaa!!",
                    age: 18, country: "CN", gender: "male"
                }
                return supertest(app).post(`/api/users`)
                    .send(newUser)
                    .expect(201)
                    .expect(res=>{
                        expect(res.body).to.have.property('id')
                        expect(res.body).to.have.property('last_modified')
                        expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
                    })
                    .expect(res=>db('users').select('*').where({id: res.body.id}).first()
                        .then(row=>{
                            expect(row.username).to.eql(newUser.username)
                        }))
            })
        })
    })
    describe(`ENDPOINT /api/users/:userId`,()=>{

    })

})