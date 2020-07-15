const app = require('../src/app')

describe('', ()=>{
    it('',()=>{
        return supertest(app)
        .get('/').expect(200,'Hello, boilerplate')
    })
})