module.exports= {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',

    API_BASE_URL: process.env.API_BASE_URL || "http://localhost:8000/api",
    
    
    DATABASE_URL: process.env.DATABASE_URL || "postgresql://Duy:vn2910@localhost/Dramapedia",
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || "postgresql://Duy:vn2910@localhost/Dramapedia_test",

    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN,
    JWT_SECRET: process.env.JWT_SECRET || `change-this-secret`,
    JWT_EXPIRY: process.env.JWT_EXPIRY || '20s'
}

