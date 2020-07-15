#To create content for a file: 
    echo <content> > <fileName>
    export <key> = <value>
    echo $<key> (print out the <value>)

#Project boilerplate:
    https://github.com/DuyLuu90/express-boilerplate 
    git clone <CLONE-URL> <name> && cd $_ && -rf .git && git init
    npm i knex pg postgrator-cli uuid uuidv4 valid-url winston xss
    D dependencies: mocha, chai,suptertest,nodemon

    ./package.json-- "script":
        "migrate": "postgrator --config postgrator-config.js",
        "migrate:test": "env NODE_ENV=test npm run migrate",

    ./postgrator-config.js:
        require('dotenv').config();
        module.exports = {
        "migrationDirectory": "migrations",
        "driver": "pg",
        "connectionString": (process.env.NODE_ENV === 'test')
            ? process.env.TEST_DB_URL
            : process.env.DB_URL,
        }
    ./Procfile:
        web: node src/server.js

    ./.env:
        DB_URL, TEST_DB_URL, JWT_SECRET
    

#To set up an app:
    require('dotenv').config() <allow us to get access to variables inside the env file>
    const express= require('express')
    const morgan= require('morgan') <midleware, used for logging request details>
    const app=express(); <top level function, give us access to other express object>
    const cors = require('cors') <to allow cross-origin-sharing-resources>
    const helmet= require('helmet') <a module in express, used to hide info from attackers>

#MIDDLEWARES:
    const morganSetting=process.env.NODE_ENV === 'production'? 'tiny': 'common'
    app.use(morgan(morganSetting)) <combined vs common vs dev vs short vs tiny>
    app.use(helmet()) <helmet should be used before cors>
    app.use(cors())
    ->Authorization <only respond when given a valid Authorization header with a Bearer API token value>
    ->Error-handling <when a middleware has a list of 4 params, express knows to treat this as error handler. It is used to print a more user-friendly error in production.>

#APP OBJ:
    To set: app.set(property,value)
    To read: aoo.get(property)

#SERVICE OBJ: 
    use for db transactions, then wire up API endpoints with PostgreSQL in an express app
    allgns with these best practices: DRY,SOC, increase modularization and encapsulation
    Create-Read-Update-Delete / Insert-Select-Update-Delete/ Post-Get-Patch(Put)-Delete
    
#ROUTER OBJ:
    In <router.js>:
        require express,service file
        const Router = express.Router()
        const bodyParser = express.json()
        Router.route().get().post()
        modules.export = Router
    In <app.js>:
        require router
        app.use(router)

#REQUEST:
    .baseUrl .hostName .path .query 

#RESPONSE:
    .location(<URL>): access to the obj
    .toLocaleString(): date without milliseconds
    .end()

#ORGANIZE SERVER:
    1. layering(vertical)
    2. modularizing (horizontal)

#DEPLOYMENT STEPS:
    ->hide secret
    ->respect env PORT
    ->use minimal logging
    ->remove console logs
    ->hide sensitive server err message
    ->change API token
    ->make a Proclife: the file that Heroku look for to determine how to start the server Then in package.json, add "engines": {"node": "12.16.1"}
    ->audit our packages

#HEROKU: 
https://git.heroku.com/arcane-inlet-06429.git
https://arcane-inlet-06429.herokuapp.com/ 
heroku login-> git push heroku master -> heroku ps:scale web=1 -> heroku open
    1. read the files->find the <package.json>->setup env variables
    2. see Node version->install dependencies, ignore devDependencies
    3. read the <Procfile>
#Setup env variables:
    heroku config:set <key>=<value>

#BEST PRACTICES:
    Using CONTINUOUS INTEGRATION(CI) SERVICES
    Having multiple hosted env
    
#DRY TECHNIQUES:
    Missing required fields TEST (for posting item)
        const requiredFields = [field1,field2,field3]
        requiredFields.forEach(field=>{
            const newItem= {field1,field2,field3}
            it(`responds with 400 and an error message when '${field}' is missing, ()=>{
                delete newItem[field]
                return supertest(app).post(<endPoint>)
                .expect(400,{error:{<errorMessage>}})
            })
        })
    Missing required fields ROUTER (for posting items)
        const newItem= {key1,key2,key3}
        for (const [key,value] of Object.entries(newItem)) {
            if (value==null) res.status(400).json({error:{<errorMessage>}})
        }