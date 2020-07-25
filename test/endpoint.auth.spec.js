const knex= require('knex')
const helpers= require('./test-helpers')
const app= require('../src/app')

describe.skip('AUTH ENDPOINT',()=>{
    const testUsers= helpers.makeUsersArray()
    const testUser= testUsers[0]
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

    describe(`POST api/auth/login`,()=>{
        beforeEach('Insert users',()=>{
            db('users').insert(testUsers)
        })
        
    })
})