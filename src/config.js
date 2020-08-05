module.exports= {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    API_BASE_URL: (process.env.NODE_ENV==='production')
                ?  process.env.REACT_APP_API_BASE_URL || "https://secure-caverns-32891.herokuapp.com/api"
                : "http://localhost:8000/api", 
    
    DATABASE_URL: (process.env.NODE_ENV==='production')
                ? process.env.DATABASE_URL 
                : process.env.LOCAL_DATABASE_URL,
            
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL,

    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:3000",

    JWT_SECRET: process.env.JWT_SECRET || `change-this-secret`,
    JWT_EXPIRY: process.env.JWT_EXPIRY || '20s'
}

