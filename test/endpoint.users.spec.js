const knex= require('knex')
const helpers= require('./test-helpers')
const app= require('../src/app')
const supertest = require('supertest')
//const supertest = require('supertest')

describe('USERS ENDPOINT',()=>{
    //const {testMovies,testUsers,testReviews} = helpers.makeTestData()
    const testUsers= helpers.makeUsersArray()
    const currentUser= testUsers[0]
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

    describe('POST /api/users',()=>{
        context('User validation',()=>{
            beforeEach('Insert users',()=>{
                db('users').insert(testUsers)
            })
            const requiredFields=['first_name', 'last_name', 'username', 'password']
            requiredFields.forEach(field=>{
                const registerAttemptBody= {
                    first_name: 'test first name', last_name: 'test last name', 
                    username:'test username', password:'test password',
                }
                it(`responds 400 when ${field} is missing`,()=>{
                    delete registerAttemptBody[field]
                    return supertest(app).post('/api/users')
                        .send(registerAttemptBody)
                        .expect(400,{
                            error: `Missing ${field} in req body`
                        })
                })
            })
            
            it.only(`respond 400 when first_name or last_name contains invalid letters`,()=>{
                const userWithInvalidName={
                    first_name: 'first@name', last_name: 'last!name', 
                    username: 'newRandomUnser', password: '11AAaa!!'
                }
                return supertest(app).post('/api/users')
                    .send(userWithInvalidName)
                    .expect(400,{
                        error: `Names must contain only valid letters`
                    })
            })

            it.only(`respond 400 when password less than 8 characters`,()=>{
                const userShortPassword={
                    first_name: 'test first name', last_name: 'test last name', 
                    username:'test username',
                    password: 'aA1!',
                }
                return supertest(app).post('/api/users')
                    .send(userShortPassword)
                    .expect(400,{error:'Password must be longer than 8 characters'})
            })
            it(`respond 400 when password longer than 72 characters`,()=>{
                const userLongPassword={
                    first_name: 'test first name', last_name: 'test last name', 
                    username:'test username',
                    password: '*'.repeat(73),
                }
                return supertest(app).post('/api/users')
                    .send(userLongPassword)
                    .expect(400,{error:'Password must be shorter than 72 characters'})
            })
            it(`respond 400 when password starts with spaces`,()=>{
                const userPasswordStartsSpaces={
                    first_name: 'test first name', last_name: 'test last name', 
                    username:'test username',
                    password: ' aA1!aA1!',
                }
                return supertest(app).post('/api/users')
                    .send(userPasswordStartsSpaces)
                    .expect(400,{error:'Password must not start or end with empty spaces'})
            })
            it(`respond 400 when password ends with spaces`,()=>{
                const userPasswordEndsSpaces={
                    first_name: 'test first name', last_name: 'test last name', 
                    username:'test username',
                    password: 'aA1!aA1! ',
                }
                return supertest(app).post('/api/users')
                    .send(userPasswordEndsSpaces)
                    .expect(400,{error:'Password must not start or end with empty spaces'})
            })
            it(`respond 400 error when password isn't complex enough`,()=>{
                const userPasswordNotComplex={
                    first_name: 'test first name', last_name: 'test last name', 
                    username:'test username',
                    password: 'abcdefghi',
                }
                return supertest(app).post('/api/users')
                    .send(userPasswordNotComplex)
                    .expect(400,{error:'Password must contain 1 upper case,lower case,number and special character'})
            })
            it(`respond 400 when username is not unique`,()=>{
                const duplicateUser={
                    first_name: 'test first name', last_name: 'test last name', 
                    username: currentUser.username, password: '11AAaa!!'
                }
                return supertest(app).post('/api/users')
                .send(duplicateUser)
                .expect(400,{error:`Username already taken`})
            })
        })
    })
})