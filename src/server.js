const app= require('./app')
const {PORT} = require('./config')

/*
const db = knex({
  client: 'pg',
  connection: DB_URL,
})

app.set('db', db)
 */

app.listen(PORT, ()=> {
    console.log(`Server listening at http://localhost:${PORT}`)
})

/*
const bcrypt = require('bcryptjs')
bcrypt.hash('password', 12).then(hash=>console.log({hash}))*/