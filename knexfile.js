module.exports= {
    production: {
        client: 'pg',
        // The next line is where the application will read that environment variable to connect to the database
        connection: process.env.DATABASE_URL,
        migrations: {
            directory: __dirname + '/knex/migrations',
        },
        seeds: {
            directory: __dirname + '/knex/seeds',
        },
    },
}