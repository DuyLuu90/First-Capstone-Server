const knex= require('knex')
const {prepareTest,expected,tools} = require('./test-helpers')
const app= require('../src/app')
const bcrypt = require('bcryptjs')
const supertest = require('supertest')

describe('USERS ENDPOINT',()=>{
    const {testMovies,testUsers,testArtists,testReviews,testCasts}= prepareTest.getData()
    const data= {testMovies,testUsers,testArtists,testReviews,testCasts}
    const testUser= testUsers[0]

    let db;
    before('make knex instance', () => {
        db = knex({
          client: 'pg',
          connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })
    
    after('disconnect from db', () => db.destroy())
    before('cleanup', () => prepareTest.cleanTables(db))
    afterEach('cleanup', () => prepareTest.cleanTables(db))

    describe(`ENDPOINT /api/users`,()=>{
        context(`Given no user`,()=>{
            it('respond 200 with an empty list',()=>{
                return supertest(app).get('/api/users')
                .set('Authorization',`Basic ${process.env.API_TOKEN}`)
                .expect(200,[])
            })    
        })
        context(`Given there are users`,()=>{
            
            beforeEach('Insert users',()=>
                //db('users').insert(testUsers)
                prepareTest.seedTables(db,data)
            )
            it('GET all users',()=>{
                return supertest(app).get('/api/users')
                .set('Authorization',`Basic ${process.env.API_TOKEN}`)
                .expect(200,testUsers)
            })
            it.only('POST a user',()=>{
                const newUser= tools.makeNewUser()
                return supertest(app).post(`/api/users`)
                    .send(newUser)
                    .expect(201)
                    .expect(res=>{
                        console.log('Line 50',res.body, res.headers)
                        expect(res.body).to.have.property('id')
                        expect(res.body).to.have.property('last_modified')
                        expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
                    })
                    .expect(res=>db('users').select('*').where({id: res.body.id}).first()
                        .then(row=>{
                            expect(row.username).to.eql(newUser.username)
                            const expectedDate=new Date().toLocaleString('en',{timeZone:'America/Phoenix'})
                            const actualDate= new Date(row.last_modified).toLocaleString()
                            expect(actualDate).to.eql(expectedDate)   
                            return bcrypt.compare(newUser.password,row.password)
                                .then(compareMatch=>{
                                expect(compareMatch).to.be.true
                            })
                        }))
                        
            })
        })
    })

    describe(`ENDPOINT /api/users/:userId`,()=>{
        beforeEach('Insert movies',()=>prepareTest.seedTables(db,data))
        const path=`/api/users`
        const validId= 2
        const invalidId=123456
        const expectedUser= testUsers.find(user=>user.id===validId)
        const userMethods=[
            {name:`GET userid ${invalidId}`,http:supertest(app).get},
            {name:`DELETE userid ${invalidId}`,http:supertest(app).delete},
            {name:`PATCH userid ${invalidId}`,http:supertest(app).patch},
        ]
        context(`Given user doesn't exist`,()=>{
            userMethods.forEach(method=>{
                it(method.name,()=>{
                    return method.http(`${path}/${invalidId}`)
                    .set('Authorization',`Basic ${process.env.API_TOKEN}`)
                    .expect(404,{error:{
                        message: `Requested item doesn't exist`
                    }})
                })
            })
        })
        context('Given user exist',()=>{
            it(`GET user details`,()=>{
                return supertest(app).get(`/api/users/${validId}`)
                .set('Authorization',`Basic ${process.env.API_TOKEN}`)
                .expect(200,expectedUser)
            })
            it(`DELETE user`,()=>{
                const expectedUser=testUsers.filter(user=>user.id!==validId)
                return supertest(app).delete(`/api/users/${validId}`)
                .set('Authorization',`Basic ${process.env.API_TOKEN}`)
                .expect(204)
                .then(()=>{
                    supertest(app).get(`api/users`)
                    .set('Authorization',`Basic ${process.env.API_TOKEN}`)
                    .expect(expectedUser)
                })
            })
            it(`UPDATE user details`,()=>{
                /*
                const userToUpDate= testUsers.find(user=>user.id===validId)
                const fieldToUpdate= {username: newUserName}*/
            })
        })
    })
})